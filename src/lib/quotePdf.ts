import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

type Lead = any;
type Settings = any;

export const generateQuotePdf = async (lead: Lead, settings: Settings): Promise<{ url: string; blob: Blob } | null> => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  // Header bar
  doc.setFillColor(15, 23, 42); // navy
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(settings.company_name || "Sri Kanish Enterprises", margin, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(settings.tagline || "", margin, 60);
  doc.setFontSize(9);
  doc.text(`${settings.address_line1 || ""}, ${settings.address_line2 || ""}, ${settings.city || ""}`, margin, 76);

  // Quote ribbon
  doc.setFillColor(255, 122, 47); // orange
  doc.rect(W - 180, 28, 132, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("QUOTE", W - 168, 52);

  y = 130;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Quote No.", margin, y);
  doc.text("Date", margin + 200, y);
  doc.setFont("helvetica", "normal");
  doc.text(`SKE-${String(lead.id).slice(0, 8).toUpperCase()}`, margin, y + 16);
  doc.text(new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), margin + 200, y + 16);

  y += 56;
  // Bill to box
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, W - margin * 2, 90, 6, 6, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("PREPARED FOR", margin + 14, y + 20);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.text(lead.name || "", margin + 14, y + 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const lines = [
    lead.company || null,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.email ? `Email: ${lead.email}` : null,
  ].filter(Boolean) as string[];
  lines.forEach((t, i) => doc.text(t, margin + 14, y + 58 + i * 14));

  y += 116;
  // Items table
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y, W - margin * 2, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("DESCRIPTION", margin + 12, y + 18);
  doc.text("QUANTITY", margin + 280, y + 18);
  doc.text("AMOUNT", W - margin - 80, y + 18);

  y += 28;
  doc.setFont("helvetica", "normal");
  const product = lead.product_interest || "Custom labels & tags";
  const qty = lead.quantity || "—";
  const amount = lead.estimated_value ? `INR ${Number(lead.estimated_value).toLocaleString("en-IN")}` : "On request";

  doc.text(product, margin + 12, y + 22, { maxWidth: 250 });
  doc.text(qty, margin + 280, y + 22);
  doc.text(amount, W - margin - 80, y + 22);

  if (lead.message) {
    const wrapped = doc.splitTextToSize(`Brief: ${lead.message}`, W - margin * 2 - 20);
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(wrapped, margin + 12, y + 46);
  }

  y += 100;
  // Total
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1);
  doc.line(W - margin - 200, y, W - margin, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL", W - margin - 200, y + 22);
  doc.setTextColor(255, 122, 47);
  doc.text(amount, W - margin - 80, y + 22);

  // Footer
  const fy = doc.internal.pageSize.getHeight() - 80;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, fy, W - margin, fy);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(`Phone: ${settings.phone_primary || ""}   Email: ${settings.email || ""}`, margin, fy + 18);
  if (settings.gstin) doc.text(`GSTIN: ${settings.gstin}`, margin, fy + 32);
  doc.text("Validity: 30 days from quote date. Prices subject to artwork & material confirmation.", margin, fy + 50);

  const blob = doc.output("blob");

  // Upload to storage
  const path = `${lead.id}/quote-${Date.now()}.pdf`;
  const { error } = await supabase.storage.from("quotes").upload(path, blob, {
    contentType: "application/pdf",
    upsert: false,
    cacheControl: "3600",
  });
  if (error) {
    console.error("Upload failed", error);
    return { url: "", blob };
  }
  // Bucket is private — create a long-lived signed URL (1 year) for sharing with customers.
  const { data: signed } = await supabase.storage.from("quotes").createSignedUrl(path, 60 * 60 * 24 * 365);
  const url = signed?.signedUrl ?? "";
  // Save URL on lead
  await supabase.from("leads").update({ quote_pdf_url: url }).eq("id", lead.id);
  return { url, blob };
};