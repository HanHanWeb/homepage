import type { ComponentType, SVGProps } from "react";
import { Mail } from "lucide-react";

import { BilibiliIcon, GithubIcon, QQIcon } from "@/components/icons";

/** 联系方式(联系板块卡片与底部 Dock 共用;handle 为卡片副标题) */
export const SOCIALS: Array<{
  name: string;
  handle: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  {
    name: "GitHub",
    handle: "@HanHanWeb",
    href: "https://github.com/HanHanWeb",
    Icon: GithubIcon,
  },
  {
    name: "邮箱",
    handle: "1956526909@qq.com",
    href: "mailto:1956526909@qq.com",
    Icon: Mail,
  },
  {
    name: "QQ",
    handle: "1956526909",
    href: "https://qm.qq.com/q/XjHABirz6m",
    Icon: QQIcon,
  },
  {
    name: "Bilibili",
    handle: "UID 518129719",
    href: "https://space.bilibili.com/518129719",
    Icon: BilibiliIcon,
  },
];
