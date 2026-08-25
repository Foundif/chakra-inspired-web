import { Link } from "react-router-dom";
import SectionHeading from "@/components/chakra/SectionHeading";
import Reveal from "@/components/sections/Reveal";
import { addonServices } from "@/data/bundles";
import { getIcon } from "@/lib/icons";

const AddonServicesSection = () => (
  <section className="py-20 md:py-28">
    <div className="container-luxe">
      <SectionHeading
        eyebrow="Add-on Services"
        title="CCTV & Networking, Handled by the Same Team"
        subtitle="Beyond internet and entertainment, we also set up CCTV and networking for homes, shops and offices in Aruppukottai — ask us to bundle it with your connection."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {addonServices.map((s, i) => {
          const I = getIcon(s.icon);
          return (
            <Reveal key={s.title} delay={i * 0.07}>
              <article className="group h-full rounded-[1.75rem] bg-card border border-border p-7 card-lift">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:gradient-primary group-hover:text-white transition-all">
                  <I size={21} />
                </div>
                <h3 className="font-display text-lg font-extrabold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">
        Ask about CCTV or networking alongside your internet plan —{" "}
        <Link to="/contact" className="font-semibold text-accent">contact us</Link> for a site visit and quote.
      </p>
    </div>
  </section>
);

export default AddonServicesSection;
