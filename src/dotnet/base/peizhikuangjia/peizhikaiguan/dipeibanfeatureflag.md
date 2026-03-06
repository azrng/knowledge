---
title: 低配版FeatureFlag
lang: zh-CN
date: 2022-02-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dipeibanfeatureflag
slug: gllc7g
docsId: '64452911'
---

## 介绍
在我们的应用中，可能有一些配置开关的需求，某些功能是否启用使用一个配置开关，用的时候就打开，不用的时候就关掉，于是基于 .NET Core 的里配置体系写了一个简单的 FeatureFlag，类似于之前的 AppSetting 的扩展 [给 IConfiguration 写一个 GetAppSetting 扩展方法](http://mp.weixin.qq.com/s?__biz=MzAxMjE2NTMxMw==&mid=2456605994&idx=1&sn=5258154acdc235c71b3193aada599fc7&chksm=8c2e7c84bb59f5925ab575ca3c28c4d263c16ada9bc674dd5e7dc968ae1f09d4a4a1d3c579e7&scene=21#wechat_redirect)

## 目的
首先来看一个实现效果：
```csharp
[HttpGet("[action]")]
[FeatureFlagFilter("Flag1", DefaultValue = true)]
public IActionResult FeatureEnableTest()
{
    return Ok(new
    {
        Time = DateTime.UtcNow
    });
}

[HttpGet("[action]")]
[FeatureFlagFilter("Flag2", DefaultValue = false)]
public IActionResult FeatureDisableTest()
{
    return Ok(new
    {
        Time = DateTime.UtcNow
    });
}
```
这是两个完全一样的 API，为了测试 featureFilter 的功能
启用的 API 效果就是可以正常访问，禁用的效果，默认是返回一个 404，如果需要也可以自定义，只需要实现一个接口，注入进去即可。

## 实现
实现代码其实也比较简单，分为两部分，一部分是 IConfiguration 的扩展，从配置中获取某个配置开关的值，另外一部分则是 ASP.NET Core 相关的扩展，上面的示例是一个 MVC Filter 的一个示例，比较简单所以我们就直接看代码
IConfiguration 扩展实现代码如下：
```csharp
public static string FeatureFlagsSectionName = "FeatureFlags";

public static bool TryGetFeatureFlagValue(this IConfiguration configuration, string featureFlagName, out bool featureFlagValue)
{
    featureFlagValue = false;
    var section = configuration.GetSection(FeatureFlagsSectionName);
    if (section.Exists())
    {
        return bool.TryParse(section[featureFlagName], out featureFlagValue);
    }
    return false;
}

public static bool IsFeatureEnabled(this IConfiguration configuration, string featureFlagName, bool defaultValue = false)
{
    if (TryGetFeatureFlagValue(configuration, featureFlagName, out var value))
    {
        return value;
    }
    return defaultValue;
}
```
上面示例中的 FeatureFlagFilter 是一个 MVC 的 ResourceFilter，实现代码如下：
```csharp
public interface IFeatureFlagFilterResponseFactory
{
    public Task<IActionResult> GetResponse(ResourceExecutingContext resourceExecutingContext);
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false, Inherited = true)]
public sealed class FeatureFlagFilterAttribute : Attribute, IAsyncResourceFilter
{
    public bool DefaultValue { get; set; }
    public string FeatureFlagName { get; }
    public FeatureFlagFilterAttribute(string featureFlagName)
    {
        FeatureFlagName = featureFlagName ?? throw new ArgumentNullException(nameof(featureFlagName));
    }

    public async Task OnResourceExecutionAsync(ResourceExecutingContext context, ResourceExecutionDelegate next)
    {
        var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        if (configuration.IsFeatureEnabled(FeatureFlagName, DefaultValue))
        {
            await next();
        }
        else
        {
            var responseFactory = context.HttpContext.RequestServices
                .GetService<IFeatureFlagFilterResponseFactory>();
            if (responseFactory != null)
            {
                context.Result = await responseFactory.GetResponse(context);
            }
            else
            {
                context.Result = new NotFoundResult();
            }
        }
    }
}
```

## 总结
关于 FeatherFlag，上面只是一个简单的封装，微软有一个功能更为丰富的库来支持 Microsoft.FeatureManagement.AspNetCore,  源代码在 Github 上有需要的可以参考 https://github.com/microsoft/FeatureManagement-Dotnet

## 资料
[https://mp.weixin.qq.com/s/bn7voWTZXOkvoN1PzXaIXQ](https://mp.weixin.qq.com/s/bn7voWTZXOkvoN1PzXaIXQ) | 实现一个基于 IConfiguration 的低配版 FeatureFlag
