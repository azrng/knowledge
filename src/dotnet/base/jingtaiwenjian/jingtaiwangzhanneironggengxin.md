---
title: 静态网站内容更新
lang: zh-CN
date: 2022-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jingtaiwangzhanneironggengxin
slug: yt4itp
docsId: '65940506'
---

## 需求
我们的应用一个版本可以对应一个部署槽，通过部署槽我们就基本可以无缝地从一个版本切换到另外一个版本。（通过配置显示当下静态网站使用哪个目录下的文件。）

## 操作

### FileProvider
ASP.NET Core 里静态文件的托管是允许自定义一个 IFileProvider 的，默认会使用物理路径文件， ASP.NET Core 默认使用 wwroot 目录下作为默认的静态文件来源。
对于静态文件而言我们简单地使用两个目录来模拟两个部署槽，当需要的时候通过修改配置来动态修改生效的部署槽，基于 IOptionMonitor 和 PhysicalFileProvider 来实现一个简单的 DynamicFileProvider，实现代码如下：
```csharp
public class DynamicFileProviderOptions
{
    public string CurrentSlot { get; set; }
}

public class DynamicFileProvider : IFileProvider
{
    private PhysicalFileProvider _physicalFileProvider;
    private const string DefaultSlotName = "Slot1";

    public DynamicFileProvider(IOptionsMonitor<DynamicFileProviderOptions> optionsMonitor, IWebHostEnvironment webHostEnvironment)
    {
        var webRoot = webHostEnvironment.ContentRootPath;
        _physicalFileProvider = new PhysicalFileProvider(Path.Combine(webRoot, optionsMonitor.CurrentValue.CurrentSlot ?? DefaultSlotName));
        optionsMonitor.OnChange(options =>
        {
            var path = Path.Combine(webRoot, options.CurrentSlot);
            _physicalFileProvider = new PhysicalFileProvider(path);
        });
    }

    public IDirectoryContents GetDirectoryContents(string subpath)
    {
        return _physicalFileProvider.GetDirectoryContents(subpath);
    }

    public IFileInfo GetFileInfo(string subpath)
    {
        return _physicalFileProvider.GetFileInfo(subpath);
    }

    public IChangeToken Watch(string filter)
    {
        return _physicalFileProvider.Watch(filter);
    }
}
```
看起来是不是简单，其实就是在 PhysicalFileProvider 的基础上封装了一下，配置发生变化的时候构建一个新的 PhysicalFileProvider

### 配置Host
接着我们来看一下如何使用，使用代码如下：
```csharp
var builder = Host.CreateDefaultBuilder(args);
builder.ConfigureWebHostDefaults(webHostBuilder =>
{
    webHostBuilder.ConfigureServices((context, services) =>
    {
        services.Configure<DynamicFileProviderOptions>(context.Configuration);
        services.AddSingleton<DynamicFileProvider>();
    });
    webHostBuilder.Configure(app =>
    {
        var dynamicFileProvider = app.ApplicationServices.GetRequiredService<DynamicFileProvider>();
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = dynamicFileProvider,
        });
    });
});
var host = builder.Build();
host.Run();
```
这里的示例只需要这些代码我们的应用就可以跑起来了。通过修改配置文件的内容可以动态使用哪个网站。

### 优化
提供了一个做切换的一个简单的 API
```csharp
app.Map(new PathString("/redeploy"), appBuilder => appBuilder.Run(context =>
{
    if (context.RequestServices.GetRequiredService<IConfiguration>() is ConfigurationRoot configuration)
    {
        var currentSlot = configuration["CurrentSlot"];
        configuration["CurrentSlot"] = "Slot2" != currentSlot ? "Slot2" : "Slot1";
        configuration.Reload();
        return context.Response.WriteAsync("Success");
    }
    return Task.CompletedTask;
}));
```
这个 API 做的事情很简单，在 Slot1 和 Slot2 之间进行切换，如果原来是 Slot2 则切换成 Slot1 否则切换成 Slot2，修改配置之后调用一下 Reload 以触发配置更新，删除配置文件中的 CurrentSlot 配置，重新运行示例，查看 http://localhost:5000/index.html，还是看到的 Slot1 中的内容，然后我们调用一下 /redeploy 接口来动态切换一下配置，然后再次刷新页面就会看到 Slot2 中的内容，再调用一下 redeploy 之后刷新页面就会变回 Slot1 中的内容。

## 资料
[https://mp.weixin.qq.com/s/xD76udEkP67sBDqH4ci13A](https://mp.weixin.qq.com/s/xD76udEkP67sBDqH4ci13A) | ASP.NET Core 实现一个简单的静态网站滚动更新
