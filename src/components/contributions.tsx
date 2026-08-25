"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";

import { Reveal } from "@/components/reveal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/components/language-provider";

export function Contributions() {
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
                <Tooltip key={activity.date}>
                  <TooltipTrigger asChild>{block}</TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {activity.count === 0
                        ? t.contributions.tooltipEmpty.replace("{date}", activity.date)
                        : t.contributions.tooltipCount
                            .replace("{count}", String(activity.count))
                            .replace("{date}", activity.date)}
                    </p>
                  </TooltipContent>
                </Tooltip>
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
