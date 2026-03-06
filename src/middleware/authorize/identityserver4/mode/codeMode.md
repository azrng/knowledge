---
title: 授权码模式
lang: zh-CN
date: 2023-02-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shouquanmamoshi
slug: fnpc39
docsId: '75705725'
---

## 前言
关于简化模式中，通过客户端以浏览器的形式请求「IdentityServer」服务获取访问令牌，从而请求获取受保护的资源，但由于token携带在url中，安全性方面不能保证。因此，我们可以考虑通过其他方式来解决这个问题。
我们通过Oauth2.0的「授权码模式」了解，这种模式不同于简化模式，「在于授权码模式不直接返回token，而是先返回一个授权码，然后再根据这个授权码去请求token」。这显得更为安全。
所以在这一篇中，我们将通过多种授权模式中的「授权码」模式进行说明，主要针对介绍「IdentityServer」保护API的资源，「授权码」访问API资源。

## 6. 授权码模式
![](/common/1651382972817-e1da619b-e47f-452c-8dc5-1f4fd35070b9.png)
> **「指的是第三方应用先申请一个授权码，然后再用该码获取令牌，实现与资源服务器的通信。」**

看一个常见的QQ登陆第三方网站的流程如下图所示：
![](/common/1651382998256-35f3eef4-f451-4327-809b-80c46f6693c2.png)

### 6.1 适用场景
授权码模式(authorization code)是功能最完整、流程最严密的授权模式。

### 6.2 授权码授权流程
```csharp
     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)
```
「授权码授权流程描述」
（A）「用户访问第三方应用，第三方应用将用户导向认证服务器」；
（B）「用户选择是否给予第三方应用授权」；
（C）「假设用户给予授权，认证服务器将用户导向第三方应用事先指定的重定向URI，同时带上一个授权码」；
（D）「第三方应用收到授权码，带上上一步时的重定向URI，向认证服务器申请访问令牌。这一步是在第三方应用的后台的服务器上完成的，对用户不可见」；
（E）「认证服务器核对了授权码和重定向URI，确认无误后，向第三方应用发送访问令牌(Access Token)和更新令牌(Refresh token)」；
（F）「访问令牌过期后，刷新访问令牌」；

