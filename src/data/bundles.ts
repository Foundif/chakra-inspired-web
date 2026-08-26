/**
 * Bundles, add-on services, OTT apps and TV channels.
 * Shaped like an API response so the admin panel can replace these later.
 */

export type Bundle = {
  id: string;
  name: string;
  tagline: string;
  popular?: boolean;
  benefits: string[];
};

export const bundles: Bundle[] = [
  {
    id: "fiber-internet",
    name: "Fiber Internet",
    tagline: "Pure unlimited internet",
    benefits: [
      "Unlimited data, no fair-usage throttling",
      "Stable speeds during peak hours",
      "Free WiFi router setup guidance",
      "Ideal for streaming, gaming, work-from-home",
    ],
  },
  {
    id: "internet-hd-tv",
    name: "Internet + HD TV",
    tagline: "Most popular for families",
    popular: true,
    benefits: [
      "Everything in Fiber Internet",
      "350+ HD TV channels",
      "Full Tamil entertainment lineup",
      "Single installation for both services",
    ],
  },
  {
    id: "internet-tv-ott-phone",
    name: "Internet + TV + OTT + Telephone",
    tagline: "The complete home bundle",
    benefits: [
      "Everything in Internet + HD TV",
      "11+ OTT apps bundled in",
      "Optional telephone landline connection",
      "One bill, one support line for everything",
    ],
  },
];

export const addonServices = [
  {
    title: "CCTV Camera Installation",
    text: "HD CCTV camera supply and installation for homes and shops, with remote viewing on your mobile from anywhere.",
    icon: "Cctv",
  },
  {
    title: "Networking & LAN Setup",
    text: "Structured cabling, LAN and WiFi network setup for offices, shops and multi-floor homes that need reliable coverage everywhere.",
    icon: "Network",
  },
  {
    title: "WiFi Range Extension",
    text: "Extra access points and mesh WiFi setup to remove dead zones in larger homes, shops or offices.",
    icon: "Wifi",
  },
];

import jayaTv from "@/assets/logos/jaya-tv.asset.json";
import colorsTamil from "@/assets/logos/colors-tamil.asset.json";
import kalaignarTv from "@/assets/logos/kalaignar-tv.asset.json";
import lionsgatePlay from "@/assets/logos/lionsgate-play.asset.json";
import ktv from "@/assets/logos/ktv.asset.json";
import sunMusic from "@/assets/logos/sun-music.asset.json";
import starVijay from "@/assets/logos/star-vijay.asset.json";
import altBalaji from "@/assets/logos/alt-balaji.asset.json";
import playboxtv from "@/assets/logos/playboxtv.asset.json";
import sunNxt from "@/assets/logos/sun-nxt.asset.json";

export type Brand = { name: string; domain: string; logo?: string };

export const ottApps: Brand[] = [
  { name: "Amazon Prime Lite", domain: "primevideo.com" },
  { name: "Disney+ Hotstar", domain: "hotstar.com" },
  { name: "Sun NXT", domain: "sunnetwork.in", logo: sunNxt.url },
  { name: "ZEE5", domain: "zee5.com" },
  { name: "ALT Balaji", domain: "altbalaji.com", logo: altBalaji.url },
  { name: "Sony LIV", domain: "sonyliv.com" },
  { name: "Hungama", domain: "hungama.com" },
  { name: "PlayboxTV", domain: "playboxtv.com", logo: playboxtv.url },
  { name: "aha Tamil", domain: "aha.video" },
  { name: "Lionsgate Play", domain: "lionsgateplay.com", logo: lionsgatePlay.url },
  { name: "Chaupal", domain: "chaupal.tv" },
];

export const tvChannels: Brand[] = [
  { name: "Sun TV", domain: "sunnetwork.in" },
  { name: "K TV", domain: "sunnetwork.in", logo: ktv.url },
  { name: "Star Vijay", domain: "hotstar.com", logo: starVijay.url },
  { name: "Zee Tamil", domain: "zee5.com" },
  { name: "Kalaignar TV", domain: "kalaignartvnetwork.com", logo: kalaignarTv.url },
  { name: "Jaya TV", domain: "jayatv.com", logo: jayaTv.url },
  { name: "Sun Music", domain: "sunnetwork.in", logo: sunMusic.url },
  { name: "Raj TV", domain: "rajtvnet.in" },
  { name: "Polimer TV", domain: "polimernews.com" },
  { name: "News7 Tamil", domain: "news7tamil.live" },
  { name: "Thanthi TV", domain: "thanthitv.com" },
  { name: "Colors Tamil", domain: "voot.com", logo: colorsTamil.url },
];

