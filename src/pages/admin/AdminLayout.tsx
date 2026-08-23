import { ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, Package, Cable, ReceiptIndianRupee, LifeBuoy, Activity,
  BarChart3, UserCog, Settings, ScrollText, LogOut, ExternalLink, Menu, X, Bell,
  MessageSquare, Search, ChevronDown, Plus, FileText, Headphones, ShieldCheck, AlertTriangle, PanelLeftClose
} from "lucide-react";
import { usePlatformSettings, useAdminRenewalInfo } from "@/hooks/usePlatformSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRows } from "@/hooks/useIsp";
import { Avatar } from "@/components/admin/kit";
import { brand } from "@/data/chakra";
import logo from "@/assets/chakra-logo.png";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/plans", label: "Plans & Packages", icon: Package },
  { to: "/admin/connections", label: "Connections", icon: Cable },
  { to: "/admin/invoices", label: "Invoices & Payments", icon: ReceiptIndianRupee },
  { to: "/admin/tickets", label: "Tickets & Support", icon: LifeBuoy },
  { to: "/admin/network", label: "Network Monitoring", icon: Activity },
  { to: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/admin/staff", label: "Staff Management", icon: UserCog },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/maintenance", label: "Maintenance Mode", icon: AlertTriangle },
  { to: "/admin/logs", label: "Logs & Activity", icon: ScrollText },
];

const quickActions = [
  { to: "/admin/customers?new=1", label: "Add New Customer", icon: Plus, primary: true },
  { to: "/admin/connections?new=1", label: "Create New Connection", icon: Cable },
  { to: "/admin/invoices?new=1", label: "Generate Invoice", icon: FileText },
];

