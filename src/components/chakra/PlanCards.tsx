import { Link } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/sections/Reveal";
import type { Plan } from "@/data/chakra";

/** Plans are passed in so an admin-managed API can supply them later. */
const PlanCards = ({ items }: { items: Plan[] }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {items.map((p, i) => (
      <Reveal key={p.id} delay={i * 0.08}>
        <article
          className={`relative h-full rounded-[1.75rem] p-7 card-lift flex flex-col ${
            p.popular
              ? "gradient-navy text-white shadow-card"
              : "bg-card border border-border shadow-soft"
          }`}
        >
          {p.popular && (
            <span className="absolute -top-3 left-7 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest gradient-primary text-white shadow-orange">
              Most Popular
            </span>
          )}
          <div className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${p.popular ? "text-white/50" : "text-muted-foreground"}`}>
            {p.category === "business" ? "Business" : "Home"}
          </div>
          <h3 className={`font-display text-xl font-extrabold mt-2 ${p.popular ? "text-white" : ""}`}>{p.name}</h3>
          <div className={`font-display text-3xl font-extrabold mt-1 ${p.popular ? "text-accent" : "text-accent"}`}>{p.speed}</div>

          <div className="flex items-end gap-1 mt-5">
            <span className={`font-display text-4xl font-extrabold ${p.popular ? "text-white" : "text-foreground"}`}>₹{p.price}</span>
            <span className={`text-sm mb-1.5 ${p.popular ? "text-white/50" : "text-muted-foreground"}`}>{p.period}</span>
          </div>
          <div className={`text-xs mt-1 ${p.popular ? "text-white/50" : "text-muted-foreground"}`}>Installation: {p.installation}</div>

          <ul className="mt-6 space-y-2.5 flex-1">
            {p.benefits.map((b) => (
              <li key={b} className={`flex gap-2.5 text-sm ${p.popular ? "text-white/75" : "text-foreground/80"}`}>
                <Check size={15} className="text-accent shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className={`mt-7 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-all ${
              p.popular ? "gradient-primary text-white hover:brightness-110" : "border border-border hover:border-accent hover:text-accent"
            }`}
          >
            Choose Plan <ArrowUpRight size={15} />
          </Link>
        </article>
      </Reveal>
    ))}
  </div>
);

export default PlanCards;
