---
title: 配置
lang: zh-CN
date: 2022-12-10
publish: true
author: azrng
isOriginal: false
category:
  - dotNET
tag:
  - blazor
---

## 配置读取

客户端安全限制阻止通过用户代码直接访问文件，包括应用配置的设置文件。 若除了 `appsettings.json`/`appsettings.{ENVIRONMENT}.json` 之外，还要将 `wwwroot` 文件夹中的配置文件读入配置，请使用 [HttpClient](https://learn.microsoft.com/zh-cn/dotnet/api/system.net.http.httpclient)。



比如需要将该文件读取进配置：wwwroot/cars.json，将 [Microsoft.Extensions.Configuration](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.configuration) 的命名空间添加到 `Program` 文件，然后使用HttpClient服务使得客户端读取文件

```c#
var http = new HttpClient()
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress)
};

builder.Services.AddScoped(sp => http);

using var response = await http.GetAsync("cars.json");
using var stream = await response.Content.ReadAsStreamAsync();

builder.Configuration.AddJsonStream(stream);
```



还有其他源方案，参阅资料[此处](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/fundamentals/configuration?view=aspnetcore-8.0#memory-configuration-source)