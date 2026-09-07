import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { CreditCard, Headphones, IdCard, Loader2, LogOut, Receipt, Wifi } from "lucide-react";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { brand } from "@/data/chakra";
import { dateFmt, dateTimeFmt, inr, pretty } from "@/lib/isp";

type Row = Record<string, any>;

const CustomerAccount = () => {
  const nav = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [ready, setReady] = useState(false);
  const [customer, setCustomer] = useState<Row | null>(null);
  const [connection, setConnection] = useState<Row | null>(null);
  const [plan, setPlan] = useState<Row | null>(null);
  const [invoices, setInvoices] = useState<Row[]>([]);
  const [payments, setPayments] = useState<Row[]>([]);
  const [tickets, setTickets] = useState<Row[]>([]);
  const [upi, setUpi] = useState<{ id: string | null; name: string | null }>({ id: null, name: null });
  const [ticket, setTicket] = useState({ subject: "", category: "technical", description: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav("/customer-login", { replace: true });
  }, [loading, user, nav]);

  const load = async (uid: string) => {
    const { data: profile } = await supabase
      .from("customer_profiles")
      .select("customer_id")
      .eq("id", uid)
      .maybeSingle();
    const cid = (profile as Row | null)?.customer_id as string | undefined;
    const { data: settings } = await supabase.from("site_settings").select("upi_id, upi_payee_name").eq("id", 1).maybeSingle();
    setUpi({ id: (settings as Row | null)?.upi_id ?? null, name: (settings as Row | null)?.upi_payee_name ?? null });

    if (!cid) {
      setReady(true);
      return;
    }
    const [c, conn, inv, pay, tk] = await Promise.all([
      supabase.from("isp_customers").select("*").eq("id", cid).maybeSingle(),
      supabase.from("isp_connections").select("*").eq("customer_id", cid).order("created_at", { ascending: false }).limit(1),
      supabase.from("isp_invoices").select("*").eq("customer_id", cid).order("created_at", { ascending: false }).limit(24),
      supabase.from("isp_payments").select("*").eq("customer_id", cid).order("paid_at", { ascending: false }).limit(12),
      supabase.from("isp_tickets").select("*").eq("customer_id", cid).order("created_at", { ascending: false }).limit(12),
    ]);
    setCustomer((c.data as Row) ?? null);
    const connection0 = ((conn.data ?? []) as Row[])[0] ?? null;
    setConnection(connection0);
    setInvoices((inv.data ?? []) as Row[]);
    setPayments((pay.data ?? []) as Row[]);
    setTickets((tk.data ?? []) as Row[]);
    if (connection0?.plan_id) {
      const { data: p } = await supabase.from("isp_plans").select("*").eq("id", connection0.plan_id).maybeSingle();
      setPlan((p as Row) ?? null);
    }
    setReady(true);
  };

  useEffect(() => {
    if (user) load(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const dueInvoice = useMemo(
    () => invoices.find((i) => ["unpaid", "sent", "overdue", "draft"].includes(String(i.status))),
    [invoices]
  );
  const dueAmount = dueInvoice ? Number(dueInvoice.amount ?? 0) + Number(dueInvoice.tax_amount ?? 0) : 0;
  const payLink: string | null = dueInvoice?.payment_link || customer?.payment_link || null;
  const upiLink =
    upi.id
      ? `upi://pay?pa=${encodeURIComponent(upi.id)}&pn=${encodeURIComponent(upi.name || brand.name)}&cu=INR${
          dueAmount > 0 ? `&am=${dueAmount.toFixed(2)}` : ""
        }${dueInvoice?.invoice_no ? `&tn=${encodeURIComponent(String(dueInvoice.invoice_no))}` : ""}`
      : null;

  const raiseTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    if (!ticket.subject.trim()) return toast.error("Please describe the issue in the subject.");
    setBusy(true);
    const { error } = await supabase.from("isp_tickets").insert({
      customer_id: customer.id,
      connection_id: connection?.id ?? null,
      subject: ticket.subject.trim().slice(0, 160),
      description: ticket.description.trim().slice(0, 2000) || null,
      category: ticket.category,
      priority: "medium",
      status: "open",
    } as never);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Support request submitted. Our team will contact you soon.");
    setTicket({ subject: "", category: "technical", description: "" });
    if (user) load(user.id);
  };

  const card = "rounded-2xl glass-dark p-4";
  const field = "w-full rounded-2xl bg-white/8 border border-white/15 px-3.5 py-3 text-sm outline-none placeholder:text-white/40 focus:border-accent/60";

  return (
    <>
      <Seo title="My Account | Chakra Fiber" description="View your Chakra Fiber plan, bills, payments and support requests." />
      <section className="gradient-navy text-white pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="relative container-luxe max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold">
                {customer?.full_name || "My Account"}
              </h1>
              <p className="mt-1.5 text-sm text-white/60">
                Customer ID: {customer?.customer_code || "—"}
              </p>
            </div>
            <button onClick={() => { signOut(); nav("/"); }} className="btn-glass text-xs px-4 py-2.5">
              <LogOut size={14} /> Sign out
            </button>
          </div>

          {!ready ? (
            <div className="mt-10 flex items-center gap-2 text-sm text-white/60">
              <Loader2 size={16} className="animate-spin" /> Loading your details…
            </div>
          ) : !customer ? (
            <div className="mt-8 rounded-3xl glass-dark p-6 text-sm text-white/70">
              We couldn't find your connection details. Please call{" "}
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-accent font-semibold">{brand.phone}</a>.
            </div>
          ) : (
            <>
              <div className="mt-6 grid sm:grid-cols-3 gap-3">
                <div className={card}>
                  <Wifi size={18} className="text-accent" />
                  <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Current plan</div>
                  <div className="font-display font-bold">{plan?.name || "Not assigned"}</div>
                  {plan?.speed_mbps ? <div className="text-xs text-white/55">{plan.speed_mbps} Mbps</div> : null}
                </div>
                <div className={card}>
                  <IdCard size={18} className="text-accent" />
                  <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Connection</div>
                  <div className="font-display font-bold">{pretty(connection?.status ?? customer.status)}</div>
                  <div className="text-xs text-white/55">Since {dateFmt(connection?.activated_on ?? customer.joined_on)}</div>
                </div>
                <div className={card}>
                  <Receipt size={18} className="text-accent" />
                  <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Amount due</div>
                  <div className="font-display font-bold">{dueInvoice ? inr(dueAmount) : "No dues"}</div>
                  {dueInvoice?.due_date ? <div className="text-xs text-white/55">Due {dateFmt(dueInvoice.due_date)}</div> : null}
                </div>
              </div>

              {/* Pay */}
              <div className="mt-6 rounded-3xl glass-dark p-5 sm:p-7">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <CreditCard size={18} className="text-accent" /> Pay your bill
                </h2>
                {payLink || upiLink ? (
                  <div className="mt-4 grid sm:grid-cols-2 gap-5 items-center">
                    <div className="space-y-3">
                      {payLink && (
                        <a href={payLink} target="_blank" rel="noopener noreferrer" className="btn-orange justify-center text-sm w-full">
                          Pay {dueAmount > 0 ? inr(dueAmount) : "now"} online
                        </a>
                      )}
                      {upiLink && (
                        <>
                          <a href={upiLink} className="btn-glass justify-center text-sm w-full">Pay via UPI app</a>
                          <p className="text-xs text-white/55">UPI ID: <span className="text-accent font-semibold">{upi.id}</span></p>
                        </>
                      )}
                      <p className="text-xs text-white/45">After paying, your bill status is updated by our team.</p>
                    </div>
                    {upiLink && (
                      <div className="justify-self-center rounded-2xl bg-white p-3">
                        <QRCodeCanvas value={upiLink} size={148} />
                        <p className="mt-2 text-center text-[11px] font-semibold text-[#0d1425]">Scan to pay</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/60">
                    No payment link has been set for your account yet. Please call{" "}
                    <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-accent font-semibold">{brand.phone}</a>.
                  </p>
                )}
              </div>

              {/* Bills */}
              <div className="mt-6 rounded-3xl glass-dark p-5 sm:p-7">
                <h2 className="font-display text-lg font-bold">Bills &amp; payments</h2>
                {invoices.length === 0 && payments.length === 0 ? (
                  <p className="mt-3 text-sm text-white/60">No bills raised yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-white/10">
                    {invoices.map((i) => (
                      <li key={i.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                        <span>
                          <span className="block font-semibold">{i.invoice_no || "Invoice"}</span>
                          <span className="block text-xs text-white/50">
                            {dateFmt(i.period_start)} – {dateFmt(i.period_end)}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="block font-bold">{inr(Number(i.amount ?? 0) + Number(i.tax_amount ?? 0))}</span>
                          <span className="block text-xs text-white/50">{pretty(i.status)}</span>
                        </span>
                      </li>
                    ))}
                    {payments.map((p) => (
                      <li key={p.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                        <span>
                          <span className="block font-semibold">Payment received</span>
                          <span className="block text-xs text-white/50">{dateTimeFmt(p.paid_at)} · {pretty(p.method)}</span>
                        </span>
                        <span className="font-bold text-emerald-300">{inr(p.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Support */}
              <div className="mt-6 rounded-3xl glass-dark p-5 sm:p-7">
                <h2 className="font-display text-lg font-bold flex items-center gap-2">
                  <Headphones size={18} className="text-accent" /> Raise a support request
                </h2>
                <form onSubmit={raiseTicket} className="mt-4 space-y-3.5">
                  <input className={field} maxLength={160} placeholder="Subject (e.g. Internet not working)" value={ticket.subject} onChange={(e) => setTicket((t) => ({ ...t, subject: e.target.value }))} />
                  <select className={field} value={ticket.category} onChange={(e) => setTicket((t) => ({ ...t, category: e.target.value }))}>
                    {["technical", "billing", "installation", "relocation", "other"].map((c) => (
                      <option key={c} value={c} className="text-black">{pretty(c)}</option>
                    ))}
                  </select>
                  <textarea className={field} rows={4} maxLength={2000} placeholder="Tell us more about the issue" value={ticket.description} onChange={(e) => setTicket((t) => ({ ...t, description: e.target.value }))} />
                  <button type="submit" disabled={busy} className="btn-orange justify-center text-sm disabled:opacity-60">
                    {busy && <Loader2 size={16} className="animate-spin" />} Submit request
                  </button>
                </form>

                {tickets.length > 0 && (
                  <ul className="mt-5 divide-y divide-white/10">
                    {tickets.map((t) => (
                      <li key={t.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                        <span>
                          <span className="block font-semibold">{t.subject}</span>
                          <span className="block text-xs text-white/50">{t.ticket_no ? `${t.ticket_no} · ` : ""}{dateTimeFmt(t.created_at)}</span>
                        </span>
                        <span className="text-xs text-white/70">{pretty(t.status)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="mt-5 text-xs text-white/50">
                Your details are maintained by our staff. To update your name, address or plan, call{" "}
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-accent font-semibold">{brand.phone}</a> or{" "}
                <Link to="/contact" className="text-accent font-semibold">contact us</Link>.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default CustomerAccount;
