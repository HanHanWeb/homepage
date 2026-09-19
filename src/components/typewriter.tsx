"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TypewriterProps {
  phrases: readonly string[];
  /** 打完是否循环（停顿后删除重打下一句）；false 时打完即停、隐藏光标 */
  loop?: boolean;
  className?: string;
  caretClassName?: string;
  /** 打字间隔（ms） */
  typeMs?: number;
  /** 删除间隔（ms） */
  deleteMs?: number;
  /** 整句打完后的停顿（ms） */
  holdMs?: number;
  /** 首轮首字符前的延迟（ms） */
  startDelay?: number;
}

type Phase = "typing" | "deleting";

export function Typewriter({
  phrases,
  loop = true,
  className,
  caretClassName,
  typeMs = 55,
  deleteMs = 30,
  holdMs = 2400,
  startDelay = 0,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [done, setDone] = useState(false);

  // 以内容为键做重置，避免调用方每次渲染传入新数组导致误重置
  const phrasesKey = phrases.join("\u0000");
  useEffect(() => {
    setIndex(0);
    setCount(0);
    setPhase("typing");
    setDone(false);
  }, [phrasesKey]);

  useEffect(() => {
    if (phrases.length === 0 || done) return;
    const phrase = phrases[index];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (count < phrase.length) {
        // 首字符受 startDelay 控制，其余匀速
        const delay = count === 0 && index === 0 ? startDelay : typeMs;
        timer = setTimeout(() => setCount((c) => c + 1), delay);
      } else if (loop) {
        timer = setTimeout(() => setPhase("deleting"), holdMs);
      } else {
        setDone(true);
        return;
      }
    } else if (count > 0) {
      timer = setTimeout(() => setCount((c) => c - 1), deleteMs);
    } else {
      // 删完切下一句
      setIndex((i) => (i + 1) % phrases.length);
      setPhase("typing");
      return;
    }

    return () => clearTimeout(timer);
  }, [phrases, index, count, phase, done, loop, typeMs, deleteMs, holdMs, startDelay]);

  return (
    <span className={className}>
      <span aria-hidden>{phrases[index]?.slice(0, count)}</span>
      {!done && (
        <span
          aria-hidden
          className={cn(
            "type-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.08em] bg-foreground",
            caretClassName,
          )}
        />
      )}
    </span>
  );
}
