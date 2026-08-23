import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SID_KEY = "ske_sid";
const getSid = () => {
  if (typeof window === "undefined") return null;
  let s = sessionStorage.getItem(SID_KEY);
  if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem(SID_KEY, s); }
  return s;
};
const getUtm = () => {
  if (typeof window === "undefined") return {} as Record<string, string | null>;
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get("utm_source"),
    utm_medium: sp.get("utm_medium"),
    utm_campaign: sp.get("utm_campaign"),
  };
};

export const trackEvent = async (event: "view" | "form_open" | "form_submit", pagePath?: string) => {
  const path = pagePath ?? (typeof window !== "undefined" ? window.location.pathname : "");
  if (!path) return;
  await supabase.from("funnel_events").insert({ page_path: path, event, session_id: getSid() });
};

export const usePageTracker = () => {
  const { pathname } = useLocation();
  const last = useRef<string>("");
  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    const sid = getSid();
    const u = getUtm();
    supabase.from("page_views").insert({
      page_path: pathname,
      session_id: sid,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      ...u,
    });
    trackEvent("view", pathname);
  }, [pathname]);
};