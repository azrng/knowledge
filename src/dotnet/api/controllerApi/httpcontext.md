---
title: HttpContext
lang: zh-CN
date: 2023-10-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: httpcontext
slug: iiazx2
docsId: '29808586'
---

## 概述
HttpContext 封装了有关个别 HTTP 请求和响应的所有信息。 收到 HTTP 请求时，HttpContext 实例会进行初始化。

## 注意事项
HttpContext 不是线程安全型。 在处理请求之外读取或写入 HttpContext 的属性可能会导致 NullReferenceException

文档：[https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/http-context?view=aspnetcore-7.0#httpcontext-access-from-a-background-thread](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/http-context?view=aspnetcore-7.0#httpcontext-access-from-a-background-thread)

## 常用操作
```csharp
//获取请求ip
_contextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();

//获取请求头部
var header = HttpContext.Request.Headers.FirstOrDefault(t => t.Key == "testHeader").Value.ToString();

//获取请求ip
private string GetIP()
{
    var clientIpAddress = _httpContextAccessor.HttpContext.Request.Headers["X-Real-IP"].FirstOrDefault();
    if (string.IsNullOrEmpty(clientIpAddress))
    {
        clientIpAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
    }
    return clientIpAddress;
}
```

## 操作

### 获取HttpContext的方法

#### ControllerBase派生类
在 ControllerBase 派生类中，我们可以直接通过 HttpContext 属性获取 HttpContext 对象。
```csharp
public class HomeController : Controller
{
    public IActionResult Index()
    {
        // 在这里HttpContext 是 Controller/ControllerBase 对象的属性
        var httpContext = HttpContext;

        return View();
    }
}
```

#### 其他方法
在低版本中在Startup的ConfigureServices方法直接注入
```csharp
 services.AddHttpContextAccessor();
```
或者在.Net6以及高版本中在Program中注入配置
```csharp
builder.Services.AddHttpContextAccessor();
```

然后就可以通过构造函数注入的方式获取该配置
```csharp
private readonly IHttpContextAccessor _httpContext;

public UserController(IHttpContextAccessor httpContext)
{
	_httpContext = httpContext;
}

[HttpGet]
public async Task<ActionResult<string>> Get()
{
	var requestIp= _httpContext.HttpContext.Connection.RemoteIpAddress.ToString();
	return "成功";
}
```

也可以将`IHttpContextAccessor` 注入到静态类中，后续就可以直接通过静态类去访问
```csharp
public static class HttpHelper
{
     private static IHttpContextAccessor _accessor;
     public static void Configure(IHttpContextAccessor httpContextAccessor)
     {
          _accessor = httpContextAccessor;
     }

     public static HttpContext HttpContext => _accessor.HttpContext;
}
```
例如在ConfigureServices注入
```csharp
 services.AddHttpContextAccessor();
```
然后再Configure中赋值
```csharp
HttpHelper.Configure(app.ApplicationServices.GetRequiredService<IHttpContextAccessor>());
```
在需要的地方使用
```csharp
[HttpGet]
public async Task<ActionResult<string>> Get()
{
	var requestIp= HttpHelper.HttpContext.Connection.RemoteIpAddress.ToString();
	return "success";
}
```

### 获取客户端IP

#### 客户端直接访问服务器
直接通过HttpContext.Connection.RemoteIpAddress获取客户端Ip
![image.png](/common/1691289353140-7fc5da1d-304e-4ebe-81a2-1b8a77aca99f.png)
```csharp
[HttpGet]
[Route("GetClientIP")]
public async Task<IActionResult> GetClientIP()
{
	var ipv4 = HttpContext.Connection.RemoteIpAddress.MapToIPv4();
    // ipv6
    // var ipv6 = HttpContext.Connection.RemoteIpAddress?.MapToIPv6()?.ToString();
	return Ok(ipv4.ToString());
}
```

#### 客户端通过nginx访问服务器
![image.png](/common/1691289353203-ba094c04-d18a-4510-8ccc-b522b1dbc9f9.png)
直接通过HttpContext.Connection.RemoteIpAddress获取客户端Ip,就会是nginx的ip,需要通过Headers["X-Forwarded-For"]判断
```csharp
[HttpGet]
[Route("GetClientIP")]
public async Task<IActionResult> GetClientIP()
{
    var ip4 = this.Request.Headers["X-Forwarded-For"].FirstOrDefault();
	if(string.IsNullOrEmpty(ip4))
	{
		this.Request.Headers["X-Forwarded-Proto"].FirstOrDefault();
	}
	if(string.IsNullOrEmpty(ip4))
	{
		ip4 = HttpContext.Connection.RemoteIpAddress.MapToIPv4();
	}
	return Ok(ip4.ToString());
}
```
nginx的配置
/etc/nginx/conf.d/xx.conf
```perl
server {
    listen        80;
    server_name   example.com *.example.com;
    location / {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection keep-alive;
        proxy_set_header   Host $http_host; #此处官方文档使用的$host缺少端口号
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

#### Microsoft.AspNetCore.HttpOverrides 中间件
Microsoft.AspNetCore.HttpOverrides 中间件主要用于处理反向代理服务器和负载均衡器等情况下的 HTTP 请求。以下是一些使用场景：

1. 反向代理服务器：当你的应用程序位于反向代理服务器（如 Nginx、Apache 或 IIS）之后时，反向代理服务器会接收客户端请求，并将请求转发给应用程序。在这种情况下，反向代理服务器可能会修改请求头部，包括客户端 IP 地址和协议信息。通过启用 HttpOverrides 中间件并配置适当的选项，你可以获得客户端的真实 IP 地址和协议信息。
2. 负载均衡器：如果你的应用程序在负载均衡器的后面运行，负载均衡器可能会传递客户端请求给多个实例。为了获取准确的客户端 IP 地址，你可以使用 HttpOverrides 中间件来识别 X-Forwarded-For 头部字段，并更新 HttpContext.Connection.RemoteIpAddress 属性。
3. SSL/TLS 终止器：当 SSL/TLS 终止器（如负载均衡器或反向代理服务器）接收到加密的 HTTPS 请求并解密后，它会将请求转发给应用程序时，应用程序可能无法正确获取请求的协议信息。通过配置 HttpOverrides 中间件，你可以更新 HttpContext.Request.Protocol 属性，以便应用程序知道请求是通过 HTTPS 还是 HTTP 发送的。

以下是使用 Microsoft.AspNetCore.HttpOverrides 中间件的示例代码：
首先，确保在启动类的 ConfigureServices 方法中添加以下代码以启用 HttpOverrides 服务：
```cpp
using Microsoft.AspNetCore.HttpOverrides;

public void ConfigureServices(IServiceCollection services)
{
    // 其他配置项...

    services.Configure<ForwardedHeadersOptions>(options =>
    {
        // 配置要处理的转发头部
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        // 配置受信任的代理服务器 IP 地址或 IP 范围
        options.KnownProxies.Add(IPAddress.Parse("127.0.0.1"));
        // 配置是否要使用逗号分隔的多个 IP 地址作为客户端 IP 地址
        options.ForwardedForHeaderName = "X-Forwarded-For";
        // 配置代理服务器发送的原始协议头部字段
        options.ForwardedProtoHeaderName = "X-Forwarded-Proto";
    });
    // 其他服务配置...
}
```
接下来，在 Configure 方法中将 HttpOverrides 中间件添加到请求处理管道中：
```cpp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // 其他中间件配置...
    app.UseForwardedHeaders();
    // 其他中间件配置...
}
```
配置完成后，HttpOverrides 中间件将根据设置处理传入的转发头部，并更新 HttpContext.Connection.RemoteIpAddress 和 HttpContext.Request.Protocol 属性。这样，你就可以通过 HttpContext 获取客户端的真实 IP 地址和使用的协议信息。

[.NET 中的 ForwardedHeaders](https://mp.weixin.qq.com/s/mAxiAUyrzzHI-3nFeOrRcA)

### 获取浏览器信息
可以使用该仓库（[https://github.com/kshyju/BrowserDetector](https://github.com/kshyju/BrowserDetector)）的包Shyjus.BrowserDetector
```csharp
public class HomeController : Controller
{
    private readonly IBrowserDetector browserDetector;
    public HomeController(IBrowserDetector browserDetector)
    {
        this.browserDetector = browserDetector;
    }
    public IActionResult Index()
    {
        var browser = this.browserDetector.Browser;
        // Use browser object as needed.

        return View();
    }
}
```

### 获取请求头

StringValues 简介https://andrewlock.net/a-brief-look-at-stringvalues/

## 参考文档

[https://mp.weixin.qq.com/s/Yn3QE2Y8gZPCaFf40KSXDg](https://mp.weixin.qq.com/s/Yn3QE2Y8gZPCaFf40KSXDg)：NET问答: 如何在 `ASP.NET Core`中访问 HttpContext ?
[https://www.cnblogs.com/lgxlsm/p/17523778.html](https://www.cnblogs.com/lgxlsm/p/17523778.html) | asp.net core如何获取客户端IP地址 - 广州大雄 - 博客园

