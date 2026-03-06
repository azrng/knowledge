# 知识库

请查看此自述文件以了解如何帮助参与撰写本文档。

## 请安装以下工具

* [Git](https://git-scm.com/download)
* [Node.js](https://nodejs.org/zh-cn/download/)（本地开发，可选）
* [Docker Desktop for Mac and Windows](https://www.docker.com/products/docker-desktop)（本地开发，可选）
* [Docker Compose](https://docs.docker.com/compose/install/)（本地开发，可选）
* [Visual Studio Code](https://code.visualstudio.com/Download)（文档编辑，可选）
* [Typora](https://typora.io/)（文档编辑，可选）

## 调试方式（两种方式任选其一）

1. docker

   ```shell
   $ docker-compose up
   ```

2. Node.js

   ```shell
   $ npm install -g pnpm
   $ pnpm install
   $ pnpm run docs:dev
   ```

3. 在浏览器打开`http://localhost:9000/`

## 编写文档注意事项

* 文档的内容都在src下
* 网站首页的修改去修改src/README.md文件
* 想在头部增加导航栏去修改src/.vuepress/navbar/zh.ts文件

## 启用博客样式

* 在README.md中启用*layout: BlogHome*
* 在README.md中启用背景图*bgImage: home.png*
* 设置theme.ts中plugins.blog值为true