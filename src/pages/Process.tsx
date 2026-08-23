import EditableHero from "@/components/sections/EditableHero";
import SectionGate from "@/components/sections/SectionGate";
import Reveal from "@/components/sections/Reveal";
import Seo from "@/components/Seo";
import FaqSection from "@/components/sections/FaqSection";

const steps = [
  { n: "01", title: "Requirement Discussion", desc: "We start by understanding your brand, garment category, volumes, and finish expectations." },
  { n: "02", title: "Design & Sampling", desc: "Our team translates your brief into artwork, then produces physical samples for evaluation." },
  { n: "03", title: "Approval", desc: "Iterate on weave, colour, and finish until the sample matches your vision precisely." },
  { n: "04", title: "Bulk Production", desc: "Industrial weaving, printing, and finishing — executed with calibrated machinery and skilled hands." },
  { n: "05", title: "Quality Check", desc: "Multi-stage inspection ensures every roll meets export-grade standards before dispatch." },
  { n: "06", title: "Delivery", desc: "Packaged, labelled, and dispatched on schedule — across India and worldwide." },
];

const faqs = [
  { q: "How long does the sampling stage take?", a: "Most pre-production samples are ready in 2–3 working days from artwork sign-off, depending on weave or print complexity." },
  { q: "Can you accommodate rush production runs?", a: "Yes — when capacity allows, we accelerate weaving and finishing to compress bulk delivery from 10–15 days down to 7." },
  { q: "What quality checks are performed before dispatch?", a: "Every roll passes shade, dimension, weave-density and finish QC. Wash-care labels also undergo wash-fastness testing for export." },
  { q: "Do you handle export documentation?", a: "Yes. We dispatch with packing lists, invoices, and HS-code paperwork so your forwarder can clear shipments without delay." },
  { q: "How are revisions managed during sampling?", a: "Up to three sampling iterations are included free of cost on confirmed bulk orders, ensuring artwork and finish match your brief precisely." },
];

const Process = () => (
  <>
    <Seo title="Our Manufacturing Process | Sri Kanish Enterprises" description="From brief and sampling to bulk weaving, QC and dispatch — see the six-step textile label manufacturing process at Sri Kanish Enterprises, Tiruppur." path="/process" />
    <EditableHero page="process" fallback={{ eyebrow: "Our Process", title: "Six precise steps from brief to delivery.", subtitle: "A transparent, accountable workflow built around your production timeline." }} />
    <SectionGate page="process" blockKey="steps"><section className="py-24">
      <div className="container-luxe">
        <div className="space-y-px bg-border">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="bg-background py-10 md:py-14 grid md:grid-cols-12 gap-6 items-start group hover:bg-secondary/40 transition-colors px-6">
                <div className="md:col-span-2 font-display text-5xl text-gold">{s.n}</div>
                <div className="md:col-span-4 font-display text-2xl md:text-3xl">{s.title}</div>
                <div className="md:col-span-6 text-muted-foreground text-lg leading-relaxed">{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section></SectionGate>
    <SectionGate page="process" blockKey="faq">
      <FaqSection title={<>Process <span className="text-orange">questions, answered.</span></>} items={faqs} />
    </SectionGate>
  </>
);

export default Process;