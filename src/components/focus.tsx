"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, Code2, Component, SquarePlay, Terminal } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { ImageSlide } from "@/components/image-slide";
import { SectionHeading } from "@/components/section-heading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const BILIBILI_BVID = "BV1KWhJ67EYm";
const panelClass = "cursor-spotlight relative min-w-0 overflow-hidden rounded-xl border border-border/60 bg-muted/40";

export function Focus() {
  const { t, locale } = useLanguage();
  const zh = locale === "zh";
  const [development, design, visual] = t.services.items;
  const [category, setCategory] = useState("0");
  const [showAll, setShowAll] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const previewTrigger = useRef<HTMLButtonElement | null>(null);
  const collections = "collections" in design ? design.collections : [];
  const images = "collections" in design
    ? design.collections.flatMap((collection, collectionIndex) => collection.images.map((image) => ({
        ...image,
        category: collection.hint,
        categoryId: String(collectionIndex),
        cropTop: "crop" in collection && collection.crop === "top",
      })))
    : [];
  const projects = Array.from(new Set(images.map((image) => image.projectId))).map((projectId) => {
    const screenshots = images.filter((image) => image.projectId === projectId);
    const cover = screenshots[0];
    return {
      ...cover,
      title: projectId === "spark" ? "Spark" : projectId === "intereco-home" ? (zh ? "界面生态主页" : "Intereco Homepage") : projectId === "ipoa" ? (zh ? "IPOA 赛事系统" : "IPOA Competition System") : projectId === "gallery" ? (zh ? "界面生态作品中心" : "Intereco Works Center") : projectId === "newspaper" ? (zh ? "澎湃报" : "The Surging Newspaper") : cover.alt,
      screenshots,
    };
  });
  const filteredProjects = projects.filter((project) => project.categoryId === category);
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 4);
  const selectedProject = projects.find((project) => project.projectId === selectedProjectId);
  const selectedScreenshot = selectedProject?.screenshots[screenshotIndex];

  return (
    <>
    <section id="focus" className="w-full min-w-0 scroll-mt-20 py-12 sm:py-16">
      <SectionHeading title={t.services.title} tag="#FOCUS" />
      <div className="mt-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <p className="max-w-lg text-xl leading-relaxed tracking-tight sm:text-2xl">
          {zh ? "把想法变成看得见的作品。" : "Turning ideas into things you can see."}
          <span className="block text-muted-foreground">
            {zh ? "在技术、设计与影像之间，持续探索。" : "Exploring code, design, and visual stories."}
          </span>
        </p>
        <Link href="/projects" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-muted px-4 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          {zh ? "查看项目" : "See projects"}
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-8">
        <article className={`${panelClass} p-6 sm:p-7`}>
          <div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{design.title}</h3>
              <Component aria-hidden className="size-5 shrink-0 text-muted-foreground/60" />
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              {zh ? "从界面到版式，让灵感拥有清晰的表达。" : "From interfaces to layouts, giving ideas a clear visual form."}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <ToggleGroup
              type="single"
              variant="outline"
              value={category}
              onValueChange={(value) => {
                if (!value) return;
                setCategory(value);
                setShowAll(false);
              }}
              aria-label={zh ? "设计作品分类" : "Design categories"}
              className="flex-wrap"
            >
              {collections.map((collection, index) => (
                <ToggleGroupItem key={index} value={String(index)} className="rounded-full px-4">{collection.hint}</ToggleGroupItem>
              ))}
            </ToggleGroup>
            {filteredProjects.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                aria-expanded={showAll}
                aria-controls="focus-design-gallery"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-muted px-4 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {showAll ? (zh ? "收起" : "Show less") : (zh ? "浏览全部" : "Browse all")}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </button>
            )}
          </div>
          <div id="focus-design-gallery" className="mt-5 grid grid-cols-1 items-start gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {visibleProjects.map((image) => (
              <button
                type="button"
                key={image.src}
                onClick={(event) => {
                  previewTrigger.current = event.currentTarget;
                  setScreenshotIndex(0);
                  setSelectedProjectId(image.projectId);
                }}
                aria-label={zh ? `查看作品：${image.title}` : `View work: ${image.title}`}
                aria-haspopup="dialog"
                className="cursor-spotlight group block w-full min-w-0 cursor-pointer rounded-xl border border-border/70 bg-card p-3 text-left shadow-xs transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <div className={cn("relative overflow-hidden rounded-lg border border-border/40 bg-muted/40", image.projectId === "acrylic-cd" ? "aspect-square" : "aspect-[4/3]")}>
                  {image.projectId === "acrylic-cd" && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={image.src} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute inset-0 size-full scale-125 object-cover opacity-25 blur-xl" />
                  )}
                  <div className={cn("absolute inset-3 flex items-center justify-center", image.projectId === "acrylic-cd" && "inset-5")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={image.alt} loading="lazy" className={cn("block max-h-full max-w-full rounded-md shadow-md", image.cropTop ? "size-full object-cover object-top" : "h-auto w-auto object-contain")} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium leading-5">{image.title}</h4>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{image.category}</p>
                  </div>
                  <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-foreground"><ArrowUpRight className="size-3.5" /></span>
                </div>
              </button>
            ))}
          </div>
          {"note" in design && <p className="mt-4 text-xs leading-5 text-muted-foreground">{design.note}</p>}
        </article>

        <div className="grid items-stretch gap-4 md:grid-cols-2">
        <article id="development" className={`${panelClass} flex flex-col`}>
          <div className="px-6 pt-6 pb-6 sm:px-7 sm:pt-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{development.title}</h3>
              <Code2 aria-hidden className="size-5 shrink-0 text-muted-foreground/60" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {zh ? "让想法落地，也让每一次运行稳定可靠。" : "Building ideas into products, and keeping them running."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {development.options.map((option) => <Badge key={option} variant="outline" className="h-7 px-3">{option}</Badge>)}
            </div>
          </div>
          <div data-focus-terminal className="mt-auto ml-6 min-h-48 overflow-hidden rounded-tl-lg border-t border-l border-border/60 bg-background sm:ml-7">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5 text-xs text-muted-foreground">
              <Terminal aria-hidden className="size-3.5" />
              <span className="font-mono">workspace / homepage</span>
              <div aria-hidden className="ml-auto flex gap-1.5"><span className="size-1.5 rounded-full bg-foreground/15" /><span className="size-1.5 rounded-full bg-foreground/15" /><span className="size-1.5 rounded-full bg-foreground/15" /></div>
            </div>
            <div className="flex flex-col gap-2 px-4 py-4 font-mono text-xs leading-5">
              <p><span className="text-muted-foreground">$ </span>pnpm dev</p>
              <p className="text-muted-foreground">Next.js · React · TypeScript</p>
              <p className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-ring" />localhost:3000</p>
            </div>
          </div>
        </article>

        <article className={panelClass}>
          <div className="px-6 pt-6 sm:px-7 sm:pt-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{visual.title}</h3>
              <SquarePlay aria-hidden className="size-5 shrink-0 text-muted-foreground/60" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {zh ? "用镜头记录日常，从另一个角度看世界。" : "Capturing everyday moments, seeing the world from another angle."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {visual.options.map((option) => <Badge key={option} variant="outline" className="h-7 px-3">{option}</Badge>)}
            </div>
          </div>
          <div className="mx-4 mt-5 overflow-hidden rounded-lg border border-border/60 bg-background">
            <iframe
              src={`https://player.bilibili.com/player.html?bvid=${BILIBILI_BVID}&autoplay=0&high_quality=1`}
              title={visual.title}
              allow="fullscreen"
              allowFullScreen
              loading="lazy"
              className="aspect-video w-full"
            />
          </div>
          {"note" in visual && <p className="px-6 pt-3 pb-5 text-xs leading-5 text-muted-foreground sm:px-7">{visual.note}</p>}
        </article>
        </div>
      </div>
    </section>
    <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => { if (!open) setSelectedProjectId(null); }}>
      <DialogContent
        className="flex max-h-[90dvh] min-w-0 flex-col overflow-hidden sm:max-w-4xl"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          previewTrigger.current?.focus();
        }}
      >
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle>{selectedProject?.title}</DialogTitle>
          <DialogDescription>{selectedProject?.category}</DialogDescription>
        </DialogHeader>
        {selectedProject && selectedScreenshot && (
          <>
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border bg-muted/40 p-3 sm:p-5">
              <ImageSlide src={selectedScreenshot.src} alt={selectedScreenshot.alt} direction={slideDirection} sources={selectedProject.screenshots.map((image) => image.src)} />
            </div>
            {selectedProject.screenshots.length > 1 && (
                <div className="flex shrink-0 items-center justify-end gap-2">
                  <Button variant="outline" size="icon" aria-label={zh ? "上一张" : "Previous image"} onClick={() => { setSlideDirection(-1); setScreenshotIndex((index) => (index - 1 + selectedProject.screenshots.length) % selectedProject.screenshots.length); }}><ChevronLeft aria-hidden /></Button>
                  <span className="min-w-10 text-center text-xs text-muted-foreground">{screenshotIndex + 1} / {selectedProject.screenshots.length}</span>
                  <Button variant="outline" size="icon" aria-label={zh ? "下一张" : "Next image"} onClick={() => { setSlideDirection(1); setScreenshotIndex((index) => (index + 1) % selectedProject.screenshots.length); }}><ChevronRight aria-hidden /></Button>
                </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
