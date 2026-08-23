import LeadForm from "./LeadForm";
import { useProductCategories } from "@/hooks/useProductCategories";

type Props = {
  title?: React.ReactNode;
  eyebrow?: string;
  subtitle?: string;
  variant?: "dark" | "light";
  defaultProduct?: string;
};

const QuoteCTA = ({
  eyebrow = "Request a Quote",
  title = (<>Tell us about your <span className="text-orange">project.</span></>),
  subtitle = "Share your specs — our team replies on WhatsApp within working hours.",
  variant = "dark",
  defaultProduct,
}: Props) => {
  const cats = useProductCategories();
  const dark = variant === "dark";
  return (
    <section className={`py-20 md:py-28 ${dark ? "bg-navy-deep text-white" : "bg-secondary/40"} relative overflow-hidden`}>
      {dark && (
        <>
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange/15 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange/10 blur-3xl" />
        </>
      )}
      <div className="container-luxe relative grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5">
          <div className={`text-xs uppercase tracking-[0.25em] font-semibold ${dark ? "text-orange" : "text-orange"} mb-3`}>
            {eyebrow}
          </div>
          <h2 className={`font-display text-3xl md:text-5xl font-extrabold leading-[1.05] mb-5 ${dark ? "text-white" : "text-foreground"}`}>
            {title}
          </h2>
          <p className={`${dark ? "text-white/70" : "text-muted-foreground"} text-lg leading-relaxed max-w-md`}>
            {subtitle}
          </p>
        </div>
        <div className="lg:col-span-7">
          <LeadForm variant={variant} productOptions={cats.map((c) => ({ slug: c.slug, title: c.title }))} defaultProduct={defaultProduct} />
        </div>
      </div>
    </section>
  );
};

export default QuoteCTA;