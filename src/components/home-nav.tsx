"use client";

import { Monitor, Moon, MoreVertical, Search, Sun } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";

const navLink = "inline-flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
        <ProgressiveBlur position="top" height="10vh" />
      </div>
      <header className="fixed inset-x-0 top-0 z-[47] bg-linear-to-b from-background/80 to-transparent">
        <nav aria-label={zh ? "主导航" : "Main navigation"} className="site-container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" aria-label={zh ? "Han · 首页" : "Han · Home"} className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Image src="/icon.png" alt="" width={28} height={28} className="size-7 rounded-lg" />
              Han
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              {items.map((item) => (
                <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={cn(navLink, isActive(item.href) && "text-foreground")}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" aria-label={zh ? "搜索与快捷操作" : "Search and quick actions"} aria-haspopup="dialog" onClick={() => document.dispatchEvent(new Event("open-command-palette"))} className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-full nav-glass px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-36 sm:justify-start">
              <Search aria-hidden className="size-4" />
              <span className="hidden sm:inline">{zh ? "搜索" : "Search"}</span>
              <kbd aria-hidden className="ml-auto hidden pl-1 font-sans text-xs text-muted-foreground/70 sm:inline-flex">Ctrl K</kbd>
            </button>
              <DropdownMenu>
                <DropdownMenuTrigger aria-label={zh ? "外观与语言设置" : "Appearance and language settings"} className="flex size-9 shrink-0 items-center justify-center rounded-full nav-glass text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <MoreVertical aria-hidden className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={10} className="w-60 min-w-0 p-2">
                  <DropdownMenuGroup className="sm:hidden">
                    {items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="min-h-8">{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="sm:hidden" />
                  <div className="flex min-h-11 items-center justify-between gap-3 px-2">
                    <DropdownMenuLabel className="p-0">{zh ? "外观" : "Appearance"}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      aria-label={zh ? "外观" : "Appearance"}
                      value={theme ?? "system"}
                      onValueChange={setTheme}
                      className="flex items-center gap-0.5 rounded-full bg-muted p-0.5"
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
                          className="size-8 justify-center rounded-full p-0 text-muted-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden"
                        >
                          <option.icon aria-hidden />
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </div>
                  <DropdownMenuSeparator className="mx-2 my-2" />
                  <div className="flex min-h-11 items-center justify-between gap-3 px-2">
                    <DropdownMenuLabel className="p-0">{zh ? "语言" : "Language"}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup aria-label={zh ? "语言" : "Language"} value={locale} onValueChange={(value) => {
                      if (value === "zh" || value === "en") setLocale(value);
                    }} className="flex items-center gap-0.5 rounded-full bg-muted p-0.5">
                      <DropdownMenuRadioItem value="zh" onSelect={(event) => event.preventDefault()} className="h-8 justify-center rounded-full px-3 py-0 text-xs text-muted-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden">中文</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="en" onSelect={(event) => event.preventDefault()} className="h-8 justify-center rounded-full px-3 py-0 text-xs text-muted-foreground data-[state=checked]:bg-background data-[state=checked]:text-foreground data-[state=checked]:shadow-sm [&_[data-slot=dropdown-menu-radio-item-indicator]]:hidden">English</DropdownMenuRadioItem>
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
