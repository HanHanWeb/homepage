"use client";

import type { CSSProperties } from "react";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { formatPostDate, postCover, type Post } from "@/lib/blog";

/** 博客列表：编辑式三栏（日期分类 / 标题摘要 / 封面），无侧边栏 */
export function BlogView({ posts }: { posts: Post[] }) {
  const { t, locale } = useLanguage();
  const zh = locale === "zh";

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
      <header className="animate-blur-in mt-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-border pb-8 sm:mt-14">
        <div className="min-w-0">
          <nav
            aria-label={zh ? "面包屑" : "Breadcrumb"}
            className="mb-3 flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="shrink-0 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              {zh ? "主页" : "Home"}
            </Link>
            <span aria-hidden className="select-none opacity-50">
              /
            </span>
            <span aria-current="page">{t.blog.title}</span>
          </nav>
          <h1 className="text-balance text-4xl font-medium tracking-tight sm:text-5xl">{t.blog.title}</h1>
          <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {zh ? "记录学习、创作与思考。" : "Notes on learning, building, and thinking."}
          </p>
        </div>
        <span className="text-sm tracking-widest text-muted-foreground">#BLOG</span>
      </header>

      {posts.length === 0 ? (
        <p className="py-24 text-center text-sm text-muted-foreground">
          {zh ? "还没有文章" : "No posts yet"}
        </p>
      ) : (
        <div>
          {posts.map((post, index) => {
            const cover = postCover(post);
            return (
              <article
                key={post.slug}
                className="group/blog animate-blur-in border-t border-border/70 first:border-t-0"
                style={{ "--blur-delay": `${0.06 + index * 0.06}s` } as CSSProperties}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="grid grid-cols-1 items-start gap-y-4 rounded-2xl py-8 outline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:py-10 md:grid-cols-[minmax(0,1fr)_220px] md:gap-x-8 xl:grid-cols-[160px_minmax(0,1fr)_310px] xl:gap-x-10"
                >
                  <div className="col-start-1 row-start-1 aspect-video overflow-hidden rounded-[10px] border border-border/60 bg-muted sm:rounded-[15px] md:col-start-2 xl:col-start-3">
                    {cover ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={cover}
                        alt={post.title}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="size-full object-cover object-center transition-transform duration-300 group-hover/blog:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-linear-to-br from-muted to-accent/50">
                        <span className="px-4 text-center font-mono text-sm tracking-widest text-muted-foreground/70">
                          {post.category || "POST"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 self-start md:col-start-1 md:row-start-1 xl:col-start-2">
                    <h2 className="line-clamp-3 text-balance text-xl font-medium leading-[1.45] tracking-tight decoration-[#00bc7d] decoration-2 underline-offset-4 group-hover/blog:underline md:text-[23px] xl:text-2xl xl:leading-8">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="mt-3 line-clamp-3 text-pretty text-base leading-7 text-muted-foreground md:mt-3.5">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-muted-foreground md:col-start-1 md:row-start-2 md:mt-3 xl:col-start-1 xl:row-start-1 xl:mt-1 xl:flex-col xl:items-start xl:gap-1 xl:self-start">
                    <time dateTime={post.createdAt}>{formatPostDate(post.createdAt, zh)}</time>
                    <span aria-hidden className="xl:hidden">
                      ·
                    </span>
                    <span>{post.category}</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-10 text-sm text-muted-foreground">
        {zh
          ? `共 ${posts.length} 篇文章`
          : `${posts.length} ${posts.length === 1 ? "article" : "articles"}`}
      </p>
    </main>
  );
}
