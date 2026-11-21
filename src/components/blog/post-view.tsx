"use client";

import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Calendar, Clock } from "@/components/animated-icons";
import Link from "next/link";
import { useEffect } from "react";

import { useLanguage } from "@/components/language-provider";
import { estimateReadingMinutes, formatPostDate, type Post } from "@/lib/blog";
import { BlogNav } from "@/components/blog/blog-nav";
import { SharePosterButton } from "@/components/blog/share-poster";

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
  const { locale } = useLanguage();
  const zh = locale === "zh";
  const blocks = parseBlocks(post.content ?? post.description ?? "");
  const firstImageIndex = blocks.findIndex((block) => block.kind === "image");

  // 正文图片灯箱
  useEffect(() => {
    Fancybox.bind("[data-fancybox]");
    return () => {
      Fancybox.destroy();
    };
  }, []);


  return (
    <>
      <BlogNav />

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
      <div className="mt-8 max-w-[44rem]">
        <header
          className="animate-blur-in mt-4"
          style={{ "--blur-delay": "0.15s" } as React.CSSProperties}
        >
          <nav
            aria-label="面包屑"
            className="mb-3 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="shrink-0 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              主页
            </Link>
            <span aria-hidden className="select-none opacity-50">
              /
            </span>
            <Link href="/blog" className="shrink-0 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              博客
            </Link>
            <span aria-hidden className="select-none opacity-50">
              /
            </span>
            <span aria-current="page" className="min-w-0 truncate">
              {post.title}
            </span>
          </nav>
          <h1
            data-post-title
            className="text-balance font-serif-song font-semibold text-3xl leading-snug tracking-tight sm:text-4xl"
          >
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" strokeWidth={1.5} />
            {formatPostDate(post.createdAt, zh)}
            {post.wordCount > 0 && (
              <>
                <span aria-hidden className="opacity-60">
                  ·
                </span>
                <Clock className="size-3.5" strokeWidth={1.5} />
                {zh ? `约 ${estimateReadingMinutes(post.wordCount)} 分钟` : `${estimateReadingMinutes(post.wordCount)} min read`}
              </>
            )}
          </div>
        </header>

        <article
          className="animate-blur-in mt-8 sm:mt-10"
          style={{ "--blur-delay": "0.15s" } as React.CSSProperties}
        >
          <div
            className="space-y-4 text-base leading-[1.85] text-pretty text-foreground/90 [overflow-anchor:none]"
          >
            {blocks.map((b, i) => {
              if (b.kind === "heading") {
                return (
                  <h2
                    key={i}
                    className="text-balance font-serif-song font-bold mt-9 scroll-mt-20 text-[1.6em] leading-[1.4] tracking-tight"
                  >
                    {b.text}
                  </h2>
                );
              }
              if (b.kind === "image") {
                // 正文里的相对路径图片位于文章目录 blog/<slug>/ 下；
                // 页面 URL 无尾斜杠时浏览器会把相对路径解析到上级，需补全为绝对路径
                const src =
                  b.src.startsWith("/") || /^(https?:)?\/\//.test(b.src)
                    ? b.src
                    : `/blog/${post.slug}/${b.src}`;
                return (
                  <span key={i} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={b.alt}
                      loading={i === firstImageIndex ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={i === firstImageIndex ? "high" : "auto"}
                      data-fancybox="post"
                      data-caption={b.alt}
                      className="w-full cursor-zoom-in rounded-xl border"
                    />
                    {b.alt && (
                      <span className="mt-3 block text-center font-mono text-sm text-muted-foreground">
                        {b.alt}
                      </span>
                    )}
                  </span>
                );
              }
              return (
                <p key={i} className="whitespace-pre-line text-pretty">
                  {splitLinks(b.text).map((seg, j) =>
                    seg.type === "text" ? (
                      seg.value
                    ) : (
                      <a
                        key={j}
                        href={toHref(seg.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm underline decoration-[#00bc7d]/60 decoration-[1.5px] underline-offset-4 transition-colors hover:text-[#00bc7d] hover:decoration-[#00bc7d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {seg.value}
                      </a>
                    ),
                  )}
                </p>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <SharePosterButton post={post} />
          </div>
        </article>

      </div>
    </main>
    </>
  );
}
