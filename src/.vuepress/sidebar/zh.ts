import { sidebar } from "vuepress-theme-hope";
import { dotnetSidebar } from "./dotnet";
import { softSidebar } from "./soft";
import { liveSidebar } from "./live";
import { ormSidebar } from "./orm";
import { classicArticleSidebar } from "./classicArticle";
import { middlewareSidebar } from "./middleware";
import { dataBaseSidebar } from "./database";
import { webSidebar } from "./web";
import { computerBasicsSidebar } from "./computerBasics";
import { softwareDesignSidebar } from "./softwareDesign";
import { otherLanguageSidebar } from "./otherLanguage";
import { cloudSidebar } from "./cloud";

// 介绍文档 https://vuepress-theme-hope.gitee.io/v2/zh/guide/layout/sidebar.html
export const zhSidebar = sidebar({
  "/": [
    "",
    "intro",
  ],
  "/computerBasics/": computerBasicsSidebar,
  "/web/": webSidebar,
  "/dotnet/": dotnetSidebar,
  '/middleware/': middlewareSidebar,
  '/dataBase/': dataBaseSidebar,
  '/orm/': ormSidebar,
  '/cloud/': cloudSidebar,
  '/softwareDesign/': softwareDesignSidebar,
  "/otherLanguage/": otherLanguageSidebar,
  '/soft/': softSidebar,
  '/live/': liveSidebar,
  '/classicArticle/': classicArticleSidebar,
  '/interview/': "structure",
  '/temp/': "structure",
  '/aboutme/': [
    {
      text: "关于我",
      children:
        [
          "/aboutme/readme.md",
        ]
    }
  ],
});
