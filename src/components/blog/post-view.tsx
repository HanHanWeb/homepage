"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

import type { Post } from "@/lib/blog";

export function PostView({ post }: { post: Post }) {
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

      <article
        className="mt-8 animate-blur-in"
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
        <div className="mt-8 whitespace-pre-line text-[15px] leading-8 text-foreground/90">
          {post.content ?? post.description}
        </div>
      </article>
    </main>
  );
}
