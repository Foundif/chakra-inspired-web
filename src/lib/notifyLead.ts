import { supabase } from "@/integrations/supabase/client";

export type LeadEmailPayload = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  product_interest?: string | null;
  quantity?: string | null;
  message?: string | null;
  source?: string | null;
  page_path?: string | null;
};

/** Fire-and-forget email notification — never blocks UX or surfaces errors. */
export const notifyLead = (payload: LeadEmailPayload) => {
  try {
    void supabase.functions
      .invoke("notify-lead", { body: payload })
      .catch((e) => console.warn("notify-lead failed", e));
  } catch (e) {
    console.warn("notify-lead invoke error", e);
  }
};
