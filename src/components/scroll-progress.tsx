"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** 右上角滚动进度环:useScroll 跟踪页面滚动,spring 平滑数值,pathLength 驱动圆环描边 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });

  return (
    <div
      aria-hidden
      className="fixed top-5 right-6 z-50 flex size-11 items-center justify-center rounded-full border bg-card/80 shadow-sm backdrop-blur"
    >
      <svg viewBox="0 0 36 36" className="absolute size-8 -rotate-90">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          strokeWidth="3"
          className="stroke-border"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-foreground"
          style={{ pathLength: smooth }}
        />
      </svg>
    </div>
  );
}
