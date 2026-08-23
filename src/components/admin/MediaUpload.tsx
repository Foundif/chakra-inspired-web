import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

type Props = {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
};

const MediaUpload = ({ value, onChange, folder = "uploads" }: Props) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast({ title: "Image files only", variant: "destructive" });
    if (file.size > 8 * 1024 * 1024) return toast({ title: "Max 8MB", variant: "destructive" });
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
    if (error) {
      setBusy(false);
      return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
    toast({ title: "Uploaded" });
  };

  return (
    <div className="mt-1 space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary/40 text-sm font-semibold hover:bg-secondary disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-orange">
            <X size={12} /> Remove
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
      />
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs"
      />
      {value && <img src={value} alt="" className="max-h-32 rounded-lg border border-border" />}
    </div>
  );
};

export default MediaUpload;