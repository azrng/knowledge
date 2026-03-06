---
title: 响应压缩
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xiangyingyasu
slug: xn6fbr
docsId: '55664542'
---

## 介绍
响应压缩技术是目前Web开发领域中比较常用的技术，在带宽资源受限的情况下，使用压缩技术是提升带宽负载的首选方案。我们熟悉的Web服务器，比如IIS、Tomcat、Nginx、Apache等都可以使用压缩技术，常用的压缩类型包括Brotli、Gzip、Deflate，它们对CSS、JavaScript、HTML、XML 和 JSON等类型的效果还是比较明显的，但是也存在一定的限制对于图片效果可能没那么好，因为图片本身就是压缩格式。其次，对于小于大约150-1000 字节的文件（具体取决于文件的内容和压缩的效率，压缩小文件的开销可能会产生比未压缩文件更大的压缩文件。在`ASP.NET Core`中我们可以使用非常简单的方式来使用响应压缩。

## 使用方式
在`ASP.NET Core`中使用响应压缩的方式比较简单。首先，在ConfigureServices中添加services.AddResponseCompression注入响应压缩相关的设置，比如使用的压缩类型、压缩级别、压缩目标类型等。其次，在Configure添加app.UseResponseCompression拦截请求判断是否需要压缩,大致使用方式如下
```csharp

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddResponseCompression();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        app.UseResponseCompression();
    }
}
```
如果需要自定义一些配置的话还可以手动设置压缩相关
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddResponseCompression(options =>
    {
        //可以添加多种压缩类型，程序会根据级别自动获取最优方式
        options.Providers.Add<BrotliCompressionProvider>();
        options.Providers.Add<GzipCompressionProvider>();
        //添加自定义压缩策略
        options.Providers.Add<MyCompressionProvider>();
        //针对指定的MimeType来使用压缩策略
        options.MimeTypes = 
            ResponseCompressionDefaults.MimeTypes.Concat(
                new[] { "application/json" });
    });
    //针对不同的压缩类型，设置对应的压缩级别
    services.Configure<GzipCompressionProviderOptions>(options => 
    {
        //使用最快的方式进行压缩，单不一定是压缩效果最好的方式
        options.Level = CompressionLevel.Fastest;

        //不进行压缩操作
        //options.Level = CompressionLevel.NoCompression;

        //即使需要耗费很长的时间，也要使用压缩效果最好的方式
        //options.Level = CompressionLevel.Optimal;
    });
}
```
 关于响应压缩大致的工作方式就是，当发起Http请求的时候在Request Header中添加Accept-Encoding:gzip或者其他你想要的压缩类型，可以传递多个类型。服务端接收到请求获取Accept-Encoding判断是否支持该种类型的压缩方式，如果支持则压缩输出内容相关并且设置Content-Encoding为当前使用的压缩方式一起返回。客户端得到响应之后获取Content-Encoding判断服务端是否采用了压缩技术，并根据对应的值判断使用了哪种压缩类型，然后使用对应的解压算法得到原始数据。

## 资料
[https://mp.weixin.qq.com/s/64QO0R8qxRfYOgsOwav5hw](https://mp.weixin.qq.com/s/64QO0R8qxRfYOgsOwav5hw) | .Net Core HttpClient处理响应压缩

