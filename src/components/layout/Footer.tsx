import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import { brand, navLinks, services } from "@/data/chakra";
import logoAsset from "@/assets/chakra-logo.png";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  return (
    <footer className="relative gradient-navy text-white overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
      <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />

      <div className="relative container-luxe pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src={logoAsset} alt={brand.name} className="h-11 w-auto object-contain brightness-0 invert mb-5" />
            <p className="text-white/65 leading-relaxed max-w-sm">
              {brand.legal} delivers high-speed fiber broadband, digital cable TV, OTT bundles and telephone
              services across Aruppukottai and Virudhunagar district.
            </p>
            <div className="flex gap-2.5 mt-6">
              {[
                { href: brand.facebook, icon: Facebook, label: "Facebook" },
                { href: brand.instagram, icon: Instagram, label: "Instagram" },
                { href: brand.justdial, icon: ArrowUpRight, label: "Justdial" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white/50 mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((n) => (
                <li key={n.label}>
                  <Link to={n.to} className="text-white/70 hover:text-accent transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white/50 mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link to="/services" className="text-white/70 hover:text-accent transition-colors">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-white/50 mb-4">Contact</h4>
            <ul className="space-y-3.5 text-sm text-white/70">
              <li className="flex gap-3">
                <MapPin size={16} className="text-accent shrink-0 mt-0.5" />
                <span>{brand.address1}, {brand.address2}, {brand.city}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-accent shrink-0 mt-0.5" />
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-accent">{brand.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-accent shrink-0 mt-0.5" />
                <a href={`mailto:${brand.email}`} className="hover:text-accent">{brand.email}</a>
              </li>
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) return toast({ title: "Enter a valid email", variant: "destructive" });
                setEmail("");
                toast({ title: "Subscribed", description: "You'll hear about new plans and offers." });
              }}
              className="mt-6 flex items-center gap-2 rounded-full bg-white/8 border border-white/12 p-1.5"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email for offers"
                aria-label="Email for offers"
                className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button aria-label="Subscribe" className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} {brand.legal}. All rights reserved.</p>
          <p>{brand.tagline} · Aruppukottai, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
