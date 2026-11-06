import type { ReactNode } from "react";

import { HomeNav } from "@/components/home-nav";

/** 博客及文章沿用站点导航；窄屏侧栏入口独立保留。 */
export function BlogNav({ menu }: { menu?: ReactNode }) {
  return <HomeNav menu={menu} />;
}
