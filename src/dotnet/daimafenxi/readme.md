---
title: 说明
lang: zh-CN
date: 2023-08-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: ryuu6ctbvhfkvg27
docsId: '134803656'
---

## 概述
.NET Compiler Platform (Roslyn) 分析器会检查 C## 或 Visual Basic 代码的代码质量和样式问题。 从 .NET 5 开始，这些分析器包含在 .NET SDK 中，无需单独安装。 如果项目面向 .NET 5 或更高版本，则默认启用代码分析。 如果项目面向之前版本的 .NET 实现（例如 .NET Core、. NET Standard 或 .NET Framework），则必须通过将 [EnableNETAnalyzers](https://learn.microsoft.com/zh-cn/dotnet/core/project-sdk/msbuild-props#enablenetanalyzers) 属性设置为true以手动启用代码分析。

## 分析包

### Microsoft.CodeAnalysis.NetAnalyzers
如果你不想升级到 .NET 5+ SDK、具有非 SDK 样式的 .NET Framework 项目或更倾向于使用基于 NuGet 包的模型，则也可以在 Microsoft.CodeAnalysis.NetAnalyzers NuGet 包中使用该分析器(老版本的是：Microsoft.CodeAnalysis.FxCopAnalyzers)。
```powershell
<PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="7.0.3">
  <PrivateAssets>all</PrivateAssets>
  <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
</PackageReference>
```
对于按需版本更新，你可能更倾向于使用基于包的模型。
> .NET 分析器与目标框架无关。 即，你的项目不需要面向特定的 .NET 实现。 分析器适用于面向 .NET 5+ 及更早 .NET 版本（如 .NET Core 3.1 和 .NET Framework 4.7.2）的项目。 但是，若要使用 EnableNETAnalyzers 属性启用代码分析，则项目必须引用项目 SDK([https://learn.microsoft.com/zh-cn/dotnet/core/project-sdk/overview](https://learn.microsoft.com/zh-cn/dotnet/core/project-sdk/overview))。

如果分析器发现规则冲突，则这些冲突会被报告为建议、警告或错误，具体取决于每个规则的[配置](https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/configuration-options)方式。 代码分析冲突以前缀“CA”或“IDE”显示，以便将它们与编译器错误区分开来。

资料：https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/overview?tabs=net-7

### SonarAnalyzer.CSharp

SonarAnalyzer.CSharp是一个非常强大的代码分析器(基于Roslyn分析器)，它现阶段一共有343条规范并且主要是面向了代码的使用，包含了缺陷检测、性能、约定、错误处理、事件、异步、测试等等多类规则，规则参见：https://rules.sonarsource.com/csharp
项目主页：https://www.sonarsource.com/products/codeanalyzers/sonarcsharp.html



要想使用我们可以直接安装nuget包，如

```c#
<ItemGroup>
  <PackageReference Include="SonarAnalyzer.CSharp" Version="9.14.0.81108">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
</ItemGroup>
```

当然还可以在项目`.csproj`文件中，配置如下配置

```xml
<PropertyGroup>
  <TargetFramework>net6.0</TargetFramework>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>

  <!--使用最新版本的代码分析工具来对代码进行分析，以帮助开发者找出潜在的问题-->
  <AnalysisLevel>latest</AnalysisLevel>
  <!--对所有代码进行分析，包括第三方库和依赖项中的代码-->
  <AnalysisMode>all</AnalysisMode>
  <!--将编译器生成的警告视为错误，即如果有任何警告，则编译过程将停止并报告错误-->
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <!--将代码分析工具生成的警告视为错误。与上一个设置类似-->
  <CodeAnalysisTreatWarningsAsErrors>true</CodeAnalysisTreatWarningsAsErrors>
  <!--在编译时启用代码风格规则检查-->
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

当然如果你想给当前解决方案中的所有配置安装该分析包，那么还可以使用`Directory.Build.props`文件统一配置，如

```xml
<Project>
    <PropertyGroup>
        <!--使用最新版本的代码分析工具来对代码进行分析，以帮助开发者找出潜在的问题-->
        <AnalysisLevel>latest</AnalysisLevel>
        <!--对所有代码进行分析，包括第三方库和依赖项中的代码-->
        <AnalysisMode>all</AnalysisMode>
        <!--将编译器生成的警告视为错误，即如果有任何警告，则编译过程将停止并报告错误-->
        <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
        <!--将代码分析工具生成的警告视为错误。与上一个设置类似-->
        <CodeAnalysisTreatWarningsAsErrors>true</CodeAnalysisTreatWarningsAsErrors>
        <!--在编译时启用代码风格规则检查-->
        <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="SonarAnalyzer.CSharp"
                          Version="9.14.0.81108"
                          PrivateAssets="all"
                          Condition="$(MSBuildProjectExtension)=='.csproj'"/>
    </ItemGroup>

</Project>
```

### Microsoft.CodeAnalysis.FxCopAnalyzers

:::tip

该包已经弃用

:::

FxCop是.Net Framework中用来分析托管代码的应用程序，它主要关注的代码的设计、国际化、可维护性、性能和安全性等方面，并按照这些类别定义了一个规则集： https://docs.microsoft.com/en-us/visualstudio/code-quality/code-analysis-for-managed-code-warnings
 FxCopAnalyzers安装： https://www.nuget.org/packages/Microsoft.CodeAnalysis.FxCopAnalyzers

### StyleCop.Analyzers
StyleCop本身就是一个用于规范代码格式的工具，所以它的规则也是面向代码格式的，如注释、布局、命名、排序、可维护性、可读性等，StyleCop的规则集参考：https://github.com/DotNetAnalyzers/StyleCopAnalyzers/tree/master/documentation
 StyleCop.Analyzers的项目主页：https://github.com/DotNetAnalyzers/StyleCopAnalyzers

### Codecracker.CSharp
Codecracker.CSharp也是以个开源的代码分析器，它的规则主要是设计、命名、性能、代码风格、代码使用以及重构，具体参见：http://code-cracker.github.io/diagnostics.html
项目主页：https://github.com/code-cracker/code-cracker
注：Codecracker.CSharp可以通过安装VS拓展工具的方式实现代码分析：https://marketplace.visualstudio.com/items?itemName=GiovanniBassi-MVP.CodeCrackerforC，其它大部分Roslyn分析器需要安装Nuget包。

## 资料
源代码分析概述：[https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/overview?tabs=net-7](https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/overview?tabs=net-7)
[https://mp.weixin.qq.com/s/0zBjYHF882k_wCVrk9JBOQ](https://mp.weixin.qq.com/s/0zBjYHF882k_wCVrk9JBOQ) | 好代码是管出来的——.Net中的代码规范工具及使用
