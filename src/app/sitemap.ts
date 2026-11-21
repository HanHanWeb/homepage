import type { MetadataRoute } from "next";

import { listPosts } from "@/lib/blog-content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts().catch(() => []);
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/friends`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
