"use client";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import Text3DFlip from "@/registry/magicui/text-3d-flip";

export function Focus() {
  const { t } = useLanguage();
  return (
    <section id="focus" className="scroll-mt-6 py-10">
      <Reveal delay="1.8s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc text-3xl font-semibold tracking-tight sm:text-4xl">{t.services.title}</h2>
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
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
