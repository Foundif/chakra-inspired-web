import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import FaqAccordion from "@/components/chakra/FaqAccordion";
import { faqs } from "@/data/chakra";

const Faq = () => (
  <>
    <Seo
      title="FAQ | Chakra Fiber Broadband Support & Billing"
      description="Answers about Chakra Fiber installation time, unlimited data, plan renewal, cable TV bundles, business static IP and 24×7 support in Aruppukottai."
      path="/faq"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }}
    />
    <PageBanner
      eyebrow="Support"
      title="Frequently asked questions"
      subtitle="Installation, billing, coverage and troubleshooting — answered plainly."
      crumbs={[{ label: "FAQ" }]}
    />
    <section className="py-16 md:py-24">
      <div className="container-luxe">
        <FaqAccordion items={faqs} />
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-5">Still have a question?</p>
          <Link to="/contact" className="btn-orange">Talk to our team <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  </>
);

export default Faq;
