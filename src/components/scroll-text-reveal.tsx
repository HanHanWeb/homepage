"use client";

import type { CSSProperties } from "react";

import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const segmenters = typeof Intl.Segmenter === "function" ? {
  zh: new Intl.Segmenter("zh", { granularity: "word" }),
  en: new Intl.Segmenter("en", { granularity: "word" }),
} : undefined;

function splitWords(text: string, locale: Locale) {
  if (!segmenters) return text.match(/\s+|\S+/gu) ?? [];

  const parts: string[] = [];
  for (const { segment, isWordLike } of segmenters[locale].segment(text)) {
    // Keep punctuation next to the preceding word in the same reveal step.
    if (!isWordLike && segment.trim() && parts.at(-1)?.trim()) {
      parts[parts.length - 1] += segment;
    } else {
      parts.push(segment);
    }
  }
  return parts;
}

export function ScrollTextReveal({ lines, className }: { lines: readonly string[]; className?: string }) {
  const { locale } = useLanguage();
  let wordCount = 0;
  const content = lines.map((line, lineIndex) => (
    <span key={lineIndex} className={lineIndex === 0 ? undefined : "block text-muted-foreground"}>
      {splitWords(line, locale).map((part, index) => part.trim() ? (
        <span key={index} className="scroll-text-reveal-word" style={{ "--text-reveal-index": wordCount++ } as CSSProperties}>
          {part}
        </span>
      ) : part)}
    </span>
  ));

  return (
    <p className={cn("scroll-text-reveal", className)} style={{ "--text-reveal-count": wordCount } as CSSProperties}>
      {content}
    </p>
  );
}
