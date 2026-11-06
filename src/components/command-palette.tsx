"use client";

import {
  FolderGit2,
  Languages,
  Link2,
  Mail,
  Moon,
  Sparkles,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

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

export function CommandPalette() {
  const router = useRouter();
  const { t, toggle: toggleLocale } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((value) => !value);
      }
    };
    const show = () => setOpen(true);
    document.addEventListener("open-command-palette", show);
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("open-command-palette", show);
      document.removeEventListener("keydown", down);
    };
  }, []);

  const jumpTo = (id: string) => {
    setOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const openPage = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setOpen(false);
  };

  const navItems = [
    { id: "about", icon: User, label: t.about.title },
    { id: "focus", icon: Target, label: t.services.title },
    { id: "projects", icon: FolderGit2, label: t.projects.title, href: "/projects" },
    { id: "contributions", icon: Trophy, label: t.contributions.title },
    { id: "contact", icon: Mail, label: t.contact.title },
    { id: "friends", icon: Link2, label: t.friends.title, href: "/friends" },
    // 博客暂时停用，恢复时同时启用对应路由和导航入口。
    // { id: "blog", icon: BookOpen, label: t.blog.title, href: "/blog" },
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
              onSelect={() => ("href" in item && item.href ? openPage(item.href) : jumpTo(item.id))}
            >
              <item.icon />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t.cmdk.actions}>
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
