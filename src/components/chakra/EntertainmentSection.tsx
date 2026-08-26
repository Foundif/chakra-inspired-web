import SectionHeading from "@/components/chakra/SectionHeading";
import BrandMarquee from "@/components/chakra/BrandMarquee";
import { ottApps, tvChannels } from "@/data/bundles";

const EntertainmentSection = () => (
  <section className="py-20 md:py-28 bg-secondary/50 overflow-hidden">
    <div className="container-luxe">
      <SectionHeading eyebrow="Entertainment" title="11+ OTT Apps Included" />
    </div>
    <BrandMarquee items={ottApps} speed="38s" />

    <div className="mt-20">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Live TV"
          title="350+ HD TV Channels"
          subtitle="Including the full range of popular Tamil channels:"
        />
      </div>
      <div className="space-y-3">
        <BrandMarquee items={tvChannels} speed="44s" />
        <BrandMarquee items={[...tvChannels].reverse()} speed="52s" reverse />
      </div>
    </div>
  </section>
);

export default EntertainmentSection;
