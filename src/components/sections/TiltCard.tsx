import { useRef, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

const TiltCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className={`relative will-change-transform ${className}`}
    >
      <div style={{ transform: "translateZ(40px)" }}>{children}</div>
      <motion.div
        aria-hidden
        style={{
          background: useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, hsl(0 0% 100% / 0.18), transparent 55%)`,
        }}
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
      />
    </motion.div>
  );
};

export default TiltCard;