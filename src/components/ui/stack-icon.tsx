"use client";

import TechStackIcon, { type IconName } from "tech-stack-icons";

import { cn } from "@/lib/utils";

/**
 * tech-stack-icons 客户端封装。
 * 原组件内部使用 useId(仅客户端可用),故不能直接在服务端组件中引用。
 * invert:纯黑图标(如 GitHub/Next.js)在深色模式下反色以保证可见。
 */
export function StackIcon({
  name,
  invert,
  className,
}: {
  name: IconName;
  invert?: boolean;
  className?: string;
}) {
  return (
    <TechStackIcon
      name={name}
      className={cn("size-3", invert && "dark:invert", className)}
    />
  );
}

export type { IconName };
