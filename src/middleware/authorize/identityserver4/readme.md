---
title: 说明
lang: zh-CN
date: 2022-05-03
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: ykbz55
docsId: '32031316'
---

## 概述
`IdentityServer4`是一个用于`ASP.NET Core`的`OpenID Connect`和`OAuth 2.0`框架，可以做的功能有SSO（单点登陆功能）、Api访问控制、身份认证服务等。它实现了OpenID Connect和OAuth 2.0协议。

## 特点
认证服务
适用于所有应用程序（web, native, mobile, services）的集中登录逻辑和工作流程。IdentityServer是OpenID Connect 认证的实现。
单点登录/注销
多个应用程序单点登录和注销操作。
接口访问控制
为各种类型的客户端颁发API的访问令牌，例如服务器到服务器、Web应用程序，SPA、本地应用和移动应用程序。
联合网关
支持Azure Active Directory，Google，Facebook等外部身份提供商。这可以保护您的应用程序免受如何连接到这些外部提供商的详细信息的影响。
专注于定制
最重要的部分 - IdentityServer的许多方面都可以根据您的需求进行定制。由于IdentityServer是一个框架而不是现成的产品或SaaS，因此您可以编写代码以使系统适应您的方案。
成熟的开源
IdentityServer使用的Apache 2开源协议，允许在其上构建商业产品。它也是.NET Foundation的一部分，它提供治理和法律支持。

> Ids4开源版本将于2022年11月停止维护。


## 术语

### 身份服务器
IdentityServer就是身份服务器，它可以

- 保护您的资源
- 提供本地账户存储或者通过外部身份提供程序对用户身份验证
- 提供会话管理和单点登录
- 管理和验证客户端
- 向客户端颁发身份令牌和访问令牌
- 验证令牌

### 用户(资源所有者)
使用已经注册的客户端程序访问资源的用户。

### 客户端(Client)
从IdentityServer请求令牌的软件。，既可以通过身份认证令牌来验证识别用户身份，又可以通过授权令牌来访问服务端的资源。但是客户端首先必须在申请令牌前已经在identityserver服务中注册过。

实际客户端不仅可以是Web应用程序，app或桌面应用程序，SPA，服务器进程等。

### 资源(Resources)
希望使用身份服务器保护的内容，比如用户的身份数据或者API
每个资源都有一个唯一的名称，客户端使用此名称来指定他们要访问的资源。
> 在访问之前，实际identityserver服务端已经配置好了哪个客户端可以访问哪个资源，所以你不必理解为客户端只要指定名称他们就可以随便访问任何一个资源

用户的身份信息实际由一组claim组成，例如姓名或者邮件都会包含在身份信息中。
> 用户身份信息将来通过identityserver校验后都会返回给被调用的客户端

API资源就是客户端想要调用的功能——通常通过 Web API 来对 API 资源建模，但这不是必须的，如下说明：
通常以json或xml的格式返回给客户端，例如webapi，wcf,webservice，可以使其他类型的格式，这个要看具体的使用场景了。

### 身份令牌(Id Token)
OIDC对OAuth2最主要的扩展就是提供了ID Token。来解决第三方客户端标识用户身份认证的问题。
> OIDC的核心在于在OAuth2的授权流程中，一并提供用户的身份认证信息（ID Token）给到第三方客户端，ID Token使用JWT格式来包装，得益于JWT（JSON Web Token）的自包含性，紧凑性以及防篡改机制，使得ID Token可以安全的传递给第三方客户端程序并且容易被验证。此外还提供了UserInfo的接口，用户获取用户的更完整的信息。

ID Token是一个安全令牌，表示的是认证过程的输出，是一个授权服务器提供的包含用户信息，还包含了用户的认证时间和认证方式。身份令牌可以包含额外的身份数据。
> 由一组Cliams构成以及其他辅助的Cliams的JWT格式的数据结构组成。

ID Token的主要构成部分如下（使用OAuth2流程的OIDC）。
> 1. iss = Issuer Identifier：必须。提供认证信息者的唯一标识。一般是一个https的url（不包含querystring和fragment部分）。
> 2. sub = Subject Identifier：必须。iss提供的EU的标识，在iss范围内唯一。它会被RP用来标识唯一的用户。最长为255个ASCII个字符。
> 3. aud = Audience(s)：必须。标识ID Token的受众。必须包含OAuth2的client_id。
> 4. exp = Expiration time：必须。过期时间，超过此时间的ID Token会作废不再被验证通过。
> 5. iat = Issued At Time：必须。JWT的构建的时间。
> 6. auth_time = AuthenticationTime：EU完成认证的时间。如果RP发送AuthN请求的时候携带max_age的参数，则此Claim是必须的。
> 7. nonce：RP发送请求的时候提供的随机字符串，用来减缓重放攻击，也可以来关联ID Token和RP本身的Session信息。
> 8. acr = Authentication Context Class Reference：可选。表示一个认证上下文引用值，可以用来标识认证上下文类。
> 9. amr = Authentication Methods References：可选。表示一组认证方法。
> 10. azp = Authorized party：可选。结合aud使用。只有在被认证的一方和受众（aud）不一致时才使用此值，一般情况下很少使用。

