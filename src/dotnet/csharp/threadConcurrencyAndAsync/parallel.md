---
title: 并行操作
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - thread
  - plinq
  - parallel
---

## 概述

通过编程发挥多核或者多处理器优势来同时执行多个独立的任务的方式称为并行编程，它是多线程这个更宽泛概念下的一个子集，是一种特殊的多线程编程，



在单核计算机上，操作系统会为每个线程时间片(windows系统是20毫秒)来模拟并发执行。在多核计算机上，两个线程可以并行执行(会和机器上其他执行的进程进行竞争)。  

## 并行场景
.NET引入的Task Parallel Library(任务并行库，TPL)，动态地扩展并发度，以最有效的方式使用所有可用的处理器。
TPL支持分区工作、支持基于ThreadPool调度、支持取消异步操作、支持状态管理，也支持数据并行、任务并行和流水线Dataflow。

- 数据并行：有大量数据需要处理，并且必须对每一份数据执行同样的操作
- 任务并行：通过任务并发运行不同的操作
- 流水线：任务并行和数据并行的结合体(需要引入System.Threading.Tasks.Dataflow组件库)

## 对比

### 对比并发
并行则是指同时执行多个任务或进程，每个任务都可以独立运行，且每个任务可分配到不同的处理器或计算资源上，以实现更高效的处理能力。

并行是一种特殊的并发，因为它也涉及到多个任务同时执行的情况，但并行的关注点更为强调在于如何并行地执行任务以提高性能，例如通过使用多核处理器、分布式系统等技术来实现。与此相比，单处理器并发执行的任务可能仅仅是为了提高用户体验，或者是防止某些任务长时间占用处理器导致其他任务无法及时响应。

### 对比多线程
程序同时执行代码的机制叫做多线程，多线程是并发的基础概念。
"并行编程"强调的是同时执行多个任务，而"多线程编程"强调的是在同一时间内执行多个线程。

## 概念

### 硬件线程和软件线程
多核处理器带有一个以上的物理内核：物理内核是真正的独立处理单元，多个物理内核使得多条指令能够同时并行运行。
硬件线程也称为逻辑内核，一个物理内核可能会使用超线程技术提供多个硬件线程，所以一个硬件线程并不代表一个物理内核。程序通过Environment.ProcessorCount 得到的就是逻辑内核（本人的机器是i5-5300U 虚拟4核）， Windows中每个运行的程序都是一个进程，每一个进程都会创建并运行一个或多个线程，这些线程称为软件线程，硬件线程就像是一条泳道，而软件线程就是在其中游泳的人。

## 实现
并行编程则通常使用Parallel类或PLINQ（Parallel LINQ）来实现。

### 差异
|  | PLINQ | Parallel |
| --- | --- | --- |
| 使用方式 | 通过扩展 LINQ 查询语法，并提供了 AsParallel() 扩展方法来将查询转换为并行查询 | 提供了更直观的编程模型，通过 Parallel.For 和 Parallel.ForEach 的静态方法来实现并行循环 |
| 数据分区 | 默认会自动将数据集分成多个分区，并根据系统资源和负载情况进行动态调整 | 允许手动控制任务的分区和调度策略，允许更精细的控制任务的执行方式 |
| 错误处理 | 捕获并延迟异常，直到枚举结果时才抛出 | 将异常聚合到一个 AggregateException 对象中，并在循环完成后抛出 |
| 使用场景 | 数据集查询：对大型数据集进行查询、转换操作
数据流管道：构建数据流管道，进行一系列并行操作符(如过滤、映射、排序等)，可以依次作用于数据集 | 1.循环和迭代操作：对数组、集合和范围等进行并行遍历和计算操作
2.自定义任务管理：允许手动分割任务范围、指定任务调度策略和粒度，并且可以方便进行任务间通信和同步 |
| 依赖 | 底层实现都依赖于相同的并行任务框架和线程池 |  |
| 异步处理 | 取值的时候再处理，返回是`Task<T>` | 正常处理，返回是T |
| 可扩展性和灵活性 | 较高的API，封装了更多并行执行细节，提供了更简单的使用方式，但相对于Parallel有更少的灵活性 | 先对较低级别的API，提供了更多的灵活性，允许手动控制并行执行的细节 |

### 数据并行PLINQ

可以将一个集合转为并行操作的集合

