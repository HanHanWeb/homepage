import type { MetadataRoute } from "next";

// import { listPosts } from "@/lib/blog-content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 博客暂时停用，不读取文章或向搜索引擎发布博客地址。
  // const posts = await listPosts();
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    // { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/friends`, changeFrequency: "monthly", priority: 0.6 },
    // ...posts.map((post) => ({
    //   url: `${SITE_URL}/blog/${post.slug}`,
    //   lastModified: post.createdAt,
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // })),
  ];
}
