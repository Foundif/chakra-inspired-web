import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, IndianRupee } from "lucide-react";

const STAGES = ["new", "contacted", "qualified", "won", "lost"] as const;
type Lead = any;

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
    setLeads((data ?? []) as Lead[]);
  };
  useEffect(() => { load(); }, []);

  const setStage = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status: status as any }).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    load();
  };
  const setVal = async (id: string, estimated_value: number | null, expected_close_date: string | null) => {
    await supabase.from("leads").update({ estimated_value, expected_close_date }).eq("id", id);
    load();
  };

  const onDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData("id", id);
  const onDrop = (e: React.DragEvent, status: string) => { const id = e.dataTransfer.getData("id"); if (id) setStage(id, status); };

  // Revenue chart: monthly won value last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); d.setDate(1);
    return { key: d.toISOString().slice(0, 7), label: d.toLocaleString("default", { month: "short" }) };
  });
  const wonByMonth = months.map((m) => leads.filter((l) => l.status === "won" && (l.won_at || l.created_at).slice(0, 7) === m.key)
    .reduce((s, l) => s + Number(l.estimated_value || 0), 0));
  const maxRev = Math.max(1, ...wonByMonth);
  const totalWon = leads.filter((l) => l.status === "won").reduce((s, l) => s + Number(l.estimated_value || 0), 0);
  const totalPipeline = leads.filter((l) => !["won", "lost"].includes(l.status)).reduce((s, l) => s + Number(l.estimated_value || 0), 0);
  const conversion = leads.length ? Math.round((leads.filter((l) => l.status === "won").length / leads.length) * 100) : 0;

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-extrabold mb-1">Sales Pipeline</h1>
      <p className="text-muted-foreground mb-6">Drag leads between stages. Set deal value & expected close to power the revenue chart.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center mb-3"><Trophy size={18} /></div><div className="font-display text-3xl font-extrabold">₹{totalWon.toLocaleString("en-IN")}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Won revenue</div></div>
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="w-10 h-10 rounded-xl bg-orange/10 text-orange grid place-items-center mb-3"><IndianRupee size={18} /></div><div className="font-display text-3xl font-extrabold">₹{totalPipeline.toLocaleString("en-IN")}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Open pipeline value</div></div>
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="font-display text-3xl font-extrabold">{conversion}%</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Win rate</div></div>
        <div className="bg-card rounded-2xl p-5 border border-border"><div className="font-display text-3xl font-extrabold">{leads.filter((l) => l.status === "won").length}</div><div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Deals won</div></div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="font-semibold mb-4">Won revenue — last 6 months</h2>
        <div className="flex items-end gap-3 h-40">
          {wonByMonth.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-[10px] font-bold text-muted-foreground">₹{Math.round(v).toLocaleString("en-IN")}</div>
              <div className="w-full bg-orange/80 rounded-t-md" style={{ height: `${(v / maxRev) * 100}%`, minHeight: 2 }} />
              <div className="text-[10px] text-muted-foreground">{months[i].label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STAGES.map((s) => {
          const items = leads.filter((l) => l.status === s);
          const sum = items.reduce((a, l) => a + Number(l.estimated_value || 0), 0);
          return (
            <div key={s} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, s)} className="bg-secondary/40 rounded-2xl p-3 border border-border min-h-[400px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="text-xs uppercase font-bold tracking-wider">{s}</div>
                <div className="text-[10px] text-muted-foreground">{items.length} · ₹{sum.toLocaleString("en-IN")}</div>
              </div>
              <div className="space-y-2">
                {items.map((l) => (
                  <div key={l.id} draggable onDragStart={(e) => onDragStart(e, l.id)} className="bg-card rounded-xl p-3 border border-border cursor-grab active:cursor-grabbing">
                    <div className="font-semibold text-sm truncate">{l.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{l.product_interest || "—"}</div>
                    <div className="mt-2 grid grid-cols-2 gap-1">
                      <input type="number" placeholder="₹ value" defaultValue={l.estimated_value ?? ""} onBlur={(e) => setVal(l.id, e.target.value ? Number(e.target.value) : null, l.expected_close_date)} className="rounded border border-border bg-background px-2 py-1 text-[11px]" />
                      <input type="date" defaultValue={l.expected_close_date ?? ""} onBlur={(e) => setVal(l.id, l.estimated_value, e.target.value || null)} className="rounded border border-border bg-background px-2 py-1 text-[11px]" />
                    </div>
                  </div>
                ))}
                {!items.length && <div className="text-[11px] text-muted-foreground text-center py-6">Drop leads here</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
};

export default Pipeline;