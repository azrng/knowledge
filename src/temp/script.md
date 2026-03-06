---
title: 脚本
lang: zh-CN
date: 2024-04-28
publish: true
author:  azrng
isOriginal: false
category:
  - dotNet
tag:
  - 脚本
# 是否显示到列表
article: false
---

## GitHub的deploy-docs

用于在Github上使用工作流自动打包部署文档

```yaml

name: 部署文档

on:
  push:
    branches:
      # 确保这是你正在使用的分支名称
      - main

jobs:
  deploy-gh-pages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          # 如果你文档需要 Git 子模块，取消注释下一行
          # submodules: true

      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          #cache: pnpm

      - name: 安装依赖
        run: npm install -g pnpm && pnpm config set registry https://registry.npm.taobao.org && pnpm install

      - name: 构建文档
        env:
          NODE_OPTIONS: --max_old_space_size=8192
        run: |-
          pnpm run docs:build
          > src/.vuepress/dist/.nojekyll

      - name: 部署文档
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 这是文档部署到的分支名称
          branch: gh-pages
          folder: src/.vuepress/dist
```

