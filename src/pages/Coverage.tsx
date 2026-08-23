import { useMemo, useState } from "react";
import { CheckCircle2, MapPin, Search, XCircle } from "lucide-react";
import Seo from "@/components/Seo";
import PageBanner from "@/components/chakra/PageBanner";
import SectionHeading from "@/components/chakra/SectionHeading";
import Reveal from "@/components/sections/Reveal";
import EnquiryForm from "@/components/chakra/EnquiryForm";
import { brand, coverageAreas } from "@/data/chakra";

const statusCopy = {
  live: { label: "Live now", cls: "border-accent/30 bg-accent/8 text-accent" },
  expanding: { label: "Rolling out", cls: "border-border bg-secondary text-foreground/70" },
  planned: { label: "Planned", cls: "border-dashed border-border text-muted-foreground" },
} as const;

const Coverage = () => {
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState<null | { name: string; status: string }>(null);

  const results = useMemo(
    () => coverageAreas.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q],
  );

  return (
    <>
      <Seo
        title="Coverage Area | Chakra Fiber Broadband in Aruppukottai"
        description="Check Chakra Fiber broadband availability in Aruppukottai, Thiruchuli Road, Marakadai, Narikudi, Virudhunagar and surrounding areas."
        path="/coverage"
      />
      <PageBanner
        eyebrow="Coverage"
        title="Check fiber availability at your address"
        subtitle="Our own fiber ring runs across Aruppukottai town, with active expansion into neighbouring towns."
        crumbs={[{ label: "Coverage" }]}
      />

      <section className="py-16 md:py-24">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <SectionHeading align="left" eyebrow="Availability check" title="Search your locality" subtitle="Type your area name to see current service status." />

            <div className="relative mb-6">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setChecked(null); }}
                placeholder="e.g. Thiruchuli Road"
                aria-label="Search your area"
                className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3.5 text-sm outline-none focus:border-accent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {results.map((a, i) => {
                const s = statusCopy[a.status as keyof typeof statusCopy];
                return (
                  <Reveal key={a.name} delay={i * 0.03}>
                    <button
                      onClick={() => setChecked({ name: a.name, status: a.status })}
                      className="w-full flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 text-left hover:border-accent/40 transition-colors"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-semibold">
                        <MapPin size={15} className="text-accent" /> {a.name}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>
                    </button>
                  </Reveal>
                );
              })}
              {results.length === 0 && (
                <div className="sm:col-span-2 rounded-2xl border border-dashed border-border p-6 text-center">
                  <XCircle size={22} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    We don't list "{q}" yet — submit the form and we'll run a feasibility check for your street.
                  </p>
                </div>
              )}
            </div>

            {checked && (
              <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/6 p-5 flex gap-3">
                <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>{checked.name}</strong> —{" "}
                  {checked.status === "live"
                    ? "fiber is live here. New connections are typically activated within 24–48 hours."
                    : checked.status === "expanding"
                      ? "our network is rolling out here right now. Register and we'll prioritise your street."
                      : "this area is on our build plan. Register your interest to be notified first."}{" "}
                  Call <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="text-accent font-semibold">{brand.phone}</a> to confirm.
                </p>
              </div>
            )}

            <div className="mt-8 rounded-[2rem] overflow-hidden border border-border shadow-soft aspect-[16/10]">
              <iframe
                title="Chakra Fiber coverage map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(brand.mapsQuery)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <Reveal delay={0.15} className="lg:col-span-6">
            <div className="rounded-[2rem] bg-card border border-border p-7 md:p-9 shadow-soft lg:sticky lg:top-28">
              <h2 className="font-display text-2xl font-extrabold mb-1.5">Register your address</h2>
              <p className="text-sm text-muted-foreground mb-7">We'll survey your street and confirm availability the same day.</p>
              <EnquiryForm compact />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Coverage;
