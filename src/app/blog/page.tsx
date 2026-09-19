import type { Metadata } from "next";

import { BackToTop } from "@/components/back-to-top";
import { BlogNav } from "@/components/blog/blog-nav";
import { BlogView } from "@/components/blog/blog-view";
import { ScrollProgress } from "@/components/scroll-progress";
import { listPosts } from "@/lib/blog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "博客 — Han",
  description: "记录学习、创作与思考。",
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.0/chinese-simplified-600.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.0/chinese-simplified-400.css"
      />
      <BlogNav />
      <ScrollProgress />
      <BackToTop />
      <BlogView posts={posts} />
    </>
  );
}
