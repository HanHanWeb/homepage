"use client";

import { ChevronDown, ChevronUp, Pause, Play, Quote } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { FeaturedProject } from "@/lib/projects";
import { cn } from "@/lib/utils";

const control = "inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50";
const readingTime = 5_000;

export function ProjectTestimonials({ quotes, en }: { quotes: FeaturedProject["quotes"]; en: boolean }) {
  const stack = useRef<HTMLDivElement>(null);
  const visible = useInView(stack);
  const reducedMotion = useReducedMotion();
  const [{ index, exitingIndex }, setPlayback] = useState<{ index: number; exitingIndex: number | null }>({
    index: 0,
    exitingIndex: null,
  });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const label = en ? "Community testimonials" : "社区寄语";

  const advance = useCallback((direction: number) => {
    setPlayback(({ index: current }) => ({
      index: (current + direction + quotes.length) % quotes.length,
      exitingIndex: reducedMotion ? null : current,
    }));
  }, [quotes.length, reducedMotion]);

  useEffect(() => {
    if (!visible || reducedMotion || paused || hovered || quotes.length < 2) return;
    const timer = window.setTimeout(() => advance(1), readingTime);
    return () => window.clearTimeout(timer);
  }, [advance, hovered, index, paused, quotes.length, reducedMotion, visible]);

  function step(direction: number) {
    setPaused(true);
    advance(direction);
  }

  if (!quotes.length) return null;

  return (
    <section className="min-w-0 lg:self-center" aria-label={label}>
      <div className="mb-2.5 flex min-h-9 items-center justify-between gap-3">
        <h3 className="text-xs font-medium text-muted-foreground">{label}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? (en ? "Resume playback" : "继续播放") : (en ? "Pause playback" : "暂停播放")}
            disabled={quotes.length < 2}
            className={cn(control, "motion-reduce:hidden")}
          >
            {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
          </button>
          <button type="button" className={control} disabled={quotes.length < 2} aria-label={en ? "Previous testimonial" : "上一条寄语"} onClick={() => step(-1)}>
            <ChevronUp aria-hidden className="size-4" />
          </button>
          <button type="button" className={control} disabled={quotes.length < 2} aria-label={en ? "Next testimonial" : "下一条寄语"} onClick={() => step(1)}>
            <ChevronDown aria-hidden className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={stack}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        className="relative isolate pb-5"
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-7 top-5 bottom-0 rounded-2xl border border-border/70 bg-card/55" />
        <div aria-hidden className="pointer-events-none absolute inset-x-3.5 top-2.5 bottom-2.5 rounded-2xl border border-border/80 bg-card/80 shadow-xs" />
        <div className="relative grid" aria-live={paused || reducedMotion ? "polite" : "off"}>
          {quotes.map((quote, position) => {
            const active = position === index;
            const exiting = !reducedMotion && position === exitingIndex;
            return (
              <figure
                key={quote.author}
                aria-hidden={!active}
                onAnimationEnd={exiting ? (event) => {
                  if (event.animationName !== "project-testimonial-exit") return;
                  setPlayback((current) => current.exitingIndex === position ? { ...current, exitingIndex: null } : current);
                } : undefined}
                className={cn(
                  "col-start-1 row-start-1 min-w-0 rounded-2xl border border-border/70 bg-card/95 p-4 shadow-sm backdrop-blur-md sm:p-5",
                  active && "project-testimonial-active z-10",
                  exiting && "project-testimonial-exiting pointer-events-none z-20",
                  !active && !exiting && "invisible",
                )}
              >
                <figcaption className="flex min-w-0 items-start gap-2.5">
                  <span className="size-9 shrink-0 overflow-hidden rounded-full border bg-muted">
                    {(active || exiting) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={quote.avatar} alt="" width={36} height={36} loading="lazy" decoding="async" className="size-full object-cover" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{quote.author}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{en ? quote.titleEn : quote.titleZh}</p>
                  </div>
                </figcaption>
                <div className="mt-3.5 flex items-start gap-2.5">
                  <Quote aria-hidden className="mt-1 size-4 shrink-0 rotate-180 text-muted-foreground/40" />
                  <blockquote className="text-sm leading-6">{en ? quote.textEn : quote.textZh}</blockquote>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
