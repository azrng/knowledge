---
title: 错误处理
lang: zh-CN
date: 2023-07-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: cuowuchuli
slug: ihgaem
docsId: '32029530'
---

### BadHttpRequestException: Request body too large
提示这错误是因为请求头大小超出了限制，这个时候需要设置kestrel的请求体大小
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
           Host.CreateDefaultBuilder(args)
               .ConfigureWebHostDefaults(webBuilder =>
               {
                   webBuilder.ConfigureKestrel((context, options) =>
                   {
                       //设置应用服务器Kestrel请求体最大为50MB
                       options.Limits.MaxRequestBodySize = 52428800;
                   });
                   webBuilder.UseStartup<Startup>();
});

```
