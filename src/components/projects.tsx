"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Code2, GithubIcon } from "@/components/animated-icons";
import { useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { ImageSlide } from "@/components/image-slide";
import { ProjectTestimonials } from "@/components/project-testimonials";
import { ScrollTextReveal } from "@/components/scroll-text-reveal";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FEATURED_PROJECT, PROJECTS, type Project } from "@/lib/projects";

function ProjectLinks({ project, en }: { project: Project; en: boolean }) {
  const isGitHub = project.url?.startsWith("https://github.com/");
  const githubUrl = project.githubUrl ?? (isGitHub ? project.url : undefined);
  const websiteUrl = isGitHub ? undefined : project.url;
  return (
    <div className="flex shrink-0 items-center gap-2">
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.nameEn} · GitHub`} title="GitHub" className="cursor-spotlight inline-flex size-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <GithubIcon className="size-4" />
        </a>
      )}
      {websiteUrl && (
        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="cursor-spotlight inline-flex min-h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-xs transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{en ? "Visit" : "访问"}<ArrowUpRight aria-hidden className="size-3.5" /></a>
      )}
      {!githubUrl && !websiteUrl && <span className="text-xs text-muted-foreground">{en ? "Archived" : "已归档"}</span>}
    </div>
  );
}

export function Projects() {
  const { t, locale } = useLanguage();
  const en = locale === "en";
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [shotIndex, setShotIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const featured = FEATURED_PROJECT;
  const roles = en
    ? [featured.roleEn, "Planning", "Design", "Promotion", "Development"]
    : [featured.roleZh, "策划", "设计", "宣传", "开发"];
  const stats = [
    { value: "500+", label: en ? "Registered users" : "注册用户" },
    { value: "360+", label: en ? "Days in operation" : "运营天数" },
    { value: "5+", label: en ? "Supporting services" : "附属设施" },
    { value: "10+", label: en ? "Team members" : "团队人数" },
  ];
  const activeCount = PROJECTS.filter((project) => project.tagZh !== "归档").length;
  const archiveCount = PROJECTS.length - activeCount;
  const visible = PROJECTS.filter((project) => filter === "all" || (project.tagZh === "归档") === (filter === "archive"));
  const selectedShot = selected?.images?.[shotIndex];

  return (
    <section id="projects" className="min-w-0 pb-8">
      <SectionHeading title={t.projects.title} tag="#PROJECTS" level={1} />
      <ScrollTextReveal
        className="scroll-text-reveal-from-top mt-6 max-w-lg text-xl leading-relaxed tracking-tight sm:text-2xl"
        lines={en
          ? ["Ideas, brought to life.", "A collection of things I build and care about."]
          : ["把想法，做成可以使用的东西。", "一些独立开发，一些共同创造。"]}
      />

      <article className="mt-7 overflow-hidden rounded-xl border border-border/60 bg-muted/40 sm:mt-10">
        <div className="grid items-start gap-5 p-4 min-[375px]:p-5 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
          <div className="flex min-w-0 flex-col items-start">
            <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground">{en ? featured.name : featured.nameEn.toUpperCase()}</p>
            <h2 className="text-2xl font-medium tracking-tight sm:text-4xl">{en ? featured.nameEn : featured.name}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="outline" className="cursor-spotlight h-6 px-2 sm:px-3">{role}</Badge>
              ))}
            </div>
            <p className="mt-4 max-w-prose text-sm leading-6 text-pretty text-muted-foreground sm:mt-5 sm:leading-7">{en ? featured.descEn : featured.descZh}</p>
            <dl className="mt-5 grid w-full grid-cols-2 gap-2 sm:gap-2.5">
              {stats.map(({ value, label }) => (
                <div key={label} className="cursor-spotlight flex min-w-0 flex-col rounded-lg border border-border/60 bg-card px-3 pt-3 pb-2 sm:px-3.5">
                  <dt className="mt-1 text-xs leading-5 text-muted-foreground">{label}</dt>
                  <dd className="stat-number order-first text-2xl leading-none font-medium tracking-tight tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ProjectTestimonials quotes={featured.quotes} en={en} />
        </div>
      </article>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <ToggleGroup type="single" variant="outline" value={filter} onValueChange={(value) => { if (value) setFilter(value); }} aria-label={en ? "Project collection" : "项目分类"}>
          <ToggleGroupItem value="all" className="cursor-spotlight gap-2 px-4">{en ? "All" : "全部"}<span className="text-xs text-muted-foreground">{PROJECTS.length}</span></ToggleGroupItem>
          <ToggleGroupItem value="active" className="cursor-spotlight gap-2 px-4">{en ? "Development" : "开发"}<span className="text-xs text-muted-foreground">{activeCount}</span></ToggleGroupItem>
          <ToggleGroupItem value="archive" className="cursor-spotlight gap-2 px-4">{en ? "Archive" : "归档"}<span className="text-xs text-muted-foreground">{archiveCount}</span></ToggleGroupItem>
        </ToggleGroup>

      </div>

      <div className="mt-5 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => {
          const cover = project.images?.[0];
          const archived = project.tagZh === "归档";
          return (
            <article key={project.name} className="cursor-spotlight group flex min-w-0 flex-col rounded-xl border border-border/70 bg-card p-3 shadow-xs transition-shadow hover:shadow-md">
              <button type="button" aria-label={en ? `View ${project.nameEn}` : `查看项目：${project.name}`} aria-haspopup="dialog" className="flex min-w-0 flex-1 cursor-pointer flex-col text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" onClick={(event) => { trigger.current = event.currentTarget; setShotIndex(0); setSelected(project); }}>
                <div className="relative w-full overflow-hidden rounded-lg border border-border/40 bg-muted/40 aspect-[4/3]">
                  {cover ? <div className="absolute inset-4 flex items-center justify-center sm:inset-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover.src} alt={en ? cover.altEn : cover.altZh} loading="lazy" className="block h-auto max-h-full w-auto max-w-full rounded-md shadow-md" />
                  </div> : <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"><Code2 aria-hidden className="size-7 text-muted-foreground/40" /><span className="font-mono text-xl tracking-tight text-foreground/75">{en ? project.nameEn : project.name}</span></div>}
                </div>
                <div className="mt-4 flex w-full items-start justify-between gap-3 px-1">
                  <h2 className="min-w-0 text-base font-medium tracking-tight">{en ? project.nameEn : project.name}</h2>
                  <Badge variant="outline" className="cursor-spotlight">
                    {archived && en ? "Archive" : en ? project.tagEn : project.tagZh}
                  </Badge>
                </div>
                <p className="mt-2 px-1 text-sm leading-6 text-muted-foreground">{en ? project.descEn : project.descZh}</p>
              </button>
              <div className="mt-5 flex min-h-8 items-center justify-end gap-2 border-t border-border/50 px-1 pt-3">

                <ProjectLinks project={project} en={en} />
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="flex max-h-[90dvh] min-w-0 flex-col overflow-hidden sm:max-w-4xl" onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}>
          <DialogHeader className="shrink-0 pr-8"><DialogTitle>{en ? selected?.nameEn : selected?.name}</DialogTitle><DialogDescription>{en ? selected?.descEn : selected?.descZh}</DialogDescription></DialogHeader>
          {selectedShot && <div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border bg-muted/40 p-4">
            <ImageSlide src={selectedShot.src} alt={en ? selectedShot.altEn : selectedShot.altZh} direction={slideDirection} sources={selected?.images?.map((image) => image.src)} />
          </div>}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
            {selected && <ProjectLinks project={selected} en={en} />}
            {selected?.images && selected.images.length > 1 && <div className="flex items-center gap-2"><Button variant="outline" size="icon" aria-label={en ? "Previous image" : "上一张"} onClick={() => { setSlideDirection(-1); setShotIndex((index) => (index - 1 + selected.images!.length) % selected.images!.length); }}><ChevronLeft aria-hidden /></Button><span className="min-w-10 text-center text-xs text-muted-foreground">{shotIndex + 1} / {selected.images.length}</span><Button variant="outline" size="icon" aria-label={en ? "Next image" : "下一张"} onClick={() => { setSlideDirection(1); setShotIndex((index) => (index + 1) % selected.images!.length); }}><ChevronRight aria-hidden /></Button></div>}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
