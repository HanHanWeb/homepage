"use client";

import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className={cn(
        "flex size-11 items-center justify-center rounded-full border bg-card/80 text-xs font-medium shadow-sm backdrop-blur transition-colors hover:bg-card",
        className,
      )}
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  );
}
