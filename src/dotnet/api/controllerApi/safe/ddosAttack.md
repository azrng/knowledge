---
title: DDOS攻击
lang: zh-CN
date: 2023-06-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ddosgongji
slug: fqyosh
docsId: '30622006'
---
DDOS攻击在网上很常见，这种攻击简单有效，可以让一个网站瞬间开始并长时间无法响应。通常来说，网站可以通过多种节流方法来避免这种情况。
下面我们换一种方式，用中间件MiddleWare来限制特定客户端IP的请求数量。
```csharp
public class DosAttackMiddleware
{
    private static Dictionary<string, short> _IpAdresses = new Dictionary<string, short>();
    private static Stack<string> _Banned = new Stack<string>();
    private static Timer _Timer = CreateTimer();
    private static Timer _BannedTimer = CreateBanningTimer();

    private const int BANNED_REQUESTS = 10;
    private const int REDUCTION_INTERVAL = 1000; // 1 second    
    private const int RELEASE_INTERVAL = 5 * 60 * 1000; // 5 minutes    
    private RequestDelegate _next;

    public DosAttackMiddleware(RequestDelegate next)
 	{
        _next = next;
    }
    public async Task InvokeAsync(HttpContext httpContext)
    {
        string ip = httpContext.Connection.RemoteIpAddress.ToString();

        if (_Banned.Contains(ip))
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
        }

        CheckIpAddress(ip);

        await _next(httpContext);
    }

    private static void CheckIpAddress(string ip)
    {
        if (!_IpAdresses.ContainsKey(ip))
        {
            _IpAdresses[ip] = 1;
        }
        else if (_IpAdresses[ip] == BANNED_REQUESTS)
        {
            _Banned.Push(ip);
            _IpAdresses.Remove(ip);
        }
        else
        {
            _IpAdresses[ip]++;
        }
    }

    private static Timer CreateTimer()
    {
        Timer timer = GetTimer(REDUCTION_INTERVAL);
        timer.Elapsed += new ElapsedEventHandler(TimerElapsed);
        return timer;
    }

    private static Timer CreateBanningTimer()
    {
        Timer timer = GetTimer(RELEASE_INTERVAL);
        timer.Elapsed += delegate {
            if (_Banned.Any()) _Banned.Pop();
        };
        return timer;
    }

    private static Timer GetTimer(int interval)
    {
        Timer timer = new Timer();
        timer.Interval = interval;
        timer.Start();
        return timer;
    }

    private static void TimerElapsed(object sender, ElapsedEventArgs e)
    {
        foreach (string key in _IpAdresses.Keys.ToList())
        {
            _IpAdresses[key]--;
            if (_IpAdresses[key] == 0) _IpAdresses.Remove(key);
        }
    }
}

```
代码中设置：1秒（1000ms）中有超过10次访问时，对应的IP会被禁用5分钟。
使用时，在Startup.cs中直接加载中间件：
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    ...
    app.UseMiddleware<DosAttackMiddleware>();
    ...
}
```
