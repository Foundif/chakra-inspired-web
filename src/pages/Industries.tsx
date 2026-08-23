import EditableHero from "@/components/sections/EditableHero";
import SectionGate from "@/components/sections/SectionGate";
import QuoteCTA from "@/components/sections/QuoteCTA";
import Reveal from "@/components/sections/Reveal";
import Seo from "@/components/Seo";
import garments from "@/assets/garment-industry.jpeg";
import hangTag from "@/assets/fashion-brands.jpeg";
import rolls from "@/assets/export-house.jpeg";
import jeans from "@/assets/jeans-label.jpg";

const industries = [
  { title: "Garment Manufacturers", img: garments, desc: "Bulk supply for OEM and contract manufacturers across India's apparel hubs." },
  { title: "Fashion Brands", img: hangTag, desc: "Premium woven and printed labels for emerging and established fashion labels." },
  { title: "Export Houses", img: rolls, desc: "Compliant care labels and barcoded tags engineered for international retail." },
  { title: "Retail Clothing Brands", img: jeans, desc: "Branded hang tags, pricing tickets, and shelf-ready packaging." },
];

const Industries = () => (
  <>
    <Seo title="Industries Served | Garment, Fashion, Export & Retail Labels" description="Sri Kanish Enterprises supplies textile labels, hang tags and apparel branding for garment manufacturers, fashion brands, export houses and retail clothing brands." path="/industries" />
    <EditableHero page="industries" fallback={{ eyebrow: "Industries Served", title: "Trusted by apparel businesses at every scale.", subtitle: "From boutique fashion labels to large export houses, our labels travel the world on garments people love." }} />
    <SectionGate page="industries" blockKey="grid"><section className="py-24">
      <div className="container-luxe grid md:grid-cols-2 gap-8">
        {industries.map((c, i) => (
          <Reveal key={c.title} delay={(i % 2) * 0.1}>
            <div className="hover-zoom rounded-2xl overflow-hidden relative aspect-[4/3] group">
              <img src={c.img} alt={c.title} loading="lazy" width={1200} height={900} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-8 text-ivory">
                <h3 className="font-display text-3xl mb-3">{c.title}</h3>
                <p className="text-ivory/70 max-w-md">{c.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section></SectionGate>
    <SectionGate page="industries" blockKey="quote_cta"><QuoteCTA /></SectionGate>
  </>
);

export default Industries;
