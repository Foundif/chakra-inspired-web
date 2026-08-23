import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/ske-logo-h.png";
import authBg from "@/assets/admin-auth-bg.jpg";

const AdminAuth = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      nav("/admin", { replace: true });
    } else {
      const redirectUrl = `${window.location.origin}/admin`;
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } });
      setBusy(false);
      if (error) return toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      toast({ title: "Account created", description: "You can now sign in." });
      setMode("signin");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 relative overflow-hidden">
      <img src={authBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-card/95 backdrop-blur border border-border rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="Sri Kanish Enterprises" className="h-12 w-auto max-w-[220px] object-contain" />
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Password</label>
            <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3" />
          </div>
          <button disabled={busy} className="btn-orange w-full justify-center">
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>No account? <button onClick={() => setMode("signup")} className="text-orange font-semibold">Create one</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode("signin")} className="text-orange font-semibold">Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
