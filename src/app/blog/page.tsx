import { notFound } from "next/navigation";

// 博客暂时停用；原实现保留在下方，恢复时取消注释。
export default function DisabledBlogPage() {
  notFound();
}

// import type { Metadata } from "next";
//
// import { BackToTop } from "@/components/back-to-top";
// import { BlogView } from "@/components/blog/blog-view";
// import { listPosts } from "@/lib/blog-content";
//
// export const revalidate = 300;
//
// export const metadata: Metadata = {
//   title: "博客 — Han",
//   description: "记录学习、创作与思考。",
//   openGraph: {
//     title: "博客 — Han",
//     description: "记录学习、创作与思考。",
//     url: "/blog",
//     type: "website",
//   },
//   alternates: {
//     types: { "application/rss+xml": "/feed.xml" },
//   },
// };
//
// export default async function BlogPage() {
//   const posts = await listPosts();
//
//   return (
//     <>
//       <BackToTop />
//       <BlogView posts={posts} />
//     </>
//   );
// }
