import type { Metadata } from "next";

import { ShimmerButton } from "@/components/ui/shimmer-button";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

const OOPS = "Oops!";

export default function NotFound() {
  return (
    <main className="relative z-10 mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      {/* Oops! 大字：Hero 标题同款逐字符浮现（见 globals.css 的 .hero-char） */}
      <h1
        aria-label={OOPS}
        className="font-serif-sc text-7xl font-semibold tracking-tight sm:text-8xl"
      >
        <span className="sr-only">{OOPS}</span>
        {OOPS.split("").map((ch, i) => (
          <span
            key={`char-${i}`}
            aria-hidden
            className="hero-char"
            style={
              {
                "--char-delay": `${(0.4 + i * (0.5 / OOPS.length)).toFixed(3)}s`,
              } as React.CSSProperties
            }
          >
            {ch}
          </span>
        ))}
      </h1>

      <p
        className="animate-blur-in mt-6 max-w-md text-sm leading-6 text-muted-foreground sm:text-base"
        style={{ "--blur-delay": "0.75s" } as React.CSSProperties}
      >
        页面不存在
      </p>

      <div
        className="animate-blur-in mt-8 flex flex-wrap items-center justify-center gap-3"
        style={{ "--blur-delay": "0.85s" } as React.CSSProperties}
      >
        <ShimmerButton href="/" background="rgba(0, 0, 0, 1)" className="h-10 shadow-xl">
          <span className="text-sm font-medium text-white">返回首页</span>
        </ShimmerButton>
      </div>
    </main>
  );
}
