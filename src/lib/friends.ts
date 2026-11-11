/** 友情链接。没有头像时使用链接图标，没有网址时显示静态卡片。 */
export const FRIENDS: Array<{
  name: string;
  description: string;
  href?: string;
  avatar?: string;
}> = [
  {
    name: "apanzinc",
    description: "我是 apanzinc，一名初三学生，专注于前后端开发与人工智能应用的学习与实践。",
    href: "https://apanzinc.top",
    avatar: "https://static.apanzinc.top/apanzinc/logo.png",
  },
  {
    name: "Lonely",
    description: "不会语文懒得写了.png",
    href: "https://v0id.ink/",
    avatar: "https://q1.qlogo.cn/g?b=qq&nk=1280993766&s=640",
  },
  {
    name: "Malloy",
    description: "🌌 📚 🚴 🍻 🌅 📷 🥤 🤟",
    href: "https://malloymanga.github.io/",
    avatar: "https://malloymanga.github.io/_nuxt/avatar-pixel.DHvx2yCj.webp",
  },
];
