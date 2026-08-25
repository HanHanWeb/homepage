"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function InstallBadge({ className }: { className?: string }) {
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setIsWorking(h >= 8 && h < 23);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          isWorking
            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
            : "bg-muted-foreground/30",
        )}
        aria-hidden
      />
      <span className="font-mono text-xs">{isWorking ? "working" : "sleeping"}</span>
    </div>
  );
}
