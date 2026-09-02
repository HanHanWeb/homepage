"use client";

import { cloneElement, useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactElement, ReactNode } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

import { Reveal } from "@/components/reveal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/components/language-provider";

// Radix Tooltip 不响应触摸（onPointerMove 直接忽略 touch），此处改为受控 open，
// 触摸设备上通过点击格子切换 tooltip 显隐
type BlockProps = {
  onClick?: (event: ReactMouseEvent) => void;
};

function BlockTooltip({ block, children }: { block: ReactElement; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        {cloneElement(block as ReactElement<BlockProps>, {
          onClick: (event: ReactMouseEvent) => {
            if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
            event.preventDefault();
            setOpen((v) => !v);
          },
        })}
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

export function Contributions() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  // 日历含 365 个 Tooltip，渲染是长任务；推迟到入场动画（约 3s）结束后再挂载，
  // 避免巨型 React commit 阻塞主线程、卡住按钮/关于等板块的动画
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 3000);
    return () => clearTimeout(id);
  }, []);

  return (
    <section id="contributions" className="scroll-mt-6 py-10">
      <Reveal delay="2.35s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc text-3xl font-semibold tracking-tight sm:text-4xl">{t.contributions.title}</h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">
            #CONTRIBUTIONS
          </span>
        </div>
      </Reveal>

      <Reveal delay="2.5s" direction="down">
        <div className="mt-4 overflow-hidden rounded-xl border bg-card p-4">
          {mounted ? (
            <GitHubCalendar
              username="HanHanWeb"
              year="last"
              blockSize={12}
              blockMargin={4}
              fontSize={12}
              colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
              showTotalCount={false}
              throwOnError={false}
              renderBlock={(block, activity) => (
                <BlockTooltip key={activity.date} block={block}>
                  <p>
                    {activity.count === 0
                      ? t.contributions.tooltipEmpty.replace("{date}", activity.date)
                      : t.contributions.tooltipCount
                          .replace("{count}", String(activity.count))
                          .replace("{date}", activity.date)}
                  </p>
                </BlockTooltip>
              )}
            />
          ) : (
            <div className="h-[112px] animate-pulse rounded-md bg-muted/50" />
          )}
        </div>
      </Reveal>
    </section>
  );
}
