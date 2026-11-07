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
    name: "界面生态作品中心",
    nameEn: "Intereco Works Center",
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
];

/** 精选项目：非 GitHub 仓库的社区项目，静态维护 */
export type FeaturedProject = {
  name: string;
  nameEn: string;
  roleZh: string;
  roleEn: string;
  descZh: string;
  descEn: string;
  quotes: {
    textZh: string;
    textEn: string;
    author: string;
    titleZh: string;
    titleEn: string;
    avatar: string;
  }[];
};

export const FEATURED_PROJECT: FeaturedProject = {
  name: "界面生态",
  nameEn: "Intereco",
  roleZh: "创始人",
  roleEn: "Founder",
  descZh: "界面生态是国内最大的以 PPT OS 创意为核心的社区生态，汇聚创作者、作品和交流平台，曾推动 PPT 创意设计的发展。",
  descEn: "Intereco is China's largest community ecosystem centered on PPT OS creativity, bringing together creators, works and conversations, and has helped drive creative PPT design forward.",
  quotes: [
    {
      textZh: "界面生态是 PPT 圈少见的兴趣垂类社区，希望热爱 PPT 的大家在这里玩的开心，愿 PPT 兴趣圈人来人往，永不落幕。",
      textEn: "Intereco is one of the few communities dedicated to PPT enthusiasts. I hope everyone who loves PPT enjoys their time here, and that the community keeps welcoming new faces for years to come.",
      author: "安逸",
      titleZh: "「安逸PPT」账号主理人，金山最具价值专家(KVP)，微软国际办公认证MOS-PPT专家，51PPT模板网大设计师",
      titleEn: "Founder of AnyiPPT, Kingsoft Most Valuable Professional (KVP), Microsoft Office Specialist (MOS-PPT), and distinguished designer at 51PPT",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=1559655822&s=640",
    },
    {
      textZh: "界面生态再次汇聚了 PPTOS 生态圈中的朋友们，也为这个社区注入了新的活力。让我重新感受到，这个圈子正在逐渐恢复往日热闹的同时，焕发出新的生机。",
      textEn: "Intereco has brought friends from the PPTOS community together again and given the community fresh energy. It feels like the old buzz is returning, and something new is growing alongside it.",
      author: "JesseGary",
      titleZh: "圈内知名创作者",
      titleEn: "Well-known community creator",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=2257814288&s=640",
    },
    {
      textZh: "界面生态是国内领先的 PPTOS 生态圈，以其权威性、优质内容和完善体系著称。这里汇聚了专业的资源与服务，为开发者与用户提供全面支持，是构建PPTOS与应用的理想平台。可以说，界面生态把 PPTOS 这个小众圈子粘合起来了，期待这个平台可以为更多优秀的作品赋能。",
      textEn: "Intereco is a leading PPTOS community in China, known for its expertise, quality content, and well-developed ecosystem. It brings together resources and services that help people build and use PPTOS projects. It has brought this niche community together, and I hope it helps more great work find an audience.",
      author: "汪凯",
      titleZh: "Tuling 系列作者",
      titleEn: "Creator of the Tuling series",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=1377022612&s=640",
    },
    {
      textZh: "在这里，我又感受到了这个圈子曾经的火热。愿这份狂热能够继续燃烧，让一代代成长起来的新人们传递下去。",
      textEn: "Here I felt the excitement this community once had. I hope that passion keeps burning and that each new generation of creators carries it forward.",
      author: "戌犬·朱狼",
      titleZh: "圈内知名创作者，Taurus UI 系列作者",
      titleEn: "Well-known community creator and author of the Taurus UI series",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=3171933229&s=640",
    },
    {
      textZh: "无论是汇聚行业内的优质资源，还是支撑开发者的创新需求，界面生态有效整合了 PPTOS 生态，再次将分散的力量凝聚成了协同发展的整体。界面生态绝对是构建和推广 PPTOS 相关应用的首选基石，我们期待它能持续发挥这样的作用，为更多后来的优质作品提供成长的沃土与强劲的动力。",
      textEn: "By bringing together good resources and supporting new ideas from developers, Intereco has reunited the PPTOS ecosystem around shared goals. It is a strong foundation for building and promoting PPTOS apps. We hope it continues giving future projects the support and momentum they need to grow.",
      author: "临空牧野",
      titleZh: "Rivulet Lab 创办人，Elegant OS 作者",
      titleEn: "Founder of Rivulet Lab and creator of Elegant OS",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=334199214&s=640",
    },
    {
      textZh: "界面生态聚焦于 PPT OS 界面设计赛道，填补了该领域长期缺乏专属交流社区的空白。特别是对于刚接触这一领域的新人来说，这里没有过高的专业门槛，只有愿意分享的同好——这种精准定位本身，就是它现阶段最核心的价值所在。",
      textEn: "Intereco gives PPT OS interface designers a dedicated place to talk and share work. For newcomers in particular, it offers an approachable way in and a community willing to share what it knows. That focus is its greatest value today.",
      author: "2333",
      titleZh: "OK Team 创始人，Echo OS 作者",
      titleEn: "Founder of OK Team and creator of Echo OS",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=2331829908&s=640",
    },
  ],
};
