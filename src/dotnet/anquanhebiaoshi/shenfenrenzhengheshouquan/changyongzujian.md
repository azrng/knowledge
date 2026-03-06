---
title: 常用组件
lang: zh-CN
date: 2022-04-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: changyongzujian
slug: ghrbi7
docsId: '69241791'
---

## 组件

### IdentityModel
OpenID Connect & OAuth 2.0 client library
IdentityModel是一个基于Claim的Identity库，提供了一组类来标识用户的身份，以及对这些东西的抽象。
> 历史介绍：最初，IdentityModel 是属于 WIF(Windows Identity Foundation) 的一部分，WIF 是微软2004年给 .NET 平台搞的一套身份验证框架（包含Claims，Configuration，Metadata，Policy，Servicesd等等），微软想把这个东西作为 .NET 标准框架的一部分，所以它的命名空间是 System.IdentityModel， 了解这个东西的人不是很多，不过不知道也没关系，反正这玩意也已经被淘汰了。
> 在 .NET Core 中， WIF 这些套件只有 System.IdentityModel.Tokens.Jwt 被保留了下来，其他全被扔掉了，为什么呢？
> 原因是只有 JWT 这部分东西有用，其他的部分更多的是为以前的 Web Servics, WCF 那套分布式东西设计的，那套分布式的东西淘汰了，自然也不必要保留了。

