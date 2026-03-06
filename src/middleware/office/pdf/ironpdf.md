---
title: IronPdf
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: ironpdf
slug: ips6dsghdntdopms
docsId: '128415861'
---

## 概述
IronPDF帮助c#软件工程师在。net项目中创建、编辑和提取PDF内容。
官网：[https://ironpdf.com/](https://ironpdf.com/)

最近更新：2023.06.10
下载量：6.28(2023年6月24日)

## 操作

### html转pdf基础操作
```csharp
// 使用IronPDF将HTML字符串转换为PDF
var renderer = new HtmlToPdf();
renderer.PrintOptions.MarginTop = 0;
renderer.PrintOptions.MarginBottom = 0;
renderer.PrintOptions.MarginLeft = 0;
renderer.PrintOptions.MarginRight = 0;
var pdf = renderer.RenderHtmlAsPdf(htmlContent);

// 保存PDF文件
pdf.SaveAs("d://temp//11.pdf");
```

## 视频教程

[使用 IronPDF 和 Razor 视图在 .NET 中灵活地进行 PDF 报告](https://www.bilibili.com/video/BV1Et421G7gu?spm_id_from=333.1245.0.0)
