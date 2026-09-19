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
];

const STORAGE_KEY = "post-bg";

// 同页可能有桌面侧栏与抽屉两个实例，最后一个卸载时才清理全局背景
let instanceCount = 0;

// 主题切换观察器全局共享一份，所有实例统一响应
const watchers = new Set<() => void>();
let themeObserver: MutationObserver | null = null;

function ensureThemeObserver() {
  if (themeObserver) return;
  themeObserver = new MutationObserver(() => {
    watchers.forEach((fn) => fn());
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

function releaseThemeObserver() {
  if (watchers.size === 0 && themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
}

function clearBodyBg() {
  document.body.style.backgroundColor = "";
  document.body.style.backgroundImage = "";
  document.documentElement.style.backgroundColor = "";
}

/** 应用背景并返回当前是否深色主题（供色块预览同步） */
function applyBg(key: BgKey): boolean {
  const conf = BGS.find((b) => b.key === key);
  const isDark = document.documentElement.classList.contains("dark");
  if (!conf || key === "default") {
    clearBodyBg();
    return isDark;
  }
  const color = isDark ? conf.dark : conf.light;
  // 同步设到 html，避免 iOS 橡皮筋回弹露出默认底色
  document.body.style.backgroundColor = color;
  document.body.style.backgroundImage = conf.grain ? `url("${NOISE}")` : "";
  document.documentElement.style.backgroundColor = color;
  return isDark;
}

export function ReadingBgPicker({ onSelect }: { onSelect?: () => void }) {
  const [bg, setBg] = useState<BgKey>("default");
  const [dark, setDark] = useState(false);
  const keyRef = useRef<BgKey>("default");

  const choose = (key: BgKey) => {
    keyRef.current = key;
    setBg(key);
    localStorage.setItem(STORAGE_KEY, key);
    setDark(applyBg(key));
    onSelect?.();
  };

  useEffect(() => {
    instanceCount += 1;
    ensureThemeObserver();
    const onThemeChange = () => {
      setDark(applyBg(keyRef.current));
    };
    watchers.add(onThemeChange);

    const saved = localStorage.getItem(STORAGE_KEY) as BgKey | null;
    if (saved && BGS.some((b) => b.key === saved)) {
      keyRef.current = saved;
      setBg(saved);
      setDark(applyBg(saved));
    } else {
      setDark(document.documentElement.classList.contains("dark"));
    }

    return () => {
      watchers.delete(onThemeChange);
      instanceCount -= 1;
      releaseThemeObserver();
      if (instanceCount === 0) clearBodyBg();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-sm font-medium">页面背景</p>
        <div className="flex items-center gap-2">
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
                  b.key === "default" ? "var(--background)" : dark ? b.dark : b.light,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
