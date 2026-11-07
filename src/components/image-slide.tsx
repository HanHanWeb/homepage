"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const decodedImages = new Map<string, Promise<void>>();

function prepareImage(src: string) {
  let pending = decodedImages.get(src);
  if (!pending) {
    const image = new Image();
    image.src = src;
    pending = image.decode().catch((error: unknown) => {
      decodedImages.delete(src);
      throw error;
    });
    decodedImages.set(src, pending);
  }
  return pending;
}

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  visible: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

/** Shared directional transition for portfolio and project preview dialogs. */
export function ImageSlide({ src, alt, direction, sources = [] }: { src: string; alt: string; direction: number; sources?: string[] }) {
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState({ src, alt, direction });

  useEffect(() => {
    let cancelled = false;
    void prepareImage(src).then(() => {
      if (!cancelled) setDisplayed({ src, alt, direction });
    }).catch(() => {
      // Keep the current image visible if the requested image cannot load.
    });
    return () => { cancelled = true; };
  }, [src, alt, direction]);

  useEffect(() => {
    sources.forEach((source) => { void prepareImage(source).catch(() => {}); });
  }, [sources]);

  return (
    <div className="relative h-[55dvh] w-full min-w-0 overflow-hidden" data-image-viewport>
      <AnimatePresence initial={false} custom={displayed.direction}>
        <motion.div
          key={displayed.src}
          custom={displayed.direction}
          variants={reducedMotion ? undefined : variants}
          initial={reducedMotion ? false : "enter"}
          animate={reducedMotion ? { opacity: 1 } : "visible"}
          exit={reducedMotion ? { opacity: 0 } : "exit"}
          transition={{ duration: reducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center p-1"
          data-image-slide
        >
          {/* The whole viewport moves, rather than the narrower image itself. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayed.src} alt={displayed.alt} className="block min-h-0 max-h-full w-auto max-w-full rounded-md object-contain shadow-md" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
