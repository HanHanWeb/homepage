import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";

const SKILLS = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Postgres",
  "MySQL",
  "SQLite",
  "Docker",
  "Tailwind CSS",
  "Git/GitHub",
  "JavaScript",
  "Shadcn/UI",
  "NGINX",
  "Linux",
  "Figma",
  "VS Code",
  "HTML",
  "CSS",
];

export function About() {
  return (
    <section id="about" className="scroll-mt-6 py-10">
      <Reveal delay="1.35s">
        <h2 className="text-2xl font-semibold tracking-tight">关于</h2>
      </Reveal>

      <div className="mt-4 space-y-4">
        <Reveal delay="1.5s">
          <div className="space-y-2.5">
            <p className="text-sm leading-6 text-muted-foreground">
              一名来自中国的大学学生，同时是一名开发者与设计师。平时喜欢折腾各种小项目，把想法从草图变成可用的产品。我关注简洁、克制的设计，也相信好的工具应该让人更专注。
            </p>
          </div>
        </Reveal>

        <Reveal delay="1.65s">
          <h3 className="text-xs font-medium tracking-widest text-muted-foreground">
            技能
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SKILLS.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="dark:border-white/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
