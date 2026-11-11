import type { SimpleIcon } from "simple-icons";
import { siAfdian, siBilibili, siGithub, siQq, siX } from "simple-icons";

import type { BrandIconDef } from "@/components/ui/brand-icon";

/** Bonjour 的数字名片标识（Material Symbols 挥手，960 网格）。 */
const bonjourIcon: BrandIconDef = {
  viewBox: "0 -960 960 960",
  path: "m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z",
};

/** 联系方式。handle 为副标题，未提供品牌图标时使用邮件图标。 */
export const SOCIALS: Array<{
  name: string;
  handle: string;
  href: string;
  icon?: SimpleIcon | BrandIconDef;
}> = [
  {
    name: "GitHub",
    handle: "@HanHanWeb",
    href: "https://github.com/HanHanWeb",
    icon: siGithub,
  },
  {
    name: "X",
    handle: "@Mountain_Know",
    href: "https://x.com/Mountain_Know",
    icon: siX,
  },
  {
    name: "Bonjour",
    handle: "@astra",
    href: "https://bonjour.bio/astra",
    icon: bonjourIcon,
  },
  {
    name: "邮箱",
    handle: "im[at]hhan.me",
    href: "mailto:im@hhan.me",
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
  {
    name: "爱发电",
    handle: "@Astra",
    href: "https://afdian.com/a/han-han",
    icon: siAfdian,
  },
];
