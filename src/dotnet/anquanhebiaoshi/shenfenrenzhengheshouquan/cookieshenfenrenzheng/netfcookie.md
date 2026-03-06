---
title: NetFCookie
lang: zh-CN
date: 2022-01-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: netfcookie
slug: urtbga
docsId: '64697528'
---

## 目的
通过cookie实现认证功能
> 本文示例环境：.Net Framework 4.6


## 操作
流程： 一个检测用户是否已经登录的过滤器，如果用户已经登录，那么就跳转去登录，登录时候把用户的信息存储到HttpCookie中

### 登录流程
登录方法
```csharp
[HttpPost]
public ActionResult Login(UserInfo info)
{
    if (info.Account == "admin" && info.PassWord == "123456")
    {
        HttpCookie username = new HttpCookie("uname", "admin");
        HttpCookie pwd = new HttpCookie("pwd", "123456");

        System.Web.HttpContext.Current.Response.SetCookie(username);
        System.Web.HttpContext.Current.Response.SetCookie(pwd);
        var a = System.Web.HttpContext.Current.Response.Cookies;
        return Redirect("Index");
    }
    return View();
}
```
退出登录方法
```csharp
[CheckLogin]
public ActionResult LogOut()
{
    FormsAuthentication.SignOut();
    return Redirect("Login");
}
```
需要认证的方法
```csharp
[CheckLogin]
public ActionResult Index()
{
    return View();
}
```
CheckLogin过滤器代码
```csharp
public class CheckLogin : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        HttpCookieCollection cookieCollection = System.Web.HttpContext.Current.Request.Cookies;
        if (cookieCollection["uname"] == null || cookieCollection["pwd"] == null)
        {
            filterContext.Result = new RedirectResult("/Home/Login");//如果信息为空 那么就跳转到登录界面进行登录操作
        }
        else
        {
            if (cookieCollection["uname"].Value != "admin" && cookieCollection["pwd"].Value != "123456")
            {
                filterContext.Result = new RedirectResult("/Home/Login");
            }
        }
    }
}
```
RegisterGlobalFilters中注册过滤器
```csharp
public static void RegisterGlobalFilters(GlobalFilterCollection filters)
{
    filters.Add(new HandleErrorAttribute());
    filters.Add(new CheckLogin());
}
```

## 总结
通过过滤器拦截实现认证功能。
