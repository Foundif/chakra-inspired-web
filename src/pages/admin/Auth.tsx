import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LockKeyhole, Mail, Users, ReceiptIndianRupee, LifeBuoy, FileSpreadsheet, ShieldCheck } from "lucide-react";
import logo from "@/assets/chakra-logo.png";
import authBg from "@/assets/admin-auth-bg.jpg";

const ADMIN_EMAIL = "admin@chakrafibernet.com";

const FEATURES = [
  { icon: Users, title: "Customers & Connections", desc: "Subscribers, plans and field connections in one place." },
  { icon: ReceiptIndianRupee, title: "Billing & Payments", desc: "Invoices, collections and overdue tracking." },
  { icon: LifeBuoy, title: "Support Tickets", desc: "Prioritise and resolve customer issues faster." },
  { icon: FileSpreadsheet, title: "Tally Export", desc: "Tally-ready sales & receipt vouchers in one click." },
];

const AdminAuth = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      return toast({
        title: "Restricted access",
        description: "This portal is limited to the authorised administrator account.",
        variant: "destructive",
      });
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    nav("/admin", { replace: true });
  };

  const forgot = async () => {
    if (!email.trim()) return toast({ title: "Enter your email first", variant: "destructive" });
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    toast({ title: "Reset link sent", description: "Check your inbox for the password reset link." });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-secondary/40">
      {/* LEFT — brand / content panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden">
        <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1425]/95 via-[#0d1425]/85 to-[#0d1425]/70" />
        <div className="relative">
          <img src={logo} alt="Chakra Fiber" className="h-14 w-auto object-contain" />
        </div>
        <div className="relative max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/80">
            <ShieldCheck size={14} /> Restricted Area
          </span>
          <h1 className="mt-5 font-display text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            Chakra Fiber<br />Control Center
          </h1>
          <p className="mt-4 text-white/65 leading-relaxed">
            Run your entire internet business from one dashboard — subscribers, billing, support and accounting.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
                <f.icon size={20} className="text-orange" />
                <p className="mt-2 text-sm font-bold text-white">{f.title}</p>
                <p className="mt-1 text-xs text-white/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/45">Authorised personnel only. All activity is logged.</p>
      </div>

      {/* RIGHT — sign-in form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
            <img src={logo} alt="Chakra Fiber" className="h-12 w-auto object-contain mx-auto mb-4 lg:hidden" />
            <h2 className="font-display text-2xl font-extrabold text-center lg:text-left">Admin Sign In</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center lg:text-left">
              Sign in with the administrator account to continue.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</label>
                <div className="mt-1 flex items-center gap-2.5 rounded-xl border border-border bg-background px-4">
                  <Mail size={16} className="text-muted-foreground shrink-0" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={ADMIN_EMAIL}
                    className="w-full bg-transparent outline-none py-3"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Password</label>
                <div className="mt-1 flex items-center gap-2.5 rounded-xl border border-border bg-background px-4">
                  <LockKeyhole size={16} className="text-muted-foreground shrink-0" />
                  <input
                    required
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none py-3"
                  />
                </div>
              </div>
              <button disabled={busy} className="btn-orange w-full justify-center disabled:opacity-60">
                {busy ? (<><Loader2 size={16} className="animate-spin" /> Signing in…</>) : "Sign In"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button type="button" onClick={forgot} className="text-sm text-muted-foreground hover:text-foreground font-semibold">
                Forgot password?
              </button>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Access is restricted to <span className="font-semibold">{ADMIN_EMAIL}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