#### 注意事项

- PLINQ仅适用于本地集合(循环的是本地集合)
- 查询过程中各个分区产生的异常会封送到AggregateException然后重新抛出
- 默认情况下是无序的，但可以使用AsOrdered有序，但是性能也会有所消耗
- 执行过程必须是线程安全的，否则结果不可靠
- 并行化过程的任务分区，结果整理，以及线程开辟和管理都需要成本
- 如果它认为并行化是没有必要的，会使查询更慢的，会转为顺序执行
- 默认情况下，PLINQ总会认为你执行的是CPU Bound，然后开启核心数个任务

#### AsParallel

示例

```c#
var module = new List<string> { "check", "lab", "order" };
//使用了 AsParallel() 方法将 List<string> 转换为一个 ParallelQuery<string> 对象
module
    .AsParallel()
    .WithDegreeOfParallelism(3)
    .ForAll(item =>
    {
        var result = TestMethod(item);
        Console.Out.WriteLine(result);
    });

// 异步处理
var module = new List<string> { "check", "lab", "order" };

//查询中使用 async 和 await 关键字来调用异步方法。在查询中的每个元素上执行的异步操作将在后台线程上并行进行，以提高整体效率
var result = module.AsParallel().Select(async t => await TestMethodAsync(t)).ToList();
Console.WriteLine($"操作结束,耗时：{watch.ElapsedMilliseconds}");
foreach (var item in result)
{
    //到这一步才开始真正执行
    await Console.Out.WriteLineAsync(await item);
}

private async Task<string> TestMethodAsync(string i)
{
    await Task.Delay(1000);
    await Console.Out.WriteLineAsync("当前操作值" + i);
    return "success" + i;
}

private string TestMethod(int i)
{
    Thread.Sleep(1000);
    return "success" + i;
}
```

#### AsSequential

#### AsOrdered


### 数据并行Parallel

#### 数据并行For

结构

```csharp
Parallel.For(int fromInclude, int toExclude, Action<int> body)
```

Parallel.For 类似for循环，区别是Parallel.For 是异步处理多条数据，意味着它是无序输出。

```csharp
// 从开始到结果
Parallel.For(0, 6, (i) =>
{
    Console.Write($"{i} ");
});
Console.WriteLine();
//输出 可能为：0 4 1 3 5 2

var options = new ParallelOptions
{
    //获取或设置此ParallelOptions实例启用的最大并行度
    MaxDegreeOfParallelism = 4
};
Parallel.For(0, 9, options, (i) =>
{
    Console.WriteLine("Thread={0}, i={1}", Environment.CurrentManagedThreadId, i);
});
```

#### 数据并行ForEach

> 注意：使用的时候要对CPU核数进行限制，否则很有可能会导致CPU占用很高

