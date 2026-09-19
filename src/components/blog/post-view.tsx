"use client";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Calendar, Clock, Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { estimateReadingMinutes, type Post } from "@/lib/blog";
import { ReadingBgPicker } from "@/components/reading-bg";
import { BlogBadges } from "@/components/blog-badges";
import { BlogNav } from "@/components/blog/blog-nav";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const FONT_STEPS = ["14px", "15px", "17px"];
const FONT_LABELS = ["A-", "A", "A+"];

type Block =
  | { kind: "heading"; text: string }
  | { kind: "image"; alt: string; src: string }
  | { kind: "para"; text: string };

/** 轻量块解析：空行分段，## 开头为小标题，![alt](src) 整行为图片 */
function parseBlocks(content: string): Block[] {
  return content
    .split(/\n{2,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map<Block>((t) => {
      if (t.startsWith("## ")) return { kind: "heading", text: t.slice(3) };
      const img = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (img) return { kind: "image", alt: img[1], src: img[2] };
      return { kind: "para", text: t };
    });
}

/** 把段落里的裸 URL（http(s):// 或 www. 开头）拆分为链接片段 */
function splitLinks(text: string): { type: "text" | "url"; value: string }[] {
  const parts: { type: "text" | "url"; value: string }[] = [];
  const re = /(?:https?:\/\/|www\.)[^\s（）<>]+/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "url", value: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
  return parts;
}

function toHref(url: string): string {
  return url.startsWith("www.") ? `https://${url}` : url;
}

export function PostView({ post }: { post: Post }) {
  const blocks = parseBlocks(post.content ?? post.description ?? "");
  // 目录只索引章节标题
  const headings = blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.kind === "heading");
  const showToc = headings.length >= 2;
  const [fontStep, setFontStep] = useState(1);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  // 点击目录后的平滑滚动期间锁定高亮，避免路过中间章节时闪烁
  const clickLockRef = useRef(false);
  const lockTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const saved = Number(localStorage.getItem("post-font-size"));
    if (Number.isInteger(saved) && saved >= 0 && saved < FONT_STEPS.length) {
      setFontStep(saved);
    }
  }, []);

  // 正文图片灯箱
  useEffect(() => {
    Fancybox.bind("[data-fancybox]");
    return () => {
      Fancybox.destroy();
    };
  }, []);

  const changeFont = (step: number) => {
    setFontStep(step);
    localStorage.setItem("post-font-size", String(step));
  };

  // 滚动时高亮视口顶附近的章节标题；不依赖 rAF（后台/节流时会被暂停导致失效）
  useEffect(() => {
    if (!showToc) return;
    const update = () => {
      if (clickLockRef.current) return;
      const hs =
        contentRef.current?.querySelectorAll<HTMLElement>("h2[data-toc]") ??
        [];
      let current = headings[0]?.i ?? 0;
      hs.forEach((h) => {
        if (h.getBoundingClientRect().top <= 130) {
          current = Number((h.id ?? "").replace("toc-b-", "")) || current;
        }
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToc]);

  const choose = (i: number) => {
    setActive(i);
    clickLockRef.current = true;
    window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      clickLockRef.current = false;
    }, 1000);
    document
      .getElementById(`toc-b-${i}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fontSizeCard = (
    <section className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-sm font-medium">阅读字号</p>
        <div
          className="flex overflow-hidden rounded-[9px] border"
          role="group"
          aria-label="调节正文字号"
        >
          {FONT_STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => changeFont(i)}
              aria-pressed={fontStep === i}
              className={`flex h-6 w-9 items-center justify-center text-center text-xs transition-colors ${
                i > 0 ? "border-l" : ""
              } ${
                fontStep === i
                  ? "bg-[#00bc7d]/10 font-medium text-[#00bc7d]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {FONT_LABELS[i]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  const tocCard = (closeAfter = false) =>
    showToc ? (
      <section className="rounded-xl border bg-card px-4 py-3">
        <div className="flex items-center gap-3 pb-1">
          <p className="min-w-0 flex-1 text-sm font-medium">本文目录</p>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
            #TOC
          </span>
        </div>
        <div>
          {headings.map(({ b, i }) => {
            const text = b.kind === "heading" ? b.text : "";
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  choose(i);
                  if (closeAfter) setMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 py-1 text-left text-xs transition-colors ${
                  active === i
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-3.5 w-[3px] shrink-0 rounded-full ${
                    active === i ? "bg-[#00bc7d]" : "bg-border"
                  }`}
                />
                <span className="truncate">{text}</span>
              </button>
            );
          })}
        </div>
      </section>
    ) : null;

  return (
    <>
      <BlogNav
        title={post.title}
        menu={
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="打开侧边栏菜单"
            className="rounded-full border bg-card p-2 text-foreground transition-colors hover:text-[#00bc7d]"
          >
            <Menu className="size-4" strokeWidth={1.5} />
          </button>
        }
      />
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-80 gap-4 overflow-y-auto p-4">
          <SheetTitle className="sr-only">文章侧边栏</SheetTitle>
          <div className="space-y-4">
            {tocCard(true)}
            <ReadingBgPicker />
            {fontSizeCard}
            <BlogBadges />
          </div>
        </SheetContent>
      </Sheet>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
      <nav
        aria-label="面包屑"
        className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground animate-blur-in"
        style={{ "--blur-delay": "0.05s" } as React.CSSProperties}
      >
        <Link
          href="/"
          className="shrink-0 transition-colors hover:text-foreground"
        >
          主页
        </Link>
        <span aria-hidden className="select-none opacity-50">
          /
        </span>
        <Link
          href="/blog"
          className="shrink-0 transition-colors hover:text-foreground"
        >
          博客
        </Link>
        <span aria-hidden className="select-none opacity-50">
          /
        </span>
        <span aria-current="page" className="min-w-0 truncate">
          {post.title}
        </span>
      </nav>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_15rem]">
        <article
          className="animate-blur-in"
          style={{ "--blur-delay": "0.15s" } as React.CSSProperties}
        >
          <h1 className="font-serif-sc mt-4 text-3xl tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" strokeWidth={1.5} />
            {post.createdAt.slice(0, 10)}
            {post.wordCount > 0 && (
              <>
                <span aria-hidden className="opacity-60">
                  ·
                </span>
                <Clock className="size-3.5" strokeWidth={1.5} />
                约 {estimateReadingMinutes(post.wordCount)} 分钟
              </>
            )}
          </div>
          <div
            ref={contentRef}
            className="mt-8 space-y-4 leading-8 text-foreground/90"
            style={{ fontSize: FONT_STEPS[fontStep] }}
          >
            {blocks.map((b, i) => {
              if (b.kind === "heading") {
                return (
                  <h2
                    key={i}
                    id={showToc ? `toc-b-${i}` : undefined}
                    data-toc={showToc ? "" : undefined}
                    className="font-serif-song mt-9 scroll-mt-24 text-2xl tracking-tight"
                  >
                    {b.text}
                  </h2>
                );
              }
              if (b.kind === "image") {
                return (
                  <span key={i} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.src}
                      alt={b.alt}
                      loading="lazy"
                      data-fancybox="post"
                      data-caption={b.alt}
                      className="w-full cursor-zoom-in rounded-xl border"
                    />
                  </span>
                );
              }
              return (
                <p key={i} className="whitespace-pre-line">
                  {splitLinks(b.text).map((seg, j) =>
                    seg.type === "text" ? (
                      seg.value
                    ) : (
                      <a
                        key={j}
                        href={toHref(seg.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-[#00bc7d]/60 decoration-[1.5px] underline-offset-4 transition-colors hover:text-[#00bc7d] hover:decoration-[#00bc7d]"
                      >
                        {seg.value}
                      </a>
                    ),
                  )}
                </p>
              );
            })}
          </div>
        </article>

        <aside className="hidden space-y-4 lg:sticky lg:top-20 lg:block">
          {tocCard()}
          <ReadingBgPicker />
          {fontSizeCard}
          <BlogBadges />
        </aside>
      </div>
    </main>
    </>
  );
}
