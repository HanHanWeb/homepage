"use client";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ThreeDMarquee } from "@/components/three-d-marquee";
import { useFancybox } from "@/lib/use-fancybox";
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
  const { t, locale } = useLanguage();
  useFancybox();

  const serviceCard = (item: (typeof t.services.items)[number]) => (
    <div
      className="cursor-spotlight relative overflow-hidden rounded-xl border p-5 sm:p-6"
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
        <ThreeDMarquee
          images={item.collections.flatMap((collection) => collection.images.map((image) => ({
            ...image,
            category: collection.hint,
            cropTop: "crop" in collection && collection.crop === "top",
          })))}
          label={locale === "en" ? "Design portfolio" : "设计作品展示"}
          pauseLabel={locale === "en" ? "Pause gallery" : "暂停图片滚动"}
          playLabel={locale === "en" ? "Play gallery" : "继续图片滚动"}
        />
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
