---
title: 简化模式
lang: zh-CN
date: 2022-05-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jianhuamoshi
slug: qy4ga1
docsId: '75705707'
---

## 5. 简化模式
> 有些 Web 应用是纯前端应用，没有后端，必须将令牌储存在前端。RFC 6749 就规定了这种方式，允许直接向前端颁发令牌。这种方式没有授权码这个中间步骤，所以称为（授权码）"简化"（implicit）。

「简化模式」（implicit grant type）「不通过第三方应用程序的服务器」，直接在浏览器中向认证服务器申请令牌，跳过了"授权码"这个步骤(授权码模式后续会说明)。所有步骤在浏览器中完成，令牌对访问者是可见的，且客户端不需要认证。
> 这种方式把令牌直接传给前端，是很不安全的。因此，只能用于一些安全要求不高的场景，并且令牌的有效期必须非常短，通常就是会话期间（session）有效，浏览器关掉，令牌就失效了。


### 5.1 适用场景
这种模式的使用场景是基于浏览器的应用
> 这种模式基于安全性考虑，建议把token时效设置短一些, 不支持refresh token


### 5.2 密码授权流程
```csharp
     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier     +---------------+
     |         -+----(A)-- & Redirection URI --->|               |
     |  User-   |                                | Authorization |
     |  Agent  -|----(B)-- User authenticates -->|     Server    |
     |          |                                |               |
     |          |<---(C)--- Redirection URI ----<|               |
     |          |          with Access Token     +---------------+
     |          |            in Fragment
     |          |                                +---------------+
     |          |----(D)--- Redirection URI ---->|   Web-Hosted  |
     |          |          without Fragment      |     Client    |
     |          |                                |    Resource   |
     |     (F)  |<---(E)------- Script ---------<|               |
     |          |                                +---------------+
     +-|--------+
       |    |
      (A)  (G) Access Token
       |    |
       ^    v
     +---------+
     |         |
     |  Client |
     |         |
     +---------+

```
「简化授权流程描述」
（A）客户端携带客户端标识以及重定向URI到授权服务器；
（B）用户确认是否要授权给客户端；
（C）授权服务器得到许可后，跳转到指定的重定向地址，并将令牌也包含在了里面；
（D）客户端不携带上次获取到的包含令牌的片段，去请求资源服务器；
（E）资源服务器会向浏览器返回一个脚本；
（F）浏览器会根据上一步返回的脚本，去提取在C步骤中获取到的令牌；
（G）浏览器将令牌推送给客户端。

#### 5.2.1 过程详解
访问令牌请求

| 参数 | 是否必须 | 含义 |
| --- | --- | --- |
| response_type | 必需 | 表示授权类型，此处的值固定为"token" |
| client_id | 必需 | 客户端ID |
| redirect_uri | 可选 | 表示重定向的URI |
| scope | 可选 | 表示授权范围。 |
| state | 可选 | 表示随机字符串 |

