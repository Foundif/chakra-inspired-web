import BrandLogo from "@/components/chakra/BrandLogo";
import type { Brand } from "@/data/bundles";

/** Full-width infinite logo marquee. Pauses on hover. */
const BrandMarquee = ({
  items,
  reverse = false,
  speed = "40s",
}: {
  items: Brand[];
  reverse?: boolean;
  speed?: string;
}) => {
  const row = [...items, ...items];

  return (
    <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="flex w-max gap-3 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: speed, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {row.map((b, i) => (
          <div key={`${b.name}-${i}`} className="shrink-0">
            <BrandLogo brand={b} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
