import { Link } from "react-router-dom";
import { ArrowUpRight, Cable, GitBranch, ServerCog } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import Reveal from "@/components/sections/Reveal";
import { brand } from "@/data/chakra";
import team from "@/assets/chakra/team.jpg";
import networkOps from "@/assets/chakra/network-ops.jpg";
import office from "@/assets/chakra/office.jpg";
import poleWork from "@/assets/chakra/pole-work.jpg";
import splice from "@/assets/chakra/splice.jpg";
import router from "@/assets/chakra/router.jpg";

const milestones = [
  { year: "2013", title: "A cable operator on Thiruchuli Road", text: "We began as a small neighbourhood cable TV service, knocking on doors and earning trust one home at a time." },
  { year: "2016", title: "First fiber in the ground", text: "We laid our first fiber routes and started bundling digital TV with true broadband for early subscribers." },
  { year: "2019", title: "Full fiber-to-the-home rollout", text: "Our own fiber ring went live across Aruppukottai town, replacing ageing copper with gigabit-ready lines." },
  { year: "2022", title: "OTT bundles & business internet", text: "We crossed 2,500 subscribers and launched OTT entertainment bundles plus dedicated links for local businesses." },
  { year: "2026", title: "5,000+ connections strong", text: "Today our network carries unlimited broadband, 350+ channels, OTT and telephone services across the district." },
];

const infrastructure = [
  {
    icon: GitBranch,
    img: poleWork,
    title: "Our own fiber ring",
    text: "Every metre of fiber is laid and maintained by Chakra Fiber engineers — no leased last mile, no third-party blame games.",
  },
  {
    icon: Cable,
    img: splice,
    title: "In-house splicing team",
    text: "Faults are located and spliced by our own crew, which is why most outages are fixed the same day they are reported.",
  },
  {
    icon: ServerCog,
    img: router,
    title: "Redundant core & power backup",
    text: "Dual upstream providers and battery backup at every distribution point keep you online even during town power cuts.",
  },
];

const About = () => (
  <>
    <Seo
      title="About Chakra Fiber | Local Fiber ISP in Aruppukottai"
      description="For over 13 years Chakra Fiber Networks has built and operated its own fiber network across Aruppukottai, serving 5,000+ homes and businesses with unlimited broadband and 24×7 local support."
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
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src={team} alt="Chakra Fiber engineering team" width={1200} height={900} loading="lazy" className="rounded-2xl object-cover h-64 w-full col-span-2" />
              <img src={networkOps} alt="Network operations centre" width={1200} height={900} loading="lazy" className="rounded-2xl object-cover h-44 w-full" />
              <img src={office} alt="Customer care office" width={1200} height={900} loading="lazy" className="rounded-2xl object-cover h-44 w-full" />
            </div>
            <div className="absolute -bottom-5 left-6 rounded-2xl gradient-primary text-white px-6 py-4 shadow-orange">
              <div className="font-display text-3xl font-extrabold leading-none">13+</div>
              <div className="text-[11px] uppercase tracking-widest text-white/80 mt-1">Years serving Aruppukottai</div>
            </div>
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow="Our Story"
            title="Built street by street, in our own town"
            subtitle="For over 13 years we have grown from a small cable operator on Thiruchuli Road into a full fiber-to-the-home provider serving thousands of families and businesses."
          />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Every metre of our fiber is laid, spliced and monitored by our own engineers. That ownership is why we can
              promise same-day fault visits and honest pricing — there is no distant call centre between you and the
              people who run the network.
            </p>
            <p>
              Today Chakra Fiber carries unlimited broadband, 350+ digital TV channels, OTT bundles, telephone services
              and business-grade links across Aruppukottai and neighbouring towns, backed by redundant upstream capacity
              and full power backup at every distribution point.
            </p>
          </div>
          <Link to="/contact" className="btn-orange mt-8">Get connected <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 gradient-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
      <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
      <div className="relative container-luxe">
        <SectionHeading
          light
          eyebrow="Our Journey"
          title="Thirteen years, one street at a time"
          subtitle="Milestones from a single-room cable office to a district-wide fiber network."
        />
        <ol className="relative mt-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-white/15 md:before:left-1/2">
          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.05}>
              <li className={`relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "" : ""}`}>
                <span className="absolute left-0 top-1 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-xl gradient-primary text-white font-display text-xs font-extrabold flex items-center justify-center shadow-orange">
                  {m.year}
                </span>
                <div className={`rounded-2xl glass-dark p-6 ${i % 2 ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
                  <h3 className="font-display font-extrabold text-white">{m.title}</h3>
                  <p className="text-sm text-white/60 mt-1.5 leading-relaxed">{m.text}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Inside the Network"
          title="Infrastructure we own, end to end"
          subtitle="A look at the physical network behind your connection — built and run entirely by our local team."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {infrastructure.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="group h-full rounded-[1.75rem] overflow-hidden border border-border bg-card card-lift">
                <div className="h-44 overflow-hidden">
                  <img src={c.img} alt={c.title} width={1200} height={900} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <c.icon size={19} className="text-accent mb-3" />
                  <h3 className="font-display font-extrabold">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{c.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-luxe">
        <Reveal>
          <div className="rounded-[2rem] overflow-hidden relative">
            <img src={networkOps} alt="Chakra Fiber network operations centre" width={1200} height={900} loading="lazy" className="w-full h-64 md:h-80 object-cover" />
            <div className="absolute inset-0 bg-navy-deep/70 flex items-center">
              <div className="container-luxe">
                <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white max-w-xl leading-tight">
                  Want to see what 13 years of fiber looks like on your street?
                </h2>
                <Link to="/coverage" className="btn-orange mt-6 text-sm">Check coverage <ArrowUpRight size={15} /></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default About;
