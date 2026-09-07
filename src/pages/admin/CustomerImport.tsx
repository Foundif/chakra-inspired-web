import { useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Loader2, Upload } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { Panel, PageHead, Btn } from "@/components/admin/kit";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/isp";

type Parsed = {
  customer_code: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  area: string | null;
  payment_link: string | null;
  status: string;
  joined_on: string;
};

const norm = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, "");
const pick = (row: Record<string, unknown>, keys: string[]) => {
  for (const k of Object.keys(row)) {
    if (keys.includes(norm(k))) {
      const v = row[k];
      if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
    }
  }
  return "";
};

const CustomerImport = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Parsed[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ saved: number } | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setDone(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const today = new Date().toISOString().slice(0, 10);
      let bad = 0;
      const parsed: Parsed[] = [];
      raw.forEach((r) => {
        const code = pick(r, ["customerid", "customercode", "custid", "id", "accountno", "accountnumber", "code"]);
        const name = pick(r, ["name", "fullname", "customername", "customer"]);
        const phone = pick(r, ["phone", "phoneno", "phonenumber", "mobile", "mobileno", "mobilenumber", "contact", "contactno"]).replace(/\D/g, "");
        if (!code || !name || phone.length < 10) {
          bad += 1;
          return;
        }
        parsed.push({
          customer_code: code,
          full_name: name,
          phone,
          email: pick(r, ["email", "emailid", "mail"]) || null,
          address: pick(r, ["address", "installationaddress", "location"]) || null,
          area: pick(r, ["area", "locality", "zone"]) || null,
          payment_link: pick(r, ["paymentlink", "paylink", "paymenturl", "link"]) || null,
          status: (pick(r, ["status"]) || "active").toLowerCase(),
          joined_on: today,
        });
      });
      setRows(parsed);
      setSkipped(bad);
      if (!parsed.length) toast({ title: "Nothing to import", description: "No rows had a customer ID, name and 10-digit phone number.", variant: "destructive" });
    } catch (err) {
      toast({ title: "Could not read the file", description: err instanceof Error ? err.message : "Unsupported file", variant: "destructive" });
    }
  };

  const importRows = async () => {
    if (!rows.length) return;
    setBusy(true);
    let saved = 0;
    try {
      const { data: existing } = await supabase.from("isp_customers").select("id, customer_code");
      const byCode = new Map(
        ((existing ?? []) as { id: string; customer_code: string | null }[])
          .filter((c) => c.customer_code)
          .map((c) => [c.customer_code!.toLowerCase(), c.id])
      );

      for (const r of rows) {
        const id = byCode.get(r.customer_code.toLowerCase());
        const valid = ["lead", "active", "suspended", "closed"].includes(r.status) ? r.status : "active";
        const payload = { ...r, status: valid };
        const { error } = id
          ? await (supabase.from("isp_customers") as any).update(payload).eq("id", id)
          : await (supabase.from("isp_customers") as any).insert(payload);
        if (error) throw error;
        saved += 1;
      }
      await logActivity("imported", "isp_customers", null, `${saved} customers imported from ${fileName}`);
      setDone({ saved });
      setRows([]);
      toast({ title: "Import complete", description: `${saved} customer records added or updated.` });
    } catch (err) {
      toast({ title: "Import stopped", description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <PageHead title="Import Customers" crumbs={["Customers", "Import"]} />
      <Panel className="p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Upload your Excel (.xlsx) or CSV file. Columns are matched by name — <strong>Customer ID</strong>,{" "}
          <strong>Name</strong> and <strong>Phone</strong> are required. Optional: Email, Address, Area, Payment Link,
          Status. Existing customers with the same customer ID are updated, not duplicated.
        </p>

        <label className="mt-5 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/50 transition-colors">
          <Upload size={22} className="text-primary" />
          <span className="text-sm font-semibold">{fileName || "Choose Excel or CSV file"}</span>
          <span className="text-xs text-muted-foreground">.xlsx, .xls or .csv</span>
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFile} />
        </label>

        {done && (
          <p className="mt-4 text-sm font-semibold text-emerald-600">{done.saved} customer records saved.</p>
        )}

        {rows.length > 0 && (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-primary" /> {rows.length} ready to import
              </span>
              {skipped > 0 && <span className="text-xs text-muted-foreground">{skipped} row(s) skipped — missing ID, name or phone</span>}
              <Btn onClick={importRows} disabled={busy}>
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Import now
              </Btn>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    {["Customer ID", "Name", "Phone", "Area", "Payment link"].map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 25).map((r, i) => (
                    <tr key={`${r.customer_code}-${i}`} className="border-t border-border">
                      <td className="px-3 py-2 font-medium">{r.customer_code}</td>
                      <td className="px-3 py-2">{r.full_name}</td>
                      <td className="px-3 py-2">{r.phone}</td>
                      <td className="px-3 py-2">{r.area ?? "—"}</td>
                      <td className="px-3 py-2 max-w-[220px] truncate">{r.payment_link ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 25 && <p className="mt-2 text-xs text-muted-foreground">Showing first 25 of {rows.length} rows.</p>}
          </>
        )}
      </Panel>
    </AdminLayout>
  );
};

export default CustomerImport;
