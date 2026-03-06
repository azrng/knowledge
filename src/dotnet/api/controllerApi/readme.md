---
title: 说明
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiyukongzhiqideapi
slug: gcthrq
docsId: '30621891'
---

## 概述
在 ASP.NET Core 应用中，一个 WebAPI 控制器需遵循以下约定：

- 控制器类必须继承 ControllerBase 或间接继承
- 动作方法必须贴有 [HttpMethod] 特性，如：[HttpGet]
- 控制器或动作方法至少有一个配置 [Route] 特性
- 生成 WebAPI 路由地址时会自动去掉控制器名称 Controller 后缀
- [ApiController]这个特训个是应用于Controller，它其实并不是强制的，但是他提供了一些帮助，使得WebApi的开发更好。
   - 要求适用属性路由，也就是不能通过strartup的configure方法统一配置路由模板。
   - 自动http 400响应。也就是action方法传入的model含有验证错误的时候，会自动出发http 400响应。
   - 推断参数的绑定源。它将推断出acrion方法的参数到底来自于哪个绑定源，[FromBody]、[FormForm]等等。

## 性能优化

- 使用缓存
- 使用高速json序列化期
- 使用iis压缩web API
- 创建适当的数据库结构

## 安全
框架已经提供了一些常见的漏洞解决方案

- 跨站点脚本
- SQL注入
- 跨站点请求伪造(CSRF)
- 重定向

但是我们还需要更进一步，考虑以下常见的攻击

- 拒绝服务(dos)
- 分布式拒绝服务(ddos)
- 批量API调用
- 探测响应
- 数据抓取

## API请求数据类型
|  | 前端 | 后端 | 示例 |
| --- | --- | --- | --- |
| 时间 | Date | TimeSpan | "startTime": "00:15:00" |
| 时间 | Date | DateTime |  |


## ApiController特性

### 自动HTTP400响应
[ApiController] 特性使模型验证错误自动触发 HTTP 400 响应。 因此，操作方法中不需要以下代码

```csharp
if (!ModelState.IsValid)
{
    return BadRequest(ModelState);
}
```
特别是如果想使用过滤器做自定义模型校验，那么就需要不使用该特性，或者关闭自动的校验，如
```csharp
services.Configure<ApiBehaviorOptions>(options => options.SuppressModelStateInvalidFilter = true);
```

## 常见操作

### 接受参数反序列化
```csharp
JObject obj = (JObject)JsonConvert.DeserializeObject(HttpUtility.UrlDecode("返回回来的json数据"));
string aa = obj["ID"].ToString().Replace("\"", "");
```

### 获取请求头
```csharp
public static string GetHeader(this HttpRequestMessage request, string key)
{
    IEnumerable<string> keys = null;
    if (!request.Headers.TryGetValues(key, out keys))
        return null;
   return keys.First();
}
```

### 读取请求体

如何读取Request.Body正确方式，场景：比如想记录每次请求的参数，这个时候就需要读取Request.Body来获取信息

#### 中间件读取

```csharp
public class CustomMiddleware
{
    private readonly RequestDelegate _requestDelegate;

    public CustomMiddleware(RequestDelegate requestDelegate)
    {
        _requestDelegate = requestDelegate;
    }

    public async Task Invoke(HttpContext context)
    {
        context.Request.EnableBuffering();//可以实现多次读取Body
        /*
         因为我们在读取完Stream之后，此时的Stream指针位置已经在Stream的结尾处，即Position此时不为0，
        而Stream读取正是依赖Position来标记外部读取Stream到啥位置，所以我们再次读取的时候会从结尾开始读，
        也就读取不到任何信息了。所以我们要想重复读取RequestBody那么就要再次读取之前重置RequestBody的Position为0，

         */

        var sr = new StreamReader(context.Request.Body);
        string data = await sr.ReadToEndAsync();
        System.Console.WriteLine("data=" + data);
        context.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置

        await _requestDelegate(context);

        context.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
        var sr2 = new StreamReader(context.Request.Body);
        string data2 = await sr2.ReadToEndAsync();
        System.Console.WriteLine("data=" + data2);
        context.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
    }
}
```

注册方式

```csharp
app.UseMiddleware<CustomMiddleware>();
```

#### Action过滤器读取

在请求到达过滤器时Steam已经被读取了，此时我们在过滤器中使用EnableBuffering并没有起作用,所以就是设置一个中间件，然后启用多次读取

```csharp
app.Use(next => context =>
{
    context.Request.EnableBuffering();
    return next(context);
});

```

过滤器

```csharp
[AttributeUsage(AttributeTargets.All, AllowMultiple = false)]
public class CustomActionFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        base.OnActionExecuting(context);

        //context.HttpContext.Request.EnableBuffering();//可以实现多次读取Body
        context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
        using var stream = new StreamReader(context.HttpContext.Request.Body);
        string body = stream.ReadToEndAsync().GetAwaiter().GetResult();

        context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
        using var stream2 = new StreamReader(context.HttpContext.Request.Body);
        string body2 = stream2.ReadToEnd();
        context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
    }
}
```

注册方式

```csharp
services.AddControllers(options =>
{
    options.Filters.Add<CustomActionFilterAttribute>();
})
```

### 设置文件上传大小

从ASP.NET 2.0开始最大请求正文大小限制为30MB。在正常情况下，无需增加 HTTP 请求 body 的大小。但是，当您尝试上传大型文件 （> 30MB） 时，需要增加默认允许的最大限制。在这篇简短的文章中，我们将了解如何在.netcore 应用程序中增加文件 ASP.NET 大小以及控制此限制的各种选项。
需要修改ASP.NET Core会对上传文件大小的限制，还有修改Kestrel对Request的Body大小的限制

