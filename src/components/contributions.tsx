"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import dynamic from "next/dynamic";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Spinner } from "@/components/ui/spinner";
import { useLanguage } from "@/components/language-provider";

const blockSize = 12;
const blockMargin = 4;

function CalendarLoading() {
  const { locale } = useLanguage();
  return <Spinner label={locale === "en" ? "Loading contributions" : "正在加载贡献日历"} className="m-auto size-6 text-emerald-600 dark:text-emerald-400" />;
}

const ContributionCalendar = dynamic(() => import("@/components/contribution-calendar").then((module) => module.ContributionCalendar), {
  ssr: false,
  loading: CalendarLoading,
});

export function Contributions() {
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

  return (
    <section id="contributions" className="scroll-mt-6 py-10">
      <Reveal delay="2.9s" direction="down">
        <SectionHeading title={t.contributions.title} tag="#CONTRIBUTIONS" />
      </Reveal>

      <Reveal delay="3.05s" direction="down">
        <div className="mt-4 grid w-full gap-6 rounded-xl border bg-muted/40 p-4 sm:p-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-stretch lg:gap-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
            <div className="cursor-spotlight flex flex-col justify-center rounded-xl border border-border/40 bg-card px-4 py-3">
              <p className="stat-number text-3xl font-medium tracking-tight tabular-nums">8B+</p>
              <p className="mt-1 text-sm text-muted-foreground">{en ? "Total tokens" : "累计 Token"}</p>
            </div>
            <div className="cursor-spotlight flex flex-col justify-center rounded-xl border border-border/40 bg-card px-4 py-3">
              <p className="stat-number text-3xl font-medium tracking-tight tabular-nums">300M+</p>
              <p className="mt-1 text-sm text-muted-foreground">{en ? "Peak tokens" : "峰值 Token"}</p>
            </div>
          </div>
          <div ref={calendar} className="contribution-calendar flex min-h-[150px] min-w-0 justify-end">
            {nearViewport && visibleWeeks > 0 ? (
              <ContributionCalendar blockSize={blockSize} blockMargin={blockMargin} visibleWeeks={visibleWeeks} />
            ) : <CalendarLoading />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
