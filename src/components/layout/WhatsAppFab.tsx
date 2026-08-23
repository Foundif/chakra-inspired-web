import { Phone } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import indiamartLogo from "@/assets/indiamart.png";
import { trackWaClick } from "@/lib/wa";

const WhatsAppIcon = ({ size = 40 }: { size?: number }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.802 2.722.802.917 0 2.434-.745 2.815-1.617.144-.33.158-.616.158-.946 0-.158-.043-.314-.13-.443-.187-.358-1.91-1.072-2.27-1.114Zm-2.222 7.722c-1.477 0-2.95-.39-4.247-1.116l-.31-.18-3.087.815.83-3.029-.2-.32a8.41 8.41 0 0 1-1.302-4.49c0-4.66 3.808-8.45 8.49-8.45 4.66 0 8.45 3.808 8.45 8.45 0 4.682-3.79 8.49-8.45 8.49Zm0-18.605c-5.6 0-10.18 4.563-10.18 10.18 0 1.794.488 3.557 1.404 5.087L6.18 27.5l5.92-1.553a10.196 10.196 0 0 0 4.81 1.222h.005c5.62 0 10.18-4.563 10.18-10.18 0-2.7-1.06-5.243-2.985-7.165a10.097 10.097 0 0 0-7.197-2.985Z" />
  </svg>
);

const FloatingActions = () => {
  const s = useSettings();

  const waUrl = `https://wa.me/${s.whatsapp_number}?text=${encodeURIComponent(
    "Hi Sri Kanish Enterprises, I'd like a quote for textile labels."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
      {/* IndiaMART */}
      <a
        href={s.indiamart_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit our IndiaMART page"
        className="group w-12 h-12 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-card hover:scale-110 transition-transform border border-border"
        title="View on IndiaMART"
      >
        <img
          src={indiamartLogo}
          alt="IndiaMART"
          className="w-full h-full object-contain p-0.5"
        />
      </a>

      {/* Call */}
      <a
        href={`tel:${s.phone_primary.replace(/\s+/g, "")}`}
        aria-label="Call us"
        className="w-12 h-12 rounded-full bg-orange text-white flex items-center justify-center shadow-card hover:scale-110 transition-transform"
        title={`Call ${s.phone_primary}`}
      >
        <Phone size={22} fill="currentColor" />
      </a>

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => trackWaClick("fab_whatsapp")}
        className="w-14 h-14 rounded-full bg-white text-[#25D366] flex items-center justify-center shadow-card hover:scale-110 transition-transform border border-border"
        title="Chat on WhatsApp"
      >
        <div className="whatsapp-icon-animate">
          <WhatsAppIcon size={40} />
        </div>
      </a>
    </div>
  );
};

export default FloatingActions;
