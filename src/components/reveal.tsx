"use client";

import React from "react";

import { cn } from "@/lib/utils";

/** 板块内容静态容器；delay/direction 参数保留以兼容既有调用，不再产生动画 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
  direction?: "up" | "down";
}) {
  return <div className={cn(className)}>{children}</div>;
}
