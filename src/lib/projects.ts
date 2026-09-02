/** 项目数据:从 GitHub (HanHanWeb) 拉取的公开仓库快照,无国内实时接口故静态维护 */

export type Project = {
  /** 仓库名 */
  name: string;
  /** 仓库链接 */
  url: string;
  /** 中文简介(取自仓库 description) */
  descZh: string;
  /** 英文简介 */
  descEn: string;
  /** 主要技术栈 */
  stack: string[];
};

export const PROJECTS: Project[] = [
  {
    name: "homepage",
    url: "https://github.com/HanHanWeb/homepage",
    descZh: "一个基于 Next.js 构建的个人主页，记录学习与创作。",
    descEn: "A personal homepage built with Next.js, documenting learning and creation.",
    stack: ["TypeScript", "CSS", "JavaScript"],
  },
  {
    name: "spark",
    url: "https://github.com/HanHanWeb/spark",
    descZh: "搜索框即入口的轻量便签速记工具",
    descEn: "A lightweight quick-note app where the search box is the entry point.",
    stack: ["TypeScript", "CSS", "JavaScript"],
  },
  {
    name: "roadmap",
    url: "https://github.com/HanHanWeb/roadmap",
    descZh: "一个轻量的公开项目路线图与功能投票平台。",
    descEn: "A lightweight platform for public project roadmaps and feature voting.",
    stack: ["TypeScript", "CSS", "JavaScript"],
  },
  {
    name: "foxity",
    url: "https://github.com/HanHanWeb/foxity",
    descZh: "面向竞赛/项目团队的 AI 对话式能力测评平台 / NextStep 2026 武汉站小组项目",
    descEn: "An AI conversational assessment platform for competition and project teams · NextStep 2026 Wuhan.",
    stack: ["TypeScript", "CSS", "JavaScript"],
  },
];
