"use client";

import { cn } from "@/lib/utils";

export function InstallBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 shadow-sm",
        className,
      )}
    >
      <span
        className="size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
        aria-hidden
      />
      <span className="font-mono text-xs">Hello</span>
    </div>
  );
}
