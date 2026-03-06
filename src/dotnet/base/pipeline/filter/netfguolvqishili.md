---
title: NetF过滤器示例
lang: zh-CN
date: 2022-08-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: netfguolvqishili
slug: gokrt1
docsId: '89465830'
---

## 授权过滤器
我们不一定要用MVC默认的Authorize授权验证规则，规则可以自己来定，自定义授权过滤器可以继承AuthorizeAttribute这个类，这个类里面有两个方法是要重写的bool AuthorizeCore(HttpContextBase httpContext)：这里主要是授权验证的逻辑处理，返回true的则是通过授权，返回了false则不是。void HandleUnauthorizedRequest(AuthorizationContext filterContext)：这个方法是处理授权失败的事情。
     这里就定义了一个比较奇偶数的授权处理器，当请求的时候刚好是偶数分钟的，就通过可以获得授权，反之则不通过。当授权失败的时候，就会跳转到登陆页面了。
```csharp
public class MyAuthorizeFilter : AuthorizeAttribute
{
    protected override bool AuthorizeCore(HttpContextBase httpContext)
    {
        return DateTime.Now.Minute % 2 == 0;//返回true代表授权通过，不为true代表授权不通过
    }
    /// <summary>
    /// 如果不满足情况  那么就运行下面的方法
    /// </summary>
    /// <param name="filterContext"></param>
    protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
    {
        filterContext.HttpContext.Response.Redirect("/Default/Login");
    }
}
```

## 异常过滤器
```csharp
public class CustomExceptionFilter : ExceptionFilterAttribute
{
    public void OnException(ExceptionContext filterContext)
    {
        Console.WriteLine("this is CustomExceptionFilterAttribute.OnException");
    }
}
```

## Action过滤器
```csharp
public class CustomActionFilter : ActionFilterAttribute
{
    public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
    {
        Console.WriteLine("this is CustomActionFilterAttribute.OnActionExecuted");
    }

    public override void OnActionExecuting(HttpActionContext actionContext)
    {
        Console.WriteLine("this is CustomActionFilterAttribute.OnActionExecuting");
    }
}
```
