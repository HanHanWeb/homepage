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

/** 内置示例文章：无需配置数据库即可通过 /blog/demo 访问。
 * 内容摘编自 AcoFork 的《神了！PagesCMS 拯救静态博客！》，仅作功能演示。 */
export const DEMO_POST: Post = {
  id: 0,
  slug: "demo",
  title: "示例文章 · PagesCMS 拯救静态博客",
  description:
    "以 AcoFork 的 PagesCMS 文章为底稿的示例摘编，用于演示博客的多段落排版、目录与阅读功能。",
  category: "示例",
  tags: ["示例", "PagesCMS"],
  wordCount: 450,
  createdAt: "2026-09-19",
  content: `本文摘编自 AcoFork 的博客文章《神了！PagesCMS 拯救静态博客！》（www.acofork.com/posts/pagescms），图片亦取自原文，版权归原作者所有，这里仅作博客功能演示。

这是个啥

传统静态博客的写作门槛，往往不在写作本身：你得先装好 GitHub 客户端、配好 Markdown 编辑器，才能真正开始敲第一篇文章。PagesCMS 想解决的正是这段「写作前的仪式」——它代理你读写 GitHub 仓库，让任何能打开浏览器的设备都变成写作台，手机上也能随时改稿。

![PagesCMS 界面（图源原文）](https://www.acofork.com/img/b336d0ff-34b2-418f-9b81-d9c7c61db739.webp)

快速入门

上手只要两步：要么用官方模板新建一个仓库，要么把 PagesCMS 连接到已有的博客仓库。之后打开 app.pagescms.org，选中仓库，就可以直接写文章、传图片、点发布。

![快速入门（图源原文）](https://www.acofork.com/img/image-1.png)

原理

PagesCMS 用仓库根目录的 .pages.yml 做声明式配置，声明文章放在哪里、媒体目录在哪、发布时触发什么构建流程。本质上它是把 GitHub 当数据库用，通过预定义的操作读写文件、触发 Action。数据始终存在自己的仓库里，公开透明，随时可以迁移。

它同时是「服务器驱动式开发」的好范例：前端根据后端返回的 JSON 模板动态渲染界面，仓库内容一变，刷新页面就能看到新的编辑界面。

![配置示例（图源原文）](https://www.acofork.com/img/image-2.png)

小结

对不想折腾本地环境、只想安安静静写博客的人来说，PagesCMS 把静态博客的写作体验拉到了和托管平台一样简单，同时保留了数据完全自有的自由。完整细节和体验视频见原文。`,
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
