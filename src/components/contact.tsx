"use client";

import { ArrowUpRight, Mail } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BrandIcon } from "@/components/ui/brand-icon";
import { SOCIALS } from "@/lib/socials";

export function Contact() {
  const { t, locale } = useLanguage();
  return (
    <section id="contact" className="scroll-mt-6 py-10">
      <Reveal delay="3.2s" direction="down">
        <SectionHeading title={t.contact.title} tag="#CONTACT" />
      </Reveal>

      <Reveal delay="3.35s" direction="down">
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-card">
                {social.icon ? (
                  <BrandIcon icon={social.icon} className="size-4" />
                ) : (
                  <Mail className="size-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium leading-5">
                  {social.name === "邮箱" && locale === "en" ? "Email" : social.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{social.handle}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
