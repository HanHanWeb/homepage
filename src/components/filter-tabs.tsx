"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

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

// 服务端渲染时退回 useEffect，避免 useLayoutEffect 的 SSR 警告。
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 分段式筛选 tabs：整体胶囊容器 + 选中项滑块高亮。
 * 滑块是容器内唯一的一个元素，位于所有按钮文字之下（z-0），
 * 通过测量选中项的位置/宽度并过渡 left/width 滑动，避免滑动过程遮挡标签文字。
 */
export function FilterTabs({ items, value, onValueChange, ariaLabel, className }: FilterTabsProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const list = listRef.current;
    const btn = btnRefs.current[value];
    if (!list || !btn) {
      setThumb(null);
      return;
    }
    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const left = br.left - lr.left;
    const width = br.width;
    // 值未变化时保持同一个对象，避免 ResizeObserver/effect 触发额外渲染。
    setThumb((prev) =>
      prev && Math.abs(prev.left - left) < 0.5 && Math.abs(prev.width - width) < 0.5 ? prev : { left, width }
    );
  }, [value]);

  const labelsKey = items.map((item) => item.label).join("\u0001");

  useIsomorphicLayoutEffect(() => {
    measure();
  }, [measure, labelsKey]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={cn("relative inline-flex max-w-full items-center gap-1 rounded-full bg-muted p-1 dark:bg-muted/50", className)}
    >
      {thumb && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-1 bottom-1 z-0 rounded-full bg-background shadow-xs dark:bg-accent"
          style={{
            left: thumb.left,
            width: thumb.width,
            transition: "left 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      )}
      {items.map((item) => {
        const active = value === item.value;
        return (
          <button
            key={item.value}
            ref={(el) => {
              btnRefs.current[item.value] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "relative z-10 inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={cn("text-xs tabular-nums transition-colors", active ? "text-muted-foreground" : "text-muted-foreground/60")}>{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
