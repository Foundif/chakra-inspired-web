import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PageBlock = {
  id: string;
  page_slug: string;
  block_key: string;
  block_type: string;
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  is_visible: boolean;
  sort_order: number;
  extra: Record<string, any>;
};

const cache: Record<string, PageBlock[]> = {};
const listeners: Record<string, Set<(b: PageBlock[]) => void>> = {};
let subscribed = false;

const ensureSub = () => {
  if (subscribed) return;
  subscribed = true;
  supabase.channel("page_blocks_live")
    .on("postgres_changes", { event: "*", schema: "public", table: "page_blocks" }, (payload: any) => {
      const slug = (payload.new?.page_slug ?? payload.old?.page_slug) as string;
      if (slug) load(slug);
    })
    .subscribe();
};

const load = async (slug: string) => {
  const { data } = await supabase.from("page_blocks").select("*").eq("page_slug", slug).order("sort_order", { ascending: true });
  cache[slug] = (data as PageBlock[]) ?? [];
  listeners[slug]?.forEach((fn) => fn(cache[slug]));
};

export const usePageBlocks = (pageSlug: string) => {
  const [blocks, setBlocks] = useState<PageBlock[]>(cache[pageSlug] ?? []);
  useEffect(() => {
    ensureSub();
    if (!cache[pageSlug]) load(pageSlug);
    else setBlocks(cache[pageSlug]);
    listeners[pageSlug] ??= new Set();
    listeners[pageSlug].add(setBlocks);
    return () => { listeners[pageSlug].delete(setBlocks); };
  }, [pageSlug]);
  return blocks;
};

export const useBlock = (pageSlug: string, blockKey: string, fallback: Partial<PageBlock> = {}) => {
  const blocks = usePageBlocks(pageSlug);
  const b = blocks.find((x) => x.block_key === blockKey);
  if (!b) return { ...fallback, is_visible: true } as PageBlock;
  return b;
};