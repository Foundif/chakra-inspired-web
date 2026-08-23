import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notifyLead";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/hooks/useTracker";
import { leadAttribution } from "@/lib/wa";

const FloatingInquiry = () => {
  useSettings(); // keep hook order; settings not needed after CRM-only flow
  const { toast } = useToast();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", requirement: "" });

  // Hide on admin routes
  if (pathname.startsWith("/admin")) return null;

  useEffect(() => {
    if (open) trackEvent("form_open");
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast({ title: "Enter your name", variant: "destructive" });
    if (form.phone.replace(/\D/g, "").length < 7) return toast({ title: "Enter a valid phone", variant: "destructive" });
    if (form.requirement.trim().length < 5) return toast({ title: "Add a short requirement", variant: "destructive" });
    setBusy(true);
    const a = leadAttribution();
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      message: form.requirement.trim(),
      source: "quote_form" as const,
      page_path: pathname,
      utm_source: a.utm_source,
      utm_medium: "floating_inquiry",
      utm_campaign: a.utm_campaign ?? "floating-inquiry",
      utm_content: "floating_inquiry",
    };
    const { error } = await supabase.from("leads").insert(payload);
    setBusy(false);
    if (error) return toast({ title: "Could not send", description: error.message, variant: "destructive" });
    notifyLead(payload);
    trackEvent("form_submit");
    setDone(true);
    toast({ title: "Enquiry received", description: "Our sales team will reach out shortly." });
    setTimeout(() => { setDone(false); setOpen(false); setForm({ name: "", phone: "", requirement: "" }); }, 2400);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Quick enquiry"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-luxe hover:bg-orange transition-all hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageSquarePlus size={22} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-6 z-40 w-[92vw] max-w-sm bg-card border border-border rounded-2xl shadow-luxe overflow-hidden"
          >
            <div className="bg-foreground text-background px-5 py-4">
              <div className="font-display font-extrabold text-lg">Get a Quick Quote</div>
              <div className="text-xs text-background/60">We reply within an hour on business days.</div>
            </div>
            {done ? (
              <div className="p-8 text-center">
                <CheckCircle2 size={36} className="text-orange mx-auto mb-2" />
                <p className="font-semibold">Thanks {form.name.split(" ")[0]}! We'll reach out shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="p-5 space-y-3">
                <input
                  required
                  placeholder="Your name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={80}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone / WhatsApp *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
                <textarea
                  required
                  placeholder="What do you need? (e.g. 5,000 woven labels)"
                  value={form.requirement}
                  onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                  maxLength={400}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm resize-none"
                />
                <button disabled={busy} className="btn-orange w-full justify-center">
                  {busy ? "Sending…" : <>Send to Sales Team <Send size={14} /></>}
                </button>
                <p className="text-[10px] text-muted-foreground text-center">Saved to our CRM · We'll never share your details.</p>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingInquiry;