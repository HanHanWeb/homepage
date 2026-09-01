"use client";

import { Sparkles } from "lucide-react";
import {
  siCss,
  siDocker,
  siFigma,
  siGithub,
  siHtml5,
  siJavascript,
  siMysql,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siReact,
  siShadcnui,
  siSqlite,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { BrandIcon } from "@/components/ui/brand-icon";

const SKILLS: Array<{ name: string; icon: SimpleIcon }> = [
  { name: "React.js", icon: siReact },
  { name: "Next.js", icon: siNextdotjs },
  { name: "TypeScript", icon: siTypescript },
  { name: "Node.js", icon: siNodedotjs },
  { name: "Postgres", icon: siPostgresql },
  { name: "MySQL", icon: siMysql },
  { name: "SQLite", icon: siSqlite },
  { name: "Docker", icon: siDocker },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "Git/GitHub", icon: siGithub },
  { name: "JavaScript", icon: siJavascript },
  { name: "Shadcn/UI", icon: siShadcnui },
  { name: "NGINX", icon: siNginx },
  { name: "Figma", icon: siFigma },
  { name: "HTML", icon: siHtml5 },
  { name: "CSS", icon: siCss },
];

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="scroll-mt-6 py-10">
      <Reveal delay="1.35s" direction="down">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-serif-sc text-3xl font-semibold tracking-tight sm:text-4xl">{t.about.title}</h2>
          <span className="text-sm font-normal tracking-widest text-muted-foreground/40">#ABOUT</span>
        </div>
      </Reveal>

      <div className="mt-4 space-y-4">
        <Reveal delay="1.5s" direction="down">
          <div className="space-y-2.5">
            <p className="text-sm leading-6 text-muted-foreground">{t.about.description}</p>
            <Badge variant="outline" className="dark:border-white/20">
              <Sparkles />
              {t.about.personality}
            </Badge>
          </div>
        </Reveal>

        <Reveal delay="1.65s" direction="down">
          <h3 className="text-xs font-medium tracking-widest text-muted-foreground">
            {t.about.skills}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SKILLS.map((skill) => (
              <Badge key={skill.name} variant="outline" className="dark:border-white/20">
                <BrandIcon icon={skill.icon} />
                {skill.name}
              </Badge>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
