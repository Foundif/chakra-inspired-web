import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { Plus, Download, Pencil, Trash2, RotateCcw } from "lucide-react";
import { useRows, useSaveRow, useDeleteRow } from "@/hooks/useIsp";
import {
  Panel, PageHead, DataTable, Btn, Pill, Avatar, Modal, Field, Input, Textarea, Select, SearchBox, type Column,
} from "@/components/admin/kit";
import { inr, dateFmt, dateTimeFmt, statusTone, pretty, downloadCsv, nextSerial } from "@/lib/isp";

type Row = Record<string, any> & { id: string };
type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "email" | "tel";
  options?: { value: string; label: string }[];
  required?: boolean;
  full?: boolean;
};

function ResourcePage({
  table,
  title,
  singular,
  crumbs,
  columns,
  fields,
  defaults,
  filters,
  searchKeys,
  orderColumn = "created_at",
}: {
  table: string;
  title: string;
  singular: string;
  crumbs?: string[];
  columns: (helpers: { lookup: (t: string, id: string, key?: string) => string }) => Column<Row>[];
  fields: FieldDef[];
  defaults?: (rows: Row[]) => Record<string, any>;
  filters?: { key: string; label: string; options: string[] }[];
  searchKeys: string[];
  orderColumn?: string;
}) {
  const [params, setParams] = useSearchParams();
  const { data: rows = [], isLoading, refetch } = useRows<Row>(table, { order: { column: orderColumn } });
  const { data: customers = [] } = useRows<Row>("isp_customers", { order: { column: "full_name", asc: true } });
  const { data: plans = [] } = useRows<Row>("isp_plans", { order: { column: "sort_order", asc: true } });
  const { data: staff = [] } = useRows<Row>("isp_staff", { order: { column: "full_name", asc: true } });
  const { data: connections = [] } = useRows<Row>("isp_connections", { order: { column: "created_at" } });
  const save = useSaveRow(table, singular);
  const del = useDeleteRow(table, singular);

  const [q, setQ] = useState("");
  const [fv, setFv] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const refs: Record<string, Row[]> = { isp_customers: customers, isp_plans: plans, isp_staff: staff, isp_connections: connections };
  const lookup = (t: string, id: string, key = "full_name") => {
    const r = (refs[t] ?? []).find((x) => x.id === id);
    return (r?.[key] as string) ?? "—";
  };

  const openNew = () => {
    setForm(defaults ? defaults(rows) : {});
    setEditing({ id: "" } as Row);
  };

  useEffect(() => {
    if (params.get("new") === "1") {
      openNew();
      params.delete("new");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, rows.length]);

  const optionsFor = (f: FieldDef) => {
    if (f.options) return f.options;
    if (f.name === "customer_id") return customers.map((c) => ({ value: c.id, label: `${c.full_name} · ${c.phone}` }));
    if (f.name === "plan_id") return plans.map((p) => ({ value: p.id, label: `${p.name} (${p.speed_mbps} Mbps)` }));
    if (f.name === "assigned_to") return staff.map((s) => ({ value: s.id, label: s.full_name }));
    if (f.name === "connection_id") return connections.map((c) => ({ value: c.id, label: c.connection_no }));
    if (f.name === "invoice_id") return [];
    return [];
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const okSearch = !term || searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(term));
      const okFilters = Object.entries(fv).every(([k, v]) => !v || String(r[k]) === v);
      return okSearch && okFilters;
    });
  }, [rows, q, fv, searchKeys]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, any> = { ...form };
    fields.forEach((f) => {
      if (payload[f.name] === "") payload[f.name] = null;
      if (f.type === "number" && payload[f.name] != null) payload[f.name] = Number(payload[f.name]);
    });
    if (editing?.id) payload.id = editing.id;
    save.mutate(payload, { onSuccess: () => setEditing(null) });
  };

  const cols: Column<Row>[] = [
    ...columns({ lookup }),
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (r) => (
        <span className="flex justify-end gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setForm({ ...r }); setEditing(r); }}
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-secondary" aria-label="Edit"
          ><Pencil size={15} /></button>
          <button
            onClick={(e) => { e.stopPropagation(); if (confirm(`Delete this ${singular.toLowerCase()}?`)) del.mutate(r.id); }}
            className="w-8 h-8 grid place-items-center rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete"
          ><Trash2 size={15} /></button>
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHead
        title={title}
        crumbs={crumbs ?? [title]}
        actions={
          <>
            <Btn onClick={() => downloadCsv(`${table}.csv`, filtered)}><Download size={16} /> Export</Btn>
            <Btn variant="primary" onClick={openNew}><Plus size={16} /> Add {singular}</Btn>
          </>
        }
      />

      <Panel>
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border">
          <SearchBox value={q} onChange={setQ} placeholder={`Search ${title.toLowerCase()}…`} />
          {filters?.map((f) => (
            <Select key={f.key} value={fv[f.key] ?? ""} onChange={(e) => setFv({ ...fv, [f.key]: e.target.value })} className="w-auto">
              <option value="">{f.label}</option>
              {f.options.map((o) => <option key={o} value={o}>{pretty(o)}</option>)}
            </Select>
          ))}
          <Btn onClick={() => { setQ(""); setFv({}); refetch(); }} aria-label="Reset"><RotateCcw size={15} /></Btn>
        </div>
        <DataTable rows={filtered} columns={cols} loading={isLoading} empty={`No ${title.toLowerCase()} yet.`} />
      </Panel>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        wide
        title={editing?.id ? `Edit ${singular}` : `Add ${singular}`}
        footer={
          <>
            <Btn onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn variant="primary" form="resource-form" type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Btn>
          </>
        }
      >
        <form id="resource-form" onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <Field key={f.name} label={f.label} className={f.full ? "sm:col-span-2" : ""}>
              {f.type === "textarea" ? (
                <Textarea value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : f.type === "select" ? (
                <Select required={f.required} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                  <option value="">Select…</option>
                  {optionsFor(f).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </Select>
              ) : (
                <Input
                  required={f.required}
                  type={f.type ?? "text"}
                  step={f.type === "number" ? "any" : undefined}
                  value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              )}
            </Field>
          ))}
        </form>
      </Modal>
    </AdminLayout>
  );
}