[https://mp.weixin.qq.com/s/JVqdGeBHBm7ns2huucjMKQ](https://mp.weixin.qq.com/s/JVqdGeBHBm7ns2huucjMKQ) | C# Parallel

格式

```csharp
Parallel.ForEach<T>(IEnumerable<T>, Action<T>)
```

那么Parallel.ForEach就是异步的foreach，仿照上面例子改造一下

```csharp
var all = new[] { 0, 1, 2, 3, 4, 5, 6 };
Parallel.ForEach(all, (i) =>
{
    Console.Write($"{i} ");
});
Console.WriteLine();
//输出 可能为：0 4 5 3 1 2

var options = new ParallelOptions
{
    //获取或设置此ParallelOptions实例启用的最大并行度
    MaxDegreeOfParallelism = 4
};
await Parallel.ForEachAsync(module, options, async (m, _) =>
{
    var result = await TestMethodAsync(m);
    await Console.Out.WriteLineAsync(result);
});
```

并行去操作并添加值

```csharp
var module = new List<string> { "check", "lab", "order" };

var collect = new List<string>();
Parallel.ForEach(module, (m) =>
{
    // 查询操作
    var curr = Enumerable.Range(1, 5).Select(t => t + m).ToList();

    lock (collect)
    {
        collect.AddRange(curr);
    }
});
```

#### 数据并行ForAll

```csharp
var watch = new Stopwatch();
watch.Start();
var module = new List<string> { "check", "lab", "order" };
module.AsParallel().WithDegreeOfParallelism(3).ForAll(item =>
    {
        var result = TestMethod(item);
        Console.Out.WriteLine(result);
    });
Console.WriteLine($"ForAll操作结束,耗时：{watch.ElapsedMilliseconds}");
```

#### 示例

##### 查询素数

需求：找到100000内素数的个数
由每个线程独立计算线程内迭代产生的素数和，最后再对几个和求和。

```csharp
internal class Program
{
    private static void Main()
    {
        Stopwatch sw = new Stopwatch();

        sw.Start();
        ShareMemory();
        sw.Stop();
        Console.WriteLine($"优化后的共享内存并发模型耗时：{sw.Elapsed}");
    }

    private static void ShareMemory()
    {
        var sum = 0;
        Parallel.For(1, 100000 + 1, () => 0, (x, state, local) =>
        {
            var f = true;
            if (x == 1)
                f = false;
            for (int i = 2; i <= x / 2; i++)
            {
                if (x % i == 0)  // 被[2,x/2]任一数字整除，就不是质数
                    f = false;
            }
            if (f)
                local++;
            return local;
        }, local => Interlocked.Add(ref sum, local));
        Console.WriteLine($"1-100000内质数的个数是{sum}");
    }
}
```

### 任务并行Invoke

让许多方法并行运行的最简单的方法就是使用Parallel类的Invoke方法，Invoke方法接受一个Action的参数组

```csharp
void  System.Threading.Tasks.Parallel.Invoke(WatchMovie, HaveDinner, ReadBook, WriteBlog);
```

> 注意
> **没有特定的执行顺序**
> Parallel.Invoke方法只有在4个方法全部完成之后才会返回。它至少需要4个硬件线程才足以让这4个方法并发运行。
>
> 但并不保证这4个方法能够同时启动运行，如果一个或者多个内核处于繁忙状态，那么底层的调度逻辑可能会延迟某些方法的初始化执行。

资料：[https://learn.microsoft.com/zh-cn/dotnet/api/system.threading.tasks.parallel.invoke?view=net-7.0](https://learn.microsoft.com/zh-cn/dotnet/api/system.threading.tasks.parallel.invoke?view=net-7.0)

## 缓冲行为

PLINQ和LINQ一样，也是延迟查询。不同的是，LINQ完全由使用方通过“拉”的方式驱动：每个元素都在使用方需要时从序列中被提取。而PLINQ通常使用独立的线程从序列中提取元素，然后通过查询链并行处理这些元素，将结果保存在一个小缓冲区中，以准备在需要的时候提供给使用方。如果使用方在枚举过程中暂停或中断，查询也会暂停或停止，这样可以不浪费 CPU 时间或内存。
你可以通过在AsParallel之后调用WithMergeOptions来调整 PLINQ 的缓冲行为，ParallelMergeOptions有以下几种模式

- Default，默认使用AutoBuffered通常能产生最佳的整体效果
- NoBuffered，禁用缓冲，一旦计算出结果，该元素即对查询的使用者可用
- AutoBuffered，由系统选择缓冲区大小，结果会在可供使用前输出到缓冲区
- FullyBuffered，完全缓冲，使用时可以得到全部计算结果（OrderBy,Reverse）。

## 优缺点

Parallel主要还是用到异步，大批量数据处理速度上占有优势，但是不考虑顺序的前提下。
Parallel有啥缺点？“并行”异步会涉及到线程安全问题。还好有解决方案，可以用Interlocked，Interlocked提供了一些简单计算原子操作，可以去查询一下相关资料。

```c#
public static int CalcFactorial(int n)
{
	return n <= 2 ? n:n * CalcFactorial(n - 1);
}
public static int SumFactorial()
{
	int[] datas = { 4, 5, 7, 9 };
	int sum = 0;
	Parallel.ForEach(datas, n => {
		Interlocked.Add(ref sum, CalcFactorial(n));
	});
	return sum;
}
```


## 资料
[https://mp.weixin.qq.com/s/ytm7urDHRQD5QQLYV_wiMA](https://mp.weixin.qq.com/s/ytm7urDHRQD5QQLYV_wiMA) | 三分钟总览微软任务并行库TPL
C## 多线程并行编程篇之结构化：[https://mp.weixin.qq.com/s/n2hdMzT5jYXTaVMnF7oFGw](https://mp.weixin.qq.com/s/n2hdMzT5jYXTaVMnF7oFGw)
