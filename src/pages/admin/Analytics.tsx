import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";

type View = { page_path: string; created_at: string };
type Event = { page_path: string; event: string; session_id: string | null; created_at: string };
type Lead = { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; created_at: string };
type ViewU = View & { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null };

const Analytics = () => {
  const [views, setViews] = useState<ViewU[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const fetchAll = () => {
      supabase.from("page_views").select("page_path,created_at,utm_source,utm_medium,utm_campaign").gte("created_at", since).then(({ data }) => setViews((data ?? []) as ViewU[]));
      supabase.from("funnel_events").select("page_path,event,session_id,created_at").gte("created_at", since).then(({ data }) => setEvents((data ?? []) as Event[]));
      supabase.from("leads").select("utm_source,utm_medium,utm_campaign,created_at").gte("created_at", since).then(({ data }) => setLeads((data ?? []) as Lead[]));
    };
    fetchAll();
    // Realtime
    const ch = supabase.channel("analytics_live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "page_views" }, fetchAll)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "funnel_events" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [days]);

  // Per-page totals
  const pages = Array.from(new Set(views.map((v) => v.page_path)));
  const rows = pages.map((p) => {
    const pv = views.filter((v) => v.page_path === p).length;
    const opens = events.filter((e) => e.page_path === p && e.event === "form_open").length;
    const subs = events.filter((e) => e.page_path === p && e.event === "form_submit").length;
    return { p, pv, opens, subs, conv: pv ? Math.round((subs / pv) * 1000) / 10 : 0 };
  }).sort((a, b) => b.pv - a.pv);

  const totalViews = views.length;
  const totalSubs = events.filter((e) => e.event === "form_submit").length;
  const totalOpens = events.filter((e) => e.event === "form_open").length;

  // UTM-source funnel: source -> views, wa_clicks (form_open of medium=whatsapp_cta), leads
  const sourceKey = (s: string | null | undefined) => (s && s.length ? s : "(direct)");
  const utmSources = Array.from(new Set([
    ...views.map((v) => sourceKey(v.utm_source)),
    ...leads.map((l) => sourceKey(l.utm_source)),
  ]));
  const utmRows = utmSources.map((s) => {
    const v = views.filter((x) => sourceKey(x.utm_source) === s).length;
    const ld = leads.filter((x) => sourceKey(x.utm_source) === s).length;
    return { s, v, ld, conv: v ? Math.round((ld / v) * 1000) / 10 : 0 };
  }).sort((a, b) => b.v - a.v);

  // WhatsApp click → lead conversion
  const waLeads = leads.filter((l) => (l.utm_medium || "").includes("whatsapp")).length;
  const waClicks = totalOpens; // form_open is logged on every WA CTA click
  const waConv = waClicks ? Math.round((waLeads / waClicks) * 1000) / 10 : 0;

  // Daily series
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
    const k = d.toISOString().slice(0, 10);
    return { k, label: k.slice(5), v: views.filter((x) => x.created_at.slice(0, 10) === k).length };
  });
  const max = Math.max(1, ...series.map((s) => s.v));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Analytics</h1>
          <p className="text-muted-foreground">Per-page views and lead conversion funnel.</p>
        </div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="font-display text-3xl font-extrabold">{totalViews}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Page views</div></div>
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="font-display text-3xl font-extrabold">{totalOpens}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Form opens</div></div>
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="font-display text-3xl font-extrabold">{totalSubs}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Form submits</div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">WhatsApp click → lead</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><div className="font-display text-2xl font-extrabold">{waClicks}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">WA Clicks</div></div>
            <div><div className="font-display text-2xl font-extrabold">{waLeads}</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">WA Leads</div></div>
            <div><div className="font-display text-2xl font-extrabold text-orange">{waConv}%</div><div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Conv.</div></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">UTM source funnel</h2>
          <table className="w-full text-xs">
            <thead className="text-muted-foreground uppercase">
              <tr><th className="text-left py-1">Source</th><th className="text-right">Views</th><th className="text-right">Leads</th><th className="text-right">Conv.</th></tr>
            </thead>
            <tbody>
              {utmRows.slice(0, 8).map((r) => (
                <tr key={r.s} className="border-t border-border">
                  <td className="py-1.5 font-mono">{r.s}</td>
                  <td className="py-1.5 text-right font-bold">{r.v}</td>
                  <td className="py-1.5 text-right">{r.ld}</td>
                  <td className="py-1.5 text-right text-orange font-semibold">{r.conv}%</td>
                </tr>
              ))}
              {!utmRows.length && <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No data yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Daily page views</h2>
        <div className="flex items-end gap-1 h-40">
          {series.map((s) => (
            <div key={s.k} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-orange/70 rounded-t" style={{ height: `${(s.v / max) * 100}%`, minHeight: 1 }} title={`${s.k}: ${s.v}`} />
              <div className="text-[8px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase">
            <tr><th className="text-left p-3">Page</th><th className="text-right p-3">Views</th><th className="text-right p-3">Form opens</th><th className="text-right p-3">Submits</th><th className="text-right p-3">Conv. %</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.p} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{r.p}</td>
                <td className="p-3 text-right font-bold">{r.pv}</td>
                <td className="p-3 text-right">{r.opens}</td>
                <td className="p-3 text-right">{r.subs}</td>
                <td className="p-3 text-right">{r.conv}%</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No views yet — start sharing your site!</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Analytics;