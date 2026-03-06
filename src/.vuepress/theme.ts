import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

// 主题
export default hopeTheme({
  hostname: "https://azrng.gitee.io/kbms/",
  // 作者信息
  author: {
    name: "AZRNG",
    url: "https://azrng.gitee.io",
  },

  //网站logo
  logo: "/logo.svg",

  //repo: "azrng/kbms", //默认为 GitHub. 同时也可以是一个完整的 URL
  // docsDir: "docs",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页面信息 作者 是否原创  写作日期  分类 标签 字数
  // pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime", "Word"],

  // // 自定义导航栏布局 https://theme-hope.vuejs.press/zh/guide/layout/navbar.html#布局配置
  // navbarLayout: {
  //   start: ["Brand"],
  //   center: ["Links"],
  //   end: ["Outlook", "Search"],
  // },

  // 主题颜色
  // themeColor: true,

  // 是否显示全屏按钮
  // fullscreen: true,

  // 禁用底部栏
  displayFooter: true,

  // 博客相关
  blog: {
    name: "Azrng",
    timeline: "知识库",
    description: "一个.NET开发者",
    intro: "/intro.html",
    // 友链小图标
    medias: {
      Gitee: "https://gitee.com/AZRNG",
      GitHub: "https://github.com/AZRNG",
    },
  },

  // 标题深度 默认是2
  // headerDepth: 4,
  encrypt: {
    // 加密全站
    global: true,
    admin: {
      password: process.env.VUEPRESS_ENCRYPT_PASSWORD || "123456", // 也可以是数组
      hint: "请输入密码"
    }

    // 加密部分页面
    // config: {
    //   "/computerBasics/": ["195413"],
    //   "/dataBase/": ["195413"],
    //   "/softwareDesign/": ["195413"],
    //   "/cloud/": ["195413"],
    //   // "/interview/": ["195413"],
    //   "/otherLanguage/": ["195413"],
    // },
  },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // https://theme-hope.vuejs.press/zh/config/theme/layout.html#pageinfo
  // 是否显示编辑者
  contributors: false,

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,

    // 取消注释它们如果你需要 TeX 支持
    // markdownMath: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    // 是否启用博客状态，true开启
    blog: true,

    // 在启用之前需要安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务器，在生产环境中请自行部署并使用自己的服务器！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: ["Badge", "VPCard"],
    },
    icon: {
      assets: "fontawesome-with-brands"
    }

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
