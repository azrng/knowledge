---
title: 概述
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: at1zgv
docsId: '88937023'
---

## 概述
关于DiagnosticSource它本身是一个基于发布订阅模式的工作模式，由于它本身的实现方式是异步的，所以不仅仅可以把它用到日志上，还可以用它实现异步操作，或者用它简化实现发布订阅的功能。DiagnosticSource本身是一个抽象类，我们最常用到的是它的子类DiagnosticListener，通过DiagnosticSource的Write方法实现发布一条有具体名称的消息，然后通过IObserver去订阅消息。DiagnosticListener可以实现不同的实例，每个实例可以有自己的名称，每个实例还可以发布不同名称的消息，好比一个在写代码的时候我们可以定义多个程序集，一个程序集下面可以包含多个命名空间。

## 历史
> 资料来自：[https://www.cnblogs.com/savorboard/p/diagnostics.html](https://www.cnblogs.com/savorboard/p/diagnostics.html)

让我们把时间往前拉回到 2013 年 8 月，微软在 NuGet 发布了一个新的关于 Diagnostics 的包叫做 [Microsoft.Diagnostics.Tracing.TraceEvent](https://www.nuget.org/packages/Microsoft.Diagnostics.Tracing.TraceEvent)，这个包用来为 Windows 事件追踪（ETW）提供一个强大的支持，使用这个包可以很容易的为我们在云环境和生产环境来提供端到端的监控日志事件记录，它轻量级，高效，并且可以和系统日志进行交互。
总结一下，对 Diagnostics 下个定义 ：在应用程序出现问题的时候，特别是出现可用性或者性能问题的时候，开发人员或者IT人员经常会对这些问题花费大量的时间来进行诊断，很多时候生产环境的问题都无法复现，这可能会对业务造成很大的影响，Diagnostics 就是提供一组功能使我们能够很方便的可以记录在应用程序运行期间发生的关键性操作以及他们的执行时间等，使管理员可以查找特别是生产环境中出现问题所在的根本原因。

### NETF之EventSource
在 .NET Framework 中 EventSource 通过 Windows ETW 提供的 ETW Channels 与其进行集成，下面给出一个示例代码：
```csharp
[EventSource(Name = "Samples-EventSourceDemos-Minimal")]
public sealed class MinimalEventSource : EventSource
{
    // Define singleton instance
    public static MinimalEventSource Log = new MinimalEventSource();

    // Define Event methods
    public void Load(long baseAddress, string imageName)
    {
        WriteEvent(1, baseAddress, imageName);
    }
}
```
> 注意：在.Net Framework 4.5以及更高版本，EventSouce已经被集成到了System命名空间。

由于 EventSource 只支持 Windows，所以在全新的 .NET Core 中，它已经被悄悄的取代了，下面我们来看一下全新的 DiagnosticSource。

### .Net Core之DiagnosticSource
在 .NET Core 中 .NET 团队设计了一个全新的 DiagnosticSource，新的 DiagnosticSource 非常的简单，它允许你在生产环境记录丰富的 payload 数据，然后你可以在另外一个消费者可以消费感兴趣的记录。先来说说 DiagnosticSource 和上面的 EventSource 的区别，他们的架构设计有点类似，主要区别是 EventSource 它记录的数据是可序列化的数据，会被在进程外消费，所以要求记录的对象必须是可以被序列化的。而 DiagnosticSource 被设计为在进程内处理数据，所以通过它可以拿到更加丰富的一些数据信息，它支持非序列化的对象，比如 HttpContext , HttpResponseMessage 等。如果你想在 EventSource 中获取 DiagnosticSource 中的事件数据，你可以通过 DiagnosticSourceEventSource 这个对象来进行数据桥接。

## 操作
对于DiagnosticSource还说到了一个子类DiagnosticListener，关于DiagnosticSource的处理都是围绕着DiagnosticListener实现的。

### Debug和Trace

在 System.Diagnostics 命名空间中有 Debug、Trace两个类型，用于追踪代码指定的Debug、Trace，可以打印调试信息并使用断点检查逻辑，而不会影响程序运行的性能。区别是Debug只在Debug环境下生效在Release环境下失效，除此之外两者的接口几乎一样

#### 使用Debug调试

当 sum 的值在 100 以内时程序正常执行，当 sum 的值大于等于 100时会触发断点，IDE 会跳转到该位置，此时会引起我们的注意。

```csharp
using System.Collections.Generic;
using System.Diagnostics;

List<int> ls = new List<int> { 30, 40, 50 };
Sum(ls);

static int Sum(List<int> ls)
{
    var sum = 0;
    foreach (var item in ls)
    {
        sum += item;
        // 当条件为否时触发
        // Debug.Assert(condition: sum < 100);
        Debug.Assert(condition: sum < 100, message: "数据量有点大");
    }

    return sum;
}
```

通过 Debug、Trace 打印信息，方法有 Write 、WriteLine 、 WriteIf 、 WriteLineIf 、Print 等，默认打印到 IDE 的调试输出。

#### 使用监听器

可以通过监听器将信息打印到控制台或者文件中，比如将调试信息打印到控制台，可以通过注册相关的监听器

```csharp
// Debug使用的是Trace的监听器，所以直接给Trace配置即可
Trace.Listeners.Add(new ConsoleTraceListener());

Debug.WriteLine("打印调试信息");
```

.NET 中主要有以下监听器 DefaultTraceListener、TextWriterTraceListener、ConsoleTraceListener、DelimitedListTraceListener、EventLogTraceListener 等。



如果需要输出到文件中，可以自行继承 `TextWriterTraceListener` ，编写文件流输出，也可以使用 DelimitedListTraceListener。

::: tip

但是我测试没有输出到文件中

:::

```csharp
// TraceListener listener = new TextWriterTraceListener(new FileStream(@"C:\debugfile.txt", FileMode.OpenOrCreate));
TraceListener listener = new DelimitedListTraceListener(@"D:\debugfile.txt");
Trace.Listeners.Add(listener);

Debug.WriteLine("打印调试信息");
```

### 简单发布消息

```csharp
/// <summary>
/// 编写日志
/// </summary>
/// <returns></returns>
[HttpGet("write")]
public string WriteLogger()
{
    //声明DiagnosticListener并命名为MyTest
    DiagnosticSource diagnosticSource = new DiagnosticListener("MyTest");
    string pubName = "MyTest.Log";
    //判断是否存在MyTest.Log的订阅者
    if (diagnosticSource.IsEnabled(pubName))
    {
        //发送名为MyTest.Log的消息，包含Name，Address两个属性
        diagnosticSource.Write(pubName, new { Name = "张三", Address = "武陟县" });
    }

    return "success";
}
```
通过上面的方式我们就可以完成针对消息的发布，其中的IsEnabled方法，这个是用来判断是否存在对应名称的消费者，这样就可以有效避免发送无效的消息。

### 订阅发布
订阅消息是通过IObserver接口实现的，IObserver代表了订阅者。虽然我们通过DiagnosticSource去发布消息，但是真正描述发布者身份的是IObservable接口，IObservable的唯一方法Subscribe是用来注册订阅者IObserver，但是默认系统并没有为我们提供一个具体的实现类，所以我们需要定义一个IObserver订阅者的实现类。
```csharp
public class MyObserver<T> : IObserver<T>
{
    private readonly Action<T> _next;

    public MyObserver(Action<T> next)
    {
        _next = next;
    }

    public void OnCompleted()
    {
    }

    public void OnError(Exception error)
    {
    }

    public void OnNext(T value) => _next(value);
}
```
有了具体的订阅者实现类，我们就可以为发布者注册订阅者了，具体实现如下：
```csharp
public class LoggerHostService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        //AllListeners获取所有发布者，Subscribe为发布者注册订阅者MyObserver
        DiagnosticListener.AllListeners.Subscribe(new MyObserver<DiagnosticListener>(listener =>
        {
            //判断发布者的名字
            if (listener.Name == "MyTest")
            {
                //方案一： 获取订阅信息
                listener.Subscribe(new MyObserver<KeyValuePair<string, object?>>(listenerData =>
                {
                    Console.WriteLine($"监听名称:{listenerData.Key}");
                    dynamic data = listenerData.Value;
                    //打印发布的消息
                    Console.WriteLine($"获取的信息为 姓名：{data.Name} 地址：{data.Address}");
                }));
            }
        }));
        return Task.CompletedTask;
    }
}
```
首先发布者注册订阅者，然后订阅者获取发布的消息，上面的方法还是比较繁琐的，所以我们可以通过另外的方法来处理。

安装nuget包
```csharp
<PackageReference Include="Microsoft.Extensions.DiagnosticAdapter" Version="3.1.27" />
```
该包主要解决了订阅者注册难的问题以及消息解析男的问题，用了这个包我们可以直接订阅一个适配类来充当订阅者的载体，其次我们可以定义方法来获取发布的消息，参数就是我们发布的消息内容。
```csharp
/// <summary>
///我的诊断监听服务
/// </summary>
public class MyDiagnosticListener
{
    //发布的消息主题名称
    [DiagnosticName("MyTest.Log")]
    public void MyLog(string name, string address)
    {
        Console.WriteLine($"监听名称:MyTest.Log");
        Console.WriteLine($"获取的信息为 姓名：{name} 地址：{address}");
    }
}
```
想让方法订阅消息，需要在方法上声明DiagnosticName，然后名称就是你要订阅消息的名称，方法的参数就是你发布消息的字段属性名称。
> 订阅的参数名称需要和发布属性名称一致。


监听订阅处理
```csharp
public class LoggerHostService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        //AllListeners获取所有发布者，Subscribe为发布者注册订阅者MyObserver
        DiagnosticListener.AllListeners.Subscribe(new MyObserver<DiagnosticListener>(listener =>
        {
            //判断发布者的名字
            if (listener.Name == "MyTest")
            {
                listener.SubscribeWithAdapter(new MyDiagnosticListener());
            }
        }));
        return Task.CompletedTask;
    }
}
```
如果想自定义订阅者，还有更加简介的实现方式，所以整个过程可以简化为：
```csharp
//声明DiagnosticListener并命名为MyTest
DiagnosticListener diagnosticSource = new DiagnosticListener("MyTest");

//直接去适配订阅者
diagnosticSource.SubscribeWithAdapter(new MyDiagnosticListener());

string pubName = "MyTest.Log";
//判断是否存在MyTest.Log的订阅者
if (diagnosticSource.IsEnabled(pubName))
{
    //发送名为MyTest.Log的消息，包含Name，Address两个属性
    diagnosticSource.Write(pubName, new { Name = "张三", Address = "武陟县" });
}
```
这种方案极大的节省了工作量，但是这种写法只能针对特定的DiagnosticListener进行订阅处理，如果你需要监听所有发布者，就需要使用DiagnosticListener.AllListeners.Subscribe的方式。

## NetCore的应用
在.Net Core的源码中，微软默认在涉及到网络请求或处理请求等许多重要的节点都使用了DiagnosticListener来发布拦截的消息，接下来就罗列一些我知道的比较常见的埋点，通过这些操作我们就可以看出，诊断日志还是很便利的，而且微软在.Net Core中也非常重视它的使用。

当我们通过ConfigureWebHostDefaults配置Web主机的时候，程序就已经默认给我们注入了诊断名称为Microsoft.AspNetCore的DiagnosticListener和DiagnosticSource，这样我们就可以很方便的在程序中直接获取DiagnosticListener实例去发布消息或者监听发布的内部消息，具体注入逻辑位于可以去GenericWebHostBuilder类中查看[点击查看源码](https://github.com/dotnet/aspnetcore/blob/v3.1.7/src/Hosting/Hosting/src/GenericHost/GenericWebHostBuilder.cs#L80)

## 资料
在 .NET Core 中使用 Diagnostics (Diagnostic Source) 记录跟踪信息：[https://www.cnblogs.com/savorboard/p/diagnostics.html](https://www.cnblogs.com/savorboard/p/diagnostics.html)
.Net Core中的诊断日志DiagnosticSource讲解：[https://www.cnblogs.com/wucy/p/13532534.html](https://www.cnblogs.com/wucy/p/13532534.html)

[https://article.itxueyuan.com/vOKZPZ](https://article.itxueyuan.com/vOKZPZ)
