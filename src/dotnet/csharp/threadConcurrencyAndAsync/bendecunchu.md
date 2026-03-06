---
title: 本地存储
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: bendecunchu
slug: gdd3pf
docsId: '66671264'
---

## 概述
AsyncLocal是一个在异步环境中存储和传递状态的类型。它允许你在线程或任务之间共享数据，而不会受到异步上下文切换的影响,用于提供异步操作间的数据共享。在多线程或异步环境中，每个线程或任务可以拥有自己的副本，而不会相互干扰。

## 操作

### 进程共享值
将需要共享的变量放在某一个类的静态属性上

### 线程共享值
使用ThreadStatic来实现一个线程上值的存储。
```csharp
[ThreadStatic]
private static string _value;
```
除了可以使用 ThreadStaticAttribute 外，我们还可以使用 `ThreadLocal<T>` 、CallContext（.NetCore不支持） 、`AsyncLocal<T>` 来实现一样的功能。

异步切换的场景存取值
```csharp
class Program
{
    [ThreadStatic]
    private static string _threadStatic;
    private static ThreadLocal<string> _threadLocal = new ThreadLocal<string>();
    private static AsyncLocal<string> _asyncLocal = new AsyncLocal<string>();
    static void Main(string[] args)
    {
        _threadStatic = "ThreadStatic保存的数据";
        _threadLocal.Value = "ThreadLocal保存的数据";
        _asyncLocal.Value = "AsyncLocal保存的数据";
        PrintValuesInAnotherThread();
        Console.ReadKey();
    }

    private static void PrintValuesInAnotherThread()
    {
        Task.Run(() =>
        {
            Console.WriteLine($"ThreadStatic: {_threadStatic}");
            Console.WriteLine($"ThreadLocal: {_threadLocal.Value}");
            Console.WriteLine($"AsyncLocal: {_asyncLocal.Value}");
        });
    }
}
```
输出结果
```csharp
ThreadStatic:
ThreadLocal:
AsyncLocal: AsyncLocal保存的数据
```
在线程发生了切换之后，只有 AsyncLocal 还能够保留原来的值，当然，.NET Framework 中的 CallContext 也可以实现这个需求，下面给出一个相对完整的总结。

| 实现方式 | .NET FrameWork 可用 | .NET Core 可用 | 是否支持数据流向辅助线程 |
| --- | --- | --- | --- |
| ThreadStaticAttribute | 是 | 是 | 否 |
| `ThreadLocal<T>` | 是 | 是 | 否 |
| CallContext.SetData(string name, object data) | 是 | 否 | 仅当参数 data 对应的类型实现了 ILogicalThreadAffinative 接口时支持 |
| CallContext.LogicalSetData(string name, object data) | 是 | 否 | 是 |
| `AsyncLocal<T>` | 是 | 是 | 是 |


## 实践

### 异步的AsyncLocal的数据都是独立

- AsyncLocal主要是用来在同一个异步控制流内共享对象的，如：一个web请求经过多个 async/await 方法调用后（可能切换了多个线程）依然可以共享同一个对象；
- AsyncLocal存在层级嵌套的特点，不像ThreadLocal一个线程到底，也就是说AsyncLocal是工作在树形的异步控制流上的；
```csharp
    class Program
    {
        private static AsyncLocal<WebContext> threadLocal = new AsyncLocal<WebContext>();
        static void Main(string[] args)
        {
            //模拟5个HTTP请求
            for (var i = 0; i < 5; i++)
            {
                var index = i;
                Task.Factory.StartNew(async () =>
                {
                    var ctx = threadLocal.Value = new WebContext();
                    ctx.Name = "请求" + index;
                    ctx.Id = index;
                    Console.WriteLine($"Delay前 线程ID:{Thread.CurrentThread.ManagedThreadId} ctx.Name={ctx.Name} ctx.Id={ctx.Id}");
                    await Task.Delay(new Random().Next(1000, 2000));
                    Console.WriteLine($"Delay后 线程ID:{Thread.CurrentThread.ManagedThreadId} ctx.Name={ctx.Name} ctx.Id={ctx.Id}");
                });
            }
            Console.Read();
        }
    }

    class WebContext
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }

```


