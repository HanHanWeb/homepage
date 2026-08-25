import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { SuppressScriptWarning } from "@/components/suppress-script-warning";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Han — Student · Developer · Designer",
  description:
    "一名来自中国的学生、开发者与设计师的个人主页。学生 · 开发者 · 设计师，记录学习与创作。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <head />
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <SuppressScriptWarning />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="pointer-events-none fixed top-5 right-20 z-50">
              <div className="pointer-events-auto">
                <LanguageToggle />
              </div>
            </div>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
