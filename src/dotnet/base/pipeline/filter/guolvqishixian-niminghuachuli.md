---
title: 过滤器实现-匿名化处理
lang: zh-CN
date: 2022-07-19
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-niminghuachuli
slug: eb2wcg
docsId: '65757284'
---

## 目的
通过返回过滤器实现对返回结果匿名化的实现。

## 操作
引用辅助包
```csharp
<PackageReference Include="AzrngCommon" Version="1.2.6" />
```
> 主要使用该包内的返回类

返回过滤器
需要补充
全局使用
```csharp
builder.Services.AddControllers(option =>
{
    //添加全局过滤器
    option.Filters.Add(typeof(CustomExceptionFilter));
});
```

## 总结
不能拦截处理Action以外的错误。
