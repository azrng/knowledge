---
title: 快速搭建项目
lang: zh-CN
date: 2023-02-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: kuaisudajianxiangmu
slug: igundm
docsId: '72069672'
---
> 以下的项目示例都是基于IdentityServer4 「4.x」版本以上进行说明。
> 示例环境：VS2022+.Net6
> 本文内容模仿自：公众号【元说技术】


## 1. 快速搭建项目

### 1.1 创建项目
建立一个空的Asp.Net Core项目(AuthCenterInMemory) ，使用Empty空模板
![image.png](/common/1651303351185-79194594-6ce2-4469-96b7-43151af5237e.png)

### 1.2 安装配置

#### 1.2.1 安装组件

- 命令行安装安装
```csharp
NuGet>Install-Package IdentityServer4
```

- 通过包管理器安装

添加IdentityServer4包

安装结果
```csharp
<ItemGroup>
  <PackageReference Include="IdentityServer4" Version="4.1.2" />
</ItemGroup>
```

#### 1.2.2 配置管道
如果是.Net6以下：「修改Configure方法，注入到容器」
.Net6直接修改Program文件
```csharp
app.UseIdentityServer();
```

#### 1.2.3 配置内容
「将服务注入到容器后，还需要对IdentityServce进行配置内容」
> - 哪些API需要Authorization Server进行资源保护
> - 哪些Client可以使用这个Authorization Server
> - 哪些User可以被这个AuthorizationServer识别并授权
> - 哪些资源可以指定作用域

