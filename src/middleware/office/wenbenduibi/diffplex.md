---
title: DiffPlex
lang: zh-CN
date: 2023-07-10
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: diffplex
slug: qq65cu
docsId: '100490226'
---

## 介绍
DiffPlex 是一个使用 C## 开发的开源文本差异对比组件，支持在控制台、Web、Winform、WPF 项目中使用。
项目地址：[https://github.com/mmanela/diffplex](https://github.com/mmanela/diffplex)

## 操作
安装nuget包
```csharp
<PackageReference Include="DiffPlex" Version="1.7.1" />
```

### 基本操作
```csharp
var before = $@"
春种一粒粟，
秋收万颗子。
四海无闲田，
农夫犹饿死。
";

var after = $@"
春种一粒粟，
秋收万颗子。
谁知盘中餐，
粒粒皆辛苦。
";

var diff = InlineDiffBuilder.Diff(before, after);

var savedColor = Console.ForegroundColor;
foreach (var line in diff.Lines)
{
    switch (line.Type)
    {
        case ChangeType.Inserted:
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("+ ");
            break;
        case ChangeType.Deleted:
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("- ");
            break;
        default:
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.Write("  ");
            break;
    }

    Console.WriteLine(line.Text);
}
Console.ForegroundColor = savedColor;
```
