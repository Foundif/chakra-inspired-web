import Reveal from "@/components/sections/Reveal";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; to?: string };

const PageBanner = ({ eyebrow, title, subtitle, crumbs = [] }: { eyebrow: string; title: string; subtitle?: string; crumbs?: Crumb[] }) => (
  <section className="relative gradient-navy text-white overflow-hidden pt-36 pb-20 md:pt-44 md:pb-24">
    <div className="absolute inset-0 grid-bg opacity-70" aria-hidden="true" />
    <div className="absolute -top-24 right-0 w-[30rem] h-[30rem] rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
    <div className="relative container-luxe">
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex items-center gap-1.5 text-xs text-white/55">
          <li><Link to="/" className="hover:text-white">Home</Link></li>
          {crumbs.map((c) => (
            <li key={c.label} className="flex items-center gap-1.5">
              <ChevronRight size={12} />
              {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white/80">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <Reveal>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 border border-white/15 mb-5">
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.03] max-w-3xl text-balance">{title}</h1>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-lg text-white/65 max-w-2xl leading-relaxed">{subtitle}</p>
        </Reveal>
      )}
    </div>
  </section>
);

export default PageBanner;
