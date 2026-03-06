---
title: 防止重复提交
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fangzhichongfudijiao
slug: zguawz
docsId: '32101027'
---

## 简介
在平常开发中，我们常常会遇到防止重复请求的问题。当用户因为网络不佳或者其他问题的情况下，会多次点击，导致重复提交，重复提交的后果在交易系统、售后维权，以及支付系统中尤其严重。

## 解决方案

### 前端-按钮禁用
当用户第一次点击按钮提交后，修改按钮的状态为禁用状态，防止用户重复提交。

### 后端-redis缓存
当用户第一次点击按钮提交后，然后存储一个redis值，key是UserId+方法名称，值随意，时间不能太长也不能太短，然后在逻辑处理结束后将该值删除，当第一次请求没有结束的时候，用户第二次请求过来，然后去redis获取值，发现值已经存在，这个时候直接返回，防止重复提交。

### 后端-Zookeeper防重策略 
流程如下：

![](/common/1614567780801-d3b41f13-bfcc-4877-9847-fed609c13fbb.webp)

### 过滤器实现
注入
```csharp
services.Configure<CookiePolicyOptions>(options =>
{
    // This lambda determines whether user consent for non-essential cookies is needed for a given request.
    options.CheckConsentNeeded = Context => false;
    options.MinimumSameSitePolicy = SameSiteMode.None;
});

services.AddMemoryCache();
services.AddSession(options => {
    // Set a short timeout for easy testing.
    options.IdleTimeout = TimeSpan.FromMinutes(10);
    options.Cookie.HttpOnly = true;
    // Make the session cookie essential
    options.Cookie.IsEssential = true;
});
```
然后使用Session
```csharp
 app.UseSession();
```
接下来定义一个防重复提交的过滤器。
```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class PreventDoublePostAttribute : ActionFilterAttribute
{
    private const string _uniqFormuId = "LastProcessedToken";

    public override async void OnActionExecuting(ActionExecutingContext context)
    {
        IAntiforgery antiforgery = (IAntiforgery)context.HttpContext.RequestServices.GetService(typeof(IAntiforgery));
        AntiforgeryTokenSet tokens = antiforgery.GetAndStoreTokens(context.HttpContext);

        if (!context.HttpContext.Request.Form.ContainsKey(tokens.FormFieldName))
        {
            return;
        }

        var currentFormId = context.HttpContext.Request.Form[tokens.FormFieldName].ToString();
        var lastToken = "" + context.HttpContext.Session.GetString(_uniqFormuId);

        if (lastToken.Equals(currentFormId))
        {
            context.ModelState.AddModelError(string.Empty, "Looks like you accidentally submitted the same form twice.");
            return;
        }
        context.HttpContext.Session.Remove(_uniqFormuId);
        context.HttpContext.Session.SetString(_uniqFormuId, currentFormId);
        await context.HttpContext.Session.CommitAsync();
    }
}
```
然后在需要该验证规则的 Action 上进行标注。
```csharp
[HttpPost]
[PreventDoublePost]
public async Task<IActionResult> Edit(EditViewModel model)
{
    if (!ModelState.IsValid)
    {
        //PreventDoublePost Attribute makes ModelState invalid
    }
    throw new NotImplementedException();
}
```
关于如何生成 Anti Fogery Token，可以看下msdn: https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-2.2#javascript
