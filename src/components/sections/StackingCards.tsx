import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";


export type StackCard = {
  eyebrow: string;
  title: string;
  description: string;
  img: string;
  accent?: "orange" | "navy" | "ivory";
};

const surfaces: Record<NonNullable<StackCard["accent"]>, string> = {
  orange: "bg-orange text-white",
  navy: "bg-navy-deep text-white",
  ivory: "bg-secondary text-foreground",
};

const Card = ({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: StackCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) => {
  // Each card "locks" at a stacked position scaled slightly down
  const targetScale = 1 - (total - index) * 0.04;
  const start = index / total;
  const scale = useTransform(scrollYProgress, [start, 1], [1, targetScale]);

  return (
    <div
      className="sticky"
      style={{ top: `calc(8vh + ${index * 28}px)` }}
    >
      <motion.article
        style={{ scale }}
        className={`relative grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-card origin-top ${surfaces[card.accent ?? "ivory"]}`}
      >
        <div className="p-8 md:p-12 flex flex-col justify-between min-h-[360px] md:min-h-[460px]">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] font-semibold opacity-80 mb-4">
              {card.eyebrow}
            </div>
            <h3 className="font-display text-3xl md:text-5xl font-extrabold leading-[1.05] mb-5">
              {card.title}
            </h3>
            <p className="text-base md:text-lg leading-relaxed opacity-85 max-w-md">
              {card.description}
            </p>
          </div>
        </div>
        <div className="relative min-h-[260px] md:min-h-full overflow-hidden">
          <img
            src={card.img}
            alt={card.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </motion.article>
    </div>
  );
};

const StackingCards = ({
  eyebrow,
  title,
  cards,
}: {
  eyebrow: string;
  title: React.ReactNode;
  cards: StackCard[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section className="py-24 md:py-32">
      <div className="container-luxe">
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-orange mb-3">
            {eyebrow}
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {title}
          </h2>
        </div>
        <div ref={ref} className="relative space-y-6">
          {cards.map((c, i) => (
            <Card key={c.title} card={c} index={i} total={cards.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StackingCards;
