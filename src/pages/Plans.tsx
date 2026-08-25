import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import BundleCards from "@/components/chakra/BundleCards";
import EntertainmentSection from "@/components/chakra/EntertainmentSection";
import AddonServicesSection from "@/components/chakra/AddonServicesSection";
import FaqAccordion from "@/components/chakra/FaqAccordion";
import Reveal from "@/components/sections/Reveal";
import { faqs } from "@/data/chakra";
import { bundles } from "@/data/bundles";

const Plans = () => {
  return (
    <>
      <Seo
        title="Broadband Plans & Bundles | Chakra Fiber Aruppukottai"
        description="Unlimited fiber internet, 350+ HD TV channels, 11+ OTT apps and telephone bundles in Aruppukottai. Free installation, 24x7 support and pricing quoted for your address."
        path="/plans"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: bundles.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Product", name: b.name, description: b.tagline },
          })),
        }}
      />
      <PageBanner
        eyebrow="Plans"
        title="Pick the Bundle That Fits Your Home"
        subtitle="We keep pricing simple and personal — message our team with your requirements and we'll recommend the right plan and current pricing for your address."
        crumbs={[{ label: "Plans" }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <BundleCards items={bundles} />
          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include free installation and 24x7 support. Exact pricing depends on your address and requirements —{" "}
            <Link to="/contact" className="font-semibold text-accent">contact us</Link> for a personalised quote.
          </p>


          <Reveal delay={0.2}>
            <div className="mt-14 rounded-[2rem] border border-border bg-card p-8 md:p-10 grid md:grid-cols-3 gap-8">
              {[
                { t: "Included with every plan", l: ["Truly unlimited data", "Free 24×7 support", "Static-IP option", "Same-day fault visits"] },
                { t: "Add-ons available", l: ["350+ HD TV channels", "11+ OTT platforms", "Landline telephone", "Mesh Wi-Fi extenders"] },
                { t: "Payment & renewal", l: ["UPI, card and cash", "Online renewal portal", "Annual loyalty discount", "GST invoices for business"] },
              ].map((c) => (
                <div key={c.t}>
                  <h3 className="font-display font-extrabold mb-4">{c.t}</h3>
                  <ul className="space-y-2.5">
                    {c.l.map((x) => (
                      <li key={x} className="flex gap-2.5 text-sm text-muted-foreground">
                        <Check size={15} className="text-accent shrink-0 mt-0.5" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-luxe">
          <SectionHeading eyebrow="Plan FAQ" title="Billing, speeds and installation" />
          <FaqAccordion items={faqs.slice(1, 6)} />
          <div className="text-center mt-10">
            <Link to="/contact" className="btn-orange">Get New Connection <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Plans;
