---
title: 解决方案文件
lang: zh-CN
date: 2023-09-08
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - dotNET
  - solutionItems
filename: solutionItems
slug: an5pygsa1p17gufg
docsId: '131479828'
---

## 概述
讲述仓库下每个文件的含义和用法

## 目录

deploy：存放与部署相关的文件

doc：存储项目的文档

src：存放项目

test：存放单元测试项目

## 项目文件

### 汇总

```xml
<!--sdk类型，还有其他类型，比如API是Microsoft.NET.Sdk.Web-->
<Project Sdk="Microsoft.NET.Sdk">

	<PropertyGroup>
		<!--指定构建可运行的应用程序（而不是库）-->
		<OutputType>Exe</OutputType>

		<!--指定默认框架版本-->
		<TargetFramework>net6.0</TargetFramework>
		<!--指定框架引用.NET 8和.NET 7，如果是库，那么代表可以被.NET 8或者.NET 7程序引用-->
		<!--<TargetFrameworks>net8.0;net7.0</TargetFrameworks>-->

		<!--隐式using，一些系统引用自动帮你引用了-->
		<ImplicitUsings>enable</ImplicitUsings>
		<!--可为空的引用类型-->
		<Nullable>enable</Nullable>
		<!--语言版本，当前是使用Preview(使用所有最新功能，即时有些版本还未发布)，也可以指定具体版本-->
		<LangVersion>Preview</LangVersion>
		<!--为了能够在代码中使用 unsafe 关键字-->
		<AllowUnsafeBlocks>true</AllowUnsafeBlocks>
		<!--将垃圾回收器 （GC） 配置为其“服务器”配置，这会影响它在内存消耗和吞吐量之间做出的权衡（它是 ASP.NET 应用程序的默认设置）-->
		<ServerGarbageCollection>true</ServerGarbageCollection>
		<!--是否生成文档文件-->
		<GenerateDocumentationFile>True</GenerateDocumentationFile>
		<!--文档名称-->
		<DocumentationFile>ClassLibrary1.xml</DocumentationFile>
		<!--要忽略警告-->
		<NoWarn>1701;1702;1591</NoWarn>
		<!--该程序集的作者-->
		<Authors>Azrng</Authors>
		<!--该程序集的版本-->
		<Copyright>版权归Azrng所有</Copyright>
		<!--该程序集的描述信息-->
		<Description>基本的公共核心类库</Description>
		<!--程序集的版本信息-->
		<Version>1.0.8</Version>
		<!--程序集的包id，发布nuget包的时候要求唯一-->
		<PackageId>Common.Core</PackageId>
		<!--项目url-->
		<PackageProjectUrl>https://azrng.gitee.io/nuget-docs/</PackageProjectUrl>
		<!--构建的时候是否生成包-->
		<GeneratePackageOnBuild>True</GeneratePackageOnBuild>
		<!--程序集标题-->
		<AssemblyTitle>Common.Core</AssemblyTitle>
		<!--是否将警告转为错误-->
		<TreatWarningsAsErrors>false</TreatWarningsAsErrors>
		<!--包license-->
		<PackageLicenseExpression>MIT</PackageLicenseExpression>
		<!--解决方案路径-->
		<!--<SolutionDir Condition="'$(SolutionDir)' == ''">$([MSBuild]::GetDirectoryNameOfFileAbove('$(MSBuildThisFileDirectory)', '.gitignore'))</SolutionDir>-->
        
        <!--不关心在发生异常时拥有良好的堆栈跟踪-->
        <StackTraceSupport>false</StackTraceSupport>
        <!--引入的大小与速度选项-->
        <OptimizationPreference>Size</OptimizationPreference>
        <PublishTrimmed>true</PublishTrimmed>
        <BlazorEnableTimeZoneSupport>false</BlazorEnableTimeZoneSupport>
        <EventSourceSupport>false</EventSourceSupport>
        <HttpActivityPropagationSupport>false</HttpActivityPropagationSupport>
        <EnableUnsafeBinaryFormatterSerialization>false</EnableUnsafeBinaryFormatterSerialization>
        <MetadataUpdaterSupport>false</MetadataUpdaterSupport>
        <UseNativeHttpHandler>true</UseNativeHttpHandler>
        <TrimMode>link</TrimMode>
        
	</PropertyGroup>

	<!--引用的nuget包-->
	<ItemGroup>
		<PackageReference Include="BenchmarkDotNet" Version="0.13.8" />
	</ItemGroup>

</Project>
```

