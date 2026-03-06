---
title: 说明
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqi
slug: fgbrtp
docsId: '31414036'
---

## 介绍
过滤器就是对目标对象(程序集、类、方法等)进行扩展，使得在运行时可以获取到被扩展对象的额外的信息，通过额外的信息来影响目标对象的行为。

ASP.NET Core 有以下五种Filter 可以使用：
![image.png](/common/1642519363735-1190ff23-6482-48c4-b121-eec954526d33.png)
**中间件和过滤器的功能类似，区别就是关注点是不同的，所要处理的职责不同，过滤器是更贴合业务的，关注应用程序本身**（可以对你请求的数据或者返回的结果进行处理操作，中间件是没有这个能力的），中间件都可以在请求之前和之后进行操作。请求完成之后传递给下一个请求，可以完成很多相似的功能，比如异常处理、限流处理。

中间件是ASP.Net Core这个基础提供的功能，而Filter是ASP.NET Core MVC提供的功能。ASP.NET Core MVC是由MVC中间件提供的框架，而Filter是属于MVC中间件提供的功能。中间件可以处理所有的请求，而过滤器只能处理对控制器的请求；中间件运行在一个更底层、更抽象的级别，因此中间件中无法处理MVC中间件特有的概念。优先使用中间件，但是如果这个组件只针对MVC或者需要调用一些MVC相关的类的时候，我们就只能选择使用过滤器。
> netcore和net相比增加了资源过滤器和结果过滤器，并且异常过滤器和方法过滤器设置了异步的使用方法，如果同步过滤器和异步的都设置了，那么只会调用异步的方法。


