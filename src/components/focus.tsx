"use client";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ShotCarousel } from "@/components/shot-carousel";
import { useFancybox } from "@/lib/use-fancybox";
import { cn } from "@/lib/utils";
import Text3DFlip from "@/registry/magicui/text-3d-flip";

const BILIBILI_BVID = "BV1KWhJ67EYm";

/** B 站播放器：不自动播放，用户在播放器内手动播放 */
function BilibiliVideo({ bvid, title }: { bvid: string; title: string }) {
  return (
    <div className="relative mt-5 w-full overflow-hidden rounded-lg border">
      <iframe
        src={`https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0&high_quality=1`}
        title={title}
        allow="fullscreen"
        allowFullScreen
        className="aspect-video w-full"
      />
    </div>
  );
}

export function Focus() {
  const { t } = useLanguage();
  useFancybox();

  const serviceCard = (item: (typeof t.services.items)[number]) => (
    <div
      className="relative overflow-hidden rounded-xl border p-5 sm:p-6"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--border) 0 1px, transparent 1px 10px)",
      }}
    >
      <div className="absolute inset-0 bg-card/60" aria-hidden />
      <div className="relative flex flex-col gap-3 [perspective:800px]">
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
        <div className="flex flex-wrap gap-2">
          {item.options.map((opt) => (
            <span
              key={`opt-${opt}`}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-foreground/70" aria-hidden />
              {opt}
            </span>
          ))}
        </div>
      </div>
      {"video" in item && <BilibiliVideo bvid={BILIBILI_BVID} title={item.title} />}
      {"collections" in item && (
        <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {item.collections.map((col, colIdx) => (
            <ShotCarousel
              key={col.hint}
              images={col.images}
              hint={col.hint}
              group={`focus-${colIdx}`}
              className={cn("rounded-[10px]", "wide" in col && col.wide && "sm:col-span-2")}
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
  );

  return (
    <section id="focus" className="scroll-mt-6 py-10">
      <Reveal delay="1.8s" direction="down">
        <SectionHeading title={t.services.title} tag="#FOCUS" />
      </Reveal>

      {/* 三张卡片纵向排列 */}
      <div className="mt-6 space-y-3">
        {t.services.items.map((item, i) => (
          <Reveal key={`service-${i}`} delay={`${i * 0.08}s`} direction="down">
            {serviceCard(item)}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
