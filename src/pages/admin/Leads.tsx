import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Trash2, Phone, Mail, MessageSquare, Download, FileText, Loader2 } from "lucide-react";
import { generateQuotePdf } from "@/lib/quotePdf";
import { useSettings } from "@/hooks/useSettings";

type Lead = any;
const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const { toast } = useToast();
  const settings = useSettings();

  const load = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    setLeads(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("leads").update(patch).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    const next = selected?.id === id ? { ...selected, ...patch } : selected;
    if (next && selected?.id === id) setSelected(next);
    // Auto-generate quote PDF on transition to "won"
    if (patch.status === "won" && next && !next.quote_pdf_url) {
      toast({ title: "Lead won 🎉", description: "Generating quote PDF…" });
      const res = await generateQuotePdf(next, settings);
      if (res?.url) {
        setSelected({ ...next, quote_pdf_url: res.url });
        toast({ title: "Quote PDF attached", description: "Saved on the lead." });
      }
    }
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("leads").delete().eq("id", id);
    setSelected(null);
    load();
  };
  const markAllRead = async () => {
    await supabase.from("leads").update({ is_read: true }).eq("is_read", false);
    load();
    toast({ title: "All marked as read" });
  };

  const filtered = leads.filter((l) => {
    if (filter === "unread" && l.is_read) return false;
    if (filter !== "all" && filter !== "unread" && l.status !== filter) return false;
    if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
    if (fromDate && new Date(l.created_at) < new Date(fromDate)) return false;
    if (toDate && new Date(l.created_at) > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  const sources = Array.from(new Set(leads.map((l) => l.source))).filter(Boolean);

  const exportCsv = () => {
    const cols = ["created_at", "name", "phone", "email", "company", "product_interest", "quantity", "status", "source", "page_path", "utm_source", "utm_medium", "utm_campaign", "message", "notes"];
    const escape = (v: any) => {
      if (v == null) return "";
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const rows = [cols.join(","), ...filtered.map((l) => cols.map((c) => escape(l[c])).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${filtered.length} leads` });
  };

  const waReplyUrl = (l: any) => {
    const phone = (l.phone || "").replace(/\D/g, "");
    const ctx = [
      `Hi ${l.name?.split(" ")[0] || "there"}, this is Sri Kanish Enterprises.`,
      l.product_interest ? `Re: your enquiry for ${l.product_interest}${l.quantity ? ` (qty: ${l.quantity})` : ""}.` : null,
      l.message ? `\nYou wrote: "${l.message.length > 140 ? l.message.slice(0, 140) + "…" : l.message}"` : null,
      `\nWe'd like to share the best quote — could you confirm a few details?`,
    ].filter(Boolean).join("\n");
    return `https://wa.me/${phone}?text=${encodeURIComponent(ctx)}`;
  };

  const waQuoteUrl = (l: any) => {
    const phone = (l.phone || "").replace(/\D/g, "");
    const msg = [
      `Hi ${l.name?.split(" ")[0] || "there"},`,
      `Thank you for choosing ${settings.company_name || "Sri Kanish Enterprises"}.`,
      l.product_interest ? `Please find your quote for ${l.product_interest}${l.quantity ? ` (qty: ${l.quantity})` : ""} below:` : `Please find your quote attached:`,
      l.quote_pdf_url || "",
      `\nLet us know if you'd like any revisions.`,
    ].filter(Boolean).join("\n");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const buildPdf = async () => {
    if (!selected) return;
    setPdfBusy(true);
    const res = await generateQuotePdf(selected, settings);
    setPdfBusy(false);
    if (!res || !res.url) return toast({ title: "PDF generation failed", variant: "destructive" });
    setSelected({ ...selected, quote_pdf_url: res.url });
    load();
    window.open(res.url, "_blank", "noopener");
    toast({ title: "Quote PDF saved", description: "Stored on the lead and opened in a new tab." });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Leads</h1>
          <p className="text-muted-foreground">{leads.length} total · {leads.filter((l) => !l.is_read).length} unread</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-4 py-2 rounded-full border border-border font-semibold inline-flex items-center gap-2 text-sm hover:bg-secondary"><Download size={14} /> Export CSV ({filtered.length})</button>
          <button onClick={markAllRead} className="btn-orange"><Check size={16} /> Mark all read</button>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {["all", "unread", ...STATUSES].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${filter === f ? "bg-foreground text-background" : "bg-secondary/50 border border-border"}`}>{f}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Source</label>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
              <option value="all">All sources</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs" />
          </div>
          {(sourceFilter !== "all" || fromDate || toDate) && (
            <button onClick={() => { setSourceFilter("all"); setFromDate(""); setToDate(""); }} className="text-xs font-semibold text-orange underline">Reset</button>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase">
              <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Product</th><th className="text-left p-3">Status</th><th className="text-left p-3">When</th></tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} onClick={() => { setSelected(l); if (!l.is_read) update(l.id, { is_read: true }); }} className={`border-t border-border cursor-pointer hover:bg-secondary/40 ${selected?.id === l.id ? "bg-orange/5" : ""}`}>
                  <td className="p-3 font-semibold flex items-center gap-2">{!l.is_read && <span className="w-2 h-2 rounded-full bg-orange" />}{l.name}</td>
                  <td className="p-3 text-muted-foreground">{l.product_interest || "—"}</td>
                  <td className="p-3"><span className="text-xs uppercase font-bold">{l.status}</span></td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No leads yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-xl font-extrabold">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => remove(selected.id)} className="text-orange hover:text-red-500"><Trash2 size={16} /></button>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2"><Phone size={14} className="text-orange" /><a href={`tel:${selected.phone}`} className="hover:text-orange">{selected.phone}</a></div>
                {selected.email && <div className="flex items-center gap-2"><Mail size={14} className="text-orange" /><a href={`mailto:${selected.email}`} className="hover:text-orange">{selected.email}</a></div>}
                {selected.company && <div><span className="text-muted-foreground text-xs uppercase">Company:</span> {selected.company}</div>}
                {selected.product_interest && <div><span className="text-muted-foreground text-xs uppercase">Product:</span> {selected.product_interest}</div>}
                {selected.quantity && <div><span className="text-muted-foreground text-xs uppercase">Qty:</span> {selected.quantity}</div>}
                <div className="text-xs text-muted-foreground uppercase mt-2">Source: {selected.source} · Page: {selected.page_path || "—"}</div>
                {selected.utm_campaign && <div className="text-xs text-muted-foreground">UTM: {selected.utm_source}/{selected.utm_medium}/{selected.utm_campaign}</div>}
              </div>
              {selected.message && <div className="bg-secondary/50 rounded-xl p-4 mb-4 text-sm flex gap-2"><MessageSquare size={14} className="shrink-0 mt-0.5 text-orange" /> {selected.message}</div>}
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Status</label>
              <select value={selected.status} onChange={(e) => update(selected.id, { status: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 mb-3">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Internal notes</label>
              <textarea defaultValue={selected.notes || ""} onBlur={(e) => update(selected.id, { notes: e.target.value })} rows={3} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none" />
              <a href={waReplyUrl(selected)} target="_blank" rel="noopener noreferrer" className="btn-orange w-full justify-center mt-3">
                <MessageSquare size={16} /> Reply on WhatsApp with context
              </a>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <button
                  onClick={buildPdf}
                  disabled={pdfBusy}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border font-semibold text-sm hover:bg-secondary disabled:opacity-60"
                >
                  {pdfBusy ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  {selected.quote_pdf_url ? "Regenerate quote PDF" : "Generate quote PDF"}
                </button>
                {selected.quote_pdf_url && (
                  <a
                    href={waQuoteUrl(selected)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors"
                  >
                    <MessageSquare size={14} /> Send quote on WhatsApp
                  </a>
                )}
                {selected.quote_pdf_url && (
                  <a
                    href={selected.quote_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-orange transition-colors"
                  >
                    <Download size={14} /> Download saved quote
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">Select a lead to view details.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Leads;