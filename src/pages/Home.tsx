import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Phone, Search, Star } from "lucide-react";
import Seo from "@/components/Seo";
import Reveal from "@/components/sections/Reveal";
import Hero from "@/components/chakra/Hero";
import SectionHeading from "@/components/chakra/SectionHeading";
import BundleCards from "@/components/chakra/BundleCards";
import EntertainmentSection from "@/components/chakra/EntertainmentSection";
import AddonServicesSection from "@/components/chakra/AddonServicesSection";
import FaqAccordion from "@/components/chakra/FaqAccordion";
import Testimonials from "@/components/chakra/Testimonials";
import EnquiryForm from "@/components/chakra/EnquiryForm";
import { brand, coverageAreas, faqs, installSteps, services, trustBadges, whyUs } from "@/data/chakra";
import { bundles } from "@/data/bundles";

import { getIcon } from "@/lib/icons";
import fiberInstall from "@/assets/chakra/fiber-install.jpg";
import networkOps from "@/assets/chakra/network-ops.jpg";
import homeFamily from "@/assets/chakra/home-family.jpg";

const Home = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "InternetServiceProvider",
      name: brand.legal,
      alternateName: brand.name,
      slogan: brand.tagline,
      telephone: brand.phone,
      email: brand.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${brand.address1}, ${brand.address2}`,
        addressLocality: "Aruppukottai",
        addressRegion: "Tamil Nadu",
        postalCode: "626101",
        addressCountry: "IN",
      },
      areaServed: coverageAreas.map((a) => a.name),
      openingHours: "Mo-Su 09:00-21:00",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <Seo
        title="Chakra Fiber | High-Speed Fiber Internet in Aruppukottai"
        description="Unlimited fiber broadband, 350+ HD TV channels, OTT bundles and telephone connections in Aruppukottai. Free installation, 99.9% uptime and 24×7 local support."
        path="/"
        jsonLd={jsonLd}
      />

      <Hero />

      {/* TRUST BADGES */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Why subscribers stay"
            title="A local ISP built on trust, not promises"
            subtitle="Everything we do is engineered around one thing — a connection that simply keeps working."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustBadges.map((b, i) => {
              const I = getIcon(b.icon);
              return (
                <Reveal key={b.title} delay={i * 0.06}>
                  <div className="group h-full rounded-[1.75rem] bg-card border border-border p-7 card-lift">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:gradient-primary group-hover:text-white transition-all">
                      <I size={21} />
                    </div>
                    <h3 className="font-display text-lg font-extrabold mb-1.5">{b.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANS / BUNDLES */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Plans"
            title="Pick the Bundle That Fits Your Home"
            subtitle="We keep pricing simple and personal — message our team with your requirements and we'll recommend the right plan and current pricing for your address."
          />
          <BundleCards items={bundles} />
          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include free installation and 24x7 support. Exact pricing depends on your address and requirements —{" "}
            <Link to="/contact" className="font-semibold text-accent">contact us</Link> for a personalised quote.
          </p>
        </div>
      </section>

      <EntertainmentSection />
      <AddonServicesSection />


      {/* SERVICES */}
      <section className="py-20 md:py-28">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Our Services"
            title="One provider for every connection at home and work"
            subtitle="Broadband, television, streaming, voice and enterprise links — all on a single fiber line and a single bill."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const I = getIcon(s.icon);
              return (
                <Reveal key={s.slug} delay={(i % 3) * 0.06}>
                  <Link
                    to="/services"
                    className="group flex gap-4 h-full rounded-2xl border border-border bg-card p-6 hover:border-accent/40 hover:shadow-soft transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-secondary text-accent flex items-center justify-center shrink-0 group-hover:gradient-primary group-hover:text-white transition-all">
                      <I size={19} />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold group-hover:text-accent transition-colors">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.text}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US — split with image */}
      <section className="py-20 md:py-28 gradient-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative container-luxe grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="rounded-[2rem] overflow-hidden shadow-card hover-zoom">
                <img src={fiberInstall} alt="Chakra Fiber technician splicing fiber optic cable in Aruppukottai" width={1200} height={900} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-5 rounded-3xl glass-dark p-6 flex items-center gap-5">
                <div>
                  <div className="font-display text-3xl font-extrabold text-accent">4.8★</div>
                  <div className="text-xs text-white/50 uppercase tracking-wider">Local rating</div>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <p className="text-sm text-white/65">Rated by subscribers across Aruppukottai Taluk</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <SectionHeading
              align="left"
              light
              eyebrow="Why Choose Chakra Fiber"
              title="Enterprise-grade infrastructure with neighbourhood service"
              subtitle="We build, own and maintain our own fiber — so when something needs fixing, our engineer is minutes away, not a ticket in a queue."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              {whyUs.map((w, i) => {
                const I = getIcon(w.icon);
                return (
                  <Reveal key={w.title} delay={i * 0.05}>
                    <div className="rounded-2xl glass-dark p-5 h-full">
                      <I size={18} className="text-accent mb-3" />
                      <h3 className="font-display font-bold text-white">{w.title}</h3>
                      <p className="text-sm text-white/55 mt-1 leading-relaxed">{w.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section className="py-20 md:py-28">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionHeading
              align="left"
              eyebrow="Coverage Area"
              title="Is Chakra Fiber live on your street?"
              subtitle="Our fiber ring covers Aruppukottai town and is expanding rapidly across Virudhunagar district. Check your locality below."
            />
            <div className="flex flex-wrap gap-2 mb-8">
              {coverageAreas.map((a, i) => (
                <Reveal key={a.name} delay={i * 0.03}>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border ${
                      a.status === "live"
                        ? "border-accent/30 bg-accent/8 text-accent"
                        : a.status === "expanding"
                          ? "border-border bg-secondary text-foreground/70"
                          : "border-dashed border-border text-muted-foreground"
                    }`}
                  >
                    <MapPin size={12} /> {a.name}
                  </span>
                </Reveal>
              ))}
            </div>
            <Link to="/coverage" className="btn-orange">Check Availability <Search size={16} /></Link>
          </div>
          <Reveal delay={0.15} className="lg:col-span-6">
            <div className="rounded-[2rem] overflow-hidden border border-border shadow-card aspect-[4/3]">
              <iframe
                title="Chakra Fiber service area map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(brand.mapsQuery)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSTALL TIMELINE */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Installation Process"
            title="From enquiry to unlimited internet in five steps"
            subtitle="Most connections in serviceable areas are activated within 24 to 48 hours."
          />
          <div className="relative">
            <div className="hidden lg:block absolute top-[46px] left-[10%] right-[10%] h-px bg-border" aria-hidden="true" />
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {installSteps.map((s, i) => (
                <Reveal key={s.step} delay={i * 0.09}>
                  <li className="relative text-center lg:text-left">
                    <div className="mx-auto lg:mx-0 w-14 h-14 rounded-2xl gradient-primary text-white font-display font-extrabold flex items-center justify-center shadow-orange mb-5">
                      {s.step}
                    </div>
                    <h3 className="font-display font-extrabold text-lg">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-[26rem] h-[26rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="relative container-luxe">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="Why Customers Choose Us"
            subtitle="Real feedback from subscribers across our service area."
          />
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container-luxe">
          <SectionHeading eyebrow="FAQ" title="Questions before you switch?" subtitle="Everything about installation, billing, coverage and support." />
          <FaqAccordion items={faqs.slice(0, 6)} />
          <div className="text-center mt-8">
            <Link to="/faq" className="text-sm font-semibold text-accent inline-flex items-center gap-1.5">
              Read all FAQs <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA + FORM */}
      <section className="py-20 md:py-28 gradient-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="absolute -top-24 right-0 w-[30rem] h-[30rem] rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative container-luxe grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              light
              eyebrow="Get Connected"
              title="Book your fiber connection today"
              subtitle="Share your details and a Chakra Fiber advisor will call you to confirm feasibility and schedule installation."
            />
            <div className="space-y-3">
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors">
                <span className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center"><Phone size={16} /></span>
                {brand.phone}
              </a>
              <div className="flex items-center gap-3 text-white/60">
                <span className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center"><Star size={16} /></span>
                {brand.hours}
              </div>
            </div>
            <motion.img
              src={homeFamily}
              alt="Family enjoying HD television and broadband at home"
              width={1200}
              height={900}
              loading="lazy"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block mt-8 rounded-3xl object-cover h-48 w-full"
            />
          </div>
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-[2rem] glass-dark p-7 md:p-9">
              <EnquiryForm variant="dark" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-luxe">
          <Reveal>
            <div className="rounded-[2rem] overflow-hidden relative">
              <img src={networkOps} alt="Chakra Fiber network operations centre" width={1200} height={900} loading="lazy" className="w-full h-56 md:h-72 object-cover" />
              <div className="absolute inset-0 bg-navy-deep/70 flex items-center">
                <div className="container-luxe">
                  <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white max-w-xl leading-tight">
                    Monitored 24×7 from our own network operations centre.
                  </h2>
                  <Link to="/about" className="btn-glass mt-6 text-sm">About our network <ArrowUpRight size={15} /></Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Home;
