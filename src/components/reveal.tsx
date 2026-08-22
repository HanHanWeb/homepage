"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

// SSR 不隐藏内容；客户端水合时在首帧绘制前隐藏，避免内容先闪现再消失
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 滚动进入视口时触发模糊浮现（纯 CSS 动画 + IntersectionObserver）。
 * 无 JS 环境内容正常显示，水合后立即按视口状态接管。
 */
export function Reveal({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [activeDelay, setActiveDelay] = useState<string | undefined>(delay);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 水合后先隐藏，再等 IntersectionObserver 放行
    setPending(true);

    const mountedAt = performance.now();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 首屏加载即可见：沿用 delay 延续全局入场序列；
          // 之后滚动才进入视口：不排队，立即出现
          if (performance.now() - mountedAt > 300) {
            setActiveDelay("0s");
          }
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        pending && "blur-in-pending",
        revealed && "is-blur-in",
        className,
      )}
      style={{ "--blur-delay": activeDelay } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