#### 6.2.1 过程详解
访问令牌请求
「（1）用户访问第三方应用，第三方应用将用户导向认证服务器」
  (用户的操作：用户访问https://client.example.com/cb跳转到登录地址，选择授权服务器方式登录)

在授权开始之前，它首先生成state参数(随机字符串)。client端将需要存储这个（cookie，会话或其他方式），以便在下一步中使用。
```csharp
GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
        &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
HTTP/1.1 Host: server.example.com
```
生成的授权URL如上所述（如上），请求这个地址后重定向访问授权服务器，其中 response_type参数为code,表示授权类型，返回code授权码。

| 参数 | 是否必须 | 含义 |
| --- | --- | --- |
| response_type | 必需 | 表示授权类型，此处的值固定为"code" |
| client_id | 必需 | 客户端ID |
| redirect_uri | 可选 | 表示重定向的URI |
| scope | 可选 | 表示授权范围。 |
| state | 可选 | 表示随机字符串,可指定任意值，认证服务器会返回这个值 |

**「（2）假设用户给予授权，认证服务器将用户导向第三方应用事先指定的重定向URI，同时带上一个授权码」**
```csharp
HTTP/1.1 302 Found
Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz
```
| 参数 | 含义 |
| --- | --- |
| code | 表示授权码，必选项。该码的有效期应该很短，通常设为10分钟，客户端只能使用该码一次，否则会被授权服务器拒绝。该码与客户端ID和重定向URI，是一一对应关系。 |
| state | 如果客户端的请求中包含这个参数，认证服务器的回应也必须一模一样包含这个参数。 |

**「（3）第三方应用收到授权码，带上上一步时的重定向URI，向认证服务器申请访问令牌。这一步是在第三方应用的后台的服务器上完成的，对用户不可见」**。
```csharp
POST /token HTTP/1.1
Host: server.example.com
Authorization: Bearer czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded
grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
```
| 参数 | 含义 |
| --- | --- |
| grant_type | 表示使用的授权模式，必选项，此处的值固定为"authorization_code"。 |
| code | 表示上一步获得的授权码，必选项。 |
| redirect_uri | 表示重定向URI，必选项，且必须与步骤1中的该参数值保持一致。 |
| client_id | 表示客户端ID，必选项。 |

**「（4）认证服务器核对了授权码和重定向URI，确认无误后，向第三方应用发送访问令牌(Access Token)和更新令牌(Refresh token)」**
```csharp
HTTP/1.1 200 OK
     Content-Type: application/json;charset=UTF-8
     Cache-Control: no-store
     Pragma: no-cache
     {
       "access_token":"2YotnFZFEjr1zCsicMWpAA",
       "token_type":"Bearer",
       "expires_in":3600,
       "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
       "example_parameter":"example_value"
     }
```

### 6.3 实践
在示例实践中，我们将创建一个授权访问服务，定义一个HTML客户端，HTML客户端通过「IdentityServer」上请求访问令牌，并使用它来访问API。

#### 6.3.1 搭建认证授权服务
使用我们之前创建的AuthCenterInMemory项目。

##### 6.3.1.1 配置内容
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
> 在配置内容中配置客户端(client)中定义了一个AllowedGrantTypes的属性，这个属性决定了Client可以被哪种模式被访问，「GrantTypes.Code」为「授权码模式」。所以在本文中我们需要添加一个Client用于支持授权码模式(「Authorization Code」)。


##### 6.3.1.2 注册服务
```csharp
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes())
    .AddInMemoryApiResources(IdentityConfig.ApiResources);
```

##### 6.3.1.3 配置管道
保持之前的不变。

#### 6.3.2 搭建API资源项目

##### 6.3.2.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包
```csharp
<PackageReference Include="IdentityServer4.AccessTokenValidation" Version="3.0.1" />
```

##### 6.3.2.2 注册服务
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

##### 6.3.2.3 配置管道
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

##### 6.3.2.4 API资源接口
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

#### 6.3.3 搭建前端HTML客户端
实现对客户端认证授权访问资源

##### 6.3.3.1 新建空.NetCoreAPI项目
修改Program文件
```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
app.Run();
```

##### 6.3.3.1 编写前端页面
新建wwwroot目录，在里面创建index.html和callback.html页面
> 具体代码参考：[https://identityserver4.readthedocs.io/en/latest/quickstarts/4_javascript_client.html](https://identityserver4.readthedocs.io/en/latest/quickstarts/4_javascript_client.html)

核心配置代码
```csharp
var config = {
    authority: "http://localhost:5014",//授权服务器地址
    client_id: "AuthorizationCodeWebClient",
    redirect_uri: "http://localhost:5024/callback.html", //登录后重定向的位置
    response_type: "code",
    scope: "openid profile client_scope1",
    post_logout_redirect_uri: "http://localhost:5024/index.html",//注销后重定向的位置
};
```
登录成功后即可调用需要授权才能访问的资源
```csharp
function api() {
    mgr.getUser().then(function (user) {
        //请求需要授权的资源
        var url = "http://localhost:5020/api/Identity/UserClaims";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}
```
> 具体代码会放代码仓库


#### 6.3.4 请求资源服务是MVC客户端
这里是演示另一种情况，如果请求的资源服务的客户端是MVC客户端，如何操作。(该示例我并没有操作)

##### 6.3.4.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包

##### 6.3.4.2 安装注册服务
要将对 OpenID Connect 身份认证的支持添加到MVC应用程序中。
在startup.cs中ConfigureServices方法添加如下代码：
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllersWithViews();
    services.AddAuthorization();

    services.AddAuthentication(options =>
    {
        options.DefaultScheme = "Cookies";
        options.DefaultChallengeScheme = "oidc";
    })
           .AddCookie("Cookies")  //使用Cookie作为验证用户的首选方式
          .AddOpenIdConnect("oidc", options =>
          {
              options.Authority = "http://localhost:5001";  //授权服务器地址
              options.RequireHttpsMetadata = false;  //暂时不用https
              options.ClientId = "code_client";
              options.ClientSecret = "511536EF-F270-4058-80CA-1C89C192F69A";
              options.ResponseType = "code"; //代表Authorization Code
              options.Scope.Add("code_scope1"); //添加授权资源
              options.SaveTokens = true; //表示把获取的Token存到Cookie中
              options.GetClaimsFromUserInfoEndpoint = true;
          });
    services.ConfigureNonBreakingSameSiteCookies();
}
```
> 1. AddAuthentication注入添加认证授权，当需要用户登录时，使用 cookie 来本地登录用户（通过“Cookies”作为DefaultScheme），并将 DefaultChallengeScheme 设置为“oidc”，
> 2. 使用 AddCookie 添加可以处理 cookie 的处理程序。
> 3. 在AddOpenIdConnect用于配置执行 OpenID Connect 协议的处理程序和相关参数。Authority表明之前搭建的 IdentityServer 授权服务地址。然后我们通过ClientId、ClientSecret,识别这个客户端。SaveTokens用于保存从IdentityServer获取的token至cookie,「ture」标识ASP.NETCore将会自动存储身份认证session的access和refresh token。


##### 6.3.4.3 配置管道
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
    app.UseRouting();
    app.UseCookiePolicy();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
    });
}
```
UseAuthentication将身份验证中间件添加到管道中；
UseAuthorization 将启动授权中间件添加到管道中，以便在每次调用主机时执行身份验证授权功能。

##### 6.3.4.4 添加授权
在HomeController控制器并添加[Authorize]特性到其中一个方法。在进行请求的时候，需进行认证授权通过后，才能进行访问。
```csharp
[Authorize]
public IActionResult Privacy()
{
    ViewData["Message"] = "Secure page.";
    return View();
}
```
还要修改主视图以显示用户的Claim以及cookie属性。
```csharp
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
```
访问 Privacy 页面，跳转到认证服务地址，进行账号密码登录，Logout 用于用户的注销操作。

##### 6.3.4.5 添加资源访问
在HomeController控制器添加对API资源访问的接口方法。在进行请求的时候，访问API受保护资源。
```csharp
/// <summary>
/// 测试请求API资源(api1)
/// </summary>
/// <returns></returns>
public async Task<IActionResult> getApi()
{
    var client = new HttpClient();
    var accessToken = await HttpContext.GetTokenAsync(OpenIdConnectParameterNames.AccessToken);
    if (string.IsNullOrEmpty(accessToken))
    {
        return Json(new { msg = "accesstoken 获取失败" });
    }
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    var httpResponse = await client.GetAsync("http://localhost:5003/api/identity/GetUserClaims");
    var result = await httpResponse.Content.ReadAsStringAsync();
    if (!httpResponse.IsSuccessStatusCode)
    {
        return Json(new { msg = "请求 api1 失败。", error = result });
    }
    return Json(new
    {
        msg = "成功",
        data = JsonConvert.DeserializeObject(result)
    });
}
```
> 测试这里通过获取accessToken之后，设置client请求头的认证，访问API资源受保护的地址，获取资源。


### 问题

#### 跨域问题
Access to XMLHttpRequest at '[http://localhost:5014/.well-known/openid-configuration'](http://localhost:5014/.well-known/openid-configuration') from origin 'http://localhost:5024' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

需要对授权服务器的client配置设置允许跨域请求。
```csharp
AllowedCorsOrigins = {"http://localhost:5024"},//允许跨域请求的地址
```

## 资料
[https://mp.weixin.qq.com/s/gSp8DxRuUZEWCA0Ac-DrvQ](https://mp.weixin.qq.com/s/gSp8DxRuUZEWCA0Ac-DrvQ) | IdentityServer4系列 | 授权码模式
