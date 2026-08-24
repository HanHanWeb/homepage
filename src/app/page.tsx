import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Contributions } from "@/components/contributions";
import { FlickeringGridTop } from "@/components/flickering-grid-top";
import { Hero } from "@/components/hero";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { ScrollProgress } from "@/components/scroll-progress";
import { Services } from "@/components/services";

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
      {/* 右上角滚动进度环 */}
      <ScrollProgress />
      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-20 pb-28">
        <Hero />
        <About />
        <Services />
        <Contributions />
        <Contact />
      </main>
    </>
  );
}
