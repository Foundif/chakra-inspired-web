import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const formatValue = (n: number) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
};

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1800;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
      else setN(value);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {formatValue(n)}{suffix}
    </span>
  );
};

export default Counter;