import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Ctx = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({ user: null, session: null, isAdmin: false, isSuperAdmin: false, loading: true, signOut: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async (uid: string) => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      const roles = (data ?? []).map((r: any) => r.role);
      setIsAdmin(roles.includes("admin") || roles.includes("super_admin"));
      setIsSuperAdmin(roles.includes("super_admin"));
      setLoading(false);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => { loadRoles(sess.user.id); }, 0);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  return <AuthCtx.Provider value={{ user, session, isAdmin, isSuperAdmin, loading, signOut }}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
