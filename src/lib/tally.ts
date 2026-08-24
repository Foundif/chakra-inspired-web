// Tally (TallyPrime) integration helpers — generates import-ready XML.
// Import flow in TallyPrime: Import Data → All Masters (ledgers first),
// then Import Data → Vouchers (sales / receipts).

export type TallyConfig = {
  company: string;     // must match the open company name in Tally
  salesLedger: string; // income ledger for internet service revenue
  gstLedger: string;   // output tax ledger
  cashLedger: string;  // cash payments ledger
  bankLedger: string;  // ledger for UPI / card / netbanking / cheque
};

export const defaultTallyConfig: TallyConfig = {
  company: "Chakra Fiber",
  salesLedger: "Internet Service Sales",
  gstLedger: "Output GST",
  cashLedger: "Cash",
  bankLedger: "Bank Account",
};

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const tdate = (d: string | Date) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}`;
};

const money = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

const msg = (inner: string) => `\n      <TALLYMESSAGE xmlns:UDF="TallyUDF">${inner}\n      </TALLYMESSAGE>`;

const envelope = (report: "All Masters" | "Vouchers", company: string, messages: string) => `<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>${report}</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${esc(company)}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>${messages}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

const ledgerEntry = (name: string, amount: number, isDebit: boolean, isParty: boolean) => `
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${esc(name)}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>${isDebit ? "Yes" : "No"}</ISDEEMEDPOSITIVE>
          <ISPARTYLEDGER>${isParty ? "Yes" : "No"}</ISPARTYLEDGER>
          <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
          <AMOUNT>${money(amount)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>`;

const ledgerMaster = (name: string, parent: string) =>
  msg(`
        <LEDGER NAME="${esc(name)}" ACTION="Create">
          <NAME>${esc(name)}</NAME>
          <PARENT>${esc(parent)}</PARENT>
          <ISBILLWISEON>${parent === "Sundry Debtors" ? "Yes" : "No"}</ISBILLWISEON>
          <AFFECTSSTOCK>No</AFFECTSSTOCK>
        </LEDGER>`);

/** Customer ledgers (Sundry Debtors) + the configured income/tax/cash/bank ledgers. */
export const buildMastersXml = (partyNames: string[], cfg: TallyConfig) => {
  const ledgers = [
    ...partyNames.map((n) => ledgerMaster(n, "Sundry Debtors")),
    ledgerMaster(cfg.salesLedger, "Sales Accounts"),
    ledgerMaster(cfg.gstLedger, "Duties & Taxes"),
    ledgerMaster(cfg.cashLedger, "Cash-in-Hand"),
    ledgerMaster(cfg.bankLedger, "Bank Accounts"),
  ];
  return envelope("All Masters", cfg.company, ledgers.join(""));
};

/** One Sales voucher per invoice (party debit, sales + GST credit). */
export const buildSalesXml = (rows: { invoice: any; customer: string }[], cfg: TallyConfig) => {
  const vouchers = rows.map(({ invoice, customer }) => {
    const amount = Number(invoice.amount ?? 0);
    const tax = Number(invoice.tax_amount ?? 0);
    const total = amount + tax;
    const date = tdate(invoice.created_at ?? new Date());
    const entries = [
      ledgerEntry(customer, -total, true, true),
      ledgerEntry(cfg.salesLedger, amount, false, false),
    ];
    if (tax > 0) entries.push(ledgerEntry(cfg.gstLedger, tax, false, false));
    return msg(`
        <VOUCHER VCHTYPE="Sales" ACTION="Create">
          <DATE>${date}</DATE>
          <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
          <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
          <VOUCHERNUMBER>${esc(invoice.invoice_no ?? String(invoice.id).slice(0, 8))}</VOUCHERNUMBER>
          <PARTYLEDGERNAME>${esc(customer)}</PARTYLEDGERNAME>
          <NARRATION>${esc(`Internet service invoice ${invoice.invoice_no ?? ""}`.trim())}</NARRATION>${entries.join("")}
        </VOUCHER>`);
  });
  return envelope("Vouchers", cfg.company, vouchers.join(""));
};

/** One Receipt voucher per payment (cash/bank debit, party credit). */
export const buildReceiptsXml = (
  rows: { payment: any; customer: string; invoiceNo?: string }[],
  cfg: TallyConfig
) => {
  const vouchers = rows.map(({ payment, customer, invoiceNo }) => {
    const amount = Number(payment.amount ?? 0);
    const method = String(payment.method ?? "cash").toLowerCase();
    const depositLedger = method === "cash" ? cfg.cashLedger : cfg.bankLedger;
    const date = tdate(payment.paid_at ?? payment.created_at ?? new Date());
    const ref = invoiceNo ? ` against ${invoiceNo}` : "";
    return msg(`
        <VOUCHER VCHTYPE="Receipt" ACTION="Create">
          <DATE>${date}</DATE>
          <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
          <VOUCHERTYPENAME>Receipt</VOUCHERTYPENAME>
          <VOUCHERNUMBER>${esc(payment.reference ?? `RCPT-${String(payment.id).slice(0, 8)}`)}</VOUCHERNUMBER>
          <PARTYLEDGERNAME>${esc(customer)}</PARTYLEDGERNAME>
          <NARRATION>${esc(`Payment received via ${method}${ref}`)}</NARRATION>${ledgerEntry(depositLedger, -amount, true, false)}${ledgerEntry(customer, amount, false, true)}
        </VOUCHER>`);
  });
  return envelope("Vouchers", cfg.company, vouchers.join(""));
};

export const downloadXml = (filename: string, xml: string) => {
  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
