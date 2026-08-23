import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import Seo from "@/components/Seo";
import Reveal from "@/components/sections/Reveal";
import PageBanner from "@/components/chakra/PageBanner";
import { supabase } from "@/integrations/supabase/client";
import fiberInstall from "@/assets/chakra/fiber-install.jpg";
import networkOps from "@/assets/chakra/network-ops.jpg";
import homeFamily from "@/assets/chakra/home-family.jpg";
import office from "@/assets/chakra/office.jpg";
import poleWork from "@/assets/chakra/pole-work.jpg";
import router from "@/assets/chakra/router.jpg";
import team from "@/assets/chakra/team.jpg";
import splice from "@/assets/chakra/splice.jpg";

const fallbackItems = [
  { src: poleWork, alt: "Chakra Fiber technician installing aerial fiber cable", h: "row-span-2" },
  { src: networkOps, alt: "Network operations centre and core routers", h: "" },
  { src: splice, alt: "Fusion splicing fiber optic strands", h: "row-span-2" },
  { src: office, alt: "Chakra Fiber customer care office in Aruppukottai", h: "" },
  { src: fiberInstall, alt: "Fiber installation work in progress", h: "" },
  { src: team, alt: "Chakra Fiber field engineering team", h: "row-span-2" },
  { src: router, alt: "Dual-band Wi-Fi router installed at a customer home", h: "" },
  { src: homeFamily, alt: "Family streaming on a Chakra Fiber connection", h: "" },
];

const Gallery = () => {
  const [items, setItems] = useState(fallbackItems as Array<{ src: string; alt: string; h: string }>);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("gallery_images").select("*").eq("is_active", true).order("sort_order", { ascending: true });
      if (data && data.length) setItems(data.map((g: any) => ({ src: g.image_url, alt: g.alt_text || g.caption || "", h: g.size_class || "" })));
    };
    load();
    const ch = supabase.channel("gallery_live").on("postgres_changes", { event: "*", schema: "public", table: "gallery_images" }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <>
      <Seo
        title="Gallery | Chakra Fiber Network & Installations"
        description="Photos of the Chakra Fiber network — fiber installations, splicing work, our operations centre and customer care office in Aruppukottai."
        path="/gallery"
      />
      <PageBanner eyebrow="Gallery" title="Our network, our people, our work" subtitle="A look inside the infrastructure that keeps Aruppukottai online." crumbs={[{ label: "Gallery" }]} />

      <section className="py-16 md:py-24">
        <div className="container-luxe">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px] md:auto-rows-[200px]">
            {items.map((it, i) => (
              <Reveal key={i} delay={(i % 4) * 0.05} className={it.h}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="hover-zoom rounded-2xl overflow-hidden h-full cursor-pointer border border-border">
                      <img src={it.src} alt={it.alt} loading="lazy" width={1200} height={900} className="w-full h-full object-cover" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-none w-auto h-auto p-0 bg-transparent border-none shadow-none flex justify-center items-center [&>button]:hidden">
                    <div className="relative inline-block w-[92vw] sm:w-auto">
                      <img src={it.src} alt={it.alt} className="rounded-xl w-full h-auto sm:w-auto sm:max-h-[85vh] sm:max-w-[92vw] object-contain" />
                      <DialogClose className="absolute top-2 right-2 bg-white text-accent rounded-full p-1 hover:bg-accent hover:text-white transition-colors border-0">
                        <X size={18} />
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Gallery;
