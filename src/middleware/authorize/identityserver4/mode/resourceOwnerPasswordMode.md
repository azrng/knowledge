---
title: 资源密码凭据模式
lang: zh-CN
date: 2022-04-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: ziyuanmimapingjumoshi
slug: usg52h
docsId: '75705628'
---

## 4. 资源密码凭据模式
如果你高度信任某个应用Client，也允许用户把用户名和密码，直接告诉该应用Client。该应用Client就使用你的密码，申请令牌，这种方式称为"密码式"（password）。

### 4.1 适用场景
资源所有者密码凭证授权模式，适用于当资源所有者与客户端具有良好信任关系的场景，比如客户端是设备的操作系统或具备高权限的应用。授权服务器在开放此种授权模式时必须格外小心，并且只有在别的模式不可用时才允许这种模式。
> 这种模式下，应用client可能存了用户密码这不安全性问题，所以才需要高可信的应用。
> 主要适用于用来做遗留项目升级为oauth2的适配授权使用，当然如果client是自家的应用，也是可以的，同时支持refresh token。
> 例如，A站点 需要添加了 OAuth 2.0 作为对其现有基础架构的一个授权机制。对于现有的客户端转变为这种授权方案，资源所有者密码凭据授权将是最方便的，因为他们只需使用现有的帐户详细信息（比如用户名和密码）来获取访问令牌。


### 4.2 密码授权流程
```csharp
     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          v
          |    Resource Owner
         (A) Password Credentials
          |
          v
     +---------+                                  +---------------+
     |         |>--(B)---- Resource Owner ------->|               |
     |         |         Password Credentials     | Authorization |
     | Client  |                                  |     Server    |
     |         |<--(C)---- Access Token ---------<|               |
     |         |    (w/ Optional Refresh Token)   |               |
     +---------+                                  +---------------+
```
资源所有者密码凭证授权流程描述
（A）资源所有者向客户端提供其用户名和密码。
（B）客户端从授权中请求访问令牌服务器的令牌端点，以获取访问令牌。当发起该请求时，授权服务器需要认证客户端的身份。
（C） 授权服务器验证客户端身份，同时也验证资源所有者的凭据，如果都通过，则签发访问令牌。

#### 4.2.1 过程详解
访问令牌请求

| 参数 | 是否必须 | 含义 |
| --- | --- | --- |
| grant_type | 必需 | 授权类型，值固定为“password”。 |
| username | 必需 | 用户名 |
| password | 必需 | 密码 |
| scope | 可选 | 表示授权范围。 |

同时将允许其他请求参数client_id和client_secret，或在HTTP Basic auth标头中接受客户端ID和密钥。
验证用户名密码
示例：客户端身份验证两种方式
1、Authorization: Bearer base64(resourcesServer:123) 
2、client_id（客户端标识），client_secret（客户端秘钥），username（用户名），password（密码）。
(用户的操作：输入账号和密码)
A 网站要求用户提供 B 网站的用户名和密码。拿到以后，A 就直接向 B 请求令牌。
```csharp
POST /connect/token HTTP/1.1
Host: localhost:5014
Content-Length: 106

client_id=ResourceOwnerPassword01&client_secret=secrets&grant_type=password&username=admin&password=123456
```
上面URL中，grant_type参数是授权方式，这里的password是“密码式”，username和password是B的用户名和密码。

#### 4.2.2 访问令牌响应
第二步，B 网站验证身份通过后，直接给出令牌。注意，这时不需要跳转，而是把令牌放在 JSON 数据里面，作为 HTTP 回应，A 因此拿到令牌。
响应给用户令牌信息（access_token），如下所示
```csharp
{
    "access_token": "访问令牌",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "client_scope1"
}
```
用户使用这个令牌访问资源服务器，当令牌失效时使用刷新令牌去换取新的令牌。
这种方式需要用户给出自己的用户名/密码，显然风险很大，因此只适用于其他授权方式都无法采用的情况，而且必须是用户高度信任的应用。

### 4.3 实践

#### 4.3.1 搭建认证授权服务
使用我们之前创建的AuthCenterInMemory项目。

##### 4.3.1.1 配置内容
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
                ApiSecrets={new Secret("secrets".Sha256())},  //api密钥
                UserClaims={  JwtClaimTypes.Name,JwtClaimTypes.NickName,JwtClaimTypes.Role}
            }
        };

    /// <summary>
    /// Authorization Server保护了哪些 API Scope（作用域）
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<ApiScope> GetApiScopes()
    {
        return new[] { new ApiScope("client_scope1", "client_scope1 DisplayName") };
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
                    new Claim(JwtClaimTypes.Role, "ceshi"),//添加角色
                    new Claim("sex", "男"),
                    new Claim("today", "zhouyi"),
                    new Claim("ceshi1", "ceshi11")
                }
            }
        };
    }
}
```
通过配置ApiResource可以让访问令牌里面包含用户角色、姓名等信息。

##### 4.3.1.2 注册服务
```csharp
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes())
    .AddInMemoryApiResources(IdentityConfig.ApiResources);
