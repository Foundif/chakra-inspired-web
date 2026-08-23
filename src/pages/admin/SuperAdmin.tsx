import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Rocket, Bell, Power } from "lucide-react";

const SuperAdmin = () => {
  const { user, isSuperAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [s, setS] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setS(data));
    if (user && !isSuperAdmin) {
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "super_admin")
        .then(({ count }) => setCanClaim((count ?? 0) === 0));
    }
  }, [user, isSuperAdmin]);

  if (loading) return <AdminLayout><div className="text-muted-foreground">Loading…</div></AdminLayout>;
  if (!user) return <Navigate to="/admin/auth" replace />;

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-8 text-center">
          <ShieldCheck className="mx-auto text-orange mb-4" size={40} />
          <h1 className="font-display text-2xl font-extrabold mb-2">Super Admin Area</h1>
          <p className="text-muted-foreground mb-6">
            {canClaim
              ? "No super admin has been set up yet. Claim this role to control maintenance mode and renewal alerts."
              : "Your account doesn't have super admin access. Contact the platform owner."}
          </p>
          {canClaim && (
            <button
              disabled={claiming}
              onClick={async () => {
                setClaiming(true);
                const { error } = await (supabase as any).rpc("claim_super_admin");
                if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); setClaiming(false); }
                else { toast({ title: "You are now Super Admin" }); setTimeout(() => window.location.reload(), 500); }
              }}
              className="btn-orange"
            >{claiming ? "Granting…" : "Claim Super Admin"}</button>
          )}
        </div>
      </AdminLayout>
    );
  }

  if (!s) return <AdminLayout><div className="text-muted-foreground">Loading…</div></AdminLayout>;

  const save = async () => {
    setBusy(true);
    const payload = { ...s }; delete payload.id; delete payload.updated_at;
    const { error } = await supabase.from("platform_settings").update(payload).eq("id", 1);
    setBusy(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Saved", description: "Platform settings updated." });
  };

  const toLocalDT = (iso: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    const off = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - off).toISOString().slice(0, 16);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-1">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange to-amber-500 text-white text-xs font-bold uppercase tracking-wider">
          <ShieldCheck size={14} /> Super Admin
        </span>
      </div>
      <h1 className="font-display text-3xl font-extrabold mb-1">Platform Control</h1>
      <p className="text-muted-foreground mb-6">Only the platform owner can see and change these settings.</p>

      {/* Maintenance Mode */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange grid place-items-center"><Rocket size={20} /></div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-extrabold">Maintenance / Launching Soon</h2>
            <p className="text-sm text-muted-foreground">When enabled, visitors see a countdown page until the launch time. Confetti fires at zero.</p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={s.maintenance_enabled}
              onChange={(e) => setS({ ...s, maintenance_enabled: e.target.checked })} />
            <div className="w-12 h-7 bg-secondary rounded-full peer-checked:bg-orange relative transition-colors">
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${s.maintenance_enabled ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-semibold">{s.maintenance_enabled ? "ON" : "OFF"}</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Launch date & time</label>
            <input type="datetime-local" value={toLocalDT(s.launch_at)}
              onChange={(e) => setS({ ...s, launch_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Page title</label>
            <input type="text" value={s.maintenance_title ?? ""}
              onChange={(e) => setS({ ...s, maintenance_title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Message</label>
            <textarea rows={3} value={s.maintenance_message ?? ""}
              onChange={(e) => setS({ ...s, maintenance_message: e.target.value })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
        </div>
      </div>

      {/* Renewal Alerts */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center"><Bell size={20} /></div>
          <div>
            <h2 className="font-display text-xl font-extrabold">Renewal Alerts</h2>
            <p className="text-sm text-muted-foreground">Shown as a banner inside the client's admin panel when renewal is due within 30 days.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Hosting renewal due</label>
            <input type="date" value={s.renewal_hosting_due ?? ""}
              onChange={(e) => setS({ ...s, renewal_hosting_due: e.target.value || null })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">AMC renewal due</label>
            <input type="date" value={s.renewal_amc_due ?? ""}
              onChange={(e) => setS({ ...s, renewal_amc_due: e.target.value || null })}
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Custom message (optional)</label>
            <textarea rows={2} value={s.renewal_message ?? ""}
              onChange={(e) => setS({ ...s, renewal_message: e.target.value })}
              placeholder="e.g. Please renew hosting + AMC to avoid downtime. Contact Foundif Innovations."
              className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setS({ ...s, renewal_dismissed_at: null })}
              className="text-sm text-orange font-semibold hover:underline"
            >Reset client's "remind me later"</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button disabled={busy} onClick={save} className="btn-orange inline-flex items-center gap-2">
          <Power size={16} /> {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default SuperAdmin;
