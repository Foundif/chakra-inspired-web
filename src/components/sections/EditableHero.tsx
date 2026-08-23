import { useBlock } from "@/hooks/usePageBlocks";
import PageHero from "./PageHero";

type Props = {
  page: string;
  fallback: { eyebrow: string; title: string; subtitle?: string; image?: string };
  blockKey?: string;
};

const EditableHero = ({ page, fallback, blockKey = "hero" }: Props) => {
  const b = useBlock(page, blockKey);
  if (b && b.is_visible === false) return null;
  return (
    <PageHero
      eyebrow={b?.eyebrow ?? fallback.eyebrow}
      title={b?.title ?? fallback.title}
      subtitle={b?.body ?? fallback.subtitle}
      image={b?.image_url ?? fallback.image}
    />
  );
};

export default EditableHero;