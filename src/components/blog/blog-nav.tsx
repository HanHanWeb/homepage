"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** 博客页导航：左侧头像 + BLOG；详情页滚过文章标题后左侧替换为标题 */
export function BlogNav({ title }: { title?: string }) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (!title) return;
    const update = () => {
      const h1 = document.querySelector("article h1");
      if (!h1) return;
      // 文章标题底部滚入导航条（56px）以下时切换显示
      setPassed(h1.getBoundingClientRect().bottom <= 56);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [title]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
        <div className="relative min-w-0 flex-1">
          <Link
            href="/blog"
            aria-label="返回博客首页"
            className={`absolute inset-0 flex items-center gap-2.5 transition-all duration-300 ${
              passed ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <span className="size-7 overflow-hidden rounded-full border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon.png"
                alt=""
                className="size-full object-cover"
              />
            </span>
            <span className="font-mono text-base font-medium tracking-[0.18em]">
              BLOG
            </span>
          </Link>
          {title && (
            <span
              aria-hidden
              className={`absolute inset-0 flex items-center transition-all duration-300 ${
                passed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <span className="truncate text-base font-medium tracking-tight">
                {title}
              </span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
