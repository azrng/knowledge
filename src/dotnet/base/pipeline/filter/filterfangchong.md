---
title: 过滤器实现-防重
lang: zh-CN
date: 2023-07-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guolvqishixian-fangchong
slug: grvvov
docsId: '67062346'
---

## 目的
对一些业务接口增加防重功能，即时短时间收到多个相同的请求，也只处理一个，其他的不处理，避免产生脏数据。

## 操作

### 基础操作
通过请求地址作为key，搭配内存缓存，实现幂等性校验。因为本文使用到了IMemoryCache，所以还需要注入该服务
```csharp
builder.Services.AddMemoryCache();
```
编写过滤器
```csharp
/// <summary>
/// 接口幂等性处理
/// </summary>
public class IdempotentAttributeFilter : Attribute, IActionFilter
{
    private readonly IMemoryCache _cache;

    public IdempotentAttributeFilter(IMemoryCache cache)
    {
        _cache = cache;
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        //可以根据用户ID或者请求地址标识当前用户
        var path = context.HttpContext.Request.Path;
        var userId = "123456";//这个可以从上下文中获取

        var key = "IdempotencyKey" + userId + path.ToString();

        var method = context.HttpContext.Request.Method;
        if (method == "POST" || method == "put")
        {
            //直接限制了该接口不允许一个用户在2秒内请求多次
            var cacheData = _cache.Get<string>(key);
            if (cacheData != null)
            {
                throw new ParameterException("不允许重复提交");
            }

            _cache.Set(key, "1", TimeSpan.FromSeconds(2));
        }
    }
}
```
更合适的写法是，使用redis(可以不怕服务部署多个节点)，然后根据用户标识作为key，并且也要检验当前请求体的内容是不是也上一次也一样。
全局使用
```csharp
builder.Services.AddControllers(option =>
{
    //添加全局过滤器
    option.Filters.Add(typeof(IdempotentAttributeFilter));
});
```
将不带幂等性的接口(Post、Put)，增加限制一个用户在2秒内只能请求1次，防止重复提交。但是上面的方法只能根据地址进行判断是否重复，应该再加上根据参数判断。

### 升级操作
将第一次请求的某些参数作为标识符存入redis中，并设置过期时间，下次请求过来，先检查redis相同的请求是否已被处理，并且可以让使用者自定义标识符的字段和过期时间。

创建过滤器
```csharp
/// <summary>
/// 阻止重复请求的过滤器
/// 原理：将第一次请求的某些参数作为标识符存入redis中，并设置过期时间，下次请求过来，先检查redis相同的请求是否已被处理
/// </summary>
public class PreventDuplicateRequestsActionFilter : IAsyncActionFilter
{
    public string[] FactorNames { get; set; }
    public TimeSpan? ExpiredSeconds { get; set; }

    private readonly IDistributedCache _cache;
    private readonly ILogger<PreventDuplicateRequestsActionFilter> _logger;

    public PreventDuplicateRequestsActionFilter(IDistributedCache cache, ILogger<PreventDuplicateRequestsActionFilter> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var factorValues = new string[FactorNames.Length];

        // PreventDuplicateRequestsActionFilter里，我们首先通过反射从 ActionArguments拿到指定参数字段的值，由于从request body取值略有不同，我们需要分开处理
        var isFromBody =
            context.ActionDescriptor.Parameters.Any(r => r.BindingInfo?.BindingSource == BindingSource.Body);
        if (isFromBody)
        {
            var parameterValue = context.ActionArguments.FirstOrDefault().Value;
            factorValues = FactorNames.Select(name =>
                parameterValue?.GetType().GetProperty(name)?.GetValue(parameterValue)?.ToString()).ToArray();
        }
        else
        {
            for (var index = 0; index < FactorNames.Length; index++)
            {
                if (context.ActionArguments.TryGetValue(FactorNames[index], out var factorValue))
                {
                    factorValues[index] = factorValue?.ToString();
                }
            }
        }

        if (factorValues.All(string.IsNullOrEmpty))
        {
            _logger.LogWarning("Please config FactorNames.");

            await next();
            return;
        }

        var idempotentKey = $"{context.HttpContext.Request.Path.Value}:{string.Join("-", factorValues)}";
        var idempotentValue = await _cache.GetStringAsync(idempotentKey);
        if (idempotentValue != null)
        {
            //如果key已经存在，我们需要短路请求，这里直接返回的是 Accepted (202)而不是Conflict (409)或者其它错误状态，是为了避免上游已经调用失败而继续重试。
            _logger.LogWarning("Received duplicate request({},{}), short-circuiting...", idempotentKey, idempotentValue);
            context.Result = new AcceptedResult();
        }
        else
        {
            await _cache.SetStringAsync(idempotentKey, DateTimeOffset.UtcNow.ToString(),
                new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = ExpiredSeconds });
            await next();
        }
    }
}
```
创建特性用于传递过期时间和自定义校验因子
```csharp
/// <summary>
/// 增加一个特性用于定义过期时间和自定义标识符
/// </summary>
[AttributeUsage(AttributeTargets.Method)]
public class PreventDuplicateRequestsAttribute : Attribute, IFilterFactory
{
    private readonly string[] _factorNames;
    private readonly int _expiredSeconds;

    /// <summary>
    /// 防重特性
    /// </summary>
    /// <param name="expiredSeconds">过期的描述</param>
    /// <param name="factorNames">自定义因子</param>
    public PreventDuplicateRequestsAttribute(int expiredSeconds, params string[] factorNames)
    {
        _expiredSeconds = expiredSeconds;
        _factorNames = factorNames;
    }

    public IFilterMetadata CreateInstance(IServiceProvider serviceProvider)
    {
        var filter = serviceProvider.GetService<PreventDuplicateRequestsActionFilter>();
        filter.FactorNames = _factorNames;
        filter.ExpiredSeconds = TimeSpan.FromSeconds(_expiredSeconds);
        return filter;
    }

    public bool IsReusable => false;
}
```
然后就是我们的注册部分了，因为我们用了缓存，这个时候我们需要注册缓存以及自定义过滤器
```csharp
builder.Services.AddDistributedMemoryCache();
builder.Services.AddScoped<PreventDuplicateRequestsActionFilter>();
```
然后我们在方法上使用的时候可以这么使用
```csharp
/// <summary>
/// 患者吃饭请求
/// </summary>
/// <param name="request"></param>
/// <returns></returns>
[HttpPost]
[PreventDuplicateRequests(10, "PatientId")]
public string AddPatientEat(AddPatientEatRequest request)
{
    return JsonConvert.SerializeObject(request);
}
```
然后启动项目，进行调用发现已经实现了我们想要的相同参数防重的功能。

## 其他资料

在 ASP.NET Core 中实现幂等 REST API：[https://www.milanjovanovic.tech/blog/implementing-idempotent-rest-apis-in-aspnetcore](https://www.milanjovanovic.tech/blog/implementing-idempotent-rest-apis-in-aspnetcore)