在没有 .NET Core 的时候，我们想实现一套标准的单点登录(SSO)系统就可以利用 System.IdentityModel 因为它已经为我们做了大量工作，并且是标准化的。在 .NET Core 中也需要一些标准的抽象东西那怎么办呢？微软弄了一套新的 IdentityModel 的库，命名空间为 Microsoft.IdentityModel。很多人甚至都找不到它的源码在哪里，我一开始也没找到，最后发现在 [https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet) 这个仓库里面。
来源：[https://www.cnblogs.com/savorboard/p/authentication.html](https://www.cnblogs.com/savorboard/p/authentication.html)

### System.IdentityModel.Tokens.Jwt
包括支持创建、序列化和验证JSON Web token的类型。  

### Microsoft.IdentityModel.Protocols.OpenIdConnect
依赖组件：System.IdentityModel.Tokens.Jwt、Microsoft.IdentityModel.Protocols
 为OpenIdConnect 协议提供支持的类型。

### Microsoft.AspNetCore.Authentication
> 默认包含在.NetCore框架里面

Authentication 在 ASP.NET Core 中，对于 Authentication（认证） 的抽象实现，此中间件用来处理或者提供管道中的 HttpContext 里面的 AuthenticationManager 相关功能抽象实现。HttpContext 中的 User 相关信息同样在此中间件中被初始化。
对于开发人员只需要了解此中间件中的这几个对象即可：

- AuthenticationOptions 对象主要是用来提供认证相关中间件配置项，后面的 OpenIdConnect，OAuth，Cookie 等均是继承于此。
- AuthenticationHandler 对请求流程中（Pre-Request）中相关认证部分提供的一个抽象处理类，同样后面的其他几个中间件均是继承于此。

在 AuthenticationHandler 中, 有几个比较重要的方法:

- HandleAuthenticateAsync ：处理认证流程中的一个核心方法，这个方法返回 AuthenticateResult来标记是否认证成功以及返回认证过后的票据（AuthenticationTicket）。
- HandleUnauthorizedAsync：可以重写此方法用来处理相应401未授权等问题，修改头，或者跳转等。
- HandleSignInAsync：对齐 HttpContext AuthenticationManager 中的 SignInAsync
- HandleSignOutAsync：对齐 HttpContext AuthenticationManager 中的 SignOutAsync
- HandleForbiddenAsync：对齐 HttpContext AuthenticationManager 中的 ForbidAsync，用来处理禁用等结果

以上关于 AuthenticationHandler 我列出来的这些方法都是非常容易理解的，我们在继承Authentication实现我们自己的一个中间件的时候只需要重写上面的一个或者多个方法即可。还有一个 RemoteAuthenticationHandler 它也是继承AuthenticationHandler，主要是针对于远程调用提供出来的一个抽象，什么意思呢？因为很多时候我们的认证是基于OAuth的，也就是说用户的状态信息是存储到Http Header 里面每次进行往来的，而不是cookie等，所以在这个类里面了一个HandleRemoteAuthenticateAsync的函数。

### Microsoft.AspNetCore.Authentication.Cookies
Cookies 认证是 ASP.NET Core Identity 默认使用的身份认证方式，那么这个中间件主要是干什么的呢
我们知道，在 ASP.NET Core 中已经没有了 Forms 认证，取而代之的是一个叫 “个人用户账户” 的一个东西，如下图，你在新建一个ASP.ENT Core Web 应用程序的时候就会发现它，它实际上就是 Identity。那么Forms认证去哪里了呢？对，就是换了个名字叫 Identity。
在此中间件中，主要是针对于Forms认证的一个实现，也就是说它通过Cookie把用户的个人身份信息通过加密的票据存储的Cookie中去，如果看过我之前Identity系列文章的话，那么应该知道用户的个人身份信息就是 ClaimsIdentity 相关的东西。
这个中间件引用了Authentication，CookieAuthenticationHandler 类继承了 AuthenticationHandler 并重写了 HandleAuthenticateAsync,HandleSignInAsync,HandleSignOutAsync，HandleForbiddenAsync,HandleUnauthorizedAsync 等方法，就是上一节中列出来的几个方法。我们主要看一下核心方法 HandleAuthenticateAsync 在 Cookie 中间件怎么实现的：
```csharp
protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
{
    //读取并解密从浏览器获取的Cookie
    var result = await EnsureCookieTicket();
    if (!result.Succeeded)
    {
        return result;
    }
     
    // 使用上一步结果构造 CookieValidatePrincipalContext 对象
    // 这个对象是一个包装类，里面装着 ClaimsPrincipal、AuthenticationProperties
    var context = new CookieValidatePrincipalContext(Context, result.Ticket, Options);
    // 默认是空的实现，可以重写来验证 CookieValidatePrincipalContext 是否有异常
    await Options.Events.ValidatePrincipal(context);

    if (context.Principal == null)
    {
        return AuthenticateResult.Fail("No principal.");
    }
    // 表示是否需要刷新Cookie
    if (context.ShouldRenew)
    {
        RequestRefresh(result.Ticket);
    }

    return AuthenticateResult.Success(new AuthenticationTicket(context.Principal, context.Properties, Options.AuthenticationScheme));
}
```
总结一下就是解密Http请求中的Cookie信息，然后验证Cookie是否合法，然后提取Cookie中的信息返回结果。
还有一个方法就是 HandleSignInAsync ，根据名字可以看出主要是处理登入相关操作的，在这个方法里面主要是根据Claims信息生成加入过后的票据，同时会向票据中写入过期时间，是否持久化等信息。是否持久化的意思就是用户在登陆界面是否勾选了 “记住我” 这个操作。

### Microsoft.AspNetCore.Authentication.OAuth
OAuth 是针对于 OAuth 2.0 标准实现的一个客户端程序，记住是客户端，它不具备发放Token或者 Client_id ,Code 等的功能，它的作用是帮你简化对OAuth2.0服务端程序的调用。它对应 OAuth 2.0 标准中的 “获取Access_Token” 这一步骤，如果对腾讯开放平台QQ授权比较了解的话，就是对应 “使用Authorization_Code获取Access_Token” 这一步骤。

### Microsoft.AspNetCore.Authentication.OpenIdConnect
依赖组件：Microsoft.IdentityModel.Protocols.OpenIdConnect
获取 OpenId 是OAuth 授权中的一个步骤，OpenId 它是具体的一个Token Key，不要把他理解成一种授权方式或者和OAuth不同的另外一种东西，他们是一体的。
代码上就不详细说了，和上面的都差不多。主要说一下它们之间的区别或者叫联系。
OAuth 它主要是针对于授权（Authorization），而OpenID主要是针对于认证（Authentication），他们之间是互补的。
那什么叫授权呢？比如小明是使用我们网站的一个用户，他现在要在另外一个网站使用在我们网站注册的账号，那授权就是代表小明在另外一个网站能够做什么东西？比如能够查看资料，头像，相册等等，授权会给用户发放一个叫 Access_Token 的东西。
而认证关注的这个用户是谁，它是用来证明用户东西。比如小明要访问它的相册，那我们网站就需要小明提供一个叫OpenId的一个东西，我们只认这个OpenId。那小明从哪里得到它的这个OpenId呢，对，就是使用上一步的Access_Token 来换取这 个 OpenId ，以后访问的时候不认 Access_Token ，只认识OpenId这个东西。
一般情况下，OpenId 是需要客户端进行持久化的，那么对应在 ASP.NET Core Identity 中，就是存储在 UsersLogin 表里面的 ProviderKey 字段。

### Microsoft.AspNetCore.Authentication.JwtBearer
JwtBearer 这个中间件是依赖于上一步的 OpenIdConnect 中间件的，看到了吧，其实这几个中间件是环环嵌套的。
可能很多同学听说过 Jwt，但是大多数人都有一个误区，认为JWT是一种认证方式，经常在QQ群里面听过 前面一个同学在问 实际开发中前后端分离的时候安全怎么做的？，下面一个人回答使用JWT。
其实JWT 它不是一种认证方式，也不是一种认证的技术，它是一个规范，一个标准。
Jwt（Json Web Token）的官网是 https://jwt.io，下面是对JWT的一个说明
```csharp
JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
JSON Web Tokens（JWT） 是一个开放的行业标准（ RFC 7519），用于在双方之间传递安全的Claims。
```
JWT 在身份认证中的应用场景
```csharp
在身份认证场景下，一旦用户完成了登陆，在接下来的每个请求中包含JWT，可以用来验证用户身份以及对路由，服务和资源的访问权限进行验证。由于它的开销非常小，可以轻松的在不同域名的系统中传递，所有目前在单点登录（SSO）中比较广泛的使用了该技术。
```
好了，不过多的说了。我们还是接着看一下 JwtBearer 中间件，同样它重写了 HandleAuthenticateAsync 方法。
大致步骤如下：

1. 读取 Http Request Header 中的 Authorization 信息
2. 读取 Authorization 值里面的 Bearer 信息
3. 验证 Bearer 是否合法，会得到一个 ClaimsPrincipal
4. 使用 ClaimsPrincipal 构建一个 Ticket（票据）
5. 调用 Options.Events.TokenValidated(context)，用户可以重写此方法验证Token合法性
6. 返回验证成功

### Microsoft.IdentityModel.Tokens

## 其他知识点
这几个中间件对会有对应的 Options 配置项，在这些配置项中，都会有 AuthenticationScheme, AutomaticAuthenticate, AutomaticChallenge 这几个属性，那这几个东西都是干嘛的呢？

### AuthenticationScheme
在 MVC 程序中一般通过在 Controller 或者 Action 上 打标记（Attribute）的方式进行授权，最典型的就是新建一个项目的时候里面的AccountController。
```csharp
[Authorize]
public class AccountController : Controller
{
}
```
在 Authorize 这个 Attribute 中，有一个属性叫做 ActiveAuthenticationSchemes 的东西，那么这个东西是干什么用的呢？
ActiveAuthenticationSchemes 就是对应着中间件Options里面配置的 AuthenticationScheme ，如果你不指定的话，在使用多个身份验证组件的时候会有问题，会有什么问题呢？

### AutomaticAuthenticate
AutomaticAuthenticate 很简单，是一个bool类型的字段，用来配置是否处理 AuthenticationHandler 是否处理请求。或者你可以理解为中间件是不是自动的处理认证相关的业务。

### AutomaticChallenge
这个**重要**哦！当我们使用多个身份验证中间件的时候，那么就要用到这个配置项了，该配置项是用来设置哪个中间件会是身份验证流程中的默认中间件，当代码运行到 Controller 或者 Action 上的 [Authorize] 这个标记的时候，就会触发身份验证流程。默认情况下MVC的Filter会自动的触发[Authorize]，当然也有一种手动触发Authorize的办法就是使用HttpContext.Authentication.ChallengeAsync()。
实际上，在验证中间件的管道流程中，应该只有一个组件被设定为 AutomaticChallenge = true，但其实大多数的中间件这个参数默认都是 true ，这些中间件包括（Identity, Cookie, OAuth, OpenId, IISIntegration, WebListener）等， 这就导致了在整个验证流程中会触发多个中间件对其进行相应，这种冲突大部分不是用户期望的结果。
不幸的是，目前框架对于这种情况并没有一个健壮的机制，如果开发人员对于这种机制不是很清楚的话，可能会造成很大的困扰。
幸运的是，ASP.NET Core 团队已经意识到了这个问题，他们将在 NET Standard 2.0 中对此重新进行设计，比如手动触发的时候应该怎么处理，有多个的时候怎么处理，以及会添加一些语法糖。
目前情况下，当有多个验证中间件的时候，应该怎么处理呢？比如同时使用 Identity 和 JwtBearer。正确的做法是应该禁用掉除 Identity 以外的其他中间件的 AutomaticChallenge，然后指定调用的AuthenticationScheme。也就是说在Controller或者Action显式指定 [Authorize(ActiveAuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] ，或者是可以指定一个策略来简化授权调用 [Authorize("ApiPolicy")]
```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("ApiPolicy", policy =>
    {
        policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
        policy.RequireAuthenticatedUser();
    });
});
```
而默认不带参数的 [Authorize] 可以指定AuthorizationPolicie：
```csharp
services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder("Identity.Application").RequireAuthenticatedUser().Build();
});
```
注意，手动调用 HttpContext.Authentication.ChallengeAsync() 不受 AuthorizationPolicie 影响。

## 资料
[https://mp.weixin.qq.com/s/XiBZ5JHyWO1cbrq-Fud-BQ](https://mp.weixin.qq.com/s/XiBZ5JHyWO1cbrq-Fud-BQ) | ASP.NET Core 中的那些认证中间件及一些重要知识点
