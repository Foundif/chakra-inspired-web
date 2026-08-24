import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Bot, ExternalLink, Facebook, Instagram, Phone, Wifi, X } from "lucide-react";
import { brand } from "@/data/chakra";
import { trackWaClick } from "@/lib/wa";
import AiChat from "./AiChat";

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.802 2.722.802.917 0 2.434-.745 2.815-1.617.144-.33.158-.616.158-.946 0-.158-.043-.314-.13-.443-.187-.358-1.91-1.072-2.27-1.114Zm-2.222 7.722c-1.477 0-2.95-.39-4.247-1.116l-.31-.18-3.087.815.83-3.029-.2-.32a8.41 8.41 0 0 1-1.302-4.49c0-4.66 3.808-8.45 8.49-8.45 4.66 0 8.45 3.808 8.45 8.45 0 4.682-3.79 8.49-8.45 8.49Zm0-18.605c-5.6 0-10.18 4.563-10.18 10.18 0 1.794.488 3.557 1.404 5.087L6.18 27.5l5.92-1.553a10.196 10.196 0 0 0 4.81 1.222h.005c5.62 0 10.18-4.563 10.18-10.18 0-2.7-1.06-5.243-2.985-7.165a10.097 10.097 0 0 0-7.197-2.985Z" />
  </svg>
);

const FloatingCTA = () => {
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    "Hi Chakra Fiber, I'd like details about a new broadband connection.",
  )}`;

  const actions = [
    { key: "wa", label: "WhatsApp", href: waUrl, icon: <WhatsAppIcon size={20} />, className: "bg-[#25D366] text-white", onClick: () => trackWaClick("fab_whatsapp") },
    { key: "call", label: "Call Now", href: `tel:${brand.phone.replace(/\s/g, "")}`, icon: <Phone size={18} />, className: "gradient-primary text-white" },
    { key: "ai", label: "AI Chat Assistant", icon: <Bot size={19} />, className: "bg-navy text-white", onClick: () => { setChatOpen(true); setExpanded(false); } },
    { key: "jd", label: "Justdial", href: brand.justdial, icon: <ExternalLink size={17} />, className: "bg-card text-foreground border border-border" },
    { key: "fb", label: "Facebook", href: brand.facebook, icon: <Facebook size={17} />, className: "bg-[#1877F2] text-white" },
    { key: "ig", label: "Instagram", href: brand.instagram, icon: <Instagram size={17} />, className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white" },
  ];

  const Btn = ({ a }: { a: (typeof actions)[number] }) => {
    const content = (
      <>
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">
          {a.label}
        </span>
        {a.icon}
      </>
    );
    const cls = `group relative w-12 h-12 rounded-full shadow-soft flex items-center justify-center transition-transform hover:scale-110 ${a.className}`;
    return a.href ? (
      <a href={a.href} target={a.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={a.label} onClick={a.onClick} className={cls}>
        {content}
      </a>
    ) : (
      <button type="button" aria-label={a.label} onClick={a.onClick} className={cls}>{content}</button>
    );
  };

  return (
    <>
      {/* Back to top (desktop, sits left of the FAB) */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="group fixed bottom-7 right-24 z-40 hidden md:flex w-12 h-12 rounded-full bg-navy text-white shadow-soft items-center justify-center hover:scale-110 transition-transform"
          >
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-navy px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
              Back to top
            </span>
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expandable FAB (all viewports) */}
      <div className="fixed bottom-5 right-4 md:bottom-6 md:right-5 z-40 flex flex-col items-end gap-2.5">
        <AnimatePresence>
          {expanded &&
            actions.map((a, i) => (
              <motion.div
                key={a.key}
                initial={{ opacity: 0, y: 12, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0, y: 12, scale: 0.8 }}
              >
                <Btn a={a} />
              </motion.div>
            ))}
        </AnimatePresence>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Close quick actions" : "Open quick actions"}
          className="relative w-14 h-14 rounded-full gradient-primary text-white shadow-orange flex items-center justify-center"
        >
          {!expanded && <span className="absolute inset-0 rounded-full bg-accent animate-pulse-ring" aria-hidden="true" />}
          <span className="relative">{expanded ? <X size={22} /> : <Wifi size={24} />}</span>
        </button>
      </div>

      <AiChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default FloatingCTA;
