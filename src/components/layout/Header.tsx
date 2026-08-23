import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Phone, ChevronDown, Zap, Wifi, Tv, Building2, RefreshCw, UserRound } from "lucide-react";
import { brand, navLinks, plans } from "@/data/chakra";
import logoAsset from "@/assets/chakra-logo.png";

const megaServices = [
  { to: "/services", label: "Fiber Broadband", desc: "FTTH up to 1 Gbps", icon: Wifi },
  { to: "/services", label: "Cable TV", desc: "350+ HD channels", icon: Tv },
  { to: "/services", label: "Business Internet", desc: "SLA-backed links", icon: Building2 },
  { to: "/services", label: "Annual Renewal", desc: "Loyalty discounts", icon: RefreshCw },
];

const PRIMARY = ["Home", "Plans", "Services", "Coverage", "Contact"];
const primaryLinks = PRIMARY.map((l) => navLinks.find((n) => n.label === l)!).filter(Boolean);
const moreLinks = navLinks.filter((n) => !PRIMARY.includes(n.label));

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMega(null); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  // Every page opens with a dark hero/banner, so the un-scrolled header is always on dark.
  const onDark = !scrolled;

  return (
    <>
      <header
        onMouseLeave={() => setMega(null)}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "px-3 pt-3" : ""}`}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "mx-auto max-w-6xl rounded-full bg-background/85 backdrop-blur-xl border border-border/70 shadow-card px-4 sm:px-5"
              : "bg-transparent"
          }`}
        >
          <div className={`${scrolled ? "" : "container-luxe"} flex items-center justify-between transition-all duration-500 ${scrolled ? "h-[60px]" : "h-24"}`}>
            <Link to="/" className="flex items-center shrink-0" aria-label={`${brand.name} home`}>
              <img
                src={logoAsset}
                alt={`${brand.name} — ${brand.tagline}`}
                className={`w-auto object-contain transition-all duration-500 ${scrolled ? "h-8" : "h-11"} ${onDark ? "brightness-0 invert" : ""}`}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {primaryLinks.map((n) => {
                const hasMega = n.label === "Services" || n.label === "Plans";
                return (
                  <div key={n.to + n.label} onMouseEnter={() => setMega(hasMega ? n.label : null)} className="relative">
                    <NavLink
                      to={n.to}
                      end={n.to === "/"}
                      className={({ isActive }) =>
                        `px-3.5 py-2 text-[13px] font-semibold rounded-full transition-colors inline-flex items-center gap-1 ${
                          isActive ? "text-accent" : onDark ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-accent"
                        }`
                      }
                    >
                      {n.label}
                      {hasMega && <ChevronDown size={13} className="opacity-60" />}
                    </NavLink>
                  </div>
                );
              })}

              {/* More dropdown */}
              <div className="relative" onMouseEnter={() => setMega("More")}>
                <button
                  className={`px-3.5 py-2 text-[13px] font-semibold rounded-full transition-colors inline-flex items-center gap-1 ${
                    onDark ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-accent"
                  }`}
                >
                  More <ChevronDown size={13} className="opacity-60" />
                </button>
                <AnimatePresence>
                  {mega === "More" && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-card p-2"
                    >
                      {moreLinks.map((m) => (
                        <NavLink
                          key={m.to + m.label}
                          to={m.to}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                              isActive ? "text-accent bg-secondary" : "text-foreground/80 hover:bg-secondary hover:text-accent"
                            }`
                          }
                        >
                          {m.label} <ArrowUpRight size={14} className="opacity-50" />
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              {!scrolled && (
                <a
                  href={`tel:${brand.phone.replace(/\s/g, "")}`}
                  className={`inline-flex items-center gap-2 text-[13px] font-semibold px-3 py-2 rounded-full transition-colors ${
                    onDark ? "text-white/85 hover:text-white" : "text-foreground/70 hover:text-accent"
                  }`}
                >
                  <Phone size={14} /> {brand.phone}
                </a>
              )}
              <Link
                to="/customer-login"
                className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors ${
                  onDark ? "border-white/25 text-white hover:bg-white/10" : "border-border text-foreground hover:border-accent hover:text-accent"
                }`}
              >
                <UserRound size={14} /> Login
              </Link>
              <Link to="/contact" className="btn-orange text-[13px] py-2.5 px-5">
                Get Connection <ArrowUpRight size={15} />
              </Link>
            </div>

            <button
              aria-label="Open menu"
              className={`lg:hidden p-2 rounded-xl ${onDark ? "text-white" : "text-foreground"}`}
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {mega && mega !== "More" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              onMouseEnter={() => setMega(mega)}
              className={`hidden lg:block absolute inset-x-0 bg-card/95 backdrop-blur-xl border-y border-border shadow-card ${scrolled ? "top-full mt-2 rounded-3xl mx-6 border" : "top-full"}`}
            >
              <div className="container-luxe py-8 grid grid-cols-12 gap-8">
                <div className="col-span-3">
                  <div className="label-eyebrow mb-3">{mega === "Plans" ? "Broadband Plans" : "What we do"}</div>
                  <h3 className="font-display text-2xl font-extrabold leading-tight mb-2">
                    {mega === "Plans" ? "Unlimited fiber, honest pricing" : "One provider, every connection"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {mega === "Plans"
                      ? "Home and business plans with free installation on longer terms."
                      : "Broadband, cable TV, OTT, telephone and enterprise links."}
                  </p>
                  <Link to={mega === "Plans" ? "/plans" : "/services"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    View all <ArrowUpRight size={14} />
                  </Link>
                </div>
                <div className="col-span-9 grid grid-cols-4 gap-3">
                  {(mega === "Plans"
                    ? plans.map((p) => ({ to: "/plans", label: `${p.name} · ${p.speed}`, desc: `₹${p.price}${p.period}`, icon: Zap }))
                    : megaServices
                  ).map((m, i) => (
                    <Link
                      key={i}
                      to={m.to}
                      className="group p-4 rounded-2xl border border-border/70 bg-background hover:border-accent/40 hover:shadow-soft transition-all"
                    >
                      <m.icon size={18} className="text-accent mb-2.5" />
                      <div className="font-display font-bold text-sm group-hover:text-accent transition-colors">{m.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-navy-deep/50 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute top-0 right-0 h-full w-[86%] max-w-sm bg-background shadow-card flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <img src={logoAsset} alt={brand.name} className="h-9 w-auto object-contain" />
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-5">
                <ul className="space-y-1">
                  {navLinks.map((n, i) => (
                    <motion.li
                      key={n.to + n.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <NavLink
                        to={n.to}
                        end={n.to === "/"}
                        className={({ isActive }) =>
                          `flex items-center justify-between py-3 px-4 rounded-2xl font-display font-bold text-lg transition-colors ${
                            isActive ? "gradient-primary text-white" : "text-foreground hover:bg-secondary"
                          }`
                        }
                      >
                        {n.label}
                        <ArrowUpRight size={17} className="opacity-50" />
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Link to="/customer-login" className="text-center py-3 rounded-2xl border border-border font-semibold text-sm">Customer Login</Link>
                  <Link to="/contact" className="text-center py-3 rounded-2xl border border-border font-semibold text-sm">Renew Now</Link>
                </div>
              </nav>
              <div className="p-5 border-t border-border space-y-2">
                <Link to="/contact" className="btn-orange w-full justify-center text-sm">Get New Connection <ArrowUpRight size={15} /></Link>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="btn-ghost-dark w-full justify-center text-sm py-3">
                  <Phone size={15} /> {brand.phone}
                </a>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
