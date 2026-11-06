import type { ReactNode } from "react";

import { BackToTop } from "@/components/back-to-top";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { HomeNav } from "@/components/home-nav";
import { BottomGlow } from "@/components/ui/bottom-glow";

export function ContentPage({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeNav />
      <CursorSpotlight className="site-container home-content relative z-10 flex flex-1 flex-col pt-24 pb-16">
        {children}
      </CursorSpotlight>
      <BackToTop />
      <BottomGlow />
    </>
  );
}
