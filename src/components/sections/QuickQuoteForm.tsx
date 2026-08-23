import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notifyLead";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9+\-()\s]+$/, "Invalid phone number"),
  message: z.string().trim().min(10, "Tell us what you need (min 10 chars)"),
});

type FormValues = z.infer<typeof schema>;

const buildLeadId = () => `SQ-${Date.now().toString(36).toUpperCase()}`;

const QuickQuoteForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", message: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const leadId = buildLeadId();
    const payload = {
      name: values.name,
      phone: values.phone,
      message: `[${leadId}] ${values.message}`,
      source: "quote_form" as const,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      utm_source: "website",
      utm_medium: "quick_quote",
    };
    const { error } = await supabase.from("leads").insert(payload);

    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    notifyLead(payload);

    toast({ title: "Quote request received!", description: "Our team will be in touch shortly." });
    setSubmitted(values);
    if (onSuccess) setTimeout(() => onSuccess(), 2000);
  };
  
  const fieldBase = "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:border-orange focus:bg-white/10 outline-none transition-colors";
  const errorText = "mt-1.5 text-xs text-orange font-medium";

  if (submitted) {
    return (
       <div className="text-center py-16 px-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange/15 flex items-center justify-center mb-6">
            <CheckCircle2 size={32} className="text-orange" />
          </div>
          <h3 className="font-display text-3xl font-extrabold mb-3 text-white">
            Thank you, {submitted.name.split(" ")[0]}!
          </h3>
          <p className="text-white/70 max-w-md mx-auto leading-relaxed">
            Your quote request is in. Our sales team will get back to you on WhatsApp shortly.
          </p>
      </div>
    )
  }

  return (
    <div className="p-8">
        <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-bold text-white">Get a Quick Quote</h2>
            <p className="text-sm text-white/60 mt-1">We reply within an hour on business days.</p>
        </div>
      <motion.form
        key="form"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div>
          <input id="qq-name" type="text" placeholder="Your name *" autoComplete="name" className={fieldBase} {...register("name")} />
          {errors.name && <p className={errorText}>{errors.name.message}</p>}
        </div>
        <div>
          <input id="qq-phone" type="tel" placeholder="Phone / WhatsApp *" autoComplete="tel" className={fieldBase} {...register("phone")} />
          {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
        </div>
        <div>
            <textarea id="qq-msg" rows={3} placeholder="What do you need? (e.g. 5,000 woven labels)" className={`${fieldBase} resize-none`} {...register("message")} />
            {errors.message && <p className={errorText}>{errors.message.message}</p>}
        </div>
        <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-orange w-full disabled:opacity-60 disabled:cursor-not-allowed text-base py-3.5 flex items-center justify-center"
            >
              {isSubmitting ? "Sending…" : "Send to Sales Team"} <ArrowUpRight size={18} />
            </button>
        </div>
        <p className="text-xs text-center text-white/40 pt-1">
            Saved to our CRM · We'll never share your details.
        </p>
      </motion.form>
    </div>
  );
};

export default QuickQuoteForm;
