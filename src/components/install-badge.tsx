"use client";

import { useEffect, useState } from "react";

import { ThinkingOrb } from "thinking-orbs";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function InstallBadge({ className }: { className?: string }) {
  const [state, setState] = useState<"working" | "breathing">("breathing");

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setState(h >= 8 && h < 23 ? "working" : "breathing");
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Badge variant="secondary" className={cn("h-6 gap-1.5 py-1", className)}>
      <ThinkingOrb
        state={state}
        size={20}
        theme="auto"
        aria-hidden
        className="block"
      />
      <span className="font-mono text-xs">
        {state === "working" ? "working" : "sleeping"}
      </span>
    </Badge>
  );
}