这里方便演示，直接以静态化的形式展示，实际开发应用中，可结合数据库或reidis缓存的数据持久化方式获取。
建立配置内容文件IdentityConfig.cs（具体的 OpenID Connect 配置信息来源文件）
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

    /// <summary>
    /// Authorization Server保护了哪些 API Scope（作用域）
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<ApiScope> GetApiScopes()
    {
        return new[] {new ApiScope("ApiScope1", "ApiScope1DisplayName")};
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
                ClientId = "ConsoleApp1", //客户端的标识，要是唯一的
                ClientSecrets = new[] {new Secret("secrets".Sha256())}, //客户端密码，进行了加密
                AllowedGrantTypes =
                    GrantTypes
                        .ClientCredentials, //授权方式，这里采用的是客户端认证模式，只要ClientId，以及ClientSecrets正确即可访问对应的AllowedScopes里面的api资源
                AllowedScopes = new[] {"ApiScope1"}, //定义这个客户端可以访问的APi资源数组，上面只有一个api
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

#### 1.2.4 添加配置服务
如果是.Net6以下：「在Startup.cs文件，ConfigureServices方法中」
.Net6直接修改Program文件为
```csharp
using AuthCenterInMemory;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes());

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.UseIdentityServer();
app.Run();
```
> 我们现在是本地调试，可以告诉identity server4在程序的运行时候对这项工作进行设定: AddDeveloperSigningCredential()，它默认会存到硬盘上的， 所以每次重启服务不会破坏开发时的数据同步。这个方法只适合用于identity server4在单个机器运行， 如果是 production 你得使用AddSigningCredential()这个方法

以上操作完成后， 启动项目，通过它的 .well-known 端点来访问服务器的配置信息，在浏览器的地址栏中，输入地址：http://localhost:Port/.well-known/openid-configuration，并回车。应该可以看到如下的响应信息。
```csharp
{
    "issuer": "http://localhost:5014",
    "jwks_uri": "http://localhost:5014/.well-known/openid-configuration/jwks",
    "authorization_endpoint": "http://localhost:5014/connect/authorize",
    "token_endpoint": "http://localhost:5014/connect/token",
    "userinfo_endpoint": "http://localhost:5014/connect/userinfo",
    "end_session_endpoint": "http://localhost:5014/connect/endsession",
    "check_session_iframe": "http://localhost:5014/connect/checksession",
    "revocation_endpoint": "http://localhost:5014/connect/revocation",
    "introspection_endpoint": "http://localhost:5014/connect/introspect",
    "device_authorization_endpoint": "http://localhost:5014/connect/deviceauthorization",
    "frontchannel_logout_supported": true,
    "frontchannel_logout_session_supported": true,
    "backchannel_logout_supported": true,
    "backchannel_logout_session_supported": true,
    "scopes_supported": [
        "ApiScope1",
        "offline_access"
    ],
    "claims_supported": [],
    "grant_types_supported": [
        "authorization_code",
        "client_credentials",
        "refresh_token",
        "implicit",
        "password",
        "urn:ietf:params:oauth:grant-type:device_code"
    ],
    "response_types_supported": [
        "code",
        "token",
        "id_token",
        "id_token token",
        "code id_token",
        "code token",
        "code id_token token"
    ],
    "response_modes_supported": [
        "form_post",
        "query",
        "fragment"
    ],
    "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post"
    ],
    "id_token_signing_alg_values_supported": [
        "RS256"
    ],
    "subject_types_supported": [
        "public"
    ],
    "code_challenge_methods_supported": [
        "plain",
        "S256"
    ],
    "request_parameter_supported": true
}
```

### 1.3 获取Token

#### 1.3.1 启动项目

#### 1.3.2 测试访问地址
> [http://localhost:5050/connect/token](http://localhost:5050/connect/token)

body参数：application/x-www-form-urlencoded (post)
![image.png](/common/1651306115060-07c9bb35-636e-4e40-987b-6941b2d5a386.png)
对应的RestSharp代码
```csharp
var client = new RestClient("http://localhost:5014/connect/token");
client.Timeout = -1;
var request = new RestRequest(Method.POST);
request.AddParameter("client_id", "ConsoleApp1");
request.AddParameter("client_secret", "secrets");
request.AddParameter("grant_type", "client_credentials");
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```
返回结果
```csharp
{
    "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1RjgyNTYyNUU3QTU3NzQyQTAzNTU1Mzg2Mzc4NzhCIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NTEzMDYwNTEsImV4cCI6MTY1MTMwOTY1MSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDE0IiwiY2xpZW50X2lkIjoiQ29uc29sZUFwcDEiLCJqdGkiOiIzNTZGQjg3MThBREY2Q0M0QzY1Njg4NTE3Q0VFN0U2QSIsImlhdCI6MTY1MTMwNjA1MSwic2NvcGUiOlsiQXBpU2NvcGUxIl19.Q_0IyrJ8g6vQ3bm7dwyomfgbPb2iQ3wjZulbCqEKC1A9q5RmLrL2YqeZX4QXbpuBMe3axhDoWvFDmUqp-cwMNx_kZPpPiWn7o1xj4sIxGG6oG9_wD1wCycDZwCj3J8ARDgOCrvwUPfkQ8qtu-QHCbU99_gXxWup2G5pNH7mTUtB2HyY06PDlqO07UwG-rUQUWLmi-KEvH5Sx_OeIfOgCBrsUeU7VLMVAavWKKUV2hfoLVWY6Bu4RO7TbTkNKzoCMcDnwnTdpdATz-rGpyvBTVDuXoHOaQH5JDkseT0Gv6tHGUjN6clJhwXUOjmF2NOlo1jTSfnrXP1xftnT0oS_Mfg",
    "expires_in": 3600,
    "token_type": "Bearer",
    "scope": "ApiScope1"
}
```

#### 2.3.3 Access_Token
将上面的内容进行解码
```csharp
//头部
{
  "alg": "RS256",
  "kid": "05F825625E7A57742A0355538637878B",
  "typ": "at+jwt"
}

//载荷
{
  "nbf": 1651306051,
  "exp": 1651309651,
  "iss": "http://localhost:5014",
  "client_id": "ConsoleApp1",
  "jti": "356FB8718ADF6CC4C65688517CEE7E6A",
  "iat": 1651306051,
  "scope": [
    "ApiScope1"
  ]
}
```

## 2. UI界面
考虑IdentityServer4需要进行管理查看，添加页面管理界面
官方为我们提供了一个快速启动的UI界面，我们只需要下载下来即可，这里有两个方法

### 2.1 QuickStart UI界面
```csharp
1、直接从这个地址下来下载，拷贝到项目中，一共三个文件夹；// https://github.com/IdentityServer/IdentityServer4.Quickstart.UI

2、在当前文件夹中执行命令，自动下载；

iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/IdentityServer/IdentityServer4.Quickstart.UI/master/getmaster.ps1'))
```

### 2.2 默认目录
![image.png](/common/1651307074673-76d24686-57bf-41ed-b3ac-ded9469782a2.png)
下载完官方提供的默认UI界面后，会提供默认的三个目录文件夹分别为：Quickstart (控制器方法)、Views(视图)、wwwroot (静态文件)

### 2.3 修改配置 
配置中间件来使用静态文件
```csharp
app.UseStaticFiles();
```
完整配置变成
```csharp
using AuthCenterInMemory;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddIdentityServer()
    .AddDeveloperSigningCredential()
    .AddTestUsers(IdentityConfig.GetTestUsers().ToList())
    .AddInMemoryClients(IdentityConfig.GetClients())
    .AddInMemoryApiScopes(IdentityConfig.GetApiScopes());

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

### 2.4 运行
运行展示效果，启动默认的地址
![image.png](/common/1651307538598-b7045ec0-904e-4de5-99ca-ed66027c0bc0.png)
运行项目后，可以发现启动默认的欢迎界面，看到对应的项目版本，我们这里用的是最新的IdentityServer4版本为4.1.2，以及点击 「discovery document」，可以看到了我们上边说到的 token 获取的接口地址 ，其中对应的端点地址信息。
> **「通过它的 .well-known 端点来访问服务器的配置信息，在浏览器的地址栏中，输入地址：http://localhost:5014/.well-known/openid-configuration，并回车,可以看到对应的响应信息。」**


### 2.5 模板
在上文中，我们通过手动搭建的方式，从一个空模板的搭建，到引用对应的Nuget包，安装修改配置，并搭配了官方提供的UI界面，初步形成了一个简易的IdentityServer4初始化项目框架，这种一步步的构建项目的方式。

官方也给我们提供了对应的快捷创建项目的模板，所以，如果你不想创建MVC项目，可以用官方提供的模板方式进行创建初始化项目。

#### 2.5.1 安装模板
```csharp
dotnet new -i IdentityServer4.Templates
```
在命令的输出中，可以看到已经安装了多个关于IdentityServer4的模板

| **模板** | **简称** | **说明** |
| --- | --- | --- |
| IdentityServer4   with AdminUI | is4admin | 这为用户、身份、客户端和资源提供了一个基于web的管理界面.该社区版本旨在测试IdentityServer集成场景，并且仅限于本地主机：5000、SQLite、10个用户和2个客户端。社区版不适合生产应用。 |
| IdentityServer4   with ASP.NET Core Identity | is4aspid | 添加使用ASP.NET标识进行用户管理的基本IdentityServer。如果您自动启动数据库，您将得到两个用户：Alice和bob--都带有密码Pass123$。检查SeedData.cs文件。 |
| IdentityServer4   Empty | is4empty | 在没有UI的情况下创建一个最小的IdentityServer4项目。 |
| IdentityServer4   with Entity Framework Stores | is4ef | 添加使用实体框架进行配置和状态管理的基本IdentityServer。如果您启动数据库，您将获得一些基本的客户端和资源注册，请检查SeedData.cs文件。 |
| IdentityServer4   with In-Memory Stores and Test Users | is4inmem | 添加具有UI、测试用户和示例客户端和资源的基本IdentityServer。显示内存中的代码和JSON配置。 |
| IdentityServer4   Quickstart UI (UI assets only) | is4ui | 将快速启动UI添加到当前项目(例如，可以在is4empty的基础上添加) |


#### 2.5.2 选择项目
这里面最为简单的项目模版就是 IdentityServer4 with In-Memory Stores and Test Users 了，它简称为 is4inmem ，我们下面就使用它来创建项目。
```powershell
## dotnet new 模板名称 -n 项目名称

## 创建一个空的ids4项目
dotnet new is4empty -n IdentityEmptyServer
```
可以直接双击已经下载好的项目的*.csproj文件进行启动，可以看到项目的效果跟我们之前一步步搭建的效果是一样的，这说明我们已经创建了第一个可运行的 IdentityServer4 服务器了。

## 注意事项

### HS256与RS256
JWT签名算法中，一般有两个选择，一个采用HS256,另外一个就是采用RS256。
> 「签名实际上是一个加密的过程，生成一段标识（也是JWT的一部分）作为接收方验证信息是否被篡改的依据。」

1. 「HS256」 使用密钥生成「固定的签名」，简单地说，HS256 必须与任何想要验证 JWT的 客户端或 API 「共享密钥」，因此必须注意确保密钥不被泄露。
2. 「RS256」 生成「非对称签名」，这意味着必须使用私钥来签签名 JWT，并且必须使用对应的公钥来验证签名。与对称算法不同，使用 RS256 可以保证服务端是 JWT 的签名者，因为服务端是唯一拥有私钥的一方。这样做将不再需要在许多应用程序之间共享私钥。

因此，在开发应用的时候启用JWT时候，使用RS256更加安全，你可以控制谁能使用什么类型的密钥。同时可以让服务端是唯一拥有私钥的一方，不需共享私钥。

### 关于证书
生产环境（负载集群）一般需要使用固定的证书签名与验签,以确保重启服务端或负载的时候 Token 都能验签通过。（不使用临时证书）

#### 创建证书
```csharp
#生成私钥文件
openssl genrsa -out idsrv4.key 2048
#创建证书签名请求文件 CSR（Certificate Signing Request），用于提交给证书颁发机构（即 Certification Authority (CA)）即对证书签名，申请一个数字证书。
openssl req -new -key idsrv4.key -out idsrv4.csr
#生成自签名证书（证书颁发机构（CA）签名后的证书，因为自己做测试那么证书的申请机构和颁发机构都是自己,crt 证书包含持有人的信息，持有人的公钥，以及签署者的签名等信息。当用户安装了证书之后，便意味着信任了这份证书，同时拥有了其中的公钥。）
openssl x509 -req -days 365 -in idsrv4.csr -signkey idsrv4.key -out idsrv4.crt
#自签名证书与私匙合并成一个文件
openssl pkcs12 -export -in idsrv4.crt -inkey idsrv4.key -out idsrv4.pfx

或
openssl req -newkey rsa:2048 -nodes -keyout idsrv4.key -x509 -days 365 -out idsrv4.cer
openssl pkcs12 -export -in idsrv4.cer -inkey idsrv4.key -out idsrv4.pfx
```
中途提示让你输入Export Password,这个password后面会用到。

#### 项目配置
拷贝生成的证书，放到认证/授权服务器项目中。(VS中配置文件设置文件始终复制)，最后把证书路径和密码配置到 IdentityServer 中，因为我们自签名的证书是 PKCS12 (个人数字证书标准，Public Key Cryptography Standards #12) 标准包含私钥与公钥）标准，包含了公钥和私钥。
A、在appsetting.json 配置文件中添加如下：此处需要配置password，即生成证书的时候输入的密码。
```csharp

{
    "Certificates": {
        "CerPath": "certificate\\idsrv4.pfx",
        "Password": "P@ssw0rd"
    }
} 
```
B、在starup.cs中ConfigureServices方法中配置如下即可。
```csharp
var basePath = PlatformServices.Default.Application.ApplicationBasePath;
services.AddIdentityServer().AddSigningCredential(new X509Certificate2(
Path.Combine(basePath,Configuration["Certificates:CerPath"]),
Configuration["Certificates:Password"])
)
```
C、配置完后即可。我们启动IDS4项目即可生成加密的token。

#### 提取证书
OpenSSL 提取 pfx 证书公钥与私钥
```csharp
提取pfx证书公钥和私钥
从pfx证书中提取密钥信息，并转换为key格式（pfx使用pkcs12模式补足）
1. 提取密钥对(如果pfx证书已加密，会提示输入密码)
openssl pkcs12 -in idsrv4.pfx -nocerts -nodes -out idsrv4.key
2. 从密钥对提取公钥
openssl rsa -in idsrv4.key -pubout -out idsrv4_pub.key
3. 从密钥对提取私钥
openssl rsa -in  idsrv4.key -out idsrv4_pri.key
4. 因为RSA算法使用的是 pkcs8 模式补足，需要对提取的私钥进一步处理得到最终私钥
openssl pkcs8 -topk8 -inform PEM -in idsrv4_pri.key -outform PEM -nocrypt
```
> 将得到的token在jwt.io 网站来认证一下,需要将 crt 公钥、key私钥复制到验证中，发现认证ok,则说明实现防篡改。
> 后缀为crt公钥需要带着 -----BEGIN CERTIFICATE----- 和 -----END CERTIFICATE----- 一起复制。后缀为key私钥私钥需要带着 -----BEGIN RSA PRIVATE KEY----- 和 -----END RSA PRIVATE KEY----- 一起复制。


## 资料
[https://mp.weixin.qq.com/s/N2ADahdfAAJug6Tk46RfOA](https://mp.weixin.qq.com/s/N2ADahdfAAJug6Tk46RfOA) | IdentityServer4系列 | 快速搭建简易项目
源码：[https://github.com/i3yuan/Yuan.IdentityServer4.Demo](https://github.com/i3yuan/Yuan.IdentityServer4.Demo)
