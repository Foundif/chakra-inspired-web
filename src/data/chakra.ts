/**
 * Chakra Fiber — brand + content source.
 * Everything here is shaped like an API response so an admin panel can replace
 * these defaults later without touching component code.
 */

export const brand = {
  name: "Chakra Fiber",
  legal: "Chakra Fiber Networks",
  tagline: "Your Reliable Internet Partner",
  phone: "+91 96773 66006",
  phoneAlt: "+91 96773 66006",
  whatsapp: "919677366006",
  email: "support@chakrafiber.in",
  address1: "Opposite Marakadai Bus Stop",
  address2: "Thiruchuli Road",
  city: "Aruppukottai - 626101, Tamil Nadu",
  hours: "Mon – Sun · 9:00 AM – 9:00 PM (24X7 Available)",
  emergency: "24×7 network support helpline",
  justdial:
    "https://www.justdial.com/Aruppukottai/Chakra-Networks-Marakadai-Bus-Stop-Opposite-Thiruchuli-Road/9999P4566-4566-150801163108-P1W9_BZDET",
  facebook: "https://facebook.com/",
  instagram: "https://www.instagram.com/chakrafibernet",
  mapsQuery: "Chakra Networks Thiruchuli Road Aruppukottai",
};

export const heroStats = [
  { value: 0, suffix: "₹", label: "Free Installation" },
  { value: 99.9, suffix: "%", label: "Network Uptime", decimals: 1 },
  { value: 24, suffix: "×7", label: "Support Desk" },
  { value: 400, suffix: "+ KM", label: "Fiber Network" },
];

export const heroSlides = [
  { title: "Unlimited Data Plans", text: "No FUP drama. Stream, game and work without limits.", icon: "Infinity" },
  { title: "Free Installation", text: "Zero-cost setup on annual broadband plans.", icon: "Wrench" },
  { title: "350+ HD TV Channels", text: "Crystal-clear digital cable bundled with your fiber.", icon: "Tv" },
  { title: "21+ OTT Platforms", text: "Your favourite apps included on select plans.", icon: "Clapperboard" },
  { title: "Telephone Connection", text: "Crystal-clear landline over the same fiber line.", icon: "PhoneCall" },
  { title: "Business Broadband", text: "Static IP, SLA-backed uptime and priority support.", icon: "Building2" },
];

export const trustBadges = [
  { title: "Reliable ISP", text: "Locally owned, decade-strong network operations.", icon: "ShieldCheck" },
  { title: "24×7 Support", text: "Real humans on call, not endless IVR menus.", icon: "Headphones" },
  { title: "Fast Installation", text: "Most homes activated immediately.", icon: "Zap" },
  { title: "Unlimited Internet", text: "Truly unlimited usage on every home plan.", icon: "Infinity" },
  { title: "Fiber Technology", text: "End-to-end FTTH with symmetric speeds.", icon: "Cable" },
  { title: "Customer Satisfaction", text: "4.8★ average rating from local subscribers.", icon: "Star" },
];

export type Plan = {
  id: string;
  name: string;
  speed: string;
  price: number;
  period: string;
  installation: string;
  popular?: boolean;
  benefits: string[];
  category: "home" | "business";
};

export const plans: Plan[] = [
  {
    id: "starter-50",
    name: "Fiber Starter",
    speed: "50 Mbps",
    price: 399,
    period: "/month",
    installation: "₹500 one-time",
    category: "home",
    benefits: ["Truly unlimited data", "Free Wi-Fi router on annual", "100+ TV channels add-on", "Standard support"],
  },
  {
    id: "smart-100",
    name: "Fiber Smart",
    speed: "100 Mbps",
    price: 599,
    period: "/month",
    installation: "Free on 6-month plans",
    popular: true,
    category: "home",
    benefits: ["Truly unlimited data", "Free installation & router", "350+ HD TV channels", "5 OTT apps included", "Priority support"],
  },
  {
    id: "ultra-200",
    name: "Fiber Ultra",
    speed: "200 Mbps",
    price: 899,
    period: "/month",
    installation: "Free",
    category: "home",
    benefits: ["Truly unlimited data", "Free installation & dual-band router", "350+ HD TV channels", "11+ OTT platforms", "Free landline", "Priority support"],
  },
  {
    id: "biz-300",
    name: "Business Pro",
    speed: "300 Mbps",
    price: 1899,
    period: "/month",
    installation: "Free site survey",
    category: "business",
    benefits: ["Symmetric upload speed", "Static IP available", "99.9% uptime SLA", "Dedicated account manager", "4-hour fault resolution"],
  },
];

