"use client";

import { ChevronDown, ChevronUp, Pause, Play, Quote } from "@/components/animated-icons";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { FeaturedProject } from "@/lib/projects";
import { cn } from "@/lib/utils";

const control = "cursor-spotlight inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50";
const readingTime = 5_000;
const cardOffset = 10;
const scaleFactor = 0.06;

export function ProjectTestimonials({ quotes, en }: { quotes: FeaturedProject["quotes"]; en: boolean }) {
  const stack = useRef<HTMLDivElement>(null);
  const visible = useInView(stack);
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const label = en ? "Community testimonials" : "社区寄语";

  const advance = useCallback((direction: number) => {
    setIndex((current) => (current + direction + quotes.length) % quotes.length);
  }, [quotes.length]);

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
        className="relative isolate"
        style={{ paddingTop: (quotes.length - 1) * cardOffset }}
      >
        <div className="relative grid" aria-live={paused || reducedMotion ? "polite" : "off"}>
          {quotes.map((quote, position) => {
            // Like Aceternity's stack, the back card moves to the front on each advance.
            const depth = (index - position + quotes.length) % quotes.length;
            const active = depth === 0;
            return (
              <motion.figure
                key={quote.author}
                aria-hidden={!active}
                initial={false}
                animate={{
                  y: -depth * cardOffset,
                  scale: 1 - depth * scaleFactor,
                  zIndex: quotes.length - depth,
                  filter: active ? "blur(0px)" : "blur(1px)",
                }}
                transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "relative col-start-1 row-start-1 flex min-w-0 origin-top flex-col rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-5",
                  !active && "pointer-events-none select-none",
                )}
              >
                <div className={cn("flex items-start gap-2.5 transition-opacity duration-200 motion-reduce:transition-none", !active && "opacity-0")}>
                  <Quote aria-hidden className="mt-1 size-4 shrink-0 rotate-180 text-muted-foreground/40" />
                  <blockquote className="text-sm leading-6">{en ? quote.textEn : quote.textZh}</blockquote>
                </div>
                <figcaption className={cn("mt-auto flex min-w-0 items-start gap-2.5 pt-3.5 transition-opacity duration-200 motion-reduce:transition-none", !active && "opacity-0")}>
                  <span className="size-9 shrink-0 overflow-hidden rounded-full border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={quote.avatar} alt="" width={36} height={36} loading="lazy" decoding="async" className="size-full object-cover" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{quote.author}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{en ? quote.titleEn : quote.titleZh}</p>
                  </div>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
