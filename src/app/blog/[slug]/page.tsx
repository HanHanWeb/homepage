import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackToTop } from "@/components/back-to-top";
import { BlogNav } from "@/components/blog/blog-nav";
import { PostView } from "@/components/blog/post-view";
import { ScrollProgress } from "@/components/scroll-progress";
import { getPost } from "@/lib/blog";

export const revalidate = 300;

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Han`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.0/chinese-simplified-600.css"
      />
      <BlogNav title={post.title} />
      <ScrollProgress />
      <BackToTop />
      <PostView post={post} />
    </>
  );
}
