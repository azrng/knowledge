---
title: 概述
lang: zh-CN
date: 2022-05-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: go8iu3
docsId: '78163499'
---

## 概述
配置系统支持丰富的配置源，包括文件(json\xml\ini等)、注册表、环境配置、命令行、Azure等，还可以配置自定义配置源。可以跟踪配置的改变，可以按照优先级覆盖。

## 常见环境

Development（开发环境） Production（生产环境） Staging（分阶段环境，测试环境）

## 配置提供者

常用的导入配置扩展方法有

```csharp
builder.Configuration
    .AddCommandLine(...)
    .AddEnvironmentVariables(...)
    .AddIniFile(...)
    .AddIniStream(...)
    .AddInMemoryCollection(...)
    .AddJsonFile(...)
    .AddJsonStream(...)
    .AddKeyPerFile(...)
    .AddUserSecrets(...)
    .AddXmlFile(...)
    .AddXmlStream(...);
```



