import type { ReactNode } from "react";

import { CursorSpotlight } from "@/components/cursor-spotlight";

/** 内容页外壳；导航与回到顶部由根布局统一渲染，避免被页面转场的 transform 带走。 */
export function ContentPage({ children }: { children: ReactNode }) {
  return (
    <CursorSpotlight className="site-container home-content relative z-10 flex flex-1 flex-col pt-24 pb-16">
      {children}
    </CursorSpotlight>
  );
}