#### GLOBALIZATION_INVARIANT

GLOBALIZATION_INVARIANT (全局不变模式)是ASP.NET Core的一项特性，它是一个环境变量，用于指示应用程序在运行时是否应使用全局不变模式。当这个环境变量设置为true时，ASP.NET Core应用将忽略用户的区域设置，始终使用 invariant culture（无特定文化信息的文化，通常是CultureInfo.InvariantCulture）。使用全局不变模式可以提高性能，因为它避免了对不同文化进行资源查找和转换。这适用于不需要本地化或希望所有用户看到相同内容的应用。

### 导入其他文件配置

```xml
<Project>

  <Import Project="..\Directory.Build.props" />

  <PropertyGroup>
    <!--https://docs.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/overview -->
    <AnalysisLevel>latest-Recommended</AnalysisLevel>
    <EnableNETAnalyzers>True</EnableNETAnalyzers>

    <PackageProjectUrl>$(RepositoryUrl)/src/$(MSBuildProjectName)</PackageProjectUrl>
  </PropertyGroup>

</Project>
```

### 使用变量

```xml
<Project>

  <PropertyGroup>
    <AssemblyTitle>$(MSBuildProjectName) ($(TargetFramework))</AssemblyTitle>
      
    <!--解决方案路径-->
	<SolutionDir Condition="'$(SolutionDir)' == ''">$([MSBuild]::GetDirectoryNameOfFileAbove('$(MSBuildThisFileDirectory)', '.gitignore'))</SolutionDir> 
      
  </PropertyGroup>

</Project>
```

### MSBuild

MSBuild 是 Microsoft 和 Visual Studio 的生成平台。

