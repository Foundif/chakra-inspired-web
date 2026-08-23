import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

type Slide = { src: string; alt: string; caption: string };

const HeroSlideshow = ({ slides, interval = 4000 }: { slides: Slide[]; interval?: number }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  const current = slides[i];

  return (
    <div className="relative pb-10 pl-4 pr-4">
      <div className="relative rounded-3xl overflow-hidden shadow-card aspect-[4/4.4] bg-secondary">
        <AnimatePresence mode="sync">
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {/* Caption pill */}
        <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-3 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.caption}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45 }}
              className="px-4 py-2 rounded-full bg-background/85 backdrop-blur text-foreground text-xs font-semibold tracking-wide"
            >
              {current.caption}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-1.5 mt-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Show slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? "w-7 bg-orange" : "w-3 bg-background/60 hover:bg-background"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating trust card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute -bottom-2 left-2 md:-bottom-4 md:-left-4 bg-background rounded-2xl shadow-card p-4 max-w-[220px] border border-border z-20"
      >
        <div className="flex items-center gap-2 mb-2">
          {[...Array(5)].map((_, idx) => (
            <Star key={idx} size={14} className="fill-orange text-orange" />
          ))}
        </div>
        <p className="text-sm font-semibold text-foreground leading-snug">
          Trusted by 250+ apparel brands.
        </p>
      </motion.div>

      {/* Floating export badge */}
      <motion.div
        initial={{ opacity: 0, y: -12, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute -top-2 right-2 md:-top-4 md:-right-2 bg-orange text-white rounded-2xl px-5 py-4 shadow-orange z-20"
      >
        <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Export</div>
        <div className="font-display font-extrabold text-xl">15+ Countries</div>
      </motion.div>
    </div>
  );
};

export default HeroSlideshow;