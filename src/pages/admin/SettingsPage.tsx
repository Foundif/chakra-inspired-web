import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MediaUpload from "@/components/admin/MediaUpload";

const FIELDS: { key: string; label: string; type?: string; help?: string }[] = [
  { key: "company_name", label: "Company name" },
  { key: "tagline", label: "Tagline" },
  { key: "logo_url", label: "Logo image URL", help: "Upload below or paste a URL. Square or wide images work best (recommended ≤ 200px tall)." },
  { key: "phone_primary", label: "Primary phone (display)" },
  { key: "phone_secondary", label: "Secondary phone (display)" },
  { key: "whatsapp_number", label: "WhatsApp number", help: "Digits only with country code, e.g. 919025296776" },
  { key: "email", label: "Email" },
  { key: "address_line1", label: "Address line 1" },
  { key: "address_line2", label: "Address line 2" },
  { key: "city", label: "City / state / pincode" },
  { key: "gstin", label: "GSTIN" },
  { key: "indiamart_url", label: "IndiaMART URL", type: "url" },
  { key: "google_maps_url", label: "Google Maps URL", type: "url" },
  { key: "instagram_url", label: "Instagram URL", type: "url" },
  { key: "facebook_url", label: "Facebook URL", type: "url" },
  { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
];

const SettingsPage = () => {
  const [s, setS] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  useEffect(() => { supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setS(data)); }, []);

  if (!s) return <AdminLayout><div className="text-muted-foreground">Loading…</div></AdminLayout>;

  const save = async () => {
    setBusy(true);
    const payload = { ...s }; delete payload.id; delete payload.updated_at;
    const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
    setBusy(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Settings saved", description: "Public site updates in real-time." });
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-extrabold mb-1">Settings</h1>
      <p className="text-muted-foreground mb-6">All values reflect on the public site instantly.</p>
      <div className="bg-card rounded-2xl border border-border p-6 grid md:grid-cols-2 gap-5">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === "tagline" || f.key.startsWith("address") ? "md:col-span-2" : ""}>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{f.label}</label>
            {f.key === "logo_url" ? (
              <MediaUpload value={s[f.key]} onChange={(url) => setS({ ...s, [f.key]: url })} folder="logo" />
            ) : (
              <input type={f.type || "text"} value={s[f.key] ?? ""} onChange={(e) => setS({ ...s, [f.key]: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
            )}
            {f.help && <p className="text-xs text-muted-foreground mt-1">{f.help}</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button disabled={busy} onClick={save} className="btn-orange">{busy ? "Saving…" : "Save changes"}</button>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;