import { Link } from "react-router-dom";
import QuoteCTA from "@/components/sections/QuoteCTA";
import { ArrowRight } from "lucide-react";
import EditableHero from "@/components/sections/EditableHero";
import SectionGate from "@/components/sections/SectionGate";
import Reveal from "@/components/sections/Reveal";
import Seo from "@/components/Seo";
import FaqSection from "@/components/sections/FaqSection";
import { useProductCategories } from "@/hooks/useProductCategories";
import { productImageMap as imgs } from "@/assets/products";

const Products = () => {
  const productCategories = useProductCategories();
  return (
  <>
    <Seo title="Textile Label Products | Woven Labels, Hang Tags, Wash Care | Sri Kanish" description="Explore woven labels, hang tags, wash care labels, taffeta, printed labels, garment tags, jeans labels and size labels manufactured in Tiruppur." path="/products" keywords="woven labels, hang tags, wash care labels, taffeta labels, printed labels, garment tags, jeans labels, size labels" />
    <EditableHero page="products" fallback={{ eyebrow: "Our Products", title: "Premium textile labels & branding materials, made in Tiruppur.", subtitle: "Explore our complete range of woven labels, hang tags, wash care labels, and custom branding solutions for apparel brands." }} />

    <SectionGate page="products" blockKey="grid"><section className="py-24">
      <div className="container-luxe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productCategories.map((p, i) => {
          const href = p.cta_href || `/products/${p.slug}`;
          const isExternal = /^https?:\/\//i.test(href);
          const img = p.image_url || imgs[p.slug];
          const inner = (
            <>
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img src={img} alt={`${p.title} supplier India`} loading="lazy" width={800} height={1000} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.short}</p>
                <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold group-hover:gap-3 transition-all">
                  {p.cta_label || "Discover"} <ArrowRight size={14} />
                </div>
              </div>
            </>
          );
          return (
            <Reveal key={p.slug} delay={(i % 3) * 0.08}>
              {isExternal ? (
                <a href={href} target="_blank" rel="noopener" className="group block hover-zoom rounded-2xl bg-card overflow-hidden shadow-soft">{inner}</a>
              ) : (
                <Link to={href} className="group block hover-zoom rounded-2xl bg-card overflow-hidden shadow-soft">{inner}</Link>
              )}
            </Reveal>
          );
        })}
      </div>
    </section></SectionGate>
    <SectionGate page="products" blockKey="quote_cta"><QuoteCTA /></SectionGate>
    <SectionGate page="products" blockKey="faq">
      <FaqSection
        title={<>Product <span className="text-orange">questions, answered.</span></>}
        items={[
          { q: "What is the minimum order quantity for woven labels?", a: "Typical MOQ is 1,000 pieces per design for woven labels. Hang tags start at 500 pieces. We accommodate smaller pilot runs for new partners." },
          { q: "Can you Pantone-match brand colours exactly?", a: "Yes. Our calibrated thread library and digital print profiles match Pantone references within industry-standard tolerance." },
          { q: "Do you offer eco-friendly or recycled label options?", a: "Yes — recycled polyester (rPET) woven labels and FSC-certified hang tag stock are available for sustainability-led brands." },
          { q: "Which finishes do you support on hang tags?", a: "Foil stamping, embossing, debossing, spot UV, soft-touch lamination, eyelets and braided cords — combine any for a premium finish." },
          { q: "Do you ship internationally?", a: "Yes. We export to 15+ countries with full documentation. Lead time depends on freight mode and destination." },
        ]}
      />
    </SectionGate>
  </>
  );
};

export default Products;
