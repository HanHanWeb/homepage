"use client";

import { ArrowUpRight, Link2 } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { FRIENDS } from "@/lib/friends";

export function Friends() {
  const { t } = useLanguage();
  return (
    <section id="friends" className="scroll-mt-6 py-10">
      <Reveal delay="3.5s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc relative inline-block text-3xl tracking-tight sm:text-4xl">
            {t.friends.title}
            <span className="absolute -top-0.5 -right-2.5 size-2 rounded-full bg-[#00bc7d]" aria-hidden />
          </h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#FRIENDS</span>
        </div>
      </Reveal>

      <Reveal delay="3.65s" direction="down">
        {FRIENDS.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {FRIENDS.map((friend) => (
              <a
                key={friend.name}
                href={friend.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
              >
                {friend.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    loading="lazy"
                    className="size-10 shrink-0 rounded-full border bg-card object-cover"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card">
                    <Link2 className="size-4" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium leading-5">{friend.name}</span>
                  <span className="block truncate text-xs leading-5 text-muted-foreground">{friend.description}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t.friends.empty}
          </div>
        )}
      </Reveal>
    </section>
  );
}
