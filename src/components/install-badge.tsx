"use client";

import { useEffect, useState } from "react";

import { ThinkingOrb } from "thinking-orbs";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function InstallBadge({ className }: { className?: string }) {
  const [orbState, setOrbState] = useState<"searching" | "composing">("composing");

  useEffect(() => {
    const update = () => {
      const h = new Date().getHours();
      setOrbState(h >= 8 && h < 23 ? "searching" : "composing");
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Badge variant="secondary" className={cn("h-6 gap-1.5 py-1", className)}>
      <ThinkingOrb
        state={orbState}
        size={20}
        theme="auto"
        aria-hidden
        className="block"
      />
      <span className="font-mono text-xs">
        {orbState === "searching" ? "working" : "sleeping"}
      </span>
    </Badge>
  );
}
