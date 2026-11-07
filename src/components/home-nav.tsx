"use client";

import { Menu, Monitor, Moon, Search, SlidersHorizontal, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

import { useLanguage } from "@/components/language-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";

const navLink = "inline-flex min-h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";
const navOffset = "0.5rem";
const navHeight = "3.5rem";
const navBlurHeight = `calc(${navOffset} + max(10vh, ${navHeight} + 1.5rem) + 0.5rem)`;
const settingsRow = "flex min-h-14 items-center justify-between gap-3 px-2.5 py-2";
const settingsSegments = "flex shrink-0 items-center gap-0.5 rounded-xl bg-muted p-1";
const settingsOption = "h-8 cursor-pointer justify-center rounded-lg border border-transparent py-0 text-sm font-normal text-muted-foreground data-[state=checked]:border-border data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-xs [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden";

export function HomeNav({ menu }: { menu?: ReactNode }) {
  const { locale, t, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const zh = locale === "zh";
  const pathname = usePathname();
  const items = [
    { href: "/", label: zh ? "首页" : "Home" },
    // 博客暂时停用。
    // { href: "/blog", label: t.blog.title },
    { href: "/projects", label: t.projects.title },
    { href: "/friends", label: t.friends.title },
  ];
  const isActive = (href: string) => href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <ProgressiveBlur position="top" height={navBlurHeight} />
      </div>
      <header style={{ top: navOffset }} className="fixed inset-x-0 z-[47]">
        <nav aria-label={zh ? "主导航" : "Main navigation"} style={{ height: navHeight }} className="site-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" aria-label={zh ? "Han · 首页" : "Han · Home"} className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Image src="/icon.png" alt="" width={28} height={28} className="size-7 rounded-lg" />
              Han
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              {items.map((item) => (
                <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={cn(navLink, isActive(item.href) && "bg-muted/70 text-foreground")}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" aria-label={zh ? "搜索与快捷操作" : "Search and quick actions"} aria-haspopup="dialog" onClick={() => document.dispatchEvent(new Event("open-command-palette"))} className="inline-flex size-9 shrink-0 items-center justify-center gap-2 rounded-full nav-glass p-0 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto sm:min-w-36 sm:justify-start sm:px-3">
              <Search aria-hidden className="size-4" />
              <span className="hidden sm:inline">{zh ? "搜索" : "Search"}</span>
              <kbd aria-hidden className="ml-auto hidden pl-1 font-sans text-xs text-muted-foreground/70 sm:inline-flex">Ctrl K</kbd>
            </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex size-9 shrink-0 items-center justify-center rounded-full nav-glass text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Menu aria-hidden className="size-[18px] sm:hidden" />
                  <SlidersHorizontal aria-hidden className="hidden size-[18px] sm:block" />
                  <span className="sr-only sm:hidden">{zh ? "导航与设置" : "Navigation and settings"}</span>
                  <span className="sr-only hidden sm:block">{zh ? "外观与语言设置" : "Appearance and language settings"}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  collisionPadding={12}
                  className="w-[min(22rem,calc(100vw-1.5rem))] min-w-0 rounded-2xl border border-border bg-popover p-1.5 shadow-lg ring-0"
                >
                  <DropdownMenuGroup aria-label={zh ? "快速导航" : "Quick navigation"} className="space-y-0.5 border-b border-border/70 pb-1.5 sm:hidden">
                    {items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="min-h-10 rounded-lg px-2.5 aria-[current=page]:bg-muted aria-[current=page]:font-medium">{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <div className={cn(settingsRow, "border-b border-border/70")}>
                    <DropdownMenuLabel className="p-0 text-sm font-normal">{zh ? "外观" : "Appearance"}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      aria-label={zh ? "外观" : "Appearance"}
                      value={theme ?? "system"}
                      onValueChange={setTheme}
                      className={settingsSegments}
                    >
                      {[
                        { value: "light", icon: Sun, label: zh ? "浅色" : "Light" },
                        { value: "dark", icon: Moon, label: zh ? "深色" : "Dark" },
                        { value: "system", icon: Monitor, label: zh ? "跟随系统" : "System" },
                      ].map((option) => (
                        <DropdownMenuRadioItem
                          key={option.value}
                          value={option.value}
                          aria-label={option.label}
                          title={option.label}
                          onSelect={(event) => event.preventDefault()}
                          className={cn(settingsOption, "w-9 px-0")}
                        >
                          <option.icon aria-hidden />
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </div>
                  <div className={settingsRow}>
                    <DropdownMenuLabel className="p-0 text-sm font-normal">{zh ? "语言" : "Language"}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup aria-label={zh ? "语言" : "Language"} value={locale} onValueChange={(value) => {
                      if (value === "zh" || value === "en") setLocale(value);
                    }} className={settingsSegments}>
                      <DropdownMenuRadioItem value="zh" onSelect={(event) => event.preventDefault()} className={cn(settingsOption, "px-3")}>中文</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="en" onSelect={(event) => event.preventDefault()} className={cn(settingsOption, "px-3")}>English</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </nav>
      </header>
      {menu && <div className="fixed bottom-6 left-6 z-40 lg:hidden">{menu}</div>}
    </>
  );
}
