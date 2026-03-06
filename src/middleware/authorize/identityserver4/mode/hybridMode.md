---
title: 混合模式
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: hungemoshi
slug: gb0pp3
docsId: '75705741'
---

## 前言
在上一篇关于授权码模式中， 已经介绍了关于授权码的基本内容，认识到这是一个拥有更为安全的机制,但这个仍然存在局限，虽然在文中我们说到通过后端的方式去获取token,这种由web服务器和授权服务器直接通信，不需要经过用户的浏览器或者其他的地方，但是在这种模式中，授权码仍然是通过前端通道进行传递的，而且在访问资源的中，也会将访问令牌暴露给外界，就仍存在安全隐患。

在几篇关于授权模式篇章中，其中我们也使用了关于OpenID Connect的简化流程，在简化流程中，所有令牌（身份令牌、访问令牌）都通过浏览器传输，这对于**身份令牌（IdentityToken）**「来说是没有问题的，但是如果是」**访问令牌（AccessToken**）直接通过浏览器传输，就增加了一定的安全问题。因为访问令牌比身份令牌更敏感，在非必须的情况下，我们不希望将它们暴露给外界。
所以我们就会考虑增加安全性，在OpenID Connect 包含一个名为“Hybrid（混合）”的流程，它为我们提供了两全其美的优势，身份令牌通过浏览器传输，因此客户端可以在进行任何更多工作之前对其进行验证。如果验证成功，客户端会通过令牌服务的以获取访问令牌。
> 授权码模式在访问资源服务的时候，请求的头里面会带有访问令牌。


## 7. 混合模式
code和hybrid一样都有8个步骤，大部分步骤也是相同的。最主要的区别在于第5步。
「在授权码模式中，成功响应身份验证」：
```csharp
 HTTP/1.1 302 Found
  Location: https://client.example.org/cb?
    code=SplxlOBeZQQYbYS6WxSbIA
    &state=af0ifjsldkj
```
「在混合模式中，成功响应身份验证：」
```csharp
HTTP/1.1 302 Found
  Location: https://client.example.org/cb#
    code=SplxlOBeZQQYbYS6WxSbIA
    &id_token=eyJ0 ... NiJ9.eyJ1c ... I6IjIifX0.DeWt4Qu ... ZXso
    &state=af0ifjsldkj
```
其中多了一个id_token

在使用这些模式的时候，成功的身份验证响应，存在指定的差异。这些授权端点的结果以不同的的依据返回。其中code是一定会返回的，access_token和id_token的返回依据 response_type 参数决定。
混合模式根据response_type的不同，authorization endpoint返回可以分为三种情况。
1. response_type = code + id_token ，即包含Access Token和ID Token
![](/common/1651398849140-1507e165-f8a2-4ccb-aea2-6d788f24cf0a.png)
2. response_type = code + token ，即包含Authorization Code和Access Token
![](/common/1651398875751-b8630de8-33d8-49c0-9330-160f79659577.png)
3. response_type = code + id_token + token，即包含Authorization Code、identity Token和Access Token
![](/common/1651398898779-ec157d06-b32b-49fd-be09-c672ab45d1c8.png)

### 7.1 实践
在示例实践中，我们将创建一个授权访问服务，定义一个HTML客户端，HTML客户端通过「IdentityServer」上请求访问令牌，并使用它来访问API。

#### 7.1.1 搭建认证授权服务
使用我们之前创建的AuthCenterInMemory项目。

