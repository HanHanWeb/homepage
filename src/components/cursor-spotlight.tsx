"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTheme } from "next-themes";

/** One delegated listener for the homepage; pointer updates never re-render cards. */
export function CursorSpotlight({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const root = scope.current;
    if (!root || resolvedTheme !== "dark") return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let active: HTMLElement | null = null;
    let frame = 0;

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      active?.removeAttribute("data-spotlight-active");
      active = null;
    }

    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType === "touch") return;
      const card = event.target instanceof Element
        ? event.target.closest<HTMLElement>(".cursor-spotlight")
        : null;
      if (!card || !root?.contains(card)) {
        reset();
        return;
      }
      if (active !== card) {
        reset();
        active = card;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
        card.setAttribute("data-spotlight-active", "");
        frame = 0;
      });
    }

    function leave(event: PointerEvent) {
      if (!(event.relatedTarget instanceof Node) || !active?.contains(event.relatedTarget)) reset();
    }

    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerout", leave);
    root.addEventListener("pointercancel", reset);
    window.addEventListener("scroll", reset, { passive: true, capture: true });
    window.addEventListener("blur", reset);
    media.addEventListener("change", reset);
    return () => {
      reset();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerout", leave);
      root.removeEventListener("pointercancel", reset);
      window.removeEventListener("scroll", reset, true);
      window.removeEventListener("blur", reset);
      media.removeEventListener("change", reset);
    };
  }, [resolvedTheme]);

  return <main ref={scope} className={className}>{children}</main>;
}
