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

/** 列表/分享封面：取正文第一张图片；相对路径补全为 /blog/<slug>/... */
export function postCover(post: Post): string | undefined {
  const m = (post.content ?? "").match(/^!\[[^\]]*\]\(([^)]+)\)$/m);
  if (!m) return undefined;
  const src = m[1];
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/blog/${post.slug}/${src}`;
}

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** 2026-07-06 → 2026 年 7 月 6 日 / July 6, 2026（按本地字段解析，避免时区偏移） */
export function formatPostDate(value: string, zh: boolean): string {
  const m = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return value;
  const [, year, month, day] = m;
  if (zh) return `${Number(year)} 年 ${Number(month)} 月 ${Number(day)} 日`;
  return `${MONTHS_EN[Number(month) - 1]} ${Number(day)}, ${year}`;
}
