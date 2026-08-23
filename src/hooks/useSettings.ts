import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { site as defaults } from "@/data/site";

export type SiteSettings = {
  company_name: string;
  tagline: string;
  phone_primary: string;
  phone_secondary: string | null;
  whatsapp_number: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  gstin: string | null;
  indiamart_url: string;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  google_maps_url: string | null;
  logo_url: string | null;
};

const fallback: SiteSettings = {
  company_name: defaults.name,
  tagline: defaults.tagline,
  phone_primary: defaults.phone,
  phone_secondary: defaults.phoneAlt,
  whatsapp_number: defaults.whatsapp,
  email: defaults.email,
  address_line1: defaults.address1,
  address_line2: defaults.address2,
  city: defaults.city,
  gstin: defaults.gstin,
  indiamart_url: defaults.indiamartUrl,
  instagram_url: null,
  facebook_url: null,
  linkedin_url: null,
  google_maps_url: null,
  logo_url: null,
};

let cached: SiteSettings | null = null;
const listeners = new Set<(s: SiteSettings) => void>();

const load = async () => {
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (data) {
    cached = { ...fallback, ...(data as Partial<SiteSettings>) } as SiteSettings;
    listeners.forEach((l) => l(cached!));
  }
};

// Subscribe to realtime updates so admin edits reflect everywhere instantly
let subscribed = false;
const ensureSub = () => {
  if (subscribed) return;
  subscribed = true;
  supabase
    .channel("site_settings_live")
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "site_settings" }, () => load())
    .subscribe();
};

export const useSettings = (): SiteSettings => {
  const [s, setS] = useState<SiteSettings>(cached ?? fallback);
  useEffect(() => {
    ensureSub();
    if (!cached) load();
    const fn = (next: SiteSettings) => setS(next);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return s;
};