"use client";

import { ArrowUpRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ShotCarousel } from "@/components/shot-carousel";
import { FEATURED_PROJECT, PROJECTS } from "@/lib/projects";
import { useFancybox } from "@/lib/use-fancybox";

export function Projects() {
  const { t, locale } = useLanguage();
  useFancybox();
  const featured = FEATURED_PROJECT;
  const titles = (locale === "en" ? featured.quote.titleEn : featured.quote.titleZh)
    .split("·")
    .map((title) => title.trim());

  const [titleIndex, setTitleIndex] = useState(0);
  const [rollInstant, setRollInstant] = useState(false);
  // 语言切换后标题集改变：渲染期直接复位到第一行并临时关闭过渡（React 官方的“prop 变化时调整 state”写法）
  const [rollLocale, setRollLocale] = useState(locale);
  if (rollLocale !== locale) {
    setRollLocale(locale);
    setTitleIndex(0);
    setRollInstant(true);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((index) => index + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 复位生效后，下一帧恢复过渡动画
  useEffect(() => {
    if (!rollInstant) return;
    const raf = requestAnimationFrame(() => setRollInstant(false));
    return () => cancelAnimationFrame(raf);
  }, [rollInstant]);
  return (
    <section id="projects" className="scroll-mt-6 py-10">
      <Reveal delay="2.35s" direction="down">
        <SectionHeading title={t.projects.title} tag="#PROJECTS" />
      </Reveal>

      <Reveal delay="2.45s" direction="down">
        <article className="mt-4 rounded-xl border bg-card p-5">
          <div className="sm:flex sm:gap-8">
            <header className="flex flex-col sm:flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="font-mono text-base font-semibold tracking-tight">
                  {locale === "en" ? featured.nameEn : featured.name}
                </h3>
                <span className="rounded-full border px-2.5 py-0.5 text-xs text-[#00bc7d]">
                  {locale === "en" ? featured.roleEn : featured.roleZh}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {locale === "en" ? featured.descEn : featured.descZh}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:mt-auto">
                <span className="mr-1 text-xs text-muted-foreground">{t.projects.affiliated}</span>
                {featured.subProjects.map((sub) => (
                  <span
                    key={sub.name}
                    className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {locale === "en" ? sub.nameEn : sub.name}
                  </span>
                ))}
              </div>
            </header>
            <figure className="relative mt-5 overflow-hidden rounded-lg border border-[#00bc7d]/25 bg-linear-to-br from-[#00bc7d]/10 to-[#00bc7d]/[0.02] p-4 sm:mt-0 sm:w-[calc(50%-6px)] sm:shrink-0">
              <Quote
                className="absolute -top-2 right-2 size-10 text-[#00bc7d]/20"
                strokeWidth={1.5}
                aria-hidden
              />
              <blockquote className="relative pr-10 text-sm leading-6">
                {locale === "en" ? featured.quote.textEn : featured.quote.textZh}
              </blockquote>
              <figcaption className="relative mt-3.5 flex items-center gap-2.5">
                <img
                  src={featured.quote.avatar}
                  alt={featured.quote.author}
                  loading="lazy"
                  className="size-8 shrink-0 rounded-full border object-cover"
                />
                <p className="min-w-0 text-xs text-muted-foreground">
                  <span className="block text-sm font-medium leading-5 text-foreground">
                    {locale === "en" ? featured.quote.authorEn : featured.quote.author}
                  </span>
                  <span className="mt-0.5 block h-5 overflow-hidden leading-5">
                    <span
                      onTransitionEnd={(e) => {
                        if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
                        if (titleIndex >= titles.length) {
                          setRollInstant(true);
                          setTitleIndex(titleIndex % titles.length);
                          requestAnimationFrame(() => setRollInstant(false));
                        }
                      }}
                      className={`block ${rollInstant ? "" : "transition-transform duration-500 ease-out"}`}
                      style={{ transform: `translateY(calc(-${titleIndex} * 1.25rem))` }}
                    >
                      {[...titles, titles[0]].map((title, i) => (
                        <span key={i} className="block h-5 truncate leading-5">
                          {title}
                        </span>
                      ))}
                    </span>
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </article>
      </Reveal>

      {/* 瀑布流：卡片高度不一（有无预览图），用多列布局自然错落 */}
      <div className="mt-3 columns-1 gap-3 sm:columns-2">
        {PROJECTS.map((project, i) => {
          const shots = project.images ?? [];
          const body = (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="font-mono text-sm font-semibold tracking-tight">
                    {locale === "en" ? project.nameEn : project.name}
                  </h3>
                  <span className="rounded-full border px-2.5 py-0.5 text-xs text-[#00bc7d]">
                    {locale === "en" ? project.tagEn : project.tagZh}
                  </span>
                </div>
                {project.url && (
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {locale === "en" ? project.descEn : project.descZh}
              </p>
            </>
          );
          const content = (
            <>
              {shots.length > 0 && (
                <ShotCarousel
                  images={shots.map((img) => ({
                    src: img.src,
                    alt: locale === "en" ? img.altEn : img.altZh,
                  }))}
                  group={`project-${project.name}`}
                  aspectClassName="aspect-[19/10]"
                  className="border-b"
                />
              )}
              <div className="flex flex-col p-5">{body}</div>
            </>
          );
          return (
            <Reveal
              key={project.name}
              delay={`${0.15 + i * 0.08}s`}
              direction="down"
              className="mb-3 break-inside-avoid"
            >
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:bg-muted/50"
                >
                  {content}
                </a>
              ) : (
                <div className="flex flex-col overflow-hidden rounded-xl border bg-card">{content}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
