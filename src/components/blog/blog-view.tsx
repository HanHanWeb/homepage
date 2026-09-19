"use client";

import { ArrowLeft, Calendar, Check, Copy, FileText, Rss } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Post } from "@/lib/blog";

export function BlogView({ posts }: { posts: Post[] }) {
  const [copied, setCopied] = useState(false);

  const copyFeedUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/feed.xml`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用（如非安全上下文）时静默失败
    }
  };

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
      <Link
        href="/"
        className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground animate-blur-in"
        style={{ "--blur-delay": "0.05s" } as React.CSSProperties}
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        返回首页
      </Link>

      <div
        className="mt-6 flex items-baseline justify-between gap-4 animate-blur-in"
        style={{ "--blur-delay": "0.15s" } as React.CSSProperties}
      >
        <h1 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
          博客
          <span className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]" aria-hidden />
        </h1>
        <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#BLOG</span>
      </div>

      <div
        className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_15rem] animate-blur-in"
        style={{ "--blur-delay": "0.3s" } as React.CSSProperties}
      >
        <div className="min-w-0 space-y-3">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
              <FileText className="size-8 opacity-40" strokeWidth={1.5} />
              <p className="text-sm">还没有文章</p>
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                id={`post-${post.slug}`}
                className="scroll-mt-20 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
              >
                <h2 className="font-serif-sc text-xl leading-8 tracking-tight sm:text-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-[#00bc7d]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.description}</p>
                <span className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
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
                </span>
              </article>
            ))
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20">
          <section className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3">
            <Rss className="size-4 shrink-0 text-[#00bc7d]" />
            <p className="min-w-0 flex-1 text-sm font-medium">订阅更新</p>
            <button
              type="button"
              onClick={copyFeedUrl}
              aria-label={copied ? "已复制" : "复制订阅链接"}
              className={`shrink-0 rounded-full border p-1.5 transition-colors ${
                copied
                  ? "border-[#00bc7d]/60 bg-[#00bc7d]/10 text-[#00bc7d]"
                  : "text-muted-foreground hover:border-[#00bc7d]/50 hover:text-[#00bc7d]"
              }`}
            >
              {copied ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}
