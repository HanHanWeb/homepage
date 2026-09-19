import { listPosts } from "@/lib/blog-content";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hhan.me";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** RSS 2.0 订阅源：与 /blog 同源（Turso），库不可达时输出空频道保证可访问 */
export async function GET(): Promise<Response> {
  const posts = await listPosts();

  const items = posts
    .map((post) => {
      const date = new Date(post.createdAt);
      const pubDate = Number.isNaN(date.getTime())
        ? ""
        : `\n      <pubDate>${date.toUTCString()}</pubDate>`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${encodeURIComponent(post.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${encodeURIComponent(post.slug)}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>${pubDate}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Han 的博客</title>
    <link>${SITE_URL}/blog</link>
    <description>记录学习、创作与思考。</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
