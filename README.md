<div align="center">

# Han · 个人主页

**学生 · 开发者 · 设计师**

一个基于 Next.js 构建的个人主页，记录学习与创作。

<br/>

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%20ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img alt="Motion" src="https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=motion&logoColor=white" />
  <img alt="MIT license" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<br/>

<img alt="项目截图" src="https://picui.ogmua.cn/s1/2026/08/27/6a901f85477e7.webp" width="760" />

</div>

## ✨ 简介

这是我的个人主页 —— 使用 Next.js 16、React 19 与 TypeScript 构建，展示个人简介、技术栈与联系方式。支持深浅色主题切换与中英文切换，并适配移动端。

## 🛠️ 技术栈

| 领域 | 技术 |
| ---- | ---- |
| 框架 | [Next.js 16](https://nextjs.org) · [React 19](https://react.dev) |
| 语言 | [TypeScript](https://www.typescriptlang.org) |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) |
| 组件 | [Radix UI](https://radix-ui.com) · [lucide-react](https://lucide.dev) |
| 动效 | [Motion](https://motion.dev) · [tw-animate-css](https://tw-animate-css.vercel.app) |
| 主题 | [next-themes](https://github.com/pacocoursey/next-themes) |

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 启动生产服务器
pnpm start
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## ✍️ 写博客

文章以文件形式存储，每篇文章一个目录，方便直接整理与版本管理：

```
blog/
└── nextstep2026/
    ├── index.md            # 文章正文（frontmatter + Markdown）
    ├── DSC00369.jpg        # 图片等资源，与正文同目录
    └── ...
```

`index.md` 头部为 `---` 包裹的简单 frontmatter，图片在正文中用相对路径引用，由 `/blog/<slug>/<文件名>` 路由自动提供：

```markdown
---
title: 文章标题
description: 列表页与 RSS 显示的摘要。
category: 随笔
tags: [标签一, 标签二]
date: 2026-07-06
---

正文段落……

![图片说明](DSC00369.jpg)
```

目录名即文章 slug（访问地址 `/blog/<slug>`）。新增或修改文章后无需重启，约 1 分钟内生效（生产构建下随下次重新生成生效）。文章的「有用」计数存放在 Turso 数据库的 `post_likes` 表，初始化执行 `node scripts/setup-blog-db.mjs`（需要 `.env.local` 中的 `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`）。

## 📄 许可证

使用 [MIT](LICENSE) 许可证开源。