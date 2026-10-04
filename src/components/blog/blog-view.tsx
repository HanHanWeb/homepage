"use client";

import {
  Calendar,
  Check,
  Clock,
  Copy,
  FileText,
  Menu,
  Rss,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { estimateReadingMinutes, type Post } from "@/lib/blog";
import { HitokotoCard } from "@/components/hitokoto-card";
import { BlogBadges } from "@/components/blog-badges";
import { BlogNav } from "@/components/blog/blog-nav";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function BlogView({ posts }: { posts: Post[] }) {
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  // 滑动选中指示器：跟踪选中项在分组内的位置
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  // 搜索框：收起为圆形按钮，聚焦或已有内容时平滑展开
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchExpanded = searchOpen || query.trim() !== "";

  const categories = [
    "全部",
    ...new Set(posts.map((p) => p.category).filter(Boolean)),
  ];
  const filtered = posts.filter((p) => {
    const okCategory = category === "全部" || p.category === category;
    const q = query.trim().toLowerCase();
    const okQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return okCategory && okQuery;
  });

  const copyFeedUrl = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/feed.xml`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪贴板不可用（如非安全上下文）时静默失败
    }
  };

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const update = () => {
      const active = group.querySelector<HTMLElement>('[data-state="on"]');
      if (!active) return;
      setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
    };
    update();
    // 字体加载、窗口变化引起的尺寸变化都重算
    const ro = new ResizeObserver(update);
    ro.observe(group);
    return () => ro.disconnect();
  }, [category, categories.length]);

  return (
    <>
      <BlogNav
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
        <SheetContent
          side="right"
          className="w-80 gap-4 overflow-y-auto px-4 pt-12 pb-4"
        >
          <SheetTitle className="sr-only">博客侧边栏</SheetTitle>
          <div className="space-y-4">
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
                <span className="relative grid size-3.5 place-items-center">
                  {/* SF Symbols 风格切换：旧图标带模糊缩小弹出，新图标弹簧落位 */}
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={copied ? "check" : "copy"}
                      initial={{ scale: 0.4, opacity: 0, filter: "blur(3px)" }}
                      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                      exit={{ scale: 0.4, opacity: 0, filter: "blur(3px)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="col-start-1 row-start-1 grid place-items-center"
                    >
                      {copied ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <Copy className="size-3.5" aria-hidden />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            </section>
            <HitokotoCard />
            <BlogBadges />
          </div>
        </SheetContent>
      </Sheet>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pt-20 pb-16">
        <nav
          aria-label="面包屑"
          className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground"
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
          <span aria-current="page">博客</span>
        </nav>

        <div className="mt-6 flex items-baseline justify-between gap-4">
          <h1 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
            博客
            <span
              className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]"
              aria-hidden
            />
          </h1>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">
            #BLOG
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
        <ToggleGroup
          ref={groupRef}
          type="single"
          spacing={1}
          value={category}
            onValueChange={(v) => {
              if (v) setCategory(v);
            }}
            aria-label="文章分类"
            className="relative h-9 rounded-full border bg-card p-1"
          >
            {indicator && (
              <span
                aria-hidden
                className="absolute inset-y-1 rounded-full bg-[#00bc7d]/10 transition-[left,width] duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width }}
              />
            )}
            {categories.map((c) => (
              <ToggleGroupItem
                key={c}
                value={c}
                aria-label={`分类：${c}`}
                className="relative h-7 rounded-full border-0 px-4 text-sm data-[state=on]:bg-transparent data-[state=on]:font-medium data-[state=on]:text-[#00bc7d] data-[state=on]:shadow-none"
              >
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div
            className={`relative ml-auto flex h-9 items-center overflow-hidden rounded-full border bg-card transition-[width] duration-300 ease-out ${
              searchExpanded ? "w-full sm:w-64" : "w-9"
            }`}
          >
            <Search
              className={`pointer-events-none absolute size-3.5 text-muted-foreground transition-all duration-300 ${
                searchExpanded ? "left-3" : "left-1/2 -translate-x-1/2"
              }`}
              strokeWidth={1.5}
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                if (!query.trim()) setSearchOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  setSearchOpen(false);
                  searchRef.current?.blur();
                }
              }}
              placeholder="搜索文章…"
              aria-label="搜索文章"
              className={`h-full w-full bg-transparent pr-4 pl-9 text-sm outline-none ${
                searchExpanded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        <div
          className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_15rem]"
          style={{ "--blur-delay": "0.3s" } as React.CSSProperties}
        >
          <div className="min-w-0 space-y-3 animate-blur-in">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
                <FileText className="size-8 opacity-40" strokeWidth={1.5} />
                <p className="text-sm">
                  {posts.length === 0 ? "还没有文章" : "没有找到匹配的文章"}
                </p>
              </div>
            ) : (
              filtered.map((post) => (
                <article
                  key={post.slug}
                  id={`post-${post.slug}`}
                  className="scroll-mt-20 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/50"
                >
                  <h2 className="font-serif-song font-semibold text-xl leading-8 tracking-tight sm:text-2xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-[#00bc7d]"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {post.description}
                  </p>
                  <span className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
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
                  </span>
                </article>
              ))
            )}
          </div>

          <aside className="hidden space-y-4 lg:sticky lg:top-20 lg:block">
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
                <span className="relative grid size-3.5 place-items-center">
                  {/* SF Symbols 风格切换：旧图标带模糊缩小弹出，新图标弹簧落位 */}
                  <AnimatePresence initial={false}>
                    <motion.span
                      key={copied ? "check" : "copy"}
                      initial={{ scale: 0.4, opacity: 0, filter: "blur(3px)" }}
                      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                      exit={{ scale: 0.4, opacity: 0, filter: "blur(3px)" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="col-start-1 row-start-1 grid place-items-center"
                    >
                      {copied ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <Copy className="size-3.5" aria-hidden />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            </section>
            <HitokotoCard />
            <BlogBadges />
          </aside>
        </div>
      </main>
    </>
  );
}
