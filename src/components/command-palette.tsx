"use client";

import {
  BookOpen,
  Copy,
  FolderGit2,
  Check,
  Languages,
  Mail,
  Moon,
  Sparkles,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useLanguage } from "@/components/language-provider";
import { navigateWithTransition } from "@/components/route-transition";

const EMAIL = "im@hhan.me";

export function CommandPalette() {
  const { t, toggle: toggleLocale } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const jumpTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 等面板退出动画播完再截图，避免过渡快照里残留半关闭的面板
  const openBlog = () => {
    setOpen(false);
    setTimeout(() => navigateWithTransition("/blog"), 200);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      setOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setOpen(false);
  };

  const navItems = [
    { id: "about", icon: User, label: t.about.title },
    { id: "focus", icon: Target, label: t.services.title },
    { id: "projects", icon: FolderGit2, label: t.projects.title },
    { id: "contributions", icon: Trophy, label: t.contributions.title },
    { id: "contact", icon: Mail, label: t.contact.title },
    { id: "blog", icon: BookOpen, label: "博客", href: "/blog" },
  ];

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description={t.cmdk.placeholder}
    >
      <Command>
        <CommandInput placeholder={t.cmdk.placeholder} />
        <CommandList>
        <CommandEmpty>{t.cmdk.empty}</CommandEmpty>
        <CommandGroup heading={t.cmdk.nav}>
          {navItems.map((item) => (
            <CommandItem
              key={item.id}
              value={item.label}
              onSelect={() => ("href" in item && item.href ? openBlog() : jumpTo(item.id))}
            >
              <item.icon />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t.cmdk.actions}>
          <CommandItem value={t.cmdk.copyEmail} onSelect={copyEmail}>
            {copied ? <Check className="text-[#00bc7d]" /> : <Copy />}
            {copied ? t.cmdk.emailCopied : `${t.cmdk.copyEmail} · ${EMAIL}`}
          </CommandItem>
          <CommandItem value={t.cmdk.toggleTheme} onSelect={toggleTheme}>
            <Moon />
            {t.cmdk.toggleTheme}
          </CommandItem>
          <CommandItem value={t.cmdk.toggleLang} onSelect={() => { toggleLocale(); setOpen(false); }}>
            <Languages />
            {t.cmdk.toggleLang}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t.cmdk.links}>
          <CommandItem
            value="GitHub"
            onSelect={() => {
              setOpen(false);
              window.open("https://github.com/HanHanWeb", "_blank", "noopener,noreferrer");
            }}
          >
            <Sparkles />
            GitHub
          </CommandItem>
        </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
