import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { DockBar } from "@/components/dock-bar";
import { FlickeringGridTop } from "@/components/flickering-grid-top";
import { Hero } from "@/components/hero";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function Home() {
  return (
    <>
      {/* 顶部渐进模糊：固定在视口顶部，滚动时模糊下方内容 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40"
      >
        <ProgressiveBlur position="top" height="20vh" />
      </div>
      <FlickeringGridTop />
      {/* 底部 Dock：主题切换 + 联系方式 */}
      <DockBar />
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-20 pb-28">
        <Hero />
        <About />
        <Contact />
      </main>
    </>
  );
}