> 示例代码环境：vs2022、.Net6
> 源码地址：[https://github.com/azrng/dotnet-sample](https://github.com/azrng/dotnet-sample)


## 过滤器特性

### 作用范围
```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public class ApiResultFilterAttribute : Attribute, IAsyncResultFilter
```
第一行指定了该特性作用的范围，AttributeTargets就是目标对象，是一个枚举
```csharp
//指定可以对它们应用属性的应用程序元素。
[ComVisible(true)]
[Flags]
public enum AttributeTargets
{
    //可以对程序集应用属性。
    Assembly = 1,
    //可以对模块应用属性。
    Module = 2,
    //可以对类应用属性。
    Class = 4,
    //可以对结构应用属性，即值类型。
    Struct = 8,
    Enum = 16,
    //可以对构造函数应用属性。
    Constructor = 32,
    //可以对方法应用属性。
    Method = 64,
    //可以对属性 (Property) 应用属性 (Attribute)。
    Property = 128,
    //可以对字段应用属性。
    Field = 256,
    //可以对事件应用属性。
    Event = 512,
    //可以对接口应用属性。
    Interface = 1024,
    //可以对参数应用属性。
    Parameter = 2048,
    //可以对委托应用属性。
    Delegate = 4096,
    //可以对返回值应用属性。
    ReturnValue = 8192,
    //可以对泛型参数应用属性。
    GenericParameter = 16384,
    //可以对任何应用程序元素应用属性。
    All = 32767
}
```

## 过滤器类型
> 下面过滤器的顺序就是执行的顺序

![image.png](/common/1613100233506-be7d46eb-9075-4b6c-bab3-8cef48178254.png)
以下示例引用nuget包
```csharp
<PackageReference Include="AzrngCommon" Version="1.2.5" />
```
如果过滤器中使用了构造函数注入，那么我们需要使用到ServiceFilter
```csharp
//[Authorization_01Filter]//无参数过滤器
[ServiceFilter(typeof(Authorization_01Filter))]
[HttpGet]
public IEnumerable<WeatherForecast> Get01()
```
并且这个过滤器也需要进行注册，例如注册这个授权过滤器
```csharp
//授权过滤器
builder.Services.AddScoped(typeof(Authorization_01Filter));
```

### Authorization Filter
Authorization是五种Filter中优先级最高的，通常用于验证Request合不合法、用户身份是否被认证(然后授权等)、。
权限控制器过滤器，可以通过Authonization可以实现复杂的权限角色认证、登录授权等操作实现事例如下：
```csharp
[AttributeUsage(AttributeTargets.Class)]
public class Authorization_01Filter : Attribute, IAuthorizationFilter
{
    /*
     权限控制器过滤器，可以通过Authonization可以实现复杂的权限角色认证、登录授权等操作实现事例

     猜想：是否到底这一步的都应该是已经经过身份认证的用户，这边只是做一些授权操作，还是说这个地方做认证以及授权操作
     */

    private readonly ILogger<Authorization_01Filter> _logger;

    public Authorization_01Filter(ILogger<Authorization_01Filter> logger)
    {
        _logger = logger;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        _logger.LogInformation("进入授权过滤器");

        /*
         实现效果：自定义身份验证，当用户调用登录接口的时候，会查询数据库并且将该用户信息存入redis(格式Wie：key：随机数，value：用户信息)，然后返回随机数
         当请求其它接口的时候，验证请求头中是否传输了Authorization，如果没传直接返回401
         当传输了token，那么就拿着值去查询redis，然后验证通过后将用户信息存入上下文的User中

         */
        if (!context.HttpContext.Request.Headers.Any(t => t.Key == "Authorization"))
            context.Result = new JsonResult(new ResultModel { Code = "401", Message = "认证失败" });

        var token = context.HttpContext.Request.Headers.FirstOrDefault(t => t.Key == "Authorization").Value;
        if (token != "123456")//这里替换查询redis操作
        {
            context.Result = new JsonResult(new ResultModel { Code = "401", Message = "认证失败" });
        }

        //如果查询到上面传输的信息，那么就存储到上下文中
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "zyp"),
            new Claim(ClaimTypes.Role, "admin"),
        };
        var claimIdentities = new List<ClaimsIdentity>
        {
            new ClaimsIdentity(claims)
        };
        context.HttpContext.User.AddIdentities(claimIdentities);
    }
}
```
异步方案
```csharp
[AttributeUsage(AttributeTargets.Class)]
public class Authorization_01AsyncFilter : Attribute, IAsyncAuthorizationFilter
{
    private readonly ILogger<Authorization_01Filter> _logger;

    public Authorization_01AsyncFilter(ILogger<Authorization_01Filter> logger)
    {
        _logger = logger;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        _logger.LogInformation("进入授权过滤器");
        if (!context.HttpContext.Request.Headers.Any(t => t.Key == "Authorization"))
            context.Result = new JsonResult(new ResultModel { Code = "401", Message = "认证失败" });

        var token = context.HttpContext.Request.Headers.First(t => t.Key == "Authorization").Value;
        if (token != "123456")//这里替换查询redis操作
        {
            context.Result = new JsonResult(new ResultModel { Code = "401", Message = "认证失败" });
        }

        //如果查询到上面传输的信息，那么就存储到上下文中
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "zyp"),
            new Claim(ClaimTypes.Role, "admin"),
        };
        var claimIdentities = new List<ClaimsIdentity>
        {
            new ClaimsIdentity(claims)
        };
        context.HttpContext.User.AddIdentities(claimIdentities);
        return Task.CompletedTask;
    }
}
```
使用示例
```csharp
/// <summary>
/// 获取天气（同步验证IAuthorizationFilter）
/// </summary>
/// <returns></returns>
//[Authorization_01Filter]//无参数过滤器
[ServiceFilter(typeof(Authorization_01Filter))]
[HttpGet]
public IEnumerable<WeatherForecast> Get01()
{
    const string str = @"
    业务逻辑开始处理
    处...
    理...
    中...
    业务逻辑结束处理";
    _logger.LogInformation(str);
    return (new WeatherForecast()).GetList();
}
```

### Resource Filter
Resource是第二优先，会在Authorization之后，Model Binding之前执行。通常会是需要对Model加工处理才用也适合做**缓存**,因为是在创建控制器实例之前执行的。

同步方案
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Resource_01Filter : Attribute, IResourceFilter
{
    /*
     使用场景：可以做缓存：比如说第一次请求先到OnResourceExecuting，根据请求地址或者参数去判断是否已经保存数据，没有发现往下走创建Action实例，
    然后在OnResourceExecuted进行存储，然后再一次访问这个接口时候，OnResourceExecuting直接就赋值Result，所以就不再创建控制器实例

    具体示例：根据请求地址做接口缓存、根据请求参数做缓存处理
        */

    /// <summary>
    /// 模拟数据源
    /// </summary>
    private static readonly Dictionary<string, object> _dictionaryCache = new Dictionary<string, object>();

    private readonly ILogger<Result_01Filter> _logger;

    public Resource_01Filter(ILogger<Result_01Filter> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// 在接口被调用前触发
    /// </summary>
    /// <param name="context"></param>
    public void OnResourceExecuting(ResourceExecutingContext context)
    {
        _logger.LogInformation("同步 OnResourceExecuting");

        if (context.HttpContext.Request.Method == "Get")
        {
            //定义一个key存储缓存
            string key = context.HttpContext.Request.Path.ToString();
            if (_dictionaryCache.Any(t => t.Key == key))
            {
                //如果缓存有内容就直接返回
                context.Result = _dictionaryCache[key] as IActionResult;    //Result 短路器
            }
            //如果没有缓存就接着运行，然后再executed里面设置缓存
        }
        else
        {
            context.HttpContext.Request.EnableBuffering();//可以实现多次读取Body
            var sr = new StreamReader(context.HttpContext.Request.Body);
            string data = sr.ReadToEndAsync().GetAwaiter().GetResult();//不允许同步读取
            if (data == null)//body取不到数据直接跳过，一般情况下不会出现该情况
                return;

            //获取到body的请求字符串
            _logger.LogInformation("data=" + data);
            //根据请求字符串去做处理解析是否做缓存，本次示例是获取到请求的boyd里面的ID，如果存在id，那么就做资源缓存(id作为key)，
            var jobject = JObject.Parse(data);
            if (jobject["id"]?.ToString() != null)
            {
                string key = context.HttpContext.Request.Path.ToString() + jobject["id"].ToString();
                if (_dictionaryCache.Any(t => t.Key == key))
                {
                    //如果缓存有内容就直接返回
                    context.Result = _dictionaryCache[key] as IActionResult;    //Result 短路器
                }
            }

            context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
            context.HttpContext.Request.Body.Position = 0;
        }
    }

    /// <summary>
    /// 在接口调用结束时候触发
    /// </summary>
    /// <param name="context"></param>
    public void OnResourceExecuted(ResourceExecutedContext context)
    {
        _logger.LogInformation("异步 OnResourceExecuted");
        //把数据存储缓存 Key---path;  实际情况这里缓存应该加上过期时间
        if (context.HttpContext.Request.Method == "Get")
        {
            string key = context.HttpContext.Request.Path.ToString();//将请求路径作为缓存的key
            _dictionaryCache[key] = context.Result;//刚才接口返回的值
        }
        else
        {
            context.HttpContext.Request.Body.Seek(0, SeekOrigin.Begin);//读取到Body后，重新设置Stream到起始位置
            context.HttpContext.Request.Body.Position = 0;
            var sr = new StreamReader(context.HttpContext.Request.Body);
            string data = sr.ReadToEndAsync().GetAwaiter().GetResult();//不允许同步读取
            if (data == null)
                return;

            var jobject = JObject.Parse(data);
            if (jobject["id"]?.ToString() != null)
            {
                string key = context.HttpContext.Request.Path.ToString() + jobject["id"].ToString();
                _dictionaryCache[key] = context.Result;//刚才接口返回的值
            }
        }
    }
}
```
异步方案
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Resource_02Filter : Attribute, IAsyncResourceFilter
{
}
```

### Action Filter
最常使用的Filter，请求和返回都会经过它。跟Resource Filter很类似，但并不会经过Model Binding,因为进这个过滤器的时候已经走过了Model Binding。
可以通过ActionFilter拦截每个执行方法进行一系列的操作，比如：执行日志、性能监控、数据校验参数验证或加密、权限控制等一系列操作。使用Action Filter 需要实现IActionFilter 抽象接口，IActionFilter 接口要求实现OnActionExecuted 和OnActionExecuting 方法

同步方案：
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Action_01Filter : Attribute, IActionFilter
{
    private readonly ILogger<Action_01Filter> _logger;

    public Action_01Filter(ILogger<Action_01Filter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        _logger.LogInformation("action 执行前");

        //如果标记有允许所有，不做处理那么就跳过
        if (context.ActionDescriptor.EndpointMetadata.Any(t => t.GetType() == typeof(AllowAnonymousAttribute)))
        {
            return;
        }

        //记录请求来的一些参数
        var queryUrl = context.HttpContext.Request.Query;
        string path = context.HttpContext.Request.Path;
        string name = context.HttpContext.User.Identity?.Name;
        _logger.LogInformation($"Action信息  queryUrl:{queryUrl},path:{path},name:{name}");
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation("action 执行后");
    }
}
```
异步过滤器
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Action_02Filter : Attribute, IAsyncActionFilter
{
    private readonly ILogger<Action_01Filter> _logger;

    public Action_02Filter(ILogger<Action_01Filter> logger)
    {
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        _logger.LogInformation("action 执行前");

        //如果标记有允许所有，不做处理那么就跳过
        if (context.ActionDescriptor.EndpointMetadata.Any(t => t.GetType() == typeof(AllowAnonymousAttribute)))
        {
            return;
        }

        //记录请求来的一些参数
        var queryUrl = context.HttpContext.Request.Query;
        string path = context.HttpContext.Request.Path;
        string name = context.HttpContext.User.Identity?.Name;
        _logger.LogInformation($"Action信息  queryUrl:{queryUrl},path:{path},name:{name}");

        await next();

        _logger.LogInformation("action 执行后");
    }
}
```
此方法不同于ActionFilter的是，它能够处理异步操作，同时它是在模型绑定完成之后执行，只有一个异步方法OnActionExecutionAsync。
另外还可以继承自ActionFilterAttribute，这东西有点类似于Action过滤器和Result的合并使用
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Action_03Filter : ActionFilterAttribute
{
    private readonly ILogger<Action_01Filter> _logger;

    public Action_03Filter(ILogger<Action_01Filter> logger)
    {
        _logger = logger;
    }

    public override void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation("action 执行后 OnActionExecuted 1 ");

        base.OnActionExecuted(context);
    }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        _logger.LogInformation("action 执行前 OnActionExecuting 2 ");
        base.OnActionExecuting(context);
    } 

    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        //会进该方法
        //OnActionExecuted OnActionExecuting方法我理解是应该在这里根据条件判断去调用上面的方法

        _logger.LogInformation("action 执行前 OnActionExecutionAsync 3 ");
        await next();
        _logger.LogInformation("action 执行前 OnActionExecutionAsync 4 ");
    }

    public override void OnResultExecuted(ResultExecutedContext context)
    {
        _logger.LogInformation("result 执行后 OnResultExecuted 5 ");
        base.OnResultExecuted(context);
    }

    public override void OnResultExecuting(ResultExecutingContext context)
    {
        _logger.LogInformation("result 执行前 OnResultExecuting 6 ");
        base.OnResultExecuting(context);
    }

    public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        //会进该方法
        //OnResultExecuted、OnResultExecuting方法并不会直接触发，而是根据条件在当前方法中执行调用的

        _logger.LogInformation("result 执行前 OnResultExecutionAsync 7 ");

        await next();

        _logger.LogInformation("result 执行后 OnResultExecutionAsync 8 ");

        //返回
        //context.Result = new ObjectResult("");
        //await base.OnResultExecutionAsync(context, next);
    }
}
```

### Exception Filter
异常处理的Filter，可以进行全局的异常日志收集等操作，使用该过滤器需要实现IExceptionFilter接口，实现这个接口需要实现OnException方法，当系统发送未捕捉的异常时候就会触发这个方法，这个方法里面包含了一个ExceptionContext异常上下文，其中包含了具体的异常信息，然后就需要使用日志组件等记录下这个异常。
> 注意：只能捕捉Action异常，如果是要做全局异常捕捉还是建议去使用中间件。


首先自定义一个异常过滤器，然后实现IExceptionFilter接口
实现方法，先判断异常是否处理过，如果没有处理过那么就进行处理。
同步方案：
```csharp
public class Exception_01Filter : Attribute, IExceptionFilter
{
    private readonly ILogger<Exception_01Filter> _logger;
    private readonly IModelMetadataProvider _modelMetadataProvider;

