"use client";

import { motion, useSpring, type SpringOptions } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: SpringOptions;
}

const DefaultCursorSVG = () => (
  <svg
    width="50"
    height="54"
    viewBox="0 0 50 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0px 1px 3px rgba(0,0,0,0.35))" }}
  >
    <g>
      <path
        d="M5.037 5.688a.495.495 0 0 1 .651-.651l16.69 6.886a.5.5 0 0 1 .063.89l-6.077 3.45a4 4 0 0 0-1.501 1.5l-3.45 6.078a.5.5 0 0 1-.89-.063L5.037 5.688Z"
        fill="red"
      />
      <path
        d="M5.037 5.688a.495.495 0 0 1 .651-.651l16.69 6.886a.5.5 0 0 1 .063.89l-6.077 3.45a4 4 0 0 0-1.501 1.5l-3.45 6.078a.5.5 0 0 1-.89-.063L5.037 5.688Z"
        stroke="black"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 0.6,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [isMoving, setIsMoving] = useState(false);
  const lastMouseEvent = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, { ...springConfig, damping: 60, stiffness: 300 });
  const scale = useSpring(1, { ...springConfig, stiffness: 500, damping: 35 });

  const updateVelocity = useCallback((currentPos: Position) => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime.current;
    if (deltaTime > 0) {
      velocity.current = {
        x: (currentPos.x - lastMouseEvent.current.x) / deltaTime,
        y: (currentPos.y - lastMouseEvent.current.y) / deltaTime,
      };
    }
    lastUpdateTime.current = currentTime;
    lastMouseEvent.current = currentPos;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let frame: number | null = null;
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    const onMove = (e: MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updateVelocity(pos);
        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        cursorX.set(pos.x);
        cursorY.set(pos.y);

        if (speed > 0.1) {
          const currentAngle =
            Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) + 90;
          let angleDiff = currentAngle - previousAngle.current;
          if (angleDiff > 180) angleDiff -= 360;
          if (angleDiff < -180) angleDiff += 360;
          accumulatedRotation.current += angleDiff * 0.2;
          rotation.set(accumulatedRotation.current);
          previousAngle.current = currentAngle;

          scale.set(0.95);
          setIsMoving(true);
          if (stopTimer) clearTimeout(stopTimer);
          stopTimer = setTimeout(() => {
            scale.set(1);
            setIsMoving(false);
          }, 150);
        }
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, [cursorX, cursorY, rotation, scale, updateVelocity]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        rotate: rotation,
        scale,
        zIndex: 9999,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {cursor}
    </motion.div>
  );
}

export default SmoothCursor;
