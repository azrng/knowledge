---
title: 线程池
lang: zh-CN
date: 2023-11-11
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - thread
---

## 概述

线程池就是一组预先创建的线程(或者理解为租赁公司，但是并不会在程序启动的时候就创建好所有线程)，可以被重复使用用来执行多个任务，它提供了一些基本方法，如：设置pool中最小/最大线程数量、把要执行的方法排入队列等等。因为线程的创建和销毁需要很大的性能开销，所以线程池可以避免频繁创建和销毁线程，从而减少线程创建和销毁的开销，提高了系统的性能和效率，在windows nt 内核的操作系统中，每个进程都会包含一个线程池，而在net中，也有自己的线程池，是由clr负责管理的。**异步编程默认使用线程池**

线程池**初始化是没有线程**的，当应用程序需要一个新的线程时候，就可以从线程池中直接获取一个已经存在的线程，若此处线程池中没有空闲的线程，那么就根据内部算法创建新的线程来处理任务，同样当一个线程使用完毕后并不会立即被销毁，而是放入线程池中等待下一次使用，当线程池内的线程数量达到其预设的最大值，而所有线程都在忙碌，新提交的任务就会被放在任务队列中等待执行，直到有线程完成任务并返回到线程池。
> 保持使用线程池线程的操作都是短暂的。不要使用线程池线程做长时间运行的操作或者阻塞工作线程。


### 优点

- 当开始一个线程的时候，将花费几百微秒来组织类似以下的内容：
   - 一个新的局部变量栈(Stack)
- 线程池可以节省这种开销：
   - 通过预先创建一个可循环使用的线程池来减少这一开销。
- 线程池对于高效的并行编程和细粒度并发是必不可少的。
- 它允许在不被线程启动的开销淹没的情况下运行短期的操作(任务时间还没线程启动时间长)。

让thread得到更好的使用，提高利用率，减少不必要的创建和销毁。

### 注意点

- 不可以设置池线程的Name
- 线程池的线程都是后台线程。
- 阻塞池线程可使性能降级。
- 你可以自由的更改线程的优先级
   - 当它释放回池的时候优先级将还原为正常状态。

Thread.CurrentThread.IsThreadPoolThread属性可用于确认当前运行的线程是否是一个线程池线程。

## 操作

### ThreadPool

#### 基础使用

- 无参数
   - ThreadPool.QueueUserWorkItem(_ => { ........... });
- object参数
   - ThreadPool.QueueUserWorkItem(obj => { p = obj as Person; ........... }, new Person() { Name = "Edison" });
   - 由于是object类型，涉及到多余的类型转换
- 泛型参数
   - ThreadPool.QueueUserWorkItem(p => { ........... }, new Person() { Name = "Edison" }, true);
   - 第三个参数 bool preferLocal，一般建议传true，代表优先使用线程本地队列（Local Queue） 而不是 全局队列（Work Queue），降低锁竞争。
- 其他方法
   - GetMinThreads, GetMaxThreads
   - ThreadCount、CompletedWorkItemCount

#### QueueUserWorkItem
在nef4.0之前没有Task，所以需要使用QueueUserWorkItem
```csharp
var list = new List<Task>();
// 创建两个新的 Task默认是在ThreadPool上运行
for (int i = 0; i < 5; i++)
{
    ThreadPool.QueueUserWorkItem(PerformAction2, "task" + i);
}
Console.WriteLine("for循环结束");//task是等待for循环结束后才执行的
// 执行并等待两个 Task 执行完成
Task.WaitAll(list.ToArray());

Console.WriteLine("Tasks done!");
```

#### 任务添加进线程池
```csharp
ThreadPool.QueueUserWorkItem(new WaitCallback(方法名));
或
ThreadPool.QueueUserWorkItem(new WaitCallback(方法名), 参数);
```

