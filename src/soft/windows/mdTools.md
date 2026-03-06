---
title: MD工具
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - 小软件介绍
tag:
  - 无
filename: mdgongju
---

## Typora
Typora 一款Markdown 编辑器和阅读器。

### Lapis主题
仓库地址：[https://github.com/YiNNx/typora-theme-lapis/](https://github.com/YiNNx/typora-theme-lapis/)

1. Clone 此仓库，或从 [Latest Release](https://github.com/YiNNx/typora-theme-lapis/releases/latest) 中下载typora-theme-lapis.zip并解压。
2. 在 Typora 菜单中选择 偏好设置 (Preferences) -> 找到外观部分，点击“打开主题文件夹”按钮。
3. 将 lapis.css & lapis-dark.css 文件和 lapis 文件夹复制到 Typora 的主题文件夹中。
4. 重启 Typora，然后从主题列表中选择 Lapis / Lapis Dark。

## marktext
一个简单而优雅的开源 Markdown 编辑器，专注于速度和可用性。

仓库地址：[https://github.com/marktext/marktext](https://github.com/marktext/marktext)

## pandoc

Pandoc 是一个由 John MacFarlane 开发的通用文档转换工具，可以支持大量标记语言之间的格式转换，例如 Markdown 、Microsoft Word、PowerPoint、 Jupyter Notebook、HTML、PDF、LaTeX、Wiki、EPUB 格式之间的相互转换。

> 官网：[https://pandoc.org/installing.html](https://pandoc.org/installing.html)
>
> 在线转换界面：[https://pandoc.org/try/](https://pandoc.org/try/)
> 参考文档：[https://blog.csdn.net/horses/article/details/108536784](https://blog.csdn.net/horses/article/details/108536784)

### 操作

将word转md或者将md转word

```csharp
-- word转md
pandoc D:\temp\111.docx -o D:\temp\aa.md
```
## Obsidian
黑曜石笔记软件

文档地址：[https://publish.obsidian.md/help-zh/%E7%94%B1%E6%AD%A4%E5%BC%80%E5%A7%8B](https://publish.obsidian.md/help-zh/%E7%94%B1%E6%AD%A4%E5%BC%80%E5%A7%8B)

### 插件

#### **Obsidian Git**
使用git实现多平台笔记同步

#### Custom File Explorer sorting
仓库地址：[https://github.com/SebastianMC/obsidian-custom-sort](https://github.com/SebastianMC/obsidian-custom-sort)

#### Copy Block Link
一个文件里引用另一个文件中的某个文本块

#### File Order
支持文件、文件夹各自拖拽排序

#### Bartender
支持拖拽文件、文件夹排序

参考文档：[https://zhuanlan.zhihu.com/p/611682978](https://zhuanlan.zhihu.com/p/611682978)

#### File Tree Alternative Plugin
全新的文件栏样式

#### Icon Folder
文件夹图标

#### CMenu
子菜单插件

#### 主题
Things

Obsidian Nord

Dracula for Obsidian

#### 同步
Remotely Save

支持坚果云等同步，可以手机上同步。

Obsidian Git

Git仓库同步

##  扩展

 ### markdown2pdf

 这款工具能够将你使用 markdown 编写的简历转换为 PDF 格式，而且完全**开源、免费**

markdown2pdf 提供了多种精美的模板供你选择，让你的简历更加专业、精美。无论你是要找工作、申请学校或者参加活动，这款工具都能满足你的需求。

使用 markdown2pdf 制作简历非常简单，只需要在工具中输入你的 markdown 代码，然后选择一个合适的模板，就可以快速生成一份高质量的 PDF 简历。同时，这款工具还支持自定义样式和布局，让你可以根据自己的需求进行灵活调整。

除了简历制作功能外，markdown2pdf 还提供了丰富的简历社区，让你可以分享自己的经历和作品，学习其他人的经验和方法，让你在求职路上更加自信、成功。



仓库地址：https://gitee.com/codeleilei/markdown2pdf

在线预览地址：https://codeleilei.gitee.io/markdown2pdf/#/home



自行部署（node版本 需要 ^16 || ^18 || ^19；）

```shell
# 如果你没有安装过 pnpm，需要按pnpm
npm install pnpm -g

# 安装依赖，进入 markdown-resume 文件夹，执行

pnpm install

# 执行
pnpm dev


# 打包
pnpm build

# 最后将dist目录部署到服务器即可
```

