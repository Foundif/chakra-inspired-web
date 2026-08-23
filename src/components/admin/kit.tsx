import { ReactNode, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneClass, type Tone } from "@/lib/isp";

/* ---------------------------------- Card ---------------------------------- */
export const Panel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("bg-card rounded-2xl border border-border shadow-sm", className)}>{children}</div>
);

export const PanelHead = ({ title, action }: { title: string; action?: ReactNode }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
    <h2 className="font-display font-bold text-base">{title}</h2>
    {action}
  </div>
);

/* --------------------------------- Badges --------------------------------- */
export const Pill = ({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
      toneClass[tone]
    )}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
    {children}
  </span>
);

/* -------------------------------- Buttons --------------------------------- */
export const Btn = ({
  variant = "ghost",
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" | "soft" }) => (
  <button
    {...rest}
    className={cn(
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50",
      variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
      variant === "ghost" && "border border-border bg-card hover:bg-secondary",
      variant === "soft" && "bg-secondary text-foreground hover:bg-muted",
      variant === "danger" && "bg-destructive text-destructive-foreground hover:opacity-90",
      className
    )}
  >
    {children}
  </button>
);

/* --------------------------------- Inputs --------------------------------- */
export const Field = ({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <label className={cn("block", className)}>
    <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40";

export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...p} className={cn(inputCls, p.className)} />
);
export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...p} className={cn(inputCls, "min-h-[90px]", p.className)} />
);
export const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...p} className={cn(inputCls, "pr-8", p.className)} />
);

export const SearchBox = ({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) => (
  <div className={cn("relative flex-1 min-w-[200px]", className)}>
    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-border bg-background pl-10 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
    />
    {value && (
      <button onClick={() => onChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <X size={14} />
      </button>
    )}
  </div>
);

/* --------------------------------- Modal ---------------------------------- */
export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative w-full bg-card rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl max-h-[92vh] flex flex-col",
          wide ? "sm:max-w-3xl" : "sm:max-w-xl"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-lg hover:bg-secondary">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

/* ------------------------------- Data table ------------------------------- */
export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  loading,
  empty = "No records yet.",
  pageSize = 8,
  onRowClick,
}: {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  empty?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages);
  const slice = useMemo(() => rows.slice((current - 1) * pageSize, current * pageSize), [rows, current, pageSize]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-5 py-3 font-bold", c.hideOnMobile && "hidden md:table-cell", c.className)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-muted-foreground">
                  <Loader2 className="animate-spin inline mr-2" size={16} /> Loading…
                </td>
              </tr>
            )}
            {!loading && !slice.length && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-muted-foreground">
                  {empty}
                </td>
              </tr>
            )}
            {!loading &&
              slice.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onRowClick?.(r)}
                  className={cn("border-b border-border/70 last:border-0 hover:bg-secondary/50", onRowClick && "cursor-pointer")}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-5 py-3.5 align-middle", c.hideOnMobile && "hidden md:table-cell", c.className)}>
                      {c.render ? c.render(r) : String((r as never as Record<string, unknown>)[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {rows.length ? `Showing ${(current - 1) * pageSize + 1}–${Math.min(current * pageSize, rows.length)} of ${rows.length}` : "0 records"}
        </p>
        <div className="flex items-center gap-1">
          <button
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            className="w-8 h-8 grid place-items-center rounded-lg border border-border disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-3 text-xs font-semibold">
            {current} / {pages}
          </span>
          <button
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
            className="w-8 h-8 grid place-items-center rounded-lg border border-border disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Avatar --------------------------------- */
const AVATAR_TONES = [
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
];

export const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
  const tone = AVATAR_TONES[(name.charCodeAt(0) || 0) % AVATAR_TONES.length];
  return (
    <span
      className={cn("inline-grid place-items-center rounded-full font-bold shrink-0", tone)}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials || "?"}
    </span>
  );
};

/* -------------------------------- Page head ------------------------------- */
export const PageHead = ({
  title,
  crumbs,
  actions,
}: {
  title: string;
  crumbs?: string[];
  actions?: ReactNode;
}) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-extrabold">{title}</h1>
      <p className="text-xs text-muted-foreground mt-1">{["Dashboard", ...(crumbs ?? [])].join("  ›  ")}</p>
    </div>
    <div className="flex flex-wrap items-center gap-2">{actions}</div>
  </div>
);
