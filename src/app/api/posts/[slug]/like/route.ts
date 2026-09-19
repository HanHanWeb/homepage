import { NextResponse } from "next/server";

import { changePostLikes, getPostLikes } from "@/lib/blog";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const count = await getPostLikes(slug);
  if (count === null) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  return NextResponse.json({ count });
}

export async function POST(_request: Request, { params }: Params) {
  const { slug } = await params;
  const count = await changePostLikes(slug, 1);
  if (count === null) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  return NextResponse.json({ count });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { slug } = await params;
  const count = await changePostLikes(slug, -1);
  if (count === null) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
  return NextResponse.json({ count });
}
