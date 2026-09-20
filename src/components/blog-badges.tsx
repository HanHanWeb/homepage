import { LicenseCard } from "@/components/license-card";

/** 版权与开往徽章行：在博客所有页面的侧边栏展示 */
export function BlogBadges() {
  return (
    <div className="flex items-center gap-2.5">
      <LicenseCard />
      <a
        href="https://www.travellings.cn/go.html"
        target="_blank"
        rel="noopener noreferrer"
        title="开往 · 去往下一个博客"
        className="inline-flex h-4 w-fit items-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/travellings-logo.svg"
          alt="开往 · Travellings"
          className="h-4 w-auto"
          loading="lazy"
        />
      </a>
    </div>
  );
}
