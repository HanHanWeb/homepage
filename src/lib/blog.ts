import { createClient, type Client } from "@libsql/client";

export type Post = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  wordCount: number;
  createdAt: string;
  content?: string;
};

/** 内置示例文章：无需配置数据库即可通过 /blog/demo 访问 */
export const DEMO_POST: Post = {
  id: 0,
  slug: "demo",
  title: "示例文章",
  description: "示例文章",
  category: "示例",
  tags: ["示例"],
  wordCount: 4,
  createdAt: "2026-09-19",
  content: "示例文章",
};

let client: Client | null = null;

function getClient(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) return null;
  client ??= createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return client;
}

/** 供 /blog 列表页使用：内置示例文章 + 库内文章按时间倒序；库不可达时仅返回内置文章 */
export async function listPosts(): Promise<Post[]> {
  const db = getClient();
  const dbPosts: Post[] = [];
  if (db) {
    try {
      const result = await db.execute(
        "SELECT id, slug, title, description, category, tags, word_count, created_at FROM posts ORDER BY created_at DESC, id DESC"
      );
      dbPosts.push(
        ...result.rows.map((row) => ({
          id: Number(row.id),
          slug: String(row.slug),
          title: String(row.title),
          description: String(row.description),
          category: String(row.category),
          tags: JSON.parse(String(row.tags ?? "[]")) as string[],
          wordCount: Number(row.word_count ?? 0),
          createdAt: String(row.created_at),
        }))
      );
    } catch {
      // 查询失败时忽略，退回内置文章
    }
  }
  return [DEMO_POST, ...dbPosts.filter((p) => p.slug !== DEMO_POST.slug)].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

/** 供 /blog/[slug] 详情页使用：内置示例优先，其余查库 */
export async function getPost(slug: string): Promise<Post | null> {
  if (slug === DEMO_POST.slug) return DEMO_POST;

  const db = getClient();
  if (!db) return null;
  try {
    const result = await db.execute({
      sql: "SELECT id, slug, title, description, category, tags, word_count, created_at FROM posts WHERE slug = ? LIMIT 1",
      args: [slug],
    });
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: Number(row.id),
      slug: String(row.slug),
      title: String(row.title),
      description: String(row.description),
      category: String(row.category),
      tags: JSON.parse(String(row.tags ?? "[]")) as string[],
      wordCount: Number(row.word_count ?? 0),
      createdAt: String(row.created_at),
    };
  } catch {
    return null;
  }
}
