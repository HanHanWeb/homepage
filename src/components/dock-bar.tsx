"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Moon, Sun } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOCIALS } from "@/lib/socials";
import { Dock, DockIcon } from "@/registry/magicui/dock";

/** 主题菜单与悬停提示(radix)按需分包;ssr:false 确保不进首屏脚本 */
const ThemeMenu = dynamic(() => import("@/components/theme-menu"), {
  ssr: false,
});
const SocialLinkWithTip = dynamic(() => import("@/components/dock-tooltip"), {
  ssr: false,
});

/** 社交链接(提示挂载前后共用同一 DOM 结构) */
export function SocialLink({ social }: { social: (typeof SOCIALS)[number] }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.name}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "size-12 rounded-full",
      )}
    >
      <social.Icon className="size-4" />
    </a>
  );
}

/** 主题切换触发按钮(常驻;分包加载期间作为占位保持不动) */
function ThemeButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      aria-label="切换主题"
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative size-12 rounded-full",
      )}
    >
      <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </button>
  );
}

/** 底部 Dock 栏（Magic UI 官方原生样式）：联系方式 + 深浅色切换（最右）
 *  radix Tooltip 与主题下拉菜单按需挂载:光标进入 Dock 装提示,点击才装菜单 */
export function DockBar() {
  const [tooltipsArmed, setTooltipsArmed] = useState(false);
  const [themeMenuMounted, setThemeMenuMounted] = useState(false);

  return (
    <div
      onPointerMove={() => setTooltipsArmed(true)}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4 animate-dock-in"
      style={{ "--blur-delay": "1.2s" } as React.CSSProperties}
    >
      <Dock direction="middle" className="pointer-events-auto">
        {/* 联系方式 */}
        {SOCIALS.map((social) => (
          <DockIcon key={social.name}>
            {tooltipsArmed ? (
              <SocialLinkWithTip social={social} />
            ) : (
              <SocialLink social={social} />
            )}
          </DockIcon>
        ))}

        <div className="h-full w-px shrink-0 bg-border" />

        {/* 深浅色切换（最右） */}
        <DockIcon>
          {themeMenuMounted ? (
            <ThemeMenu defaultOpen>
              <ThemeButton />
            </ThemeMenu>
          ) : (
            <ThemeButton onClick={() => setThemeMenuMounted(true)} />
          )}
        </DockIcon>
      </Dock>
    </div>
  );
}
