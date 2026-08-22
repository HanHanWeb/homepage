import type { ComponentType, SVGProps } from "react";
import { Mail } from "lucide-react";

import { BilibiliIcon, GithubIcon, QQIcon } from "@/components/icons";

/** 联系方式(Hero 圆圈组与底部 Dock 共用) */
export const SOCIALS: Array<{
  name: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { name: "GitHub", href: "https://github.com/HanHanWeb", Icon: GithubIcon },
  { name: "Email", href: "mailto:1956526909@qq.com", Icon: Mail },
  { name: "QQ", href: "https://qm.qq.com/q/XjHABirz6m", Icon: QQIcon },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/518129719",
    Icon: BilibiliIcon,
  },
];
