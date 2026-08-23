import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import Reveal from "@/components/sections/Reveal";
import Testimonials from "@/components/chakra/Testimonials";
import { brand, heroStats, whyUs } from "@/data/chakra";
import { getIcon } from "@/lib/icons";
import team from "@/assets/chakra/team.jpg";
import networkOps from "@/assets/chakra/network-ops.jpg";
import office from "@/assets/chakra/office.jpg";

const About = () => (
  <>
    <Seo
      title="About Chakra Fiber | Local Fiber ISP in Aruppukottai"
      description="Chakra Fiber Networks builds and operates its own fiber network across Aruppukottai, serving 5,000+ homes and businesses with unlimited broadband and 24×7 local support."
      path="/about"
    />
    <PageBanner
      eyebrow="About Us"
      title="A neighbourhood ISP with enterprise ambition"
      subtitle={`${brand.legal} — ${brand.tagline}.`}
      crumbs={[{ label: "About" }]}
    />

    <section className="py-16 md:py-24">
      <div className="container-luxe grid lg:grid-cols-12 gap-14 items-center">
        <Reveal className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-4">
            <img src={team} alt="Chakra Fiber engineering team" width={1200} height={900} loading="lazy" className="rounded-2xl object-cover h-64 w-full col-span-2" />
            <img src={networkOps} alt="Network operations centre" width={1200} height={900} loading="lazy" className="rounded-2xl object-cover h-44 w-full" />
            <img src={office} alt="Customer care office" width={1200} height={900} loading="lazy" className="rounded-2xl object-cover h-44 w-full" />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow="Our Story"
            title="Built street by street, in our own town"
            subtitle="We started as a small cable operator on Thiruchuli Road and grew into a full fiber-to-the-home provider serving thousands of families and businesses."
          />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Every metre of our fiber is laid, spliced and monitored by our own engineers. That ownership is why we can
              promise same-day fault visits and honest pricing — there is no distant call centre between you and the
              people who run the network.
            </p>
            <p>
              Today Chakra Fiber carries unlimited broadband, 350+ digital TV channels, OTT bundles and business-grade
              links across Aruppukottai and neighbouring towns, backed by redundant upstream capacity and full power
              backup at every distribution point.
            </p>
          </div>
          <Link to="/contact" className="btn-orange mt-8">Get connected <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>

    <section className="py-16 gradient-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
      <div className="relative container-luxe grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {heroStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.07}>
            <div className="font-display text-4xl md:text-5xl font-extrabold text-accent">
              {s.value}
              {s.suffix}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/50 mt-2">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container-luxe">
        <SectionHeading eyebrow="What drives us" title="Principles we don't compromise on" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((w, i) => {
            const I = getIcon(w.icon);
            return (
              <Reveal key={w.title} delay={(i % 4) * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 card-lift">
                  <I size={19} className="text-accent mb-4" />
                  <h3 className="font-display font-extrabold">{w.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{w.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-luxe">
        <SectionHeading eyebrow="Customer Reviews" title="What our subscribers say" />
        <Testimonials />
      </div>
    </section>
  </>
);

export default About;