export const services = [
  { slug: "fiber-broadband", title: "Fiber Broadband", text: "FTTH connections up to 1 Gbps for homes and apartments.", icon: "Wifi" },
  { slug: "cable-tv", title: "Cable TV", text: "350+ digital channels with HD set-top boxes.", icon: "Tv" },
  { slug: "ott", title: "OTT Bundles", text: "21+ streaming apps packaged with your plan.", icon: "Clapperboard" },
  { slug: "telephone", title: "Telephone", text: "Reliable unlimited telephone calls across india over the same fiber.", icon: "PhoneCall" },
  { slug: "corporate", title: "Corporate Internet", text: "Leased-line grade links with SLA guarantees.", icon: "Building2" },
  { slug: "business-solutions", title: "Business Solutions", text: "CCTV backhaul, VPN and multi-branch links.", icon: "Network" },
  { slug: "maintenance", title: "Maintenance", text: "Preventive checks and same-day fault repair.", icon: "Wrench" },
  { slug: "installation", title: "Network Installation", text: "Professional cabling, splicing and setup.", icon: "HardHat" },
  { slug: "renewal", title: "Annual Renewal", text: "Easy online renewals with loyalty discounts.", icon: "RefreshCw" },
];

export const whyUs = [
  { title: "Fast Installation", text: "Survey today, live tomorrow — typically activated immediately.", icon: "Rocket" },
  { title: "Unlimited Data", text: "No throttling, no hidden fair-usage cliffs.", icon: "Infinity" },
  { title: "Reliable Network", text: "Redundant upstream links and monitored core.", icon: "Activity" },
  { title: "24×7 Support", text: "Call, WhatsApp or walk in — we answer.", icon: "Headphones" },
  { title: "Affordable Pricing", text: "Transparent local pricing with no surprise bills.", icon: "IndianRupee" },
  { title: "Experienced Team", text: "Certified splicers and network engineers in-house.", icon: "Users" },
  { title: "Local Service", text: "Technicians who live in the neighbourhoods we serve.", icon: "MapPin" },
  { title: "Premium Infrastructure", text: "Enterprise-grade OLTs, routers and power backup.", icon: "Server" },
];

export const coverageAreas = [
  { name: "Aruppukottai Town", status: "live" },
  { name: "Thiruchuli Road", status: "live" },
  { name: "Marakadai", status: "live" },
  { name: "Sivakasi Road", status: "live" },
  { name: "Chettiyarpatti", status: "live" },
  { name: "Narikudi", status: "live" },
  { name: "Thiruchuli", status: "live" },
  { name: "Virudhunagar", status: "expanding" },
  { name: "Sattur", status: "expanding" },
  { name: "Kariapatti", status: "expanding" },
  { name: "Madurai Outskirts", status: "planned" },
  { name: "Rajapalayam", status: "planned" },
] as const;

export const testimonials = [
  { name: "Karthik R.", role: "", rating: 5, text: "Shifted from a mobile hotspot to Chakra Fiber. Speeds are consistent even at night and support picks up on the first ring." },
  { name: "Meena S.", role: "", rating: 5, text: "Billing machine, CCTV and Wi-Fi all run on one connection. Installation was done the same day I enquired." },
  { name: "Dr. Prakash", role: "", rating: 5, text: "Video consultations never drop. The team upgraded my router free of charge when I moved to a bigger plan." },
  { name: "Vignesh M.", role: "", rating: 4, text: "Work-from-home has been painless. Uploads are as fast as downloads, which no other local ISP offered." },
  { name: "Lakshmi A.", role: "", rating: 5, text: "Kids stream, I watch TV channels, and my husband works — all together without buffering." },
];

export const installSteps = [
  { step: "01", title: "Contact Us", text: "Call, WhatsApp or submit the enquiry form." },
  { step: "02", title: "Feasibility Survey", text: "Our engineer checks fiber availability at your address." },
  { step: "03", title: "Installation", text: "Cabling, splicing and router setup by certified technicians." },
  { step: "04", title: "Activation", text: "Plan provisioned, speed tested and handed over." },
  { step: "05", title: "Enjoy Internet", text: "Unlimited fiber, TV, Telephone calls and OTT with 24×7 backup support." },
];

export const faqs = [
  { q: "How long does a new Chakra Fiber connection take?", a: "Where fiber already runs on your street, most homes are activated immediately of the feasibility survey." },
  { q: "Is the data really unlimited?", a: "Yes. Every home plan is truly unlimited with no fair-usage throttling. Your plan speed stays the same all month." },
  { q: "Do you charge for installation?", a: "Yes, Installation is free on term plans" },
  { q: "Can I get TV channels and internet on one bill?", a: "Yes. Cable TV, OTT bundles and telephone can all be added to your broadband account and billed together." },
  { q: "What happens if my internet stops working?", a: "Call or WhatsApp our 24×7 helpline. Most faults are resolved remotely within minutes; field visits are scheduled the same day." },
  { q: "How do I renew my plan?", a: "Renew online through the customer portal, via UPI on WhatsApp, or at our Aruppukottai office. Loyalty discounts apply on annual renewals." },
  { q: "Do you provide static IP for businesses?", a: "Yes. Static IPs, symmetric bandwidth and SLA-backed uptime are available on all Business Pro and corporate connections." },
  { q: "Which areas do you currently cover?", a: "We serve Aruppukottai town and surrounding areas including Thiruchuli Road, Marakadai, Narikudi and Chettiyarpatti, with active expansion into Virudhunagar and Sattur." },
];

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/plans", label: "Plans" },
  { to: "/services", label: "Services" },
  { to: "/coverage", label: "Coverage" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];
