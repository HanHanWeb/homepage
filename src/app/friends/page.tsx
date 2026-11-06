import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { Friends } from "@/components/friends";

export const metadata: Metadata = {
  title: "友情链接 — Han",
  description: "朋友们的网站，以及交换友链的方式。",
  alternates: { canonical: "/friends" },
};

export default function FriendsPage() {
  return <ContentPage><Friends /></ContentPage>;
}
