---
title: 优化部署目录结构
lang: zh-CN
date: 2023-08-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: youhuabushumulujiegou
slug: dxuoqf
docsId: '72268439'
---

## NetCoreBeauty
NetCoreBeauty 会将 .NET Core 软件的运行时组件和依赖移动到一个子目录中，让发布文件看起来更简洁漂亮。
github：[https://github.com/nulastudio/NetCoreBeauty](https://github.com/nulastudio/NetCoreBeauty)

> NetCoreBeauty 只适用于独立部署发布模式的程序，不要勾选生成单个文件

为项目添加 Nuget 引用：
```csharp
dotnet add package nulastudio.NetCoreBeauty
```

### 配置文件
编辑项目配置文件（*.csproj）应该和下面的代码类似：
```csharp

<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>netcoreapp2.1</TargetFramework>
    <!-- beauty into sub-directory, default is libs, quote with "" if contains space  -->
    <!-- 要移动到字母名称，默认是 libs 目录，如果需要包含空格，请用双引号括起来 -->
    <BeautyLibsDir>libraries</BeautyLibsDir>
    <!-- 设置一些你不想被移动或者不能被移动到子目录的文件名，支持匹配。-->
    <!-- dlls that you don't want to be moved or can not be moved -->
    <!-- <BeautyExcludes>dll1.dll;lib*;...</BeautyExcludes> -->
    <!-- 最终用户不会使用到的文件，可以在这里配置隐藏掉。-->
    <!-- dlls that end users never needed, so hide them -->
    <!-- <BeautyHiddens>hostfxr;hostpolicy;*.deps.json;*.runtimeconfig*.json</BeautyHiddens> -->
    <!-- 如果不想执行移动操作，可以设置为 True -->
    <!-- set to True if you want to disable -->
    <DisableBeauty>False</DisableBeauty>
    
    <!-- set to True if you don't want to generate NetCoreBeauty flag file -->
    <!-- do not beauty twice since there is no flag file to determine if beauty already -->
    <NoBeautyFlag>False</NoBeautyFlag>
    <ForceBeauty>False</ForceBeauty>
    <!-- <BeautyAfterTasks></BeautyAfterTasks> -->
    <!-- set to True if you want to disable -->
    <DisablePatch>False</DisablePatch>
    <!-- valid values: Error|Detail|Info -->
    <BeautyLogLevel>Error</BeautyLogLevel>
    <!-- 设置仓库镜像，如果你不能链接到 GitHub 的话可以采用该设置。推荐大陆用户打开这个配置。-->
    <!-- set to a repo mirror if you have troble in connecting github -->
    <!-- <GitCDN>https://gitee.com/liesauer/HostFXRPatcher</GitCDN> -->
    <!-- <GitTree>master</GitTree> -->
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="nulastudio.NetCoreBeauty" Version="1.2.9.3" />
  </ItemGroup>

</Project>
```
> <BeautyLibsDir>libraries</BeautyLibsDir>：配置美化库的目录路径为 "libraries"。该设置指定了美化工具所需要的相关 library 文件所在的目录路径。
> <DisableBeauty>False</DisableBeauty>：禁用美化功能。当值为 "False" 时，表示不禁用美化功能；当值为 "True" 时，表示禁用美化功能。
> <NoBeautyFlag>False</NoBeautyFlag>：不使用美化标志。当值为 "False" 时，表示不使用美化标志；当值为 "True" 时，表示使用美化标志。
> <ForceBeauty>False</ForceBeauty>：强制美化。当值为 "False" 时，表示不强制美化；当值为 "True" 时，表示强制美化。
> <DisablePatch>False</DisablePatch>：禁用补丁功能。当值为 "False" 时，表示不禁用补丁功能；当值为 "True" 时，表示禁用补丁功能。
> <BeautyLogLevel>Error</BeautyLogLevel>：日志级别设置为 "Error"。该设置指定了美化工具输出日志的级别，只输出错误级别及以上的日志信息。

在你使用 dotnet publish 命令或者 Visual Studio 发布时，移动工作将自动进行。
官方提供了一个测试项目，可以在这里看到源代码：
https://github.com/nulastudio/NetCoreBeauty/tree/master/NetCoreBeautyNugetTest

### 基础操作
安装nuget包
```csharp
<PackageReference Include="nulastudio.NetCoreBeauty" Version="1.2.9.5" />
```
在安装nuget的情况下编辑项目文件，增加如下内容
```xml
<PropertyGroup>
	<TargetFramework>net8.0</TargetFramework>
	<Nullable>enable</Nullable>
	<ImplicitUsings>enable</ImplicitUsings>
	<InvariantGlobalization>true</InvariantGlobalization>

	<BeautyLibsDir>libraries</BeautyLibsDir>
	<DisableBeauty>False</DisableBeauty>
	<NoBeautyFlag>False</NoBeautyFlag>
	<ForceBeauty>False</ForceBeauty>
	<DisablePatch>False</DisablePatch>
	<BeautyLogLevel>Error</BeautyLogLevel>
</PropertyGroup>
```

## PublishFolderCleaner

独立发布选择非单文件发布的时候，输出文件夹上有超级多个文件，使用 PublishFolderCleaner 工具让发布文件夹只留一个 Exe 和一个 Lib 文件夹，需要安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="dotnetCampus.PublishFolderCleaner" Version="3.0.3" />
</ItemGroup>
```

然后可以使用命令行进行发布

::: tip

如果打包报错了，那么就删除下之前打包好的文件，再次打包尝试

:::

```
dotnet publish -r win-x64 -c release --self-contained
```