##### 7.1.1.1 配置内容
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
                 简化模式：创建一个mvc客户端，然后启动该身份服务器，然后启动客户端，让客户端去访问需要权限的接口，然后会直接转到身份服务器登录，
                 登录成功会重新跳转回去
                 */
                ClientId = "ImplicitClientMvc",

                AllowedGrantTypes = GrantTypes.Implicit,

                //登录后重定向到哪里，客户端地址
                RedirectUris = {"http://localhost:5021/signin-oidc"},

                //FrontChannelLogoutUri="",
                //注销后重定向到哪里，客户端地址
                PostLogoutRedirectUris = {"http://localhost:5021/signout-callback-oidc"},

                AllowOfflineAccess = true, //刷新令牌
                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "client_scope1",
                },
                //允许将token通过浏览器传递
                AllowAccessTokensViaBrowser = true,
                //是否需要统一授权（默认是false）
                RequireConsent = true
            },
            new Client
            {
                //授权码模式
                ClientId = "AuthorizationCodeWebClient",
                ClientName = "授权码 Web Client 名称",
                //授权模式
                AllowedGrantTypes = GrantTypes.Code,
                AccessTokenLifetime = 3600, //单位是秒

                RequirePkce = true, //指定基于代码请求的授权令牌是否需要证明密钥
                RequireClientSecret = false,

                //登录后重定向的位置
                RedirectUris = {"http://localhost:5024/callback.html"},
                //注销后重定向的位置
                PostLogoutRedirectUris = {"http://localhost:5024/index.html"},
                AllowedCorsOrigins = {"http://localhost:5024"}, //允许跨域请求的地址

                //客户端有权访问的范围
                AllowedScopes = new[]
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "client_scope1",
                },
                ////允许token通过浏览器传递
                //AllowAccessTokensViaBrowser = true,
                ////是否显示同意界面
                //RequireConsent = true,
                ////是否记住同意选项
                //AllowRememberConsent = false,
                ////支持刷新令牌
                //AllowOfflineAccess = true,
            },
            new Client
            {
                //混合模式
                ClientId = "HybridMvcClient",
                ClientSecrets = {new Secret("secrets".Sha256())},

                AllowedGrantTypes = GrantTypes.Hybrid,
                RequirePkce = false,
                //登录后重定向到哪里
                RedirectUris = {"http://localhost:5025/signin-oidc"},

                //FrontChannelLogoutUri="",
                //注销后重定向到哪里
                PostLogoutRedirectUris = {"http://localhost:5025/signout-callback-oidc"},

                AllowOfflineAccess = true, //刷新令牌
                AllowedScopes = new List<string>
                {
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile,
                    "client_scope1"
                }
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
这两个都是配置的客户端的地址，且是identityserver4组件里面封装好的地址，作用分别是登录，注销的回调。
> 在Config中配置客户端(client)中定义了一个AllowedGrantTypes的属性，这个属性决定了Client可以被哪种模式被访问，「GrantTypes.Hybrid」为「混合模式」。所以在本文中我们需要添加一个Client用于支持授权码模式(「Hybrid」)。


##### 7.1.1.2 注册服务
```csharp
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes())
    .AddInMemoryApiResources(IdentityConfig.ApiResources);
```

##### 7.1.1.3 配置管道
保持之前的不变。

#### 7.1.2 搭建API资源项目

##### 7.1.2.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包
```csharp
<PackageReference Include="IdentityServer4.AccessTokenValidation" Version="3.0.1" />
```

##### 7.1.2.2 注册服务
```csharp
builder.Services.AddAuthentication("Bearer")
        .AddIdentityServerAuthentication(options =>
        {
            options.Authority = "http://localhost:5014";
            options.RequireHttpsMetadata = false;
            options.ApiName = "API01";
            options.ApiSecret = "secrets";//对应ApiResources中的密钥
        });
```
AddAuthentication把Bearer配置成默认模式，将身份认证服务添加到DI中。
AddIdentityServerAuthentication把IdentityServer的access token添加到DI中，供身份认证服务使用。

##### 7.1.2.3 配置管道
然后要确保认证服务执行对每个请求的验证，加入UseAuthentication和UseAuthorization到Configure中,在startup.cs中Configure方法添加如下代码：
```csharp
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```
UseAuthentication将身份验证中间件添加到管道中；
UseAuthorization 将启动授权中间件添加到管道中，以便在每次调用主机时执行身份验证授权功能。

##### 7.1.2.4 API资源接口
添加IdentityController控制器
```csharp
[ApiController]
[Route("api/[controller]")]
public class IdentityController : ControllerBase
{
    private readonly ILogger<IdentityController> _logger;

    public IdentityController(ILogger<IdentityController> logger)
    {
        _logger = logger;
    }

    [HttpGet("UserClaims")]
    [Authorize]
    public IActionResult GetUserClaims()
    {
        return new JsonResult(from c in User.Claims select new { c.Type, c.Value });
    }
}
```
在IdentityController 控制器中添加 [Authorize] , 在进行请求资源的时候，需进行认证授权通过后，才能进行访问。

#### 7.1.3 搭建MVC客户端

##### 7.1.3.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Authentication.OpenIdConnect" Version="6.0.4" />
</ItemGroup>
```

##### 7.1.3.2 安装注册服务
要将对 OpenID Connect 身份认证的支持添加到MVC应用程序中。
在startup.cs中ConfigureServices方法添加如下代码：
```csharp
//将身份验证服务添加到容器
builder.Services.AddAuthentication(options =>
{
    // 客户端应用设置使用"Cookies"进行认证
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // identityserver4设置使用"oidc"进行认证  用户登录时候使用openid connect协议
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
}).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
//用于配置执行openid connect协议的处理程序
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.Authority = "http://localhost:5014";//信任的认证地址
    options.RequireHttpsMetadata = false;//暂时不使用https

    options.ClientId = "HybridMvcClient";//识别客户端
    options.ResponseType = "code id_token";
    options.ClientSecret = "secrets";

    options.SaveTokens = true;//用于在cookie中保留来自identityserver的令牌
    options.Scope.Add("client_scope1");//添加授权资源
    options.GetClaimsFromUserInfoEndpoint = true;
    //options.Scope.Add("offline_access");
    //options.ClaimActions.MapJsonKey("website", "website");
});
```
> 1. AddAuthentication注入添加认证授权，当需要用户登录时，使用 cookie 来本地登录用户（通过“Cookies”作为DefaultScheme），并将 DefaultChallengeScheme 设置为“oidc”，
> 2. 使用 AddCookie 添加可以处理 cookie 的处理程序。
> 3. 在AddOpenIdConnect用于配置执行 OpenID Connect 协议的处理程序和相关参数。Authority表明之前搭建的 IdentityServer 授权服务地址。然后我们通过ClientId、ClientSecret,识别这个客户端。SaveTokens用于保存从IdentityServer获取的token至cookie,「ture」标识ASP.NETCore将会自动存储身份认证session的access和refresh token。
> 4. 我们在配置ResponseType时需要使用Hybrid定义的三种情况之一，具体代码如上所述。


##### 7.1.3.3 配置管道
然后要确保认证服务执行对每个请求的验证，加入UseAuthentication和UseAuthorization到Configure中,在startup.cs中Configure方法添加如下代码：
```csharp
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();
app.UseCookiePolicy();
app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

