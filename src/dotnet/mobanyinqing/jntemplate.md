---
title: JNTemplate
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jntemplate
slug: whfkv8x4c8s5qrzu
docsId: '113442774'
---

## 概述
极念模板引擎(JNTemplate)是一款完全国产的基于C#语言开发的跨平台的文本解析引擎（模板引擎），它能生成任何基于文本的内容，包括且不限于html,xml,css等,让前端展示与后端代码逻辑分离。同时，它也提供了一个在WebForm与Razor之外的选择！
JNTemplate所有代码全部开源，且具有最小的依赖关系，能轻松实现迁移与跨平台。同时，在满足我们开源协议的前提下，大家可以自由使用，分发，和用于商业目的（具体见License.txt）。
从2.0版本开始，引擎全面升级为编译型模板引擎，在性能上得到了更大的提升。

包下载量：45377

仓库地址：[https://gitee.com/jiniannet/jntemplate](https://gitee.com/jiniannet/jntemplate)

## 对比Razor
Razor做为微软官方视图引擎，在ASP.NET MVC中，它无疑是最好的选择。但是在某些场景，我们可能需要一款相对灵活，轻量的的模板引擎，所以他们之间是不冲突的。

## 操作
安装nuget包
```csharp
PM> Install-Package JinianNet.JNTemplate
```
