"use client";

import { ArrowUpRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { FEATURED_PROJECT, PROJECTS } from "@/lib/projects";

export function Projects() {
  const { t, locale } = useLanguage();
  const featured = FEATURED_PROJECT;
  const titles = (locale === "en" ? featured.quote.titleEn : featured.quote.titleZh)
    .split("·")
    .map((title) => title.trim());

  const [titleIndex, setTitleIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((index) => (index + 1) % titles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [titles.length]);
  return (
    <section id="projects" className="scroll-mt-6 py-10">
      <Reveal delay="2.35s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
            {t.projects.title}
            <span className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]" aria-hidden />
          </h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#PROJECTS</span>
        </div>
      </Reveal>

      <Reveal delay="2.45s" direction="down">
        <article className="mt-4 rounded-xl border bg-card p-5">
          <div className="sm:flex sm:gap-8">
            <header className="flex flex-col sm:flex-1">
              <div className="flex items-center justify-between gap-2">
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
            <figure className="relative mt-5 overflow-hidden rounded-lg bg-linear-to-br from-[#00bc7d]/10 to-[#00bc7d]/[0.04] p-4 sm:mt-0 sm:w-[calc(50%-6px)] sm:shrink-0">
              <Quote
                className="absolute -top-1 right-2 size-10 text-[#00bc7d]/20"
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
                      key={titleIndex}
                      className="block truncate animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                      {titles[titleIndex]}
                    </span>
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </article>
      </Reveal>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {PROJECTS.map((project, i) => {
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
          return (
            <Reveal key={project.name} delay={`${2.5 + i * 0.08}s`} direction="down">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
                >
                  {body}
                </a>
              ) : (
                <div className="flex h-full flex-col rounded-xl border bg-card p-5">{body}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
