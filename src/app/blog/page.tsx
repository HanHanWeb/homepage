import type { Metadata } from "next";

import { BackToTop } from "@/components/back-to-top";
import { BlogView } from "@/components/blog/blog-view";
import { LanguageToggle } from "@/components/language-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { listPosts } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "博客 — Han",
  description: "记录学习、创作与思考。",
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.0/chinese-simplified-600.css"
      />
      <ScrollProgress />
      <BackToTop />
      <div className="pointer-events-none fixed top-5 right-20 z-50">
        <div className="pointer-events-auto">
          <LanguageToggle />
        </div>
      </div>
      <BlogView posts={posts} />
    </>
  );
}