#### 设计图
![76cc50fb58ab073010e57d3bd8cfed6a.png](/common/1677076461482-fc51de8a-7157-42ad-aca4-667b5ebdec8a.png)
在老版本的.NET Framework时代，只有一个全局队列，存在大量的锁竞争。
.NET Core中加入了本地队列，加入了本地队列，降低了锁竞争，并提高了线程的利用率。
![0c2defacd51932ac7e9e11ad5ce5227d.png](/common/1677076483564-b644e0fa-256b-4ce3-84ca-dd7fbaffc0b7.png)
具体实现思路是：
（1）每个线程优先从本地队列中取任务干活；
（2）如果本地队列中没有任务了，就从全局队列中取任务干活；
（3）当全局任务队列里面的任务没有的时候，CLR将会把其他有任务的线程中的未处理任务（比如上图中的WorkItem3），分配给这些空闲的线程（比如上图中的Thread3）去执行。这个机制也被称之为 偷窃机制。

这样子做的目的就是让每个线程都有事情干，即提高线程池中线程的利用率。

### Task

- Task 可以作为 ThreadPool 队列系统的基本单元被 ThreadPool 调度执行。
- 在线程池上运行代码最简单的方式(在netf4.5的时候引入的)，提供等待、终止、返回值等操作功能。
#### 如何创建Task

#####  new Task

```
new Task(_ =>
{
    Console.WriteLine("Hello World!");
}, null).Start();
```

##### Task.Factory.StartNew

 ```  c#
 // 无参数
 var task = Task.Factory.StartNew(()=>
 {
     Console.WriteLine($"Current ThreadId={Environment.CurrentManagedThreadId}");
 });
 // 有参
 var task = Task.Factory.StartNew((obj)=>
 {
     Console.WriteLine($"Current ThreadId={Environment.CurrentManagedThreadId}, Current Content={obj}");
 }, "Hello World");
 ```

#####  Task.Run  

   - 传入一个Action委托即可
```shell
Task.Run(() => Console.WriteLine("task 1"));
Console.ReadLine();//等待线程执行
```

- 返回一个Task对象，可以使用它来监视其过程。
   - 在Task之后，我们没有调用start，因为该方法创建的是“热”任务(创建完就开始运行)
```csharp
// 无参数
var task = Task.Run(()=>
{
    Console.WriteLine($"Current ThreadId={Environment.CurrentManagedThreadId}");
});
// 有参
var task = Task.Run((obj)=>
{
    Console.WriteLine($"Current ThreadId={Environment.CurrentManagedThreadId}, Current Content={obj}");
}, "Hello World");
```

- 可以通过Task的Status属性来跟踪task的执行状态。
```csharp
{
    Console.WriteLine("Task.Run");
    // 创建两个新的 Task默认是在ThreadPool上运行
    var task1 = Task.Run(() => Console.WriteLine("task 1"));
    var task2 = Task.Run(() => Console.WriteLine("task 2"));

    // 执行并等待两个 Task 执行完成
    Task.WaitAll(new[] { task1, task2 });

    Console.WriteLine("Tasks done!");
}
Console.WriteLine("===我是分隔线===");

{
    Console.WriteLine("循环Task.Run");
    var list = new List<Task>();
    // 创建两个新的 Task默认是在ThreadPool上运行
    for (int i = 0; i < 2; i++)
    {
        list.Add(Task.Run(() =>
        {
            //如果这点i不定义另外一个变量去接受，那么这点i会一直是2，因为这个task会等待for循环结束后才运行
            PerformAction2("task" + i);
        }));
    }
    Console.WriteLine("for循环结束");//task是等待for循环结束后才执行的
    // 执行并等待两个 Task 执行完成
    Task.WaitAll(list.ToArray());

    Console.WriteLine("Tasks done!");
}
```

##### Task.FromResult

使用Task.FromResult直接创建一个已完成的Task

```c#
Task.FromResult("Hello World!");
var task = Task.CompletedTask;
```

##### 某个不知其内部实现的async方法

```c#
async Task<Bar> FooAsync();
```

#### 获取返回值

##### ContinueWith

注册一个回调，等待Task执行完成的时候获取结果并执行回调

