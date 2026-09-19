import { createClient, type Client } from "@libsql/client";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { BLOG_DIR } from "@/lib/blog-dir";
import type { Post } from "@/lib/blog";

/**
 * 文章存储（仅服务端）：每篇文章一个目录 blog/<slug>/，入口为 index.md，
 * 图片等资源放在同一目录并用相对路径引用（由 /blog/<slug>/<file> 路由提供）。
 * index.md 头部为 `---` 包裹的简单键值 frontmatter：
 *   title / description / category / tags（如 [a, b]）/ date
 * 数据库仅用于「有用」计数（post_likes 表）。
 */

type PostMeta = Pick<
  Post,
  "title" | "description" | "category" | "tags" | "createdAt"
>;

/** 解析 index.md 头部的简单 frontmatter（每行 `key: value`，tags 支持 [a, b]） */
function parseFrontMatter(raw: string): { meta: PostMeta; body: string } {
  const meta: PostMeta = {
    title: "",
    description: "",
    category: "随笔",
    tags: [],
    createdAt: "",
  };
  let body = raw;
  const matched = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (matched) {
    body = raw.slice(matched[0].length);
    for (const line of matched[1].split(/\r?\n/)) {
      const kv = line.match(/^([A-Za-z_]+)\s*:\s*(.*)$/);
      if (!kv) continue;
      const key = kv[1].toLowerCase();
      const value = kv[2].trim();
      if (key === "title") meta.title = value;
      else if (key === "description") meta.description = value;
      else if (key === "category") meta.category = value;
      else if (key === "date" || key === "createdat") meta.createdAt = value;
      else if (key === "tags") {
        meta.tags = value
          .replace(/^\[/, "")
          .replace(/\]$/, "")
          .split(/[,，]/)
          .map((t) => t.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      }
    }
  }
  return { meta, body };
}

/** 字数统计：中文字符逐字计，英文/数字按词计，图片与 Markdown 标记不计 */
function countWords(body: string): number {
  const text = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*`~|_\-[\]()]/g, " ");
  const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinWords = text
    .replace(/[\u3400-\u9fff]/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return cjk + latinWords;
}

/** 读取单篇文章（含正文）；目录不存在或缺 frontmatter 时返回 null */
async function readPost(slug: string): Promise<Post | null> {
  if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes(".."))
    return null;
  let raw: string;
  try {
    raw = await readFile(path.join(BLOG_DIR, slug, "index.md"), "utf8");
  } catch {
    return null;
  }
  const { meta, body } = parseFrontMatter(raw);
  if (!meta.title) return null;
  return {
    id: 0,
    slug,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    tags: meta.tags,
    wordCount: countWords(body),
    createdAt: meta.createdAt,
    content: body,
  };
}

let cache: { posts: Post[]; at: number } | null = null;
const CACHE_MS = 60_000;

/** 供 /blog 列表页使用：文件式文章按时间倒序，目录为空时返回空列表 */
export async function listPosts(): Promise<Post[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.posts;
  // 目录不存在或不可读时视为空博客
  const entries = await readdir(BLOG_DIR, { withFileTypes: true }).catch(
    () => [],
  );
  const posts: Post[] = [];
  for (const [i, entry] of entries.entries()) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const post = await readPost(entry.name);
    if (post) posts.push({ ...post, id: i });
  }
  posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  cache = { posts, at: Date.now() };
  return posts;
}

/** 供 /blog/[slug] 详情页使用：读文件返回文章 */
export async function getPost(slug: string): Promise<Post | null> {
  const cached = cache?.posts.find((p) => p.slug === slug);
  if (cached) return cached;
  return readPost(slug);
}

/** 分享/SEO 摘要：优先 frontmatter description，缺省时截取正文开头约 100 字 */
export function postExcerpt(post: Post, max = 100): string {
  if (post.description) return post.description;
  const text = (post.content ?? "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*`~|_\-[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/** 分享缩略图：取正文第一张图片的绝对路径；无图返回 undefined */
export function postOgImage(post: Post): string | undefined {
  const m = (post.content ?? "").match(/^!\[[^\]]*\]\(([^)]+)\)$/m);
  if (!m) return undefined;
  const src = m[1];
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/blog/${post.slug}/${src}`;
}

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
