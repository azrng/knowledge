---
title: 视图编译
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shitubianyi
slug: ggedw23gwcdid5ro
docsId: '131421060'
---

## 类型

### 预编译
预编译是ASP.Net Core 5.0 的默认方式。在发布时，默认会将系统中的所有Razor视图进行预编译。编译好的视图DLL统一命名为 xxx.Views.dll

### 动态编译
将项目整个配置成动态编译很简单，仅需3步：
1、在 NuGet 中添加包“Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation”
2、修改代码文件“Startup.cs”中的方法“ ConfigureServices ”，调用方法“ AddRazorRuntimeCompilation ”以支持动态编译 .cshtml 文件
```csharp
services.AddRazorPages().AddRazorRuntimeCompilation();
```
3、修改项目文件 xxx.csproj，添加配置项 RazorCompileOnBuild 和 MvcRazorCompileOnPublish ，值都设置为 false。
```csharp
<PropertyGroup>     
    <RazorCompileOnBuild>false</RazorCompileOnBuild>     
    <MvcRazorCompileOnPublish>false</MvcRazorCompileOnPublish> 
</PropertyGroup>
```
这样在发布的时候，所有的 Razor 视图都不会被预编译了，并且所有的视图都会一同被发布。
注意：在发布的生产环境中，修改视图文件是不会立即生效的，需要重启程序（对于 IIS 宿主的运行环境需要重启站点）才会生效。 

### 混合编译
预编译和动态编译都有各自的优点，你可以选择将它们混合起来使用。例如如果你希望在发布时只预编译部分视图，而部分视图要采用动态编译的模式，可以在项目文件上配置排除不需要预编译的视图。其他步骤与前一章节“动态编译”相同，仅步骤3需要按照下面的方式修改，多个项目之间使用分号“;”分隔。例如：
```csharp
  <ItemGroup>     <MvcRazorFilesToCompile Include="Pages\**\*.cshtml" Exclude="Pages\page_group1\**\*.cshtml;Pages\page_group2\pg1.cshtml" />   </ItemGroup>
```

## 资料
[https://www.cnblogs.com/thinksea/articles/14772837.html](https://www.cnblogs.com/thinksea/articles/14772837.html)
