import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notifyLead";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/hooks/useTracker";
import { useEffect } from "react";
import { leadAttribution } from "@/lib/wa";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20).regex(/^[0-9+\-()\s]+$/, "Invalid characters"),
  email: z.string().trim().email("Invalid email").max(120).optional().or(z.literal("")),
  product: z.string().min(1, "Pick a product"),
  quantity: z.string().trim().min(1).max(20),
  message: z.string().trim().min(5, "Add a brief").max(800),
});
type V = z.infer<typeof schema>;

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

type Props = {
  variant?: "dark" | "light";
  productOptions: { slug: string; title: string }[];
  defaultProduct?: string;
  compact?: boolean;
};

const LeadForm = ({ variant = "light", productOptions, defaultProduct, compact }: Props) => {
  const s = useSettings();
  const { toast } = useToast();
  const [done, setDone] = useState<{ name: string; product: string } | null>(null);
  useEffect(() => { trackEvent("form_open"); }, []);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", phone: "", email: "", product: defaultProduct ?? "", quantity: "", message: "" },
  });

  const onSubmit = async (v: V) => {
    const a = leadAttribution();
    const payload = {
      name: v.name,
      email: v.email || null,
      phone: v.phone,
      company: v.company || null,
      product_interest: v.product,
      quantity: v.quantity,
      message: v.message,
      source: "quote_form" as const,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      utm_source: a.utm_source,
      utm_medium: a.utm_medium === "direct" ? "quote_form" : a.utm_medium,
      utm_campaign: a.utm_campaign ?? `quote-${slugify(v.product)}`,
      utm_term: a.utm_term,
      utm_content: a.utm_content ?? slugify(v.product),
    };
    const { error } = await supabase.from("leads").insert(payload);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    notifyLead(payload);
    trackEvent("form_submit");
    // Open WhatsApp pre-filled, in addition to logging the lead
    const lines = [
      `Hi Sri Kanish team — I'd like a quote.`, ``,
      `Name: ${v.name}`,
      v.company ? `Company: ${v.company}` : null,
      `Phone: ${v.phone}`,
      v.email ? `Email: ${v.email}` : null,
      `Product: ${v.product}`,
      `Quantity: ${v.quantity}`, ``,
      `Brief: ${v.message}`,
    ].filter(Boolean) as string[];
    window.open(`https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
    setDone({ name: v.name, product: v.product });
    reset();
    toast({ title: "Request sent", description: "We've also logged your enquiry — our team will reach out shortly." });
  };

  const dark = variant === "dark";
  const field = dark
    ? "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-orange focus:bg-white/10 outline-none transition"
    : "w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-orange outline-none transition";
  const lbl = dark
    ? "block text-[11px] uppercase tracking-[0.22em] font-semibold text-white/60 mb-2"
    : "block text-[11px] uppercase tracking-[0.22em] font-semibold text-muted-foreground mb-2";
  const err = "mt-1 text-xs text-orange font-medium";

  return (
    <div className={`relative rounded-3xl ${dark ? "bg-white/[0.04] border-white/10" : "bg-card border-border"} backdrop-blur-xl border p-6 md:p-8 shadow-card`}>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-8">
            <div className={`w-14 h-14 mx-auto rounded-full ${dark ? "bg-orange/15" : "bg-orange/10"} flex items-center justify-center mb-5`}>
              <CheckCircle2 size={28} className="text-orange" />
            </div>
            <h3 className={`font-display text-2xl font-extrabold mb-2 ${dark ? "text-white" : "text-foreground"}`}>
              Thanks, {done.name.split(" ")[0]}!
            </h3>
            <p className={`${dark ? "text-white/70" : "text-muted-foreground"} max-w-md mx-auto leading-relaxed mb-6`}>
              Your enquiry for <span className="text-orange font-semibold">{done.product}</span> was logged and WhatsApp opened. We'll reach out shortly.
            </p>
            <button onClick={() => setDone(null)} className="btn-orange">Send another <ArrowUpRight size={16} /></button>
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} className={`grid ${compact ? "" : "sm:grid-cols-2"} gap-4`} noValidate>
            <div>
              <label className={lbl}>Full name *</label>
              <input type="text" autoComplete="name" maxLength={80} className={field} {...register("name")} />
              {errors.name && <p className={err}>{errors.name.message}</p>}
            </div>
            <div>
              <label className={lbl}>Company</label>
              <input type="text" maxLength={100} className={field} {...register("company")} />
            </div>
            <div>
              <label className={lbl}>Phone / WhatsApp *</label>
              <input type="tel" inputMode="tel" maxLength={20} className={field} {...register("phone")} />
              {errors.phone && <p className={err}>{errors.phone.message}</p>}
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input type="email" maxLength={120} className={field} {...register("email")} />
              {errors.email && <p className={err}>{errors.email.message}</p>}
            </div>
            <div>
              <label className={lbl}>Product *</label>
              <select className={`${field} appearance-none`} {...register("product")}>
                <option value="" className={dark ? "bg-navy-deep" : ""}>Select category…</option>
                {productOptions.map((p) => (
                  <option key={p.slug} value={p.title} className={dark ? "bg-navy-deep" : ""}>{p.title}</option>
                ))}
                <option value="Other / Custom" className={dark ? "bg-navy-deep" : ""}>Other / Custom</option>
              </select>
              {errors.product && <p className={err}>{errors.product.message}</p>}
            </div>
            <div>
              <label className={lbl}>Quantity *</label>
              <input type="text" placeholder="e.g. 5,000 pcs" maxLength={20} className={field} {...register("quantity")} />
              {errors.quantity && <p className={err}>{errors.quantity.message}</p>}
            </div>
            <div className={compact ? "" : "sm:col-span-2"}>
              <label className={lbl}>Project brief *</label>
              <textarea rows={4} maxLength={800} placeholder="Material, finish, deadline, artwork status…" className={`${field} resize-none`} {...register("message")} />
              {errors.message && <p className={err}>{errors.message.message}</p>}
            </div>
            <div className={`${compact ? "" : "sm:col-span-2"} flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1`}>
              <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className={`text-xs font-semibold ${dark ? "text-white/60" : "text-muted-foreground"} inline-flex items-center gap-1.5 hover:text-orange`}>
                <MessageCircle size={14} /> Or chat directly
              </a>
              <button type="submit" disabled={isSubmitting} className="btn-orange disabled:opacity-60">
                {isSubmitting ? "Sending…" : "Send Request"} <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadForm;