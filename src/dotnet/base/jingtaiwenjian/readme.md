---
title: 说明
lang: zh-CN
date: 2023-09-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: ggvgi6qixs8wy5ki
docsId: '140075350'
---

## 默认操作

```csharp
app.UseStaticFiles();
```

## 修改静态文件目录

修改静态文件目录，并设置允许跨域访问静态资源
```csharp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.WebRootPath, "resources")),
    RequestPath = "/resources",
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    }
});
```

## 特殊文件处理

如果尝试访问apk等静态文件时遇到404错误，通常意味着Web服务器未能正确识别并处理这类非标准文件类型的请求， Web服务器需要知道如何处理不同类型的文件，这通常通过MIME类型来定义，需要显式添加其MIME类型映射。

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = new FileExtensionContentTypeProvider(new Dictionary<string, string>
               {
                   { ".apk", "application/vnd.android.package-archive" }
               })
});
```

如果部署到IIS也遇到了该情况，那么可以参考资料[让服务器iis支持.apk.wgt .ipa文件下载的设置方法](https://cloud.tencent.com/developer/article/1861785)
