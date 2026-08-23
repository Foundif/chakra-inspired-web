import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "@/components/sections/Reveal";

const FaqAccordion = ({ items }: { items: { q: string; a: string }[] }) => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 0.04}>
          <div className={`rounded-2xl border transition-colors ${open === i ? "border-accent/40 bg-card shadow-soft" : "border-border bg-card/60"}`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
            >
              <span className="font-display font-bold text-base md:text-lg">{f.q}</span>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${open === i ? "gradient-primary text-white rotate-45" : "bg-secondary text-foreground/60"}`}>
                <Plus size={16} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default FaqAccordion;
