"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Progress ring shares the back-to-top button's bounds. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });

  return (
    <svg aria-hidden viewBox="0 0 48 48" className="pointer-events-none absolute inset-0 size-full -rotate-90">
      <circle cx="24" cy="24" r="21" fill="none" strokeWidth="1.5" className="stroke-border" />
      <motion.circle cx="24" cy="24" r="21" fill="none" strokeWidth="1.5" strokeLinecap="round" className="stroke-foreground" style={{ pathLength: smooth }} />
    </svg>
  );
}
