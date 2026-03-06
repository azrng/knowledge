---
title: Timer类
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: timerlei
slug: oi7itb
docsId: '71200502'
---

## 说明
Timer是.NET内置的定时器类，它位于命名空间System.Timers下。Timer是一个基于服务器端的计时器，提供了Interval属性来设置重复触发定时任务的间隔(单位为毫秒)，触发事件则由Elapsed事件来指定。另外，还可以通过AutoReset属性来设置Timer的Elapsed事件只触发一次或者重复触发。
文档地址：https://docs.microsoft.com/en-us/dotnet/api/system.timers.timer?view=net-6.0

## 操作

### IHostedService中使用
```csharp
public class TestHostedService : IHostedService, IDisposable
{
    private Timer? _timer;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));

        return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
        Console.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        Console.WriteLine("StopAsync");

        return Task.CompletedTask;
    }


    public void Dispose()
    {
        _timer?.Dispose();
    }
}
```
