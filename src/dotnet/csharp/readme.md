---
title: 说明
lang: zh-CN
date: 2023-11-17
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: readme
slug: mo6dt2
docsId: '30990306'
---

## 描述
C#(C Sharp)是一门编程语言，.Net就是应用程序运行的执行环境。  系统瓶颈关键是：硬件配置、网络带宽、系统架构（分布式、集中式）、外部负载。  

官网文档：[https://learn.microsoft.com/zh-cn/dotnet/csharp/ ](https://learn.microsoft.com/zh-cn/dotnet/csharp/)   

编码约定：[https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/coding-style/coding-conventions](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/coding-style/coding-conventions)  

搜索代码片段：[https://www.dotnetperls.com/](https://www.dotnetperls.com/)


## 语言版本
自定义当前项目的语言版本：[https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/configure-language-version](https://docs.microsoft.com/zh-cn/dotnet/csharp/language-reference/configure-language-version) 

### 低版本框架使用高版本语言特性

1. 更新 Visual Studio：确保你的 Visual Studio 至少更新到支持 C# 12 的版本。这通常意味着使用 Visual Studio 2022 的最新版本。
2. 编辑项目文件：手动编辑你的 .csproj 文件，将 C# 语言版本设置为 12。这可以通过添加或修改 `<LangVersion>` 标签来实现。

```csharp
<PropertyGroup>
  <LangVersion>12.0</LangVersion>
</PropertyGroup>
```

当然如果安装的VS2022的最新preview版本你还可以把版本号直接设置为`latest`以支持比12.0更高的语言版本

## 文档注释
[https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/documentation-comments](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/documentation-comments) | Documentation comments - C## language specification | Microsoft Learn

## 书籍推荐
```csharp
算法推荐初级看算法图解和大话数据结构

.net core web开发  推荐看蒋老师写的框架揭秘

进阶一点的，C#本质论、CLR via C## 

1、算法导论
2、深入理解计算机系统
3、计算机理论导论
4、编译原理
5、计算机程序的构造与解释
6、现代操作系统



原理类：
Windows程序设计、Windows核心编程、Windows内核原理与实现、Windows内核安全编程、
Windows网络与通信程序设计
Linux内核设计与实现、unix环境高级编程
数据库系统概念、数据库系统实现
Windows驱动开发技术详解

语言：
1、明解C语言、Essential C++
2、C++程序设计原理与实践
3、C++ Primer 英文版（中翻有问题，顺便练一下英语呗）
4、Effective C++
5、C++编程剖析

逆向：
1、Windows环境下32位汇编程序语言设计
2、逆向工程揭秘
3、从汇编语言到Windows内核编程
4、加密与解密
5、C++反汇编与逆向分析技术解密
6、0Day安全：软件漏洞分析技术
7、IDA Pro权威指南
8、Windows PE 权威指南
9、黑客反汇编揭秘

算法：
算法图解、大话数据结构、算法导论

网络：
TCP/IP详解
Unix网络编程
```

## 文件的含义

```csharp
Bin 目录用来存放编译的结果，bin是二进制binrary的英文缩写，因为最初C编译的程序文件都是二进制文件，它有Debug和Release两个版本，分别对应的文件夹为bin/Debug和bin/Release，这个文件夹是默认的输出路径，我们可以通过：项目属性—>配置属性—>输出路径来修改。
obj是object的缩写，用于存放编译过程中生成的中间临时文件。其中都有debug和release两个子目录，分别对应调试版本和发行版本，在.NET中，编译是分模块进行的，编译整个完成后会合并为一个.DLL或.EXE保存到bin目录下。因为每次编译时默认都是采用增量编译，即只重新编译改变了的模块，obj保存每个模块的编译结果，用来加快编译速度。是否采用增量编译，可以通过：项目属性—>配置属性—>高级—>增量编译来设置。
Properties文件夹 定义你程序集的属性 项目属性文件夹 一般只有一个 AssemblyInfo.cs 类文件，用于保存程序集的信息，如名称，版本等，这些信息一般与项目属性面板中的数据对应，不需要手动编写。
.cs 类文件。源代码都写在这里，主要就看这里的代码。
.resx 资源文件，一些资源存放在这里，一般不需要看。
.csproj C#项目文件，用VS打开这个文件就可以直接打开这个项目，自动生成，不需要看。
.csproj.user 是一个配置文件，自动生成的，会记录项目生成路径、项目启动程序等信息。也不需要看。
.Designer.cs 设计文件，自动生成，不需要看。
.aspx 是网页文件，HTML代码写在这里面。
sln:在开发环境中使用的解决方案文件。它将一个或多个项目的所有元素组织到单个的解决方案中。此文件存储在父项目目录中.解决方案文件，他是一个或多个.proj（项目）的集合
*.sln：(Visual Studio.Solution) 通过为环境提供对项目、项目项和解决方案项在磁盘上位置的引用,可将它们组织到解决方案中。
比如是生成Debug模式,还是Release模式,是通用CPU还是专用的等
```

> 资料来源：微信公众号【**dotNET编程大全**】 

## 参考文章

c#高级编程第11版系列博客：[https://www.cnblogs.com/zenronphy/p/ProfessionalCSharp7.html](https://www.cnblogs.com/zenronphy/p/ProfessionalCSharp7.html)
dotnet资源大全中文版：[https://www.cnblogs.com/best/p/5876596.html](https://www.cnblogs.com/best/p/5876596.html)
搜索代码片段：[https://www.dotnetperls.com/](https://www.dotnetperls.com/)

