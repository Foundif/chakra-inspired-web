import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { brand, plans, coverageAreas } from "@/data/chakra";

type Msg = { role: "bot" | "user"; text: string };

const quickOptions = ["New Connection", "Plans", "Renewal", "Complaint", "Coverage", "Contact Support"];

const answer = (topic: string): string => {
  switch (topic) {
    case "New Connection":
      return `Great! A new Chakra Fiber connection usually goes live within 24–48 hours. Share your area name and we'll run a feasibility check — or call ${brand.phone} to book a survey right away.`;
    case "Plans":
      return `Our popular home plans: ${plans
        .filter((p) => p.category === "home")
        .map((p) => `${p.name} ${p.speed} at ₹${p.price}${p.period}`)
        .join(" · ")}. All home plans are truly unlimited.`;
    case "Renewal":
      return "You can renew online through the customer portal, over UPI on WhatsApp, or at our Aruppukottai office. Annual renewals get a loyalty discount.";
    case "Complaint":
      return `Sorry about that. Please WhatsApp us on ${brand.phone} with your customer ID — our 24×7 desk resolves most faults remotely within minutes, and field visits are scheduled the same day.`;
    case "Coverage":
      return `We're live in ${coverageAreas.filter((a) => a.status === "live").map((a) => a.name).join(", ")}, and expanding into ${coverageAreas.filter((a) => a.status === "expanding").map((a) => a.name).join(", ")}.`;
    case "Contact Support":
      return `Call ${brand.phone}, email ${brand.email}, or visit us at ${brand.address1}, ${brand.address2}, ${brand.city}. ${brand.hours}.`;
    default:
      return `Thanks for reaching out! For the fastest answer, WhatsApp or call our team on ${brand.phone} — we're available ${brand.hours}.`;
  }
};

const AiChat = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: `Hi 👋 Welcome to ${brand.name}. How can I help you today?` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: answer(text) }]);
    }, 650);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-24 right-4 md:right-24 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl overflow-hidden bg-card border border-border shadow-card flex flex-col max-h-[70vh]"
          role="dialog"
          aria-label="Chakra Fiber chat assistant"
        >
          <div className="gradient-navy text-white px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-sm">{brand.name} Assistant</div>
              <div className="text-[11px] text-white/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online now
              </div>
            </div>
            <button onClick={onClose} aria-label="Close chat" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/40">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-3.5 py-2.5 ${
                  m.role === "user"
                    ? "ml-auto gradient-primary text-white rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}
              >
                {m.text}
              </motion.div>
            ))}
            {typing && (
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-3 w-fit flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-border bg-card">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {quickOptions.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full border border-border text-foreground/75 hover:border-accent hover:text-accent transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                aria-label="Message"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
              />
              <button aria-label="Send message" className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center shrink-0">
                <Send size={15} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiChat;
