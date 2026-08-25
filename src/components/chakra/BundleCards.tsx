import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Reveal from "@/components/sections/Reveal";
import type { Bundle } from "@/data/bundles";

/** Price-free bundle cards — pricing is quoted per address by the team. */
const BundleCards = ({ items }: { items: Bundle[] }) => (
  <div className="grid gap-6 md:grid-cols-3">
    {items.map((b, i) => (
      <Reveal key={b.id} delay={i * 0.08}>
        <article
          className={`relative h-full rounded-[1.75rem] p-7 md:p-8 flex flex-col card-lift bg-card ${
            b.popular ? "border-2 border-accent shadow-card" : "border border-border shadow-soft"
          }`}
        >
          {b.popular && (
            <span className="inline-flex self-start px-3 py-1.5 mb-4 rounded-full text-[11px] font-bold bg-accent/10 text-accent">
              Most Popular
            </span>
          )}
          <h3 className="font-display text-xl font-extrabold leading-snug">{b.name}</h3>
          <p className="text-muted-foreground text-sm mt-1.5">{b.tagline}</p>

          <ul className="mt-6 space-y-3 flex-1">
            {b.benefits.map((x) => (
              <li key={x} className="flex gap-2.5 text-sm text-foreground/80 leading-relaxed">
                <Check size={15} className="text-accent shrink-0 mt-0.5" />
                {x}
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className={`mt-7 inline-flex items-center justify-center w-full py-3.5 rounded-full font-semibold text-sm transition-all ${
              b.popular ? "gradient-primary text-white hover:brightness-110" : "bg-accent/10 text-accent hover:bg-accent/15"
            }`}
          >
            Get This Plan
          </Link>
        </article>
      </Reveal>
    ))}
  </div>
);

export default BundleCards;
