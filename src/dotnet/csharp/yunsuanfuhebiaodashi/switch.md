---
title: switch
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: switch
slug: xez2zr
docsId: '53965350'
---

### 范围判断
老版本写法
```csharp
var num = 8;
switch (num)
{
    case int a when (1 < a && a < 6):
        Console.WriteLine("aa");
        break;
    case int b when (7 < b && b < 9):
        Console.WriteLine("bb");
        break;
}
```
新版本写法(C#9+)
```csharp
var num = 8;
switch (num)
{
    case < 6 and > 1:
        Console.WriteLine("aa");
        break;
    case > 7 and < 9:
        Console.WriteLine("bb");
        break;
}
```
