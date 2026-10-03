"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/components/language-provider";

/** 首页板块目录：固定于左上角，滚动高亮当前板块，点击平滑滚动（窄屏隐藏） */
export function HomeToc() {
  const { t } = useLanguage();
  const items = [
    { id: "about", label: t.about.title },
    { id: "focus", label: t.services.title },
    { id: "blog", label: t.blog.title },
    { id: "projects", label: t.projects.title },
    { id: "contributions", label: t.contributions.title },
    { id: "contact", label: t.contact.title },
    { id: "friends", label: t.friends.title },
  ];
  const [active, setActive] = useState(items[0].id);

  // 滚动时高亮视口顶附近的板块；不依赖 rAF（后台/节流时会被暂停导致失效）
  useEffect(() => {
    const update = () => {
      let current = items[0].id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 130) {
          current = id;
        }
      }
      // 滚到底时末尾板块顶部到不了视口上方阈值，直接高亮最后一项
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      ) {
        current = items[items.length - 1].id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const choose = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="TOC"
      className="fixed top-24 left-6 z-40 hidden max-w-40 xl:block"
    >
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
        #TOC
      </p>
      <ul className="mt-2 space-y-1 border-l">
        {items.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => choose(id)}
              className={`block py-0.5 pl-3 text-left text-xs transition-colors ${
                active === id
                  ? "font-medium text-[#00bc7d]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
