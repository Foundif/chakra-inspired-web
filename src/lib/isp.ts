import { supabase } from "@/integrations/supabase/client";

export const inr = (n: number | null | undefined) =>
  "₹" + Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const dateFmt = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const dateTimeFmt = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export type Tone = "green" | "red" | "amber" | "blue" | "gray";

export const toneClass: Record<Tone, string> = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  red: "bg-red-100 text-red-700 border-red-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  gray: "bg-muted text-muted-foreground border-border",
};

export const statusTone = (s: string | null | undefined): Tone => {
  switch (s) {
    case "active":
    case "paid":
    case "resolved":
    case "closed":
      return "green";
    case "inactive":
    case "disconnected":
    case "overdue":
    case "urgent":
      return "red";
    case "suspended":
    case "pending":
    case "unpaid":
    case "open":
    case "high":
      return "amber";
    case "in_progress":
    case "medium":
      return "blue";
    default:
      return "gray";
  }
};

export const pretty = (s: string | null | undefined) =>
  (s ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

/** Best-effort audit trail. Never blocks the UI. */
export const logActivity = async (
  action: string,
  entity?: string,
  entityId?: string | null,
  details?: string
) => {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("isp_activity_log").insert({
      actor_id: data.user?.id ?? null,
      actor_email: data.user?.email ?? null,
      action,
      entity: entity ?? null,
      entity_id: entityId ?? null,
      details: details ?? null,
    } as never);
  } catch {
    /* logging must never break an admin action */
  }
};

export const toCsv = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
};

export const downloadCsv = (filename: string, rows: Record<string, unknown>[]) => {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const nextSerial = (prefix: string, existing: (string | null)[]) => {
  const nums = existing
    .map((v) => Number(String(v ?? "").replace(/\D/g, "")))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 1000) + 1;
  return `${prefix}-${next}`;
};