const bottomItems = items.slice(0, 4);

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, isSuperAdmin, loading, signOut } = useAuth();
  const renewal = useAdminRenewalInfo();
  usePlatformSettings();
  const loc = useLocation();
  const nav = useNavigate();
  const { toast } = useToast();
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notif, setNotif] = useState<null | "bell" | "chat">(null);
  const [q, setQ] = useState("");

  const enabled = !!user && isAdmin;
  const { data: tickets = [] } = useRows<any>(enabled ? "isp_tickets" : "isp_tickets", { order: { column: "created_at" } });
  const { data: customers = [] } = useRows<any>("isp_customers", { order: { column: "created_at" } });
  const { data: invoices = [] } = useRows<any>("isp_invoices", { order: { column: "created_at" } });

  const openTickets = tickets.filter((t: any) => t.status === "open" || t.status === "in_progress");
  const overdue = invoices.filter((i: any) => i.status === "overdue" || i.status === "unpaid");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out: { label: string; sub: string; to: string }[] = [];
    customers.forEach((c: any) => {
      if ([c.full_name, c.phone, c.email, c.address].join(" ").toLowerCase().includes(term))
        out.push({ label: c.full_name, sub: c.phone, to: "/admin/customers" });
    });
    invoices.forEach((i: any) => {
      if (String(i.invoice_no).toLowerCase().includes(term)) out.push({ label: i.invoice_no, sub: "Invoice", to: "/admin/invoices" });
    });
    tickets.forEach((t: any) => {
      if ([t.ticket_no, t.subject].join(" ").toLowerCase().includes(term))
        out.push({ label: t.subject, sub: t.ticket_no, to: "/admin/tickets" });
    });
    return out.slice(0, 8);
  }, [q, customers, invoices, tickets]);

  // Auto-claim admin role if no admin exists yet (first-time setup).
  useEffect(() => {
    if (loading || !user || isAdmin || claiming) return;
    let cancelled = false;
    (async () => {
      setClaiming(true);
      const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
      if (cancelled) return;
      if ((count ?? 0) === 0) {
        const { error } = await (supabase as any).rpc("claim_admin");
        if (!error) {
          toast({ title: "Welcome", description: "Admin access granted." });
          setTimeout(() => window.location.reload(), 400);
          return;
        }
      }
      if (!cancelled) setClaiming(false);
    })();
    return () => { cancelled = true; };
  }, [loading, user, isAdmin, claiming, toast]);

  if (loading || claiming) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/admin/auth" replace state={{ from: loc }} />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-extrabold mb-2">Not authorized</h1>
          <p className="text-muted-foreground mb-6">Your account ({user.email}) doesn't have admin access. Please contact the site administrator.</p>
          <button onClick={signOut} className="px-5 py-2 rounded-full border border-border font-semibold">Sign out</button>
        </div>
      </div>
    );
  }

  const SidebarBody = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <div className="px-4 py-5">
        <a href="/admin" className="block">
          <img src={logo} alt="Chakra Fiber" className={cn("w-auto object-contain", collapsed ? "h-9 mx-auto" : "h-12")} />
        </a>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {!collapsed && <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.18em] text-primary/90">MAIN MENU</p>}
        <div className="space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={onItemClick}
              title={it.label}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  collapsed && "justify-center px-2",
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-white/70 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <it.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{it.label}</span>}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <NavLink
              to="/admin/super"
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold border border-primary/40 mt-1",
                  collapsed && "justify-center px-2",
                  isActive ? "bg-primary text-primary-foreground border-transparent" : "text-primary hover:bg-primary/10"
                )
              }
            >
              <ShieldCheck size={18} />
              {!collapsed && "Super Admin"}
            </NavLink>
          )}
        </div>

        {!collapsed && (
          <>
            <p className="px-3 pt-6 pb-2 text-[10px] font-bold tracking-[0.18em] text-primary/90">QUICK ACTIONS</p>
            <div className="space-y-2">
              {quickActions.map((a) => (
                <button
                  key={a.to}
                  onClick={() => { nav(a.to); onItemClick?.(); }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    a.primary ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-white/5 text-white/80 hover:bg-white/10"
                  )}
                >
                  <a.icon size={16} /> {a.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-white/[0.06] border border-white/10 p-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary grid place-items-center text-primary-foreground shrink-0">
                <Headphones size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">Need Help?</p>
                <p className="text-xs text-primary font-semibold">Contact Support</p>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-xs text-white/70">{brand.phone}</a>
              </div>
            </div>
          </>
        )}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <a href="/" target="_blank" rel="noopener" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/5", collapsed && "justify-center px-2")}>
          <ExternalLink size={16} /> {!collapsed && "View site"}
        </a>
        <button onClick={signOut} className={cn("w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/5", collapsed && "justify-center px-2")}>
          <LogOut size={16} /> {!collapsed && "Sign out"}
        </button>
      </div>
    </>
  );

  const renewalAlert = (() => {
    if (!renewal) return null;
    if (renewal.renewal_dismissed_at) {
      const dismissed = new Date(renewal.renewal_dismissed_at).getTime();
      if (Date.now() - dismissed < 7 * 24 * 3600 * 1000) return null;
    }
    const list: { kind: string; due: string; days: number }[] = [];
    const check = (kind: string, d: string | null) => {
      if (!d) return;
      const days = Math.ceil((new Date(d).getTime() - Date.now()) / (24 * 3600 * 1000));
      if (days <= 30) list.push({ kind, due: d, days });
    };
    check("Hosting", renewal.renewal_hosting_due);
    check("AMC", renewal.renewal_amc_due);
    return list.length ? list : null;
  })();

  const dismissRenewal = async () => {
    await supabase.from("platform_settings").update({ renewal_dismissed_at: new Date().toISOString() }).eq("id", 1);
  };

  return (
    <div className="min-h-screen flex bg-secondary/40">
      {/* DESKTOP SIDEBAR */}
      <aside className={cn("hidden lg:flex shrink-0 flex-col h-screen sticky top-0 bg-[#0d1117] text-white transition-all", collapsed ? "w-[76px]" : "w-[262px]")}>
        <SidebarBody />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center gap-3 px-4 lg:px-6 h-16">
            <button
              onClick={() => (window.innerWidth < 1024 ? setDrawer(true) : setCollapsed((c) => !c))}
              aria-label="Toggle menu"
              className="w-10 h-10 grid place-items-center rounded-xl hover:bg-secondary"
            >
              {collapsed ? <Menu size={20} /> : <PanelLeftClose size={20} className="hidden lg:block" />}
              <Menu size={20} className="lg:hidden" />
            </button>

            <div className="hidden sm:block leading-tight mr-2">
              <p className="text-[11px] text-muted-foreground">Welcome back,</p>
              <p className="font-display font-extrabold text-sm">Admin 👋</p>
            </div>

            <div className="relative flex-1 max-w-xl mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search customers, invoices, tickets..."
                className="w-full rounded-full bg-secondary/70 border border-border pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              />
              {results.length > 0 && (
                <div className="absolute top-full mt-2 inset-x-0 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
                  {results.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => { nav(r.to); setQ(""); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-secondary flex items-center justify-between"
                    >
                      <span className="text-sm font-semibold truncate">{r.label}</span>
                      <span className="text-xs text-muted-foreground">{r.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative">
                <button onClick={() => setNotif(notif === "bell" ? null : "bell")} className="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-secondary" aria-label="Notifications">
                  <Bell size={19} />
                  {!!openTickets.length && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                      {openTickets.length}
                    </span>
                  )}
                </button>
                {notif === "bell" && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl p-2 z-50">
                    <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Open tickets</p>
                    {openTickets.slice(0, 5).map((t: any) => (
                      <button key={t.id} onClick={() => { nav("/admin/tickets"); setNotif(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary">
                        <p className="text-sm font-semibold truncate">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">{t.ticket_no}</p>
                      </button>
                    ))}
                    {!openTickets.length && <p className="px-3 py-4 text-sm text-muted-foreground">All clear 🎉</p>}
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setNotif(notif === "chat" ? null : "chat")} className="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-secondary" aria-label="Pending payments">
                  <MessageSquare size={19} />
                  {!!overdue.length && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                      {overdue.length}
                    </span>
                  )}
                </button>
                {notif === "chat" && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl p-2 z-50">
                    <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Payments pending</p>
                    {overdue.slice(0, 5).map((i: any) => (
                      <button key={i.id} onClick={() => { nav("/admin/invoices"); setNotif(null); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary flex justify-between">
                        <span className="text-sm font-semibold">{i.invoice_no}</span>
                        <span className="text-xs text-primary font-bold">₹{Number(i.amount ?? 0) + Number(i.tax ?? 0)}</span>
                      </button>
                    ))}
                    {!overdue.length && <p className="px-3 py-4 text-sm text-muted-foreground">No dues pending.</p>}
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-xl px-1.5 sm:px-2 py-1.5 hover:bg-secondary">
                  <Avatar name={user.email ?? "Admin"} size={36} />
                  <span className="hidden md:block text-left leading-tight">
                    <span className="block text-sm font-bold">Admin</span>
                    <span className="block text-[11px] text-muted-foreground">{isSuperAdmin ? "Super Administrator" : "Administrator"}</span>
                  </span>
                  <ChevronDown size={16} className="hidden md:block text-muted-foreground" />
                </button>
                {menu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl p-2 z-50">
                    <p className="px-3 py-2 text-xs text-muted-foreground truncate">{user.email}</p>
                    <button onClick={() => { nav("/admin/settings"); setMenu(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary text-sm font-semibold">Settings</button>
                    <a href="/" target="_blank" rel="noopener" className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm font-semibold">View site</a>
                    <button onClick={signOut} className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary text-sm font-semibold text-destructive">Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER */}
        {drawer && (
          <div className="lg:hidden fixed inset-0 z-[70]" onClick={() => setDrawer(false)}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <aside onClick={(e) => e.stopPropagation()} className="absolute top-0 left-0 h-full w-[84%] max-w-[300px] bg-[#0d1117] text-white flex flex-col shadow-2xl">
              <button onClick={() => setDrawer(false)} className="absolute top-4 right-3 w-9 h-9 grid place-items-center rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
              <SidebarBody onItemClick={() => setDrawer(false)} />
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1500px] w-full mx-auto pb-24 lg:pb-10">
          {renewalAlert && (
            <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 p-4 flex items-start gap-3">
              <AlertTriangle className="shrink-0 mt-0.5" size={20} />
              <div className="flex-1 text-sm">
                <p className="font-bold mb-1">Renewal reminder</p>
                <ul className="space-y-0.5">
                  {renewalAlert.map((r) => (
                    <li key={r.kind}>
                      <strong>{r.kind}</strong> renewal {r.days < 0 ? `is overdue by ${Math.abs(r.days)} day(s)` : r.days === 0 ? "is due today" : `is due in ${r.days} day(s)`} ({new Date(r.due).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={dismissRenewal} className="text-xs font-semibold hover:underline whitespace-nowrap">Remind me later</button>
            </div>
          )}
          {children}
          <p className="mt-10 pt-6 border-t border-border flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Chakra Fibernet. All rights reserved.</span>
            <span>Version 1.0.0</span>
          </p>
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d1117] text-white border-t border-white/10 grid grid-cols-5">
          {bottomItems.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                cn("flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold", isActive ? "text-primary" : "text-white/70")
              }
            >
              <it.icon size={18} />
              <span className="truncate max-w-[64px]">{it.label.split(" ")[0]}</span>
            </NavLink>
          ))}
          <button onClick={() => setDrawer(true)} className="flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold text-white/70">
            <Menu size={18} />
            <span>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
