import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    nav("/account", { replace: true });
  };

  return (
    <>
      <Seo title="Reset Password | Chakra Fiber" description="Set a new password for your Chakra Fiber customer account." />
      <section className="gradient-navy text-white pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="relative container-luxe max-w-md">
          <div className="rounded-3xl glass-dark p-6 sm:p-8">
            <h1 className="font-display text-2xl font-extrabold">Set a new password</h1>
            <form onSubmit={submit} className="mt-6 space-y-3.5">
              <label className="flex items-center gap-2.5 rounded-2xl bg-white/8 border border-white/15 px-3.5 py-3">
                <LockKeyhole size={16} className="text-white/50 shrink-0" />
                <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="bg-transparent outline-none w-full text-sm placeholder:text-white/40" />
              </label>
              <button type="submit" disabled={busy} className="btn-orange w-full justify-center text-sm disabled:opacity-60">
                {busy && <Loader2 size={16} className="animate-spin" />} Update password
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
