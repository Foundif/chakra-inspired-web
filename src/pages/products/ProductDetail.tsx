import { useParams, Link, Navigate } from "react-router-dom";
import QuoteCTA from "@/components/sections/QuoteCTA";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/sections/Reveal";
import { productCategories, site } from "@/data/site";
import { productImageMap as imgs } from "@/assets/products";

const details: Record<string, { overview: string; features: string[]; materials: string[]; customization: string[]; applications: string[]; price: string }> = {
  "woven-labels": {
    overview: "Loom-woven brand labels with crisp, durable detail — the gold standard for premium apparel branding.",
    features: ["Damask, satin & taffeta weaves", "High thread density", "Soft hand feel", "Wash & wear durable"],
    materials: ["Polyester yarn", "Cotton blend", "Recycled fibers"],
    customization: ["Multi-colour weaving", "Custom shapes & sizes", "Folded or flat finish", "Heat-cut or laser-cut edges"],
    applications: ["Premium fashion brands", "Sportswear", "Workwear & uniforms", "Children's wear"],
    price: "₹0.50 – ₹6 / piece",
  },
  "hang-tags": {
    overview: "Premium hang tags that introduce your brand at first touch. Card, paper, kraft, and specialty finishes.",
    features: ["300–500 GSM card stock", "Foil stamping & embossing", "Spot UV & matte lamination", "Custom die-cut shapes"],
    materials: ["Art card", "Recycled kraft", "Coated paper", "Specialty textured stock"],
    customization: ["Up to 6-colour print", "Gold/silver foil", "String & barcode add-ons", "Multi-fold formats"],
    applications: ["Retail clothing brands", "Boutique labels", "Export consignments"],
    price: "₹1 – ₹25 / piece",
  },
  "wash-care-labels": {
    overview: "Compliant wash care labels printed on polyester satin or taffeta — designed for legibility through hundreds of wash cycles.",
    features: ["Care symbols & multilingual text", "Fade-resistant inks", "Soft, skin-friendly base"],
    materials: ["Polyester satin", "Taffeta", "Nylon"],
    customization: ["Brand+care combined", "Multilingual layouts", "Compliance markings"],
    applications: ["Garment exports", "Retail apparel", "Innerwear & sportswear"],
    price: "₹0.30 – ₹2 / piece",
  },
  "taffeta-labels": {
    overview: "Smooth printed taffeta labels — economical and reliable for size, care, and brand identification.",
    features: ["Smooth printable surface", "Cost-effective at volume", "Multi-colour print"],
    materials: ["Polyester taffeta", "Nylon taffeta"],
    customization: ["Brand+size combinations", "Custom widths"],
    applications: ["Mid-range apparel", "Bulk garment orders"],
    price: "₹0.40 – ₹3 / piece",
  },
  "printed-labels": {
    overview: "Custom printed labels using heat transfer, screen, and digital printing for vibrant, full-colour brand expression.",
    features: ["Photo-realistic detail", "Heat-transfer & screen options", "Stretch & sportswear ready"],
    materials: ["TPU film", "Satin", "Cotton tape"],
    customization: ["Full-colour artwork", "Texture finishes", "Stretchable bases"],
    applications: ["Sportswear", "Activewear", "Fashion-forward streetwear"],
    price: "₹1 – ₹8 / piece",
  },
  "garment-tags": {
    overview: "Branded garment tags that combine product information, pricing, and visual identity in one polished asset.",
    features: ["Multi-layer designs", "Barcoded variants", "Eyelet & string options"],
    materials: ["Art card", "Plastic", "Eco kraft"],
    customization: ["Brand+price+size combinations", "Seasonal artwork"],
    applications: ["Retail brands", "Department-store consignments"],
    price: "₹2 – ₹30 / piece",
  },
  "jeans-labels": {
    overview: "Leather, faux-leather, and patch labels engineered for denim — built to handle stonewash and abrasion.",
    features: ["Embossed & debossed branding", "Hot-pressed finish", "Wash-stable backing"],
    materials: ["Genuine leather", "PU leather", "Heavy denim patch"],
    customization: ["Logo embossing", "Stitched edges", "Multi-tone patches"],
    applications: ["Denim brands", "Premium jeans labels"],
    price: "₹3 – ₹40 / piece",
  },
  "size-labels": {
    overview: "Compact, legible size labels in satin or taffeta — the small detail that signals professionalism.",
    features: ["Sharp print", "Cut & fold ready", "Skin-safe materials"],
    materials: ["Polyester satin", "Cotton tape"],
    customization: ["Numeric & alpha sizing", "Brand+size combo"],
    applications: ["All garment categories"],
    price: "₹15 - ₹60 / piece",
  },
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = productCategories.find((p) => p.slug === slug);
  if (!product) return <Navigate to="/products" replace />;
  const d = details[slug!];

  return (
    <>
      <PageHero
        eyebrow={`Products / ${product.title}`}
        title={product.title}
        subtitle={d.overview}
        image={imgs[slug!]}
      />

      <section className="py-24">
        <div className="container-luxe grid lg:grid-cols-2 gap-16">
          <Reveal>
            <div className="hover-zoom rounded-2xl shadow-luxe sticky top-32">
              <img src={imgs[slug!]} alt={`${product.title} manufacturer Tiruppur India`} loading="lazy" width={1280} height={1280} className="w-full h-[600px] object-cover rounded-2xl" />
            </div>
          </Reveal>

          <div className="space-y-12">
            {[
              { title: "Features", items: d.features },
              { title: "Material Options", items: d.materials },
              { title: "Customization", items: d.customization },
              { title: "Applications", items: d.applications },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 0.05}>
                <div>
                  <div className="label-eyebrow mb-4">{b.title}</div>
                  <ul className="space-y-3">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3 text-lg">
                        <Check className="text-gold mt-1.5 shrink-0" size={16} />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            <Reveal>
              <div className="p-8 bg-secondary rounded-2xl">
                <div className="label-eyebrow mb-3">Indicative Pricing</div>
                <div className="font-display text-3xl">{d.price}</div>
                <p className="text-sm text-muted-foreground mt-2">Final pricing depends on volume, finish, and material. Request a quote for your project.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={`https://wa.me/${site.whatsapp}?text=Hi%2C%20I%27d%20like%20a%20quote%20for%20${encodeURIComponent(product.title)}`} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-ivory rounded-full text-sm">
                    Get Quote on WhatsApp <ArrowRight size={16} />
                  </a>
                  <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm">
                    Send an Inquiry
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary">
        <div className="container-luxe">
          <Reveal><div className="label-eyebrow mb-4">Continue Exploring</div></Reveal>
          <Reveal delay={0.1}><h2 className="font-display text-3xl md:text-4xl mb-12">Related products</h2></Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.filter((p) => p.slug !== slug).slice(0, 4).map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} className="group hover-zoom rounded-xl overflow-hidden bg-card">
                <div className="aspect-square overflow-hidden">
                  <img src={imgs[p.slug]} alt={p.title} loading="lazy" width={600} height={600} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    <QuoteCTA />
    </>
  );
};

export default ProductDetail;
