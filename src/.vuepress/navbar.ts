import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { text: "计算机基础", link: "/computerBasics/" },  // 注释
  { text: "Web", link: "/web/" },
  { text: "dotNet", link: "/dotnet/" },  // 注释
  { text: '中间件', link: '/middleware/' },  // 注释
  { text: 'AI', link: '/ai/' },  // 注释
  { text: '数据库', link: '/dataBase/' },  // 注释
  { text: 'ORM', link: '/orm/' },
  { text: '软件设计', link: '/softwareDesign/' },  // 注释
  { text: '云原生', link: '/cloud/' },
  { text: '其他语言', link: '/otherLanguage/' },  // 注释
  { text: '软件', link: '/soft/softCollection.md' },
  // { text: '面试', link: '/interview/' },  // 注释
  { text: "组件文档", link: "https://azrng.github.io/nuget-docs/" },
  { text: '文章', link: '/classicArticle/' },
  { text: '生活', link: '/live/' },
  // { text: "临时", link: "/temp/" },  // 注释
  { text: "关于", link: "/aboutme/readme.md" },
]);