/**
 * 初始化 Turso 博客表结构（不写入数据）。
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

await client.execute(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '随笔',
    tags TEXT NOT NULL DEFAULT '[]',
    word_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// 旧表迁移：word_count 列不存在时补加
try {
  await client.execute("ALTER TABLE posts ADD COLUMN word_count INTEGER NOT NULL DEFAULT 0");
  console.log("已添加 word_count 列。");
} catch (e) {
  if (!String(e.message).includes("duplicate column")) throw e;
}

const count = await client.execute("SELECT COUNT(*) AS n FROM posts");
console.log(`博客表初始化完成，当前 ${count.rows[0].n} 篇文章。`);
