import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Helmet } from "react-helmet-async";

export type FaqItem = { q: string; a: string };

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  items: FaqItem[];
  /** When true, emits FAQPage JSON-LD for SEO rich-results. */
  jsonLd?: boolean;
};

/** Reusable FAQ accordion with optional FAQPage JSON-LD for SERP rich results. */
const FaqSection = ({ eyebrow = "FAQ", title, items, jsonLd = true }: Props) => {
  const [open, setOpen] = useState<number | null>(0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="py-24 md:py-28">
      {jsonLd && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(ld)}</script>
        </Helmet>
      )}
      <div className="container-luxe max-w-4xl">
        <div className="text-center mb-14">
          <div className="chip mb-4">{eyebrow}</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] break-words">
            {title}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((f, i) => (
            <div key={f.q} className="bg-secondary/60 rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left"
                aria-expanded={open === i}
              >
                <span className="font-display font-bold text-base md:text-lg text-foreground">{f.q}</span>
                <span className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center shrink-0">
                  {open === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-fade-in">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;