```csharp
var task = Task.Run<string>(() => "Hello World!");
task.ContinueWith(t => Console.WriteLine(t.Result));


Task<string> primeNumberTask = Task.Run(() =>
{
    Task.Delay(3000);
    return "success";
});
Console.WriteLine("做其他任务");

primeNumberTask.ContinueWith(task =>
{
    var result = task.Result;
    Console.WriteLine(result);//success
});

Console.ReadLine();
```

- ContinueWith本身返回一个task，它可以用它附加更多的Continuation。但是必须直接处理AffregateException
  - 如果task发生故障，需要写额外的代码把continuation封装到ui应用上
  - 如果在非ui上下文中，若想让Continuation和task执行在同一个线程上，必须执行taskContinuationOption.ExecuteSynchronously，否则它将弹回到线程池。

##### await一个Task

await 一个 Task 并得到结果

```c#
var task = Task.Run<string>(() => "Hello World!");
var result = await task;
Console.WriteLine(result);
```

##### 直接GetResult

```c#
var task = Task.Run<string>(() => "Hello World!");
// 等效于 task.Result
var result = task.GetAwaiter().GetResult();
Console.WriteLine(result);
```

##### Wait等待获取返回值

- 调用Task的Wait方法会进行阻塞直到操作完成。
   - 相当于调用Thread上面的Join方法
```csharp
{
    Task task = Task.Run(() =>
    {
        Thread.Sleep(3000);
        Console.WriteLine("foo");
    });

    Console.WriteLine(task.IsCompleted);//False

    task.Wait();//阻塞直到task完成操作

    Console.WriteLine(task.IsCompleted);//True
}
```

- Wait也可以让你指定一个超时时间和一取消令牌来提前结束等待。

#### Task的返回值

- Task有一个泛型子类叫做`Task<TResult>`，它允许发出一个返回值。
- 使用`Func<TResult>`委托或者兼容的Lambda表达式来调用`Task.Run`就可以得到`Task<TResult>`
- 随后，可以通过Result属性来获得返回的结果
   - 如果这个task还没完成，访问Result属性会**阻塞**该线程直到Task完成操作。
```shell
Task<int> task = Task.Run(() =>
{
    Console.WriteLine("FOO");
    return 3;
});

var result = task.Result;//如果task还没完成，那么就阻塞
Console.WriteLine(result);//3
```

- `Task<Result>`可以看做是一种所谓的“未来/许诺”，在它里面包裹这一个Result，在稍后得到结果。

#### Task的异常

- 与Thread不一样，Task可以很方便的传播异常
   - 如果你的task抛出了异常，那么该异常会重新被抛出给
      - 调用wait的地方
      - 访问了`Task<Result>`的Result属性的地方。
```shell
var task = Task.Run(() =>
{
    throw null;
});

try
{
    task.Wait();
}
catch (Exception ex)
{
    if (ex.InnerException is NullReferenceException)
    {
        Console.WriteLine("null");
    }
    else
    {
        throw ex;
    }
}
//输出null
```

- 无需重新抛出异常，通过Task的IsFaulted和IsCanceled属性也可以检测出Task是否发生了故障：
   - 如果两个属性都返回false，那么就没有错误发生
   - 如果IsCanceled为true，那么就说明OperationCanceledException为该Task抛出了
   - 如果IsFaulted为True，那么就说明另一个类型的异常被抛出了，而exception属性也将说明错误。
- IsCompletedSuccessfully: 只有在任务正常执行完成、无异常、无中途退出指令的情况下才会标识已完成， IsCompleted仅仅表示任务完成。

#### Continuation

- 在task上面调用GetAwaiter会返回一个awaiter对象
   - 它是onCompleted方法会告诉之前的task：“当你结束/发生故障的时候要执行委托”
```csharp
Task<string> primeNumberTask = Task.Run(() =>
{
    Task.Delay(3000);
    return "success";
});
Console.WriteLine("做其他任务");

TaskAwaiter<string> awaiter = primeNumberTask.GetAwaiter();
awaiter.OnCompleted(() =>
{
    var result = awaiter.GetResult();
    Console.WriteLine(result);//success
});

Console.ReadLine();
```

