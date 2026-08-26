import { useState } from "react";
import type { Brand } from "@/data/bundles";

const token = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY as string | undefined;

/** Real brand logo tile (uploaded asset or Logo.dev), with a clean text chip fallback. */
const BrandLogo = ({ brand }: { brand: Brand }) => {
  const [failed, setFailed] = useState(!brand.logo && !token);
  const src = brand.logo ?? `https://img.logo.dev/${brand.domain}?token=${token}&size=96&format=png&retina=true`;


  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-soft hover:border-accent/40 transition-colors">
      {failed ? (
        <span className="w-8 h-8 rounded-xl bg-accent/10 text-accent grid place-items-center text-[11px] font-extrabold shrink-0">
          {brand.name.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <img
          src={src}
          alt={`${brand.name} logo`}
          width={32}
          height={32}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-8 h-8 rounded-xl object-contain bg-white shrink-0"
        />
      )}
      <span className="text-sm font-semibold whitespace-nowrap">{brand.name}</span>
    </div>
  );
};

export default BrandLogo;
