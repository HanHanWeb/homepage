import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { Projects } from "@/components/projects";

export const metadata: Metadata = {
  title: "项目 — Han",
  description: "我参与的项目、产品与创作。",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return <ContentPage><Projects /></ContentPage>;
}
