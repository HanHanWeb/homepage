"use client";

import { useEffect, useRef, useState } from "react";

type BgKey = "default" | "paper" | "eye" | "kraft" | "ink";

// feTurbulence 噪点，叠在底色上模拟纸张纤维
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E";

const BGS: {
  key: BgKey;
  label: string;
  light: string;
  dark: string;
  grain?: boolean;
}[] = [
  { key: "default", label: "默认", light: "", dark: "" },
  { key: "paper", label: "纸质", light: "#f5f0e6", dark: "#1e1b16", grain: true },
  { key: "eye", label: "护眼", light: "#e3ede3", dark: "#16201a" },
  { key: "kraft", label: "牛皮", light: "#efe3ca", dark: "#272017", grain: true },
  { key: "ink", label: "墨蓝", light: "#e8edf4", dark: "#141824" },
];

const STORAGE_KEY = "post-bg";

export function ReadingBgPicker() {
  const [bg, setBg] = useState<BgKey>("default");
  const [dark, setDark] = useState(false);
  const keyRef = useRef<BgKey>("default");

  const apply = (key: BgKey) => {
    const conf = BGS.find((b) => b.key === key);
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    if (!conf || key === "default") {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
      return;
    }
    document.body.style.backgroundColor = isDark ? conf.dark : conf.light;
    document.body.style.backgroundImage = conf.grain ? `url("${NOISE}")` : "";
  };

  const choose = (key: BgKey) => {
    keyRef.current = key;
    setBg(key);
    localStorage.setItem(STORAGE_KEY, key);
    apply(key);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as BgKey | null;
    if (saved && BGS.some((b) => b.key === saved)) {
      keyRef.current = saved;
      setBg(saved);
      apply(saved);
    }
    // 切换深浅色主题时按新主题重新着色
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
      apply(keyRef.current);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      observer.disconnect();
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-sm font-medium">页面背景</p>
        <span className="text-[11px] text-muted-foreground">
          {BGS.find((b) => b.key === bg)?.label}
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        {BGS.map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() => choose(b.key)}
            aria-label={`页面背景：${b.label}`}
            aria-pressed={bg === b.key}
            title={b.label}
            className={`h-6 w-6 rounded-md border transition-all ${
              bg === b.key
                ? "border-[#00bc7d] ring-2 ring-[#00bc7d]/25"
                : "border-border hover:scale-105"
            }`}
            style={{
              background:
                b.key === "default"
                  ? "var(--background)"
                  : dark
                    ? b.dark
                    : b.light,
            }}
          >
            {b.key === "default" && (
              <span
                aria-hidden
                className="mx-auto mt-[9px] block h-px w-3.5 -rotate-45 bg-muted-foreground/50"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
