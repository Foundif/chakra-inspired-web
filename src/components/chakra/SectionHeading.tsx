import Reveal from "@/components/sections/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
};

const SectionHeading = ({ eyebrow, title, subtitle, align = "center", light }: Props) => (
  <div className={`${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"} mb-12 md:mb-16`}>
    {eyebrow && (
      <Reveal>
        <div className={`label-eyebrow mb-4 ${light ? "text-white/70" : ""}`}>{eyebrow}</div>
      </Reveal>
    )}
    <Reveal delay={0.06}>
      <h2 className={`font-display text-3xl md:text-5xl font-extrabold leading-[1.08] text-balance ${light ? "text-white" : "text-foreground"}`}>
        {title}
      </h2>
    </Reveal>
    {subtitle && (
      <Reveal delay={0.12}>
        <p className={`mt-5 text-base md:text-lg leading-relaxed ${light ? "text-white/65" : "text-muted-foreground"}`}>{subtitle}</p>
      </Reveal>
    )}
  </div>
);

export default SectionHeading;
