---
title: 起始页
lang: zh-CN
date: 2021-08-19
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qishixie
slug: qrvolc
docsId: '51490585'
---

### 起始页
为应用程序配置一个启动运行的页面
为项目新建wwwroot目录，然后在该目录下新建index.html文件
```csharp
var defaultFilesOptions = new DefaultFilesOptions();
defaultFilesOptions.DefaultFileNames.Clear();
defaultFilesOptions.DefaultFileNames.Add("index.html");
app.UseDefaultFiles(defaultFilesOptions);
app.UseStaticFiles();
```
项目启动时候会直接访问该index.html页面

### 默认页
```csharp
/// <summary>
/// 启用默认页
/// </summary>
/// <param name="app"></param>
/// <returns></returns>
public static IApplicationBuilder UseDefaultPage(this IApplicationBuilder app)
{
    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/app");
    if (Directory.Exists(path))
    {
        var options = new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(path),
            RequestPath = new PathString("/app")
        };

        app.UseStaticFiles(options);

        var rewriteOptions = new RewriteOptions().AddRedirect("^$", "app");

        app.UseRewriter(rewriteOptions);
    }

    return app;
}
```

### 启动文档页
```csharp
/// <summary>
/// 启动文档页
/// </summary>
/// <param name="app"></param>
/// <returns></returns>
public static IApplicationBuilder UseDocs(this IApplicationBuilder app)
{
    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/api-docs");
    if (Directory.Exists(path))
    {
        var options = new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(path),
            RequestPath = new PathString("/api-docs")
        };

        app.UseStaticFiles(options);
    }

    return app;
}
```

### 上传目录访问权限
```csharp
/// <summary>
/// 上传目录访问权限
/// </summary>
/// <param name="app"></param>
/// <returns></returns>
public static IApplicationBuilder UseUpload(this IApplicationBuilder app)
{
    var path = Path.Combine(Directory.GetCurrentDirectory(), "Upload");
    if (!Directory.Exists(path))
    {
        Directory.CreateDirectory(path);
    }
    var options = new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(path),
        RequestPath = new PathString("/Upload")
    };
    app.UseStaticFiles(options);
    return app;
}
```