通过AsyncLocal在异步方法中保存值
```csharp
public class TestService
{
    AsyncLocal<int> _asyncLocalValue = new AsyncLocal<int>();

    public async Task Main()
    {
        _asyncLocalValue.Value = 123;
        Console.WriteLine($"Main(Before): _asyncLocalValue.Value = {_asyncLocalValue.Value}");
        await NantokaAsync();
        Console.WriteLine($"Main(After): _asyncLocalValue.Value = {_asyncLocalValue.Value}");
    }

    public async ValueTask NantokaAsync() 
    {
        Console.WriteLine(
            $"NantokaAsync(Before): _asyncLocalValue.Value = {_asyncLocalValue.Value}"
        );
        try
        {
            _asyncLocalValue.Value = 456;
            var message = "Hello Konnichiwa!";
            await WriteAsync(message);
        }
        finally
        {
            Console.WriteLine(
                $"NantokaAsync(After): _asyncLocalValue.Value = {_asyncLocalValue.Value}"
            );
        }
    }

    public async ValueTask WriteAsync(string message)
    {
        Console.WriteLine($"WriteAsync(Before): _asyncLocalValue.Value = {_asyncLocalValue.Value}");
        try
        {
            _asyncLocalValue.Value = 567;
            await Task.Delay(100);
            Console.WriteLine($"WriteAsync: {message}");
        }
        finally
        {
            Console.WriteLine(
                $"WriteAsync(After): _asyncLocalValue.Value = {_asyncLocalValue.Value}"
            );
        }
    }
}

```

### 在树形异步控制流上流动的特点

- 每个节点都可以有自己的对象；
- 当子节点没有设置对象时，则访问的是父节点的对象；
- 当子节点设置了对象时，则访问自己设置的对象；
- 父节点无法访问子节点设置的对象；
```csharp
    class Program
    {
        private static AsyncLocal<WebContext> asyncLocal = new AsyncLocal<WebContext>();
        static async Task Main(string[] args)
        {
            await Async();
            Console.Read();
        }

        //父上下文
        public static async Task Async()
        {
            asyncLocal.Value = new WebContext
            {
                Id = 0,
                Name = "父"
            };
            Console.WriteLine("父:" + asyncLocal.Value);
            await Async1();
            Console.WriteLine("父:" + asyncLocal.Value);

        }

        //子上下文
        public static async Task Async1()
        {
            Console.WriteLine("子子:" + asyncLocal.Value);
            asyncLocal.Value = new WebContext
            {
                Name = "子",
                Id = 1,
            };
            Console.WriteLine("子子:修改后");
            Console.WriteLine("子子:" + asyncLocal.Value);
        }

 
    }

    class WebContext
    {
        public string Name { get; set; }
        public int Id { get; set; }

        public override string ToString()
        {
            return $"Name={Name},Id={Id}";
        }
    }

```

## 使用场景

- 传递状态数据：在异步操作中，例如异步方法或任务链中，我们可能需要共享某些状态数据。使用AsyncLocal，我们可以在异步操作之间传递这些状态数据，而不必显式地传递参数。
- 上下文相关信息：有时候，我们可能需要跨异步方法或任务访问一些上下文相关的信息，例如用户身份验证信息、语言设置等。使用AsyncLocal，我们可以在整个异步调用栈中访问这些信息，而不必在每个方法中传递它们作为参数。
```csharp
//同一个web请求获取 商户上下文数据都是一样的，而且不会影响另外一个web请求
public class CurrentContext
{
    /// <summary>
    /// 商户
    /// </summary>
    private static readonly AsyncLocal<CurrentUser> CurrentUser = new AsyncLocal<CurrentUser>();

    public static void SetCurrentData(CurrentUser currentUser)
    {
        CurrentUser.Value = currentUser;
    }

    public static CurrentUser GetCurrentData()
    {
        return CurrentUser.Value??new CurrentUser();
    }
}
```

## 资料
[https://www.cnblogs.com/eventhorizon/articles/12240767.html](https://www.cnblogs.com/eventhorizon/articles/12240767.html) | 浅析 .NET 中 AsyncLocal 的实现原理 - 黑洞视界 - 博客园

## 参考资料
[https://www.cnblogs.com/lgxlsm/p/17615799.html](https://www.cnblogs.com/lgxlsm/p/17615799.html) | .Net AsyncLocal介绍 - 广州大雄 - 博客园
