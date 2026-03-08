import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme.js";

//https://v2.vuepress.vuejs.org/zh/reference/config.html
export default defineUserConfig({

  // 设置网站的前缀地址
  base: "/knowledge/",

  // 不考虑多语言的布局
  lang: "zh-CN",
  title: "知识库",
  description: "一个知识库网站",

  theme,
  bundler: viteBundler({
    viteOptions: {
      server: {
        allowedHosts: [
          'localhost'  // 保留本地访问
        ]
      }
    }
  }),


  shouldPrefetch: false,
  plugins: [
    // searchProPlugin({
    //   // 索引全部内容
    //   indexContent: true
    // }),
  ],
  markdown: {
    // 资料：https://vuejs.press/zh/reference/config.html#markdown
    headers: {
      // 提取md标题的深度
      level: [2, 3, 4, 5]
    }
  },
  // 设置编译程序
  // bundler: viteBundler({
  //   viteOptions: {},
  //   vuePluginOptions: {},
  // }),
  head: [
    // 百度统计代码  参考文档：https://blog.csdn.net/baijiafan/article/details/126657618
    ['script', {}, `
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?1f046e495f9c28ef302f30895bda829e";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    `]
  ]

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
