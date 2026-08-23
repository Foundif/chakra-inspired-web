import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GripVertical, Trash2, Plus, Save, Eye, EyeOff } from "lucide-react";
import BulkImageUpload from "@/components/admin/BulkImageUpload";
import MediaUpload from "@/components/admin/MediaUpload";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Row = {
  id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  size_class: string | null;
  is_active: boolean;
  sort_order: number;
};

const GalleryAdmin = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data as Row[]) ?? []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("gallery_admin_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const persistOrder = async (next: Row[]) => {
    setRows(next);
    // batch update sort_order
    await Promise.all(
      next.map((r, i) =>
        r.sort_order === i ? null : supabase.from("gallery_images").update({ sort_order: i }).eq("id", r.id),
      ),
    );
  };

  const onDragStart = (id: string) => setDragId(id);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const next = [...rows];
    const fromIdx = next.findIndex((r) => r.id === dragId);
    const toIdx = next.findIndex((r) => r.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setDragId(null);
    persistOrder(next.map((r, i) => ({ ...r, sort_order: i })));
  };

  const toggleActive = async (r: Row) => {
    await supabase.from("gallery_images").update({ is_active: !r.is_active }).eq("id", r.id);
  };

  const save = async () => {
    if (!editing) return;
    const payload: any = { ...editing };
    delete payload.created_at; delete payload.updated_at;
    const { error } = editing.id
      ? await supabase.from("gallery_images").update(payload).eq("id", editing.id)
      : await supabase.from("gallery_images").insert(payload);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete;
    setPendingDelete(null);
    await supabase.from("gallery_images").delete().eq("id", id);
    toast({ title: "Deleted" });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold">Gallery</h1>
          <p className="text-muted-foreground text-sm md:text-base">Drag the handle to reorder. Bulk upload, edit, hide or delete.</p>
        </div>
        <button
          onClick={() => setEditing({ id: "", image_url: "", alt_text: "", caption: "", size_class: "", is_active: true, sort_order: rows.length } as Row)}
          className="btn-orange"
        >
          <Plus size={16} /> Add new
        </button>
      </div>

      <div className="mb-6">
        <BulkImageUpload
          folder="gallery_images"
          label="Bulk upload gallery images"
          onUploaded={async (url, file) => {
            await supabase.from("gallery_images").insert({
              image_url: url,
              alt_text: file.name.replace(/\.[^.]+$/, ""),
              is_active: true,
              sort_order: rows.length,
            });
          }}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {rows.map((r) => (
            <div
              key={r.id}
              draggable
              onDragStart={() => onDragStart(r.id)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(r.id)}
              className={`relative rounded-xl overflow-hidden border bg-card group ${dragId === r.id ? "opacity-50" : ""} ${editing?.id === r.id ? "ring-2 ring-orange" : "border-border"}`}
            >
              <button
                onClick={() => setEditing(r)}
                className="block w-full aspect-square"
              >
                <img src={r.image_url} alt={r.alt_text ?? ""} className={`w-full h-full object-cover ${!r.is_active ? "grayscale opacity-50" : ""}`} />
              </button>
              <div className="absolute top-1 left-1 flex items-center gap-1">
                <span className="cursor-grab active:cursor-grabbing bg-white/90 backdrop-blur rounded p-1">
                  <GripVertical size={14} className="text-foreground" />
                </span>
              </div>
              <div className="absolute top-1 right-1 flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleActive(r); }}
                  className="bg-white/90 backdrop-blur rounded p-1 hover:bg-white"
                  title={r.is_active ? "Hide" : "Show"}
                >
                  {r.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setPendingDelete(r.id); }}
                  className="bg-white/90 backdrop-blur rounded p-1 hover:bg-orange hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] px-2 py-1 truncate">
                {r.alt_text || r.caption || "Untitled"}
              </div>
            </div>
          ))}
          {!rows.length && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              No images yet — bulk upload above or click Add new.
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {editing ? (
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-6 space-y-4">
              <h2 className="font-display text-xl font-extrabold">{editing.id ? "Edit image" : "New image"}</h2>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Image</label>
                <MediaUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="gallery_images" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Alt text</label>
                <input value={editing.alt_text ?? ""} onChange={(e) => setEditing({ ...editing, alt_text: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Caption</label>
                <input value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Size class</label>
                <input value={editing.size_class ?? ""} onChange={(e) => setEditing({ ...editing, size_class: e.target.value })} placeholder="e.g. row-span-2" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="btn-orange flex-1 justify-center"><Save size={16} /> Save</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full border border-border font-semibold">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">Click an image to edit, or drag the handle to reorder.</div>
          )}
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-orange hover:bg-orange/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default GalleryAdmin;
