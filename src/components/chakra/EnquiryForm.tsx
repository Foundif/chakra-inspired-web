import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notifyLead";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/hooks/useTracker";
import { leadAttribution } from "@/lib/wa";
import { plans } from "@/data/chakra";

type Props = { variant?: "light" | "dark"; defaultPlan?: string; compact?: boolean };

const EnquiryForm = ({ variant = "light", defaultPlan = "", compact }: Props) => {
  const dark = variant === "dark";
  const { toast } = useToast();
  const { pathname } = useLocation();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", area: "", plan: defaultPlan, message: "" });

  const field = dark
    ? "w-full bg-white/6 border border-white/12 rounded-2xl px-4 py-3 text-white placeholder:text-white/40 focus:border-accent outline-none transition"
    : "w-full bg-secondary/70 border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-accent outline-none transition";
  const lbl = `block text-[11px] uppercase tracking-[0.2em] font-semibold mb-2 ${dark ? "text-white/55" : "text-muted-foreground"}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast({ title: "Please enter your name", variant: "destructive" });
    if (form.phone.replace(/\D/g, "").length < 7) return toast({ title: "Enter a valid phone number", variant: "destructive" });
    setBusy(true);
    const a = leadAttribution();
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      company: form.area.trim() || null,
      product_interest: form.plan || "New Broadband Connection",
      message: form.message.trim() || `New connection enquiry from ${form.area || "website"}`,
      source: "quote_form" as const,
      page_path: pathname,
      utm_source: a.utm_source,
      utm_medium: a.utm_medium === "direct" ? "enquiry_form" : a.utm_medium,
      utm_campaign: a.utm_campaign ?? "new-connection",
      utm_content: a.utm_content ?? "enquiry_form",
    };
    const { error } = await supabase.from("leads").insert(payload);
    setBusy(false);
    if (error) return toast({ title: "Could not send", description: error.message, variant: "destructive" });
    notifyLead(payload);
    trackEvent("form_submit");
    setDone(form.name);
    setForm({ name: "", phone: "", email: "", area: "", plan: defaultPlan, message: "" });
    toast({ title: "Enquiry received", description: "Our team will call you shortly." });
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-accent/12 flex items-center justify-center mb-5">
          <CheckCircle2 size={30} className="text-accent" />
        </div>
        <h3 className={`font-display text-2xl font-extrabold mb-2 ${dark ? "text-white" : ""}`}>Thanks, {done.split(" ")[0]}!</h3>
        <p className={dark ? "text-white/65" : "text-muted-foreground"}>
          Your enquiry is logged. A Chakra Fiber advisor will call you to schedule a feasibility survey.
        </p>
        <button onClick={() => setDone(null)} className="btn-orange mt-6">Send another <ArrowUpRight size={15} /></button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`} noValidate>
      <div>
        <label className={lbl} htmlFor="ef-name">Full name *</label>
        <input id="ef-name" required maxLength={80} autoComplete="name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className={lbl} htmlFor="ef-phone">Phone / WhatsApp *</label>
        <input id="ef-phone" required type="tel" maxLength={20} autoComplete="tel" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div>
        <label className={lbl} htmlFor="ef-email">Email</label>
        <input id="ef-email" type="email" maxLength={120} className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className={lbl} htmlFor="ef-area">Area / Locality</label>
        <input id="ef-area" maxLength={100} placeholder="e.g. Thiruchuli Road" className={field} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className={lbl} htmlFor="ef-plan">Interested in</label>
        <select id="ef-plan" className={`${field} appearance-none`} value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
          <option value="" className={dark ? "bg-navy" : ""}>Select a plan or service…</option>
          {plans.map((p) => (
            <option key={p.id} value={`${p.name} — ${p.speed}`} className={dark ? "bg-navy" : ""}>{p.name} — {p.speed}</option>
          ))}
          <option value="Cable TV / OTT" className={dark ? "bg-navy" : ""}>Cable TV / OTT</option>
          <option value="Telephone Connection" className={dark ? "bg-navy" : ""}>Telephone Connection</option>
          <option value="Business / Corporate" className={dark ? "bg-navy" : ""}>Business / Corporate</option>
        </select>
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className={lbl} htmlFor="ef-msg">Message</label>
        <textarea id="ef-msg" rows={3} maxLength={600} placeholder="Tell us your address landmark or requirement…" className={`${field} resize-none`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <button disabled={busy} className="btn-orange w-full justify-center disabled:opacity-60">
          {busy ? "Sending…" : "Request Callback"} <ArrowUpRight size={16} />
        </button>
        <p className={`text-[11px] text-center mt-3 ${dark ? "text-white/40" : "text-muted-foreground"}`}>
          We'll never share your details. Typical response time: under 30 minutes.
        </p>
      </div>
    </form>
  );
};

export default EnquiryForm;
