/** 项目数据:从 GitHub (HanHanWeb) 拉取的公开仓库快照,无国内实时接口故静态维护 */

/** 项目预览图：文件在 public 下，alt 按语言取用 */
export type ProjectImage = {
  src: string;
  altZh: string;
  altEn: string;
};

export type Project = {
  name: string;
  nameEn: string;
  url?: string;
  githubUrl?: string;
  tagZh: string;
  tagEn: string;
  descZh: string;
  descEn: string;
  /** 卡片顶部预览图；多张时卡片内自动滚动播放，点击打开灯箱 */
  images?: readonly ProjectImage[];
};

export const PROJECTS: Project[] = [
  {
    name: "homepage",
    nameEn: "homepage",
    url: "https://github.com/HanHanWeb/homepage",
    tagZh: "开发",
    tagEn: "dev",
    descZh: "一个基于 Next.js 构建的个人主页，记录学习与创作。",
    descEn: "A personal homepage built with Next.js, documenting learning and creation.",
    images: [{ src: "/project-homepage.webp", altZh: "homepage 主页界面", altEn: "homepage interface" }],
  },
  {
    name: "typesmith",
    nameEn: "typesmith",
    url: "https://typesmith.pages.dev/",
    githubUrl: "https://github.com/HanHanWeb/typesmith",
    tagZh: "开发",
    tagEn: "dev",
    descZh: "为初学者打造的交互式 LaTeX 学习平台。",
    descEn: "An interactive LaTeX learning platform built for beginners.",
    images: [
      {
        src: "/project-typesmith-1.webp",
        altZh: "Typesmith 首页：学习进度与学习模块",
        altEn: "Typesmith home: progress and learning modules",
      },
      {
        src: "/project-typesmith-2.webp",
        altZh: "Typesmith 课程页：文档类与实时编译运行",
        altEn: "Typesmith lesson page: document classes with live compile",
      },
    ],
  },
  {
    name: "spark",
    nameEn: "spark",
    url: "https://spark.hhan.me/",
    githubUrl: "https://github.com/HanHanWeb/spark",
    tagZh: "开发",
    tagEn: "dev",
    descZh: "搜索框即入口的轻量便签速记工具",
    descEn: "A lightweight quick-note app where the search box is the entry point.",
    images: [
      { src: "/gallery-spark.webp", altZh: "Spark 界面：搜索框与便签列表", altEn: "Spark interface: search box and note list" },
      { src: "/gallery-spark-sync.webp", altZh: "Spark 云同步", altEn: "Spark cloud sync" },
      { src: "/gallery-spark-appearance.webp", altZh: "Spark 外观设置", altEn: "Spark appearance settings" },
    ],
  },
  {
    name: "roadmap",
    nameEn: "roadmap",
    url: "https://github.com/HanHanWeb/roadmap",
    tagZh: "归档",
    tagEn: "archive",
    descZh: "一个轻量的公开项目路线图与功能投票平台。",
    descEn: "A lightweight platform for public project roadmaps and feature voting.",
    images: [
      {
        src: "/project-roadmap.webp",
        altZh: "roadmap 界面：功能投票与路线图看板",
        altEn: "roadmap interface: feature voting and roadmap board",
      },
    ],
  },
  {
    name: "foxity",
    nameEn: "foxity",
    url: "https://github.com/HanHanWeb/foxity",
    tagZh: "开发",
    tagEn: "dev",
    descZh: "面向竞赛/项目团队的 AI 对话式能力测评平台 / NextStep 2026 武汉站小组项目",
    descEn: "An AI conversational assessment platform for competition and project teams · NextStep 2026 Wuhan.",
    images: [{ src: "/project-foxity.webp", altZh: "Foxity 落地页", altEn: "Foxity landing page" }],
  },
  {
    name: "fill-letter",
    nameEn: "fill-letter",
    url: "https://fill-letter.pages.dev/",
    githubUrl: "https://github.com/HanHanWeb/fill-letter",
    tagZh: "开发",
    tagEn: "dev",
    descZh: "让每一张照片，有新的秩序。",
    descEn: "Give every photo a new order.",
    images: [
      {
        src: "/project-fill-letter.webp",
        altZh: "fill-letter 界面：字母填充预览与创作面板",
        altEn: "fill-letter interface: letter-fill preview and creation panel",
      },
    ],
  },
  {
    name: "句刻",
    nameEn: "Asentence",
    tagZh: "归档",
    tagEn: "dev",
    descZh: "即刻发现文字之美，高度自定义的一言 API 项目。",
    descEn: "Discover the beauty of words in an instant — a highly customizable quote API project.",
  },
  {
    name: "界面生态主页",
    nameEn: "Intereco Homepage",
    tagZh: "归档",
    tagEn: "archive",
    descZh: "界面生态的官方网站，展示社区介绍、合作项目与创作者寄语。",
    descEn: "The Intereco website, presenting the community, partnerships, and creator testimonials.",
    images: [
      { src: "/gallery-intereco-home.webp", altZh: "界面生态主页首屏", altEn: "Intereco homepage hero" },
      { src: "/gallery-intereco-testimonials.webp", altZh: "创作者寄语", altEn: "Creator testimonials" },
      { src: "/gallery-intereco-footer.webp", altZh: "主页页脚", altEn: "Homepage footer" },
      { src: "/gallery-intereco-partners.webp", altZh: "合作项目", altEn: "Partnership projects" },
      { src: "/gallery-intereco-news.webp", altZh: "新闻中心", altEn: "News center" },
    ],
  },
  {
    name: "作品中心",
    nameEn: "Gallery",
    tagZh: "归档",
    tagEn: "archive",
    descZh: "界面生态附属项目，面向 PPT OS 爱好者的一站式作品中心。",
    descEn: "An Intereco sub-project — a one-stop gallery for PPT OS enthusiasts.",
    images: [
      { src: "/gallery-home.webp", altZh: "作品中心首页", altEn: "Works center home" },
      { src: "/gallery-post.webp", altZh: "作品详情", altEn: "Work details" },
      { src: "/gallery-user.webp", altZh: "个人主页", altEn: "Profile page" },
    ],
  },
  {
    name: "IPOA 赛事系统",
    nameEn: "IPOA Competition System",
    tagZh: "归档",
    tagEn: "archive",
    descZh: "界面生态附属项目，PPT OS 创意赛事 IPOA 的官方赛事平台。",
    descEn: "An Intereco sub-project — the official platform for IPOA, the creative PPT OS competition.",
    images: [
      {
        src: "/project-ipoa.webp",
        altZh: "IPOA 赛事系统首页：PPTOS 创意设计大赛",
        altEn: "IPOA competition site: PPTOS creative design contest",
      },
      { src: "/gallery-ipoa-home.webp", altZh: "IPOA 活动首页", altEn: "IPOA event dashboard" },
      { src: "/gallery-ipoa-submit.webp", altZh: "IPOA 作品提交", altEn: "IPOA work submission" },
      { src: "/gallery-ipoa-voting.webp", altZh: "IPOA 人气之星投票", altEn: "IPOA community voting" },
    ],
  },
  {
    name: "财务公开平台",
    nameEn: "Finance Disclosure",
    tagZh: "归档",
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
  roleZh: "创始人",
  roleEn: "Founder",
  descZh: "界面生态是国内最大的以 PPT OS 创意为核心的社区生态，汇聚创作者、作品和交流平台，曾推动 PPT 创意设计的发展。",
  descEn: "Intereco is China's largest community ecosystem centered on PPT OS creativity, bringing together creators, works and conversations, and has helped drive creative PPT design forward.",
  quote: {
    textZh: "界面生态是 PPT 圈少见的兴趣垂类社区，希望热爱 PPT 的大家在这里玩的开心，愿 PPT 兴趣圈人来人往，永不落幕。",
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