//endpoints.MapDefaultControllerRoute();
//.RequireAuthorization();//禁用整个应用程序的匿名访问

app.Run();
```
UseAuthentication将身份验证中间件添加到管道中；
UseAuthorization 将启动授权中间件添加到管道中，以便在每次调用主机时执行身份验证授权功能。

##### 7.1.3.4 添加授权
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
访问 Index页面，跳转到认证服务地址，进行账号密码登录，Logout 用于用户的注销操作。
```csharp
/// <summary>
/// 使用身份验证服务（如标识服务器）时，清除本地应用程序 Cookie 是不够的。此外，您还需要对身份服务器进行往返，以清除中央单点登录会话。
/// </summary>
/// <returns></returns>
public async Task<IActionResult> Logout()
{
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);

    return View("Anyone");
}
```

##### 7.1.3.5 添加资源访问
在HomeController控制器添加对API资源访问的接口方法。在进行请求的时候，访问API受保护资源。
```csharp
/// <summary>
/// 调用api资源服务
/// </summary>
/// <returns></returns>
public async Task<IActionResult> CallApi()
{
    var accessToken = await HttpContext.GetTokenAsync("access_token");

    var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    var content = await client.GetStringAsync("http://localhost:5020/api/Identity/UserClaims");

    ViewBag.Json = JArray.Parse(content).ToString();
    return View("json");
}
```
> 通过HttpContext获取accessToken之后，设置请求头，访问API资源受保护的地址，获取资源。


### 7.2 问题

#### 7.2.1 设置RequirePkce
在指定基于授权码的令牌是否需要验证密钥，默认为true。错误信息
```csharp
code challenge required
```
解决方法：修改Config中的RequirePkce为false即可。这样服务端便不在需要客户端提供code challeng。
```csharp
RequirePkce = false,//v4.x需要配置这个
```

#### 7.2.2 设置ResponseType
在上文中提到的MVC客户端中配置ResponseType时可以使用Hybrid定义的三种情况。
而当设置为"code token", "code id_token token"中的一种，即只要包含token，都会报如下错误：
```csharp
client not configured to receive account token via brower。
```
解决方法：授权服务端中的Config中增加允许将token通过浏览器传递
```csharp
AllowAccessTokensViaBrowser = true,
```

### 7.3 总结
由于令牌都通过浏览器传输，为了提高更好的安全性，我们不想暴露访问令牌， OpenID Connect包含一个名为“Hybrid（混合）”的流程，它可以让身份令牌(id_token)通过前端浏览器通道传输，因此客户端可以在做更多的工作之前验证它。如果验证成功，客户端会打开令牌服务的后端服务器通道来检索访问令牌(access_token)。

## 资料
[https://mp.weixin.qq.com/s/EitJQ-uXKjUQLi7pj-4uNw](https://mp.weixin.qq.com/s/EitJQ-uXKjUQLi7pj-4uNw) | IdentityServer4系列 | 混合模式
