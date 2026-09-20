import type { Metadata } from "next";
import Script from "next/script";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "@/components/language-provider";
import { RouteTransition } from "@/components/route-transition";
import { SuppressScriptWarning } from "@/components/suppress-script-warning";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Open Graph / Twitter 等相对链接以此为基准转成绝对地址
  metadataBase: new URL(SITE_URL),
  title: "Han — Student · Developer · Designer",
  description:
    "一名学生、开发者与设计师。喜欢用设计把事情做得简洁、好用又好看，目前主要探索 Web 开发与 AI 应用。",
  openGraph: {
    type: "website",
    siteName: "Han",
    locale: "zh_CN",
    url: "/",
    images: ["/icon.png"],
  },
  twitter: { card: "summary" },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* MiSans 全站默认字体，CDN 直连 */}
        <link
          rel="stylesheet"
          href="https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,500,600:Chinese_Simplify,Latin&display=swap"
        />
        {/* 思源宋体 400/600：全站统一在此加载，跨页复用浏览器缓存 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.0/chinese-simplified-400.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.0/chinese-simplified-600.css"
        />
        {/* 预加载标题字体，避免 font swap 在入场动画中途改变字形 */}
        <link
          rel="preload"
          href="/fonts/CorpSrcWinSong-.4.woff2"
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
        {/* 51LA 网站统计（异步安装，不阻塞首屏渲染） */}
        <Script id="la-collect" strategy="afterInteractive">{`!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"LK9OFthiXdU6n1CZ",ck:"LK9OFthiXdU6n1CZ",autoTrack:true,hashMode:true});`}</Script>
      </body>
    </html>
  );
}
