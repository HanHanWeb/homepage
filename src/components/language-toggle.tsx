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
      <span aria-hidden className="block h-4 overflow-hidden">
        <span
          className={cn(
            "flex flex-col transition-transform duration-300 ease-in-out",
            locale === "zh" ? "-translate-y-1/2" : "translate-y-0",
          )}
        >
          <span className="flex h-4 items-center justify-center leading-4">中</span>
          <span className="flex h-4 items-center justify-center leading-4">EN</span>
        </span>
      </span>
    </button>
  );
}