「（1）资源服务器生成授权URL并将用户重定向到授权服务器」
  (用户的操作：用户访问https://resourcesServer/index.html跳转到登录地址，选择授权服务器方式登录)
在授权开始之前，它首先生成state参数(随机字符串)。client端将需要存储这个（cookie，会话或其他方式），以便在下一步中使用。
第一步，A 网站提供一个链接，要求用户跳转到 B 网站，授权用户数据给 A 网站使用。
```csharp
生成的授权URL如上所述（如上），请求这个地址后重定向访问授权服务器，其中 response_type参数为token,表示直接返回令牌。
```
「（2）验证授权服务器登陆状态」
(用户的操作：如果未登陆用账号 User，密码12345登陆https://oauth2Server/login，如果已登陆授权服务器不需要此步骤)
如果未登陆账号，自动跳转到授权服务器登陆地址，登陆授权服务器以后用户被重定向client端
```csharp
https://resourcesServer/implicit.html  
```
如已提前登陆授权服务器或授权服务器登陆会话还存在自动重定向到client端
```csharp
https://resourcesServer/implicit.html
```
「（3）验证状态参数」
(用户的操作：无需操作)
用户被重定向回客户机，URL中现在有一个片段包含访问令牌以及一些其他信息。
用户跳转到 B 网站，登录后同意给予 A 网站授权。这时，B 网站就会跳回redirect_uri参数指定的跳转网址，并且把令牌作为 URL 参数，传给 A 网站。
```csharp
https://resourcesServer/authorization-code.html

\#access_token=&token_type=Bearer&expires_in=3600&scope=photo&state=随机字符串
```
其中，token参数就是令牌，A网站因此直接在前端拿到令牌。
> 注意，令牌的位置是 URL 锚点（fragment），而不是查询字符串（querystring），这是因为 OAuth 2.0 允许跳转网址是 HTTP 协议，因此存在"中间人攻击"的风险，而浏览器跳转时，锚点不会发到服务器，就减少了泄漏令牌的风险。

用户使用这个令牌访问资源服务器，当令牌失效时使用刷新令牌去换取新的令牌

### 5.3 实践

#### 5.3.1 搭建认证授权服务
使用我们之前创建的AuthCenterInMemory项目。

##### 5.3.1.1 配置内容
修改IdentityConfig文件内容
```csharp
public static class IdentityConfig
{
    /// <summary>
    /// 资源
    /// </summary>
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };

    /*
     在3.1.x 到 4.x 的变更中，ApiResource 的 Scope 正式独立出来为 ApiScope 对象，区别ApiResource 和 Scope的关系,
     Scope 是属于ApiResource 的一个属性，可以包含多个Scope。
     */

    public static IEnumerable<ApiResource> ApiResources =>
        new ApiResource[]
        {
            new ApiResource("API01", "api1DisplayName")
            {
                Scopes = {"client_scope1"},
                ApiSecrets = {new Secret("secrets".Sha256())}, //api密钥
                UserClaims = {JwtClaimTypes.Name, JwtClaimTypes.NickName, JwtClaimTypes.Role}
            }
        };

    /// <summary>
    /// Authorization Server保护了哪些 API Scope（作用域）
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<ApiScope> GetApiScopes()
    {
        return new[] {new ApiScope("client_scope1", "client_scope1 DisplayName")};
    }

    /// <summary>
    /// 哪些客户端 Client（应用） 可以使用这个 Authorization Server
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<Client> GetClients()
    {
        return new[]
        {
            new Client()
            {
                //客户端凭据模式
                ClientId = "ConsoleClient01", //客户端的标识，要是唯一的
                ClientSecrets = new[] {new Secret("secrets".Sha256())}, //客户端密码，进行了加密
                AllowedGrantTypes =
                    GrantTypes
                        .ClientCredentials, //授权方式，这里采用的是客户端认证模式，只要ClientId，以及ClientSecrets正确即可访问对应的AllowedScopes里面的api资源
                AllowedScopes = new[] {"client_scope1"}, //定义这个客户端可以访问的scopes
            },
            new Client
            {
                //资源密码模式

                ClientId = "ResourceOwnerPassword01",
                AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,
                ClientSecrets =
                {
                    new Secret("secrets".Sha256())
                },
                AllowedScopes =
                {
                    "client_scope1",
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Email,
                    IdentityServerConstants.StandardScopes.Phone,
                    IdentityServerConstants.StandardScopes.Profile,
                }
            },
            new Client
            {
                /*
                 创建一个mvc客户端，然后启动该身份服务器，然后启动客户端，让客户端去访问需要权限的接口，然后会直接转到身份服务器登录，
                 登录成功会重新跳转回去
                 */
                ClientId = "ImplicitClientMvc",

                AllowedGrantTypes = GrantTypes.Implicit, //GrantTypes.Code,

                //登录后重定向到哪里
                RedirectUris = {"http://localhost:5014/signin-oidc"},

                //FrontChannelLogoutUri="",
                //注销后重定向到哪里
                PostLogoutRedirectUris = {"http://localhost:5014/signout-callback-oidc"},

                AllowOfflineAccess = true, //刷新令牌
                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "client_scope1",
                },
                //是否需要统一授权（默认是false）
                RequireConsent = true
            }
        };
    }

    /// <summary>
    /// 哪些User可以被这个AuthorizationServer识别并授权
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<TestUser> GetTestUsers()
    {
        return new[]
        {
            new TestUser
            {
                SubjectId = "1",
                Username = "alice",
                Password = "alice",

                Claims = new[]
                {
                    new Claim("name", "Alice"),
                    new Claim("website", "https://alice.com"),
                    new Claim(ClaimTypes.Role, "admin"),
                    new Claim(ClaimTypes.NameIdentifier, "123456789")
                }
            },
            new TestUser
            {
                SubjectId = "2",
                Username = "admin",
                Password = "123456",

                Claims = new[]
                {
                    new Claim(JwtClaimTypes.Name, "Bob"),
                    new Claim(JwtClaimTypes.NickName, "Bob nickname"),
                    new Claim(JwtClaimTypes.Email, "itzhangyunpeng@163.com"),
                    new Claim(JwtClaimTypes.WebSite, "状态"),
                    new Claim(JwtClaimTypes.PhoneNumber, "18838940824"),
                    new Claim(JwtClaimTypes.Role, "ceshi"), //添加角色
                    new Claim("sex", "男"),
                    new Claim("today", "zhouyi"),
                    new Claim("ceshi1", "ceshi11")
                }
            }
        };
    }
}
```
RedirectUris : 登录成功回调处理的客户端地址，处理回调返回的数据，可以有多个。
PostLogoutRedirectUris ：跳转登出到的客户端的地址。
这两个都是配置的客户端的地址，且是identityserver4组件里面封装好的地址，作用分别是登录，注销的回调

##### 5.3.1.2 注册服务
```csharp
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes())
    .AddInMemoryApiResources(IdentityConfig.ApiResources);
```

##### 5.3.1.3 配置管道
保持之前的不变。

#### 5.3.2 搭建MVC客户端项目

##### 5.3.2.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包
```csharp
<PackageReference Include="IdentityServer4.AccessTokenValidation" Version="3.0.1" />
```

##### 5.3.2.2 注册服务
```csharp
services.AddAuthentication(options =>
{
    // 客户端应用设置使用"Cookies"进行认证
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // identityserver4设置使用"oidc"进行认证  用户登录时候使用openid connect协议
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.Authority = "http://localhost:5014";//信任的认证地址
    options.RequireHttpsMetadata = false;//如果不使用https，那么就需要配置这个
    options.ClientId = "ImplicitClientMvc";
    options.SaveTokens = true;//用于在cookie中保留来自identityserver的令牌
    options.GetClaimsFromUserInfoEndpoint = true;
});

// 配置cookie策略
services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = SameSiteMode.Lax;
});
```

1. AddAuthentication注入添加认证授权，当需要用户登录时，使用 cookie 来本地登录用户（通过“Cookies”作为DefaultScheme），并将 DefaultChallengeScheme 设置为“oidc”，
2. 使用 AddCookie 添加可以处理 cookie 的处理程序。
3. 因为「简化模式」的实现是就是 OpenID Connect，所以在AddOpenIdConnect用于配置执行 OpenID Connect 协议的处理程序。Authority表明之前搭建的 IdentityServer 授权服务地址。然后我们通过ClientId。识别这个客户端。SaveTokens用于在 cookie 中保留来自IdentityServer 的令牌。

##### 5.3.2.3 配置管道
然后要确保认证服务执行对每个请求的验证，加入UseAuthentication和UseAuthorization到Configure中,在startup.cs中Configure方法添加如下代码：
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Home/Error");
    }
    app.UseStaticFiles();
    app.UseCookiePolicy();
    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapDefaultControllerRoute();
        //.RequireAuthorization();//禁用整个应用程序的匿名访问
    });
}
```
UseAuthentication将身份验证中间件添加到管道中；
UseAuthorization 将启动授权中间件添加到管道中，以便在每次调用主机时执行身份验证授权功能。

##### 5.3.2.4 添加授权
在HomeController控制器并添加[Authorize]特性到其中一个方法。在进行请求的时候，需进行认证授权通过后，才能进行访问。
```csharp
[Authorize]
public IActionResult Index()
{
    return View();
}
```
还要修改主视图以显示用户的Claim以及cookie属性。
```csharp
@{
    ViewData["Title"] = "Home Page";
}

