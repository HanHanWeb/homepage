import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/socials";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/registry/magicui/terminal";
import { TextAnimate } from "@/registry/magicui/text-animate";

/** 终端脚本:cmd = 整行淡入后打字机输入,out = 整行下落出现;at 为出现延迟 ms */
const TERMINAL_LINES: Array<{ kind: "cmd" | "out"; text: string; at: number }> =
  [
    { kind: "cmd", text: "whoami", at: 1150 },
    { kind: "out", text: "Han", at: 1700 },
    { kind: "cmd", text: "cat bio.txt", at: 2150 },
    { kind: "out", text: "大一在读 / 河南", at: 2900 },
    { kind: "out", text: "喜欢用代码做有意思的东西", at: 3350 },
    { kind: "cmd", text: "ls -la skills/", at: 3800 },
    { kind: "out", text: "drwxr-xr-x 前端 设计 运维", at: 4700 },
    { kind: "cmd", text: "curl -s https://", at: 5150 },
  ];

export function Hero() {
  return (
    <section id="intro" className="flex flex-col pb-10 mt-20">
      {/* 桌面端左右 1:1;移动端上下堆叠,文字在上 */}
      <div className="flex flex-col items-center gap-10 sm:grid sm:grid-cols-2 sm:items-center">
        {/* 左侧：文字内容 */}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <Badge
            variant="secondary"
            className="w-fit gap-1.5 animate-blur-in"
          >
            <MapPin />
            China
          </Badge>

          <TextAnimate
            animation="blurInUp"
            as="h1"
            by="character"
            delay={0.4}
            duration={0.5}
            startOnView={false}
            className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            Hi, I&apos;m Han.
          </TextAnimate>

          <p
            className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base animate-blur-in"
            style={{ "--blur-delay": "0.6s" } as React.CSSProperties}
          >
            一名学生、开发者与设计师。喜欢用代码和设计把事情做得简洁、好用又好看，目前主要探索
            Web 开发、创意编程与 AI 应用。
          </p>

          {/* 联系方式圆圈组(底部 Dock 中同样保留) */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-3 animate-blur-in sm:justify-start"
            style={{ "--blur-delay": "0.85s" } as React.CSSProperties}
          >
            {SOCIALS.map((social) => (
              <Button
                key={social.name}
                asChild
                variant="outline"
                size="icon"
                className="size-10 rounded-full"
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.Icon />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* 右侧：终端（与左侧 1:1）；序列在终端淡入后依次播放 */}
        <div
          className="w-full animate-blur-in"
          style={{ "--blur-delay": "1.1s" } as React.CSSProperties}
        >
          <Terminal
            sequence={false}
            className="bg-card text-sm shadow-lg [&_code]:font-sans [&_pre]:font-sans"
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
        </div>
      </div>
    </section>
  );
}
