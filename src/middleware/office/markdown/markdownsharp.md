---
title: MarkdownSharp
lang: zh-CN
date: 2022-08-21
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: markdownsharp
slug: viq27q
docsId: '90168924'
---

## 概述
Markdown 处理器的开源 C## 实现，如 Stack Overflow 所示。

下载量：2.7M  最后更新时间：2018/10/28

## 操作
> 既然该包好久没更新了，那就只简单介绍吧

引用nuget包
```csharp
<PackageReference Include="MarkdownSharp" Version="2.0.5" />
```

### 基本使用
```csharp
var str = @"## 张三";
var markdown = new Markdown();
var result1 = markdown.Transform(str);
Console.WriteLine(result1);
```
经过简单使用，简单的文本转换还是可以的，但是遇到表格那些处理就有问题了， 
