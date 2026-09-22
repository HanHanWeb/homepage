"use client";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Fancybox } from "@fancyapps/ui";
import { Clapperboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import Text3DFlip from "@/registry/magicui/text-3d-flip";

const BILIBILI_BVID = "BV1KWhJ67EYm";

/** B 站播放器：滚动进入视口后才加载并静音自动播放，右下角悬浮提示角标 */
function BilibiliVideo({ bvid, title, hint }: { bvid: string; title: string; hint: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative mt-5 w-full overflow-hidden rounded-lg border">
      {inView ? (
        <iframe
          src={`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=1&muted=1&high_quality=1`}
          title={title}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="aspect-video w-full"
        />
      ) : (
        <div className="aspect-video w-full bg-muted/40" aria-hidden />
      )}
      <span className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white/90 backdrop-blur-sm">
        <Clapperboard className="size-3.5" strokeWidth={1.5} aria-hidden />
        {hint}
      </span>
    </div>
  );
}

/** 作品集轮播 banner：自动左右滑动，悬停暂停，右下角指示器，悬停浮现集合名；点击打开灯箱 */
function ShotCarousel({
  images,
  hint,
  group,
  className,
  cropTop,
}: {
  images: readonly { src: string; alt: string }[];
  hint: string;
  group: string;
  className?: string;
  cropTop?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, images.length]);

  return (
    <div
      className={`group relative overflow-hidden rounded-[10px] bg-muted ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            draggable={false}
            className={`aspect-video w-full shrink-0 cursor-zoom-in object-cover ${cropTop ? "object-top" : ""}`}
            data-fancybox={group}
            data-caption={img.alt}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent px-3 pt-8 pb-2.5 text-xs text-white">
        {hint}
      </div>
      {images.length > 1 && (
        <span className="pointer-events-none absolute right-2.5 bottom-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white/90">
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  );
}

export function Focus() {
  const { t } = useLanguage();

  useEffect(() => {
    Fancybox.bind("[data-fancybox]");
    return () => {
      Fancybox.destroy();
    };
  }, []);

  return (
    <section id="focus" className="scroll-mt-6 py-10">
      <Reveal delay="1.8s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
            {t.services.title}
            <span className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]" aria-hidden />
          </h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#FOCUS</span>
        </div>
      </Reveal>

      <div className="mt-6 space-y-3">
        {t.services.items.map((item, i) => (
          <Reveal
            key={`service-${i}`}
            delay={`${1.95 + i * 0.08}s`}
            direction="down"
          >
            <div
              className="relative overflow-hidden rounded-xl border p-5 sm:p-6"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 10px)",
              }}
            >
              <div className="absolute inset-0 bg-card/60" aria-hidden />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between [perspective:800px]">
                <Text3DFlip
                  as="h3"
                  className="shrink-0 cursor-pointer bg-transparent"
                  textClassName="bg-card text-foreground text-xl font-bold tracking-tight sm:text-2xl"
                  flipTextClassName="bg-card text-foreground text-xl font-bold tracking-tight sm:text-2xl"
                  rotateDirection="top"
                  staggerDuration={0.03}
                  staggerFrom="first"
                  transition={{ type: "spring", damping: 25, stiffness: 160 }}
                >
                  {item.title}
                </Text3DFlip>
                <div className="flex flex-wrap gap-2 sm:ml-4 sm:max-w-[75%] sm:justify-end">
                  {item.options.map((opt, j) => (
                    <span
                      key={`opt-${i}-${j}`}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-foreground/70" aria-hidden />
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
              {"videoHint" in item && (
                <BilibiliVideo bvid={BILIBILI_BVID} title={item.title} hint={item.videoHint} />
              )}
              {"collections" in item && (
                <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {item.collections.map((col, colIdx) => (
                    <ShotCarousel
                      key={col.hint}
                      images={col.images}
                      hint={col.hint}
                      group={`focus-${colIdx}`}
                      className={"wide" in col && col.wide ? "sm:col-span-2" : undefined}
                      cropTop={"crop" in col && col.crop === "top"}
                    />
                  ))}
                </div>
              )}
              {"note" in item && (
                <p className="relative mt-3 text-xs leading-5 text-muted-foreground">
                  {item.note}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
