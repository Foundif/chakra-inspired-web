import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useRows } from "@/hooks/useIsp";
import { useToast } from "@/hooks/use-toast";
import {
  buildMastersXml,
  buildReceiptsXml,
  buildSalesXml,
  defaultTallyConfig,
  downloadXml,
  type TallyConfig,
} from "@/lib/tally";
import { BookOpenCheck, Download, FileSpreadsheet, ReceiptIndianRupee, Users } from "lucide-react";

const loadCfg = (): TallyConfig => {
  try {
    return { ...defaultTallyConfig, ...JSON.parse(localStorage.getItem("tally_config") ?? "{}") };
  } catch {
    return defaultTallyConfig;
  }
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const TallyExport = () => {
  const { toast } = useToast();
  const [cfg, setCfg] = useState<TallyConfig>(loadCfg);
  const now = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const [from, setFrom] = useState(iso(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [to, setTo] = useState(iso(now));

  const { data: customers = [] } = useRows<any>("isp_customers");
  const { data: invoices = [] } = useRows<any>("isp_invoices");
  const { data: payments = [] } = useRows<any>("isp_payments");

  const custName = (id: string) => customers.find((c: any) => c.id === id)?.full_name ?? "Unknown Customer";
  const inRange = (d?: string) => !!d && d.slice(0, 10) >= from && d.slice(0, 10) <= to;

  const salesRows = useMemo(
    () =>
      invoices
        .filter((i: any) => inRange(i.created_at) && !["draft", "cancelled"].includes(i.status))
        .map((i: any) => ({ invoice: i, customer: custName(i.customer_id) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoices, customers, from, to]
  );

  const receiptRows = useMemo(
    () =>
      payments
        .filter((p: any) => inRange(p.paid_at ?? p.created_at))
        .map((p: any) => ({
          payment: p,
          customer: custName(p.customer_id),
          invoiceNo: invoices.find((i: any) => i.id === p.invoice_id)?.invoice_no,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [payments, invoices, customers, from, to]
  );

  const partyNames = useMemo(
    () => Array.from(new Set([...salesRows.map((r) => r.customer), ...receiptRows.map((r) => r.customer)])),
    [salesRows, receiptRows]
  );

  const salesTotal = salesRows.reduce((s, r) => s + Number(r.invoice.amount ?? 0) + Number(r.invoice.tax_amount ?? 0), 0);
  const receiptsTotal = receiptRows.reduce((s, r) => s + Number(r.payment.amount ?? 0), 0);

  const setField = (k: keyof TallyConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...cfg, [k]: e.target.value };
    setCfg(next);
    localStorage.setItem("tally_config", JSON.stringify(next));
  };

  const stamp = `${from}_to_${to}`;
  const dl = (kind: "masters" | "sales" | "receipts") => {
    if (kind !== "masters" && !(kind === "sales" ? salesRows.length : receiptRows.length))
      return toast({ title: "Nothing to export", description: "No records found in the selected period.", variant: "destructive" });
    if (kind === "masters") downloadXml(`tally-ledgers-${stamp}.xml`, buildMastersXml(partyNames, cfg));
    if (kind === "sales") downloadXml(`tally-sales-${stamp}.xml`, buildSalesXml(salesRows, cfg));
    if (kind === "receipts") downloadXml(`tally-receipts-${stamp}.xml`, buildReceiptsXml(receiptRows, cfg));
    toast({ title: "Tally XML downloaded", description: "Import it in TallyPrime via Import Data." });
  };

  const cfgFields: { key: keyof TallyConfig; label: string; help?: string }[] = [
    { key: "company", label: "Tally company name", help: "Must exactly match the company open in TallyPrime." },
    { key: "salesLedger", label: "Sales ledger" },
    { key: "gstLedger", label: "GST / tax ledger" },
    { key: "cashLedger", label: "Cash ledger" },
    { key: "bankLedger", label: "Bank ledger (UPI, card, netbanking, cheque)" },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-extrabold mb-1">Tally Integration</h1>
      <p className="text-muted-foreground mb-6">
        Export invoices and payments as TallyPrime-ready XML vouchers and ledgers.
      </p>

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: ReceiptIndianRupee, label: "Sales vouchers", value: `${salesRows.length}`, sub: inr(salesTotal) },
          { icon: FileSpreadsheet, label: "Receipt vouchers", value: `${receiptRows.length}`, sub: inr(receiptsTotal) },
          { icon: Users, label: "Customer ledgers", value: `${partyNames.length}`, sub: "Sundry Debtors" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <s.icon size={20} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-extrabold">
                {s.value} <span className="text-sm font-semibold text-muted-foreground">· {s.sub}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* PERIOD + EXPORT */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-lg font-extrabold mb-4">Export period</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button onClick={() => dl("masters")} className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary px-4 py-3 text-sm font-bold">
              <Download size={16} /> 1. Download Ledgers (Masters)
            </button>
            <button onClick={() => dl("sales")} className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 hover:bg-secondary px-4 py-3 text-sm font-bold">
              <Download size={16} /> 2. Download Sales Vouchers
            </button>
            <button onClick={() => dl("receipts")} className="w-full flex items-center justify-center gap-2 btn-orange">
              <Download size={16} /> 3. Download Receipt Vouchers
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-secondary/50 border border-border p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BookOpenCheck size={14} /> How to import in TallyPrime
            </p>
            <ol className="mt-2 text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Open your company in TallyPrime (name must match the setting here).</li>
              <li>Go to <strong>Import Data → All Masters</strong> and select the ledgers XML first.</li>
              <li>Then <strong>Import Data → Vouchers</strong> for the sales and receipt XML files.</li>
              <li>Review entries in the Day Book — customers appear under Sundry Debtors.</li>
            </ol>
          </div>
        </div>

        {/* LEDGER SETTINGS */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-lg font-extrabold mb-1">Ledger mapping</h2>
          <p className="text-sm text-muted-foreground mb-4">Saved on this device. Masters export auto-creates these ledgers in Tally.</p>
          <div className="space-y-4">
            {cfgFields.map((f) => (
              <div key={f.key}>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{f.label}</label>
                <input value={cfg[f.key]} onChange={setField(f.key)} className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
                {f.help && <p className="text-xs text-muted-foreground mt-1">{f.help}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TallyExport;
