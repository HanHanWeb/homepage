"use client";

import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/lib/projects";

export function Projects() {
  const { t, locale } = useLanguage();
  return (
    <section id="projects" className="scroll-mt-6 py-10">
      <Reveal delay="2.35s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc text-3xl font-semibold tracking-tight sm:text-4xl">{t.projects.title}</h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#PROJECTS</span>
        </div>
      </Reveal>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.name} delay={`${2.5 + i * 0.08}s`} direction="down">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-mono text-sm font-semibold tracking-tight">{project.name}</h3>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {locale === "en" ? project.descEn : project.descZh}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