- 可以将Continuation附加到已经结束的task上，此时Continuation将会被安排立即执行。

Awaiter

- 任何可以暴露下列两个方法和一个属性的对象就是awaiter
   - OnCompleted
   - GetResult
   - 一个叫做IsCompleted的bool属性
- 没有接口或者父类来统一这些成员
- 其中OnCompleted是INotifyCompletion的一部分

如果发生故障

- 如果发生故障，那么当Continuation代码调用awaiter.GetResult()的时候，异常就会被重新抛出
- 无需调用GetResult，我们可以直接访问task的Result属性。
- 但调用GetResult的好处是，如果task发生故障，那么异常就会被直接排除，而不是被包裹在AggregateException里面，这样子的话catch快就简洁很多了。

#### 非泛型Task
针对非泛型的task，GetResult()方法有一个void的返回值，它就是用来重新抛出异常。

#### 并行+串行

先并行执行多个任务，然后再串行操作

```csharp
var sheets = new List<Sheet> { new Sheet1(), new Sheet2() };
var tasks = new Task[2];
for(int i=0; i<sheets.Count; i++)
{
    tasks[i] = Task.Factory.StartNew((index)=>
    {
        sheets[(int)index].WriteSheet();
    }, i);
}
Task.WhenAll(tasks).ContinueWith(t=>
{
    new Sheet[0].WriteSheet();
}).Wait();
```

#### 父子关系
如果父Task中的任意一个子Task未完成，都不能继续。注意点：参数TaskCreationOptions.AttachedToParent
```csharp
var sheets = new List<Sheet> { new Sheet1(), new Sheet2() };

//父task
var parent_task = Task.Factory.StartNew(() =>
{
    //1. 子task1
    var child_1_task = Task.Factory.StartNew(() =>
    {
        new Sheet1().WriteSheet();
    }, TaskCreationOptions.AttachedToParent);

    //2. 子task2
    var child_2_task = Task.Factory.StartNew(() =>
    {
        new Sheet2().WriteSheet();
    }, TaskCreationOptions.AttachedToParent);
});

var continueTask= parent_task.ContinueWith(t =>
{
    new Sheet0().WriteSheet();
});


Task.WhenAll(continueTask);
```
最后等待还有这几种写法：
```csharp
continueTask.Wait();
Task.WaitAll(continueTask);
Task.WaitAny(continueTask);
```
以上三种会阻塞主线程
```csharp
Task.WhenAll(continueTask);
```
上面这种方式不会阻塞主线程。
**解析：WaitAll/WaitAny方法阻塞了当前线程直到全完。WhenAll方法会开启个新监控线程去判读括号里的所有线程执行情况并立即返回，等都完成了就退出监控线程并返回监控数据。**

#### Task组合器
异步函数有一个让其保持一致的协议(可以一致的返回Task)，这能让保持良好的结果：可以使用以及编写Task组合器，也就是可以组合Task，但是不关心Task具体做什么的函数

##### whenAny

- 当一组Task中任何一个Task完成时候，Task.WhenAny会返回完成的Task。
```csharp
Task<int> winningTask = await Task.WaitAny(Delay1(), Delay2(), Delay3());
Console.WriteLine("Done");
Console.WriteLine(winningTask.Result);
```

- 因为Task.WhenAny本身就是返回一个Task，我们对它进行await时候就会返回最先完成的Task
- 上面例子是非阻塞的，包括最后一行(当访问Result属性时候，winningTask已完成)，但是最好还是对winningTask进行await，因为异常无需AggregateException包装就会重新抛出
```csharp
Console.WriteLine(await winningTask);
```

- 很适合为不支持超时或者取消的操作添加这些功能。
```csharp
Task<string> task = SomeAsync();
Task winner = await (Task.WhenAny(task, Task.Delay(5000)));
if (winner != task)
    throw new TimeoutException();
var result = await task;
```

##### whenALL

