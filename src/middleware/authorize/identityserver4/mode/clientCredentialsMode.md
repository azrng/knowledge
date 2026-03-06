---
title: 客户端凭据模式
lang: zh-CN
date: 2022-04-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: kehuduanpingjumoshi
slug: vh9kgc
docsId: '75705563'
---

## 3. 客户端凭证模式
Client Credentials 客户端凭证模式：客户端（Client）请求授权服务器验证，通过验证就发access token，Client直接以用自己的名义去访问Resource server的一些受保护资源。
该方式是给出的令牌是针对第三方应用的(一个第三方应用访问受保护的资源)，不是针对用户的，所以有可能会多个用户共享这一个令牌。
> 注意：不涉及用户信息


### 3.1 适用场景
这种模式一般只用在服务端与服务端之间的认证
```csharp
适用于没有前端的命令行应用，即在命令行请求令牌
```
认证服务器不提供像用户数据这样的重要资源，仅仅是有限的只读资源或者一些开放的API。例如使用了第三方的静态文件服务，如Google Storage或Amazon S3。这样，你的应用需要通过外部API调用并以应用本身而不是单个用户的身份来读取或修改这些资源。这样的场景就很适合使用客户端证书授权。

### 3.2 客户端凭证流程
```csharp
 +---------+                                  +---------------+
 |         |                                  |               |
 |         |>--(A)- Client Authentication --->| Authorization |
 | Client  |                                  |     Server    |
 |         |<--(B)---- Access Token ---------<|               |
 |         |                                  |               |
 +---------+                                  +---------------+
```
「客户端凭据许可流程描述」
（A）客户端与授权服务器进行身份验证并向令牌端点请求访问令牌。
（B）授权服务器对客户端进行身份验证，如果有效，颁发访问令牌。

#### 3.2.1 过程详解
访问令牌请求

| 参数 | 是否必须 | 含义 |
| --- | --- | --- |
| grant_type | 必需 | 授权类型，值固定为“client_credentials”。 |
| scope | 可选 | 表示授权范围。 |

示例：客户端身份验证两种方式
1、Authorization: Bearer base64(resourcesServer:123) 
2、client_id（客户端标识），client_secret（客户端秘钥）。
```csharp
POST /connect/token HTTP/1.1
Host: localhost:5014
User-Agent: apifox/1.0.0 (https://www.apifox.cn)
Content-Length: 73

client_id=ConsoleApp1&client_secret=secrets&grant_type=client_credentials
```

#### 3.2.2 访问令牌响应
```csharp
{
    "access_token": "jwt token",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "ApiScope1"
}
```

### 3.3 实践
在示例实践中，我们将创建一个授权访问服务，定义一个API和要访问它的客户端，客户端通过「IdentityServer」上请求访问令牌，并使用它来访问API。

#### 3.3.1 搭建认证授权服务
使用我们之前创建的AuthCenterInMemory项目。

##### 3.3.1.1 配置内容
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
                Scopes = {"client_scope1"}
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
                ClientId = "ConsoleClient01", //客户端的标识，要是唯一的
                ClientSecrets = new[] {new Secret("secrets".Sha256())}, //客户端密码，进行了加密
                AllowedGrantTypes =
                    GrantTypes
                        .ClientCredentials, //授权方式，这里采用的是客户端认证模式，只要ClientId，以及ClientSecrets正确即可访问对应的AllowedScopes里面的api资源
                AllowedScopes = new[] {"client_scope1"}, //定义这个客户端可以访问的scopes
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
                SubjectId = "001",
                Username = "admin",
                Password = "123456"
            }
        };
    }
}
```

##### 3.3.1.2 注册服务
```csharp
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes())
    .AddInMemoryApiResources(IdentityConfig.ApiResources);
```

##### 3.3.1.3 配置管道
保持之前的不变。

#### 3.3.2 搭建API项目

##### 3.3.2.1 安装Nuget包
IdentityServer4.AccessTokenValidation 包
```csharp
<PackageReference Include="IdentityServer4.AccessTokenValidation" Version="3.0.1" />
```

##### 3.3.2.2 注册服务
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
        });
```
AddAuthentication把Bearer配置成默认模式，将身份认证服务添加到DI中。
AddIdentityServerAuthentication把IdentityServer的access token添加到DI中，供身份认证服务使用。

##### 3.3.2.3 配置管道
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

##### 3.3.2.4 添加API资源接口
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

#### 3.3.3 搭建Client客户端
实现对API资源的访问和获取。

##### 3.3.3.1 创建一个控制台项目

##### 3.3.3.2 安装Nuget包
**「IdentityModel」** 包
```csharp
<ItemGroup>
  <PackageReference Include="IdentityModel" Version="6.0.0" />
</ItemGroup>
```

##### 3.3.3.3 获取令牌
客户端与授权服务器进行身份验证并向令牌端点请求访问令牌。授权服务器对客户端进行身份验证，如果有效，颁发访问令牌。

「IdentityModel」 包括用于发现 「IdentityServer」 各个终结点（EndPoint）的客户端库。
我们可以使用从 「IdentityServer」 元数据获取到的Token终结点请求令牌：
```csharp
var client = new HttpClient();
//请求认证服务获取发现文档
var disco = await client.GetDiscoveryDocumentAsync("http://localhost:5014");
if (disco.IsError)
{
    Console.WriteLine(disco.Error);
    return;
}
Console.WriteLine(disco.TokenEndpoint);

//请求token
var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
{
    Address = disco.TokenEndpoint,

    ClientId = "ConsoleClient01",
    ClientSecret = "secrets",
    Scope = "client_scope1"
});
if (tokenResponse.IsError)
{
    Console.WriteLine(tokenResponse.Error);
    return;
}
Console.WriteLine(tokenResponse.AccessToken);
```

##### 3.3.3.4 调用API
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
    var content = await response.Content.ReadAsStringAsync();
    Console.WriteLine(JArray.Parse(content));
}
```
运行项目演示获取结果
```csharp
[{"type":"nbf","value":"1651314077"},{"type":"exp","value":"1651317677"},{"type":"iss","value":"http://localhost:5014"},{"type":"aud","value":"API01"},{"type":"client_id","value":"ConsoleClient01"},{"type":"jti","value":"E2EE21F0B6C4C39BCF8C3EBA3D7A7F6B"},{"type":"iat","value":"1651314077"},{"type":"scope","value":"client_scope1"}]
```

## 资料
[https://mp.weixin.qq.com/s/dYG_a08zToH4kGGOLPrvkQ](https://mp.weixin.qq.com/s/dYG_a08zToH4kGGOLPrvkQ) | IdentityServer4系列 | 客户端凭证模式
