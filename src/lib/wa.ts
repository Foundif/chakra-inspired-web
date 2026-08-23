import { supabase } from "@/integrations/supabase/client";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const getUtm = () => {
  if (typeof window === "undefined") return {} as Record<string, string | null>;
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get("utm_source"),
    utm_medium: sp.get("utm_medium"),
    utm_campaign: sp.get("utm_campaign"),
    utm_term: sp.get("utm_term"),
    utm_content: sp.get("utm_content"),
  };
};

/**
 * Build a WhatsApp URL and (fire-and-forget) log a funnel `form_open` event tagged
 * with the calling CTA so the analytics funnel matches lead sources accurately.
 */
export const waLink = (number: string, message: string, ctaContext?: string) => {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  return url;
};

/** Click handler that records a WhatsApp CTA click with UTM/source attribution. */
export const trackWaClick = (ctaContext: string, extra: Record<string, any> = {}) => {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const u = getUtm();
  // Log to funnel_events as a form_open so per-page conversion math stays accurate
  supabase.from("funnel_events").insert({
    page_path: path,
    event: "form_open",
    session_id: typeof sessionStorage !== "undefined" ? sessionStorage.getItem("ske_sid") : null,
  });
  // Also persist a "whatsapp_click" lead-style row? No — keep funnel light, attribution lives in next lead.
  // Stash the originating CTA so the next lead inherits matching UTM if user comes back via WhatsApp.
  try {
    sessionStorage.setItem(
      "ske_last_cta",
      JSON.stringify({
        cta: ctaContext,
        page: path,
        utm_source: u.utm_source ?? "website",
        utm_medium: u.utm_medium ?? "whatsapp_cta",
        utm_campaign: u.utm_campaign ?? `wa-${slugify(ctaContext)}`,
        utm_content: u.utm_content ?? slugify(ctaContext),
        ...extra,
      }),
    );
  } catch {}
};

/** Get attribution to attach to a lead insert (UTM + last-clicked CTA fallback). */
export const leadAttribution = () => {
  const u = getUtm();
  let last: any = {};
  try {
    const raw = sessionStorage.getItem("ske_last_cta");
    if (raw) last = JSON.parse(raw);
  } catch {}
  return {
    utm_source: u.utm_source ?? last.utm_source ?? "website",
    utm_medium: u.utm_medium ?? last.utm_medium ?? "direct",
    utm_campaign: u.utm_campaign ?? last.utm_campaign ?? null,
    utm_term: u.utm_term ?? null,
    utm_content: u.utm_content ?? last.utm_content ?? null,
  };
};