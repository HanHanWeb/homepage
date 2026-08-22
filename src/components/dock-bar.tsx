"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { SOCIALS } from "@/lib/socials";
import { Dock, DockIcon } from "@/registry/magicui/dock";

/** 底部 Dock 栏（Magic UI 官方原生样式）：联系方式 + 深浅色切换（最右） */
export function DockBar() {
  const { setTheme } = useTheme();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-4 animate-dock-in"
      style={{ "--blur-delay": "1.2s" } as React.CSSProperties}
    >
      <Dock direction="middle" className="pointer-events-auto">
        {/* 联系方式 */}
        {SOCIALS.map((social) => (
          <DockIcon key={social.name}>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>{social.name}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}

        <div className="h-full w-px shrink-0 bg-border" />

        {/* 深浅色切换（最右） */}
        <DockIcon>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="切换主题"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "relative size-12 rounded-full",
                    )}
                  >
                    <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>切换主题</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="top" align="center">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun /> Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon /> Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DockIcon>
      </Dock>
    </div>
  );
}
