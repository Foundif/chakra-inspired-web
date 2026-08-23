import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import EnquiryForm from "@/components/chakra/EnquiryForm";
import Reveal from "@/components/sections/Reveal";
import { brand } from "@/data/chakra";

const Contact = () => {
  const tel = brand.phone.replace(/\s/g, "");
  const cards = [
    { icon: Phone, title: "Call us", lines: [brand.phone, brand.phoneAlt], href: `tel:${tel}` },
    { icon: MessageCircle, title: "WhatsApp", lines: ["Instant support & renewals"], href: `https://wa.me/${brand.whatsapp}` },
    { icon: Mail, title: "Email", lines: [brand.email], href: `mailto:${brand.email}` },
    { icon: MapPin, title: "Office", lines: [brand.address1, brand.address2, brand.city], href: brand.justdial },
    { icon: Clock, title: "Hours", lines: [brand.hours, brand.emergency] },
  ];

  return (
    <>
      <Seo
        title="Contact Chakra Fiber | New Connection & Support Aruppukottai"
        description="Call +91 90474 55550 or visit our office opposite Marakadai Bus Stop, Thiruchuli Road, Aruppukottai for new fiber connections, billing and 24×7 support."
        path="/contact"
      />
      <PageBanner
        eyebrow="Contact"
        title="Talk to a real person, locally"
        subtitle="New connection, upgrade, shifting or a fault — our team responds fast."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-4">
            {cards.map((c, i) => {
              const Body = (
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 h-full hover:border-accent/40 transition-colors">
                  <span className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <c.icon size={18} />
                  </span>
                  <div>
                    <h2 className="font-display font-extrabold">{c.title}</h2>
                    {c.lines.map((l) => (
                      <p key={l} className="text-sm text-muted-foreground">{l}</p>
                    ))}
                  </div>
                </div>
              );
              return (
                <Reveal key={c.title} delay={i * 0.05}>
                  {c.href ? (
                    <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{Body}</a>
                  ) : (
                    Body
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-[2rem] bg-card border border-border p-7 md:p-9 shadow-soft">
              <SectionHeading align="left" eyebrow="Enquiry" title="Request a new connection" subtitle="We'll call you back within 30 minutes during working hours." />
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-luxe">
          <div className="rounded-[2rem] overflow-hidden border border-border shadow-soft aspect-[16/9] md:aspect-[21/9]">
            <iframe
              title="Chakra Fiber office location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(brand.mapsQuery)}&output=embed`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
