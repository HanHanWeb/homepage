import type { SimpleIcon } from "simple-icons";

import { cn } from "@/lib/utils";

/**
 * simple-icons 品牌图标渲染(纯色版)。
 * 统一使用 currentColor 跟随文字颜色,深浅色主题下风格一致。
 */
export function BrandIcon({
  icon,
  className,
}: {
  icon: SimpleIcon;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-3 shrink-0", className)}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}
