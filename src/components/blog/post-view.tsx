"use client";

import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

import type { Post } from "@/lib/blog";

export function PostView({ post }: { post: Post }) {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
      <Link
        href="/blog"
        className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground animate-blur-in"
        style={{ "--blur-delay": "0.05s" } as React.CSSProperties}
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        返回博客
      </Link>

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
