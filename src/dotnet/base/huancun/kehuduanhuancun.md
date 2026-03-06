---
title: 客户端缓存
lang: zh-CN
date: 2023-08-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kehuduanhuancun
slug: pst24g
docsId: '51641666'
---

## 需求
这里我们实现禁用浏览器客户端缓存(在响应头增加配置)

## NetF操作
通过在过滤器中使用Cache配置来操作浏览器缓存
```csharp
public class NoCacheAttribute : ActionFilterAttribute
{  
    public override void OnResultExecuting(ResultExecutingContext filterContext)
    {
        filterContext.HttpContext.Response.Cache.SetExpires(DateTime.UtcNow.AddDays(-1));
        filterContext.HttpContext.Response.Cache.SetValidUntilExpires(false);
        filterContext.HttpContext.Response.Cache.SetRevalidation(HttpCacheRevalidation.AllCaches);
        filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        filterContext.HttpContext.Response.Cache.SetNoStore();

        base.OnResultExecuting(filterContext);
    }
}

```

## NetCore操作

## 设置Action过滤器
通过过滤器对响应头进行操作
```csharp
public class NoCacheAttribute : ActionFilterAttribute
{
    public override void OnResultExecuting(ResultExecutingContext filterContext)
    {
        filterContext.HttpContext.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        filterContext.HttpContext.Response.Headers["Expires"] = "-1";
        filterContext.HttpContext.Response.Headers["Pragma"] = "no-cache";

        base.OnResultExecuting(filterContext);
    }
}
```

### 使用特性
通过在控制器或者方法上面添加特性来实现浏览器缓存
```csharp
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public class HomeController : Controller
{
}

[HttpGet]
[ResponseCache(Duration=10)]
public string GetTime()
{
    return DateTime.Now.ToString();
}
```
增加该特性会自动在响应头增加Cache-Control: public,max-age=10，表达式服务器指示浏览器端“可以缓存这个响应内存10秒”

### 中间件
如果你需要在全局作用域上禁用，可以利用 Middleware 机制实现，参考如下代码。
```csharp
public sealed class RequestHandlerMiddleware
{
    private readonly RequestDelegate _next;

    public RequestHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        await _next(context).ConfigureAwait(false);

        context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        context.Response.Headers["Expires"] = "-1";
        context.Response.Headers["Pragma"] = "no-cache";
    }
}
```

## 参考资料
[https://mp.weixin.qq.com/s/jqeynbAyChMLcNOxw4HVyw](https://mp.weixin.qq.com/s/jqeynbAyChMLcNOxw4HVyw) | .NET Core 中有等价的 HttpContext.Response.Cache 吗？

