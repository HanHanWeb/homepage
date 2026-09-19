import { createClient, type Client } from "@libsql/client";

/** 中文按约 400 字/分钟估算阅读时长，不足 1 分钟按 1 分钟计 */
export function estimateReadingMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 400));
}

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

/** 文章「有用」计数表：首次访问时懒建表 */
let likesTableEnsured = false;
async function ensureLikesTable(db: Client) {
  if (likesTableEnsured) return;
  await db.execute(
    "CREATE TABLE IF NOT EXISTS post_likes (slug TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)",
  );
  likesTableEnsured = true;
}

/** 读取某篇文章的「有用」总数；数据库不可用时返回 null */
export async function getPostLikes(slug: string): Promise<number | null> {
  const db = getClient();
  if (!db) return null;
  try {
    await ensureLikesTable(db);
    const result = await db.execute({
      sql: "SELECT count FROM post_likes WHERE slug = ?",
      args: [slug],
    });
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return null;
  }
}

/** 增/减「有用」计数（delta 为 1 或 -1），返回更新后的总数 */
export async function changePostLikes(
  slug: string,
  delta: 1 | -1,
): Promise<number | null> {
  const db = getClient();
  if (!db) return null;
  try {
    await ensureLikesTable(db);
    const result = await db.execute({
      sql: `INSERT INTO post_likes (slug, count) VALUES (?, 1)
            ON CONFLICT(slug) DO UPDATE SET count = MAX(0, count + ?)
            RETURNING count`,
      args: [slug, delta],
    });
    return Number(result.rows[0]?.count ?? 0);
  } catch {
    return null;
  }
}

/** 供 /blog 列表页使用：库内文章按时间倒序；库不可达或无文章时返回空列表 */
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

/** 供 /blog/[slug] 详情页使用：查库返回文章 */
export async function getPost(slug: string): Promise<Post | null> {
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
