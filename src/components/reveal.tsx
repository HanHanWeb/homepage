"use client";

import React from "react";

import { cn } from "@/lib/utils";

/** Mount-time blur reveal with a configurable vertical direction. */
export function Reveal({
  children,
  className,
  delay,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  direction?: "up" | "down";
}) {
  return (
    <div
      className={cn("blur-in-pending is-blur-in", className)}
      style={
        {
          "--blur-delay": delay ?? "0s",
          "--blur-offset": direction === "down" ? "-8px" : "8px",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
