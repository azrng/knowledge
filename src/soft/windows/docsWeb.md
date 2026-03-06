---
title: 文档网站
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 005
category:
  - 小软件介绍
tag:
  - 无
filename: wendangwangzhan
---

## VuePress
Vue驱动的静态网站生成器

官网：[https://v2.vuepress.vuejs.org/zh/](https://v2.vuepress.vuejs.org/zh/)

示例网站：[https://www.apifox.cn/help/app/getting-started/](https://www.apifox.cn/help/app/getting-started/)

### vuepress-theme-hope主题
官网：https://theme-hope.vuejs.press/zh/

仓库地址：[https://github.com/vuepress-theme-hope/vuepress-theme-hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope)

项目升级：[https://theme-hope.vuejs.press/zh/cookbook/tutorial/command.html](https://theme-hope.vuejs.press/zh/cookbook/tutorial/command.html)

Markdown使用说明：https://theme-hope.vuejs.press/zh/cookbook/markdown/
使用示例：https://theme-hope.vuejs.press/zh/cookbook/markdown/demo.html




#### 布局配置

路径导航，默认开启关闭为
```csharp
breadcrumb: false
```
网址：https://theme-hope.vuejs.press/zh/guide/layout/navbar.html

#### 页面信息配置

信息 Frontmatter 配置：https://theme-hope.vuejs.press/zh/config/frontmatter/info.html

网址：https://theme-hope.vuejs.press/zh/guide/feature/page-info.html

#### Gitlab page

通过pnpm创建的项目，然后.gitlab-ci.yml内容为
```yaml
## 选择你要使用的 docker 镜像
image: docker-mirror.com/node:18-buster

pages:
  ## 每当 push 到 main 分支时触发部署
  only:
    - master

  ## 缓存 node_modules
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store

  ## 安装 pnpm
  before_script:
    - curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm@7
    - pnpm config set store-dir .pnpm-store

  ## 安装依赖并运行构建脚本
  script:
    - pnpm install --frozen-lockfile
    - pnpm docs:build --dest public

  artifacts:
    paths:
      - public
```

### vuepress-reco主题
官网：[http://v2.vuepress-reco.recoluan.com/](http://v2.vuepress-reco.recoluan.com/)

仓库：[https://github.com/vuepress-reco/vuepress-theme-reco](https://github.com/vuepress-reco/vuepress-theme-reco)

初始化
```csharp
## 安装1.x版本
npm install @vuepress-reco/theme-cli -g
theme-cli init

## 安装2.x版本
npm install @vuepress-reco/theme-cli@1.0.7 -g
theme-cli init
```
> 2022年8月24日当前时间该2.x环境只支持文档类型的风格脚本，所以还得先用1.0版本

其他问题处理
```csharp
//提示：theme-cli : 无法加载文件 C:\Users\user.LAPTOP-LBQ8556U\AppData\Roaming\npm\theme-cli.ps1
解决方案：管理员身份运行powersheel，然后执行set-ExecutionPolicy RemoteSigne，回车选择A
```

## docusaurus
快速构建以内容为核心的最佳网站。

1. 易于使用：Docusaurus 提供了简单易用的命令行工具和配置选项，使您可以轻松创建和维护知识库。
2. 自定义：Docusaurus 提供了可定制的主题，您可以根据您的品牌和需求进行外观和样式的自定义。
3. Markdown 支持：使用 Markdown 语法编写文档，方便快捷，并且支持代码高亮、表格、链接等常见的 Markdown 格式。
4. 搜索功能：Docusaurus 内置了全文搜索功能，帮助用户快速找到所需的信息。
5. 响应式布局：Docusaurus 的文档站点能够在不同的设备上提供出色的用户体验，包括桌面、平板和移动设备。
6. 版本控制：Docusaurus 支持多个版本的文档，可以轻松管理和切换不同版本的文档内容。
7. 社区支持：Docusaurus 拥有活跃的社区，您可以获得来自社区的帮助、贡献和扩展。

特色优点：支持文档分版本使用。

官网：[https://docusaurus.io/zh-CN/](https://docusaurus.io/zh-CN/)

中文文档：[https://www.docusaurus.cn/](https://www.docusaurus.cn/)

## Doks

官网地址：[https://getdoks.org/](https://getdoks.org/)

## Skyao

笔记风格静态网站<br />官网：[https://skyao.io/learning-hugo/](https://skyao.io/learning-hugo/)

## Docsy
官网：[https://www.docsy.dev/](https://www.docsy.dev/)

## docsify
使用这个工作来快速生成小型文档网站<br />官方文档：[https://docsify.js.org/#/zh-cn/](https://docsify.js.org/#/zh-cn/)<br />中文文档：[http://www.yii-china.com/docsify/quickstart.html](http://www.yii-china.com/docsify/quickstart.html)

### 操作

#### 基本操作
找个目录然后新建一个index.html文件，文件内容如下：
```html
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify/themes/vue.css">
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      //...
    }
  </script>
  <script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
</body>
</html>
```
然后在同目录下新建一个readme.md文件<br />然后整个技术文档都需要写到这个readme.md文件内，运行就可以看到技术文档页面

#### 评论功能
申请Gitalk：[https://github.com/settings/applications/new](https://github.com/settings/applications/new) ，完毕后拿到clientId等，然后修改自己的文档，如下<br />填写对应的信息，修改index文件
```csharp
<link rel="stylesheet" href="//unpkg.com/gitalk/dist/gitalk.css">

<script src="//unpkg.com/docsify/lib/plugins/gitalk.min.js"></script>
<script src="//unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script>
  const gitalk = new Gitalk({ 
    clientID: '刚刚申请下来的ID',
    clientSecret: '刚刚申请下来的密码',
    repo:'仓库名字，用于保存你博客评论的仓库，可以和你的博客是一个仓库',
    owner:你的Github名字,
    admin: ['你的Github名字和其他管理员的名字'],
    // facebook-like distraction free mode
    distractionFreeMode: false
  } )
</script>
```
打开index.html文件，把<link rel="stylesheet" href="//unpkg.com/gitalk/dist/gitalk.css">，这行代码，添加到<head>...</head>中
```csharp
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="description" content="Description">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
    <link rel="stylesheet" href="//unpkg.com/gitalk/dist/gitalk.css">  
</head>
```
然后把其他代码，插入到<body>...</body>中
```csharp
<body>
  <div id="app">正在努力加载中~</div>
  <script>
    window.$docsify = {    
      name: 'Blog',
      repo: 'https://github.com/yangyang0126',  //开启github图标
     ****
    } 
  </script>
  <script src="//unpkg.com/docsify/lib/docsify.min.js"></script>  

  <!--插入“gitalk评论”模块-->
  <script src="//unpkg.com/docsify/lib/plugins/gitalk.min.js"></script>
  <script src="//unpkg.com/gitalk/dist/gitalk.min.js"></script>
  <script>
    const gitalk = new Gitalk({ 
      clientID: '1****************6',
      clientSecret: '9****************************d',
      repo: 'blog',
      owner: 'yangyang0126',
      admin: ['yangyang0126'],
      id: location.pathname,      // Ensure uniqueness and length less than 50
      distractionFreeMode: false  // Facebook-like distraction free mode
    } )
  </script>

</body>
```
然后就可以网页预览了。


## showDoc
一个API文档、技术文档工具

官方地址：[https://www.showdoc.com.cn/](https://www.showdoc.com.cn/)

## Logseq

连接您的笔记，增加理解

官网：[https://www.logseq.com/](https://www.logseq.com/)

## vanblog

VanBlog 是一款简洁实用优雅的高性能个人博客系统。支持 HTTPS 证书全自动按需申请、黑暗模式、支持移动端自适应和评论，内置流量统计与图床，内嵌评论系统，配有完备的、支持黑暗模式、支持移动端、支持一键上传剪切板图片到图床、带有强大的编辑器的后台管理面板。(后台管理、数据库保存)

主页：https://vanblog.mereith.com/

介绍：https://vanblog.mereith.com/intro.html

## MrDoc

MrDoc 是基于 Python 语言编写的 Web 应用，并且基于GPLv3开源协议托管在了 GitHub 和 Gitee 上。只要是能够运行 Python 的计算机上（Windows、Linux、macOS），都可以部署 MrDoc。并且借助于 Docker，还能在群晖、电视盒子等设备上进行部署。数据完全存储在自己的计算机设备中，应用完全运行在自己的网络中。

源码地址：

GitHub：[https://github.com/zmister2016/MrDoc](https://github.com/zmister2016/MrDoc)

Gitee：[https://gitee.com/zmister/MrDoc](https://gitee.com/zmister/MrDoc)

文档手册：[https://doc.mrdoc.pro/](https://doc.mrdoc.pro/)

### 其他部署方式

- [Docker镜像](https://registry.hub.docker.com/r/jonnyan404/mrdoc-nginx)
- [Linux一键部署脚本](https://gitee.com/jonnyan404/oh-my-mrdoc)
- [Windows部署面板](https://gitee.com/debj031634/win-django)

#### docker部署
```markdown
// 拉取镜像并启动容器
docker run -d --name mrdoc -p 10086:10086 jonnyan404/mrdoc-nginx

// 创建管理员账户
docker exec -it mrdoc python manage.py createsuperuser

// 修改用户密码
docker exec -it mrdoc python manage.py changepassword 用户名
```

### Trilium Notes
Trilium Notes 是一个分层笔记应用程序，专注于构建大型个人[知识库](https://so.csdn.net/so/search?q=%E7%9F%A5%E8%AF%86%E5%BA%93&spm=1001.2101.3001.7020)。支持双向链接、标签、任务待办、图谱、统计、数学公式、加密、定制插件、本地存储、网页剪辑、跨平台支持，有 Linux，macOS 和 Windows客户端。支持相当丰富的 markdown，包括 mermaid 和 latex，而且即时渲染，和 typora 一样。支持代码类型的笔记，有高亮。  Trilium与其说是笔记软件，不如说是个人wiki。

GitHub：https://github.com/zadam/trilium

教程地址：[https://trilium.netlify.app](https://trilium.netlify.app)

docker部署

汉化版镜像：[https://github.com/Nriver/trilium-translation](https://github.com/Nriver/trilium-translation)

仓库地址：https://dotnet.github.io/docfx/

## astro

Starlight 是 [Astro](https://astro.build/) 的文档网站框架。该项目是基于 Astro 框架打造的文档主题，可用于快速搭建和部署文档网站。它界面美观、开箱即用、访问速度快，支持网站导航、搜索、国际化、SEO 和各种插件

仓库地址：[https://github.com/withastro/starlight](https://github.com/withastro/starlight)

文档地址：[https://astro.build/](https://astro.build/)
