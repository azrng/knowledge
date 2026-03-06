---
title: 获取所有注入的服务
lang: zh-CN
date: 2023-10-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: huoqusuoyouzhurudefuwu
slug: bp0cge
docsId: '96020204'
---

## 概述
通过手动编写中间件输出所有的服务以及对应的生命周期，或者直接使用nuget包Ardalis.ListStartupServices

## .NetCore 3.1
在strartup中注入服务IServiceCollection
```plsql
private IServiceCollection _services;
public void ConfigureServices(IServiceCollection services)
{
    _services = services;
}
```

### 输出到日志
```plsql
public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
{
    var _logger = loggerFactory.CreateLogger("Services");
    _logger.LogInformation($"Total Services Registered: {_services.Count}");
    foreach (var service in _services)
    {
        _logger.LogInformation($"Service: {service.ServiceType.FullName}\n      Lifetime: {service.Lifetime}\n      Instance: {service.ImplementationType?.FullName}");
    }

    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.Run(async (context) =>
    {
        await context.Response.WriteAsync("Hello World!");
    });
}
```
输出为页面
```plsql
public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
{
    var _logger = loggerFactory.CreateLogger("Services");
    _logger.LogInformation($"Total Services Registered: {_services.Count}");
    foreach (var service in _services)
    {
        _logger.LogInformation($"Service: {service.ServiceType.FullName}\n      Lifetime: {service.Lifetime}\n      Instance: {service.ImplementationType?.FullName}");
    }

    if (env.IsDevelopment())
    {
        app.Map("/allservices", builder => builder.Run(async context =>
        {
            context.Response.ContentType = "text/html; charset=utf-8";
            await context.Response.WriteAsync($"<h1>所有服务{_services.Count}个</h1><table><thead><tr><th>类型</th><th>生命周期</th><th>Instance</th></tr></thead><tbody>");
            foreach (var svc in _services)
            {
                await context.Response.WriteAsync("<tr>");
                await context.Response.WriteAsync($"<td>{svc.ServiceType.FullName}</td>");
                await context.Response.WriteAsync($"<td>{svc.Lifetime}</td>");
                await context.Response.WriteAsync($"<td>{svc.ImplementationType?.FullName}</td>");
                await context.Response.WriteAsync("</tr>");
            }
            await context.Response.WriteAsync("</tbody></table>");
        }));
        app.UseDeveloperExceptionPage();
    }

    app.Run(async (context) =>
    {
        await context.Response.WriteAsync("Hello World!");
    });
}
```

## .Net 6.0+
在开发环境启用该中间件
```plsql
if (app.Environment.IsDevelopment())
{
    app.Map("/allservices", config => config.Run(async (context) =>
    {
        context.Response.ContentType = "text/html; charset=utf-8";
        await context.Response.WriteAsync($"<h1>所有服务{builder.Services.Count}个</h1><table  border=\"1px solid #ccc\" cellspacing=\"0\" cellpadding=\"0\" ><thead><tr><th>类型</th><th>生命周期</th><th>实现</th></tr></thead><tbody>");
        foreach (var svc in builder.Services)
        {
            await context.Response.WriteAsync("<tr>");
            await context.Response.WriteAsync($"<td>{svc.ServiceType.FullName}</td>");
            await context.Response.WriteAsync($"<td>{svc.Lifetime}</td>");
            await context.Response.WriteAsync($"<td>{svc.ImplementationType?.FullName}</td>");
            await context.Response.WriteAsync("</tr>");
        }
        await context.Response.WriteAsync("</tbody></table>");
    }));
}
```
或者使用下面的写法
```csharp
public class ServiceConfig
{
    public string Path { get; set; } = "/listallservices";


    public List<ServiceDescriptor> Services { get; set; } = new List<ServiceDescriptor>();

}

public class ShowAllServicesMiddleware
{
    private readonly ServiceConfig _config;

    private readonly RequestDelegate _next;

    public ShowAllServicesMiddleware(RequestDelegate next, IOptions<ServiceConfig> config)
    {
        _config = config.Value;
        _next = next;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        if (httpContext.Request.Path == _config.Path)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("<h1>All Services</h1>");
            stringBuilder.Append("<table><thead>");
            stringBuilder.Append("<tr><th>Type</th><th>Lifetime</th><th>Instance</th></tr>");
            stringBuilder.Append("</thead><tbody>");
            foreach (ServiceDescriptor service in _config.Services)
            {
                stringBuilder.Append("<tr>");
                stringBuilder.Append("<td>" + service.ServiceType.FullName + "</td>");
                stringBuilder.Append($"<td>{service.Lifetime}</td>");
                stringBuilder.Append("<td>" + service.ImplementationType?.FullName + "</td>");
                stringBuilder.Append("</tr>");
            }

            stringBuilder.Append("</tbody></table>");
            await httpContext.Response.WriteAsync(stringBuilder.ToString());
        }
        else
        {
            await _next(httpContext);
        }
    }
}
```
使用方法
```csharp
builder.Services.Configure<ServiceConfig>(config =>
{
    config.Services = new List<ServiceDescriptor>(builder.Services);

    // optional - default path to view services is /listallservices - recommended to choose your own path
    config.Path = "/listservices";
});
```

## 资料
[https://www.cnblogs.com/linezero/p/5739944.html](https://www.cnblogs.com/linezero/p/5739944.html)
