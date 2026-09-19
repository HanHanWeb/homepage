"use client";

import { useEffect, useState } from "react";

const FALLBACK = { text: "把喜欢的事做到能被人看见的程度。", from: "Han" };

type Quote = { text: string; from: string };

// 会话内缓存 30 分钟，来回切页面不重复请求
const CACHE_KEY = "hitokoto-cache";
const CACHE_TTL = 30 * 60 * 1000;

function readCache(): Quote | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { quote: Quote; ts: number };
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return parsed.quote;
  } catch {
    return null;
  }
}

function writeCache(quote: Quote) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ quote, ts: Date.now() }),
    );
  } catch {
    // 存储不可用时忽略
  }
}

/** 一言卡：优先请求 hitokoto API，失败时回退到内置句子 */
export function HitokotoCard() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setQuote(cached);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    fetch("https://v1.hitokoto.cn/?c=k&max_length=30", {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (typeof data?.hitokoto === "string" && data.hitokoto) {
          const quote = {
            text: data.hitokoto,
            from: data.from_who || data.from || "一言",
          };
          setQuote(quote);
          writeCache(quote);
        } else {
          setQuote(FALLBACK);
        }
      })
      .catch(() => {
        // 网络不可用或超时则展示内置句子
        setQuote(FALLBACK);
      });
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-3 pb-1.5">
        <p className="min-w-0 flex-1 text-sm font-medium">一言</p>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60">
          #HITOKOTO
        </span>
      </div>
      {quote ? (
        <>
          <p className="font-serif-song text-[13.5px] leading-relaxed text-foreground/90">
            「{quote.text}」
          </p>
          <p className="mt-1.5 text-right text-xs text-muted-foreground">
            —— {quote.from}
          </p>
        </>
      ) : (
        <div aria-hidden className="animate-pulse">
          <div className="h-3.5 w-full rounded bg-muted" />
          <div className="mt-2 h-3.5 w-3/5 rounded bg-muted" />
        </div>
      )}
    </section>
  );
}
