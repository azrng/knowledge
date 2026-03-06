---
title: 说明
lang: zh-CN
date: 2023-04-11
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: readme
slug: vzynn9nnzmeghft9
docsId: '121335492'
---

## 介绍
注入到应用程序中处理请求和响应的组件，是通过多个委托来嵌套成型的一个俄罗斯套娃，也想一层层的“滤网”，过滤所有的请求和响应。
1.选择是否将http请求传递给管道中的下个组件。
2.可以在管道中的下个组件之前和之后执行工作。
在ASP.NET Core 中一个中间件组件只做一个特定的事情。
直观的感觉：中间件是http请求管道中的一层层的AOP扩展。

整个HTTP Request请求跟HTTP Response返回结果之间的处理流程是一个**请求管道（request pipeline）**。而**中间件(middleware)**则是一种装配到请求管道以处理请求和响应的组件。每个组件：  
●**可选择是否将请求传递到管道中的下一个组件。**  
●**可在管道中的下一个组件前后执行工作。**  
中间件（middleware）处理流程如下图所示：  
![image.png](/common/1610504420615-46cb846d-a818-4cee-a6b3-b2c5d49bfb41.png)  
每个请求委托（中间件）都可以在下一个请求委托（中间件)之前和之后执行操作。中间件中的异常处理委托应该在管道的早起被处理，这样子就可以捕捉在管道后期发生的异常。

## 使用场景
中间件用来处理应用程序中和业务关系不大的的需求，例如：身份验证、session存储、日志记录等

## 中间件的顺序
![aeaacb354e8d3c317df001579d65c5a](/dotnet/aeaacb354e8d3c317df001579d65c5a.jpg)

异常/错误处理 => HTTP 严格传输安全协议HTTPS 重定向 => 静态文件服务器 =>  Cookie 策略实施路由 => 身份验证会话MVC

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();//异常显示页中间件
        app.UseDatabaseErrorPage();
    }
    else
    {
        app.UseExceptionHandler("/Error");//异常处理中间件
        app.UseHsts();
    }

    app.UseHttpsRedirection();//https重定向中间件
    app.UseStaticFiles();//静态文件中间件，返回静态文件，并简化进一步请求处理
    // app.UseCookiePolicy();//cookie策略中间件  

    app.UseRouting();//用户路由请求的路由中间件
    // app.UseRequestLocalization();//
    // app.UseCors();//允许跨域请求

    app.UseAuthentication();//身份验证中间件  尝试对用户进行身份验证，然后才会允许用户访问安全资源
    app.UseAuthorization();//用户授权用户访问安全资源的授权中间件
    // app.UseSession();//会话中间件 

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapRazorPages();
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
    });
}
```

## 基础的中间件
Use和Run 都是用来向应用请求管道里面添加中间件的，use方法可以调用下一个中间件的添加，run不会，run运行过就终止了

### Use命令
会将请求往下传递
```csharp
app.Use(async (context, next) =>
{
    Console.WriteLine("Use");
    await next.Invoke();
});

app.Use(async (context, next) =>
{
    Console.WriteLine("Use1");
    await next.Invoke();
});
```
先打印Use，然后Use1，最后完成执行。
使用Use方法运行一个委托，我们可以在Next调用之前和之后分别执行自定义的代码，从而可以方便的进行日志记录等工作。这段代码中，使用next.Invoke()方法调用下一个中间件，从而将中间件管道连贯起来；如果不调用next.Invoke()方法，则会造成管道短路，不再往下面执行了。

### Run命令
终止传递
一般用于输出返回错误信息：
context.Response.WriteAsync(JsonConvert.SerializeObject(new Response{Code="400",Msg="系统出错" })); 
```csharp
app.Run(async (context) =>
{
   await context.Response.WriteAsync("Hello World!");
});
```
很简单的示例，在默认api流程前，加了一段输出。段代码中，使用Run方法运行一个委托，这就是最简单的中间件，它拦截了所有请求，返回一段文本作为响应。Run委托终止了管道的运行，因此也叫作中断中间件。

### Map命令
Map创建基于路径匹配的分支、使用MapWhen创建基于条件的分支。
创建一段IApplicationBuilder.Map的示例，可以作为一个简单的接口使用
```csharp
app.Map("/api/test", _map =>
{
    _map.Run(async (conetxt) =>
    {
        await conetxt.Response.WriteAsync("test");
    });
});
```
或者对特定路径指定中间件
```csharp
app.Map("/api/test2", _map =>
{
    _map.Use(async (conetxt, next) =>
    {
        Console.WriteLine("只有这个地址才会输出请求信息");
        await next.Invoke();
        Console.WriteLine("只有这个地址才会输出响应信息");
    });
});
```
但是也是运行结束就返回了

### MapWhen
判断式，两个委托，第一个委托作为判断条件的内容，第二个委托是要执行的逻辑。
```csharp
app.MapWhen(content =>
{
    return content.Request.Query.Keys.Contains("test");//判断下面的中间件是否执行
}, build =>
{
    Func<RequestDelegate, RequestDelegate> middleware = next =>
    {
        return async c =>
        {
            await c.Response.WriteAsync("你好");
        };
    };
    build.Use(middleware);
});
```

## 自定义中间件
```csharp
public static class MyMiddlewareExtensions
{
    public static IApplicationBuilder UseMyMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<MyMiddleware>();
    }
}

public class MyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<MyMiddleware> _logger;

    public MyMiddleware(RequestDelegate next, ILogger<MyMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext httpContext)
    {
        _logger.LogInformation("开始执行");
        await _next(httpContext);
        _logger.LogInformation("执行结束");
    }
}
```
使用中间件
```csharp
app.UseMyMiddleware();
```

## 参考文档
> 中间件：[https://www.cnblogs.com/wzk153/p/10904988.html](https://www.cnblogs.com/wzk153/p/10904988.html)
> 请求管道构成：[https://www.cnblogs.com/RainingNight/p/middleware-in-asp-net-core.html](https://www.cnblogs.com/RainingNight/p/middleware-in-asp-net-core.html)