#### 在IIS上部署  

修改webconfig中的maxAllowedContentLength 
完整文件：

```csharp
<system.webServer>
    <handlers>
      <remove name="aspNetCore"/>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModule" resourceType="Unspecified"/>
    </handlers>+
    <aspNetCore processPath="%LAUNCHER_PATH%" arguments="%LAUNCHER_ARGS%" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" />
      <security>
        <requestFiltering>
          <!-- This will handle requests up to 50MB -->
          <requestLimits maxAllowedContentLength="52428800" />
        </requestFiltering>
      </security>
    </system.webServer>
```

#### 托管在Kestrel上

从 ASP.NET Core 2.0 开始, Kestrel 服务器也强加了自己的默认限制。有 3 种不同的方法可以增加Kestrel这个默认限制。  

##### Mvc解决方案  

 如果你想改动一个特定的 MVC 接口或控制器的最大请求体大小限制，你可以使用属性。比如 RequestSizeLimit   

```csharp
[HttpPost]
[RequestSizeLimit(40000000)] 
public async Task<IActionResult> UploadFiles(IFormFile file)
{ //TODO: Save file }
```

    该 RequestSizeLimit 操作方法设置允许的最大请求长度。您可以在方法级别或控制器级别应用此属性。这是 ASP.netcore 应用中增加请求体最大限制的推荐方法。还有另一个适用于控制器级别或方法级别的属性来禁用 HTTP 请求的大小限制。这将把请求限制设置为无限制。比如, DisableRequestSizeLimit

```csharp
[HttpPost] 
[DisableRequestSizeLimit] //DisableRequestSizeLimit 上传文件不限制文件大小
public async Task<IActionResult> UploadFiles(IFormFile file)
{ //TODO: Save file }
```

##### 全局方案    

 要修改全局最大请求 body 大小，请为 Kestrel 设置选项。比如,MaxRequestBodySize

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel((context, options) =>
                    {
                        //设置Body大小限制256MB
                        options.Limits.MaxRequestBodySize = 268435456;
                    });
                    webBuilder.UseStartup<Startup>();
                });
```

    这适用于整个应用程序的任何请求。该值是一个可空的长值。将它设置为 null 会禁用该限制。现在你可能会想，为什么这对 windows 不起作用，因为 IIS 也使用 Kestrel。原因是，这个设置对于运行在 IIS 后面的 Kestrel 来说是无效的，在 IIS 后面应用的是正常的 web.config 限制。虽然这是一个全局设置，但它可以通过中间件.MaxRequestBodySize 来覆盖每个请求。  

##### 中间件方案

如果你想基于请求覆盖全局设置，你可以通过中间件来实现。这样你就可以通过一些灵活的配置来修改单个请求。比如  

```csharp
app.UseWhen(context => 
    context.Request.Path.StartsWithSegments("/api"), appBuilder 
    => { context.Features.Get<IHttpMaxRequestBodySizeFeature>()
    .MaxRequestBodySize = null; //TODO: take next steps });
```

    请记住，在读取请求体开始后，不能更改。如果你在应用开始读取请求后试图配置请求的限制，会抛出一个异常。有一个属性可以指示是否处于只读状态，也就是说来不及配置限制了。IsReadOnlyMaxRequestBodySize(只读最大请求体大小)

##### Startup设置(推荐)

ConfigureServices修改ASP.NET Core会对上传文件大小的限制

```csharp
传文件不做限制可以上传最大
//解决Multipart body length limit 134217728 exceeded
services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = long.MaxValue; // 设置文件上传大小限制
    options.MemoryBufferThreshold = int.MaxValue;
});
```

Program修改Kestrel对Request的Body大小的限制

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }
    public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
    .ConfigureWebHostDefaults(webBuilder =>
    {
        webBuilder.ConfigureKestrel((context, options) =>
        {
            //设置应用服务器Kestrel请求体最大
            options.Limits.MaxRequestBodySize = long.MaxValue;
        });
        webBuilder.UseStartup<Startup>();
    });
}
```

## 

## 项目文章

.NET 8 实现无实体库表 API 部署服务[https://www.cnblogs.com/1312mn/p/18454788](https://www.cnblogs.com/1312mn/p/18454788)

简化ASP.NET Core API神器：用Gridify轻松实现过滤、排序和分页：[https://mp.weixin.qq.com/s/Qpk-AESj95ZLVTfpLSwvfw](https://mp.weixin.qq.com/s/Qpk-AESj95ZLVTfpLSwvfw)

## 资料

[https://mp.weixin.qq.com/s/kH4bRpUJSMveNpAlGcSiFg](https://mp.weixin.qq.com/s/kH4bRpUJSMveNpAlGcSiFg) | 差距 50 倍！为什么 Web API 第一次执行这么慢？
[https://mp.weixin.qq.com/s/VQS8XOarT5iPiiTzYIDlqg](https://mp.weixin.qq.com/s/VQS8XOarT5iPiiTzYIDlqg) | .NET6使用DOCFX根据注释自动生成开发文档 
[https://mp.weixin.qq.com/s/fpe3avrST2k-oNoSiqZNXw](https://mp.weixin.qq.com/s/fpe3avrST2k-oNoSiqZNXw) | 强烈推荐：C#类库生成API 文档！

