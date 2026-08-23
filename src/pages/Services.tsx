import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import Reveal from "@/components/sections/Reveal";
import EnquiryForm from "@/components/chakra/EnquiryForm";
import { services, installSteps } from "@/data/chakra";
import { getIcon } from "@/lib/icons";

const Services = () => (
  <>
    <Seo
      title="Fiber Broadband, Cable TV & Business Internet | Chakra Fiber"
      description="Chakra Fiber services in Aruppukottai: FTTH broadband, 350+ channel cable TV, OTT bundles, telephone lines, corporate internet, installation and maintenance."
      path="/services"
    />
    <PageBanner
      eyebrow="Our Services"
      title="Every connection your home or business needs"
      subtitle="One fiber line powers your internet, television, streaming and voice — installed and maintained by a local team."
      crumbs={[{ label: "Services" }]}
    />

    <section className="py-16 md:py-24">
      <div className="container-luxe grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const I = getIcon(s.icon);
          return (
            <Reveal key={s.slug} delay={(i % 3) * 0.07}>
              <article className="group h-full rounded-[1.75rem] bg-card border border-border p-7 card-lift">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:gradient-primary group-hover:text-white transition-all">
                  <I size={21} />
                </div>
                <h2 className="font-display text-lg font-extrabold mb-1.5">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
                <Link to="/contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Enquire <ArrowUpRight size={14} />
                </Link>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>

    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-luxe">
        <SectionHeading eyebrow="How it works" title="Installed properly, the first time" subtitle="Certified splicers, branded cabling and a documented handover on every job." />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {installSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08}>
              <li className="rounded-2xl bg-card border border-border p-6 h-full">
                <div className="font-display text-3xl font-extrabold text-accent/25">{s.step}</div>
                <h3 className="font-display font-extrabold mt-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>

    <section className="py-16 md:py-24 gradient-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
      <div className="relative container-luxe grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <SectionHeading align="left" light eyebrow="Request a service" title="Tell us what you need" subtitle="New connection, shifting, upgrade or a fault — we respond within 30 minutes on business hours." />
        </div>
        <Reveal delay={0.12} className="lg:col-span-7">
          <div className="rounded-[2rem] glass-dark p-7 md:p-9">
            <EnquiryForm variant="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default Services;
