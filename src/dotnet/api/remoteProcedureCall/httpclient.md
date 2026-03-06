---
title: HttpClient说明
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - httpClient
---

## 概述
HttpClient是用户进行HTTP请求的，不过在我释放HttpClient对象时候，基础套接字不会立即释放，所以可能导致套接字耗尽，最终导致SocketException错误，所以**推荐使用HttpClientFactory**。

## 底层方法
HttpClient底层调用是
```csharp
_handler.SendAsync(request, cancellationToken)
```
而handler正是我们通过HttpClient传递下来的HttpMessageHandler。由此可知，HttpClient的本质是HttpMessageHandler的包装类。

## 操作
新建dotNet5 WebAPI程序，准备使用HttpClient请求进行请求

### 基本配置
ConfigureServices中添加配置注册服务
```csharp
services.AddHttpClient();
```
依赖注入IHttpClientFactory到控制器中使用
```csharp
private readonly IHttpClientFactory _httpClientFactory;

public CommonController(IHttpClientFactory httpClientFactory)
{
    _httpClientFactory = httpClientFactory;
}

[HttpGet]
public async Task<string> GetAsync()
{
    var _client = _httpClientFactory.CreateClient();
    var response = await _client.GetAsync("https://tianqiapi.com/api?version=v6&appid=123456&appsecret=55123&city=郑州");
    if (response.StatusCode == System.Net.HttpStatusCode.OK)
    {
        return await response.Content.ReadAsStringAsync();
    }
    else
    {
        return "error";
    }
}
```

