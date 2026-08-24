import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Wifi } from "lucide-react";
import Counter from "@/components/sections/Counter";
import { brand, heroStats, heroSlides } from "@/data/chakra";
import { getIcon } from "@/lib/icons";
import imgInstall from "@/assets/chakra/fiber-install.jpg";
import imgFamily from "@/assets/chakra/home-family.jpg";
import imgOps from "@/assets/chakra/network-ops.jpg";
import imgOffice from "@/assets/chakra/office.jpg";

const gallery = [
  { src: imgFamily, alt: "Family streaming on high-speed fiber internet at home", caption: "Unlimited home fiber" },
  { src: imgInstall, alt: "Technician splicing fiber optic cable", caption: "Fast 24–48 hr installation" },
  { src: imgOps, alt: "Network operations centre racks", alt2: "", caption: "99.9% network uptime" },
  { src: imgOffice, alt: "Customer care team at Chakra Fiber office", caption: "24×7 local support" },
];

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  delay: (i % 7) * 0.6,
  size: 2 + (i % 3),
}));

const Hero = () => {
  const [slide, setSlide] = useState(0);
  const [shot, setShot] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 3800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setShot((s) => (s + 1) % gallery.length), 4200);
    return () => clearInterval(t);
  }, []);

  const current = gallery[shot];

  return (
    <section className="relative gradient-navy text-white overflow-hidden pt-28 pb-14 lg:min-h-[100svh] lg:flex lg:items-center lg:pt-32 lg:pb-20">
      <div className="absolute inset-0 grid-bg opacity-70" aria-hidden="true" />
      <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full bg-accent/25 blur-3xl animate-floaty" aria-hidden="true" />
      <div className="absolute bottom-[-14rem] right-[-8rem] w-[34rem] h-[34rem] rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={i}
            d={`M-100 ${180 + i * 150} C 300 ${80 + i * 140}, 800 ${420 + i * 90}, 1540 ${140 + i * 160}`}
            stroke="url(#fiberGrad)"
            strokeWidth={1.2}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 2.4, delay: i * 0.25, ease: "easeOut" }}
          />
        ))}
        <defs>
          <linearGradient id="fiberGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(357 80% 55%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(352 90% 62%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(357 80% 55%)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          aria-hidden="true"
          className="absolute rounded-full bg-white/50"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -26, 0], opacity: [0.15, 0.8, 0.15] }}
          transition={{ duration: 5 + (p.id % 4), repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      <div className="relative container-luxe grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* LEFT */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/8 border border-white/15 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {brand.tagline}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }}
            className="font-display text-[2rem] leading-[1.08] sm:text-5xl xl:text-[4.1rem] font-extrabold lg:leading-[1.02] text-balance"
          >
            High-Speed <span className="text-gradient">Fiber Internet</span> For Homes & Businesses
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-4 lg:mt-6 text-[15px] lg:text-lg text-white/65 max-w-xl leading-relaxed"
          >
            Lightning-fast internet, HD TV, OTT entertainment, unlimited telephone calls and reliable local support with {brand.name}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.26 }}
            className="mt-5 lg:mt-9 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3"
          >
            <Link to="/contact" className="btn-orange justify-center text-center text-[13px] sm:text-sm px-4 sm:px-6 py-2.5">
              New Connection <ArrowUpRight size={15} />
            </Link>
            <Link to="/plans" className="btn-glass justify-center text-center text-[13px] sm:text-sm px-4 sm:px-6 py-2.5">
              See Plans
            </Link>
          </motion.div>

          <div className="mt-8 lg:mt-12 hidden lg:grid grid-cols-2 sm:grid-cols-4 gap-2.5 lg:gap-3">
            {heroStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 + i * 0.08 }}
                className="rounded-2xl glass-dark p-3 lg:p-4"
              >
                <div className="font-display text-xl lg:text-2xl font-extrabold text-white">
                  {s.decimals ? `${s.value}${s.suffix}` : <Counter value={s.value} suffix={s.suffix} />}
                </div>
                <div className="text-[10px] lg:text-[11px] uppercase tracking-wider text-white/50 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* RIGHT — premium image carousel */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-[520px] rounded-[1.75rem] lg:rounded-[2.25rem] overflow-hidden border border-white/12 shadow-glow aspect-[4/3.2] lg:aspect-[4/3.6] bg-navy-deep"
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.alt}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/25 to-transparent" />

            {/* live speed chip */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
              <div className="rounded-2xl glass-dark px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <Wifi size={15} className="text-accent" />
                  <span className="text-[10px] uppercase tracking-widest text-white/55">Live throughput</span>
                </div>
                <div className="font-display text-xl font-extrabold mt-0.5">1 Gbps</div>
                <div className="h-1.5 mt-1.5 w-24 rounded-full bg-white/12 overflow-hidden">
                  <motion.div className="h-full gradient-primary" animate={{ width: ["25%", "92%", "60%", "100%"] }} transition={{ duration: 5, repeat: Infinity }} />
                </div>
              </div>
              <div className="rounded-2xl glass-dark px-3.5 py-2.5 text-right">
                <div className="text-[10px] uppercase tracking-widest text-white/55">Uptime</div>
                <div className="font-display text-lg font-extrabold text-accent">99.9%</div>
              </div>
            </div>

            {/* caption + dots */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.caption}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="px-3.5 py-2 rounded-full glass-dark text-xs font-semibold"
                >
                  {current.caption}
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-1.5 pb-1.5">
                {gallery.map((g, i) => (
                  <button
                    key={g.src}
                    onClick={() => setShot(i)}
                    aria-label={`Show ${g.caption}`}
                    className={`h-1.5 rounded-full transition-all ${i === shot ? "w-6 bg-accent" : "w-1.5 bg-white/35"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* feature ticker */}
          <div className="mt-4 mx-auto max-w-[520px] h-[78px] relative">
            <AnimatePresence mode="wait">
              {heroSlides.map((s, i) =>
                i === slide ? (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0 rounded-3xl glass-dark p-4 flex items-center gap-3.5"
                  >
                    {(() => { const I = getIcon(s.icon); return <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shrink-0"><I size={18} /></div>; })()}
                    <div>
                      <div className="font-display font-bold text-sm">{s.title}</div>
                      <div className="text-xs text-white/55 leading-snug">{s.text}</div>
                    </div>
                  </motion.div>
                ) : null,
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only stats strip below hero */}
        <div className="lg:hidden grid grid-cols-2 gap-2.5 -mt-2">
          {heroStats.map((s) => (
            <div key={s.label} className="rounded-2xl glass-dark p-3">
              <div className="font-display text-lg font-extrabold text-white">
                {s.decimals ? `${s.value}${s.suffix}` : <Counter value={s.value} suffix={s.suffix} />}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Hero;
