import Reveal from "@/components/sections/Reveal";
import oekoTex from "@/assets/certifications/oeko-tex.jpg";
import fsc from "@/assets/certifications/fsc.jpg";
import iso from "@/assets/certifications/iso-9001-2015.jpg";

export const certifications = [
  {
    img: iso,
    name: "ISO 9001:2015",
    body: "Internationally recognised quality management system — every order is produced under documented process control, traceability and continuous improvement audits.",
  },
  {
    img: oekoTex,
    name: "OEKO-TEX® Standard 100",
    body: "Every label component is tested for harmful substances — safe against skin contact and compliant with the global STANDARD 100 textile certification.",
  },
  {
    img: fsc,
    name: "FSC® Certified",
    body: "Our hang tags and paper-based packaging use stock from FSC-certified, responsibly-managed forests — a credential trusted by sustainability-led brands worldwide.",
  },
];

type Props = {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  body?: React.ReactNode;
  className?: string;
};

const CertificationsSection = ({ eyebrow, title, body, className = "" }: Props) => (
  <section className={`py-20 md:py-24 bg-secondary/40 ${className}`}>
    <div className="container-luxe">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-orange mb-3">
            {eyebrow ?? "Certifications"}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold leading-[1.05] text-balance">
            {title ?? (<>Globally accredited. <span className="text-orange">Export-ready compliance.</span></>)}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            {body ?? "Every roll is backed by independently verified credentials — so your brand ships into the most demanding retail and export markets with confidence."}
          </p>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={0.1 + i * 0.08}>
            <div className="h-full flex flex-col items-center text-center p-6 md:p-8 bg-background rounded-2xl border border-border shadow-soft hover:shadow-card transition-shadow">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-secondary/60 flex items-center justify-center p-3 mb-5">
                <img
                  src={c.img}
                  alt={`${c.name} certification`}
                  loading="lazy"
                  width={256}
                  height={256}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">{c.name}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default CertificationsSection;
