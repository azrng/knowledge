---
title: 概述
lang: zh-CN
date: 2023-02-07
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: yz8e6a
docsId: '30599222'
---

## 介绍
身份验证：用户提供凭据，然后将其和存储在数据库或者其他地方的凭据进行对比。如果凭据匹配，则用户身份验证成功，**是一种识别用户是谁的操作**。
授权：指判断是否允许用户执行操作的过程，是**确定用户是否有权限访问资源的过程**。

## 认证
如果访问要求身份验证的终结点，但是并没有添加身份验证，那么就会提示错误
```csharp
No authenticationScheme was specified, and there was no DefaultChallengeScheme found.
```

### 匿名用户访问
当未经身份验证的用户请求要求身份验证的终结点时候，授权就会发起身份验证。会有如下场景

- cookie方案：将用户重定向到登录页面
- JWT 方案：返回具有 www-authenticate: bearer 标头的 401 结果的

### 访问无权限访问资源
当已经过身份验证的用户尝试访问其无权访问的资源时，授权会调用身份验证方案的禁止操作。

- cookie方案：将用户重定向到标识访问遭到禁止的页面
- jwt方案：返回403结果
- 自定义身份验证方案：重定向到用户可请求资源访问权限的页面

用户通过禁止操作可以得到他们已经通过了身份验证，但是无权访问所请求的资源。

### 认证代码
```csharp
//全局禁止匿名访问
services.AddControllers((options) =>
{
    options.Filters.Add(new AuthorizeFilter());//添加全局的Authorize
});

// 支持对控制器、方法标注该特性进行授权
[Authorize]

// 允许匿名访问，可应用于控制器和方法
[AllowAnonymous]
```

### 认证接口
该接口IAuthenticationHandler在命名空间 Microsoft.AspNetCore.Authentication 下，包含3个基本操作
```csharp
public interface IAuthenticationHandler
{
    //提供当前请求的上下文信息
    Task InitializeAsync(AuthenticationScheme scheme, HttpContext context);
    Task<AuthenticateResult> AuthenticateAsync();
    Task ChallengeAsync(AuthenticationProperties? properties);
    Task ForbidAsync(AuthenticationProperties? properties);
}
```

#### Authenticate 验证
验证操作负责基于当前请求的上下文，使用来自请求中的信息，例如请求头、Cookie 等等来构造用户标识。构建的结果是一个 AuthenticateResult 对象，它指示了验证是否成功，如果成功的话，用户标识将可以在验证票据中找到。
常见的验证包括：

- 基于 Cookie 的验证，从请求的 Cookie 中验证用户
- 基于 JWT Bearer 的验证，从请求头中提取 JWT 令牌进行验证

#### Challenge 质询
在授权管理阶段，如果用户没有得到验证，但所期望访问的资源要求必须得到验证的时候，授权服务会发出质询。例如，当匿名用户访问受限资源的时候，或者当用户点击登录链接的时候。授权服务会通过质询来相应用户。
例如

- 基于 Cookie 的验证会将用户重定向到登录页面
- 基于 JWT 的验证会返回一个带有 www-authenticate: bearer 响应头的 401 响应来提醒客户端需要提供访问凭据

质询操作应该让用户知道应该使用何种验证机制来访问请求的资源。

#### Forbid 拒绝
在授权管理阶段，如果用户已经通过了验证，但是对于其访问的资源并没有得到许可，此时会使用拒绝操作。
例如：

- Cookie 验证模式下，已经登录但是没有访问权限的用户，被重定向到一个提示无权访问的页面
- JWT 验证模式下，返回 403
- 在自定义验证模式下，将没有权限的用户重定向到申请资源的页面

拒绝访问处理应该让用户知道：

- 它已经通过了验证
- 但是没有权限访问请求的资源

## 授权

### 角色授权
角色授权是指可以对控制器或者控制器内的操作方法应用基于角色的授权检查。
```csharp
[ApiController]
[Route("[controller]/[action]")]
[Authorize(Roles = "admin")]// 对一个方法设置指定角色才可以访问
public class WeatherForecastController : ControllerBase
{
}
```
授权特定的多个示例
如果遇到多个角色的授权形式，可以用逗号隔开来指定多个角色。
```csharp
[ApiController]
[Route("[controller]/[action]")]
[Authorize(Roles = "admin,user")]
public class WeatherForecastController : ControllerBase
{
}

//或者

[ApiController]
[Route("[controller]/[action]")]
[Authorize(Roles = "admin")]
[Authorize(Roles = "user")]
public class WeatherForecastController : ControllerBase
{
}
```
多个角色或运算：多个角色只要有其中一个就可以访问
多个角色且运算：同时得有多个角色才能访问接口
总结：该授权常被称为基于角色的权限访问控制(RBAC)或基于角色的授权。
```csharp
services.AddAuthorization(options =>
{
	//必须角色为admin 和user才可以访问
	options.AddPolicy("adminanduser", t => { t.RequireRole("admin").RequireRole("user").Build(); });
}
```
> RequireRole()方法用于管理角色授权的需求


