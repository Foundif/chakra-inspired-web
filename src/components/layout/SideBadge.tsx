import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import QuickQuoteForm from "@/components/sections/QuickQuoteForm";

const SideBadge = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 -translate-y-1/2 bg-orange text-white py-4 px-2 rounded-l-md shadow-lg z-40 transform origin-right transition-transform hover:scale-105"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-bold tracking-wider">Send Details
</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-navy-deep rounded-2xl shadow-xl border border-white mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <QuickQuoteForm onSuccess={() => setTimeout(() => setIsOpen(false), 2000)} />
              
            </motion.div>
             <button 
                onClick={() => setIsOpen(false)} 
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-white/50 hover:text-white bg-black/20 rounded-full p-2 mt-4"
              >
                <X size={24} />
              </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBadge;