/* ------------------------------- CUSTOMERS -------------------------------- */
export const CustomersAdmin = () => (
  <ResourcePage
    table="isp_customers"
    title="Customers"
    singular="Customer"
    searchKeys={["full_name", "phone", "email", "address", "area"]}
    filters={[{ key: "status", label: "All Status", options: ["active", "inactive", "suspended"] }]}
    columns={() => [
      { key: "full_name", label: "Customer Info", render: (r) => (
        <span className="flex items-center gap-3">
          <Avatar name={r.full_name} />
          <span className="min-w-0">
            <span className="block font-semibold truncate">{r.full_name}</span>
            <span className="block text-xs text-muted-foreground truncate">{r.email ?? "—"}</span>
            <span className="block text-xs text-muted-foreground truncate">{r.address ?? ""}</span>
          </span>
        </span>
      ) },
      { key: "phone", label: "Phone", hideOnMobile: true },
      { key: "area", label: "Area", hideOnMobile: true, render: (r) => r.area ?? "—" },
      { key: "status", label: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{pretty(r.status)}</Pill> },
      { key: "joined_on", label: "Joined On", hideOnMobile: true, render: (r) => dateFmt(r.joined_on) },
    ]}
    fields={[
      { name: "customer_code", label: "Customer ID (portal login)", required: true },
      { name: "full_name", label: "Full name", required: true },
      { name: "phone", label: "Phone (portal password)", type: "tel", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "payment_link", label: "Payment link for this customer", full: true },
      { name: "address", label: "Address", full: true },
      { name: "area", label: "Area / locality" },
      { name: "status", label: "Status", type: "select", options: ["lead", "active", "suspended", "closed"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "joined_on", label: "Joined on", type: "date" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ]}
    defaults={() => ({ status: "active", joined_on: new Date().toISOString().slice(0, 10) })}
  />
);

/* --------------------------------- PLANS ---------------------------------- */
export const PlansAdmin = () => (
  <ResourcePage
    table="isp_plans"
    title="Plans & Packages"
    singular="Plan"
    orderColumn="sort_order"
    searchKeys={["name", "description"]}
    filters={[{ key: "billing_cycle", label: "All Cycles", options: ["monthly", "quarterly", "half_yearly", "yearly"] }]}
    columns={() => [
      { key: "name", label: "Plan", render: (r) => (
        <span>
          <span className="block font-semibold">{r.name}</span>
          <span className="block text-xs text-muted-foreground">{r.is_business ? "Business" : "Home"} · {r.data_limit}</span>
        </span>
      ) },
      { key: "speed_mbps", label: "Speed", render: (r) => `${r.speed_mbps} Mbps` },
      { key: "price", label: "Price", render: (r) => <span className="font-bold">{inr(r.price)}</span> },
      { key: "billing_cycle", label: "Cycle", hideOnMobile: true, render: (r) => pretty(r.billing_cycle) },
      { key: "tv_channels", label: "TV / OTT", hideOnMobile: true, render: (r) => `${r.tv_channels ?? 0} ch · ${r.ott_apps ?? 0} apps` },
      { key: "is_active", label: "Status", render: (r) => <Pill tone={r.is_active ? "green" : "gray"}>{r.is_active ? "Active" : "Hidden"}</Pill> },
    ]}
    fields={[
      { name: "name", label: "Plan name", required: true },
      { name: "speed_mbps", label: "Speed (Mbps)", type: "number", required: true },
      { name: "price", label: "Price (₹)", type: "number", required: true },
      { name: "billing_cycle", label: "Billing cycle", type: "select", options: ["monthly", "quarterly", "half_yearly", "yearly"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "data_limit", label: "Data limit" },
      { name: "tv_channels", label: "TV channels", type: "number" },
      { name: "ott_apps", label: "OTT apps", type: "number" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "is_business", label: "Segment", type: "select", options: [{ value: "false", label: "Home" }, { value: "true", label: "Business" }] },
      { name: "is_active", label: "Visible", type: "select", options: [{ value: "true", label: "Active" }, { value: "false", label: "Hidden" }] },
      { name: "description", label: "Description", type: "textarea", full: true },
    ]}
    defaults={(rows) => ({ billing_cycle: "monthly", data_limit: "Unlimited", is_active: "true", is_business: "false", sort_order: rows.length })}
  />
);

/* ------------------------------ CONNECTIONS ------------------------------- */
export const ConnectionsAdmin = () => (
  <ResourcePage
    table="isp_connections"
    title="Connections"
    singular="Connection"
    searchKeys={["connection_no", "ip_address", "router_mac", "olt_port"]}
    filters={[{ key: "status", label: "All Status", options: ["active", "pending", "suspended", "disconnected"] }]}
    columns={({ lookup }) => [
      { key: "connection_no", label: "Connection ID", render: (r) => <span className="font-semibold">{r.connection_no}</span> },
      { key: "customer_id", label: "Customer", render: (r) => lookup("isp_customers", r.customer_id) },
      { key: "plan_id", label: "Plan", hideOnMobile: true, render: (r) => lookup("isp_plans", r.plan_id, "name") },
      { key: "status", label: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{pretty(r.status)}</Pill> },
      { key: "installed_on", label: "Installed", hideOnMobile: true, render: (r) => dateFmt(r.installed_on) },
      { key: "expiry_on", label: "Expiry", hideOnMobile: true, render: (r) => dateFmt(r.expiry_on) },
    ]}
    fields={[
      { name: "connection_no", label: "Connection ID", required: true },
      { name: "customer_id", label: "Customer", type: "select", required: true },
      { name: "plan_id", label: "Plan", type: "select" },
      { name: "status", label: "Status", type: "select", options: ["active", "pending", "suspended", "disconnected"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "installed_on", label: "Installed on", type: "date" },
      { name: "expiry_on", label: "Expiry on", type: "date" },
      { name: "router_model", label: "Router model" },
      { name: "router_mac", label: "Router MAC" },
      { name: "ip_address", label: "IP address" },
      { name: "olt_port", label: "OLT / port" },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ]}
    defaults={(rows) => ({
      connection_no: nextSerial("CF", rows.map((r) => r.connection_no)),
      status: "pending",
      installed_on: new Date().toISOString().slice(0, 10),
    })}
  />
);

/* -------------------------------- INVOICES -------------------------------- */
export const InvoicesAdmin = () => (
  <ResourcePage
    table="isp_invoices"
    title="Invoices & Payments"
    singular="Invoice"
    searchKeys={["invoice_no", "notes"]}
    filters={[{ key: "status", label: "All Status", options: ["paid", "unpaid", "overdue", "cancelled"] }]}
    columns={({ lookup }) => [
      { key: "invoice_no", label: "Invoice", render: (r) => <span className="font-semibold">{r.invoice_no}</span> },
      { key: "customer_id", label: "Customer", render: (r) => lookup("isp_customers", r.customer_id) },
      { key: "amount", label: "Amount", render: (r) => <span className="font-bold">{inr(Number(r.amount ?? 0) + Number(r.tax ?? 0))}</span> },
      { key: "issued_on", label: "Issued", hideOnMobile: true, render: (r) => dateFmt(r.issued_on) },
      { key: "due_on", label: "Due", hideOnMobile: true, render: (r) => dateFmt(r.due_on) },
      { key: "status", label: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{pretty(r.status)}</Pill> },
    ]}
    fields={[
      { name: "invoice_no", label: "Invoice no.", required: true },
      { name: "customer_id", label: "Customer", type: "select", required: true },
      { name: "connection_id", label: "Connection", type: "select" },
      { name: "amount", label: "Amount (₹)", type: "number", required: true },
      { name: "tax", label: "Tax (₹)", type: "number" },
      { name: "period_start", label: "Period from", type: "date" },
      { name: "period_end", label: "Period to", type: "date" },
      { name: "issued_on", label: "Issued on", type: "date" },
      { name: "due_on", label: "Due on", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["unpaid", "paid", "overdue", "cancelled"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "notes", label: "Notes", type: "textarea", full: true },
    ]}
    defaults={(rows) => ({
      invoice_no: nextSerial("INV", rows.map((r) => r.invoice_no)),
      status: "unpaid",
      tax: 0,
      issued_on: new Date().toISOString().slice(0, 10),
    })}
  />
);

/* -------------------------------- PAYMENTS -------------------------------- */
export const PaymentsAdmin = () => (
  <ResourcePage
    table="isp_payments"
    title="Payments"
    singular="Payment"
    crumbs={["Invoices & Payments", "Payments"]}
    orderColumn="paid_on"
    searchKeys={["reference", "method"]}
    filters={[{ key: "method", label: "All Methods", options: ["cash", "upi", "card", "netbanking", "cheque"] }]}
    columns={({ lookup }) => [
      { key: "paid_on", label: "Paid on", render: (r) => dateFmt(r.paid_on) },
      { key: "customer_id", label: "Customer", render: (r) => lookup("isp_customers", r.customer_id) },
      { key: "amount", label: "Amount", render: (r) => <span className="font-bold">{inr(r.amount)}</span> },
      { key: "method", label: "Method", render: (r) => <Pill tone="blue">{pretty(r.method)}</Pill> },
      { key: "reference", label: "Reference", hideOnMobile: true, render: (r) => r.reference ?? "—" },
    ]}
    fields={[
      { name: "customer_id", label: "Customer", type: "select", required: true },
      { name: "amount", label: "Amount (₹)", type: "number", required: true },
      { name: "method", label: "Method", type: "select", options: ["cash", "upi", "card", "netbanking", "cheque"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "reference", label: "Reference / UTR" },
      { name: "paid_on", label: "Paid on", type: "date" },
    ]}
    defaults={() => ({ method: "cash", paid_on: new Date().toISOString().slice(0, 10) })}
  />
);

/* --------------------------------- TICKETS -------------------------------- */
export const TicketsAdmin = () => (
  <ResourcePage
    table="isp_tickets"
    title="Tickets & Support"
    singular="Ticket"
    searchKeys={["ticket_no", "subject", "description"]}
    filters={[
      { key: "status", label: "All Status", options: ["open", "in_progress", "resolved", "closed"] },
      { key: "priority", label: "All Priority", options: ["low", "medium", "high", "urgent"] },
    ]}
    columns={({ lookup }) => [
      { key: "ticket_no", label: "Ticket", render: (r) => (
        <span><span className="block font-semibold">#{r.ticket_no}</span><span className="block text-xs text-muted-foreground">{r.subject}</span></span>
      ) },
      { key: "customer_id", label: "Customer", hideOnMobile: true, render: (r) => lookup("isp_customers", r.customer_id) },
      { key: "priority", label: "Priority", render: (r) => <Pill tone={statusTone(r.priority)}>{pretty(r.priority)}</Pill> },
      { key: "status", label: "Status", render: (r) => <Pill tone={statusTone(r.status)}>{pretty(r.status)}</Pill> },
      { key: "assigned_to", label: "Assigned", hideOnMobile: true, render: (r) => (r.assigned_to ? lookup("isp_staff", r.assigned_to) : "Unassigned") },
      { key: "created_at", label: "Raised", hideOnMobile: true, render: (r) => dateTimeFmt(r.created_at) },
    ]}
    fields={[
      { name: "ticket_no", label: "Ticket no.", required: true },
      { name: "customer_id", label: "Customer", type: "select" },
      { name: "subject", label: "Subject", required: true, full: true },
      { name: "category", label: "Category", type: "select", options: ["technical", "billing", "new_connection", "relocation", "other"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "priority", label: "Priority", type: "select", options: ["low", "medium", "high", "urgent"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "status", label: "Status", type: "select", options: ["open", "in_progress", "resolved", "closed"].map((v) => ({ value: v, label: pretty(v) })) },
      { name: "assigned_to", label: "Assign to", type: "select" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "resolution", label: "Resolution", type: "textarea", full: true },
    ]}
    defaults={(rows) => ({
      ticket_no: nextSerial("TK", rows.map((r) => r.ticket_no)),
      status: "open",
      priority: "medium",
      category: "technical",
    })}
  />
);

/* ---------------------------------- STAFF --------------------------------- */
export const StaffAdmin = () => (
  <ResourcePage
    table="isp_staff"
    title="Staff Management"
    singular="Staff"
    searchKeys={["full_name", "phone", "email", "role_title", "area"]}
    columns={() => [
      { key: "full_name", label: "Member", render: (r) => (
        <span className="flex items-center gap-3"><Avatar name={r.full_name} />
          <span><span className="block font-semibold">{r.full_name}</span><span className="block text-xs text-muted-foreground">{r.role_title}</span></span>
        </span>
      ) },
      { key: "phone", label: "Phone", hideOnMobile: true, render: (r) => r.phone ?? "—" },
      { key: "email", label: "Email", hideOnMobile: true, render: (r) => r.email ?? "—" },
      { key: "area", label: "Area", hideOnMobile: true, render: (r) => r.area ?? "—" },
      { key: "is_active", label: "Status", render: (r) => <Pill tone={r.is_active ? "green" : "gray"}>{r.is_active ? "Active" : "Inactive"}</Pill> },
    ]}
    fields={[
      { name: "full_name", label: "Full name", required: true },
      { name: "role_title", label: "Role", required: true },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "email", label: "Email", type: "email" },
      { name: "area", label: "Area" },
      { name: "is_active", label: "Status", type: "select", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] },
    ]}
    defaults={() => ({ role_title: "Field Engineer", is_active: "true" })}
  />
);
