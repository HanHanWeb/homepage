"use client";

import { useEffect, useState } from "react";

const FALLBACK = { text: "把喜欢的事做到能被人看见的程度。", from: "Han" };

type Quote = { text: string; from: string };

/** 一言卡：优先请求 hitokoto API，失败时回退到内置句子 */
export function HitokotoCard() {
  const [quote, setQuote] = useState<Quote>(FALLBACK);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);
    fetch("https://v1.hitokoto.cn/?max_length=30", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (typeof data?.hitokoto === "string" && data.hitokoto) {
          setQuote({
            text: data.hitokoto,
            from: data.from_who || data.from || "一言",
          });
        }
      })
      .catch(() => {
        // 网络不可用或超时则保留内置句子
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
      <p className="font-serif-sc text-[13.5px] leading-relaxed text-foreground/90">
        「{quote.text}」
      </p>
      <p className="mt-1.5 text-right text-xs text-muted-foreground">
        —— {quote.from}
      </p>
    </section>
  );
}
