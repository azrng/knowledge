---
title: 说明
lang: zh-CN
date: 2023-08-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - sg
---

## 概述

> 已经被[弃用](https://github.com/dotnet/roslyn/blob/main/docs/features/source-generators.md)，后续使用[增量生成器](https://github.com/dotnet/roslyn/blob/main/docs/features/incremental-generators.md)

微软在.Net5中引入Source Generator(源码生成器)新特性，通过Source Generator可以实现在应用编译的期间根据当前编译信息动态生成代码，而且可以在我们的c#代码汇总直接引用动态生成代码。
源代码生成器(Source Generators) 是一段在编译过程中运行的代码，可以根据程序中的代码来生成其他文件，这些文件可以与其余代码一起编译。

官网：[https://learn.microsoft.com/zh-cn/dotnet/csharp/roslyn-sdk/source-generators-overview](https://learn.microsoft.com/zh-cn/dotnet/csharp/roslyn-sdk/source-generators-overview)



## 使用场景
使用 Source Generators，可以做到这些事情：

- 获取一个 Compilation 对象，这个对象表示了所有正在编译的用户代码，你可以从中获取 AST 和语义模型等信息
- 可以向 Compilation 对象中插入新的代码，让编译器连同已有的用户代码一起编译

Source Generators 作为编译过程中的一个阶段执行：
编译运行 -> [分析源代码 -> 生成新代码] -> 将生成的新代码添加入编译过程 -> 编译继续。
上述流程中，中括号包括的内容即为 Source Generators 所参与的阶段和能做到的事情，如下图所示。
![来自官方 dotnet Youtube 频道的图表](/dotnet/b6034d87ce1249f399bc7bf974d0cf4d.png)

## 优点

获得的主要好处之一是减少编写相似代码所花费的时间和精力。您可以在项目的关键方面使用相同的时间。编译器识别生成代码中的错误，从而生成更强大的应用程序。由于代码生成发生在构建过程中在应用程序内，因此不会产生运行时成本。

## 操作

> 编译器扩展应在面向 netstandard2.0 的程序集中实现

在项目中间的PropertyGroup节中新增

```
<EmitComplierGeneratedFiles>true</EmitComplierGeneratedFiles>
```

节就可以输出生成的文件到obj文件夹。

## 示例

* 使用 Source Generator 自动生成 WEB API：[https://mp.weixin.qq.com/s/b-S4PsVYfwBvnf0oxDg8vQ](https://mp.weixin.qq.com/s/b-S4PsVYfwBvnf0oxDg8vQ)
* [根据 HTTPAPI 接口自动生成实现类](https://github.com/huiyuanai709/SourceGeneratorPower)：[https://www.cnblogs.com/huiyuanai709/p/source-generators-httpclient.html](https://www.cnblogs.com/huiyuanai709/p/source-generators-httpclient.html)

## 参考文档

[https://medium.com/c-sharp-progarmming/mastering-at-source-generators-18125a5f3fca](https://medium.com/c-sharp-progarmming/mastering-at-source-generators-18125a5f3fca) | 在源生成器中母带制作 |作者：Enis Necipoğlu |C#编程

https://mp.weixin.qq.com/s/3h5vQ0JKjYTrtOP3VUoupA | 浅谈源代码生成技术（Source Generators）

.Net Core 你必须知道的source-generators：https://mp.weixin.qq.com/s/rfaE9XbNWWL9kfK8N1ZHVw

## 资料

源生成器系列文章：[https://andrewlock.net/series/creating-a-source-generator/](https://andrewlock.net/series/creating-a-source-generator/)

https://mp.weixin.qq.com/s/0F6-wydMQL_vrwgJlIR8qg  将json文件转换为类

探索 C# 中的源生成器：真实示例：https://blog.elmah.io/exploring-source-generators-in-c-real-world-examples/

dotnet 源代码生成器分析器入门 ：https://www.cnblogs.com/lindexi/p/18786647