    public Exception_01Filter(ILogger<Exception_01Filter> logger,
        IModelMetadataProvider modelMetadataProvider)
    {
        _logger = logger;
        _modelMetadataProvider = modelMetadataProvider;
    }

    public void OnException(ExceptionContext context)
    {
        if (context.ExceptionHandled)
            return;

        //日志收集
        _logger.LogError(context.Exception, "出错" + context?.Exception?.Message ?? "异常");

        var response = new ResultModel<string>()
        {
            Message = $"处理失败 {context.Exception.Message}",
            IsSuccess = false,
            Code = "500"
        };
        //或者
        context.Result = new JsonResult(response);

        //如果是mvc使用，那么就可以返回错误界面
        //var result = new ViewResult { ViewName = "~/Views/Shared/Error.cshtml" };
        //result.ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(_modelMetadataProvider, context.ModelState);
        //context.Result = result;//断路器只要一对result赋值就不继续往后赋值了

        context.ExceptionHandled = true;
    }
}
```
异步方案
```csharp
public class Exception_02Filter : Attribute, IAsyncExceptionFilter
{
    private readonly ILogger<Exception_02Filter> _logger;

    //构造注入日志组件
    public Exception_02Filter(ILogger<Exception_02Filter> logger)
    {
        _logger = logger;
    }

