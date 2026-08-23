import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, MessageCircle, Download } from "lucide-react";
import jsPDF from "jspdf";
import { site, productCategories } from "@/data/site";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notifyLead";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name must be under 80 characters"),
  company: z.string().trim().max(100, "Company name too long").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number too long")
    .regex(/^[0-9+\-()\s]+$/, "Only digits, spaces and + - ( ) allowed"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(120, "Email too long")
    .optional()
    .or(z.literal("")),
  product: z.string().min(1, "Pick a product category"),
  quantity: z
    .string()
    .trim()
    .min(1, "How many units?")
    .max(20, "Quantity too long"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (min 10 chars)")
    .max(800, "Message must be under 800 characters"),
});

type FormValues = z.infer<typeof schema>;

// --- Lead tracking helpers --------------------------------------------------
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const getUtmParams = () => {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
    const v = sp.get(k);
    if (v) out[k] = v;
  });
  return out;
};

const buildLeadId = () =>
  `SK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const QuoteForm = () => {
  const [submitted, setSubmitted] = useState<(FormValues & { leadId: string; submittedAt: string }) | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", phone: "", email: "", product: "", quantity: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const meta = { leadId: buildLeadId(), submittedAt: new Date().toLocaleString() };
    const utm = getUtmParams();
    const productSlug = slugify(values.product);
    const payload = {
      name: values.name,
      email: values.email || null,
      phone: values.phone,
      company: values.company || null,
      product_interest: values.product,
      quantity: values.quantity,
      message: `[${meta.leadId}] ${values.message}`,
      source: "quote_form" as const,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      utm_source: utm.utm_source || "website",
      utm_medium: utm.utm_medium || "quote_form",
      utm_campaign: utm.utm_campaign || `quote-${productSlug}`,
      utm_content: utm.utm_content || productSlug,
      utm_term: utm.utm_term || null,
    };
    const { error } = await supabase.from("leads").insert(payload);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    notifyLead(payload);
    toast({ title: "Quote request received", description: "Our sales team will respond shortly." });
    setSubmitted({ ...values, ...meta });
  };

  const downloadPdf = () => {
    if (!submitted) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const M = 48;
    let y = M;

    // Brand bar
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, W, 90, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("SRI KANISH ENTERPRISES", M, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Premium Labels · Hang Tags · Apparel Branding", M, 62);
    doc.setTextColor(247, 138, 47);
    doc.setFont("helvetica", "bold");
    doc.text("QUOTE REQUEST SUMMARY", W - M, 42, { align: "right" });
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(submitted.submittedAt, W - M, 60, { align: "right" });

    y = 130;
    doc.setTextColor(15, 23, 42);

    // Lead ID box
    doc.setFillColor(247, 138, 47);
    doc.rect(M, y - 18, 240, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`LEAD ID:  ${submitted.leadId}`, M + 12, y);
    y += 36;

    doc.setTextColor(15, 23, 42);

    const row = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 130);
      doc.text(label.toUpperCase(), M, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      const lines = doc.splitTextToSize(value || "—", W - M * 2);
      doc.text(lines, M, y + 16);
      y += 16 + lines.length * 14 + 14;
      doc.setDrawColor(230, 230, 235);
      doc.line(M, y - 8, W - M, y - 8);
    };

    row("Customer", submitted.name);
    if (submitted.company) row("Company", submitted.company);
    row("Phone / WhatsApp", submitted.phone);
    if (submitted.email) row("Email", submitted.email);
    row("Product", submitted.product);
    row("Quantity", submitted.quantity);
    row("Project brief", submitted.message);

    // Source
    const utm = getUtmParams();
    const src = `${utm.utm_source || "website"} / ${utm.utm_medium || "quote_form"} · ${utm.utm_campaign || "quote-" + slugify(submitted.product)}`;
    row("Source", src);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 60;
    doc.setDrawColor(247, 138, 47);
    doc.setLineWidth(2);
    doc.line(M, footerY, W - M, footerY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 110);
    doc.text(`${site.phone}  ·  ${site.email}  ·  ${site.city}`, M, footerY + 18);
    doc.text("This is a customer enquiry summary — not a binding quote.", M, footerY + 32);

    doc.save(`SriKanish-Quote-${submitted.leadId}.pdf`);
  };

  const fieldBase =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:border-orange focus:bg-white/10 outline-none transition-colors";
  const labelBase = "block text-[11px] uppercase tracking-[0.22em] font-semibold text-white/60 mb-2";
  const errorText = "mt-1.5 text-xs text-orange font-medium";

  return (
    <section className="py-24 md:py-32 bg-navy-deep text-white relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-orange/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-orange/10 blur-3xl" />

      <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-orange mb-4">Get a quote</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6">
            Tell us about your <span className="text-orange">project.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
            Share your specs and our sales team will respond within working hours with pricing, MOQ and lead time.
          </p>

          <ul className="space-y-4 text-sm">
            {[
              "Sampling in 2–3 days",
              "Pantone-accurate weave & print",
              "Export-grade compliance",
              "Direct line to production team",
            ].map((b) => (
              <li key={b} className="flex items-center gap-3 text-white/85">
                <CheckCircle2 size={18} className="text-orange shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-orange border-b border-orange/40 pb-1 hover:border-orange transition"
          >
            <MessageCircle size={16} /> Or chat with us directly
          </a>
        </div>

        <div className="lg:col-span-7">
          <div className="relative rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-6 md:p-10 shadow-card">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-orange/15 flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-orange" />
                  </div>
                  <h3 className="font-display text-3xl font-extrabold mb-3">
                    Thank you, {submitted.name.split(" ")[0]}!
                  </h3>
                  <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
                    Your enquiry for <span className="text-orange font-semibold">{submitted.product}</span> is now in our sales CRM. Our team typically responds within a few working hours.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={downloadPdf}
                      className="btn-orange"
                    >
                      Download PDF <Download size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSubmitted(null);
                        reset();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold border-2 border-white/30 text-white hover:bg-white hover:text-navy-deep transition"
                    >
                      Send another
                    </button>
                  </div>
                  <p className="mt-6 text-xs text-white/40">
                    Lead ID: <span className="text-white/70 font-mono">{submitted.leadId}</span> · {submitted.submittedAt}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid sm:grid-cols-2 gap-5"
                  noValidate
                >
                  <div>
                    <label htmlFor="qf-name" className={labelBase}>Full name *</label>
                    <input id="qf-name" type="text" autoComplete="name" maxLength={80} className={fieldBase} {...register("name")} />
                    {errors.name && <p className={errorText}>{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="qf-company" className={labelBase}>Company</label>
                    <input id="qf-company" type="text" autoComplete="organization" maxLength={100} className={fieldBase} {...register("company")} />
                    {errors.company && <p className={errorText}>{errors.company.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="qf-phone" className={labelBase}>Phone / WhatsApp *</label>
                    <input id="qf-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={20} className={fieldBase} {...register("phone")} />
                    {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="qf-email" className={labelBase}>Email</label>
                    <input id="qf-email" type="email" autoComplete="email" maxLength={120} className={fieldBase} {...register("email")} />
                    {errors.email && <p className={errorText}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="qf-product" className={labelBase}>Product *</label>
                    <select id="qf-product" className={`${fieldBase} appearance-none`} {...register("product")}>
                      <option value="" className="bg-navy-deep">Select category…</option>
                      {productCategories.map((p) => (
                        <option key={p.slug} value={p.title} className="bg-navy-deep">
                          {p.title}
                        </option>
                      ))}
                      <option value="Other / Custom" className="bg-navy-deep">Other / Custom</option>
                    </select>
                    {errors.product && <p className={errorText}>{errors.product.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="qf-qty" className={labelBase}>Quantity *</label>
                    <input id="qf-qty" type="text" placeholder="e.g. 5,000 pcs" maxLength={20} className={fieldBase} {...register("quantity")} />
                    {errors.quantity && <p className={errorText}>{errors.quantity.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="qf-msg" className={labelBase}>Project brief *</label>
                    <textarea id="qf-msg" rows={4} maxLength={800} placeholder="Material, finish, deadline, artwork status…" className={`${fieldBase} resize-none`} {...register("message")} />
                    {errors.message && <p className={errorText}>{errors.message.message}</p>}
                  </div>
                  <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-white/50 max-w-xs">
                      By sending you agree to be contacted by our sales team about this enquiry.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-orange disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending…" : "Send to Sales Team"} <ArrowUpRight size={18} />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;