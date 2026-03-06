---
title: AOT
lang: zh-CN
date: 2023-09-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
  - AOT
tag:
  - 发布
filename: readme
slug: ru7m7o41ti8lt2g1
docsId: '125498061'
---

## 概述

.NET Native Ahead-of-Time （AOT） 编译是 .NET 平台中的前沿技术。使用 AOT，C# 代码被编译为开发人员计算机上的本机代码。这与传统方法形成鲜明对比，在传统方法中代码是在运行时被编译为本机代码。

官方文档：[https://learn.microsoft.com/zh-cn/dotnet/core/deploying/native-aot](https://learn.microsoft.com/zh-cn/dotnet/core/deploying/native-aot)

## 优缺点

::: tip

资料来自Aot优缺点：[https://blog.ndepend.com/net-native-aot-explained/](https://blog.ndepend.com/net-native-aot-explained/)

:::

### 优点

.NET Native Ahead-of-Time （AOT） 编译带来了一系列优势：

* 增强的性能：通过将代码预编译为本机计算机指令，.NET Native AOT 可显著缩短启动时间并提高整体应用程序性能。运行时没有 JIT 编译开销，这意味着执行速度更快，从而提供更流畅的用户体验。
* 简化部署：AOT 编译的应用程序通常会产生具有零或更少依赖项的独立可执行文件。这简化了部署过程，可以更轻松地在各种平台和设备上分发应用程序，而无需额外的安装或运行时组件。
* 更小的应用程序大小：通过剪裁不必要的代码，AOT 可以大大减小应用程序的大小。这不仅节省了存储空间，还优化了应用程序的内存占用，这在移动设备或物联网设备等资源受限的环境中尤为重要。
* 增强的知识产权保护：AOT 编译将源代码转换为优化的机器代码，使逆向工程尝试更具挑战性。生成的本机代码比 IL 代码更模糊，更难破译，IL 代码可以很容易地反编译为原始 C# 代码。这增强了应用程序中嵌入的敏感算法、业务逻辑和专有方法的安全性。

### 缺点

使用 AOT 获得的好处不可避免地伴随着某些缺点。他们来了：

* 特定于平台的编译：.NET Native AOT 生成特定于平台的本机代码，这些代码针对特定体系结构或操作系统进行定制。例如，与常规 .NET 程序集不同，在具有 AOT 的 Windows 上生成的可执行文件在 Linux 上不起作用。
* 不支持跨操作系统编译。例如，从 Windows 机器中，您无法编译 Linux 本机版本，反之亦然。
* 对反射的部分支持：反射依赖于动态代码生成和运行时类型发现，这与 AOT 编译代码的预编译和静态特性相冲突。但是，我们将在本文末尾看到，通常的 Reflection 用法与 AOT 配合得很好。
* 需要 AOT 兼容依赖项：AOT 编译要求项目中使用的所有库和依赖项都与 AOT 兼容。依赖于反射、运行时代码生成或其他动态行为的库可能与 AOT 不兼容，从而可能导致冲突或运行时错误。
* 增加构建时间：AOT 编译涉及在构建过程中预先生成本机代码。这个额外的步骤可以显著增加构建时间，特别是对于具有广泛代码库的大型项目或应用程序。
* 需要适用于 C++ 的桌面开发工具：AOT 只能在安装这些工具的情况下进行编译。

## 使用场景

* FaaS类服务，对于一些复杂算法，独立计算类小服务，可以用AOT来发布。
* 对于一些基础服务，调用频率高，要求更高的性价比：占用资源少，产出高，如果采用AOT发布，我们启动两个Pod，资源用不到原来的一半，RPS却有大幅增加，这是很划算的性价。
* 再有就是一些简单，功能单一的业务服务也可以考虑用AOT发布，因为业务复杂的服务，所需的技术就会复杂，这对现阶段的AOT开发有一定的开发代价。

资料：https://mp.weixin.qq.com/s/lbl3Pl_XkATpQ7nNWukB7g

## 命令

:::tip

需要开发工具具有“使用 C++ 的桌面开发”的工作负载

:::

项目文件配置
```xml
<PropertyGroup>
	<OutputType>Exe</OutputType>
	<TargetFrameworks>net7.0;net8.0</TargetFrameworks>
	<ImplicitUsings>enable</ImplicitUsings>
	<Nullable>enable</Nullable>
	<!--Aot发布-->
	<PublishAot>true</PublishAot>
	<!--引入的大小与速度选项,此处首先设置为文件大小优先-->
	<OptimizationPreference>Size</OptimizationPreference>
	<!--不需要特定于全球化的代码和数据，使用固定模式-->
	<InvariantGlobalization>true</InvariantGlobalization>
	<!--不关心在发生异常时拥有良好的堆栈跟踪-->
	<StackTraceSupport>false</StackTraceSupport>
    <!--在编译的时候就启用Aot检测 -->
    <IsAotCompatible Condition="'$(TargetFramework)' == 'net8.0'">true</IsAotCompatible>
</PropertyGroup>
```
然后执行下面的命令去进行发布

```shell
# 发布linux
dotnet publish -f net8.0 -r linux-x64 -c Release

# 发布win
dotnet publish -f net8.0 -r win-x64 -c Release
dotnet publish -r win-x64 -c Release --self-contained -p:PublishAot=true

# 以下是命令的详细说明：
• dotnet publish：发布命令。
• -r win-x64：指定目标运行时，这里是 Windows 64 位。您可以根据需要更改为其他运行时，
	例如 linux-x64 或 osx-x64。
• -c Release：使用 Release 配置进行发布。
• --self-contained：生成自包含的应用程序，这样无需在目标机器上安装 .NET 运行时。
• -p:PublishAot=true：启用 AOT 编译。
```

## Rd.xml

CoreRT 提前编译器通过编译应用程序入口点及其传递依赖项来发现要编译的方法和要生成的类型。如果应用程序使用反射，编译器可能会丢失类型。可以补充一个 rd.xml 文件来帮助 ILCompiler 找到应该分析的类型。该文件与 .NET Native 使用的 rd.xml 文件类似，但更受限制。

官网文档：https://learn.microsoft.com/zh-cn/windows/uwp/dotnet-native/runtime-directives-rd-xml-configuration-file-reference



写法示例：

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Directives xmlns="http://schemas.microsoft.com/netfx/2013/01/metadata">
    <Application>
        <Assembly Name="Semi.Avalonia" Serialize="Required Public" >
        </Assembly>
    </Application>
</Directives>
```

Aot 中Rd.xml 文件格式语法中文说明以及处理错误的实战案例：[https://www.jianshu.com/p/56e9d8246784](https://www.jianshu.com/p/56e9d8246784)

## 经验汇总

###  添加rd.xml

在主工程创建一个XML文件，例如`Roots.xml`，内容大致如下：

```xml
<linker>
 <assembly fullname="CodeWF.Toolbox.Desktop" preserve="All" />
</linker>
```

需要支持AOT的工程，在该XML中添加一个`assembly`节点，`fullname`是程序集名称，`CodeWF.Toolbox.Desktop`是主工程名。

在主工程添加`ItemGroup`节点关联该XML文件：

```xml
<ItemGroup>
    <TrimmerRootDescriptor Include="Roots.xml" />
</ItemGroup>
```

### App.config读写

在.NET Core中使用`System.Configuration.ConfigurationManager`包操作App.config文件，`rd.xml`需添加如下内容：

```xml
<assembly fullname="System.Configuration.ConfigurationManager" preserve="All" />
```

使用`Assembly.GetEntryAssembly().location`失败，目前使用`ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None)`获取的应用程序程序配置，指定路径的方式后续再研究。

### HttpClient使用

`rd.xml`添加如下内容：

```xml
<assembly fullname="System.Net.Http" preserve="All" />
```

### Dapper支持

Dapper的AOT支持需要安装`Dapper.AOT`包，`rd.xml`添加如下内容：

```xml
<assembly fullname="Dapper" preserve="All" />
<assembly fullname="Dapper.AOT" preserve="All" />
```

数据库操作的方法需要添加`DapperAOT`特性，举例如下：

```csharp
[DapperAot]
public static bool EnsureTableIsCreated()
{
    try
    {
        using var connection = new SqliteConnection(DBConst.DBConnectionString);
        connection.Open();

        const string sql = $@"
            CREATE TABLE IF NOT EXISTS {nameof(JsonPrettifyEntity)}(
                {nameof(JsonPrettifyEntity.IsSortKey)} Bool,
                {nameof(JsonPrettifyEntity.IndentSize)} INTEGER
        )";

        using var command = new SqliteCommand(sql, connection);
        return command.ExecuteNonQuery() > 0;
    }
    catch (Exception ex)
    {
        return false;
    }
}
```

### **System.Text.Json**

参考：[JsonExtensions.cs]( https://github.com/dotnet9/CodeWF.Tools/blob/main/src/CodeWF.Tools/Extensions/JsonExtensions.cs)

```csharp
public static string ToJson<T>(T obj)
{
    if (obj == null)
    {
        return string.Empty;
    }

    var options = new JsonSerializerOptions
                  {
                      WriteIndented = true,
                      Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                      TypeInfoResolver = new DefaultJsonTypeInfoResolver()
                  };
    return System.Text.Json.JsonSerializer.Serialize(obj, options);
}

public static T FromJson<T>(string json)
{
    if (string.IsNullOrWhiteSpace(json))
    {
        return default;
    }

    var options = new JsonSerializerOptions
                  {
                      Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping, TypeInfoResolver = new DefaultJsonTypeInfoResolver()
                  };
    return System.Text.Json.JsonSerializer.Deserialize<T>(json!, options);
}
```

## 开源组件

### PublishAotCompressed

这是一个AOT压缩的NuGet 包，其中包含 MSBuild 目标，用于使用 [UPX](https://upx.github.io/) 压缩 [PublishAot](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/) 的结果。只需添加对此包的引用，然后像往常一样发布即可。AOT 编译的结果将被压缩。UPX 通常可节省 60% 或更多的尺寸。

说明：[https://www.nuget.org/packages/PublishAotCompressed](https://www.nuget.org/packages/PublishAotCompressed)

```xml
<PackageReference Condition="'$(Configuration)' == 'Release'" Include="PublishAotCompressed" Version="1.0.3"/>
```

项目文件说明

```xml
<!--发布时候使用的配置-->
<PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <!--发布裁剪-->
    <PublishTrimmed>true</PublishTrimmed>
    <!--自包含-->
    <SelfContained>true</SelfContained>
    <!--Aot发布-->
    <PublishAot>true</PublishAot>
    <!--引入的大小与速度选项-->
    <OptimizationPreference>Size</OptimizationPreference>
    <!--不关心在发生异常时拥有良好的堆栈跟踪-->
    <StackTraceSupport>false</StackTraceSupport>
    <!-- 启动后打包大小更小，但是启动会变慢，以及内存占用会增加-->
    <!--<PublishLzmaCompressed>true</PublishLzmaCompressed>-->
</PropertyGroup>
```

## Issue

### AOT和单文件打包互斥

提示错误信息：PublishAot and PublishSingleFile can not be specified at the same time

官网说明：[此处](https://learn.microsoft.com/en-us/dotnet/core/deploying/single-file/overview?tabs=cli)

这个时候如果还想生成一个单文件，那么可以使用Costura.Fody来进行操作。

## 参考资料

[AOT使用经验总结](https://mp.weixin.qq.com/s/feTlwpMbm41gcim-EO7-tA)

## 资料

AOT的使用以及.net与Go相互调用：[https://mp.weixin.qq.com/s/s9NO75My21oC3Erz_64-Wg](https://mp.weixin.qq.com/s/s9NO75My21oC3Erz_64-Wg)  
本机 AOT 的 ASP.NET Core支持：[https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/native-aot?view=aspnetcore-8.0](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/native-aot?view=aspnetcore-8.0)  
AOT和单位件发布对程序性能的影响：[https://www.cnblogs.com/InCerry/p/Single-File-And-AOT-Publish.html ](https://www.cnblogs.com/InCerry/p/Single-File-And-AOT-Publish.html) 

NET 8 NativeAOT 用法指南：https://mp.weixin.qq.com/s/aRhem0fJ2HNzRgtis5BhbQ  

让.NET Native AOT应用兼容Windows 7/Vista：https://zhuanlan.zhihu.com/p/695992746?utm_source=wechat_session&utm_medium=social&s_r=0



再探.NET8 NativeAOT（二）：https://www.jianshu.com/p/4bdd3c92a91f

再探.NET8 NativeAOT（三）：https://www.jianshu.com/p/75b88142090e
