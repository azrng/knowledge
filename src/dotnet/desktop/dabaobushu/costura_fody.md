---
title: Costura.Fody
lang: zh-CN
date: 2022-08-10
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: costura_fody
slug: lrp0xz
docsId: '89106871'
---

## 概述
一个nuget包，安装后再生成项目，就会在debug目录下生成一个可以独立运行的exe文件。

## 操作
安装nuget包
```csharp
<PackageReference Include="Costura.Fody" Version="5.7.0">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
</PackageReference>
```
