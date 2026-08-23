import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PlatformSettings = {
  id: number;
  maintenance_enabled: boolean;
  launch_at: string | null;
  maintenance_title: string;
  maintenance_message: string;
  updated_at: string;
};

export type AdminRenewalInfo = {
  renewal_hosting_due: string | null;
  renewal_amc_due: string | null;
  renewal_message: string | null;
  renewal_dismissed_at: string | null;
};

export const usePlatformSettings = () => {
  const [data, setData] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await (supabase as any)
        .from("platform_settings")
        .select("id, maintenance_enabled, launch_at, maintenance_title, maintenance_message, updated_at")
        .eq("id", 1)
        .maybeSingle();
      if (mounted) { setData(data as any); setLoading(false); }
    };
    load();
    const ch = supabase
      .channel("platform_settings_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "platform_settings" }, () => load())
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  return { data, loading };
};

// Admin-only hook: fetches renewal fields from the protected table.
// Requires the caller to be authenticated as admin or super_admin (enforced by RLS).
export const useAdminRenewalInfo = () => {
  const [data, setData] = useState<AdminRenewalInfo | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("platform_settings")
        .select("renewal_hosting_due, renewal_amc_due, renewal_message, renewal_dismissed_at")
        .eq("id", 1)
        .maybeSingle();
      if (mounted) setData(data as any);
    };
    load();
    const ch = supabase
      .channel("platform_settings_admin_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "platform_settings" }, () => load())
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, []);

  return data;
};
