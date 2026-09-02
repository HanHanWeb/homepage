import type { SimpleIcon } from "simple-icons";

import { cn } from "@/lib/utils";

/** 本地自定义品牌图标(可带非 24x24 的 viewBox,如官方 128 网格 svg) */
export type BrandIconDef = { path: string; viewBox?: string };

/**
 * 品牌图标渲染(纯色版)。
 * 兼容 simple-icons(24x24)与本地自定义图标;统一使用 currentColor 跟随文字颜色。
 */
export function BrandIcon({
  icon,
  className,
}: {
  icon: SimpleIcon | BrandIconDef;
  className?: string;
}) {
  const viewBox = "viewBox" in icon && icon.viewBox ? icon.viewBox : "0 0 24 24";
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      className={cn("size-3 shrink-0", className)}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}
