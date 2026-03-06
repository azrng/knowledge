---
title: Action响应结果
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: action
slug: zcbc6i
docsId: '29808033'
---

## 说明
Microsoft.AspNetCore.Mvc 命名空间下的基类 Controller 让我们能够访问很多关于 HTTP 请求的上下文信息，以及提供了一些方法帮助我们构建返回给回客户端的结果，返回的响应的结果中，我们可以发送简单的字符串或者整数，或者发送像对象这样的复杂数据。这些结果通常被封装到实现 IActionResult 接口的对象中，有大量的不同类型的结果实现了该接口，这些结果类型包含模型内容的下载，也可以返回 JSON，也可以返回 XML，或者 HTML 视图。
下表列出了不同种类的动作结果及其行为

| **动作名称( 类 )** | **行为** |
| --- | --- |
| ContentResult | 返回一串字符串 |
| FileContentResult | 返回文件的内容 |
| FilePathResult | 返回路径文件的内容 |
| FileStreamResult | 返回流文件的内容 |
| EmptyResult | 返回空 |
| JavaScriptResult | 返回一段 JavaScript 代码 |
| JsonResult | 返回 JSON 格式的数据 |
| RedirectToResult | 重定向到某个 URL |
| HttpUnauthorizedResult | 返回 403 未授权状态码 |
| RedirectToRouteResult | 重定向到不同的控制器或方法 |
| ViewResult | 从视图引擎中返回一个响应 |
| PartialViewResult | 从视图引擎中返回一个响应 |

**范例： ContentResult**

现在，我们修改 HomeController.cs ，引入命名空间 Microsoft.AspNetCore.Mvc，并修改 HomeController 继承自 Controller。
下面代码是 HomeController 类的完整实现

```csharp
using System;
using Microsoft.AspNetCore.Mvc;

namespace HelloWorld.Controllers
{
    public class HomeController: Controller
    {
        public ContentResult Index() {
            return Content("你好，世界! 这条消息来自使用了 Action Result 的 Home 控制器");
      } 
    }
}
```
我们可以看到，Index() 方法返回了一个 ContentResult 类型的结果。ContentResult 是实现了 ActionResult 接口的不同结果类型之一
在 Index() 方法中，我们将一个字符串传递给 Content()。 Content() 方法会产生一个 ContentResult，也就是说，Index() 方法会返回 ContentResult
保存 HomeController.cs 文件，重启应用程序，然后访问跟目录 /，我们将会得到以下输出

![image.png](/common/1610068667547-ff70e7b0-f6b0-4363-b889-9e7e6c6e43d5.png)

我们可以看到，这个响应和之前我们看到的响应几乎没有任何区别，它仍然只是一个纯文本的响应
你可能很想知道使用 ActionResult 来生成东西有什么优势
在 Mvc 模式中，控制器决定接下来要做什么，返回一个字符串或 HTML 或返回可能被序列化为 JSON 等的模型对象
Mvc 中的控制器需要做的就是做出决定，但控制器不必直接在响应中写入决策结果。 它只需要返回结果，然后框架会使用这些结果并理解如何将结果转换为可通过 HTTP 发回的内容

**范例：ObjectResult**

如果你不能理解上面这些内容，没关系，我们再来看一个范例，这次我们使用 ObjectResult
在解决方案管理器中的 HelloWorld 上点击右键，创建一个新文件夹并将其命名为 Models。 在 Models 文件夹中，添加一个用于表示雇员的 Employee 类
创建完成后，目录结构如下

![image.png](/common/1610068667563-79ef94eb-a36f-41d0-97fe-e86b8f110f58.png)

Employee.cs 中的内容如下

![image.png](/common/1610068667563-44fb440d-3a54-4f81-ad7f-daebaf99bc33.png)



