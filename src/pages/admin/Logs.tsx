import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useRows } from "@/hooks/useIsp";
import { Panel, PageHead, DataTable, Btn, Pill, SearchBox, Select, type Column } from "@/components/admin/kit";
import { dateTimeFmt, pretty, downloadCsv, statusTone } from "@/lib/isp";
import { Download } from "lucide-react";

type Row = Record<string, any> & { id: string };

const toneFor = (action: string) =>
  action === "deleted" ? "red" : action === "created" ? "green" : action === "updated" ? "blue" : "gray";

const Logs = () => {
  const { data: rows = [], isLoading } = useRows<Row>("isp_activity_log", { order: { column: "created_at" } });
  const [q, setQ] = useState("");
  const [action, setAction] = useState("");

  const actions = useMemo(() => [...new Set(rows.map((r) => r.action).filter(Boolean))], [rows]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!action || r.action === action) &&
        (!term || [r.actor_email, r.entity, r.entity_id, r.details, r.action].join(" ").toLowerCase().includes(term))
    );
  }, [rows, q, action]);

  const columns: Column<Row>[] = [
    { key: "created_at", label: "When", render: (r) => <span className="whitespace-nowrap">{dateTimeFmt(r.created_at)}</span> },
    { key: "actor_email", label: "User", render: (r) => r.actor_email ?? "System" },
    { key: "action", label: "Action", render: (r) => <Pill tone={toneFor(r.action) as never}>{pretty(r.action)}</Pill> },
    { key: "entity", label: "Entity", hideOnMobile: true, render: (r) => pretty(String(r.entity ?? "").replace("isp_", "")) },
    { key: "details", label: "Details", hideOnMobile: true, render: (r) => r.details ?? "—" },
  ];

  return (
    <AdminLayout>
      <PageHead
        title="Logs & Activity"
        crumbs={["Logs"]}
        actions={
          <Btn variant="ghost" onClick={() => downloadCsv("activity-log.csv", filtered)}>
            <Download size={15} /> Export CSV
          </Btn>
        }
      />
      <Panel>
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border">
          <SearchBox value={q} onChange={setQ} placeholder="Search user, entity, details…" />
          <Select value={action} onChange={(e) => setAction(e.target.value)} className="w-auto">
            <option value="">All actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>{pretty(a)}</option>
            ))}
          </Select>
        </div>
        <DataTable rows={filtered} columns={columns} loading={isLoading} pageSize={12} empty="No activity recorded yet." />
      </Panel>
    </AdminLayout>
  );
};

export default Logs;
