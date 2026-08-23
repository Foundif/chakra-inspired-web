import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import PlanCards from "@/components/chakra/PlanCards";
import FaqAccordion from "@/components/chakra/FaqAccordion";
import Reveal from "@/components/sections/Reveal";
import { faqs, plans } from "@/data/chakra";

const filters = [
  { key: "all", label: "All Plans" },
  { key: "home", label: "Home" },
  { key: "business", label: "Business" },
] as const;

const Plans = () => {
  const [tab, setTab] = useState<(typeof filters)[number]["key"]>("all");
  const items = tab === "all" ? plans : plans.filter((p) => p.category === tab);

  return (
    <>
      <Seo
        title="Broadband Plans & Prices | Chakra Fiber Aruppukottai"
        description="Compare unlimited fiber broadband plans from ₹399/month in Aruppukottai. Free installation, HD cable TV, OTT bundles and business connections with SLA."
        path="/plans"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: plans.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Product", name: `${p.name} ${p.speed}`, offers: { "@type": "Offer", price: p.price, priceCurrency: "INR" } },
          })),
        }}
      />
      <PageBanner
        eyebrow="Broadband Plans"
        title="Unlimited fiber plans for every home and business"
        subtitle="Transparent pricing, no fair-usage throttling and free installation on longer terms."
        crumbs={[{ label: "Plans" }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <div className="flex justify-center gap-2 mb-12">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setTab(f.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  tab === f.key ? "gradient-primary text-white shadow-orange" : "border border-border text-foreground/70 hover:border-accent hover:text-accent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <PlanCards items={items} />

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
