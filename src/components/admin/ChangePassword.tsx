import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2 } from "lucide-react";

const ChangePassword = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8)
      return toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
    if (password !== confirm)
      return toast({ title: "Passwords don't match", description: "Re-enter the same password in both fields.", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setPassword("");
    setConfirm("");
    toast({ title: "Password updated", description: "Use the new password the next time you sign in." });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 mb-6">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
          <KeyRound size={18} />
        </span>
        <div>
          <h2 className="font-display text-xl font-extrabold">Change Password</h2>
          <p className="text-sm text-muted-foreground">Update the password for your signed-in admin account.</p>
        </div>
      </div>
      <form onSubmit={submit} className="mt-5 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">New password</label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Confirm new password</label>
          <input
            required
            type="password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat the new password"
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3"
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <button disabled={busy} className="btn-orange disabled:opacity-60">
            {busy ? (<><Loader2 size={16} className="animate-spin" /> Updating…</>) : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
