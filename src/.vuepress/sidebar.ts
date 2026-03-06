import { sidebar } from "vuepress-theme-hope";
import { dotnetSidebar } from "./sidebar/dotnet";
import { softSidebar } from "./sidebar/soft";
import { liveSidebar } from "./sidebar/live";
import { ormSidebar } from "./sidebar/orm";
import { classicArticleSidebar } from "./sidebar/classicArticle";
import { middlewareSidebar } from "./sidebar/middleware";
import { dataBaseSidebar } from "./sidebar/database";
import { webSidebar } from "./sidebar/web";
import { computerBasicsSidebar } from "./sidebar/computerBasics";
import { softwareDesignSidebar } from "./sidebar/softwareDesign";
import { otherLanguageSidebar } from "./sidebar/otherLanguage";
import { cloudSidebar } from "./sidebar/cloud";
import { aiSidebar } from "./sidebar/ai";

export default sidebar({
  "/": [
    "",
    "intro",
  ],
  "/computerBasics/": computerBasicsSidebar,
  "/web/": webSidebar,
  "/dotnet/": dotnetSidebar,
  '/middleware/': middlewareSidebar,
  '/ai/': aiSidebar,
  '/dataBase/': dataBaseSidebar,
  '/orm/': ormSidebar,
  '/cloud/': cloudSidebar,
  '/softwareDesign/': softwareDesignSidebar,
  "/otherLanguage/": otherLanguageSidebar,
  '/soft/': softSidebar,
  '/live/': liveSidebar,
  '/classicArticle/': classicArticleSidebar,
  '/interview/': "structure",
  '/prod/': "structure",
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
