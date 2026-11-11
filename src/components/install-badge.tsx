"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const states = ["Thinking", "Tinkering", "Sleeping"];

export function InstallBadge({ className }: { className?: string }) {
  const [state, setState] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      if (!media.matches) timer = setInterval(() => setState((value) => (value + 1) % states.length), 3200);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      clearInterval(timer);
      media.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      className={cn(
        "inline-flex min-h-8 items-center gap-2.5 font-mono text-sm text-[var(--thinking-color)]",
        className,
      )}
    >
      <span className="sr-only">Thinking, tinkering and sleeping</span>
      <svg aria-hidden viewBox="0 0 24 24" className="thinking-spark size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
        <path d="M7.5 4.2l9 15.6M3 12h18M7.5 19.8l9-15.6" strokeWidth="1.5" />
      </svg>
      <span aria-hidden className="inline-block w-[11ch]">{states[state]}…</span>
    </div>
  );
}
