import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackToTop } from "@/components/back-to-top";
import { PostView } from "@/components/blog/post-view";
import { postExcerpt, postOgImage, getPost } from "@/lib/blog-content";

export const revalidate = 300;

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  const description = postExcerpt(post);
  const image = postOgImage(post);
  return {
    title: `${post.title} — Han`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.createdAt,
      tags: post.tags,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
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
