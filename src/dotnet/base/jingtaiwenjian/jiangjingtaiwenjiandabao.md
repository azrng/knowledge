---
title: 将静态文件打包
lang: zh-CN
date: 2023-09-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiangjingtaiwenjiandabao
slug: nnmdks
docsId: '93509415'
---

## 目的
虽然.net项目可以执行单文件发布，但是不能将前端静态文件包含到里面，如何将wwwroot目录下的静态文件打包到exe文件内？

## 思路
默认情况下，FileProvider 是读取本地物理文件。
如果改成从 EXE 文件中读取静态文件的 FileProvider，不就实现了我们的目的了吗？！
而实际上，.NET 已经提供了这样一个 FileProvider：ManifestEmbeddedFileProvider，用于访问嵌入在程序集中的文件。

## 实现

1. 将 Microsoft.Extensions.FileProviders.Embedded NuGet 包添加到 Web API 项目。
2. 修改项目文件，将 GenerateEmbeddedFilesManifest 属性设置为 true，并指定嵌入的文件来源：
```csharp
<PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
     <GenerateEmbeddedFilesManifest>true</GenerateEmbeddedFilesManifest>
</PropertyGroup>

<ItemGroup>
    <EmbeddedResource Include="wwwroot\**" />
</ItemGroup>
```

3. 修改program，设置静态文件中间件
```csharp
app.UseFileServer(new FileServerOptions
{
    FileProvider = new ManifestEmbeddedFileProvider(
        typeof(Program).Assembly, "wwwroot"
    )
});
```

4. 发布 Web API，将生成的独立 EXE 文件进行部署。可以看到，不依赖任何其他文件，前后端功能使用正常。

## 资料
[https://mp.weixin.qq.com/s/ZV6FWLaCXoY5ZeBGWuMGZg](https://mp.weixin.qq.com/s/ZV6FWLaCXoY5ZeBGWuMGZg) | 如何打造单文件前后端集成 ASP.NET Core 应用
