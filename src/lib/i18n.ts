export type Locale = "zh" | "en";

export const dictionaries = {
  zh: {
    hero: {
      title: "Hi, I'm Han.",
      description:
        "一名学生、开发者与设计师。喜欢用设计把事情做得简洁、好用又好看，目前主要探索 Web 开发与 AI 应用。",
      ctaAbout: "关于",
      ctaGithub: "GitHub",
      terminal: {
        whoami: "whoami",
        han: "Han",
        catBio: "cat bio.txt",
        bio1: "大一在读 / 西安",
        lsSkills: "ls -la skills/",
        lsOutput: "drwxr-xr-x 前端 设计 运维",
        curl: "curl -s https://www.hhan.me",
      },
    },
    about: {
      title: "关于",
      description:
        "一名来自中国的大学学生，同时是一名开发者与设计师。平时喜欢折腾各种小项目，把想法从草图变成可用的产品。我关注简洁、克制的设计，也相信好的工具应该让人更专注。",
      personality: "INFJ · 提倡者",
      skills: "技能",
      tools: "开发工具",
    },
    services: {
      title: "专注领域",
      items: [
        { title: "开发运维", options: ["开发", "运维"] },
        { title: "科技数码", options: ["科技", "数码"] },
        { title: "创意设计", options: ["平面设计", "UI/UX", "产品设计", "PowerPoint", "版式设计"] },
        { title: "影像创作", options: ["摄影", "航拍", "视频剪辑"] },
      ],
    },
    projects: {
      title: "项目",
      affiliated: "附属项目",
    },
    contributions: {
      title: "贡献",
      tooltipEmpty: "无贡献 · {date}",
      tooltipCount: "{count} 次贡献 · {date}",
    },
    contact: {
      title: "联系",
    },
    backToTop: "回到顶部",
    cmdk: {
      placeholder: "搜索板块或操作…",
      empty: "没有找到相关结果",
      nav: "板块",
      actions: "操作",
      links: "外链",
      copyEmail: "复制邮箱",
      emailCopied: "邮箱已复制",
      toggleTheme: "切换深浅色主题",
      toggleLang: "切换语言",
    },
    meta: {
      title: "Han — Student · Developer · Designer",
      description:
        "一名学生、开发者与设计师。喜欢用设计把事情做得简洁、好用又好看，目前主要探索 Web 开发与 AI 应用。",
    },
  },
  en: {
    hero: {
      title: "Hi, I'm Han.",
      description:
        "A student, developer and designer. I enjoy making things simple, useful and beautiful with design, currently exploring Web Development and AI.",
      ctaAbout: "About",
      ctaGithub: "GitHub",
      terminal: {
        whoami: "whoami",
        han: "Han",
        catBio: "cat bio.txt",
        bio1: "First-year Undergraduate / Xi'an",
        lsSkills: "ls -la skills/",
        lsOutput: "drwxr-xr-x frontend design ops",
        curl: "curl -s https://www.hhan.me",
      },
    },
    about: {
      title: "About",
      description:
        "A university student from China, also a developer and designer. I love tinkering with small projects and turning ideas from sketches into usable products. I care about concise, restrained design and believe good tools should help people stay focused.",
      personality: "INFJ · Advocate",
      skills: "Skills",
      tools: "Tools",
    },
    services: {
      title: "Focus",
      items: [
        { title: "DevOps", options: ["Development", "Operations"] },
        { title: "Tech & Digital", options: ["Tech", "Digital"] },
        { title: "Creative Design", options: ["Graphic Design", "UI/UX", "Product Design", "PowerPoint", "Layout"] },
        { title: "Visual Creation", options: ["Photography", "Aerial", "Video Editing"] },
      ],
    },
    projects: {
      title: "Projects",
      affiliated: "Affiliated",
    },
    contributions: {
      title: "Contributions",
      tooltipEmpty: "No contributions on {date}",
      tooltipCount: "{count} contributions on {date}",
    },
    contact: {
      title: "Contact",
    },
    backToTop: "Back to top",
    cmdk: {
      placeholder: "Search sections and actions…",
      empty: "No results found.",
      nav: "Sections",
      actions: "Actions",
      links: "Links",
      copyEmail: "Copy email",
      emailCopied: "Email copied",
      toggleTheme: "Toggle theme",
      toggleLang: "Toggle language",
    },
    meta: {
      title: "Han — Student · Developer · Designer",
      description: "A student, developer and designer from China. Documenting learning and creation.",
    },
  },
} as const;
