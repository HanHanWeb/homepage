/**
 * 初始化博客所需的数据表。文章正文以文件形式存放在 blog/<slug>/ 目录，
 * 数据库只存「有用」计数（post_likes 表）。
 * 用法：node scripts/setup-blog-db.mjs
 * 需要 .env.local 中的 TURSO_DATABASE_URL / TURSO_AUTH_TOKEN。
 */
import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

loadEnv();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.execute(
  "CREATE TABLE IF NOT EXISTS post_likes (slug TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)",
);

console.log("post_likes 表已就绪。文章请直接添加到 blog/<slug>/index.md。");