```

##### 4.3.1.3 配置管道
保持之前的不变。

#### 4.3.2 搭建API项目

##### 4.3.2.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包
```csharp
<PackageReference Include="IdentityServer4.AccessTokenValidation" Version="3.0.1" />
```

##### 4.3.2.2 注册服务
如果是.Net6以下：「在Startup.cs文件，ConfigureServices方法中」
.Net6直接修改Program文件为
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

##### 4.3.2.3 配置管道
如果是.Net6以下：「在Startup.cs文件，Configure方法中」
.Net6直接修改Program文件为
```csharp
var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseStaticFiles();
app.UseRouting();
app.UseIdentityServer();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```
UseAuthentication将身份验证中间件添加到管道中；
UseAuthorization 将启动授权中间件添加到管道中，以便在每次调用主机时执行身份验证授权功能。

##### 4.3.2.4 添加API资源接口
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

#### 4.3.3 搭建Client客户端
实现对API资源的访问和获取。

##### 4.3.3.1 创建一个控制台项目

##### 4.3.3.2 安装Nuget包
**「IdentityModel」** 包
```csharp
<ItemGroup>
  <PackageReference Include="IdentityModel" Version="6.0.0" />
</ItemGroup>
```

##### 4.3.3.3 获取令牌
客户端与授权服务器进行身份验证并向令牌端点请求访问令牌。授权服务器对客户端进行身份验证，如果有效，颁发访问令牌。

「IdentityModel」 包括用于发现 「IdentityServer」 各个终结点（EndPoint）的客户端库。
我们可以使用从 「IdentityServer」 元数据获取到的Token终结点请求令牌：
```csharp
var client = new HttpClient();
var disco = await client.GetDiscoveryDocumentAsync("http://localhost:5014");
if (disco.IsError)
{
    Console.WriteLine(disco.Error);
    return;
}

// request token
var tokenResponse = await client.RequestPasswordTokenAsync(new PasswordTokenRequest
{
    Address = disco.TokenEndpoint,
    ClientId = "ResourceOwnerPassword01",
    ClientSecret = "secrets",

    UserName = "admin",
    Password = "123456",
    Scope = "client_scope1"
});

if (tokenResponse.IsError)
{
    Console.WriteLine(tokenResponse.Error);
    return;
}

Console.WriteLine(tokenResponse.Json);
Console.WriteLine("\n\n");
```

1. 客户端请求token多了两个参数，一个用户名，一个密码
2. 请求Token中使用IdentityModel包的方法RequestPasswordTokenAsync,实现用户密码方式获取令牌。

##### 4.3.3.4 调用API
要将Token发送到API，通常使用HTTP Authorization标头。这是使用SetBearerToken扩展方法完成。
```csharp
var apiClient = new HttpClient();
apiClient.SetBearerToken(tokenResponse.AccessToken);

var response = await apiClient.GetAsync("http://localhost:5020/api/Identity/UserClaims");
if (!response.IsSuccessStatusCode)
{
    Console.WriteLine(response.StatusCode);
}
else
{
    var content = response.Content.ReadAsStringAsync().Result;
    Console.WriteLine(JArray.Parse(content));
}
```
运行项目演示获取结果
```csharp
[{"type":"nbf","value":"1651318247"},{"type":"exp","value":"1651321847"},{"type":"iss","value":"http://localhost:5014"},{"type":"aud","value":"API01"},{"type":"client_id","value":"ResourceOwnerPassword01"},{"type":"sub","value":"2"},{"type":"auth_time","value":"1651318247"},{"type":"idp","value":"local"},{"type":"name","value":"Bob"},{"type":"nickname","value":"Bob nickname"},{"type":"role","value":"ceshi"},{"type":"jti","value":"AF07EA7F7410C046CFC2D32D332362D0"},{"type":"iat","value":"1651318247"},{"type":"scope","value":"client_scope1"},{"type":"amr","value":"pwd"}]
```

## 资料
[https://mp.weixin.qq.com/s/fWWJUNw-ggbpjNzjT6MFvg](https://mp.weixin.qq.com/s/fWWJUNw-ggbpjNzjT6MFvg) | IdentityServer4系列 | 资源密码凭证模式
