---
title: htmldiff.net
lang: zh-CN
date: 2022-10-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: htmldiff_net
slug: ht1wx0
docsId: '100362936'
---

## 概述
一个基于.Net 4.5开发的对比Html文件、片段效果差异的项目。两份Html效果不一样的地方会通过颜色、删除线、背景色分别标记出来。
仓库地址：[https://github.com/Rohland/htmldiff.net](https://github.com/Rohland/htmldiff.net)

## 操作
安装nuget包
```csharp
<PackageReference Include="htmldiff.net" Version="1.4.0" />
```

### 基本操作
```csharp
var oldText = @"<p><i>This is</i> some sample text to <strong>demonstrate</strong></p>";

var newText = @"<p><i>This is</i> some sample text to <strong>asfafsfsafs</strong></p>";

var diffHelper = new HtmlDiff.HtmlDiff(oldText, newText);
Console.WriteLine(oldText);
Console.WriteLine(newText);

Console.WriteLine("-----------");
// Lets add a block expression to group blocks we care about (such as dates)
diffHelper.AddBlockExpression(new Regex(@"[\d]{1,2}[\s]*(Jan|Feb)[\s]*[\d]{4}", RegexOptions.IgnoreCase));

Console.WriteLine(diffHelper.Build());
```
