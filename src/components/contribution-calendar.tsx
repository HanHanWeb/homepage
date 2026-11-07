"use client";

import { useTheme } from "next-themes";
import { cloneElement, useCallback, useState, type MouseEvent, type ReactElement } from "react";
import { GitHubCalendar, type Activity } from "react-github-calendar";

import { useLanguage } from "@/components/language-provider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function BlockTooltip({ block, label }: { block: ReactElement; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen} disableHoverableContent>
      <TooltipTrigger asChild>
        {cloneElement(block as ReactElement<{ onClick?: (event: MouseEvent) => void }>, {
          // The tooltip ignores touch pointer moves, so tap the cell to toggle it.
          onClick: (event) => {
            if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
            event.preventDefault();
            setOpen((value) => !value);
          },
        })}
      </TooltipTrigger>
      {open && <TooltipContent className="pointer-events-none">{label}</TooltipContent>}
    </Tooltip>
  );
}

export function ContributionCalendar({ blockSize, blockMargin, visibleWeeks }: {
  blockSize: number;
  blockMargin: number;
  visibleWeeks: number;
}) {
  const { resolvedTheme } = useTheme();
  const { t, locale } = useLanguage();
  const fitRecentWeeks = useCallback((activities: Activity[]) => {
    const latest = activities.at(-1);
    if (!latest) return activities;

    // Keep whole weeks starting on Sunday and ending at the most recent date.
    const cutoff = new Date(`${latest.date}T00:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() - cutoff.getUTCDay() - (visibleWeeks - 1) * 7);
    const firstVisibleDate = cutoff.toISOString().slice(0, 10);
    return activities.filter((activity) => activity.date >= firstVisibleDate);
  }, [visibleWeeks]);

  return (
    <TooltipProvider>
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
        errorMessage={locale === "en" ? "Could not load contribution data." : "暂时无法加载贡献数据。"}
        renderBlock={(block, activity) => (
          <BlockTooltip
            key={activity.date}
            block={block}
            label={activity.count === 0
              ? t.contributions.tooltipEmpty.replace("{date}", activity.date)
              : t.contributions.tooltipCount.replace("{count}", String(activity.count)).replace("{date}", activity.date)}
          />
        )}
      />
    </TooltipProvider>
  );
}
