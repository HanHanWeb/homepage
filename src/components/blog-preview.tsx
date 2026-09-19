import Link from "next/link";
import { Clock } from "lucide-react";

import { Reveal } from "@/components/reveal";
import type { Post } from "@/lib/blog";

/** 首页博客板块：最近 5 篇文章预览（标题、简介、发布时间） */
export function BlogPreview({ posts }: { posts: Post[] }) {
  const latest = posts.slice(0, 5);
  if (latest.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-6 py-10">
      <Reveal delay="2.25s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
            博客
            <span
              className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]"
              aria-hidden
            />
          </h2>
          <Link
            href="/blog"
            className="text-sm font-normal tracking-widest text-muted-foreground/40 transition-colors hover:text-[#00bc7d]"
          >
            #BLOG
          </Link>
        </div>
      </Reveal>

      <div className="mt-6 space-y-3">
        {latest.map((post, i) => (
          <Reveal key={post.slug} delay={`${2.4 + i * 0.08}s`} direction="down">
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif-song text-lg tracking-tight">
                  {post.title}
                </h3>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" strokeWidth={1.5} />
                  {post.createdAt.slice(0, 10)}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {post.description}
              </p>
            </Link>
          </Reveal>
        ))}
        <Reveal delay={`${2.4 + latest.length * 0.08}s`} direction="down">
          <Link
            href="/blog"
            className="mx-auto mt-1 block w-fit rounded-full border bg-card px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-[#00bc7d]/60 hover:text-[#00bc7d]"
          >
            查看全部文章 →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
