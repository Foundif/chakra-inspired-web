import { ReactNode, useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save } from "lucide-react";
import MediaUpload from "@/components/admin/MediaUpload";
import RichEditor from "@/components/admin/RichEditor";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Option = { value: string; label: string };
type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "boolean" | "image" | "select" | "rich";
  placeholder?: string;
  options?: Option[];
  optionsTable?: { table: string; valueKey: string; labelKey: string };
};

type Props = {
  title: string;
  description?: string;
  table: string;
  fields: Field[];
  orderBy?: string;
  defaults?: Record<string, any>;
  topBanner?: ReactNode;
};

const EditorForm = ({ editing, setEditing, fields, optsCache, table, save, onCancel, hideHeader }: any) => (
  <>
    {!hideHeader && <h2 className="font-display text-xl font-extrabold">{editing.id ? "Edit" : "New entry"}</h2>}
    {fields.map((f: Field) => (
      <div key={f.key}>
        <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{f.label}</label>
        {f.type === "textarea" ? (
          <textarea rows={3} value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none" placeholder={f.placeholder} />
        ) : f.type === "boolean" ? (
          <div className="mt-2"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!editing[f.key]} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })} /> <span className="text-sm">Enabled</span></label></div>
        ) : f.type === "image" ? (
          <MediaUpload value={editing[f.key] ?? ""} onChange={(url) => setEditing({ ...editing, [f.key]: url })} folder={table} />
        ) : f.type === "rich" ? (
          <RichEditor value={editing[f.key] ?? ""} onChange={(html) => setEditing({ ...editing, [f.key]: html })} folder={table} />
        ) : f.type === "select" ? (
          <select value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value || null })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">— none —</option>
            {(f.options ?? optsCache[f.key] ?? []).map((o: Option) => (<option key={o.value} value={o.value}>{o.label}</option>))}
          </select>
        ) : (
          <input type={f.type === "number" ? "number" : f.type || "text"} value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: f.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder={f.placeholder} />
        )}
      </div>
    ))}
    <div className="flex gap-2 pt-2 sticky bottom-0 bg-background py-2 -mx-4 px-4 border-t border-border lg:static lg:border-0 lg:mx-0 lg:px-0 lg:py-0">
      <button onClick={save} className="btn-orange flex-1 justify-center"><Save size={16} /> Save</button>
      <button onClick={onCancel} className="px-4 py-2 rounded-full border border-border font-semibold">Cancel</button>
    </div>
  </>
);

const CrudPage = ({ title, description, table, fields, orderBy = "sort_order", defaults = {}, topBanner }: Props) => {
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [optsCache, setOptsCache] = useState<Record<string, Option[]>>({});
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from(table as any).select("*").order(orderBy as any, { ascending: true });
    setRows(data ?? []);
  };
  useEffect(() => {
    load();
    const ch = supabase.channel(`crud_${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table]);

  useEffect(() => {
    fields.forEach(async (f) => {
      if (f.optionsTable && !optsCache[f.key]) {
        const { data } = await supabase.from(f.optionsTable.table as any).select("*");
        const opts = (data ?? []).map((d: any) => ({ value: d[f.optionsTable!.valueKey], label: d[f.optionsTable!.labelKey] }));
        setOptsCache((s) => ({ ...s, [f.key]: opts }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const newRow = () => setEditing({ ...defaults });

  const save = async () => {
    const payload: any = { ...editing };
    delete payload.created_at; delete payload.updated_at;
    const { error } = editing.id
      ? await supabase.from(table as any).update(payload).eq("id", editing.id)
      : await supabase.from(table as any).insert(payload);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
    setEditing(null);
    load();
  };
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete;
    setPendingDelete(null);
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Deleted" });
    load();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold">{title}</h1>
          {description && <p className="text-muted-foreground text-sm md:text-base">{description}</p>}
        </div>
        <button onClick={newRow} className="btn-orange"><Plus size={16} /> Add new</button>
      </div>

      {topBanner && <div className="mb-6">{topBanner}</div>}

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase">
                <tr>{fields.slice(0, 3).map((f) => <th key={f.key} className="text-left p-3 whitespace-nowrap">{f.label}</th>)}<th></th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} onClick={() => setEditing(r)} className={`border-t border-border cursor-pointer hover:bg-secondary/40 ${editing?.id === r.id ? "bg-orange/5" : ""}`}>
                    {fields.slice(0, 3).map((f) => (
                      <td key={f.key} className="p-3 truncate max-w-[200px]">
                        {f.type === "image" && r[f.key] ? <img src={r[f.key]} alt="" className="w-12 h-12 object-cover rounded" /> :
                         f.type === "boolean" ? (r[f.key] ? "✓" : "—") :
                         String(r[f.key] ?? "—")}
                      </td>
                    ))}
                    <td className="p-3 text-right"><button onClick={(e) => { e.stopPropagation(); setPendingDelete(r.id); }} className="text-muted-foreground hover:text-orange"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={fields.length + 1} className="p-8 text-center text-muted-foreground">Nothing yet — click Add new.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Desktop side editor */}
        <div className="hidden lg:block lg:col-span-2">
          {editing ? (
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-6 space-y-4">
              <EditorForm editing={editing} setEditing={setEditing} fields={fields} optsCache={optsCache} table={table} save={save} onCancel={() => setEditing(null)} />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">Select an entry or add new.</div>
          )}
        </div>
      </div>

      {/* Mobile/tablet fullscreen editor */}
      {editing && (
        <div className="lg:hidden fixed inset-0 z-[80] flex flex-col bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
            <h2 className="font-display text-lg font-extrabold">{editing.id ? "Edit" : "New entry"}</h2>
            <button onClick={() => setEditing(null)} aria-label="Close" className="w-9 h-9 grid place-items-center rounded-lg hover:bg-secondary text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
            <EditorForm editing={editing} setEditing={setEditing} fields={fields} optsCache={optsCache} table={table} save={save} onCancel={() => setEditing(null)} hideHeader />
          </div>
        </div>
      )}


      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
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

export default CrudPage;