- 不会阻塞当前线程。
- 当传给它的所有Task都完成后，Task.WhenAll都返回一个Task
```csharp
Task<int> winningTask = await Task.WhenAll(Delay1(), Delay2(), Delay3());
Console.WriteLine("Done");
Console.WriteLine(winningTask.Result);
```

- await组合的Task，只会抛出第一个异常，想要看到所有的异常，你需要这么做
```csharp
Task<int> task = await Task.WhenAll(Delay1(), Delay2(), Delay3());
try
{
    await task;
}
catch 
{
    Console.WriteLine(task.Exception.InnerExceptions.Count);
}
```

- 对一组`Task<TResult>`调用WhenAll会返回`Task<TResult[]>`，也就是所有Task的组合结果
- 如果进行await，那么就会得到TResult[]
```csharp
var task1 = Task.Run(() => 1);
var task2 = Task.Run(() => 2);
int[] results = await Task.WhenAll(task1, task2);// 1,2
```

示例：比如你需要同时去查询多个视图，并且需要将查询的结果汇总后进行返回，那么就可以这么操作
```csharp
public async Task<object> TaskTest()
{
    var moduleList = new List<string> { "order", "check", "emr", "lab" };
    var colleckModuleList = new List<ModelInfo>();

    var tasks = new List<Task<List<ModelInfo>>>();
    foreach (var item in moduleList)
    {
        tasks.Add(Task.Run(async () =>
        {
            return await GetModuleDataAsync(item);
        }));
    }
    var searchResults = await Task.WhenAll(tasks).ConfigureAwait(false);
    foreach (var item in searchResults)
    {
        colleckModuleList.AddRange(item);
    }

    return colleckModuleList;
}
```


##### waitAll

- 会阻塞当前线程
```csharp
var tasks = new Task[] {
    TaskOperationOne(),
    TaskOperationTwo()
};

Task.WaitAll(tasks);
```

#### 自定义的Task组合器

- 可以编写自定义的Task组合器。最简单的组合器接受一个Task，为task添加超时功能。
```csharp
public async static Task<T> WithTimeOut<T>(this Task<T> task, TimeSpan timeSpan)
{
    var cancel = new CancellationTokenSource();
    var delay = Task.Delay(timeSpan, cancel.Token);
    Task winner = await Task.WhenAny(task, delay).ConfigureAwait(false);
    if (winner == task)
        cancel.Cancel();
    else
        throw new TimeoutException();
    return await task.ConfigureAwait(false);
}
```
> 通过在Task完成时候取消Task.Delay我们可以避免在计时器上的小开销。


### 进度报告

- 有时候，你希望异步操作在运行的过程中能够时实时的反馈进度。一个简答的解决方案就是向异步方法传入一个action委托，当进度变化的时候触发方法调用
```csharp
Action<int> progress = i => Console.WriteLine(i + " %");
await Foo(progress);

Task Foo(Action<int> onRrogressPercentChanged)
{
    return Task.Run(() =>
    {
        for (int i = 0; i < 1000; i++)
        {
            if (i % 10 == 0)
                onRrogressPercentChanged(i / 10);
            Console.WriteLine("当前结果是:" + i);
        }
    });
}
```
> 注意：富客户端应用中使用不理想，因为它从worker线程报告的进度，可能导致消费者的线程安全，所以应该使用`IProgress<T>`和`Progress<T>`


#### TaskCompletionSource

- Task.Run创建task
- 另一种方式就是用TaskCompletionSource来创建Task
- TaskCompletionSource让你在稍后开始和结束的任意操作中创建Task
   - 它会为你提供一个可手动执行的“从属”Task
   - 指示操作何时结束或者发生故障
- 对io复杂类的工作比较理想
   - 它可以获得Task的好处（传播值、异常、Continuation等）
   - 不需要在操作的时候阻塞线程
