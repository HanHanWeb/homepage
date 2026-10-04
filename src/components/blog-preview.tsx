"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Post } from "@/lib/blog";

/** 首页博客板块：最近 5 篇文章预览（标题、发布时间） */
export function BlogPreview({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();
  const latest = posts.slice(0, 5);
  if (latest.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-6 py-10">
      <Reveal delay="0s" direction="down">
        <SectionHeading title={t.blog.title} tag="#BLOG" href="/blog" />
      </Reveal>

      <div className="mt-6 space-y-3">
        {latest.map((post, i) => (
          <Reveal key={post.slug} delay={`${i * 0.08}s`} direction="down">
            <Link
              href={`/blog/${post.slug}`}
              className="relative block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <h3 className="font-serif-song font-semibold text-lg tracking-tight">
                {post.title}
              </h3>
              <span className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" strokeWidth={1.5} />
                {post.createdAt.slice(0, 10)}
              </span>
            </Link>
          </Reveal>
        ))}
        <Reveal delay={`${latest.length * 0.08}s`} direction="down">
          <Link
            href="/blog"
            className="mx-auto mt-1 block w-fit rounded-full border bg-card px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-[#00bc7d]/60 hover:text-[#00bc7d]"
          >
            {t.blog.viewAll}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
