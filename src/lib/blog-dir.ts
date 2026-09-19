import path from "node:path";

/** 博客文章根目录：每篇文章一个子目录 blog/<slug>/，入口 index.md */
export const BLOG_DIR = path.join(process.cwd(), "blog");
