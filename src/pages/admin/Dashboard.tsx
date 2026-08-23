import { useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import { Users, Radio, IndianRupee, Ticket } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { useRows } from "@/hooks/useIsp";
import { Panel, PanelHead, Pill, Avatar, DataTable } from "@/components/admin/kit";
import { inr, dateFmt, statusTone, pretty } from "@/lib/isp";

const Spark = ({ data, color }: { data: number[]; color: string }) => (
  <ResponsiveContainer width="100%" height={56}>
    <AreaChart data={data.map((v, i) => ({ i, v }))}>
      <defs>
        <linearGradient id={`g${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#g${color.replace("#", "")})`} />
    </AreaChart>
  </ResponsiveContainer>
);

const Stat = ({ icon: Icon, tint, label, value, delta, spark, color }: any) => (
  <Panel className="p-5">
    <div className="flex items-start gap-3">
      <span className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${tint}`}><Icon size={20} /></span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-extrabold">{value}</p>
        {delta && <p className="text-xs font-semibold text-emerald-600 mt-0.5">{delta}</p>}
      </div>
    </div>
    <div className="mt-3 -mx-1"><Spark data={spark} color={color} /></div>
  </Panel>
);

const Dashboard = () => {
  const { data: customers = [] } = useRows<any>("isp_customers", { order: { column: "created_at" } });
  const { data: connections = [] } = useRows<any>("isp_connections", { order: { column: "created_at" } });
  const { data: invoices = [] } = useRows<any>("isp_invoices", { order: { column: "created_at" } });
  const { data: payments = [] } = useRows<any>("isp_payments", { order: { column: "paid_on" } });
  const { data: tickets = [] } = useRows<any>("isp_tickets", { order: { column: "created_at" } });
  const { data: plans = [] } = useRows<any>("isp_plans", { order: { column: "sort_order", asc: true } });

  const planMap = new Map(plans.map((p: any) => [p.id, p]));
  const activeConn = connections.filter((c: any) => c.status === "active").length;
  const inactiveConn = connections.filter((c: any) => c.status === "disconnected" || c.status === "pending").length;
  const suspended = connections.filter((c: any) => c.status === "suspended").length;
  const openTickets = tickets.filter((t: any) => t.status === "open" || t.status === "in_progress").length;

  const monthStart = new Date(); monthStart.setDate(1);
  const monthRevenue = payments
    .filter((p: any) => new Date(p.paid_on) >= monthStart)
    .reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0);

  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i));
      return d.toISOString().slice(0, 10);
    }),
    []
  );
  const series = days.map((d) => ({
    day: new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    revenue: payments.filter((p: any) => String(p.paid_on).slice(0, 10) === d).reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0),
    invoiced: invoices.filter((i: any) => String(i.issued_on).slice(0, 10) === d).reduce((s: number, i: any) => s + Number(i.amount ?? 0) + Number(i.tax ?? 0), 0),
  }));

  const sparkOf = (fn: (d: string) => number) => days.map(fn);
  const donut = [
    { name: "Active", value: activeConn, color: "#16a34a" },
    { name: "Inactive", value: inactiveConn, color: "#C5151D" },
    { name: "Suspended", value: suspended, color: "#94a3b8" },
  ];
  const totalConn = Math.max(1, activeConn + inactiveConn + suspended);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat icon={Users} tint="bg-red-50 text-primary" label="Total Customers" value={customers.length}
          delta={`${customers.filter((c: any) => new Date(c.created_at) >= monthStart).length} new this month`}
          spark={sparkOf((d) => customers.filter((c: any) => String(c.created_at).slice(0, 10) <= d).length)} color="#C5151D" />
        <Stat icon={Radio} tint="bg-blue-50 text-blue-600" label="Active Connections" value={activeConn}
          delta={`${Math.round((activeConn / totalConn) * 100)}% of network`}
          spark={sparkOf((d) => connections.filter((c: any) => String(c.created_at).slice(0, 10) <= d).length)} color="#2563eb" />
        <Stat icon={IndianRupee} tint="bg-emerald-50 text-emerald-600" label="Monthly Revenue" value={inr(monthRevenue)}
          delta={`${payments.filter((p: any) => new Date(p.paid_on) >= monthStart).length} payments collected`}
          spark={series.map((s) => s.revenue)} color="#16a34a" />
        <Stat icon={Ticket} tint="bg-amber-50 text-amber-600" label="Open Tickets" value={openTickets}
          delta={`${tickets.length} total logged`}
          spark={sparkOf((d) => tickets.filter((t: any) => String(t.created_at).slice(0, 10) === d).length)} color="#f59e0b" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <PanelHead title="Revenue Overview" action={<span className="text-xs text-muted-foreground">Last 14 days</span>} />
          <div className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e9ef" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip formatter={(v: any) => inr(Number(v))} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Collected (₹)" stroke="#C5151D" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="invoiced" name="Invoiced (₹)" stroke="#64748b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Connection Status" />
          <div className="p-4 flex flex-col items-center">
            <div className="h-[190px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donut} dataKey="value" innerRadius={62} outerRadius={88} paddingAngle={2}>
                    {donut.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <p className="font-display text-2xl font-extrabold">{connections.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
            <ul className="w-full mt-4 space-y-2 text-sm">
              {donut.map((d) => (
                <li key={d.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-semibold text-muted-foreground">
                    {d.value} ({Math.round((d.value / totalConn) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Panel>
          <PanelHead title="Recent Customers" action={<Link to="/admin/customers" className="text-xs font-bold text-primary">View All</Link>} />
          <DataTable
            rows={customers.slice(0, 5)}
            pageSize={5}
            columns={[
              { key: "full_name", label: "Customer", render: (r: any) => (
                <span className="flex items-center gap-2.5"><Avatar name={r.full_name} size={30} /><span className="font-semibold">{r.full_name}</span></span>
              ) },
              { key: "phone", label: "Phone", hideOnMobile: true },
              { key: "status", label: "Status", render: (r: any) => <Pill tone={statusTone(r.status)}>{pretty(r.status)}</Pill> },
              { key: "joined_on", label: "Joined", hideOnMobile: true, render: (r: any) => dateFmt(r.joined_on) },
            ]}
            empty="No customers yet — add your first one."
          />
        </Panel>

        <Panel>
          <PanelHead title="Recent Tickets" action={<Link to="/admin/tickets" className="text-xs font-bold text-primary">View All</Link>} />
          <DataTable
            rows={tickets.slice(0, 5)}
            pageSize={5}
            columns={[
              { key: "subject", label: "Ticket", render: (r: any) => (
                <span><span className="block font-semibold">{r.ticket_no}</span><span className="text-xs text-muted-foreground">{r.subject}</span></span>
              ) },
              { key: "priority", label: "Priority", render: (r: any) => <Pill tone={statusTone(r.priority)}>{pretty(r.priority)}</Pill> },
              { key: "created_at", label: "Raised", hideOnMobile: true, render: (r: any) => dateFmt(r.created_at) },
            ]}
            empty="No tickets logged."
          />
        </Panel>
      </div>

      <Panel className="mt-6">
        <PanelHead title="Plan Distribution" action={<Link to="/admin/plans" className="text-xs font-bold text-primary">Manage plans</Link>} />
        <div className="p-5 space-y-3">
          {plans.map((p: any) => {
            const count = connections.filter((c: any) => c.plan_id === p.id).length;
            return (
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold">{p.name} · {p.speed_mbps} Mbps</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(count / Math.max(1, connections.length)) * 100}%` }} />
                </div>
              </div>
            );
          })}
          {!plans.length && <p className="text-sm text-muted-foreground">No plans configured yet.</p>}
          {!!plans.length && !connections.length && <p className="text-xs text-muted-foreground">No connections mapped to plans yet.</p>}
          <p className="text-xs text-muted-foreground pt-2">{planMap.size} plans configured.</p>
        </div>
      </Panel>
    </AdminLayout>
  );
};

export default Dashboard;
