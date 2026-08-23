import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useRows } from "@/hooks/useIsp";
import { Panel, PanelHead, PageHead, Btn } from "@/components/admin/kit";
import { inr, downloadCsv } from "@/lib/isp";
import { Download, IndianRupee, Users, Cable, LifeBuoy } from "lucide-react";

const Bar = ({ label, value, max, tone = "bg-primary" }: { label: string; value: number; max: number; tone?: string }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs mb-1">
      <span className="font-semibold">{label}</span>
      <span className="text-muted-foreground tabular-nums">{value}</span>
    </div>
    <div className="h-2 rounded-full bg-secondary overflow-hidden">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
    </div>
  </div>
);

const Reports = () => {
  const { data: invoices = [] } = useRows<any>("isp_invoices", { order: { column: "issued_on" } });
  const { data: payments = [] } = useRows<any>("isp_payments", { order: { column: "paid_on" } });
  const { data: customers = [] } = useRows<any>("isp_customers", { order: { column: "created_at" } });
  const { data: connections = [] } = useRows<any>("isp_connections", { order: { column: "created_at" } });
  const { data: tickets = [] } = useRows<any>("isp_tickets", { order: { column: "created_at" } });
  const { data: plans = [] } = useRows<any>("isp_plans", { order: { column: "sort_order", asc: true } });

  const collected = payments.reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0);
  const billed = invoices.reduce((s: number, i: any) => s + Number(i.amount ?? 0) + Number(i.tax ?? 0), 0);
  const outstanding = invoices
    .filter((i: any) => i.status === "unpaid" || i.status === "overdue")
    .reduce((s: number, i: any) => s + Number(i.amount ?? 0) + Number(i.tax ?? 0), 0);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (let k = 5; k >= 0; k--) {
      const d = new Date();
      d.setMonth(d.getMonth() - k, 1);
      map.set(d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), 0);
    }
    payments.forEach((p: any) => {
      if (!p.paid_on) return;
      const key = new Date(p.paid_on).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + Number(p.amount ?? 0));
    });
    return [...map.entries()];
  }, [payments]);

  const planMix = useMemo(() => {
    const map = new Map<string, number>();
    connections.forEach((c: any) => {
      const name = plans.find((p: any) => p.id === c.plan_id)?.name ?? "Unassigned";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [connections, plans]);

  const maxRev = Math.max(1, ...monthly.map(([, v]) => v));
  const maxMix = Math.max(1, ...planMix.map(([, v]) => v));

  const stats = [
    { label: "Collected", value: inr(collected), icon: IndianRupee },
    { label: "Billed", value: inr(billed), icon: IndianRupee },
    { label: "Outstanding", value: inr(outstanding), icon: IndianRupee },
    { label: "Customers", value: String(customers.length), icon: Users },
    { label: "Connections", value: String(connections.length), icon: Cable },
    { label: "Tickets", value: String(tickets.length), icon: LifeBuoy },
  ];

  return (
    <AdminLayout>
      <PageHead
        title="Reports & Analytics"
        crumbs={["Reports"]}
        actions={
          <Btn variant="ghost" onClick={() => downloadCsv("payments.csv", payments)}>
            <Download size={15} /> Export payments
          </Btn>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((s) => (
          <Panel key={s.label} className="p-4">
            <s.icon size={16} className="text-primary mb-2" />
            <p className="font-display text-xl font-extrabold tabular-nums">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
          </Panel>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel>
          <PanelHead title="Collections — last 6 months" />
          <div className="p-5">
            {monthly.map(([m, v]) => (
              <Bar key={m} label={m} value={Math.round(v)} max={maxRev} />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Plan mix" />
          <div className="p-5">
            {planMix.length ? (
              planMix.map(([n, v]) => <Bar key={n} label={n} value={v} max={maxMix} tone="bg-emerald-500" />)
            ) : (
              <p className="text-sm text-muted-foreground">No connections yet.</p>
            )}
          </div>
        </Panel>
      </div>
    </AdminLayout>
  );
};

export default Reports;
