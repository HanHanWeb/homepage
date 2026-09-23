/** 项目数据:从 GitHub (HanHanWeb) 拉取的公开仓库快照,无国内实时接口故静态维护 */

export type Project = {
  name: string;
  nameEn: string;
  url?: string;
  tagZh: string;
  tagEn: string;
  descZh: string;
  descEn: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Homepage",
    nameEn: "Homepage",
    url: "https://github.com/HanHanWeb/homepage",
    tagZh: "dev",
    tagEn: "dev",
    descZh: "一个基于 Next.js 构建的个人主页，记录学习与创作。",
    descEn: "A personal homepage built with Next.js, documenting learning and creation.",
  },
  {
    name: "Spark",
    nameEn: "Spark",
    url: "https://github.com/HanHanWeb/spark",
    tagZh: "dev",
    tagEn: "dev",
    descZh: "搜索框即入口的轻量便签速记工具",
    descEn: "A lightweight quick-note app where the search box is the entry point.",
  },
  {
    name: "Roadmap",
    nameEn: "Roadmap",
    url: "https://github.com/HanHanWeb/roadmap",
    tagZh: "archive",
    tagEn: "archive",
    descZh: "一个轻量的公开项目路线图与功能投票平台。",
    descEn: "A lightweight platform for public project roadmaps and feature voting.",
  },
  {
    name: "Foxity",
    nameEn: "Foxity",
    url: "https://github.com/HanHanWeb/foxity",
    tagZh: "dev",
    tagEn: "dev",
    descZh: "面向竞赛/项目团队的 AI 对话式能力测评平台 / NextStep 2026 武汉站小组项目",
    descEn: "An AI conversational assessment platform for competition and project teams · NextStep 2026 Wuhan.",
  },
  {
    name: "句刻",
    nameEn: "Asentence",
    tagZh: "dev",
    tagEn: "dev",
    descZh: "即刻发现文字之美，高度自定义的一言 API 项目。",
    descEn: "Discover the beauty of words in an instant — a highly customizable quote API project.",
  },
  {
    name: "作品中心",
    nameEn: "Gallery",
    tagZh: "archive",
    tagEn: "archive",
    descZh: "界面生态附属项目，面向 PPT OS 爱好者的一站式作品中心。",
    descEn: "An Intereco sub-project — a one-stop gallery for PPT OS enthusiasts.",
  },
  {
    name: "IPOA 赛事系统",
    nameEn: "IPOA Competition System",
    tagZh: "archive",
    tagEn: "archive",
    descZh: "界面生态附属项目，PPT OS 创意赛事 IPOA 的官方赛事平台。",
    descEn: "An Intereco sub-project — the official platform for IPOA, the creative PPT OS competition.",
  },
  {
    name: "财务公开平台",
    nameEn: "Finance Disclosure",
    tagZh: "archive",
    tagEn: "archive",
    descZh: "界面生态附属项目，公开界面生态财务信息的透明化平台。",
    descEn: "An Intereco sub-project — a transparency platform publishing Intereco's financial disclosures.",
  },
];

/** 精选项目：非 GitHub 仓库的社区项目，静态维护 */
export type FeaturedProject = {
  name: string;
  nameEn: string;
  roleZh: string;
  roleEn: string;
  descZh: string;
  descEn: string;
  quote: {
    textZh: string;
    textEn: string;
    author: string;
    authorEn: string;
    titleZh: string;
    titleEn: string;
    avatar: string;
  };
  subProjects: {
    name: string;
    nameEn: string;
  }[];
};

export const FEATURED_PROJECT: FeaturedProject = {
  name: "界面生态",
  nameEn: "Intereco",
  roleZh: "Founder / 已离职",
  roleEn: "Founder / Former",
  descZh: "界面生态是国内最大的以 PPT OS 创意为核心的社区生态，汇聚创作者、作品和交流平台，曾推动 PPT 创意设计的发展。",
  descEn: "Intereco is China's largest community ecosystem centered on PPT OS creativity, bringing together creators, works and conversations, and has helped drive creative PPT design forward.",
  quote: {
    textZh: "界面生态是 PPT 圈少见的兴趣垂类社区，希望热爱 PPT 的大家在这里玩的开心，愿 PPT 兴趣圈人来人往，永不落幕~",
    textEn: "Intereco is a rare passion-driven community in the PPT circle. May everyone who loves PPT have a great time here — may people come and go, and the show never end~",
    author: "安逸",
    authorEn: "Anyi",
    titleZh: "「安逸PPT」账号主理人 · 金山最具价值专家（KVP） · 微软国际办公认证 MOS-PPT 专家 · 51PPT模板网大设计师",
    titleEn: "Founder of AnyiPPT · Kingsoft Most Valuable Professional (KVP) · Microsoft Office Specialist (MOS-PPT) · Distinguished Designer at 51PPT",
    avatar: "https://q1.qlogo.cn/g?b=qq&nk=1559655822&s=640",
  },
  subProjects: [
    { name: "主页", nameEn: "Home" },
    { name: "社区", nameEn: "Community" },
    { name: "作品中心", nameEn: "Gallery" },
    { name: "IPOA赛事系统", nameEn: "IPOA Competition System" },
    { name: "财务公开平台", nameEn: "Finance Disclosure" },
  ],
};
