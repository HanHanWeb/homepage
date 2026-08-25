"use client";

import { GithubIcon } from "@/components/icons";
import { InstallBadge } from "@/components/install-badge";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TiltCard } from "@/components/ui/tilt-card";
import { useLanguage } from "@/components/language-provider";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal";
import { TextAnimate } from "@/registry/magicui/text-animate";

export function Hero() {
  const { t } = useLanguage();
  const TERMINAL_LINES: Array<{ kind: "cmd" | "out"; text: string; at: number }> = [
    { kind: "cmd", text: t.hero.terminal.whoami, at: 1150 },
    { kind: "out", text: t.hero.terminal.han, at: 1700 },
    { kind: "cmd", text: t.hero.terminal.catBio, at: 2150 },
    { kind: "out", text: t.hero.terminal.bio1, at: 2900 },
    { kind: "out", text: t.hero.terminal.bio2, at: 3350 },
    { kind: "cmd", text: t.hero.terminal.lsSkills, at: 3800 },
    { kind: "out", text: t.hero.terminal.lsOutput, at: 4700 },
    { kind: "cmd", text: t.hero.terminal.curl, at: 5150 },
  ];

  return (
    <section id="intro" className="flex flex-col pb-10 mt-20">
      <div className="flex flex-col items-center gap-10 sm:grid sm:grid-cols-2 sm:items-center">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <InstallBadge className="w-fit animate-blur-in" />

          <TextAnimate
            animation="blurInUp"
            as="h1"
            by="character"
            delay={0.4}
            duration={0.5}
            startOnView={false}
            className="font-serif-sc mt-4 text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            {t.hero.title}
          </TextAnimate>

          <p
            className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base animate-blur-in"
            style={{ "--blur-delay": "0.6s" } as React.CSSProperties}
          >
            {t.hero.description}
          </p>

          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-blur-in sm:justify-start"
            style={{ "--blur-delay": "0.85s" } as React.CSSProperties}
          >
            <ShimmerButton
              href="#about"
              background="rgba(0, 0, 0, 1)"
              className="h-10 shadow-xl"
            >
              <span className="text-sm font-medium text-white">{t.hero.ctaAbout}</span>
            </ShimmerButton>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-10 rounded-full px-5"
            >
              <a
                href="https://github.com/HanHanWeb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="size-4" />
                {t.hero.ctaGithub}
              </a>
            </Button>
          </div>
        </div>

        <div
          className="w-full animate-blur-in"
          style={{ "--blur-delay": "1.1s" } as React.CSSProperties}
        >
          <TiltCard>
            <Terminal
              sequence={false}
              className="bg-card text-sm shadow-lg [&_code]:font-mono [&_pre]:font-mono"
            >
              {TERMINAL_LINES.map((line, i) =>
                line.kind === "cmd" ? (
                  <AnimatedSpan
                    key={i}
                    className="flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: line.at / 1000,
                      ease: "easeOut",
                    }}
                  >
                    <span className="text-green-500">❯</span>
                    <TypingAnimation
                      delay={line.at + 150}
                      duration={50}
                      startOnView={false}
                    >
                      {line.text}
                    </TypingAnimation>
                  </AnimatedSpan>
                ) : (
                  <AnimatedSpan
                    key={i}
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: line.at / 1000,
                      ease: "easeOut",
                    }}
                  >
                    {line.text}
                  </AnimatedSpan>
                ),
              )}
            </Terminal>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
