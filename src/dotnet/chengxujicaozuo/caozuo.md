---
title: 操作
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: caozuo
slug: cfux2m3xt2b7y3sw
docsId: '120401952'
---

## 获取项目版本号
通过以下代码可以获取到项目的版本号
```csharp
var assemblyVersion = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion;
Console.WriteLine(assemblyVersion);

// 或者

// 获取版本号
var ver = ((AssemblyFileVersionAttribute)Assembly.GetExecutingAssembly().GetCustomAttributes(typeof(AssemblyFileVersionAttribute), false)?.FirstOrDefault())?.Version;
if (ver == null)
{
    ver = Assembly.GetExecutingAssembly().GetName()?.Version?.ToString();
}
```
设置方案
```csharp
<PropertyGroup>
	<OutputType>Exe</OutputType>
	<TargetFramework>net6.0-windows7.0</TargetFramework>
	<ImplicitUsings>enable</ImplicitUsings>
	<Nullable>enable</Nullable>
	<Version>5.0.5</Version> <!--设置版本号-->
</PropertyGroup>

```
如果没有设置，默认获取到是1.0.0

## 不同程序集相同签名方法调用
我们可以通过别名的方式来解决这个问题，首先修改项目文件，设置两个程序集的别名：
```csharp
<Project Sdk="Microsoft.NET.Sdk">

  <ItemGroup>
    <ProjectReference Include="..\ClassLibrary1\ClassLibrary1.csproj">
      <Aliases>ClassLibrary1</Aliases>
    </ProjectReference>
    <ProjectReference Include="..\ClassLibrary2\ClassLibrary2.csproj">
      <Aliases>ClassLibrary2</Aliases>
    </ProjectReference>
  </ItemGroup>
</Project>
```
然后，我们在控制台应用中调用这两个程序集中的 Where 方法：
```csharp
extern alias ClassLibrary1;
extern alias ClassLibrary2;

var list = new[] { 1, 2, 3 };

ClassLibrary1::Example.LinqExtensions.Where(list);
ClassLibrary2::Example.LinqExtensions.Where(list);
```
内容来自：[https://mp.weixin.qq.com/s/VC_w4BNYbXiToiZxV3g9iw](https://mp.weixin.qq.com/s/VC_w4BNYbXiToiZxV3g9iw)

## 禁用方法
不让在项目中使用一些方法。
使用场景：禁用DateTime.Now获取时间的方法，而是使用DateTimeOffset获取。

安装nuget包
```csharp
Microsoft.CodeAnalysis.BannedApiAnalyzers
```
并且在项目中添加BannedSymbols文件
```csharp
<ItemGroup>
  <AdditionalFiles Include="BannedSymbols.txt" />
</ItemGroup>
```
文件的内容就是要禁止的项，格式以及示例如下
```csharp
{Documentation Comment ID string for the symbol}[;Description Text]


P:System.DateTime.Now;请使用DateTimeOffset.Now,因为此项目
```
格式语法如下：[https://github.com/dotnet/roslyn-analyzers/blob/main/src/Microsoft.CodeAnalysis.BannedApiAnalyzers/BannedApiAnalyzers.Help.md](https://github.com/dotnet/roslyn-analyzers/blob/main/src/Microsoft.CodeAnalysis.BannedApiAnalyzers/BannedApiAnalyzers.Help.md)

当你在项目中使用了禁止使用的内容，会出现警告“此项目：请使用DateTimeOffset，因为此项目中禁用符号“DateTime.Now””；

## 程序集别名

使用场景：当你使用的一个开源项目中他依赖一个程序集，然后这个程序集刚好也是你的依赖项，但是这两个程序集的版本不一样，这个时候你就会遇到这个问题



当你现在有一个程序A，它引用了两个类库B和C，这个B和C的程序集名称一样，项目文件如下配置

```csharp
<PropertyGroup>
  <TargetFramework>net7.0</TargetFramework>
  <ImplicitUsings>enable</ImplicitUsings>
  <Nullable>enable</Nullable>
  <RootNamespace>ClassLibrarySample</RootNamespace>
</PropertyGroup>
```

这个时候当我们这两个类库里面包含相同的类的时候，我们实例化类的时候会提示该类在两个类库中同时存在，所以这时候我们可以为程序集设置别名来处理该方案，原来的引用方式是这样子的

```csharp
<ItemGroup>
  <ProjectReference Include="..\ClassLibrary1\ClassLibrary1.csproj" />
  <ProjectReference Include="..\ClassLibrary2\ClassLibrary2.csproj" />
</ItemGroup>
```

我们可以进行别名设置

```csharp
<ItemGroup>
  <ProjectReference Include="..\ClassLibrary1\ClassLibrary1.csproj" >
    <Aliases>ClassLibrary1</Aliases>
  </ProjectReference>
  <ProjectReference Include="..\ClassLibrary2\ClassLibrary2.csproj" >
    <Aliases>ClassLibrary2</Aliases>
  </ProjectReference>
</ItemGroup>
```

然后调用的方法就变成了

```csharp
extern alias ClassLibrary1;

var classHandler = new ClassLibrary1::ClassLibrarySample.Class1();
```

## 链接多个文件

在 C## 项目中通过链接方式引入文件可以让我们在项目中使用这些文件中的代码。常见的比如链接 AssemblyInfo.cs 文件，这样我们就可以在项目中使用这个文件中的版本号等信息。但是如果我们想要链接一个文件夹下的所有文件，该怎么做呢？今天我们就来看看如何在 C## 项目中链接一个文件夹下的所有文件。

### 编辑项目文件引入单个文件
在项目文件中，我们可以通过 Compile 标签来引入单个文件。比如我们想要引入 AssemblyInfo.cs 文件，我们可以这样做：
```csharp
<Project>
    <ItemGroup>
        <Compile Include="../Shared/AssemblyInfo.cs">
            <Link>Properties/AssemblyInfo.cs</Link>
        </Compile>
    </ItemGroup>
</Project>
```
这样我们就可以在项目中使用 AssemblyInfo.cs 文件中的代码了。

### 编辑项目引入所有文件
那如果想要引入多个文件，我们可以使用通配符来引入文件夹下的所有文件。比如我们想要引入 Shared 文件夹下的所有文件，我们可以这样做
```csharp
<Project>
    <ItemGroup>
        <Compile Include="..\Shared\**\*.cs">
            <Link>Properties/%(Filename)%(Extension)</Link>
        </Compile>
    </ItemGroup>
</Project>
```
这样我们就可以在项目中使用 Shared 文件夹下的所有文件中的代码了。
不过这样会使得所有的文件在项目中都会显示在 Properties 文件夹下，这样会让项目文件看起来很乱。我们可以通过修改 Link 标签来修改文件在项目中的显示位置。比如我们想要把 Shared 文件夹下的所有文件都显示在项目的根目录下，我们可以这样做：
```csharp
<Project>
    <ItemGroup>
        <Compile Include="..\Shared\**\*.cs">
            <Link>%(RecursiveDir)%(Filename)%(Extension)</Link>
        </Compile>
    </ItemGroup>
</Project>
```

### Directory.Build.props
上面的方法都是在项目文件中引入文件的，但是如果我们有很多项目，那么我们就需要在每个项目文件中都引入这些文件。这样会让我们的项目文件变得很乱。我们可以通过使用 Directory.Build.props 文件来解决这个问题。我们可以在解决文件夹下创建一个 Directory.Build.props 文件，然后在这个文件中引入文件夹下的所有文件。比如我们想要引入 Shared 文件夹下的所有文件，我们可以这样做：
```csharp
<Project>
    <ItemGroup>
        <Compile Include="..\Shared\**\*.cs">
            <Link>%(RecursiveDir)%(Filename)%(Extension)</Link>
        </Compile>
    </ItemGroup>
</Project>
```
内容来自：[https://mp.weixin.qq.com/s/Ls1gV2u8t5sBzNGh2RLtxg](https://mp.weixin.qq.com/s/Ls1gV2u8t5sBzNGh2RLtxg)

## DependencyModel
Microsoft.Extensions.DependencyModel 是一个 .NET Core 库，用于在运行时分析程序集及其依赖项。它是 Microsoft.Extensions 库的一部分，旨在提供跨多个 .NET Core 应用程序和框架的通用功能。

使用 Microsoft.Extensions.DependencyModel，您可以轻松获取有关应用程序及其依赖项的信息，例如：

- 程序集和依赖项的名称
- 程序集和依赖项的版本
- 程序集和依赖项之间的依赖关系


安装nuget包
```csharp
<PackageReference Include="Microsoft.Extensions.DependencyModel" Version="7.0.0" />
```

### 获取所有程序集
```csharp
public static class AssemblyHelper
{
    public static IEnumerable<Assembly> GetAssemblies()
    {
        // 需排除的项目程序集后缀
        var excludeAssemblyNames = new string[] { };

        // 需要排除的包
        var excludePackageAssembly = new string[] { "Microsoft", "System", "runtime" };

        var bb = DependencyContext.Default.RuntimeLibraries
            .Where(u =>
                (u.Type == "project" && !excludeAssemblyNames.Any(j => u.Name.EndsWith(j))) ||
                (u.Type == "package" && !excludePackageAssembly.Any(j => u.Name.StartsWith(j))) ||
                u.Type == "reference")
            .ToList();

        // 非独立发布/非单文件发布
        // todo  这点有些dll没有生成到目录下还会报错
        var scanAssemblies = DependencyContext.Default.RuntimeLibraries
            .Where(u =>
                (u.Type == "project" && !excludeAssemblyNames.Any(j => u.Name.EndsWith(j))) ||
                (u.Type == "package" && !excludePackageAssembly.Any(j => u.Name.StartsWith(j))) ||
                u.Type == "reference")
            .Select(t => Reflect.GetAssembly(t.Name))
            .ToList();

        return scanAssemblies;
    }
}
```

## AsmResolver.DotNet

### 是否为系统程序集
```csharp
/// <summary>
/// 是否是系统程序集
/// </summary>
/// <param name="asmPath"></param>
/// <returns></returns>
 static bool IsSystemAssembly(string asmPath)
{
    var moduleDef = AsmResolver.DotNet.ModuleDefinition.FromFile(asmPath);
    var assembly = moduleDef.Assembly;
    if (assembly is null)
    {
        return false;
    }

    var asmCompanyAttr = assembly.CustomAttributes.FirstOrDefault(c =>
        c.Constructor?.DeclaringType?.FullName == typeof(AssemblyCompanyAttribute).FullName);
    if (asmCompanyAttr == null)
    {
        return false;
    }

    var companyName = ((AsmResolver.Utf8String?)asmCompanyAttr.Signature?.FixedArguments[0].Element)?.Value;
    if (companyName == null)
    {
        return false;
    }

    return companyName.Contains("Microsoft");
}
```

