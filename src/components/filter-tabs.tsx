"use client";

import { motion } from "motion/react";
import { useId } from "react";

import { cn } from "@/lib/utils";

export type FilterTabItem = {
  value: string;
  label: string;
  /** 可选的计数徽标，如分类下的作品/项目数量 */
  count?: number;
};

type FilterTabsProps = {
  items: FilterTabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

/**
 * 分段式筛选 tabs：整体胶囊容器 + 选中项滑块高亮。
 * 供「项目」与「专注领域」等需要单选筛选的场景共用。
 */
export function FilterTabs({ items, value, onValueChange, ariaLabel, className }: FilterTabsProps) {
  // 每个实例独立的 layoutId，避免多处实例的滑块互相吸附。
  const pillLayoutId = `filter-tabs-pill-${useId()}`;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("inline-flex max-w-full items-center gap-1 rounded-full bg-muted p-1 dark:bg-muted/50", className)}
    >
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={pillLayoutId}
                className="absolute inset-0 rounded-full bg-background shadow-xs dark:bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{item.label}</span>
            {item.count !== undefined && (
              <span className={cn("relative text-xs tabular-nums transition-colors", active ? "text-muted-foreground" : "text-muted-foreground/60")}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
