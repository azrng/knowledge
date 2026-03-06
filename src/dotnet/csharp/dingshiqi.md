---
title: 定时器
lang: zh-CN
date: 2023-10-26
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: dingshiqi
slug: nlerir
docsId: '30978127'
---

## Timer
TimerCallback委托专门用于定时器的操作，这个委托允许我们定义一个定时任务，在指定的间隔之后重复调用。实际的类型与ParameterizedThreadStart委托是一样的。
Timer类的构造函数定义如下：
public Timmer(TimerCallback callback,Object state,long dueTime,long period)
Callback表示一个时间到达时执行的委托，这个委托代表的方法必须符合委托TimerCallback的定义。
State表示当调用这个定时器委托时传递的参数。
dutTime表示从创建定时器到第一次调用时延迟的时间，以毫秒为单位。
Period表示定时器开始之后，每次调用之间的时间间隔，以毫秒为单位。
示例,使用TimerCallback每隔一秒钟输出一次时间：
```csharp
class Program
{
    static void Main(string[] args)
    {
        System.Threading.Timer clock = new System.Threading.Timer(ConsoleApplication1.Program.ShowTime, null, 0, 1000);
        Console.ReadKey();
    }
    public static void ShowTime(object userData)
    {
        Console.WriteLine(DateTime.Now.ToString());
    }
}
```

## PeriodicTimer
.Net6中新增加的类，可以用来创建定时器，通过固定间隔的时间调用回调函数，操作如下
```csharp
async Task Main()
{
	using var time = new PeriodicTimer(TimeSpan.FromSeconds(5));
	while (await time.WaitForNextTickAsync())
	{
		DateTime.Now.Dump();
	}
}
```
相比较传统的Timer优势在于

- 支持异步等待指定的时间间隔
- 在回调执行的过程中，我们可以阻止下一次回调的执行，直到我们完成了当前的操作。


## TimerQueue
揭秘 .NET 中的 TimerQueue（上）[https://www.cnblogs.com/eventhorizon/p/17557821.htmlTimerQueue](https://www.cnblogs.com/eventhorizon/p/17557821.htmlTimerQueue) 是.NET中实现定时任务的核心组件，它是一个定时任务的管理器，负责存储和调度定时任务。它被用于实现很多 .NET 中的定时任务，比如 System.Threading.Timer、Task.Delay、CancellationTokenSource 等。笔者将用两篇文章为大家介绍 TimerQueue 的实现原理，本篇文章将以 System.Threading.Timer 为入口，揭秘 TimerQueue 对定时任务基本单元 TimerQueueTimer的管理和调度。

## 资料
PeriodicTime：[https://learn.microsoft.com/zh-cn/dotnet/api/system.threading.periodictimer?view=net-7.0](https://learn.microsoft.com/zh-cn/dotnet/api/system.threading.periodictimer?view=net-7.0)
使用托管服务实现后台任务：[https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-6.0&tabs=visual-studio](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/host/hosted-services?view=aspnetcore-6.0&tabs=visual-studio)