```csharp
var tcs = new TaskCompletionSource<int>();
new Thread(() =>
{
    Thread.Sleep(5000);
    tcs.SetResult(42);
})
{
    IsBackground = true,
}.Start();

Task<int> task = tcs.Task;
Console.WriteLine(task.Result);//42
Console.ReadLine();
```
自己封装公共方法
```csharp
// 调用此方法相当于调用Task.Factory.StartNew
// 并使用TaskCreationOptions.LongRunning选项创建非线程池的线程
Task<TResult> Run<TResult>(Func<TResult> func)
{
    var tcs = new TaskCompletionSource<TResult>();
    new Thread(() =>
    {
        try
        {
            tcs.SetResult(func());
        }
        catch (Exception ex)
        {
            tcs.SetException(ex);
        }
    }).Start();
    return tcs.Task; 
}
```

### Long-running Task
长时间运行的任务

- 默认情况下，CLR在线程池中运行Task，这非常适合短时间的运行的工作。
- 针对长时间运行的任务或者阻塞操作，你可以不采用线程池来实现。(如果你知道该任务是长期运行的，那么就不要去使用线程池(租赁公司)，因为你长期不归还，那么线程池会为了满足需求，会新开一些线程，如果你使用的线程被归还后，那么就会导致线程池的线程过多，销毁和调度都是一个麻烦。)
- 在netf4.0中，使用该方法可以实现和Task.Run相同的功能。
```c#
Task task = Task.Factory.StartNew(() =>
{
Thread.Sleep(3000);
Console.WriteLine("foo");
}, TaskCreationOptions.LongRunning);

//创建两个线程  这两个线程不在ThreadPool上运行
var list = new List<Task>();
for (int i = 0; i <= 1; i++)
{
    list.Add(Task.Factory.StartNew(PerformAction2, "Task" + i));//, TaskCreationOptions.LongRunning 只能带一个参数
}
Console.WriteLine("for循环结束");//task是等待for循环结束后才执行的
Task.WaitAll(list.ToArray());
Console.WriteLine("Tasks done!");
```

- 如果同时运行多个long-running tasks(尤其是其中有处于阻塞状态的)，那么性能会受到很大影响，这时候有比TaskCreatingOptions.LongRunning更好的方法：
   - 如果任务是IO-Bound(io复杂)，TaskCompletionSource和异步函数可以让你用回调(Coninuations)答题线程来实现并发。
   - 如果任务是Compute-Bound(计算复杂)，生产者/消费者队列允许你对任务的并发性进行限流，避免把其他线程和进程饿死。