简而言之ID Token就是JWT格式的数据，包含一个人类用户的身份认证的信息.

### 访问令牌(Access Token)
访问令牌允许客户端访问某个 API 资源。客户端请求到访问令牌，然后使用这个令牌来访问 API资源。访问令牌包含了客户端和用户（如果有的话，这取决于业务是否需要，但通常不必要）的相关信息，API通过这些令牌信息来授予客户端的数据访问权限。
> OAuth2提供了Access Token来解决授权第三方客户端访问受保护资源的问题；


### 刷新令牌(Refresh Token)
Access Token 是客户端访问资源服务器的令牌。拥有这个令牌代表着得到用户的授权。然而，这个授权应该是临时的，有一定有效期。这是因为，Access Token  在使用的过程中可能会泄露。给 Access Token  限定一个较短的有效期可以降低因 Access Token  泄露而带来的风险。

然而引入了有效期之后，客户端使用起来就不那么方便了。每当 Access Token  过期，客户端就必须重新向用户索要授权。这样用户可能每隔几天，甚至每天都需要进行授权操作。这是一件非常影响用户体验的事情。希望有一种方法，可以避免这种情况。

于是 Oauth2.0 引入了 Refresh Token 机制。Refresh Token 的作用是用来刷新 Access Token。鉴权服务器提供一个刷新接口，例如：
> http://xxx.xxx.com/refresh?refreshtoken=&client_id=

传入 refresh token 和 client_id，鉴权服务器验证通过后，返回一个新的 access token。为了安全，Oauth2.0 引入了两个措施：

1. OAuth2.0 要求，refresh token 一定是保存在客户端的服务器上的，而绝不能存放在狭义的客户端（例如移动 app、PC端软件） 上。调用 refresh 接口的时候，一定是从服务器到服务器的访问；
1. Oauth2.0 引入了 client_secret 机制。即每一个 client_id 都对应一个 client_secret。这个 client_secret 会在客户端申请 client_id 时，随 client_id 一起分配给客户端。客户端必须把 client_secret 妥善保管在服务器上，决不能泄露。刷新 access token 时，需要验证这个 client_secret。

于是，实际上的刷新接口应该是类似这样的：
> http://xxx.xxx.com/refresh?refreshtoken=&client_id=&client_secret=

以上就是 Refresh Token 机制。Refresh Token  的有效期非常长，会在用户授权时，随 Access Token 一起重定向到回调 url，传递给客户端。

