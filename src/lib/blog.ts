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

/** 供 /blog 列表页使用：按时间倒序取全部文章；库不可达时返回空列表保证页面可渲染 */
export async function listPosts(): Promise<Post[]> {
  const db = getClient();
  if (!db) return [];
  try {
    const result = await db.execute(
      "SELECT id, slug, title, description, category, tags, word_count, created_at FROM posts ORDER BY created_at DESC, id DESC"
    );
    return result.rows.map((row) => ({
      id: Number(row.id),
      slug: String(row.slug),
      title: String(row.title),
      description: String(row.description),
      category: String(row.category),
      tags: JSON.parse(String(row.tags ?? "[]")) as string[],
      wordCount: Number(row.word_count ?? 0),
      createdAt: String(row.created_at),
    }));
  } catch {
    return [];
  }
}