#### 设置优先级
可以在Task运行的方法体中设置当前线程的优先级，然后在方法体执行结束前再重新设置优先级，如下
```csharp
void StartTaskMethod()
{
    try
    {
        // Change the thread priority to the one required.
        Thread.CurrentThread.Priority = ThreadPriority.AboveNormal;

        // Execute the task logic.
        DoSomething();
    }
    finally
    {
        // Restore the thread default priority.
        Thread.CurrentThread.Priority = ThreadPriority.Normal;
    }
}

```
最后是将方法丢到startNew中
```csharp
new TaskFactory().StartNew(StartTaskMethod);
```
> 来源自：[https://mp.weixin.qq.com/s/R-CndRq3HfaQYxOnCZp6nA](https://mp.weixin.qq.com/s/R-CndRq3HfaQYxOnCZp6nA)


### Parallel
并行，让多个线程池并行工作，由于是并行执行，所以需要注意：工作项彼此之间必须是可以并行执行的。
```csharp
internal class Program
{
    private static void Main(string[] args)
    {
        Parallel.For(0, 10, i => Console.Write(i));
        Console.WriteLine("");
        Console.WriteLine("------------分割线------------");
        var lists = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        Parallel.ForEach(lists, i => Console.Write(i));
    }
}
```
Parallel.For效率高于Parallel.Foreach，所以当For与Foreach都可以时，推荐使用For。

### 设置线程池最大最小
当你开启一个 Task 的时候，实际上，是由 ThreadPool 分配了一个线程，ThreadPool 的上限取决于很多方面的因素，例如虚拟内存的大小，当 Task 开启的数量超过ThreadPool 的上限的时候，Task 将进入排队状态，直到线程池线程变为可用，可以手动设置 ThreadPool 的大小
```csharp
//设置当没有请求时线程池维护的空闲线程数
//第一个参数为辅助线程数
//第二个参数为异步 I/O 线程数
 var available = ThreadPool.SetMinThreads(5, 5);
 Console.WriteLine("Result:{0}", available);

//设置同时处于活动状态的线程池的线程数，所有大于次数目的请求将保持排队状态，直到线程池变为可用
//第一个参数为辅助线程数
//第二个参数为异步 I/O 线程数
var available2 = ThreadPool.SetMaxThreads(100, 100);
Console.WriteLine("Result:{0}", available2);
```
上面的代码表示设置当前程序可使用的线程池大小，但是，SetMaxThreads 的值不应该小于托管服务器的 CPU 核心数量，否则，变量 available 的值将显示为 false，表示未成功设置线程池上限
> 注意：ThreadPool 上的所有线程都是后台线程，也就是说，其IsBackground属性是true，在托管程序退出后，ThreadPool 也将会退出。

```csharp
{
    Console.WriteLine("限制ThreadPool线程的创建");//这个限制应该是全局起作用的
    ThreadPool.SetMinThreads(2, 2); // 设置线程池最小线程数量为2
    ThreadPool.SetMaxThreads(3, 3); // 设置线程池最大线程数量为3
    var list = new List<Task>();
    for (int i = 0; i < 4; i++)
    {
        list.Add(Task.Factory.StartNew(PerformAction3, "Task" + i));//, TaskCreationOptions.LongRunning //加上这个代表线程不在线程池上，所以就不受线程池限制
    }
    Console.WriteLine("for循环结束");//task是等待for循环结束后才执行的
    Task.WaitAll(list.ToArray());
    Console.WriteLine("Tasks done!");
}
Console.WriteLine("===我是分隔线===");

{
    Console.WriteLine("Task.Run验证线程池限制");
    var list = new List<Task>();
    // 创建两个新的 Task默认是在ThreadPool上运行
    for (int i = 0; i < 5; i++)
    {
        //上面线程池限制了创建线程的数目，所以这点最多只能创建3个
        list.Add(Task.Run(() =>
        {
            //如果这点i不定义另外一个变量去接受，那么这点i会一直是2，因为这个task会等待for循环结束后才运行
            PerformAction2("task" + i);
        }));
    }
    Console.WriteLine("for循环结束");//task是等待for循环结束后才执行的
                                    // 执行并等待两个 Task 执行完成
    Task.WaitAll(list.ToArray());

    Console.WriteLine("Tasks done!");
}
```

### 线程池中的整洁
CLR策略

- CLR通过对任务排队并对其启动进行节流限制来避免线程池中的超额订阅。
- 它首先会运行尽可能多的并发任务(只要还有CPU核)，然后通过爬山算法调整并发级别，并在特定方向上不断调整工作负载。
   - 如果吞吐量提高，它将继续朝着同一个方向(否则将反转)
- 这确保了它始终追随最佳性能曲线，及时面对计算机上竞争的进程活动时候也是如此
- 如果下面两点能够满足，那么CLR的策略将发挥出最佳效果。
   - 工作项大多是短时间运行的(<250毫秒，或者理想情况下<100毫秒)，因为CLR有很多机会进行测量和调整。
   - 大部分时间都被阻塞的工作项不会主宰线程池。(阻塞的线程会被认为一直在进行CPU密集计算。)
> cpu超额订阅：活跃的线程超过CPU的核心数，操作系统就需要对线程进行时间切片。超额订阅对性能影响很大，时间切片需要昂贵的上下文切换，并且可能使CPU缓存失效，而CPU缓存对于现代处理器的性能至关重要。


## 参考资料
杨旭教程

[https://mp.weixin.qq.com/s/Th4O7pIfBuzkN3j1OWnCGQ](https://mp.weixin.qq.com/s/Th4O7pIfBuzkN3j1OWnCGQ) | 如何让Task在非线程池线程中执行？
