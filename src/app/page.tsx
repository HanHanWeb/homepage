import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Contributions } from "@/components/contributions";
import { FlickeringGridTop } from "@/components/flickering-grid-top";
import { Focus } from "@/components/focus";
import { Hero } from "@/components/hero";
import { LanguageToggle } from "@/components/language-toggle";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ScrollProgress } from "@/components/scroll-progress";

export default function Home() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40"
      >
        <ProgressiveBlur position="top" height="10vh" />
      </div>
      <FlickeringGridTop />
      <ScrollProgress />
      {/* 语言切换仅首页显示（404 等页面不渲染） */}
      <div className="pointer-events-none fixed top-5 right-20 z-50">
        <div className="pointer-events-auto">
          <LanguageToggle />
        </div>
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-20 pb-28">
        <Hero />
        <About />
        <Focus />
        <Contributions />
        <Contact />
      </main>
    </>
  );
}
