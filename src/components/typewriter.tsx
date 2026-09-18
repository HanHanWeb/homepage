"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TypewriterProps {
  phrases: readonly string[];
  className?: string;
  caretClassName?: string;
  /** 每个字符的打字间隔（ms） */
  typeMs?: number;
  /** 每个字符的删除间隔（ms） */
  deleteMs?: number;
  /** 整句打完后的停顿（ms） */
  holdMs?: number;
  /** 首轮首字符前的延迟（ms） */
  startDelay?: number;
}

/** 打字机标题：逐字打出 → 停顿 → 逐字删除 → 下一句，循环播放 */
export function Typewriter({
  phrases,
  className,
  caretClassName,
  typeMs = 55,
  deleteMs = 30,
  holdMs = 2400,
  startDelay = 0,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setIndex(0);
    setCount(0);
  }, [phrases]);

  useEffect(() => {
    if (phrases.length === 0) return;
    const phrase = phrases[index];
    let timer: ReturnType<typeof setTimeout>;

    if (count < phrase.length) {
      // 打字中：首字符受 startDelay 控制（与整页入场编排对齐），其余匀速
      const delay = count === 0 && index === 0 ? startDelay : typeMs;
      timer = setTimeout(() => setCount((c) => c + 1), delay);
    } else if (count === phrase.length) {
      // 整句停留 holdMs 后开始删除
      timer = setTimeout(() => setCount((c) => c - 1), holdMs);
    } else {
      // 删完切下一句（首句重复时沿用 startDelay，形成一轮的停顿）
      if (count === 0) {
        setIndex((i) => (i + 1) % phrases.length);
        return;
      }
      timer = setTimeout(() => setCount((c) => c - 1), deleteMs);
    }

    return () => clearTimeout(timer);
  }, [phrases, index, count, typeMs, deleteMs, holdMs, startDelay]);

  return (
    <span className={className}>
      <span aria-hidden>{phrases[index]?.slice(0, count)}</span>
      <span
        aria-hidden
        className={cn(
          "type-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.08em] bg-foreground",
          caretClassName,
        )}
      />
    </span>
  );
}
