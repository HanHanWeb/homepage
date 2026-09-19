import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "@/components/language-provider";
import { RouteTransition } from "@/components/route-transition";
import { SuppressScriptWarning } from "@/components/suppress-script-warning";
import { ThemeProvider } from "@/components/theme-provider";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Han — Student · Developer · Designer",
  description:
    "一名来自中国的学生、开发者与设计师的个人主页。学生 · 开发者 · 设计师，记录学习与创作。",
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        {/* MiSans 全站默认字体，CDN 直连 */}
        <link
          rel="stylesheet"
          href="https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,500,600:Chinese_Simplify,Latin&display=swap"
        />
        {/* 预加载标题字体，避免 font swap 在入场动画中途改变字形 */}
        <link
          rel="preload"
          href="/fonts/CorpSrcWinSong-slim.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <SuppressScriptWarning />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <RouteTransition />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