```csharp
using System;
namespace HelloWorld.Models
{
    public class Employee
    {
        public Employee()
        {
        }
    }
}
```
修改刚刚创建的 Employee 类，添加两个属性，一个整型的 ID 和 一个字符串类型的 Name，修改完成后 Employee.cs 中的内容如下
```csharp
using System;
namespace HelloWorld.Models
{
    public class Employee
    {
        public Employee()
        {
        }
		public int ID { get; set; } 	
        public string Name { get; set; }
    }
}
```
然后我们回到 HomeController 控制器，修改 Index() 方法，返回一个 Employee 对象。
修改完成后的 HomeController.cs 内容如下
```csharp
using System;
using Microsoft.AspNetCore.Mvc;
using HelloWorld.Models;
namespace HelloWorld.Controllers
{
    public class HomeController: Controller
    {
        public ObjectResult Index()
        { 
            var employee = new Employee { ID = 1, Name = "语飞"}; 
            return new ObjectResult(employee); 
        }
    }
}
```
现在，返回的不是 Content，而是返回一个不同类型的结果 ObjectResult。 如果我们想要一个 ObjectResult，我们需要创建或实例化一个 ObjectResult 并将一些模型对象作为参数传递给它
在 MVC 框架中，ObjectResult 是特殊的，因为当我们返回一个 ObjectResult 时，MVC 框架将访问这个对象。并将这个对象做一些转换，然后作为 HTTP 响应返回给客户端
在转换 ObjectResult 对象时，它可能被序列化为 [XML](https://www.twle.cn/l/yufei/xml/xml-basic-index.html) 或 [JSON](https://www.twle.cn/l/yufei/json/json-basic-index.html) 或其它格式， 至于什么格式，由应用程序启动时向 MVC 提供的配置信息决定。如果我们没有显式的配置任何东西，那么将会使用 JSON 作为默认格式
保存所有的文件，重启应用程序，然后访问首页，我们将得到如下结果
![image.png](/common/1610068667560-1f3b49fd-4cc9-4930-8a97-bbabfe85e692.png)

## ViewResult

这个结果用于向客户端呈现视图（HTML页面）。它是MVC应用程序中最常用的类型。

```csharp
public IActionResult Index()
{
    return View();
}
```

## JsonResult

这个结果用于返回JSON格式的数据。它常用于API响应。

```csharp
public JsonResult GetJsonData()
{
    var data = new { Name = "John", Age = 30 };
    return Json(data);
}
```

## ContentResult

这个结果用于返回纯文本或其他任何内容。

```csharp
public ContentResult GetContent()
{
    return Content("Hello, this is plain text.");
}
```

## **FileResult**

这个结果用于向客户端返回文件，如文档、图像或其他任何文件。

```csharp
public FileResult GetFile()
{
    var fileBytes = System.IO.File.ReadAllBytes("path/to/file.pdf");
    return File(fileBytes, "application/pdf", "download.pdf");
}
```



## FileContentResult

返回指定类型文件可以下载

File：会将指定的文件内容、内容类型和文件名作为响应返回给客户端，它适用于动态生成的文件内容，例如从内存中生成的文件、压缩文件等
```csharp
/// <summary>
/// 返回指定类型的文件
/// </summary>
/// <param name="fileContents">文件内容</param>
/// <param name="contentType">文件的内容类型</param>
/// <param name="fileDownloadName">文件名</param>
/// <returns></returns>
File(byte[] fileContents, string contentType, string fileDownloadName)
```
或者使用
```csharp
[HttpGet("get-file-content/{id}")]
public async Task<FileContentResult> DownloadAsync(string id)
{
    var fileName = "myfileName.txt";
    var mimeType = "application/....";
    byte[] fileBytes = new byte[0];

    return new FileContentResult(fileBytes, mimeType)
    {
        FileDownloadName = fileName
    };
}    
```

### 导出pdf等内容
```csharp
[HttpGet("get-file-content/{id}")]
public FileContentResult Download(string id)
{
    var fileName = $"{DateTime.Now:yyyyMMddHHmmss}.pdf";
    //const string mimeType = "application/ms-excel";
    const string mimeType = "application/octet-stream";
    byte[] fileBytes = new byte[0];

    return File(fileBytes, mimeType, fileName);
}
```
> 关于这个文件类型mimeType其他的写法可以去参考Stream扩展类


### 导出文本文件
```csharp
[HttpGet("get-file-content")]
public async Task<IActionResult> ExportConfigAsync()
{
    var bytes = await _interfaceManageBll.ExportConfigAsync();
    return File(bytes, "text/plain", $"{SystemDateTime.Now().ToString("yyyyMMddHHmmss")}.txt");
}
```

### 导出压缩包
注入IHostEnvironment，逻辑是先在容器内创建文件夹，然后导出然后再删除文件夹
```csharp
public async Task<byte[]> ExportTestCaseAsync()
{
    var exportRoot = Path.Combine(_hostEnvironment.ContentRootPath, "export");
    var exportDirName = Guid.NewGuid().ToString();
    var exportDirPath = Path.Combine(exportRoot, exportDirName, "details");
    var zipFullPath = Path.Combine(exportRoot, exportDirName, "export.zip");
    Directory.CreateDirectory(exportDirPath);

    try
    {
        var testCaseList = await _serviceTemplateCaseRepo.Query(t => true, false)
            .Select(t => new
            {
                t.Status,
                t.TemplateCode,
                t.TestCaseContent
            }).ToListAsync().ConfigureAwait(false);
        foreach (var item in testCaseList)
        {
            var pageBytes = Encoding.UTF8.GetBytes(item.TestCaseContent);
            await File.WriteAllBytesAsync(Path.Combine(exportDirPath, $"EMR-PL-0.xml"), pageBytes).ConfigureAwait(false);
        }

        ZipFile.CreateFromDirectory(exportDirPath, zipFullPath);

        var ret = File.ReadAllBytes(zipFullPath);
        return ret;
    }
    finally
    {
        Directory.Delete(Path.Combine(exportRoot, exportDirName), true);
    }
}
```
控制器中执行导出
```csharp
public async Task<IActionResult> ExportTestCaseAsync()
{
    var bytes = await _serviceTemplateService.ExportTestCaseAsync().ConfigureAwait(false);
    return File(bytes, "application/octet-stream", $"{SystemDateTime.Now().ToString("yyyyMMddHHmmss")}.zip");
}


```

## FileStreamResult
```bash
[HttpGet("get-file-stream/{id}"]
public async Task<FileStreamResult> DownloadAsync(string id)
{
    var fileName="myfileName.txt";
    var mimeType="application/...."; 
    Stream stream = await GetFileStreamById(id);

    return new FileStreamResult(stream, mimeType)
    {
   		 FileDownloadName = fileName
    };
}
```

## PhysicalFileResult
PhysicalFile：根据指定的文件路径和内容类型直接返回文件给客户端，它适用于通过文件路径直接返回物理文件内容
> 注意：可能涉及权限问题

```csharp
[HttpGet("batch/dowload2")]
public IActionResult Download2()
{
    // 获取要下载的文件列表
    var fileContents = GetFileContents();

    // 压缩文件并下载
    var archiveFilePath = Path.Combine(_hostEnvironment.ContentRootPath, "export");
    Directory.CreateDirectory(archiveFilePath);

    try
    {
        using (var archive = ZipFile.Open(archiveFilePath, ZipArchiveMode.Create))
        {
            foreach (var filePath in fileContents)
            {
                archive.CreateEntryFromFile(filePath, Path.GetFileName(filePath));
            }
        }

        // 根据指定的文件路径和内容类型直接返回文件给客户端，它适用于通过文件路径直接返回物理文件内容
        return PhysicalFile(archiveFilePath, "application/octet-stream", $"{DateTime.Now:yyyyMMddHHmmss}.zip");
    }
    finally
    {
        Directory.Delete(archiveFilePath, true);
    }
}
```

## RedirectResult

这个结果用于将客户端重定向到指定的URL。要实现重定向使用的方法是Redirect。该方法会生成RedirectResult类实例，而RedirectResult构造函数可以传入 2 个 bool 值：

```csharp
public RedirectResult(string url, bool permanent, bool preserveMethod)
```

### RedirectResult解释
查找这 2 个参数的引用，我们最终定位到RedirectResultExecutor.cs
```csharp
if (result.PreserveMethod)
{
    context.HttpContext.Response.StatusCode = result.Permanent ?
        StatusCodes.Status308PermanentRedirect : StatusCodes.Status307TemporaryRedirect;
    context.HttpContext.Response.Headers.Location = destinationUrl;
}
else
{
    context.HttpContext.Response.Redirect(destinationUrl, result.Permanent);
}
```

### PreserveMethod = true
使用 Location 标头返回需要跳转的 Url。
Permanent 决定状态码：

| Permanent | 状态码 | 说明 |
| --- | --- | --- |
| false | 307 | 临时重定向响应状态码，表示请求的资源暂时地被移动到了响应的 Location 所指向的 URL 上。 |
| true | 308 | 永久重定向响应状态码，说明请求的资源已经被永久的移动到了由 Location 指定的 URL 上 |


### PreserveMethod = false
执行Response.Redirect方法进行跳转，内部实现如下：
```csharp
public override void Redirect(string location, bool permanent)
{
    if (permanent)
    {
        HttpResponseFeature.StatusCode = 301;
    }
    else
    {
        HttpResponseFeature.StatusCode = 302;
    }

    Headers.Location = location;
}
```
其实和PreserveMethod = true的逻辑是一样的，只是返回的状态码不同：

| Permanent | 状态码 | 说明 |
| --- | --- | --- |
| false | 302 | 表明请求的资源被暂时的移动到了由该HTTP响应的响应头Location 指定的 URL 上。 |
| true | 301 | 表明请求的资源已经被移动到了由 Location 头部指定的url上，是固定的不会再改变 |

综上，ASP.NET Core 中的重定向一共包含 4 种：

| 状态码 | PreserveMethod | Permanent | 生成RedirectResult方法 |
| --- | --- | --- | --- |
| 301 | false | true | RedirectPermanent() |
| 302 | false | false | Redirect() |
| 307 | true | false | RedirectPreserveMethod() |
| 308 | true | true | RedirectPermanentPreserveMethod() |


### 测试Demo
编写如下代码：
```csharp
[HttpGet("RedirectPermanent")]
[HttpPost("RedirectPermanent")]
public IActionResult RedirectPermanent()
{
    _logger.LogInformation("RedirectPermanent");
    return RedirectPermanent("MyIO");
}

[HttpGet("Redirect")]
[HttpPost("Redirect")]
public IActionResult Redirect()
{
    _logger.LogInformation("Redirect");
    return Redirect("MyIO");
}

[HttpGet("RedirectPreserveMethod")]
[HttpPost("RedirectPreserveMethod")]
public IActionResult RedirectPreserveMethod()
{
    _logger.LogInformation("RedirectPreserveMethod");
    return RedirectPreserveMethod("MyIO");
}

[HttpGet("RedirectPermanentPreserveMethod")]
[HttpPost("RedirectPermanentPreserveMethod")]
public IActionResult RedirectPermanentPreserveMethod()
{
    _logger.LogInformation("RedirectPermanentPreserveMethod");
    return RedirectPermanentPreserveMethod("MyIO");
}

[HttpGet("MyIO")]
[HttpPost("MyIO")]
public string MyIO()
{
    return this.Request.Method;
}
```

- 所有方法都同时支持GET和POST方法
- 所有方法都会重定向到同一个方法，显示当前请求方法

每个 API 都请求 2 遍，可以看到：

- Permanent = true 的Get请求只会执行一次，后续会直接请求跳转后的地址

![image.png](/common/1663410798012-c08891a5-4d35-4599-8fd4-a4ab23bdc94b.png)

- PreserveMethod = false 的POST请求，跳转后实际执行的Get请求

![image.png](/common/1663410832719-8fc45dc9-0345-4f99-9f86-0d180fdb20c6.png)
总结：如果想只发生一次重定向，则应考虑使用RedirectPermanent或者RedirectPermanentPreserveMethod。
如果要为非 GET 请求使用重定向，则应考虑使用RedirectPreserveMethod或者RedirectPermanentPreserveMethod。

### 示例

#### 方案一
注入服务
```csharp
builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
```
控制器写法
```csharp
[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    private readonly ILogger<HomeController> _logger;
    private readonly IActionContextAccessor _actionContextAccessor;

    public HomeController(ILogger<HomeController> logger, IActionContextAccessor actionContextAccessor)
    {
        _logger = logger;
        _actionContextAccessor = actionContextAccessor;
    }

    [HttpGet()]
    public IActionResult Get()
    {
        var redirectUrl = "https://jsonplaceholder.typicode.com/posts";
        var result1 = new RedirectResult(redirectUrl, true);
        result1.UrlHelper = new UrlHelper(_actionContextAccessor.ActionContext);

        result1.UrlHelper
              .ActionContext
              .HttpContext
              .Request.Headers.Add("Access-Control-Allow-Origin", new StringValues("*"));

        result1.UrlHelper
              .ActionContext
              .HttpContext
              .Response.Redirect(redirectUrl);

        result1.UrlHelper
              .ActionContext
              .HttpContext
              .Response.Headers.Add("Access-Control-Allow-Origin", new StringValues("*"));

        return result1;
    }
}
```

#### 方案二
```csharp
_app.MapGet("/view/subjects/{patientId}/index/records", async ([FromRoute] int patientId,
    HttpContext httpContent,
    [FromServices] IConfigurationService configurationService,
    ILogger<BusinessController> logger) =>
{
    var path = httpContent.Request.Path.ToString();

    var url = await configurationService.GetChartReviewConfigContentAsync(SystemConst.View360Url).ConfigureAwait(false);
    var redirectUrl = new StringBuilder();
    redirectUrl.Append($"{url.TrimEnd('/')}{path}?")
    .AppendJoin('&', httpContent.Request.Query.Select(item => $"{item.Key}={item.Value}"));

    logger.LogInformation($"/view/subjects/patientId/records 重定向URL为：{redirectUrl}");
    httpContent.Response.StatusCode = 301;
    return Results.Redirect(redirectUrl.ToString());
}).WithTags("360");
```

## RedirectToActionResult

这个结果用于将客户端重定向到控制器中的特定动作方法。

```csharp
public RedirectToActionResult RedirectToActionMethod()
{
    return RedirectToAction("Index", "Home");
}
```

## RedirectToRouteResult

这个结果用于将客户端重定向到特定的路由。

```csharp
public RedirectToRouteResult RedirectToRouteMethod()
{
    return RedirectToRoute(new { controller = "Home", action = "Index" });
}
```

## StatusCodeResult

这个结果用于返回特定的HTTP状态码。

```
public StatusCodeResult GetStatusCode()
{
    return StatusCode(404);
}
```

## EmptyResult

这个结果不返回任何内容。

```csharp
public EmptyResult DoNothing()
{
    return new EmptyResult();
}
```

## PartialViewResult

这个结果用于呈现部分视图。

```csharp
public PartialViewResult GetPartialView()
{
    return PartialView("_PartialView");
}
```

## ObjectResult

这个结果用于将对象作为响应返回。它通常在API中使用，以返回数据和HTTP状态码。

```csharp
public ObjectResult GetObject()
{
    var data = new { Name = "John", Age = 30 };
    return new ObjectResult(data) { StatusCode = 200 };
}
```

## 实际场景

### 返回文件流(类文件存储)

通过后端接口返回文件流，然后实现类似图片链接地址的操作

```c#
[HttpGet("medical/{moduleCode}/{recordId}/{key}")]
public async Task<Stream> MedicalFile(string moduleCode, int recordId, string key)
{
    var fileBytes = await _medicalFileService.GetMedicalFileAsync(moduleCode, recordId, key).ConfigureAwait(false);
    return new MemoryStream(fileBytes);
}
```

### 替换Action执行

替换 Action 实际执行方法

#### RequestDelegate
查看endpoints.MapControllers()实现时，最终定位到ActionEndpointFactory.cs，其中有这样一段代码：
```csharp
private static RequestDelegate CreateRequestDelegate()
{
    // We don't want to close over the Invoker Factory in ActionEndpointFactory as
    // that creates cycles in DI. Since we're creating this delegate at startup time
    // we don't want to create all of the things we use at runtime until the action
    // actually matches.
    //
    // The request delegate is already a closure here because we close over
    // the action descriptor.
    IActionInvokerFactory? invokerFactory = null;

    return (context) =>
    {
        var endpoint = context.GetEndpoint()!;
        var dataTokens = endpoint.Metadata.GetMetadata<IDataTokensMetadata>();

        var routeData = new RouteData();
        routeData.PushState(router: null, context.Request.RouteValues, new RouteValueDictionary(dataTokens?.DataTokens));

        // Don't close over the ActionDescriptor, that's not valid for pages.
        var action = endpoint.Metadata.GetMetadata<ActionDescriptor>()!;
        var actionContext = new ActionContext(context, routeData, action);

        if (invokerFactory == null)
        {
            invokerFactory = context.RequestServices.GetRequiredService<IActionInvokerFactory>();
        }

        var invoker = invokerFactory.CreateInvoker(actionContext);
        return invoker!.InvokeAsync();
    };
}
```
从代码上理解，应该是执行请求时，会创建IActionInvokerFactory实例，由它创建 invoker 执行。

#### IActionInvokerFactory
新建CustomActionInvokerFactory.cs，继承IActionInvokerFactory，实现代码如下：
```csharp
public class CustomActionInvokerFactory : IActionInvokerFactory
{
    private readonly IActionInvokerProvider[] _actionInvokerProviders;

    public ActionInvokerFactory(IEnumerable<IActionInvokerProvider> actionInvokerProviders)
    {
        _actionInvokerProviders = actionInvokerProviders.OrderBy(item => item.Order).ToArray();
    }

    public IActionInvoker? CreateInvoker(ActionContext actionContext)
    {
        var context = new ActionInvokerProviderContext(actionContext);

        foreach (var provider in _actionInvokerProviders)
        {
            provider.OnProvidersExecuting(context);
        }

        for (var i = _actionInvokerProviders.Length - 1; i >= 0; i--)
        {
            _actionInvokerProviders[i].OnProvidersExecuted(context);
        }

        return context.Result;
    }
}
```
代码 Copy 自 ASP.NET Core 内部实现类ActionInvokerFactory。
然后在 Startup.cs 注册实现：
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IActionInvokerFactory, CustomActionInvokerFactory>();
    ...
}
```
打上断点，执行API，**发现确实如设想中一样，请求时执行CreateInvoker方法。**在其中发现了一个很有意思的属性MethodInfo,正是对应我们执行的 Action 方法。
**突发奇想，如果我们替换MethodInfo属性，是不是会执行其他方法呢？**



创建 WeatherForecast2Controller，实现代码如下：
```csharp
[ApiController]
[Route("[controller]")]
public class WeatherForecast2Controller : ControllerBase
{
    [HttpGet]
    public string Get2()
    {
        return "My IO";
    }
}
```
可以看到这是和原方法完全不同的实现。
现在进行替换：
```csharp
var actionDescriptor = actionContext.ActionDescriptor as ControllerActionDescriptor;
actionDescriptor.MethodInfo = typeof(WeatherForecast2Controller).GetMethod("Get2");
actionDescriptor.ControllerTypeInfo = typeof(WeatherForecast2Controller).GetTypeInfo();
```
运行成功。

**替换 Action 实际执行方法，最好的使用场景是定制化开发**，比如客户需求和产品实现完全不同，可以保证请求不变的情况下执行客户定制化实现。

## 资料
[https://mp.weixin.qq.com/s/sLK1gf1c6OfVLS-qQczgxg](https://mp.weixin.qq.com/s/sLK1gf1c6OfVLS-qQczgxg) | ASP.NET Core 替换 Action 实际执行方法
来源：[https://mp.weixin.qq.com/s/sX0umK1QvXUzyJz_HxuVvg](https://mp.weixin.qq.com/s/sX0umK1QvXUzyJz_HxuVvg)
[https://mp.weixin.qq.com/s/xn1cGjMB851YaisconC4WA](https://mp.weixin.qq.com/s/xn1cGjMB851YaisconC4WA) | ASP.NET Core 中的重定向