@using Microsoft.AspNetCore.Authentication

<h2>Claims</h2>

<dl>
    @foreach (var claim in User.Claims)
    {
        <dt>@claim.Type</dt>
        <dd>@claim.Value</dd>
    }
</dl>

<h2>Properties</h2>

<dl>
    @foreach (var prop in (await Context.AuthenticateAsync()).Properties.Items)
    {
        <dt>@prop.Key</dt>
        <dd>@prop.Value</dd>
    }
</dl>

<a href="/Home/LogOut">退出登录</a>
```
访问 Index页面，跳转到认证服务地址，进行账号密码登录，退出登录用于用户的注销操作。
展示效果
```csharp
nbf
1651382278
exp
1651382578
iss
http://localhost:5014
aud
ImplicitClientMvc
nonce
637869790623712218.Y2Y3ZjAyNGUtNzgzZi00MDZhLTlmZjktNTI5ZWRhNGNjN2E0YjYyOWIzZGItNWU1MC00N2YwLWI1N2YtNGNhYzg0YjBhNDZl
iat
1651382278
s_hash
8gb5o3g-el8n5z2rvOV7GA
sid
8D4DBD846DAF0912260E424631D0907D
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
2
auth_time
1651382274
http://schemas.microsoft.com/identity/claims/identityprovider
local
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
Bob
nickname
Bob nickname
http://schemas.xmlsoap.org/ws/2005/05/identity/claims/webpage
状态
http://schemas.microsoft.com/claims/authnmethodsreferences
pwd
```

#### 5.3.3  SameSite策略
在Chrome浏览器中，进行认证授权的时候，用户登录之后，无法跳转到原网页，还是停留在登录页中，可以看控制台就发现上图的效果。
最后查找资料发现，是Google将于2020年2月份发布Chrome 80版本。本次发布将推进Google的“渐进改良Cookie”策略，打造一个更为安全和保障用户隐私的网络环境。所以本次更新可能导致浏览器无法向服务端发送Cookie。如果你有多个不同域名的应用，部分用户很有可能出现会话时常被打断的情况，还有部分用户可能无法正常登出系统。
所以我们需要解决这个问题：
方法一：将域名升级为 HTTPS
方法二：使用代码修改 SameSite 设置
```csharp
//配置cookie策略 必须添加
builder.Services.Configure<CookiePolicyOptions>(options =>
{
    options.MinimumSameSitePolicy = SameSiteMode.Lax;
});

app.UseCookiePolicy(); //必须添加
```

## 资料
[https://mp.weixin.qq.com/s?__biz=MzU2NTg3NjQ0MA==&mid=2247485525&idx=1&sn=12eced83bea0dba29f09d0c5df00e1b6&chksm=fcb44be2cbc3c2f46db29dc60ba1dbf4cfa273aafa071d67b1f9dabbfd07f83a16ce8391ee45&scene=178&cur_album_id=1547438833309417472#rd](https://mp.weixin.qq.com/s?__biz=MzU2NTg3NjQ0MA==&mid=2247485525&idx=1&sn=12eced83bea0dba29f09d0c5df00e1b6&chksm=fcb44be2cbc3c2f46db29dc60ba1dbf4cfa273aafa071d67b1f9dabbfd07f83a16ce8391ee45&scene=178&cur_album_id=1547438833309417472#rd) | IdentityServer4系列 | 简化模式
