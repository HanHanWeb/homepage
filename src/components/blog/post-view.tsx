"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Post } from "@/lib/blog";

const FONT_STEPS = ["14px", "15px", "17px"];
const FONT_LABELS = ["A-", "A", "A+"];

/** 纯文本按空行切段，用于目录锚点；单换行仍由 whitespace-pre-line 保留 */
function splitParagraphs(post: Post): string[] {
  return (post.content ?? post.description ?? "")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function PostView({ post }: { post: Post }) {
  const paragraphs = splitParagraphs(post);
  const showToc = paragraphs.length >= 3;
  const [fontStep, setFontStep] = useState(1);
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = Number(localStorage.getItem("post-font-size"));
    if (Number.isInteger(saved) && saved >= 0 && saved < FONT_STEPS.length) {
      setFontStep(saved);
    }
  }, []);

  const changeFont = (step: number) => {
    setFontStep(step);
    localStorage.setItem("post-font-size", String(step));
  };

  // 滚动时高亮视口顶附近的段落
  useEffect(() => {
    if (!showToc) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const ps =
          contentRef.current?.querySelectorAll<HTMLElement>("p[data-toc]") ??
          [];
        let current = 0;
        ps.forEach((p, i) => {
          if (p.getBoundingClientRect().top <= 120) current = i;
        });
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [showToc]);

  return (
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
                {post.wordCount.toLocaleString()} 字
              </>
            )}
          </div>
          <div
            ref={contentRef}
            className="mt-8 space-y-4 leading-8 text-foreground/90"
            style={{ fontSize: FONT_STEPS[fontStep] }}
          >
            {paragraphs.map((text, i) => (
              <p
                key={i}
                id={showToc ? `toc-p-${i}` : undefined}
                data-toc={showToc ? "" : undefined}
                className="whitespace-pre-line"
              >
                {text}
              </p>
            ))}
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-20">
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
                    className={`w-9 py-1.5 text-center text-xs transition-colors ${
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

          {showToc && (
            <section className="rounded-xl border bg-card px-4 py-3">
              <div className="flex items-center gap-3 pb-1">
                <p className="min-w-0 flex-1 text-sm font-medium">本文目录</p>
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
                  #TOC
                </span>
              </div>
              <div>
                {paragraphs.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(`toc-p-${i}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
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
                    <span className="truncate">
                      {text.length > 14 ? `${text.slice(0, 14)}…` : text}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
