import { ReactNode } from "react";
import { useBlock, PageBlock } from "@/hooks/usePageBlocks";

/** Resolve fields for a single page_block with sensible string/image/cta fallbacks. */
export const useEditableBlock = (page: string, key: string) => {
  const b = useBlock(page, key) as Partial<PageBlock> | null;
  return {
    block: b,
    visible: b?.is_visible !== false,
    text: (field: "eyebrow" | "title" | "body" | "cta_label" | "cta_href", fallback: string) =>
      (b?.[field] ?? "") !== "" ? (b?.[field] as string) : fallback,
    /** Render CMS title (plain) if set, otherwise fallback JSX (which can include styled spans). */
    title: (fallback: ReactNode) =>
      b?.title && b.title.trim() !== "" ? (b.title as string) : fallback,
    eyebrow: (fallback: ReactNode) =>
      b?.eyebrow && b.eyebrow.trim() !== "" ? (b.eyebrow as string) : fallback,
    body: (fallback: ReactNode) =>
      b?.body && b.body.trim() !== "" ? (b.body as string) : fallback,
    image: (fallback: string) => (b?.image_url && b.image_url !== "" ? b.image_url : fallback),
    ctaLabel: (fallback: string) =>
      b?.cta_label && b.cta_label !== "" ? (b.cta_label as string) : fallback,
    ctaHref: (fallback: string) =>
      b?.cta_href && b.cta_href !== "" ? (b.cta_href as string) : fallback,
  };
};
