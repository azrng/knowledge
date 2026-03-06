---
title: 请求限制窗口算法
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qingqiuxianzhichuangkousuanfa
slug: xngyes
docsId: '72276624'
---

## 目的
在实际项目中，为了保障服务器的稳定运行，需要对接口的可访问频次进行限流控制，避免因客户端频繁请求导致服务器压力过大。所以我们会进行限制一分钟或者一段时间内只能请求多少次，常见的是固定窗口算法。

也可以直接使用网上开源的组件来实现

令牌桶算法和漏斗算法
[限流](https://www.yuque.com/docs/share/9f6d29ab-4a8a-4aa9-9d41-2b2b5512a4cf?view=doc_embed)

## 固定窗口算法
固定窗口算法是将时间线划分为固定大小的窗口，并为每个窗口分配一个计数器。每个请求，根据其到达时间，被映射到一个窗口。如果窗口中的计数器已达到限制，则拒绝落在此窗口中的请求。
例如，如果我们将窗口大小设置为1分钟，每分钟允许10个请求：
![image.png](/common/1660705345235-a574d724-958f-4895-a908-bc5ac69bc51b.png)
59秒的请求将被阻止,因为这时已经接受了10个请求。1分钟时计数器归零，所以1分01秒的请求可以接受。
**固定窗口算法的问题主要在于，如果在窗口边缘发生大量请求，会导致限流策略失效。**
比如，在59秒接收了9个请求，在1分01秒又可以再接收10个请求，相当于每分钟允许了20个请求。

## 滑动窗口算法
滑动窗口类似于固定窗口算法，但它通过将前一个窗口中的加权计数添加到当前窗口中的计数来计算估计数，如果估计数超过计数限制，则请求将被阻止。
具体公式如下：
```csharp
估计数 = 前一窗口计数 * (1 - 当前窗口经过时间 / 单位时间) + 当前窗口计数
```
例如，假设限制为每分钟10个：
![image.png](/common/1660705386980-b02d9211-9097-41f9-8b98-13b64cb17c09.png)
窗口[00:00, 00:01)中有9个请求，窗口[00:01, 00:02)中有5个请求。对于01:15(1分15秒)到达的请求，即窗口[00:01, 00:02)的25%位置，通过公式计算请求计数：9 x (1 - 25%) + 5 = 11.75 > 10. 因此我们拒绝此请求。
**即使两个窗口都没有超过限制，请求也会被拒绝，因为前一个和当前窗口的加权和确实超过了限制。**

### 实现
根据上面的公式，实现滑动窗口算法代码如下：
```csharp
public class SlidingWindow
{
    private readonly object _syncObject = new object();

    private readonly int _requestIntervalSeconds;
    private readonly int _requestLimit;

    private DateTime _windowStartTime;
    private int _prevRequestCount;
    private int _requestCount;

    public SlidingWindow(int requestLimit, int requestIntervalSeconds)
    {
        _windowStartTime = DateTime.Now;
        _requestLimit = requestLimit;
        _requestIntervalSeconds = requestIntervalSeconds;
    }

    public bool PassRequest()
    {
        lock (_syncObject)
        {
            var currentTime = DateTime.Now;
            var elapsedSeconds = (currentTime - _windowStartTime).TotalSeconds;

            if (elapsedSeconds >= _requestIntervalSeconds * 2)
            {
                _windowStartTime = currentTime;
                _prevRequestCount = 0;
                _requestCount = 0;

                elapsedSeconds = 0;
            }
            else if (elapsedSeconds >= _requestIntervalSeconds)
            {
                _windowStartTime = _windowStartTime.AddSeconds(_requestIntervalSeconds);
                _prevRequestCount = _requestCount;
                _requestCount = 0;

                elapsedSeconds = (currentTime - _windowStartTime).TotalSeconds;
            } 

            var requestCount = _prevRequestCount * (1 - elapsedSeconds / _requestIntervalSeconds) + _requestCount + 1;
            if (requestCount <= _requestLimit)
            {
                _requestCount++;
                return true;
            }
        }

        return false;
    }
}
```
如果最近的2次请求相距2个窗口时间，则可以认为前一窗口计数为0，重新开始计数。

### 使用
新建Middleware，使用滑动窗口算法进行限流：
```csharp
public class RateLimitMiddleware : IMiddleware
{
    private readonly SlidingWindow _window;

    public RateLimitMiddleware()
    {
        _window = new SlidingWindow(10, 60);
    }
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (!_window.PassRequest())
        {
            context.SetEndpoint(new Endpoint((context) =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            },
                        EndpointMetadataCollection.Empty,
                        "限流"));
        }

        await next(context);
    }
}
```
**需要注意的是，我们注册Middleware时，必须使用单例模式，保证所有请求通过同一SlidingWindow计数**
```csharp
services.AddSingleton<RateLimitMiddleware>();
```

点评：上面的算法对于上一个窗口的计算是平均值算法，还是不太精准。

## 滑动窗口算法简单方案
定义一个线程安全的集合，每次请求的时候移除一分钟之前的数据，然后判断一下还剩余多少，剩余的超过限制的就设置不允许访问，访问频繁了。
```csharp
/// <summary>
/// 请求限制中间件
/// </summary>
public class RateLimitMiddleware2 : IMiddleware
{
    // 还未做线程安全处理
    private static List<DateTime> _requestList = new List<DateTime>();

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        const int requestIntervalSeconds = 60;
        const int requestLimit = 5;

        _requestList = _requestList.Where(t => t >= DateTime.Now.AddSeconds(-requestIntervalSeconds)).ToList();

        if (_requestList.Count > requestLimit)
        {
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            var result = new ResultModel { Message = "请求频繁", IsSuccess = false };
            await context.Response.WriteAsync(JsonConvert.SerializeObject(result));
        }

        await next(context);
    }
}
```

## 结论
使用滑动窗口算法，可以有效避免固定窗口算法存在的窗口边缘大量请求无法限制的问题。

## 资料
[https://mp.weixin.qq.com/s/H52dz6QVuJwCuQN5pbP7rg](https://mp.weixin.qq.com/s/H52dz6QVuJwCuQN5pbP7rg) | ASP.NET Core基于滑动窗口算法实现限流控制
https://mp.weixin.qq.com/s/c_dgU-btHOrWZ7_oFI1pWA | 两种基于时间窗口的限流器的简单实现
