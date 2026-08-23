import AdminLayout from "./AdminLayout";
import { Panel, PageHead, PanelHead, Pill, DataTable } from "@/components/admin/kit";
import { useRows } from "@/hooks/useIsp";
import { dateFmt, pretty, statusTone } from "@/lib/isp";
import { Activity, Wifi, ServerCog, Gauge } from "lucide-react";

const NetworkMonitoring = () => {
  const { data: connections = [], isLoading } = useRows<any>("isp_connections", { order: { column: "created_at" } });
  const { data: tickets = [] } = useRows<any>("isp_tickets", { order: { column: "created_at" } });

  const active = connections.filter((c) => c.status === "active").length;
  const down = connections.filter((c) => c.status === "suspended" || c.status === "disconnected").length;
  const uptime = connections.length ? ((active / connections.length) * 100).toFixed(1) : "100.0";
  const faults = tickets.filter((t) => t.category === "technical" && (t.status === "open" || t.status === "in_progress"));

  const ports = Array.from(new Set(connections.map((c) => c.olt_port).filter(Boolean))) as string[];

  const Stat = ({ icon: Icon, label, value, tint }: any) => (
    <Panel className="p-5 flex items-center gap-4">
      <span className={`w-12 h-12 rounded-2xl grid place-items-center ${tint}`}><Icon size={20} /></span>
      <span>
        <span className="block text-sm text-muted-foreground">{label}</span>
        <span className="block font-display text-2xl font-extrabold">{value}</span>
      </span>
    </Panel>
  );

  return (
    <AdminLayout>
      <PageHead title="Network Monitoring" crumbs={["Network Monitoring"]} />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat icon={Wifi} label="Links up" value={active} tint="bg-emerald-50 text-emerald-600" />
        <Stat icon={Activity} label="Links down" value={down} tint="bg-red-50 text-primary" />
        <Stat icon={Gauge} label="Network uptime" value={`${uptime}%`} tint="bg-blue-50 text-blue-600" />
        <Stat icon={ServerCog} label="OLT ports in use" value={ports.length} tint="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel>
          <PanelHead title="Live link status" />
          <DataTable
            rows={connections}
            loading={isLoading}
            columns={[
              { key: "connection_no", label: "Connection", render: (r: any) => <span className="font-semibold">{r.connection_no}</span> },
              { key: "ip_address", label: "IP", hideOnMobile: true, render: (r: any) => r.ip_address ?? "—" },
              { key: "olt_port", label: "OLT port", hideOnMobile: true, render: (r: any) => r.olt_port ?? "—" },
              { key: "status", label: "State", render: (r: any) => <Pill tone={statusTone(r.status)}>{pretty(r.status)}</Pill> },
            ]}
            empty="No connections provisioned yet."
          />
        </Panel>

        <Panel>
          <PanelHead title="Open technical faults" />
          <DataTable
            rows={faults}
            columns={[
              { key: "ticket_no", label: "Ticket", render: (r: any) => <span className="font-semibold">#{r.ticket_no}</span> },
              { key: "subject", label: "Fault" },
              { key: "priority", label: "Priority", render: (r: any) => <Pill tone={statusTone(r.priority)}>{pretty(r.priority)}</Pill> },
              { key: "created_at", label: "Raised", hideOnMobile: true, render: (r: any) => dateFmt(r.created_at) },
            ]}
            empty="Network healthy — no open faults."
          />
        </Panel>
      </div>
    </AdminLayout>
  );
};

export default NetworkMonitoring;