## 官网标志性文档
事件处理以及自定义事件：[https://identityserver4.readthedocs.io/en/latest/topics/events.html](https://identityserver4.readthedocs.io/en/latest/topics/events.html)
扩展授权类型：[https://identityserver4.readthedocs.io/en/latest/topics/extension_grants.html](https://identityserver4.readthedocs.io/en/latest/topics/extension_grants.html)
发现文档配置：[https://identityserver4.readthedocs.io/en/latest/topics/discovery.html](https://identityserver4.readthedocs.io/en/latest/topics/discovery.html)

## 终结点
发现文档终结点：[https://identitymodel.readthedocs.io/en/latest/client/discovery.html](https://identitymodel.readthedocs.io/en/latest/client/discovery.html)
connect/authorize：[https://identityserver4.readthedocs.io/en/latest/endpoints/authorize.html](https://identityserver4.readthedocs.io/en/latest/endpoints/authorize.html)

### 操作
发现文档终结点
```csharp
var client = new HttpClient();

var disco = await client.GetDiscoveryDocumentAsync("https://demo.identityserver.io");
if (disco.IsError) throw new Exception(disco.Error);

//访问文档元素
var tokenEndpoint = disco.TokenEndpoint;
var keys = disco.KeySet.Keys;

// returns string or null
var stringValue = disco.TryGetString("some_string_element");

// return a nullable boolean
var boolValue = disco.TryGetBoolean("some_boolean_element");
```
客户端模式终结点
```csharp
var client = new HttpClient();

var response = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
{
    Address = "https://demo.identityserver.io/connect/token",
    ClientId = "client",
    ClientSecret = "secret"
});
```
获取令牌终结点
```csharp
var client = new HttpClient();

var response = await client.RequestTokenAsync(new TokenRequest
{
    Address = "https://demo.identityserver.io/connect/token",
    GrantType = "custom",

    ClientId = "client",
    ClientSecret = "secret",

    Parameters =
    {
        { "custom_parameter", "custom value"},
        { "scope", "api1" }
    }
});
```
令牌自检终结点
```csharp
var client = new HttpClient();

var response = await client.IntrospectTokenAsync(new TokenIntrospectionRequest
{
    Address = "https://demo.identityserver.io/connect/introspect",
    ClientId = "api1",
    ClientSecret = "secret",

    Token = accessToken
});
```
令牌吊销终结点
```csharp
var client = new HttpClient();

var result = await client.RevokeTokenAsync(new TokenRevocationRequest
{
    Address = "https://demo.identityserver.io/connect/revocation",
    ClientId = "client",
    ClientSecret = "secret",

    Token = accessToken
});
```
用户信息终结点
```csharp
var client = new HttpClient();

var response = await client.GetUserInfoAsync(new UserInfoRequest
{
    Address = disco.UserInfoEndpoint,
    Token = token
});
```
动态客户端注册
```csharp
var client = new HttpClient();

var response = await client.RegisterClientAsync(new DynamicClientRegistrationRequest
{
    Address = Endpoint,
    Document = new DynamicClientRegistrationDocument
    {
        RedirectUris = { redirectUri },
        ApplicationType = "native"
    }
});
```
设备授权终结点
```csharp
var client = new HttpClient();

var response = await client.RequestDeviceAuthorizationAsync(new DeviceAuthorizationRequest
{
    Address = "https://demo.identityserver.io/connect/device_authorize",
    ClientId = "device"
});
```

## 演示服务
演示示例：[https://demo.identityserver.io/](https://demo.identityserver.io/) (貌似访问不了了)
可以找到有关如何配置客户端以及如何调用API的说明。

## 仓库源码

### IdentityServer4主仓库
包含核心 IdentityServer 对象模型、服务和中间件，以及 EntityFramework 和 ASP.NET Identity 集成。
地址：[https://github.com/identityserver/IdentityServer4](https://github.com/identityserver/IdentityServer4)
nugets:

- [IdentityServer4](https://www.nuget.org/packages/IdentityServer4/)
- [IdentityServer4.EntityFramework](https://www.nuget.org/packages/IdentityServer4.EntityFramework)
- [IdentityServer4.AspNetIdentity](https://www.nuget.org/packages/IdentityServer4.AspNetIdentity)

###  Quickstart UI
含一个简单的初学者 UI，包括登录、注销和同意页面。
仓库地址：[https://github.com/IdentityServer/IdentityServer4.Quickstart.UI](https://github.com/IdentityServer/IdentityServer4.Quickstart.UI)

### 访问令牌验证处理程序
ASP.NET 核心身份验证处理程序，用于验证 API 中的令牌。该处理程序允许在同一 API 中同时支持 JWT 和引用令牌。
仓库地址：[https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation](https://github.com/IdentityServer/IdentityServer4.AccessTokenValidation)

### 模板
包含CLI的模板
仓库地址：[https://github.com/IdentityServer/IdentityServer4.Templates](https://github.com/IdentityServer/IdentityServer4.Templates)

## 资料
> 官方文档：[https://identityserver4.readthedocs.io/en/latest/](https://identityserver4.readthedocs.io/en/latest/)
> IdentityServer4中文文档: http://www.identityserver.com.cn/Home/Detail/Zhengtizongshu
> 老张的哲学：[https://www.cnblogs.com/laozhang-is-phi/p/10483922.html](https://www.cnblogs.com/laozhang-is-phi/p/10483922.html)
> 晓晨系列博客:https://www.cnblogs.com/stulzq/category/1060023.html
> [https://mp.weixin.qq.com/s/51DoyYGMs5awANq_seeRaA](https://mp.weixin.qq.com/s/51DoyYGMs5awANq_seeRaA) | IdentityServer4系列 | 常见术语说明
> 自定义登录页：[https://mp.weixin.qq.com/s/x0h9LT_SDamPSP8cNty-kg](https://mp.weixin.qq.com/s/x0h9LT_SDamPSP8cNty-kg)
> 受保护的API：[https://identityserver4.readthedocs.io/en/latest/topics/apis.html](https://identityserver4.readthedocs.io/en/latest/topics/apis.html)

