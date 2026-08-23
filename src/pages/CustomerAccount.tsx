import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Headphones, Loader2, LogOut, Receipt, Wifi } from "lucide-react";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { brand } from "@/data/chakra";

type Profile = {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  account_no: string | null;
  plan_name: string | null;
};

const CustomerAccount = () => {
  const nav = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav("/customer-login", { replace: true });
  }, [loading, user, nav]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("customer_profiles")
      .select("full_name, phone, address, account_no, plan_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("customer_profiles")
      .upsert({ id: user.id, ...profile });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated.");
  };

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile((p) => ({ ...(p ?? { full_name: "", phone: "", address: "", account_no: "", plan_name: "" }), [k]: e.target.value }));

  const field = "w-full rounded-2xl bg-white/8 border border-white/15 px-3.5 py-3 text-sm outline-none placeholder:text-white/40 focus:border-accent/60";

  return (
    <>
      <Seo title="My Account | Chakra Fiber" description="Manage your Chakra Fiber broadband account, plan details and support requests." />
      <section className="gradient-navy text-white pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="relative container-luxe max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold">My Account</h1>
              <p className="mt-1.5 text-sm text-white/60">{user?.email}</p>
            </div>
            <button onClick={() => { signOut(); nav("/"); }} className="btn-glass text-xs px-4 py-2.5">
              <LogOut size={14} /> Sign out
            </button>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl glass-dark p-4">
              <Wifi size={18} className="text-accent" />
              <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Current plan</div>
              <div className="font-display font-bold">{profile?.plan_name || "Not set"}</div>
            </div>
            <div className="rounded-2xl glass-dark p-4">
              <Receipt size={18} className="text-accent" />
              <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Account no.</div>
              <div className="font-display font-bold">{profile?.account_no || "Pending"}</div>
            </div>
            <Link to="/contact" className="rounded-2xl glass-dark p-4 hover:border-accent/40 transition-colors">
              <Headphones size={18} className="text-accent" />
              <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Support</div>
              <div className="font-display font-bold">Raise a request</div>
            </Link>
          </div>

          <form onSubmit={save} className="mt-6 rounded-3xl glass-dark p-5 sm:p-7 space-y-3.5">
            <h2 className="font-display text-lg font-bold">Profile details</h2>
            <input className={field} placeholder="Full name" value={profile?.full_name ?? ""} onChange={set("full_name")} />
            <input className={field} placeholder="Mobile number" value={profile?.phone ?? ""} onChange={set("phone")} />
            <input className={field} placeholder="Installation address" value={profile?.address ?? ""} onChange={set("address")} />
            <input className={field} placeholder="Account number (from your bill)" value={profile?.account_no ?? ""} onChange={set("account_no")} />
            <input className={field} placeholder="Plan name" value={profile?.plan_name ?? ""} onChange={set("plan_name")} />
            <button type="submit" disabled={busy} className="btn-orange justify-center text-sm disabled:opacity-60">
              {busy && <Loader2 size={16} className="animate-spin" />} Save changes
            </button>
          </form>

          <p className="mt-5 text-xs text-white/50">
            For billing or renewals call <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-accent font-semibold">{brand.phone}</a>.
          </p>
        </div>
      </section>
    </>
  );
};

export default CustomerAccount;