官网文档：[https://learn.microsoft.com/zh-cn/visualstudio/msbuild/walkthrough-using-msbuild](https://learn.microsoft.com/zh-cn/visualstudio/msbuild/walkthrough-using-msbuild?view=vs-2022)



还可以通过VS插件`MSBuild Editor`来方便的编辑。

## 其他文件

:::tip

一般在解决方案根存放下面的这些文件，在项目中新建虚拟文件夹Solution Items并加入这些文件

:::

1. nuget.config: 是 NuGet 包管理器的配置文件，用于指定包源、身份验证信息和其他相关设置。它通常位于解决方案或项目文件夹的根目录下。
2. .editorconfig: 是一种用于定义编辑器行为的文件格式，它可以跨多个开发工具和环境进行共享。在一个解决方案或项目中使用 .editorconfig 文件可以帮助团队保持代码风格的一致性。该文件通常放置在项目文件夹的根目录下。
3. Directory.Build.props: 是一个 MSBuild 文件，用于在项目编译过程中设置全局属性。通过在该文件中定义属性，可以将这些属性应用于解决方案中的所有项目。该文件位于解决方案文件夹的根目录下。
4. Directory.Packages.props: 是一个 MSBuild 文件，用于设置与 NuGet 包相关的属性。通过在该文件中定义属性，可以将这些属性应用于解决方案中的所有项目，以便更轻松地管理 NuGet 包。该文件位于解决方案文件夹的根目录下。
5. global.json: 是一个用于定义 .NET Core SDK 版本和工具链配置的 JSON 文件。它通常用于多个项目共享相同的 SDK 版本。该文件通常放置在解决方案文件夹的根目录下。
6. LICENSE: 是一个许可证文件，用于明确说明源代码或软件的使用条款和限制。该文件通常以文本形式提供，并包含了授权者的版权信息、免责声明和其他许可规定。

### gitignore
git的忽略文件，可以通过github、gitee等生成，.Net中可以直接通过运行命令行
```shell
dotnet new .gitignore
```

### README
项目说明文件

### editorconfig
EditorConfig代码样式和配置代码检查 | .NET 工具博客[https://blog.jetbrains.com/dotnet/2023/07/18/editorconfig-code-style-and-configuring-code-inspections/](https://blog.jetbrains.com/dotnet/2023/07/18/editorconfig-code-style-and-configuring-code-inspections/)使用 EditorConfig 在 Rider 和 ReSharper 中引入代码样式和代码检查。

严重性级别：https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/configuration-options#severity-level



示例：一些常见的规则

```
root = true
# 如果要从更高级别的目录继承 .editorconfig 设置，请删除以下行

# c# 文件
[*.cs]

#### Core EditorConfig 选项 ####

# 缩进和间距
indent_size = 4
indent_style = space
tab_width = 4

#### .NET 编码约定 ####

# 组织 Using
dotnet_separate_import_directive_groups = false
dotnet_sort_system_directives_first = false

# dotnet_diagnostic 资料：https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/configuration-options
dotnet_diagnostic.CA1716.severity = Warning # 默认warning 标识符不应与关键字冲突
dotnet_diagnostic.CA1720.severity = none # 默认warning 标识符不应包含类型名称
dotnet_diagnostic.CA5350.severity = none # 默认warning 请勿使用弱加密算法
dotnet_diagnostic.CA5351.severity = none # 默认warning 不使用损坏的加密算法
dotnet_diagnostic.CS4014.severity = Error # 默认warning 请考虑向调用结果应用 await 运算符
dotnet_diagnostic.CS8019.severity = warning # 默认Info 不需要的using
dotnet_diagnostic.CS1591.severity = none # 默认warning 缺少对公共可见类型或者成员的XML注释
```

### Directory.Build.props

示例
```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <TargetFramework>net6.0</TargetFramework>
    <CentralPackageTransitivePinningEnabled>true</CentralPackageTransitivePinningEnabled>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

- ManagePackageVersionsCentrally：这个属性用于指定是否集中管理包版本。设置为 true，表示包的版本将由一个统一的地方来管理，这里启用后可以统一的查看、升级nuget包，建议搭配Directory.Packages.props文件使用。
- TreatWarningsAsErrors：这个属性用于指定是否将警告视为错误。设置为 true，表示编译过程中的警告将被当作错误处理，即编译过程中任何警告都会导致编译失败。
- TargetFramework：这个属性用于指定项目的目标框架。设置为 net6.0，表示该项目的目标框架是 .NET 6.0。
- CentralPackageTransitivePinningEnabled：该属性指示是否启用了对中央存储库的传递依赖项进行固定锁定的功能。如果设置为 "true"，则表示启用了传递依赖项固定锁定功能，依赖项将被固定在其特定的版本上，而不是根据最新可用版本进行更新。
- ImplicitUsings：是否启用隐式引用

### 中央包管理Directory.Packages.props

[中央包管理(CPM)](https://learn.microsoft.com/zh-cn/nuget/consume-packages/central-package-management)，是一个进行Nuget包版本统一管理文件，要使用该文件首先要去Directory.Build.props文件的ManagePackageVersionsCentrally属性中启用集中管理包版本，然后配置该文件，示例格式如下

```csharp
<Project>
  <ItemGroup>
    <PackageVersion Include="AzrngCommon.Security" Version="0.0.1-beta2" />
    <PackageVersion Include="Common.JwtToken" Version="1.2.1" />
  </ItemGroup>
</Project>
```

这个文件就是你的 Nuget 依赖版本号的集中管理文件。其中的写法除了 PackageVersion 元素外，其他的都是 Nuget 的写法。你可以在这个文件中添加你的 Nuget 依赖版本号。再次注意，这里是 PackageVersion 而不是 PackageReference。

最后修改项目文件，在你的项目文件中，你可以通过以下方式来设置 Nuget 依赖：

```xml
<Project>
    <ItemGroup>
        <PackageReference Include="xunit" />
        <PackageReference Include="unit.runner.visualstudio" />
    </ItemGroup>
</Project>
```

该文件和以前的写法是一样的。但是你不需要再指定版本号了。这样你就可以通过 Directory.Packages.props 来集中管理你的 Nuget 依赖版本号了。关于更多的内容，比如替代包版本、禁用中央包管理、全局包引用等，可以去查看[官网文档](https://learn.microsoft.com/zh-cn/nuget/consume-packages/central-package-management#get-started)或者[第三方资料](https://www.milanjovanovic.tech/blog/central-package-management-in-net-simplify-nuget-dependencies)。



上面说的方法需要手动的进行设置，还可以使用工具[tocpm](https://github.com/DEVDEER/dotnet-tocpm)来进行快速设置中央包管理，操作如下

```shell
# 全局安装命令
dotnet tool install -g --prerelease devdeer.tools.tocpm

# 查看安装的版本
tocpm -v

# 模拟操作预览生成文件
tocpm simulate .

# 执行中央包管理，生成Directory.Packages.props文件
tocpm execute .
```

### global.json

通过 global.json 文件，可定义在运行 .NET CLI 命令时使用的 .NET SDK 版本。 选择 .NET SDK 版本与指定项目所面向的运行时版本无关。 .NET SDK 版本指示使用哪个版本的 .NET CLI。想知道当前电脑安装了哪些版本的SDK，可以使用命令查看
```csharp
dotnet --list-sdks

7.0.202 [C:\Program Files\dotnet\sdk]
7.0.300-preview.23122.5 [C:\Program Files\dotnet\sdk]
```
资料：[https://learn.microsoft.com/zh-cn/dotnet/core/tools/global-json](https://learn.microsoft.com/zh-cn/dotnet/core/tools/global-json)

如果始终想要使用计算机上安装的最新 SDK 版本，则不需要 global.json 文件。 但在 CI（持续集成）方案中，通常需要为使用的 SDK 版本指定可接受的范围。 global.json 文件具有 rollForward 功能，它提供灵活的方法来指定可接受的版本范围。  例如，以下 global.json 文件为计算机上安装的 6.0 选择 6.0.300 或更高版本的[功能区段或修补程序](https://learn.microsoft.com/zh-cn/dotnet/core/releases-and-support)：
```csharp
{
  "sdk": {
    "version": "6.0.300",
    "rollForward": "latestFeature"
  }
}
```

- version：要使用的.Net SDK版本
- allowPrerelease：指示在选择要使用的 SDK 版本时，SDK 解析程序是否应考虑预发布版本，如果未显式设置此值，则默认值将取决于是否从 Visual Studio 运行：
   - 如果未使用 Visual Studio，则默认值为 true
   - 如果使用 Visual Studio，它将使用请求的预发布状态。 也就是说，如果使用 Visual Studio 的预览版本，或者设置了“使用 .NET Core SDK 的预览版”选项（在“工具”>“选项”>“环境”>“预览功能”下方），则默认值为 true 。 否则，默认值为 false。
- rollForward：选择 SDK 版本时要使用的前滚策略，可作为特定 SDK 版本缺失时的回退，或者作为使用更高版本的指令。 必须使用 rollForward 值指定[版本](https://learn.microsoft.com/zh-cn/dotnet/core/tools/global-json#version)，除非将其设置为 latestMajor。 默认的前滚行为由[匹配规则](https://learn.microsoft.com/zh-cn/dotnet/core/tools/global-json#matching-rules)确定。

通过命令创建global.json文件
```csharp
dotnet new globaljson --sdk-version 7.2.202
```

#### RollForward
rollForward属性用于指定在没有明确指定项目所需的.NET Core SDK版本时，应该采取哪种策略来选择合适的SDK版本。它有以下几个可能的值：

- "latestPatch"：此选项将会使用最新的补丁版本，即使环境中已安装的是旧版本的SDK。这意味着会自动向后兼容，并且能够获得最新的修复程序和功能更新。
- "latestMinor"：此选项将会使用与已安装的SDK具有相同次要版本号的最新版本。例如，如果已安装的SDK是3.1.2，则会选择最新的3.1.x版本。但是，如果已安装的SDK是3.2.1，则会选择最新的3.2.x版本。
- "latestMajor"：此选项将会使用与已安装的SDK具有相同主要版本号的最新版本。例如，如果已安装的SDK是5.0.2，则会选择最新的5.x.x版本。
- 特定版本号（例如："3.1.4"）：您也可以直接指定一个特定的SDK版本号。在这种情况下，将使用指定的版本进行开发和构建。

### CleanBinAndObj

该文件用于清理项目目录中的bin目录和obj目录文件，可将下面的内容复制一个bat文件中，然后双击运行

```bash
for /f "tokens=*" %%a in ('dir obj /b /ad /s ^|sort') do rd "%%a" /s/q
for /f "tokens=*" %%a in ('dir bin /b /ad /s ^|sort') do rd "%%a" /s/q
```

## 参考资料

中央包管理：https://mp.weixin.qq.com/s/J1rmtcCLxODQdiQa0bsrqQ
