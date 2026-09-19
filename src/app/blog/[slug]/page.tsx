import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackToTop } from "@/components/back-to-top";
import { PostView } from "@/components/blog/post-view";
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
      <BackToTop />
      <PostView post={post} />
    </>
  );
}
