---
title: 中间件调用顺序和批量注册
lang: zh-CN
date: 2023-04-11
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zhongjianjiandiaoyongshunxuhepiliangzhuce
slug: cglnew
docsId: '49486367'
---

## 开篇语
ASP.NET Core 请求管道包含一系列请求委托，依次调用。而调用顺序实际上就是我们在Startup.cs中注册（使用UseMiddlewareExtensions.UseMiddleware方法）它们的顺序。不过如果直接频繁去修改Startup类，那么使得代码比较凌乱，可读性比较差。

## 操作
通过反射获取指定的中间件然后实现有序批量注册

### 编写自定义特性
```csharp
[AttributeUsage(AttributeTargets.Class)]
public class MiddlewareRegisterAttribute : Attribute
{
    /// <summary>
    /// 注册顺序
    /// </summary>
    public int Sort { get; set; } = int.MaxValue;
}
```

### 编写自定义注册类
```csharp
public class MiddlewareRegisterInfo
{
    public MiddlewareRegisterInfo(Type type, MiddlewareRegisterAttribute attribute)
    {
        Type = type;
        Sort = attribute.Sort;
    }

    public Type Type { get; private set; }
    public int Sort { get; private set; }
}
```

### 编写我们的中间件
```csharp
[MiddlewareRegister(Sort = 1)]
public class OneMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<OneMiddleware> _logger;

    public OneMiddleware(RequestDelegate next, ILogger<OneMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation("OneMiddleware");
        await _next(context).ConfigureAwait(false);
    }
}

[MiddlewareRegister(Sort = 2)]
public class TwoMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TwoMiddleware> _logger;

    public TwoMiddleware(RequestDelegate next, ILogger<TwoMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation("TwoMiddleware");
        await _next(context).ConfigureAwait(false);
    }
}
```

### 封装注册扩展方法
读取Assembly中的Type,如果存在MiddlewareRegisterAttribute就把它放入`IEnumerable<MiddlewareRegisterInfo>`列表中，最后根据Sort属性顺序依次注册，代码如下：
```csharp
public static class MiddlewareRegisterExtensions
{
    private static readonly IEnumerable<MiddlewareRegisterInfo> MiddlewareRegisterInfos =
        GetMiddlewareRegisterInfos();

    public static IApplicationBuilder UseMiddlewares(this IApplicationBuilder applicationBuilder)
    {
        foreach (var middlewareRegisterInfo in MiddlewareRegisterInfos)
        {
            applicationBuilder.UseMiddleware(middlewareRegisterInfo.Type);
        }

        return applicationBuilder;
    }

    private static IEnumerable<MiddlewareRegisterInfo> GetMiddlewareRegisterInfos()
    {
        var middlewareRegisterInfos = new List<MiddlewareRegisterInfo>();
        //所有包含Middleware的Assembly
        var assemblies = new Assembly[] {typeof(Startup).Assembly};
        foreach (var assembly in assemblies)
        {
            foreach (var type in assembly.GetTypes().Where(x => !x.IsAbstract && x.IsClass))
            {
                var attribute = type.GetCustomAttribute<MiddlewareRegisterAttribute>();
                if (attribute != null)
                {
                    middlewareRegisterInfos.Add(new MiddlewareRegisterInfo(type, attribute));
                }
            }
        }

        return middlewareRegisterInfos.OrderBy(p => p.Sort).ToList();
    }
}
```

### 使用中间件
在Startup的Configure方法中使用中间件扩展方法
```csharp
app.UseMiddlewares();
```
结果
![image.png](/common/1626851699929-4e7a02f1-d09c-4bc8-bfe5-ac25b818a57e.png)
如果后期中间件顺序有调整。那么调整中间件对应的特性，不过这种还得使用特性，并且改的时候还得找到每个中间件去修改，所以我觉得下面这种方法应该也可以
```csharp
public class MiddlewareRegisterInfo
{
    public MiddlewareRegisterInfo(int sort, Type type)
    {
        Type = type;
        Sort = sort;
    }

    public Type Type { get; }
    public int Sort { get; }
}

public static class MiddlewareRegisterExtensions
{
    public static IApplicationBuilder UseMiddlewares(this IApplicationBuilder applicationBuilder)
    {
        // 需要注册的中间件
        var middlewareList = new List<MiddlewareRegisterInfo>
        {
            new MiddlewareRegisterInfo(2, typeof(OneMiddleware)),
            new MiddlewareRegisterInfo(1, typeof(TwoMiddleware)),
        };
        foreach (var middlewareRegisterInfo in middlewareList.OrderBy(t => t.Sort))
        {
            applicationBuilder.UseMiddleware(middlewareRegisterInfo.Type);
        }

        return applicationBuilder;
    }
}
```
好处就是可以只在该方法中就可以设置排序问题(其实仔细想想，不就是注册个中间件，又不是多多，直接修改startup也不碍事)

## 参考文档
> [https://mp.weixin.qq.com/s/kq24_5_Z3w-OVsc2ssbu-g](https://mp.weixin.qq.com/s/kq24_5_Z3w-OVsc2ssbu-g)

