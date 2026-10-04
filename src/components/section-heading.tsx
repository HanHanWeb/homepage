import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

/** 分区标题行：衬线大标题 + 右侧 #TAG 标签；提供 href 时 TAG 是独立页入口 */
export function SectionHeading({
  title,
  tag,
  href,
}: {
  title: string;
  tag: string;
  href?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
        {title}
        <span className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]" aria-hidden />
      </h2>
      {href ? (
        <Link
          href={href}
          className="group flex items-center gap-0.5 text-sm font-normal tracking-widest text-muted-foreground/40 transition-colors hover:text-[#00bc7d]"
        >
          {tag}
          <ArrowUpRight
            className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={1.5}
            aria-hidden
          />
        </Link>
      ) : (
        <span className="text-sm font-normal tracking-widest text-muted-foreground/40">
          {tag}
        </span>
      )}
    </div>
  );
}
