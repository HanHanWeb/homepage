"use client";

import { ArrowLeft, Calendar, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import type { Post } from "@/lib/blog";

export function BlogView({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return [...counts.entries()];
  }, [posts]);

  const filtered = posts.filter((p) => !category || p.category === category);

  const clearFilters = () => setCategory(null);

  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
      <Link
        href="/"
        className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground animate-blur-in"
        style={{ "--blur-delay": "0.05s" } as React.CSSProperties}
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        {t.blog.backHome}
      </Link>

      <div
        className="mt-6 flex items-baseline justify-between gap-4 animate-blur-in"
        style={{ "--blur-delay": "0.15s" } as React.CSSProperties}
      >
        <h1 className="font-serif-sc relative inline-block text-3xl font-semibold tracking-tight sm:text-4xl">
          {t.blog.title}
          <span className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]" aria-hidden />
        </h1>
        <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#BLOG</span>
      </div>

      {posts.length === 0 ? (
        <div
          className="mt-16 flex flex-col items-center gap-3 text-muted-foreground animate-blur-in"
          style={{ "--blur-delay": "0.3s" } as React.CSSProperties}
        >
          <FileText className="size-8 opacity-40" strokeWidth={1.5} />
          <p className="text-sm">{t.blog.empty}</p>
        </div>
      ) : (
        <div
          className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_15rem] animate-blur-in"
          style={{ "--blur-delay": "0.3s" } as React.CSSProperties}
        >
          <div className="min-w-0 space-y-3">
            {filtered.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
              >
                <button
                  type="button"
                  onClick={() => setCategory(category === post.category ? null : post.category)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                    category === post.category
                      ? "border-[#00bc7d]/60 bg-[#00bc7d]/10 text-[#00bc7d]"
                      : "border-[#00bc7d]/40 text-[#00bc7d] hover:bg-[#00bc7d]/10"
                  }`}
                >
                  {post.category}
                </button>
                <h2 className="font-serif-song mt-2.5 text-lg leading-7 font-semibold tracking-tight">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.description}</p>
                <span className="mt-3 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Calendar className="size-3.5" strokeWidth={1.5} />
                  {post.createdAt.slice(0, 10)}
                  {post.wordCount > 0 && (
                    <>
                      <span aria-hidden className="opacity-60">
                        ·
                      </span>
                      {t.blog.words.replace("{count}", post.wordCount.toLocaleString())}
                    </>
                  )}
                </span>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-muted-foreground">
                <FileText className="size-8 opacity-40" strokeWidth={1.5} />
                <p className="text-sm">{t.blog.noMatch}</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-[#00bc7d] hover:underline"
                >
                  {t.blog.clearFilter}
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20">
            <section className="rounded-xl border bg-card p-4">
              <h3 className="flex items-center gap-1.5 text-xs font-medium tracking-widest text-muted-foreground">
                <FolderOpen className="size-3.5" />
                {t.blog.categories}
              </h3>
              <div className="mt-2 space-y-0.5">
                <FilterRow
                  active={category === null}
                  label={t.blog.all}
                  count={posts.length}
                  onClick={clearFilters}
                />
                {categories.map(([name, count]) => (
                  <FilterRow
                    key={name}
                    active={category === name}
                    label={name}
                    count={count}
                    onClick={() => setCategory(category === name ? null : name)}
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}

function FilterRow({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
        active
          ? "bg-muted/60 font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full transition-colors ${
          active ? "bg-[#00bc7d]" : "bg-transparent"
        }`}
        aria-hidden
      />
      <span className="flex-1 truncate text-left">{label}</span>
      <span className="text-xs tabular-nums opacity-60">{count}</span>
    </button>
  );
}
