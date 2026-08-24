import type { SimpleIcon } from "simple-icons";
import { siBilibili, siGithub, siQq } from "simple-icons";

/** 联系方式(联系板块使用;handle 为副标题;icon 缺省时渲染 lucide Mail) */
export const SOCIALS: Array<{
  name: string;
  handle: string;
  href: string;
  icon?: SimpleIcon;
}> = [
  {
    name: "GitHub",
    handle: "@HanHanWeb",
    href: "https://github.com/HanHanWeb",
    icon: siGithub,
  },
  {
    name: "邮箱",
    handle: "1956526909@qq.com",
    href: "mailto:1956526909@qq.com",
  },
  {
    name: "QQ",
    handle: "1956526909",
    href: "https://qm.qq.com/q/XjHABirz6m",
    icon: siQq,
  },
  {
    name: "Bilibili",
    handle: "UID 518129719",
    href: "https://space.bilibili.com/518129719",
    icon: siBilibili,
  },
];
