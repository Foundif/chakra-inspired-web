import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";

type Props = {
  /** Storage folder under the "media" bucket */
  folder?: string;
  /** Called after every successful upload with the public URL */
  onUploaded: (url: string, file: File) => Promise<void> | void;
  label?: string;
};

const BulkImageUpload = ({ folder = "uploads", onUploaded, label = "Bulk upload images" }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  const upload = async (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) return toast({ title: "No images selected", variant: "destructive" });
    setBusy(true);
    setProgress({ done: 0, total: imgs.length });
    let ok = 0; let fail = 0;
    for (const file of imgs) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", contentType: file.type });
      if (error) { fail++; }
      else {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        try { await onUploaded(data.publicUrl, file); ok++; } catch { fail++; }
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    setBusy(false);
    toast({ title: `Uploaded ${ok}${fail ? ` · ${fail} failed` : ""}` });
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); upload(Array.from(e.dataTransfer.files)); }}
      className={`rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${dragging ? "border-orange bg-orange/5" : "border-border bg-secondary/30"}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-orange/10 text-orange grid place-items-center">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
        </div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">Drag & drop, or</div>
        <button type="button" disabled={busy} onClick={() => ref.current?.click()}
          className="btn-orange text-sm py-2 px-4 disabled:opacity-50">
          {busy ? `Uploading ${progress.done}/${progress.total}…` : "Choose files"}
        </button>
        <input ref={ref} type="file" multiple accept="image/*" hidden
          onChange={(e) => { const fs = Array.from(e.target.files ?? []); if (fs.length) upload(fs); e.target.value = ""; }} />
      </div>
    </div>
  );
};

export default BulkImageUpload;
