import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Panel, PageHead, Btn, Field, Input, Textarea } from "@/components/admin/kit";
import { PartyPopper, Construction, Clock } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");

const toLocalDT = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

/** Next occurrence of a weekday (0=Sun … 6=Sat) at 10:00 local time. */
const nextWeekday = (weekday: number) => {
  const d = new Date();
  const delta = (weekday - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
};

const MaintenancePage = () => {
  const { toast } = useToast();
  const [s, setS] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    supabase.from("platform_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => setS(data));
  }, []);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = useMemo(() => {
    if (!s?.launch_at) return null;
    const diff = Math.max(0, new Date(s.launch_at).getTime() - now);
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins: Math.floor((diff % 3600000) / 60000),
      secs: Math.floor((diff % 60000) / 1000),
    };
  }, [s?.launch_at, now]);

  if (!s) return <AdminLayout><div className="text-muted-foreground">Loading…</div></AdminLayout>;

  const save = async (patch?: Record<string, any>) => {
    const next = { ...s, ...(patch ?? {}) };
    setS(next);
    setBusy(true);
    const payload = { ...next };
    delete payload.id;
    delete payload.updated_at;
    const { error } = await supabase.from("platform_settings").update(payload).eq("id", 1);
    setBusy(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Maintenance settings saved" });
  };

  const on = !!s.maintenance_enabled;

  return (
    <AdminLayout>
      <PageHead title="Maintenance Mode" crumbs={["Settings", "Maintenance"]} />
      <p className="text-sm text-muted-foreground -mt-4 mb-6">
        Take the website offline for visitors. Admins can still browse the site and the admin panel.
      </p>

      <Panel className="p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl grid place-items-center ${on ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
              {on ? <Construction size={20} /> : <PartyPopper size={20} />}
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold">{on ? "Site is under maintenance" : "Site is LIVE"}</h2>
              <p className="text-sm text-muted-foreground">
                {on ? "Visitors see the launching-soon countdown page." : "Visitors can browse the website normally."}
              </p>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={on} onChange={(e) => save({ maintenance_enabled: e.target.checked })} />
            <div className="w-12 h-7 bg-secondary rounded-full peer-checked:bg-primary relative transition-colors">
              <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${on ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-semibold">{on ? "ON" : "OFF"}</span>
          </label>
        </div>
      </Panel>

      {countdown && (
        <Panel className="p-5 mb-6">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
            <Clock size={13} /> Launching in
          </p>
          <div className="grid grid-cols-4 gap-3 max-w-lg">
            {[
              { v: countdown.days, l: "Days" },
              { v: countdown.hours, l: "Hours" },
              { v: countdown.mins, l: "Minutes" },
              { v: countdown.secs, l: "Seconds" },
            ].map((u) => (
              <div key={u.l} className="rounded-xl bg-secondary/60 border border-border p-3 text-center">
                <div className="font-display text-2xl md:text-3xl font-extrabold tabular-nums text-primary">{pad(u.v)}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{u.l}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel className="p-5">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Headline" className="md:col-span-2">
            <Input value={s.maintenance_title ?? ""} onChange={(e) => setS({ ...s, maintenance_title: e.target.value })} />
          </Field>
          <Field label="Message" className="md:col-span-2">
            <Textarea rows={3} value={s.maintenance_message ?? ""} onChange={(e) => setS({ ...s, maintenance_message: e.target.value })} />
          </Field>
          <Field label="Auto go-live at (optional)" className="md:col-span-2">
            <Input
              type="datetime-local"
              value={toLocalDT(s.launch_at)}
              onChange={(e) => setS({ ...s, launch_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              When this time arrives, the website automatically goes live with a confetti celebration. Leave empty to disable the timer.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Btn type="button" variant="soft" onClick={() => setS({ ...s, launch_at: nextWeekday(3) })}>This Wednesday, 10:00</Btn>
              <Btn type="button" variant="soft" onClick={() => setS({ ...s, launch_at: nextWeekday(5) })}>This Friday, 10:00</Btn>
              <Btn type="button" variant="soft" onClick={() => setS({ ...s, launch_at: null })}>Clear</Btn>
            </div>
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Btn variant="primary" disabled={busy} onClick={() => save()}>{busy ? "Saving…" : "Save changes"}</Btn>
        </div>
      </Panel>
    </AdminLayout>
  );
};

export default MaintenancePage;
