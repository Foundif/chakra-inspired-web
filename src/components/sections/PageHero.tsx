import Reveal from "./Reveal";
import defaultBg from "@/assets/page-hero-bg.jpg";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  /** When true, render a cinematic background-image hero (no side image). */
  background?: boolean | string;
};

const PageHero = ({ eyebrow, title, subtitle, image, background }: Props) => {
  const bgSrc = typeof background === "string" ? background : defaultBg;
  const useBg = Boolean(background);

  if (useBg) {
    return (
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          width={1920}
          height={768}
          className="absolute inset-0 w-full h-full object-cover -z-20"
        />
        {/* Use a light gradient overlay suitable for dark text */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/90 to-background -z-10" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-orange/20 blur-3xl -z-10" />
        <div className="relative container-luxe max-w-4xl text-foreground">
          <Reveal>
            {/* Use the default chip style */}
            <div className="chip mb-5">{eyebrow}</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight text-balance">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>
            </Reveal>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-background">
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-orange/10 blur-3xl -z-10" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-navy/5 blur-3xl -z-10" />

      <div className="relative container-luxe grid lg:grid-cols-12 gap-10 items-center">
        <div className={image ? "lg:col-span-7" : "lg:col-span-12 max-w-4xl"}>
          <Reveal>
            <div className="chip mb-5">{eyebrow}</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight text-foreground text-balance">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.2}>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">{subtitle}</p>
            </Reveal>
          )}
        </div>
        {image && (
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="rounded-3xl overflow-hidden shadow-card aspect-[4/5]">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
