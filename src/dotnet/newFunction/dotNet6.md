---
title: .Net6 API
lang: zh-CN
date: 2023-10-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: _net6api
slug: ky8n29
docsId: '61700464'
---
**读写文件**
在 .NET 6 中，有一个新的 API 可以在不使用 FileStream 的情况下读取/写入文件。它还支持分散/聚集 IO（多个缓冲区）和给定文件偏移量的覆盖读取和写入。
```csharp
using SafeFileHandle handle = File.OpenHandle("ConsoleApp128.exe");
long length = RandomAccess.GetLength(handle);
Console.WriteLine(length);
```
**进程路径和 ID**
有几种新方法可以在不分配新进程对象的情况下访问进程路径和进程 ID：
```
int pid = Environment.ProcessId;
string path = Environment.ProcessPath;
Console.WriteLine(pid); Console.WriteLine(path);
```
**CSPNG（密码安全伪随机数生成器）**
从 CSPNG（密码安全伪随机数生成器）生成随机数比以往更容易：
```csharp
// Give me 200 random bytes
byte[] bytes = RandomNumberGenerator.GetBytes(200);


private string GenerateRandomNumber(int len = 32)
{
    var randomNumber = new byte[len];
    using var rng = RandomNumberGenerator.Create();
    rng.GetBytes(randomNumber);
    return Convert.ToBase64String(randomNumber);
}

简化后
private string GenerateRandomNumber(int len = 32)
{
    var randomNumber = RandomNumberGenerator.GetBytes(len);
    return Convert.ToBase64String(randomNumber);
}
```
**Parallel.ForEachAsync**
我们最终添加了 Parallel.ForEachAsync，这是一种调度异步工作的方法，可让您控制并行度：
```csharp
var urlsToDownload = new[] { "https://dotnet.microsoft.com", "https://www.microsoft.com", "https://twitter.com/davidfowl" };
var client = new HttpClient();
await Parallel.ForEachAsync(urlsToDownload, async (url, token) =>
{
    var targetPath = Path.Combine(Path.GetTempPath(), "http_cache", url);
    HttpResponseMessage response = await client.GetAsync(url);
    if (response.IsSuccessStatusCode)
    {
        using FileStream target = File.OpenWrite(targetPath);
        await response.Content.CopyToAsync(target);
    }
});
```
**配置Helpes**
我们添加了一个帮助程序，以便在缺少必需的配置部分时更容易抛出异常：
```csharp
var configuration = new ConfigurationManager();
var options = new MyOptions();
// This will throw if the section isn't configuredconfiguration.GetRequiredSection("MyOptions").Bind(options);
class MyOptions
{    
	public string? SettingValue { get; set;}
}
```
**LINQ**
还有大量新的 LINQ 方法。在这个版本中它得到了很多人的喜爱。这是将任何 IEnumerable 分块的新Helper：
```csharp
int chunkNumber = 1;
foreach (int[] chunk in Enumerable.Range(0, 9).Chunk(3))
{    
    Console.WriteLine($"Chunk {chunkNumber++}");    
    foreach (var item in chunk)    
    {        
        Console.WriteLine(item);    
    }
}
```
**更多的LINQ**
更多 LINQ！现在有 MaxBy 和MinBy 方法：
```csharp
var people = GetPeople();
var oldest = people.MaxBy(p => p.Age); 
var youngest = people.MinBy(p => p.Age);
Console.WriteLine($"The oldest person is {oldest.Age}");
Console.WriteLine($"The youngest person is {youngest.Age}");
public record Person(string Name, int Age);
```
**Power of 2**
不要把数学放在你的脑海里？以下是一些使用 Powerof 2 的新Helper：
```csharp
// using System.Numerics;
uint bufferSize = 235;
if (!BitOperations.IsPow2(bufferSize))
{
    bufferSize = BitOperations.RoundUpToPowerOf2(bufferSize);
}
Console.WriteLine(bufferSize);
```
**WaitAsync 改进**
现在有一种更简单（并且正确实现）的方法来等待任务异步完成。如果10 秒内未完成，以下代码将放弃await。该操作可能仍在运行！这是用于不可取消的操作！
```csharp
Task operationTask = SomeLongRunningOperationAsync();
await operationTask.WaitAsync(TimeSpan.FromSeconds(10));
```
**ThrowIfNull**
在抛出异常之前不再需要在每个方法中检查 null。它现在只需一行简单的代码。
```csharp
void DoSomethingUseful(object obj)
{    
	ArgumentNullException.ThrowIfNull(obj);
}
```
**使用 NativeMemory**
如果您想使用 CAPI 来分配内存，因为您是 l33thacker或需要分配本机内存，那就使用这个吧。别忘了释放！
```csharp
//using System.Runtime.InteropServices;
unsafe
{
    byte * buffer = (byte*)NativeMemory.Alloc(100);
    NativeMemory.Free(buffer);
}
```
**Posix 信号处理**
这是关于对 Posix 信号处理的本机支持，我们还在 Windows 上模拟了几个信号。
```csharp
//using System.Runtime.InteropServices;
var tcs = new TaskCompletionSource();
PosixSignalRegistration.Create(PosixSignal.SIGTERM, context =>
{
    Console.WriteLine($"{context.Signal} fired");
    tcs.TrySetResult();
});
await tcs.Task;
```
**新的MetricsAPI**
我们在 .NET 6 中添加了一个基于[@opentelemetry ](/opentelemetry ) 的全新Metrics API。它支持维度，非常高效，并且将为流行的指标接收器提供导出器。 
```csharp
//using System.Diagnostics.Metrics;
// This is how you produce metrics
var meter = new Meter("Microsoft.AspNetCore", "v1.0");
Counter<int> counter = meter.CreateCounter<int>("Requests");
var app = WebApplication.Create(args);
app.Use((context, next) =>
{
    counter.Add(1, KeyValuePair.Create<string, object?>("path", context.Request.Path.ToString()));
    return next(context);
});
app.MapGet("/", () => "Hello World");
```
您甚至可以收听和计量：
```csharp
var listener = new MeterListener();
listener.InstrumentPublished = (instrument, meterListener) =>
{
    if (instrument.Name == "Requests" && instrument.Meter.Name == "Microsoft.AspNetCore")
    {
        meterListener.EnableMeasurementEvents(instrument, null);
    }
};
listener.SetMeasurementEventCallback<int>((instrument, measurement, tags, state) =>
{
    Console.WriteLine($"Instrument: {instrument.Name} has recorded the measurement: {measurement}");
});
listener.Start();
```
**现代定时器 API**
现代计时器 API（我认为这是 .NET 中的第5 个计时器 API）。它是完全异步的，不会有遇到其他计时器那样的问题，例如对象生命周期问题，没有异步回调等。
```csharp
var timer = new PeriodicTimer(TimeSpan.FromSeconds(1));
while (await timer.WaitForNextTickAsync())
{
    Console.WriteLine(DateTime.UtcNow);
}
```

参考文档：[https://mp.weixin.qq.com/s/9dk8g1Hm2sFig7B_S47VGQ](https://mp.weixin.qq.com/s/9dk8g1Hm2sFig7B_S47VGQ)
