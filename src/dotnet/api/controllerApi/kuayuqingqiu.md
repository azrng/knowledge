---
title: 跨域请求
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kuayuqingqiu
slug: budtnd
docsId: '30607009'
---

## 概述
浏览器的安全策略上的限制可以有效组织Ajax向另外的一个服务发起请求，这就是著名的同源策略。跨域仅仅是浏览器的行为，通过代理服务器，或者其他工具可以绕过。
不同的域名、不用的端口、不用的协议之间请求都会出现跨域问题。

跨域对同源的要求有三点：协议相同、ip相同、端口相同。

## 操作

### Cors

#### 注册服务
如何突破这种限制，可以使用CORS。NetF中可以使用microsoft.aspnet.webapi.cors包来解决跨域问题。
```csharp
public static void AddCommon(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
               options.AddPolicy("AllowAll", p =>
                {
                    p.AllowAnyOrigin()//允许任务来源的主机访问
                      .AllowAnyMethod()//允许任何请求方式
                      .AllowAnyHeader();//允许任何头部
                      //.AllowCredentials();//允许任何证书     
                });
            });
        }
```
Core3.0之后不允许Origin和Credentials都不做限制
SetIsOriginAllowed((_) => true) 这样子就可以和AllowCredentials进行搭配，或者
```csharp
services.AddCors(options =>
{
    options.AddPolicy("default", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
```

**AddCors**来添加一个跨域处理方式，**AddPolicy**就是加个巡逻官，看看符合规则的放进来，不符合的直接赶出去。

| **方法** | **介绍** |
| --- | --- |
| AllowAnyOrigin | 允许所有的域名请求 |
| AllowAnyMethod | 允许所有的请求方式GET/POST/PUT/DELETE |
| AllowAnyHeader | 允许所有的头部参数 |
| AllowCredentials | 允许携带Cookie |

这里我使用的是允许所有，可以根据自身业务需要来调整，比如只允许部分域名访问，部分请求方式，部分Header：
```csharp
services.AddCors(options =>
            {
               options.AddPolicy("AllowSome", p =>
                 {
                    p.WithOrigins("https://www.baidu.com")
                    .WithMethods("GET", "POST")
                    .WithHeaders(HeaderNames.ContentType, "x-custom-header");
                 });
            });
```

#### 允许跨域
在Configure中声明全局跨域
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApplication2 v1"));
    }

    app.UseRouting();
           
    //使用cors
    app.UseCors("AllowAll");

    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```
只对某一些控制器支持跨域请求
```csharp
[Route("api/[controller]/[action]")]
[ApiController]
[EnableCors("AllowSome")]  // 跨域
public class BaseController : ControllerBase
```
只对某一些方法(Action)支持跨域请求
```csharp
[HttpGet]
[EnableCors("AllowSome")]
public async Task<int> Delete()
```
对某个Action限制不允许跨域请求
```csharp
[DisableCors]
```

### IIS解决跨域
环境：windows server 2008、IIS 7

为解决IIS发布资源前端调用报错跨域问题

#### 解决方案
点击发布网站，在右侧"功能视图"中，找到"HTTP 响应标头"，双击进入
点击页面右侧"添加"
![](/common/1621827213711-d39bdb74-13ef-4acd-8ad8-a275354b48ff.png)
分别添加如下键值对
```csharp
Access-Control-Allow-Headers：Content-Type, api_key, Authorization
Access-Control-Allow-Origin：*
Access-Control-Allow-Methods：GET,POST,PUT,DELETE,OPTIONS
```
> 原文链接：[https://blog.csdn.net/guzicheng1990/article/details/106253104/](https://blog.csdn.net/guzicheng1990/article/details/106253104/)

