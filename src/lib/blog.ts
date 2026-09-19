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
