import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/data/chakra";

const Testimonials = () => {
  const [i, setI] = useState(0);
  const n = testimonials.length;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const visible = [0, 1, 2].map((k) => testimonials[(i + k) % n]);

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((t, k) => (
            <motion.figure
              key={t.name + i}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, delay: k * 0.06 }}
              className={`rounded-[1.75rem] p-7 glass border border-white/50 shadow-soft ${k === 2 ? "hidden lg:block" : ""} ${k === 1 ? "hidden md:block" : ""}`}
            >
              <Quote size={24} className="text-accent/40 mb-4" />
              <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} className={s < t.rating ? "text-accent fill-accent" : "text-muted-foreground/30"} />
                ))}
              </div>
              <blockquote className="text-foreground/80 leading-relaxed">{t.text}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary text-white font-display font-bold flex items-center justify-center text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-3 mt-8">
        <button onClick={() => setI((v) => (v - 1 + n) % n)} aria-label="Previous review" className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
          <ChevronLeft size={17} />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((t, k) => (
            <button key={t.name} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-accent" : "w-1.5 bg-border"}`} />
          ))}
        </div>
        <button onClick={() => setI((v) => (v + 1) % n)} aria-label="Next review" className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
