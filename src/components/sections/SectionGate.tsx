import { ReactNode } from "react";
import { useBlock } from "@/hooks/usePageBlocks";

/** Hides the section when admins disable it; can also override eyebrow/title/body via render-prop. */
const SectionGate = ({ page, blockKey, children }: { page: string; blockKey: string; children: ReactNode | ((b: any) => ReactNode) }) => {
  const b = useBlock(page, blockKey);
  if (b && b.is_visible === false) return null;
  return <>{typeof children === "function" ? (children as any)(b) : children}</>;
};

export default SectionGate;