"use client";

import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactElement, ReactNode } from "react";
import { useInView } from "motion/react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import type { Activity } from "react-github-calendar";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/components/language-provider";

const blockSize = 12;
const blockMargin = 4;

function CalendarLoading() {
  const { locale } = useLanguage();
  return <Spinner label={locale === "en" ? "Loading contributions" : "正在加载贡献日历"} className="m-auto size-6 text-emerald-600 dark:text-emerald-400" />;
}

const GitHubCalendar = dynamic(() => import("react-github-calendar").then((module) => module.GitHubCalendar), {
  ssr: false,
  loading: CalendarLoading,
});

// Radix Tooltip 不响应触摸（onPointerMove 直接忽略 touch），用受控 open 实现：
// 触摸设备上点击格子切换 tooltip 显隐
type BlockProps = {
  onClick?: (event: ReactMouseEvent) => void;
};

function BlockTooltip({
  block,
  children,
}: {
  block: ReactElement;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen} disableHoverableContent>
      <TooltipTrigger asChild>
        {cloneElement(block as ReactElement<BlockProps>, {
          onClick: (event: ReactMouseEvent) => {
            if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
            event.preventDefault();
            setOpen((v) => !v);
          },
        })}
      </TooltipTrigger>
      {open && <TooltipContent className="pointer-events-none">{children}</TooltipContent>}
    </Tooltip>
  );
}

export function Contributions() {
  const { resolvedTheme } = useTheme();
  const { t, locale } = useLanguage();
  const en = locale === "en";
  const calendar = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(calendar, { once: true, margin: "480px" });
  const [visibleWeeks, setVisibleWeeks] = useState(0);

  useEffect(() => {
    const container = calendar.current;
    if (!nearViewport || !container) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setVisibleWeeks(Math.floor((width + blockMargin) / (blockSize + blockMargin)));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [nearViewport]);

  const fitRecentWeeks = useCallback((activities: Activity[]) => {
    const latest = activities.at(-1);
    if (!latest) return activities;

    // Calendar columns start on Sunday. Keep the weeks that fit, ending at the latest date.
    const cutoff = new Date(`${latest.date}T00:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() - cutoff.getUTCDay() - (visibleWeeks - 1) * 7);
    const firstVisibleDate = cutoff.toISOString().slice(0, 10);
    return activities.filter((activity) => activity.date >= firstVisibleDate);
  }, [visibleWeeks]);

  return (
    <section id="contributions" className="scroll-mt-6 py-10">
      <Reveal delay="2.9s" direction="down">
        <SectionHeading title={t.contributions.title} tag="#CONTRIBUTIONS" />
      </Reveal>

      <Reveal delay="3.05s" direction="down">
        <div className="mt-4 grid w-full gap-6 rounded-xl border bg-muted/40 p-4 sm:p-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-stretch lg:gap-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
            <div className="flex flex-col justify-center rounded-xl border border-border/40 bg-card px-4 py-3">
              <p className="stat-number text-3xl font-medium tracking-tight tabular-nums">8B+</p>
              <p className="mt-1 text-sm text-muted-foreground">{en ? "Total tokens" : "累计 Token"}</p>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-border/40 bg-card px-4 py-3">
              <p className="stat-number text-3xl font-medium tracking-tight tabular-nums">300M+</p>
              <p className="mt-1 text-sm text-muted-foreground">{en ? "Peak tokens" : "峰值 Token"}</p>
            </div>
          </div>
          <div ref={calendar} className="contribution-calendar flex min-h-[150px] min-w-0 justify-end">
            {nearViewport && visibleWeeks > 0 ? (
              <GitHubCalendar
                username="HanHanWeb"
                year="last"
                blockSize={blockSize}
                blockMargin={blockMargin}
                weekStart={0}
                transformData={fitRecentWeeks}
                fontSize={12}
                colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                showTotalCount={false}
                throwOnError={false}
                errorMessage={en ? "Could not load contribution data." : "暂时无法加载贡献数据。"}
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
            ) : <CalendarLoading />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
