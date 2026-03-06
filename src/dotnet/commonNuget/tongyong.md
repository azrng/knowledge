---
title: 通用
lang: zh-CN
date: 2023-09-10
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: tongyong
slug: hq52kd
docsId: '84868376'
---

## 工具类库汇总

https://gitee.com/FenRuiDangDeFuLangXiSi/CosyNest | 刘晓阳/CosyNest - 码云 - 开源中国   工具类库



### Masuit.Tools

https://gitee.com/masuit/Masuit.Tools | 懒得勤快的码数吐司工具库

特色功能

* LargeMemoryStream：支持操作最大1TB的内存

## ConfigureAwait

### ConfigureAwaitChecker.Analyzer

检查' ConfigureAwait(false) '的使用情况。
仓库地址：[https://github.com/cincuranet/ConfigureAwaitChecker](https://github.com/cincuranet/ConfigureAwaitChecker)

或者通过规则文件来限制必须配置等

### ConfigureAwait.Fody

用来帮助你在项目中配置ConfigureAwait，可以设置在全局级别以及类级别自动给你配置

仓库地址：https://github.com/Fody/ConfigureAwait

需要引用这两个nuget包

```shell
PM> Install-Package Fody
PM> Install-Package ConfigureAwait.Fody
```

简单使用代码

```c#
using Fody;

[ConfigureAwait(false)]
public class MyAsyncLibrary
{
    public async Task MyMethodAsync()
    {
        await Task.Delay(10);
        await Task.Delay(20).ConfigureAwait(true);
    }

    public async Task AnotherMethodAsync()
    {
        await Task.Delay(30);
    }
}
```

## inshellisense

microsoft/inshellisense：IDE风格的命令行自动完成 https://github.com/microsoft/inshellisense

## Microsoft.AspNetCore.HeaderPropagation

请求标头传播组件，可以实现生成一个全局唯一的RequestId，然后通过存放在请求头中实现在多个服务之间传播。
引用nuget包，并配置服务后
```
services.AddHeaderPropagation();
```
注意要使用服务
```
app.UseHeaderPropagation();// 需要在UseRouting前面
app.UseRouting();
```
然后当你请求其他服务的时候，会默认包含一个请求头Request-Id(高版本换名字了)，该请求头在项目启动的时候生成一次。

## Microsoft.VisualStudio.Web.CodeGeneration.Design
引用这个包默认情况下会生成一堆各个语言的资源文件，如果不想要那么多，那么就可以通过手动来指定语言，下面来编辑项目文件，增加下面的节点
```xml
<SatelliteResourceLanguages>en</SatelliteResourceLanguages>
    
如果你不希望包含任何卫星资源，可以设置为None：
<SatelliteResourceLanguages>None</SatelliteResourceLanguages>

添加以下属性来指定要包含的语言资源：
<SatelliteResourceLanguages>zh-Hans</SatelliteResourceLanguages>
```

SatelliteResourceLanguages 是一个.NET Core项目文件（.csproj）中的属性，用于指定在构建和发布时应包含的特定语言的卫星资源集。当设置SatelliteResourceLanguages时，只有指定的语言资源会被包含在发布包中，其他语言的资源将被忽略。
例如，如果设置为"en-US,fr-FR"，则只会包含英语（美国）和法语（法国）的资源文件。如果设置为"None"，则不会包含任何卫星资源，应用将仅使用主程序集中的默认资源。

总结来说，SatelliteResourceLanguages 更侧重于构建和发布过程，控制了发布包中包含的本地化资源。


[https://mp.weixin.qq.com/s/bORwnPO1qDPT7vxw0eni9g](https://mp.weixin.qq.com/s/bORwnPO1qDPT7vxw0eni9g) | [Blazor] 删除多余的Microsoft.CodeAnalysis语言资源文件

## 系统信息检测

### UAParser

可以用来解析前端的User-Agent信息

```csharp
var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0";
var userAgentInfo = Parser.GetDefault().Parse(userAgent);
Console.WriteLine($"浏览器信息：{userAgentInfo.UA}");
Console.WriteLine($"操作系统：{userAgentInfo.OS}");
Console.WriteLine($"设备：{userAgentInfo.Device}");
```

### Hardware.Info

Net跨平台硬件信息查询库 Hardware.Info：全面获取系统硬件详情：https://mp.weixin.qq.com/s/Qhk07tFO70mNs_xpFxUydQ

## SourceLink

是一个和语言和源代码控制无关的系统，用于为二进制文件提供一流的源代码调试体验。项目的目标是让任何构建Nuget库的人都能毫不费力为用户提供源代码调试。.NET Core 和 Roslyn 等 Microsoft 库已启用。

资料：[https://github.com/dotnet/sourcelink](https://github.com/dotnet/sourcelink)

### 快速使用
安装了该nuget包的nuget包，那么你就可以在vs中进行调试软件包的源代码。

配置如下：

- 打开 工具 -> 选项 -> 调试， 勾选 启用源链接支持，取消勾选 启用仅我的代码 ，勾选启用源链接支持
- 设置调试=>符号,勾选Microsoft符号服务器和Nuget.org符号服务器
> 注意：开启了以后你调试自己代码的时候也会调试nuget包的代码，所以会耗时，所以根据需要开关。


### 打包Nuget
需要安装指定的nuget包并且做如下配置
```csharp
 <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <PublishRepositoryUrl>true</PublishRepositoryUrl>
    <IncludeSymbols>true</IncludeSymbols>
    <SymbolPackageFormat>snupkg</SymbolPackageFormat>
  </PropertyGroup>
```

### Github
如果项目是托管在Github或者Github Enterprise上，那么就可以安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.SourceLink.GitHub" Version="1.1.1" PrivateAssets="All"/>
</ItemGroup>
```

### GitLab
如果托管在GitLab上，那么就可以使用
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.SourceLink.GitLab" Version="1.1.1" PrivateAssets="All"/>
</ItemGroup>
```
从版本 1.1.1 开始，Microsoft.SourceLink.GitLab 默认假定 GitLab 版本 12.0+。如果您的项目由低于 12.0 版的 GitLab 托管，则SourceLinkGitLabHost除了包引用之外，您还必须指定项目组：
```csharp
<ItemGroup>
  <SourceLinkGitLabHost Include="gitlab.yourdomain.com" Version="11.0"/>
</ItemGroup>
```
项目组SourceLinkGitLabHost指定 GitLab 主机的域和 GitLab 的版本。该版本很重要，因为用于访问文件的 URL 格式随着版本 12.0 的变化而变化。默认情况下，源链接采用新格式（版本 12.0+）。

### Gitea
在gitea上托管的，使用
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.SourceLink.Gitea" Version="1.1.1" PrivateAssets="All"/>
</ItemGroup>
```