### 请求头设置
设置内容头
```csharp
var httpClient = new HttpClient();

httpClient.DefaultRequestHeaders.Add("Origin", "https://www.xxx.com");
httpClient.DefaultRequestHeaders.Add("Host", "xxxxx");

httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/fhir+json"));
```
参考：[https://blog.csdn.net/csdnnews/article/details/109040280](https://blog.csdn.net/csdnnews/article/details/109040280)

### 响应头

讲述获取响应头的方法

```c#
var response = await httpClient.GetAsync(videoFirst.BaseUrl);

// 如果你获取的响应头信息不完整，可能是因为默认情况下 HttpClient 只会返回一部分常见的响应头字段。
foreach (var header in response.Headers)
{
    Console.WriteLine($"key:{header.Key} value：{header.Value}");
}

// 要获取完整的响应头信息，可以使用 HttpResponseMessage.Headers.TryGetValues 方法。
if (response.Content.Headers.TryGetValues("Content-Range", out var contentTypes))
{
    foreach (var contentType in contentTypes)
    {
        Console.WriteLine($"Content-Range: {contentType}");
    }
}
```

### 命名模式

个人感觉适用于：比如当前项目调用订单服务的许多接口，那么可以对这些接口统一进行配置(比如设置一些固定请求头，等请求参数)，然后使用该命名去调用。不同命名的Client之间是相互独立的。
ConfigureServices中添加配置注册服务
```csharp
services.AddHttpClient("NameMode", client =>
{
    //设置服务url
    client.BaseAddress = new Uri("https://tianqiapi.com");
    //自定义配置
    client.DefaultRequestHeaders.Add("Type", "1");
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "token");
}).SetHandlerLifetime(TimeSpan.FromMinutes(2));//默认dns刷新时间为2分钟
```
依赖注入到控制器中使用
```csharp
private readonly IHttpClientFactory _httpClientFactory;

public NameController(IHttpClientFactory httpClientFactory)
{
    _httpClientFactory = httpClientFactory;
}

[HttpGet]
public async Task<string> GetAsync()
{
    var _client = _httpClientFactory.CreateClient("NameMode");
    var response = await _client.GetAsync("/api?version=v6&appid=123456&appsecret=123&city=郑州");
    if (response.StatusCode == System.Net.HttpStatusCode.OK)
    {
        return await response.Content.ReadAsStringAsync();
    }
    else
    {
        return "error";
    }
}
```
请求头中已经添加了指定配置

![image.png](/common/1635605991421-e45c7e7c-3483-4585-8782-a050aa13d72f.png)

### 类型模式
类型模式原理和命名模式是一样的，只是通过指定的类型名称作为对应HttpClient的名称，减少了单独定义名称的步骤
定义业务处理类
```csharp
public class WeatherClientService
{
    private readonly HttpClient _httpClient;
    //不能注入IHttpClientFactory，当前HttpClient会从HttpClientFactory中获取，
    //并且HttpClient名称为WeatherClientService
    public WeatherClientService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> TestTypeClientGet(string url)
    {
        var response= await _httpClient.GetAsync(url);
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            return "error";
        }
    }
}
```
ConfigureServices中添加配置注册服务
```csharp
services.AddHttpClient<WeatherClientService>(client =>
{
    //设置服务url
    client.BaseAddress = new Uri("https://tianqiapi.com");
    //自定义配置
    client.DefaultRequestHeaders.Add("Type", "1");
});
```
依赖注入到控制器中使用
```csharp
private readonly WeatherClientService _weatherClientService;

public TypeModeController(WeatherClientService weatherClientService)
{
    _weatherClientService = weatherClientService;
}

[HttpGet]
public async Task<string> GetAsync()
{
    return await _weatherClientService.TestTypeClientGet("/api?version=v6&appid=123456&appsecret=123&city=郑州");
}
```
WeatherClientService我们没有写注入但是可以直接注入是因为在AddHttpClient时候已经帮我们将WeatherClientService注入了

### 自定义管道逻辑

```csharp
// services.AddSingleton<LoggingHandler>(); // 原始代码
services.AddTransient<LoggingHandler>(); //修改后
services.AddHttpClient<IHttpHelper, HttpClientHelper>("default")
        .AddHttpMessageHandler<LoggingHandler>();
```

- DelegatingHandler 不应该被重用或缓存，因为每个 HTTP 请求都需要一个新的处理器实例
- 使用 Transient 生命周期确保每次请求都获得一个新的 DelegatingHandler实例，当注入为单例的时候会引发InnerHandler 被重用的问题

所以当注入DelegatingHandler的实例时候应该注意下。

#### 重写SendAsync
先定义一个管道类(CustomDelegatingHandler)，继承DelegatingHandler，然后重写SendAsync方法
```csharp
public class CustomDelegatingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        //请求前处理
        var requestId = Guid.NewGuid().ToString();
        request.Headers.Add("requestId", requestId);

        Console.WriteLine($"请求参数 {requestId}");

        //内部发起的真实请求
        var res = await base.SendAsync(request, cancellationToken).ConfigureAwait(false);

        //得到响应的结果，可以进行自定义处理响应信息
        Console.WriteLine($"自定义管道处理响应，{res.StatusCode}");
        return res;
    }
}
```
注册服务,并且根据需要在HttpClient上加上自定义管道
```csharp
services.AddTransient<CustomDelegatingHandler>();
services.AddHttpClient("NameMode", client =>
{
    //设置服务url
    client.BaseAddress = new Uri("https://tianqiapi.com");
    //自定义配置
    client.DefaultRequestHeaders.Add("Type", "1");
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "token");
}).AddHttpMessageHandler(hander => hander.GetService<CustomDelegatingHandler>());
```
依赖注入到控制器中使用

```csharp
private readonly IHttpClientFactory _httpClientFactory;
public CustomerController(IHttpClientFactory httpClientFactory)
{
    _httpClientFactory = httpClientFactory;
}

[HttpGet]
public async Task<string> GetAsync()
{
   	using var _client = _httpClientFactory.CreateClient("NameMode");
    var response = await _client.GetAsync("/api?version=v6&appid=123456&appsecret=123&city=郑州");
    if (response.StatusCode == System.Net.HttpStatusCode.OK)
    {
        return await response.Content.ReadAsStringAsync();
    }
    else
    {
        return "error";
    }
}
}
```
运行结果展示
![image.png](/common/1635607127494-0ee82640-00a3-498e-ac59-da4150c70f06.png)
在类型模式的请求上增加了一个切面拦截，实现请求和响应后做业务处理。

#### 重新设置请求地址
目的：当你调用一个服务接口，这个服务接口是需要做一些处理才可以获取到的，那么就可以做一层拦截来获取请求地址
编写处理程序CustomerRequestUrlDelegatingHandler继承自DelegatingHandler，用来重新设置请求地址
```csharp
/// <summary>
/// 重写请求url  处理请求消息和返回消息
/// </summary>
public class CustomerRequestUrlDelegatingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var current = request.RequestUri;

        try
        {
            //组装真实的调用url
            request.RequestUri = new Uri($"{current.Scheme}://{LookupService()}{current.PathAndQuery}");
            //内部发起的真实请求
            return await base.SendAsync(request, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception)
        {
            throw;
        }
        finally
        {
            request.RequestUri = current;
        }
    }

    /// <summary>
    /// 通过方法获取一类服务统一的url地址
    /// </summary>
    /// <returns></returns>
    private string LookupService()
    {
        return "jsonplaceholder.typicode.com";
    }
}
```
注入配置修改为
```csharp
services.AddHttpClient("360service", c =>
{
    //服务注册的名称
    c.BaseAddress = new Uri("http://360service/");

}).AddHttpMessageHandler<CustomerRequestUrlDelegatingHandler>();
// 注册自定义的DelegatingHandler
services.AddTransient<CustomerRequestUrlDelegatingHandler>();
```
使用示例
```csharp
[Route("api/[controller]/[action]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public CustomerController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    /// <summary>
    /// 重写请求URL
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<string> OverrideRequestUrlAsync()
    {
        var client = _httpClientFactory.CreateClient("360service");
        var response = await client.GetAsync("posts");// 最后会重新设置该请求地址
        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return await response.Content.ReadAsStringAsync();
        }
        else
        {
            return "error";
        }
    }
}
```
参考资料：[https://www.cnblogs.com/wucy/p/12941322.html](https://www.cnblogs.com/wucy/p/12941322.html)

#### 请求日志输出
对于 Http 请求的日志，我们希望记录请求的Url、Http动词、请求时长等信息，而这一点，在一个大量接入第三方接口的系统或者是以 Http 驱动的微服务架构中，常常是不可或缺的一环，对于我们排查故障、监控服务非常有用。
```csharp
protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
{
    var correlationId = GetCorrelationId(request);
    using (_logger.BeginScope($"correlationId={correlationId}"))
    {
        var sw = Stopwatch.StartNew();

        _logger.LogInformation($"Start Processing HTTP Request {request.Method} {request.RequestUri} [Correlation: {correlationId}]");
        var response = base.Send(request, cancellationToken);
         _logger.LogInformation($"End Processing HTTP Request in {sw.ElapsedMilliseconds}ms {response.StatusCode}, [Correlation: {correlationId}]");

        return response;
    }
}

// GetCorrelationId
private string GetCorrelationId(HttpRequestMessage request)
{
    if (request.Headers.TryGetValues("X-Correlation-ID", out var values))
        return values.First();

    var correlationId = Guid.NewGuid().ToString();
    request.Headers.Add("X-Correlation-ID", correlationId);
    return correlationId;
}

```

#### 请求重试
考虑请求的故障恢复，通过引入polly，在实现SendAsync()方法的时候，通过Polly中的超时、重试等机制对其做一层包装：
```csharp
public class RetryableHttpMessageHandler : DelegatingHandler
{
    private readonly ILogger<RetryableHttpMessageHandler> _logger;
    private readonly IAsyncPolicy<HttpResponseMessage> _retryPolicy;
    public RetryableHttpMessageHandler(
        ILogger<RetryableHttpMessageHandler> logger
    )
    {
        _logger = logger;
        _retryPolicy = Policy<HttpResponseMessage>
            .Handle<HttpRequestException>()
            .Or<TimeoutException>()
            .OrResult(x => (int)x.StatusCode >= 400)
            .RetryAsync(3, (ret, index) =>
            {
                _logger.LogInformation($"调用接口异常：{ret.Exception?.Message}，状态码：{ret.Result.StatusCode}, 正在进行第{index}次重试");
            });
    }

    protected override Task<HttpResponseMessage> SendAsync(
      HttpRequestMessage request, 
      CancellationToken cancellationToken
    )
    {
        return _retryPolicy.ExecuteAsync(() => base.SendAsync(request, cancellationToken));
    }
}

```
同样地，我们这里通过HttpClient来请求指定的接口。因为，下面的接口实际上是不存在的。所以，理论上它会返回404这个状态码。而我们的重试策略是，在发生HttpRequestException或者TimeoutException异常以及 Http 响应的状态码大于 400 时，自动触发 3 次重试。
```csharp
var client = _clientFactory.CreateClient("ApiMock");
var response = await client.GetAsync("/api/fail");
```

#### 身份认证

在发送 HTTP 请求之前添加 `Authorization` 标头。

```c#
public class AuthenticationDelegatingHandler(IOptions<GitHubOptions> options)
    : DelegatingHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        request.Headers.Add("Authorization", options.Value.AccessToken);
        request.Headers.Add("User-Agent", options.Value.UserAgent);

        return base.SendAsync(request, cancellationToken);
    }
}
```

注入服务

```c#
builder.Services.AddTransient<AuthenticationDelegatingHandler>();

builder.Services.AddHttpClient<GitHubService>(httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.github.com");
})
.AddHttpMessageHandler<LoggingDelegatingHandler>()
.AddHttpMessageHandler<RetryDelegatingHandler>()
.AddHttpMessageHandler<AuthenticationDelegatingHandler>();
```

##### Basic认证

```csharp
string username = "your_username";
string password = "your_password";

HttpClient client = new HttpClient();
string authHeaderValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{username}:{password}"));
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);
```

##### JWT认证

```csharp
public static async Task<string> Jwt(string token, string url)
{
    using var client = new HttpClient(httpclientHandler);
    // 创建身份认证
    // System.Net.Http.Headers.AuthenticationHeaderValue;
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    var response = await client.GetAsync(url);
    return await response.Content.ReadAsStringAsync();
}
```

### 搭配Polly

有时候请求会出现网络波动导致请求异常，这个时候我们就需要再次尝试请求一次或者多次，这个时候我们就需要使用到Polly库。
引用组件

```csharp
<PackageReference Include="Microsoft.Extensions.Http.Polly" Version="5.0.1" />
```
注册服务
```csharp
services.AddSingleton<CustomDelegatingHandler>();

services.AddHttpClient<WeatherClientService>(client =>
{
    //设置服务url
    client.BaseAddress = new Uri("http://192.168.1.4:8012");
    //自定义配置
    client.DefaultRequestHeaders.Add("Type", "1");
    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", "token");
})
    .AddHttpMessageHandler(hander => hander.GetService<CustomDelegatingHandler>())
    .AddTransientHttpErrorPolicy(builder => builder.WaitAndRetryAsync(new[] {
        //为了测试效果时间弄稍微久一点
        TimeSpan.FromSeconds(1),
        TimeSpan.FromSeconds(5),
        TimeSpan.FromSeconds(10)
}));
```
依赖注入到控制器中使用
```csharp
private readonly WeatherClientService _weatherClientService;

public PollyController(WeatherClientService weatherClientService)
{
    _weatherClientService = weatherClientService;
}

[HttpGet]
public async Task<string> GetAsync()
{
    return await _weatherClientService.TestTypeClientGet("/api/Test/GetDateTime");
}
```
展示效果，先关闭服务，在请求一次，重试一次后，重新启动服务
![image.png](/common/1625323593371-e81fe980-f753-4f15-bd54-c543fff7bde3.png)



直接在中间层DelegatingHandler处理重试

```c#
public class RetryDelegatingHandler : DelegatingHandler
{
    private readonly AsyncRetryPolicy<HttpResponseMessage> _retryPolicy =
        Policy<HttpResponseMessage>
            .Handle<HttpRequestException>()
            .RetryAsync(2);

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var policyResult = await _retryPolicy.ExecuteAndCaptureAsync(
            () => base.SendAsync(request, cancellationToken));

        if (policyResult.Outcome == OutcomeType.Failure)
        {
            throw new HttpRequestException(
                "Something went wrong",
                policyResult.FinalException);
        }

        return policyResult.Result;
    }
}
```

注入服务

```c#
builder.Services.AddTransient<RetryDelegatingHandler>();

builder.Services.AddHttpClient<GitHubService>(httpClient =>
{
    httpClient.BaseAddress = new Uri("https://api.github.com");
})
.AddHttpMessageHandler<LoggingDelegatingHandler>()
.AddHttpMessageHandler<RetryDelegatingHandler>();
```

### 测试socket未释放

现在我去请求一个WebApi程序，请求代码如下：
```csharp
for (int i = 0; i < 15; i++)
{
    using var httpclient = new HttpClient();
    var result = await httpclient.GetAsync("http://xx.xx.xx.61:8001/api/xxx/xxx");
    System.Console.WriteLine("返回码" + result.StatusCode);
}
```
使用netstat查看是否存在Socket被占用
```csharp
netstat -ano | findstr TIME_WAIT
```
执行之前
![image.png](/common/1625242924090-22336f06-e45b-4e02-89b7-54eaccc1b2a5.png)
执行之后
![image.png](/common/1625242992263-d6e0fced-eb12-4168-86ef-caafaa1696b2.png)
经过一会后再次执行这些会断开,所以应该使用IHttpClientFactory来创建HttpClient。

### HttpClientHandler

#### 禁用重定向
输出重定向前的结果
```csharp
using var httpClient = new HttpClient(new HttpClientHandler()
{
    AllowAutoRedirect = false
})
{
    BaseAddress = new Uri(BaseUrl)
};
using var res1 = await httpClient.GetAsync(articlePath[0].TrimStart('/'));
Console.WriteLine(res1.RequestMessage.RequestUri.ToString());
Console.WriteLine(res1.StatusCode);
```

### 证书

#### 忽略证书的问题
无论证书是否有问题都可以请求成功
```csharp
var handler = new HttpClientHandler
{
    ServerCertificateCustomValidationCallback = delegate { return true; }
};

var httpclient = new HttpClient(handler);
```

在Asp.NetCore中我们可以这么写
```csharp
builder.Services.AddHttpClient(string.Empty)
    // 忽略 SSL 不安全检查，或 https 不安全或 https 证书有误
    .ConfigurePrimaryHttpMessageHandler(u => new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = (_, _, _, _) => true,
    });
```

甚至还可以忽略所有的请求证书
```csharp
ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, errors) =>
{
    return true;
};
```

#### 证书有效期判断
ServerCertificateCustomValidationCallback 这个 Func 就是让客户端进行服务端证书检验的一个回调，可以添加很多自定义的逻辑进去。
下面是它的定义：
```csharp
public Func<HttpRequestMessage, X509Certificate2?, X509Chain?, SslPolicyErrors, bool>? ServerCertificateCustomValidationCallback { get; set; }
```
我们就可以通过 X509Certificate2 来进行服务端证书过期时间的判断了。
```csharp
static bool ValidateCertificate(object sender, X509Certificate? certificate, X509Chain? chain, SslPolicyErrors sslPolicyErrors)
{
    if (certificate == null) return true;

    var expirationDate = DateTime.Parse(certificate.GetExpirationDateString(), CultureInfo.InvariantCulture);
    
    // 提前 x 天预警，正常是提前一个月
    if (expirationDate - DateTime.Today < TimeSpan.FromDays(30))
    {
        throw new NeedRenewException("It's time to renew the certificate!");
    }
    
    if (sslPolicyErrors == SslPolicyErrors.None)
    {
        return true;
    }
    else
    {
        throw new CertPolicyException($"Cert policy errors: {sslPolicyErrors.ToString()}");
    }
}
```
最后把上面的 ValidateCertificate 加到 HttpClientHandler 里面即可。
```csharp
static async Task HttpClientSSLCheck(string domain)
{
    HttpClientHandler clientHandler = new()
    {
        ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) 
                => ValidateCertificate(sender, cert, chain, sslPolicyErrors)
    };

    try
    {
        using CancellationTokenSource cts = new(3000);
        using HttpClient client = new(clientHandler);
        await client.GetAsync($"https://{domain}", cts.Token);

        Console.WriteLine($"{domain} is OK {nameof(HttpClientSSLCheck)}");
    }
    catch (TaskCanceledException)
    {
        Console.WriteLine("canceled");
    }
    catch (Exception e)
    {
        // 集成企微、钉钉或其他类型的通知
        if (e.InnerException is CertPolicyException)
        {
            Console.WriteLine($"{domain} | ex = {e.InnerException.Message}");
        }
        else if (e.InnerException is NeedRenewException)
        {
            Console.WriteLine($"{domain} | need to renew !!");
        }
        else
        {
            Console.WriteLine($"{domain} | ex = {e.Message}");
        }
    }
}
```
最后就是调用
```csharp
await HttpClientSSLCheck("github.com");
```

[https://mp.weixin.qq.com/s/DbNHgR_ok0FLdqT-UXqEVA](https://mp.weixin.qq.com/s/DbNHgR_ok0FLdqT-UXqEVA) | C## HTTPS证书的过期时间检测

### 代理
```csharp
var Address = "";//地址
var Account = "";//用户名
var Password = "";//密码
var webProxy = new WebProxy(Address, false);
webProxy.BypassProxyOnLocal = true;

//2.如果有用户名和密码需要以下设置
ICredentials jxCredt = new NetworkCredential(Account, Password);
webProxy.Credentials = jxCredt;


//全局设置
HttpClient.DefaultProxy = webProxy;

//对某一个请求设置
var proxyHttpClientHandler = new HttpClientHandler
{
    Proxy = webProxy,
    UseProxy = true
};
HttpClient httpClient = new HttpClient(proxyHttpClientHandler);
```

### 开启HTTP2
HttpClient默认使用HTTP/1.1，在3.0之后可以启用http/2。

直接设置
```csharp
var client = new HttpClient();
client.DefaultRequestVersion = HttpVersion.Version20;
client.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
```
全局设置
```csharp
builder.Services.AddHttpClient("h2multiconnnections", httpclient =>
{
    httpclient.DefaultRequestVersion = HttpVersion.Version20;
    httpclient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
})
```
如果您使用Send或SendAsync方法，您必须在其中传递HttpRequestMessage的实例，则需要在 HttpRequestMessage 实例上设置Version和VersionPolicy属性。
```csharp
var request = new HttpRequestMessage(HttpMethod.Post, url);
request.Version = HttpVersion.Version20;
request.VersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
var response = await _client.SendAsync(request);
```

### 多连接
在 .NET 5.0 和 .NET 6.0 中，HttpClient 默认配置为仅打开 1 个到 HTTP/2 服务器的连接。另外，最大并发流数的推荐值为100。
在某些情况下，出于性能原因，如果您在短时间内发送数千个请求，则可能需要与服务器建立 1 个以上的连接。出于这个原因，在 .NET 5.0 中，Microsoft在SocketsHttpHandler类上引入了EnableMultipleHttp2Connections属性，使开发人员能够根据需要更改默认行为。
```csharp
builder.Services.AddHttpClient("h2multiconnnections", httpclient =>
{
    httpclient.DefaultRequestVersion = HttpVersion.Version20;
    httpclient.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionOrLower;
})
.ConfigurePrimaryHttpMessageHandler(() =>
  new SocketsHttpHandler
  {
      EnableMultipleHttp2Connections = true
  });
```

### 调用WebService
通过HTTP的方式去调用webservice接口
```csharp
                var message = $"{{\"mobile\":\"{textBox2.Text}\",\"text\":\"{textBox3.Text}\",\"msgSource\":\"森亿-360视图\",\"isHaveOrgName\":\"0\"}}";
                string requestContent = $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/""
    xmlns:web=""http://webservice.xawellcare.com/"">
    <soapenv:Header/>
    <soapenv:Body>
        <web:pushSmsByTextMsg>
            <param>{message}</param>
        </web:pushSmsByTextMsg>
    </soapenv:Body>
</soapenv:Envelope>
                ";

                var authHeaderValue = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{textBox5.Text}:{textBox6.Text}"));

                // 创建 HttpClient 对象
                using var client = new HttpClient();
                // 创建 HttpRequestMessage 对象
                var request = new HttpRequestMessage(HttpMethod.Post, textBox1.Text)
                {
                    Content = new StringContent(requestContent, Encoding.UTF8, "text/xml"),
                };
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);

                // 发送请求并获取响应
                var response = await client.SendAsync(request);

                // 读取响应内容
                var responseContent = await response.Content.ReadAsStringAsync();

                //var responseContent = @"<?xml version=""1.0"" encoding=""UTF-8""?>
                //<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/""><soapenv:Header xmlns:web=""http://webservice.xawellcare.com/""/><soap:Body xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/""><ns2:pushSmsByTextMsgResponse xmlns:ns2=""http://webservice.xawellcare.com/""><return>{data=null, errorMessage=, status=200, desc=请求成功}</return></ns2:pushSmsByTextMsgResponse></soap:Body></soapenv:Envelope>";

                // 解析 XML 响应数据
                var xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(responseContent);

                var returnNode = xmlDoc.SelectSingleNode("//return");
```

### 文件下载

#### 异步下载

```csharp
var url = "https://www.coderbusy.com";
var save = @"D:\1.html";
var http = new HttpClient();
var response = await http.GetAsync(url);
response.EnsureSuccessStatusCode();
using (var fs = File.Open(save, FileMode.Create))
{
    using (var ms = response.Content.ReadAsStream())
    {
        await ms.CopyToAsync(fs);
    }
}
```

设置自定义请求头

```csharp
var url = "https://www.coderbusy.com";
var save = @"D:\1.html";
var http = new HttpClient();
var request = new HttpRequestMessage(HttpMethod.Get, url);
//增加 Auth 请求头
request.Headers.Add("Auth", "123456");
var response = await http.SendAsync(request);
response.EnsureSuccessStatusCode();
using (var fs = File.Open(save, FileMode.Create))
{
    using (var ms = response.Content.ReadAsStream())
    {
        await ms.CopyToAsync(fs);
    }
}
```

#### 多线程下载

在网络带宽充足的情况下，单线程下载的效率并不理想。我们需要多线程和断点续传才可以拿到更好的下载速度。
Downloader 是一个现代化的、流畅的、异步的、可测试的和可移植的 .NET 库。这是一个包含异步进度事件的多线程下载程序。Downloader 与 .NET Standard 2.0 及以上版本兼容，可以在 Windows、Linux 和 macOS 上运行。

```csharp
<PackageReference Include="Downloader" Version="2.3.2" />
```

> GitHub 开源地址：https://github.com/bezzad/Downloader
> NuGet 地址：https://www.nuget.org/packages/Downloader

下载配置

```csharp
var downloadOpt = new DownloadConfiguration()
{
    BufferBlockSize = 10240, // 通常，主机最大支持8000字节，默认值为8000。
    ChunkCount = 8, // 要下载的文件分片数量，默认值为1
    MaximumBytesPerSecond = 1024 * 1024, // 下载速度限制为1MB/s，默认值为零或无限制
    MaxTryAgainOnFailover = int.MaxValue, // 失败的最大次数
    OnTheFlyDownload = false, // 是否在内存中进行缓存？默认值是true
    ParallelDownload = true, // 下载文件是否为并行的。默认值为false
    TempDirectory = "C:\\temp", // 设置用于缓冲大块文件的临时路径，默认路径为Path.GetTempPath()。
    Timeout = 1000, // 每个 stream reader  的超时（毫秒），默认值是1000
    RequestConfiguration = // 定制请求头文件
    {
        Accept = "*/*",
        AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
        CookieContainer =  new CookieContainer(), // Add your cookies
        Headers = new WebHeaderCollection(), // Add your custom headers
        KeepAlive = false,
        ProtocolVersion = HttpVersion.Version11, // Default value is HTTP 1.1
        UseDefaultCredentials = false,
        UserAgent = $"DownloaderSample/{Assembly.GetExecutingAssembly().GetName().Version.ToString(3)}"
    }
};
```

创建一个下载服务

```csharp
var downloader = new DownloadService(downloadOpt);
```

配置事件处理器（该步骤可以省略）：

```csharp
 Provide `FileName` and `TotalBytesToReceive` at the start of each downloads
// 在每次下载开始时提供 "文件名 "和 "要接收的总字节数"。
downloader.DownloadStarted += OnDownloadStarted;

// Provide any information about chunker downloads, like progress percentage per chunk, speed, total received bytes and received bytes array to live streaming.
// 提供有关分块下载的信息，如每个分块的进度百分比、速度、收到的总字节数和收到的字节数组，以实现实时流。
downloader.ChunkDownloadProgressChanged += OnChunkDownloadProgressChanged;

// Provide any information about download progress, like progress percentage of sum of chunks, total speed, average speed, total received bytes and received bytes array to live streaming.
// 提供任何关于下载进度的信息，如进度百分比的块数总和、总速度、平均速度、总接收字节数和接收字节数组的实时流。
downloader.DownloadProgressChanged += OnDownloadProgressChanged;

// Download completed event that can include occurred errors or cancelled or download completed successfully.
// 下载完成的事件，可以包括发生错误或被取消或下载成功。
downloader.DownloadFileCompleted += OnDownloadFileCompleted;
```

下载文件

```csharp
string file = @"D:\1.html";
string url = @"https://www.coderbusy.com";
await downloader.DownloadFileTaskAsync(url, file);
```

#### 下载非HTTP协议文件

除了 WebClient 可以下载 FTP 协议的文件之外，上文所示的其他方法只能下载 HTTP 协议的文件。
aria2 是一个轻量级的多协议和多源命令行下载工具。它支持 HTTP/HTTPS、FTP、SFTP、BitTorrent 和 Metalink。aria2 可以通过内置的 JSON-RPC 和 XML-RPC 接口进行操作。
我们可以调用 aria2 实现文件下载功能。

> GitHub 地址：https://github.com/aria2/aria2
> 下载地址：https://github.com/aria2/aria2/releases

将下载好的 aria2c.exe 复制到应用程序目录，如果是其他系统则可以下载对应的二进制文件。

```csharp
public static async Task Download(string url, string fn)
{
    var exe = "aria2c";
    var dir = Path.GetDirectoryName(fn);
    var name = Path.GetFileName(fn);


    void Output(object sender, DataReceivedEventArgs args)
    {
        if (string.IsNullOrWhiteSpace(args.Data))
        {
            return;
        }
        Console.WriteLine("Aria:{0}", args.Data?.Trim());
    }

    var args = $"-x 8 -s 8 --dir={dir} --out={name} {url}";
    var info = new ProcessStartInfo(exe, args)
    {
        UseShellExecute = false,
        CreateNoWindow = true,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
    };
    if (File.Exists(fn))
    {
        File.Delete(fn);
    }

    Console.WriteLine("启动 aria2c：{0}", args);
    using (var p = new Process { StartInfo = info, EnableRaisingEvents = true })
    {
        if (!p.Start())
        {
            throw new Exception("aria 启动失败");
        }
        p.ErrorDataReceived += Output;
        p.OutputDataReceived += Output;
        p.BeginOutputReadLine();
        p.BeginErrorReadLine();
        await p.WaitForExitAsync();
        p.OutputDataReceived -= Output;
        p.ErrorDataReceived -= Output;
    }

    var fi = new FileInfo(fn);
    if (!fi.Exists || fi.Length == 0)
    {
        throw new FileNotFoundException("文件下载失败", fn);
    }
}
```

以上代码通过命令行参数启动了一个新的 aria2c 下载进程，并对下载进度信息输出在了控制台。调用方式如下：

```csharp
var url = "https://www.coderbusy.com";
var save = @"D:\1.html";
await Download(url, save);
```

#### 文件打包下载

将指定目录的文件内容进行打包下载

```csharp
public (string fileType, byte[] archiveData, string archiveName) DownloadFiles(string subDirectory)
{
    var zipName = $"archive-{DateTime.Now:yyyy_MM_dd-HH_mm_ss}.zip";

    var files = Directory.GetFiles(Path.Combine(_webHostEnvironment.ContentRootPath, subDirectory)).ToList();

    // 下载压缩包
    using var memoryStream = new MemoryStream();
    using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
    {
        files.ForEach(file =>
        {
            var theFile = archive.CreateEntry(Path.GetFileName(file));
            using var binaryWriter = new BinaryWriter(theFile.Open());
            binaryWriter.Write(File.ReadAllBytes(file));
        });
    }

    return ("application/zip", memoryStream.ToArray(), zipName);
}
```

控制器代码

```csharp
[HttpGet("Download")]
public IActionResult Download([Required] string subDirectory)
{
    var (fileType, archiveData, archiveName) = _fileService.DownloadFiles(subDirectory);
    return File(archiveData, fileType, archiveName);
}
```

### 网页响应压缩

服务端的主要工作就是根据Content-Encoding头信息判断采用哪种方式压缩并返回。有压缩就有解压，而解压的工作就是在请求客户端处理的。比如浏览器，这是我们最常用的Http客户端，许多浏览器都是默认在我们发出请求的时候(比如我们浏览网页的时候)在Request Head中添加Content-Encoding，然后根据响应信息处理相关解压。这些都源于浏览器已经内置了关于请求压缩和解压的机制。类似的还有许多，比如常用的代理抓包工具Filder也是内置这种机制的。只不过需要手动去处理，但实现方式都是一样的。

#### HttpClient

```csharp
//自定义HttpClientHandler实例
HttpClientHandler httpClientHandler = new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip
};
//使用传递自定义HttpClientHandler实例的构造函数
using (HttpClient client = new HttpClient(httpClientHandler))
{
    var response = await client.GetAsync($"http://MyDemo/Home/GetPerson?userId={userId}");
}
```

DecompressionMethods的枚举源码

```csharp
[Flags]
public enum DecompressionMethods
{
    // 使用所有压缩解压缩算法。
    All = -1,
    // 不使用解压
    None = 0x0,
    // 使用gzip解压算法
    GZip = 0x1,
    // 使用deflate解压算法
    Deflate = 0x2,
    // 使用Brotli解压算法
    Brotli = 0x4
}
```

该枚举默认都是针对常用输出解压算法

#### HttpClientFactory

HttpClientFactory的大致工作方式默认PrimaryHandler传递的就是HttpClientHandler实例，而且在我们注册HttpClientFactory的时候是可以通过ConfigurePrimaryHttpMessageHandler自定义PrimaryHandler的默认值，接下来我们具体代码实现

```csharp
services.AddHttpClient("mydemo", c =>
{
    c.BaseAddress = new Uri("http://MyDemo/");
}).ConfigurePrimaryHttpMessageHandler(provider=> new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip
});
```

其实在注册HttpClientFactory的时候还可以使用自定义的HttpClient，具体的使用方式是这样的

```csharp
services.AddHttpClient("mydemo", c =>
{
    c.BaseAddress = new Uri("http://MyDemo/");
}).ConfigureHttpClient(provider => new HttpClient(new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip
}));
```

HttpClient确实帮我们做了好多事情，只需要简单的配置一下就开启了针对响应压缩的处理。

[https://mp.weixin.qq.com/s/64QO0R8qxRfYOgsOwav5hw](https://mp.weixin.qq.com/s/64QO0R8qxRfYOgsOwav5hw) | .Net Core HttpClient处理响应压缩

### 爬虫写法
一个爬虫的httpclient请求写法
```csharp

/// <summary>
/// 下载网页内容，并将其他编码转换为 UTF-8 编码
/// 记得看后面的优化说明
/// </summary>
static async Task<string> GetWebHtml(string url)
{
    // 使用 HttpClient 下载网页内容

    var handler = new HttpClientHandler();
    // 忽略证书错误
    handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
    handler.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate | DecompressionMethods.Brotli;
    var client = new HttpClient(handler);
    // 设置请求头
    client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36");
    client.DefaultRequestHeaders.Add("Accept", "*/*");
    // 加上后不处理解压缩会乱码
    client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
    client.DefaultRequestHeaders.Add("Accept-Language", "zh-CN,zh;q=0.9");
    client.DefaultRequestHeaders.Add("Connection", "keep-alive");
    var response = await client.GetAsync(url);
    var bytes = await response.Content.ReadAsByteArrayAsync();

    // 获取网页编码 ContentType 可能为空，从网页获取
    var charset = response.Content.Headers.ContentType?.CharSet;
    if (string.IsNullOrEmpty(charset))
    {
        // 从网页获取编码信息
        var htmldoc = Encoding.UTF8.GetString(bytes);
        var match = Regex.Match(htmldoc, "<meta.*?charset=\"?(?<charset>.*?)\".*?>", RegexOptions.IgnoreCase);
        if (match.Success) charset = match.Groups["charset"].Value;
        else charset = "utf-8";
    }

    Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
    Encoding encoding;

    switch (charset.ToLower())
    {
        case "gbk":
            encoding = Encoding.GetEncoding("GBK");
            break;
        case "gb2312":
            encoding = Encoding.GetEncoding("GB2312");
            break;
        case "iso-8859-1":
            encoding = Encoding.GetEncoding("ISO-8859-1");
            break;
        case "ascii":
            encoding = Encoding.ASCII;
            break;
        case "unicode":
            encoding = Encoding.Unicode;
            break;
        case "utf-32":
            encoding = Encoding.UTF32;
            break;
        default:
            return Encoding.UTF8.GetString(bytes);
    }

    // 统一转换为 UTF-8 编码
    var html = Encoding.UTF8.GetString(Encoding.Convert(encoding, Encoding.UTF8, bytes));
    return html;
}
```

## 常用处理方法

### 获取网络图片字节数组
```csharp
private static async Task<byte[]> DownloadImageAsync(string url)
{
    // 绕过https证书
    var httpClientHandler = new HttpClientHandler();
    httpClientHandler.ServerCertificateCustomValidationCallback = (message, cert, chain, error) => true;

    //注意这里生成的只读流无法使用Length属性
    HttpClient client = new HttpClient(httpClientHandler);
    client.BaseAddress = new Uri(url);
    using var file = await client.GetStreamAsync(url).ConfigureAwait(false);

    using var memoryStream = new MemoryStream();
    await file.CopyToAsync(memoryStream);
    return memoryStream.ToArray();
}
```

## 资料
> [https://mp.weixin.qq.com/s/sBWUGOLeE4EjkKljZg1zuQ](https://mp.weixin.qq.com/s/sBWUGOLeE4EjkKljZg1zuQ) | HttpClientFactory的套路，你知多少？
> 本文参考自：[https://mp.weixin.qq.com/s/i8kFdEpQ4-go5DrJFcJDJg](https://mp.weixin.qq.com/s/i8kFdEpQ4-go5DrJFcJDJg)
> [https://mp.weixin.qq.com/s/DYJ2NfVkCfW-RmEsH2gC_A](https://mp.weixin.qq.com/s/DYJ2NfVkCfW-RmEsH2gC_A) | .NET 平台Http消息处理者工厂

