---
title: 限制并发
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: xianzhibingfadeyibuioqingqiu
slug: oggdqc
docsId: '61616046'
---

## 前言
```csharp
// let's say there is a list of 1000+ URLs
string[] urls = { "http://google.com", "http://yahoo.com", ... };

// now let's send HTTP requests to each of these URLs in parallel
urls.AsParallel().ForAll(async (url) => {
    var client = new HttpClient();
    var html = await client.GetStringAsync(url);
});
```
这段代码有一个问题，当我开启了 1000+ 的并发请求，是否有一种简便的方式限制这些 异步http请求 并发量，比如说实现同一时刻不会超过 20 个下载，请问我该如何去实现？

## 概述

限制并发更多指的是控制可以同时执行的线程数量，它是一种资源管理和优化策略。例如，在高并发场景下，如果不限制并发数，可能会导致系统资源耗尽（如CPU、内存、数据库连接等）。通过诸如线程池（ThreadPoolExecutor）等方式可以有效地控制并发级别，限制系统中活动线程的数量，从而避免过度竞争和资源浪费。虽然这并不是直接的线程同步，但它间接地影响了线程间的协作方式，有助于整体上提升系统的稳定性和响应速度。

## 实现方案

### SemaphoreSlim
通过使用SemaphoreSlim来实现，扩展方法如下
```csharp
public static async Task ForEachAsyncConcurrent<T>(this IEnumerable<T> enumerable, 
    Func<T, Task> action, int? maxActionsToRunInParallel = null)
{
    if (maxActionsToRunInParallel.HasValue)
    {
        using (var semaphoreSlim = new SemaphoreSlim(maxActionsToRunInParallel.Value, maxActionsToRunInParallel.Value))
        {
            var tasksWithThrottler = new List<Task>();

            foreach (var item in enumerable)
            {
                // Increment the number of currently running tasks and wait if they are more than limit.
                await semaphoreSlim.WaitAsync();

                tasksWithThrottler.Add(Task.Run(async () =>
                {
                    await action(item).ContinueWith(res =>
                    {
                        // action is completed, so decrement the number of currently running tasks
                        semaphoreSlim.Release();
                    });
                }));
            }

            // Wait for all of the provided tasks to complete.
            await Task.WhenAll(tasksWithThrottler.ToArray());
        }
    }
    else
    {
        await Task.WhenAll(enumerable.Select(item => action(item)));
    }
}
```
使用方法
```csharp
await enumerable.ForEachAsyncConcurrent(
    async item =>
    {
        await SomeAsyncMethod(item);
    },5);
```

### AsyncEnumerator
建议你使用 AsyncEnumerator NuGet Package ，参考地址：
```csharp
<PackageReference Include="AsyncEnumerator" Version="4.0.2" />
```
示例
```csharp
using System.Linq;
using System.Buffers;
using Dasync.Collections;

// let's say there is a list of 1000+ URLs
string[] urls = { "http://google.com", "http://yahoo.com"};

// now let's send HTTP requests to each of these URLs in parallel
await urls.ParallelForEachAsync(async (url) => {
    var client = new HttpClient();
    var html = await client.GetStringAsync(url);
},maxDegreeOfParallelism: 20);
```

## 参考资料
[https://mp.weixin.qq.com/s/k6Tx9NnYJQLbqVvoNVgJ0w](https://mp.weixin.qq.com/s/k6Tx9NnYJQLbqVvoNVgJ0w)
