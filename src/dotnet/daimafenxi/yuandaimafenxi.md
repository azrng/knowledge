---
title: 源代码分析
lang: zh-CN
date: 2023-06-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: yuandaimafenxi
slug: liqkdy
docsId: '70146455'
---

## 概述
NET Compiler Platform (Roslyn) 分析器会检查 C## 或 Visual Basic 代码的代码质量和样式问题。 从 .NET 5 开始，这些分析器包含在 .NET SDK 中，无需单独安装。 如果项目面向 .NET 5 或更高版本，则默认启用代码分析(无需在配置)。 如果项目面向其他 .NET 实现（例如 .NET Core(低版本)、.NET Standard 或 .NET Framework），则必须将 EnableNETAnalyzers 属性设置为 来手动启用代码分析。
如果你不想移动到 .NET 5+ SDK、具有非 SDK 样式的 .NET Framework 项目或更倾向于使用基于 NuGet 包的模型，则也可以安装Nuget包 Microsoft.CodeAnalysis.NetAnalyzers来使用该分析器。

通过代码质量分析(CAxxxx)规则，可在代码库中检查C#或Visual Basic代码的安全性、性能、设计及其他问题。
通过代码样式分析(IDExxxx)规则，可在代码库中定义和维护一致的代码样式。

## 第三方分析器
除了官方 .NET 分析器外，你也可以安装第三方分析器，如 [StyleCop](https://www.nuget.org/packages/StyleCop.Analyzers/)、[Roslynator](https://www.nuget.org/packages/Roslynator.Analyzers/)、[XUnit Analyzers](https://www.nuget.org/packages/xunit.analyzers/) 和 [Sonar Analyzer](https://www.nuget.org/packages/SonarAnalyzer.CSharp/)。

### SonarLint
官网：[https://www.sonarsource.com/products/sonarlint/](https://www.sonarsource.com/products/sonarlint/)
包含有VS扩展：[https://marketplace.visualstudio.com/items?itemName=SonarSource.SonarLintforVisualStudio2022](https://marketplace.visualstudio.com/items?itemName=SonarSource.SonarLintforVisualStudio2022)
关于C#的静态分析规则：[https://rules.sonarsource.com/csharp](https://rules.sonarsource.com/csharp)

[https://www.cnblogs.com/myzony/p/9233667.html](https://www.cnblogs.com/myzony/p/9233667.html) | (oﾟvﾟ)ノ Hi - 使用 SonarQube 来分析 .NET Core 项目代码问题
[https://blog.csdn.net/zuozewei/article/details/88874240](https://blog.csdn.net/zuozewei/article/details/88874240) | Visual Studio 中使用 SonarLint 分析 C## 代码_zuozewei的博客-CSDN博客_sonarlint分析


Nuget包：[https://www.nuget.org/packages/SonarAnalyzer.CSharp](https://www.nuget.org/packages/SonarAnalyzer.CSharp)
介绍：Roslyn 分析器可发现代码中的错误、漏洞和代码异味。为了获得更好的整体体验，您可以使用 SonarLint for Visual Studio 或 Rider，这是一个免费的扩展 （[https://www.sonarlint.org/visualstudio/](https://www.sonarlint.org/visualstudio/)），可以独立使用，也可以与 SonarQube （[https://www.sonarqube.org/](https://www.sonarqube.org/)） 和/或 SonarCloud （[https://sonarcloud.io/](https://sonarcloud.io/)） 一起使用。

## 资料
源代码分析：[https://docs.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/overview](https://docs.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/overview)