### 声明授权
声明(Cliaim)通常基于策略，通过基于声明的授权声明一个策略，然后与Authorize特定中的policy参数结合。
```csharp
[Authorize(Policy ="deleteRole")]

// 设置拥有该策略的用户才可以访问
[Authorize(Policy = "Over18")]
```
然后在configureService方法中添加以下配置
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("deleteRole", policy => policy.RequireClaim("deleteRole"));
});
```
> RequireClaim()方法用于管理声明授权的需求。

在执行过程中，会判断当前用户是否拥有声明deleteRole来确定是否给予授权。

> 总结：基于声明的授权被称为基于上下文的访问控制协议(CBAC)。


自定义策略：使用func委托方法来创建自定义策略。
```csharp

builder.Services.AddAuthorization(options =>
{
   options.AddPolicy("edit", policy =>
    policy.RequireAssertion(context => context.User.IsInRole("admin") &&
    context.User.HasClaim(cliaim => cliaim.Type == "edit role" && cliaim.Value == "true") ||
    context.User.IsInRole("super admin")
    ));
});
```
> RequireAssertion()方法可用于自定义授权的需求。

RequireAssertion()提供了AuthorizationPolicyBuilder实例，可使用RequireAssertion()方法代替RequireClaim()或RequireRole()。RequireAssertion()方法将Func<AuthorizationHandlerContext，bool>作为参数，Fun()方法将AuthorizationHandlerContext作为输入参数，最后返回一个bool值。而通过AuthorizationHandlerContext可以访问用户、角色和声明的方法。**要创建的需求之间具有or关系策略，就要使用RequireAssertion方法。**

### 角色与策略结合
创建一个策略，并在该策略中包含一个或者多个角色。
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("deleteRole", policy => policy.RequireClaim("deleteRole"));
    options.AddPolicy("AdminAndUser", t => { t.RequireRole("admin", "user").Build(); });
});

```
如果要在策略中包含多个角色，只需要用逗号将其分开。

## 如何身份验证
通过在ConfigureServices中注册身份验证服务，方式是在调用 `services.AddAuthentication` 后调用方案特定的扩展方法（例如 `AddJwtBearer` 或 `AddCookie`）
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => Configuration.Bind("JwtSettings", options))
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options => Configuration.Bind("CookieSettings", options));
```
> `JwtBearerDefaults.AuthenticationScheme` 是方案的名称，未请求特定方案时会默认使用此名称。

如果使用了多个方案，授权策略可指定对用户进行身份验证时候依据一个或者多个身份验证方案。例如：
```csharp
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public class MixedController : Controller
```
或者在configureService中使用具有策略的授权方案
```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("Over18", policy =>
    {
        policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
        policy.RequireAuthenticatedUser();
        policy.Requirements.Add(new MinimumAgeRequirement());
    });
});
```
> 使用多种身份验证方案请参考：[https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/limitingidentitybyscheme?view=aspnetcore-5.0](https://docs.microsoft.com/zh-cn/aspnet/core/security/authorization/limitingidentitybyscheme?view=aspnetcore-5.0)

然后在控制器或者方法上标注特性使用角色或者策略
```csharp
[Authorize(Policy = "Over18")]
public class RegistrationController : Controller

[Authorize(Roles = "admin")]
```
切记要在configure中增加
```csharp
app.UseAuthentication(); //认证
app.UseAuthorization(); //授权
```

## 资料
[https://mp.weixin.qq.com/s/E6M5egwxS6l0MKTsu1gnzQ](https://mp.weixin.qq.com/s/E6M5egwxS6l0MKTsu1gnzQ) | ASP.NET Core认证原理和实现
基于用户角色的访问权限控制：[https://mp.weixin.qq.com/s/Rq8cuQoQ6oZF9dxaZ5fKjA](https://mp.weixin.qq.com/s/Rq8cuQoQ6oZF9dxaZ5fKjA)
理解ASP.NET Core - 授权(Authorization)：[https://www.cnblogs.com/xiaoxiaotank/p/16157344.html](https://www.cnblogs.com/xiaoxiaotank/p/16157344.html)
