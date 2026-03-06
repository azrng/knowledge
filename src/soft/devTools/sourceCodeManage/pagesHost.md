---
title: 静态托管网站
lang: zh-CN
date: 2023-09-10
publish: true
author: xxyopen
category:
  - Git
tag:
  - pages
filename: pagesHost
---

## Gitee Pages

简介：国内最大的代码托管平台。

优点：稳定性强，由于服务器位于上海，国内访问速度非常快。

缺点：仓库的最大容量和单个文件大小有限制，对仓库内容非常敏感，需要实名认证，自定义域名和自动部署都需要收费。

个人观点：Gitee Pages 非常适合不需要自定义域名并且网站内容少、内容几乎不变的场景，例如[小说精品屋官网](https://xiongxyang.gitee.io/)。由于 Gitee Pages 对仓库内容非常敏感，每次部署前都会对仓库内容进行检查，部署博客的话会经常遇到部署失败的情况，而且内容校验规则也会发生变化，如果网站内容比较多，有时候排查整改起来会比较麻烦，所以建博客我现在几乎不考虑使用 Gitee Pages 了。

👉 [前往官网](https://gitee.com/)

## GitHub Pages

简介：全球最大的代码托管平台。

优点：稳定性强，部署简单，使用方便，支持自定义域名。

缺点：国内访问速度一般，拒绝百度爬虫访问。

个人观点：如果不想太折腾并且对百度收录没有要求的话可以选择 GitHub Pages。

👉 [前往官网](https://github.com/)

文档地址：https://docs.github.com/zh

## Vercel

简介：一个开箱即用的网站托管服务，全球都拥有 CDN 节点，支持自定义域名和自动部署，前身叫 ZEIT。

优点：国内访问速度比 Github Pages 和 Cloudflare Pages 要快，支持自定义域名和自动部署。

缺点：构建次数和构建时长有限制，每月带宽限制 100G。

个人观点：博客托管的最终选择，国内访问速度是除了 Gitee Pages 外目前使用过最快的，[个人博客](https://www.xxyopen.com/)现已托管到 Vercel 上。

👉 [前往官网](https://vercel.com/)

## Cloudflare Pages

简介：Cloudflare 推出的全新网页托管服务。

优点：不限站点数、请求数和带宽，全球都拥有 CDN 节点，支持自定义域名和自动部署。

缺点：国内访问速度和稳定性一般，每月构建次数、文件数量和大小都有限制。

个人观点：放弃 Gitee Pages 和 GitHub Pages 后的一个选择，稳定性不好，经常超时，不过有时候挺快的。

👉 [前往官网](https://pages.cloudflare.com/)

## 其它静态网站托管平台

其它常见的托管平台还有：

- [Coding Pages](https://coding.net/)：被腾讯收购，收费，送代金劵可以试用几个月
- [Netlify](https://netlify.com/)： 国外、免费，国内访问速度还可以，但和 Vercel 一样，带宽限制为每月 100G，可作为 Vercel 的替代方案
- [CloudBase 静态网站托管](https://cloud.tencent.com/document/product/876/40270)：腾讯云推出的静态网站托管服务，收费
- [zeabur](https://zeabur.com/zh-CN/pricing)

## 来源

内容来自：https://www.xxyopen.com/2022/07/19/tools/pages_host.html
