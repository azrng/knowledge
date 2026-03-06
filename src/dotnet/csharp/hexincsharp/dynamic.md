---
title: dynamic
lang: zh-CN
date: 2023-11-09
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: dynamic
slug: xayzz32wbfnmc23y
docsId: '146446271'
---
```csharp
dynamic dynemo = new ExpandoObject();
dynemo.name = "李思";
dynemo.age = 10;
dynemo.method = new Func<int, string>((i) => i.ToString() + "bbb");

Console.WriteLine(dynemo.age);
Console.WriteLine(dynemo.name);
Console.WriteLine(dynemo.method(12));
```