    public async Task OnExceptionAsync(ExceptionContext context)
    {
        if (context.ExceptionHandled)
            return;

        //日志收集
        _logger.LogError(context.Exception, context?.Exception?.Message ?? "异常");

        var response = new ResultModel<string>()
        {
            Message = $"处理失败 {context.Exception.Message}",
            IsSuccess = false,
            Code = "500"
        };
        var setting = new JsonSerializerSettings
        {
            ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()//指定序列化方式为驼峰式
        };
        await context.HttpContext.Response.WriteAsync(JsonConvert.SerializeObject(response, setting));
        //或者
        //context.Result = new JsonResult(response);//断路器只要一对result赋值就不继续往后赋值了
        context.ExceptionHandled = true;
    }
}
```

### Result Filter
当Action完成后，最终会经过的Filter，可以对结果进行格式化、大小写转换、双语系统等一系列操作。比如根据返回的结果不同，渲染不同的视图(中文视图或者英文视图)等

同步方案：
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Result_01Filter : Attribute, IResultFilter
{
    private readonly IModelMetadataProvider _modelMetadataProvider;

    public Result_01Filter(IModelMetadataProvider modelMetadataProvider)
    {
        _modelMetadataProvider = modelMetadataProvider;
    }

    /// <summary>
    /// 在result执行前发生(在view 呈现前)，使用场景：设置客户端缓存，服务器端压缩
    /// </summary>
    /// <param name="context"></param>
    public void OnResultExecuting(ResultExecutingContext context)
    {
        // 在结果执行之前调用的一系列操作  mvc中使用根据不同的参数等返回不同的页面
        //var param = context.HttpContext.Request.Query["View"];
        //if (param == "1")//显示中文系统
        //{
        //    var result = new ViewResult { ViewName = "~/Views/Test/Chinese.cshtml" };
        //    result.ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(_modelMetadataProvider, context.ModelState);
        //    context.Result = result;
        //}

        //设置响应头
        //context.HttpContext.Response.Headers.Add("", new string[] { "" });

        Console.WriteLine("OnResultExecuting");
        context.Result = new JsonResult(ResultModel<object>.Success((ObjectResult)context.Result));
    }

    /// <summary>
    /// 渲染视图后执行,当Action完成后
    /// </summary>
    /// <param name="context"></param>
    public void OnResultExecuted(ResultExecutedContext context)
    {
        var path = context.HttpContext.Request.Path;
        // 在结果执行之后调用的操作...
        Console.WriteLine($"OnResultExecuted  Path：{path}");

        //注意：目前我并不知道找个方法适合做什么，并且context.Result方法也是只读的。
    }
}
```
异步方案
```csharp
[AttributeUsage(AttributeTargets.All)]
public class Result_02Filter : Attribute, IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        context.Result = new JsonResult(ResultModel<object>.Success((ObjectResult)context.Result));
        Console.WriteLine("之前");
        await next();
        Console.WriteLine("之后");
    }
}

```
同样的这里我们还可以继承自ResultFilterAttribute。

## 资料
ASP.NET Core 中的过滤器：[https://docs.microsoft.com/zh-cn/aspnet/core/mvc/controllers/filters?view=aspnetcore-6.0](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/controllers/filters?view=aspnetcore-6.0)

https://mp.weixin.qq.com/s/EEwvdKqN37JjeoKvykvLXw | ASP.NET Core 过滤器高级篇
