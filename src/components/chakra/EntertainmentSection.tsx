import SectionHeading from "@/components/chakra/SectionHeading";
import Reveal from "@/components/sections/Reveal";
import BrandLogo from "@/components/chakra/BrandLogo";
import { ottApps, tvChannels } from "@/data/bundles";

const EntertainmentSection = () => (
  <section className="py-20 md:py-28 bg-secondary/50">
    <div className="container-luxe">
      <SectionHeading eyebrow="Entertainment" title="11+ OTT Apps Included" />
      <div className="flex flex-wrap justify-center gap-3">
        {ottApps.map((b, i) => (
          <Reveal key={b.name} delay={(i % 6) * 0.04}>
            <BrandLogo brand={b} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20">
        <SectionHeading
          eyebrow="Live TV"
          title="350+ HD TV Channels"
          subtitle="Including the full range of popular Tamil channels:"
        />
        <div className="flex flex-wrap justify-center gap-3">
          {tvChannels.map((b, i) => (
            <Reveal key={b.name} delay={(i % 6) * 0.04}>
              <BrandLogo brand={b} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default EntertainmentSection;
