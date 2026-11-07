"use client";

import { useInView } from "motion/react";
import dynamic from "next/dynamic";
import { useRef } from "react";

import { useLanguage } from "@/components/language-provider";
import { BottomGlow } from "@/components/ui/bottom-glow";

const BotAvatar = dynamic(() => import("bot-avatars").then((module) => module.BotAvatar), { ssr: false });

function Mascot({ kind }: { kind: "clover" | "star" }) {
  const { locale } = useLanguage();
  const en = locale === "en";
  const clover = kind === "clover";

  return (
    <div className="relative -mb-2 size-20 translate-y-3 sm:size-24">
      <BotAvatar
        type={kind}
        shading="fabric"
        size="100%"
        interactive
        jumpEvery={0}
        role="button"
        tabIndex={0}
        aria-label={clover ? (en ? "Say hello to Clover" : "和小四叶草打招呼") : (en ? "Say hello to Star" : "和小星星打招呼")}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.currentTarget.click();
          }
        }}
        className="pointer-events-auto cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      />
    </div>
  );
}

export function FooterMascots() {
  const footer = useRef<HTMLElement>(null);
  const nearViewport = useInView(footer, { once: true, margin: "320px" });

  return (
    <footer ref={footer} className="relative z-10 mt-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"><BottomGlow /></div>
      <div className="pointer-events-none -mt-16 overflow-hidden pt-16">
        <div className="site-container">
          <div className="flex h-24 items-end justify-between px-5 sm:px-12">
            {nearViewport && (
              <>
                <Mascot kind="clover" />
                <Mascot kind="star" />
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
