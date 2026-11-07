"use client";

import { ArrowUpRight, Mail, QrCode } from "lucide-react";
import Image from "next/image";
import { siWechat } from "simple-icons";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BrandIcon } from "@/components/ui/brand-icon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
              className="cursor-spotlight group flex min-w-0 items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="cursor-spotlight flex size-8 shrink-0 items-center justify-center rounded-full border bg-card">
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
              <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </a>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="cursor-spotlight group flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span className="cursor-spotlight flex size-8 shrink-0 items-center justify-center rounded-full border bg-card">
                  <BrandIcon icon={siWechat} className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-5">{locale === "en" ? "WeChat Official Account" : "微信公众号"}</span>
                  <span className="block truncate text-xs text-muted-foreground">ATNote</span>
                </span>
                <QrCode aria-hidden className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="pr-8">
                <DialogTitle>ATNote</DialogTitle>
                <DialogDescription>{locale === "en" ? "Scan with WeChat to follow my official account." : "使用微信扫一扫，关注我的公众号。"}</DialogDescription>
              </DialogHeader>
              <div className="mx-auto w-full max-w-72 overflow-hidden rounded-lg bg-white p-3">
                <Image src="/atnote-qrcode.png" alt={locale === "en" ? "ATNote WeChat official account QR code" : "ATNote 微信公众号二维码"} width={400} height={400} unoptimized className="block h-auto w-full" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Reveal>
    </section>
  );
}
