import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, IdCard, LifeBuoy, Loader2, Phone, Wifi } from "lucide-react";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { brand } from "@/data/chakra";
import heroImg from "@/assets/chakra/fiber-install.jpg";

const CustomerLogin = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ code: "", phone: "" });

  useEffect(() => {
    if (user) nav("/account", { replace: true });
  }, [user, nav]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim();
    const phone = form.phone.replace(/\D/g, "");
    if (!code) return toast.error("Enter your customer ID.");
    if (phone.length < 10) return toast.error("Enter your 10-digit mobile number.");

    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-login", {
        body: { customer_code: code, phone },
      });
      if (error || !data?.email) {
        throw new Error(
          (data as { error?: string } | null)?.error ??
            "Customer ID and mobile number do not match our records."
        );
      }
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (signErr) throw signErr;
      toast.success("Welcome back!");
      nav("/account", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to sign in. Please contact support.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Customer Login | Chakra Fiber" description="Sign in with your Chakra Fiber customer ID and registered mobile number to view your plan, bills and support requests." />
      <section className="gradient-navy text-white pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="absolute -top-32 -left-20 w-[30rem] h-[30rem] rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative container-luxe max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-3xl glass-dark p-6 sm:p-8">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold">Customer Login</h1>
            <p className="mt-2 text-sm text-white/60">
              Sign in with your customer ID and the mobile number registered with {brand.name}.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-3.5">
              <label className="flex items-center gap-2.5 rounded-2xl bg-white/8 border border-white/15 px-3.5 py-3">
                <IdCard size={16} className="text-white/50 shrink-0" />
                <input required maxLength={64} value={form.code} onChange={set("code")} placeholder="Customer ID (from your bill)" className="bg-transparent outline-none w-full text-sm placeholder:text-white/40" />
              </label>
              <label className="flex items-center gap-2.5 rounded-2xl bg-white/8 border border-white/15 px-3.5 py-3">
                <Phone size={16} className="text-white/50 shrink-0" />
                <input required inputMode="numeric" maxLength={15} value={form.phone} onChange={set("phone")} placeholder="Registered mobile number" className="bg-transparent outline-none w-full text-sm placeholder:text-white/40" />
              </label>

              <button type="submit" disabled={busy} className="btn-orange w-full justify-center text-sm disabled:opacity-60">
                {busy && <Loader2 size={16} className="animate-spin" />} Sign In
              </button>
            </form>

            <p className="mt-5 text-sm text-white/45 leading-relaxed">
              Accounts are created by our team — no registration needed. Don't know your customer ID? Call{" "}
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-accent font-semibold">{brand.phone}</a> or{" "}
              <Link to="/contact" className="text-accent font-semibold">contact support</Link>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden min-h-[240px] lg:min-h-[540px] order-first lg:order-none"
          >
            <img src={heroImg} alt="Chakra Fiber technicians installing a fiber connection" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1425] via-[#0d1425]/40 to-transparent" aria-hidden="true" />
            <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Customer Portal</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Your connection, in your hands.
              </h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  { icon: Wifi, text: "Check your active plan and renewal date" },
                  { icon: FileText, text: "View bills and pay online in seconds" },
                  { icon: LifeBuoy, text: "Raise and track support requests" },
                ].map((b) => (
                  <li key={b.text} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 grid place-items-center shrink-0">
                      <b.icon size={15} className="text-accent" />
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CustomerLogin;
