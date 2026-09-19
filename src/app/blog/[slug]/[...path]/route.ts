import { readFile } from "node:fs/promises";
import path from "node:path";

import { BLOG_DIR } from "@/lib/blog-dir";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

/** 提供 /blog/<slug>/ 下的图片等静态资源（index.md 以相对路径引用） */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
): Promise<Response> {
  const { slug, path: segments } = await params;
  const target = path.resolve(BLOG_DIR, slug, ...segments);
  // 防目录穿越：解析后的路径必须仍在文章目录内
  if (!target.startsWith(path.resolve(BLOG_DIR, slug) + path.sep))
    return new Response("Not found", { status: 404 });

  const mime = MIME[path.extname(target).toLowerCase()];
  if (!mime) return new Response("Not found", { status: 404 });

  try {
    const data = await readFile(target);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
