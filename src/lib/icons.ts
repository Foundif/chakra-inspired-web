import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Resolve an icon name coming from data/CMS into a Lucide component. */
export const getIcon = (name?: string): LucideIcon => {
  const map = Icons as unknown as Record<string, LucideIcon>;
  return (name && map[name]) || Icons.Sparkle;
};
