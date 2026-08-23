import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { productCategories as fallback } from "@/data/site";

export type Category = {
  slug: string;
  title: string;
  short?: string | null;
  icon?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
};

export const useProductCategories = (): Category[] => {
  const [cats, setCats] = useState<Category[]>(fallback);
  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("categories")
        .select("slug,title,short_description,icon,image_url,cta_label,cta_href,sort_order,is_active")
        .eq("is_active", true)
        .order("sort_order");
      if (!active || !data?.length) return;
      setCats(
        data.map((d: any) => ({
          slug: d.slug,
          title: d.title,
          short: d.short_description,
          icon: d.icon,
          image_url: d.image_url,
          cta_label: d.cta_label,
          cta_href: d.cta_href,
        })),
      );
    };
    load();
    const ch = supabase
      .channel(`cats_live_${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, load);
    ch.subscribe();
    return () => {
      active = false;
      supabase.removeChannel(ch);
    };
  }, []);
  return cats;
};
