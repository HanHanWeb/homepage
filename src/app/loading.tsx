"use client";

import { useLanguage } from "@/components/language-provider";
import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  const { locale } = useLanguage();

  return (
    <div className="grid min-h-dvh place-items-center">
      <Spinner label={locale === "en" ? "Loading page" : "正在加载页面"} className="size-8 text-emerald-600 dark:text-emerald-400" />
    </div>
  );
}
