import { About } from "@/components/about";
import { BackToTop } from "@/components/back-to-top";
import { Contact } from "@/components/contact";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { Contributions } from "@/components/contributions";
import { FlickeringGridTop } from "@/components/flickering-grid-top";
import { Focus } from "@/components/focus";
import { Hero } from "@/components/hero";
import { HomeNav } from "@/components/home-nav";

export const revalidate = 300;

export default function Home() {
  return (
    <>
      <HomeNav />
      <FlickeringGridTop />
      <BackToTop />
      <CursorSpotlight className="site-container home-content relative z-10 flex flex-1 flex-col pb-16">
        <Hero />
        <About />
        <Focus />
        <Contributions />
        <Contact />
      </CursorSpotlight>
    </>
  );
}
