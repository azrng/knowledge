---
title: 说明
lang: zh-CN
date: 2023-11-17
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - async
---

## 描述
不必等待前面所有的代码执行完才开始执行某一段代码，这就是异步。就比如不必要等蒸过米饭才开始炒菜，可以让电饭锅去蒸米饭，然后燃气去炒菜，又或者去饭店吃饭，服务员就是主线程，然后顾客点餐就是具体的任务，当服务员去站到顾客面前等待顾客点餐就是同步方法，当服务员给顾客菜单，顾客点完后再给服务员，服务员在顾客点餐的时候可以去忙其他的事情，这个就是异步方法。“异步点餐”可以让服务员同时服务更多的客人，但是不会使得服务单个客人的时间变短，甚至有的情况下还可能变长。

## 已有多线程，为何要异步

异步和多线程并不是一个同等关系，它俩没有直接的关系，异步是最终目的，多线程只是我们实现异步的一种手段，单线程和多线程都会出现阻塞的情况，这个时候就会用到异步方法去防止阻塞。
![image.png](/common/1641029030244-a3a42511-f87c-4e14-9434-4a639caf587d.png)

* 多线程和异步是不同的概念
  * 异步并不意味着多线程，单线程同样可以异步(CPU切换时间片调度)
  * 异步默认借助的线程池
  * 多线程经常阻塞，而异步要求不阻塞
* 多线程与异步的适用场景不同，多线程更适合
  * CPU密集型操作
  * 长期运行的任务
  * 线程的创建于销毁开销比较大
  * 提供更底层的控制，比如操作线程、锁、信号量等
  * 线程不易于传参以及返回
  * 线程的代码书写较为繁琐

异步编程是为了解决线程阻塞问题，意思就是**如果运行中遇到比较耗费IO的操作，然后就返回一个Task任务对象，**当前任务挂起(cpu去执行其他线程)**，并由await在Task对象上传递用于恢复该方法的方法**，然后去做其他事情(**指的是其他指令的事情，而不是代码接着往下执行的意思**)，等到这个耗费IO的事情处理结束时候会通知该操作结束，然后拐过来处理这个操作，不让线程阻塞到这里。

## 适用场景

* 适合IO密集型操作，例如：网络请求、文件读写、数据库等耗时操作
* 适合短暂的小任务
* 避免线程阻塞，提高系统响应能力

优点：可以提高服务器接待请求的数量，但是不会使得单个请求的处理效率变高，甚至有可能略有降低。

## 异步实现方式

APM、EAP、TAP(async\await)、TPL(严格说是不算的)

.NET 提供了执行异步操作的三种模式：
1、基于任务的异步模式 (TAP) ，该模式使用单一方法表示异步操作的开始和完成。TAP 是在 .NET Framework 4 中引入的。 这是在 .NET 中进行异步编程的推荐方法。C## 中的 async 和 await 关键词以及 Visual Basic 中的 Async 和 Await 运算符为 TAP 添加了语言支持。
2、基于事件的异步模式 (EAP)，是提供异步行为的基于事件的旧模型。这种模式需要后缀为 Async 的方法，以及一个或多个事件、事件处理程序委托类型和 EventArg 派生类型。EAP 是在 .NET Framework 2.0 中引入的。建议新开发中不再使用这种模式。有关详细信息，请参阅基于事件的异步模式 (EAP)。
3、异步编程模型 (APM) 模式（也称为 IAsyncResult 模式），这是使用 IAsyncResult 接口提供异步行为的旧模型。在这种模式下，同步操作需要 Begin 和 End 方法（例如，BeginWrite 和 EndWrite以实现异步写入操作）。不建议新的开发使用此模式。有关详细信息，请参阅异步编程模型 (APM)。

### 异步方法（Async Method TAP模式）
使用async/await关键字实现异步编程，这是比较常用的一种异步实现方式。例如：
```csharp
public async Task TestDoSomeAsync()
{
    await Task.Delay(1000*10);
    Console.WriteLine("Async method completed.");
}
```

### 任务并行库（TPL, Task Parallel Library TAP模式）
通过 Task 和 `Task<T>` 类型实现异步编程，可以利用多核处理器，并发执行多个独立的任务。例如：
```csharp
public static void TestTaskParallel()
{
    var task1 = Task.Run(() =>
    {
        Console.WriteLine("Task 1 completed.");
    });

    var task2 = Task.Run(() =>
    {
        Console.WriteLine("Task 2 completed.");
    });

    Task<int> task3 = Task.Factory.StartNew(() =>
    {
        Console.WriteLine("Task 3 completed.");
        return 20;// 返回一个整数值
    });

    //等待所有任务完成
    Task.WaitAll(task1, task2, task3);
}
```

### Asynchronous Programming Model（APM模式）
是一种经典的异步编程模式，需要手动创建回调函数，用于处理完成或错误的通知。可以通过 IAsyncResult 设计模式的 Begin 和 End 方法来实现，其中 Begin 方法开始异步操作，而 End 方法在异步操作完成时执行，并返回异步操作的结果。
> 需要注意的是，APM 模式通过 IAsyncResult 接口来存储异步操作的状态和结果，相对比较复杂，代码量也较大。同时，在使用 APM 模式时，还需要手动处理回调函数和等待异步操作完成等细节工作，使得开发起来相对较为繁琐。

```csharp
class Program
{
    static void Main(string[] args)
    {
        // 创建异步操作类实例
        MyAsyncClass asyncClass = new MyAsyncClass();

        // 开始异步操作
        IAsyncResult result = asyncClass.BeginDoWork(null, null);

        // 主线程执行其他操作
        // 等待异步操作完成并获取结果
        int res = asyncClass.EndDoWork(result);

        // 处理异步操作的结果
        Console.WriteLine("Result: " + res);

        Console.ReadLine();
    }
}

class MyAsyncClass
{
    /// <summary>
    /// 异步执行的方法
    /// </summary>
    /// <param name="callback">callback</param>
    /// <param name="state">state</param>
    /// <returns></returns>
    public IAsyncResult BeginDoWork(AsyncCallback callback, object state)
    {
        // 创建一个新的异步操作对象
        MyAsyncResult result = new MyAsyncResult(state);

        // 开始异步操作
        Thread thread = new Thread(() =>
        {
            try
            {
                // 执行一些操作
                int res = 1 + 2;

                // 设置异步操作的结果
                result.Result = res;

                // 触发回调函数
                callback?.Invoke(result);
            }
            catch (Exception ex)
            {
                // 设置异步操作的异常
                result.Error = ex;

                // 触发回调函数
                callback?.Invoke(result);
            }

        });
        thread.Start();

        // 返回异步操作对象
        return result;
    }

    /// <summary>
    /// 结束异步执行的方法
    /// </summary>
    /// <param name="result">result</param>
    /// <returns></returns>
    public int EndDoWork(IAsyncResult result)
    {
        // 将 IAsyncResult 转换为 MyAsyncResult 类型，并等待异步操作完成
        MyAsyncResult myResult = (MyAsyncResult)result;
        myResult.AsyncWaitHandle.WaitOne();

        // 在异步操作中抛出异常
        if (myResult.Error != null)
        {
            throw myResult.Error;
        }

        // 返回异步操作的结果
        return myResult.Result;
    }
}

class MyAsyncResult : IAsyncResult
{
    public bool IsCompleted => AsyncWaitHandle.WaitOne(0);
    public WaitHandle AsyncWaitHandle { get; } = new ManualResetEvent(false);
    public object AsyncState { get; }
    public bool CompletedSynchronously => false;

    public int Result { get; set; }

    /// <summary>
    /// 存储异步操作的结果或异常信息
    /// </summary>
    public Exception Error { get; set; }

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="asyncState">asyncState</param>
    public MyAsyncResult(object asyncState)
    {
        AsyncState = asyncState;
    }
}
```

### Event-based Asynchronous Pattern（EAP模式）
一种已过时的异步编程模式，需要使用事件来实现异步编程。例如：
> 需要注意的是，EAP 模式通过事件来实现异步编程，相对于 APM 模式更加简洁易懂，同时也避免了手动处理回调函数等细节工作。但是，EAP 模式并不支持 async/await 异步关键字，因此在一些特定的场景下可能不够灵活。

```csharp
public class MyAsyncClass : Component
{
    /// <summary>
    /// 声明一个委托类型，用于定义异步操作的方法签名
    /// </summary>
    /// <param name="arg"></param>
    /// <returns></returns>
    public delegate int MyAsyncDelegate(int arg);

    /// <summary>
    /// 声明一个事件，用于通知异步操作的完成
    /// </summary>
    public event MyAsyncDelegate OperationNameCompleted;

    /// <summary>
    /// 异步执行方法，接受一个参数 arg
    /// </summary>
    /// <param name="arg"></param>
    public void DoWorkAsync(int arg)
    {
        // 将异步操作放入线程池中执行
        ThreadPool.QueueUserWorkItem(new WaitCallback(DoWork), arg);
    }

    /// <summary>
    /// 真正的异步操作
    /// </summary>
    /// <param name="obj"></param>
    private void DoWork(object obj)
    {
        int arg = (int)obj;
        int res = arg + 1;

        // 触发事件，传递异步操作的结果
        OperationNameCompleted?.Invoke(res);
    }
}
```

## 异步任务(Task)

:::tip

异步任务是一种编程模式或执行模型的概念，它表示的是程序中那些不会阻塞主线程，可以在后台执行的任务。是对程序中非阻塞执行业务逻辑的一个抽象描述

:::

Task是一个包含了异步任务各种状态(正在运行、完成、结果、报错等)的引用类型，还有值类型的版本ValueTask。

Task是对异步任务的抽象，开启异步任务后，当前线程并不会阻塞，而是可以去做其他事情(比如你是CPU，你在做饭的时候，你先蒸米饭，然后不用一直等着蒸米饭，然后你可以去炒菜等)。异步任务(默认)会借助线程池在其他线程上运行。

### Task状态

```c#
var task = new Task<string>(() =>
{
    Thread.Sleep(1500);
    return "done";
});

task.Status.Dump();
task.Start();
task.Status.Dump();
Thread.Sleep(1000);
task.Status.Dump();
Thread.Sleep(2000);
task.Status.Dump();
task.Result.Dump("Result");


// outputs
TaskStatus.Created
TaskStatus.WaitingToRun
TaskStatus.Running
TaskStatus.RanToCompletion
┌────────┐
│ "done" │
└────────┘
  Result 
```

### 任务的结果

异步任务可以具有以下返回类型：

- Task（对于执行操作但是没有返回值的异步任务）
- `Task<TResult>`（对于有T类型返回值的异步任务）
- 任何具有可访问的 GetAwaiter 方法的类型。 GetAwaiter 方法返回的对象必须实现 System.Runtime.CompilerServices.ICriticalNotifyCompletion 接口。
- `IAsyncEnumerable<T>`（对于返回异步流的异步方法）。

## 异步方法

:::tip

异步方法是编程语言中用来定义和执行异步任务的一种具体语法结构或API接口。在不同的编程语言中，异步方法有不同的表现形式，例如在JavaScript中有async function关键字修饰的方法、C#中有async Task或async void返回类型的方法。异步方法是实现异步任务的具体编程手段。

:::

* 将方法标记为async后，可以在方法中使用await关键字
* await关键字会等待异步任务的结束，并获取结果，等待任务结束但是不阻塞线程
* async+await会将方法包装成状态机，await类似于检查点(遇到await的时候切换)，其中MoverNext方法会被底层调用，从而切换状态 
* async Task，返回值还是Task类型，但是在里面可以使用await关键字
* async void
  * 也会生成状态机，但是缺少记录状态等的Task对象
  * 无法聚合异常，需要谨慎处理异常
  * 几乎只是用于事件的注册
* 异步编程具有传染性
  * 当你使用到一个异步方法的时候，调用它的一连串方法都变成了异步方法，都需要使用async await，不建议再将异步方法转同步方法
  * 不过影响不大，几乎所有的自带方法都提供了异步的版本


### 验证异步不阻塞的情况

执行AsyncExecuteTest方法来查看效果

```c#
/// <summary>
/// 测试异步不阻塞的效果
/// </summary>
private async Task AsyncExecuteTest()
{
    PrintThreadId("Before");
    await FooAsync();
    PrintThreadId("After");
}

private async Task FooAsync()
{
    PrintThreadId("Before");
    await Task.Delay(1000);
    PrintThreadId("After");
}

private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

// outputs
AsyncExecuteTest Before 1
FooAsync Before 1        
FooAsync After 5
AsyncExecuteTest After 5
```

从这个执行效果可以看到，首先刚开始执行的时候线程Id为，然后当执行到FooAsync的await的时候，线程Id为1的去忙其他事情了，然后这个await等待1s结束后，线程Id为5的继续往下执行，线程Id为1的并没有阻塞在这里。

### 查看生成的状态机

编写一个简单的异步方法

```c#
public async Task Foo()
{
    await Task.Delay(1);
    Console.WriteLine("aa");
}
```

通过[工具](https://sharplab.io/)去查看生成的状态机(美化后如下)

```c#
private sealed class FooStateMachine : IAsyncStateMachine
{
    public int currState;

    public AsyncTaskMethodBuilder builder;

    public C <>4__this;

    private TaskAwaiter taskAwaiter;

    private void MoveNext()
    {
        int num = currState;
        try
        {
            TaskAwaiter awaiter;
            if (num != 0)
            {
                awaiter = Task.Delay(1).GetAwaiter();
                if (!awaiter.IsCompleted)
                {
                    num = (currState = 0);
                    taskAwaiter = awaiter;
                    FooStateMachine stateMachine = this;
                    builder.AwaitUnsafeOnCompleted(ref awaiter, ref stateMachine);
                    return;
                }
            }
            else
            {
                awaiter = taskAwaiter;
                taskAwaiter = default(TaskAwaiter);
                num = (currState = -1);
            }
            awaiter.GetResult();
            Console.WriteLine("aa");
        }
        catch (Exception exception)
        {
            currState = -2;
            builder.SetException(exception);
            return;
        }
        currState = -2;
        builder.SetResult();
    }
}

[NullableContext(1)]
[AsyncStateMachine(typeof(FooStateMachine))]
[DebuggerStepThrough]
public Task Foo()
{
    FooStateMachine stateMachine = new FooStateMachine();
    stateMachine.builder = AsyncTaskMethodBuilder.Create();
    stateMachine.<>4__this = this;
    stateMachine.currState = -1;
    stateMachine.builder.Start(ref stateMachine);
    return stateMachine.builder.Task;
}
```

### Void返回值

Void 返回异步方法的调用方无法捕获从该方法引发的异常。 此类未经处理异常有可能导致应用程序失败。 

```c#
async Task Main()
{
	try
	{
        // 这里添加await会报错，因为无法await void
		VoidAsync();
	}
	catch (Exception ex)
	{
		Console.WriteLine("我捕捉到了VoidAsync的异常");
	}

	Console.WriteLine("Done");
}

async void VoidAsync()
{
	await Task.Delay(1000);
	throw new ArgumentException("抛出错误");
	Console.WriteLine("VoidAsync没有报错");
}

// outputs
Done
```

如果返回 `Task` 或 `Task<TResult>` 的方法引发异常，则该异常存储在返回的任务中。 等待任务时，将重新引发异常。 请确保可以产生异常的任何异步方法都具有返回类型`Task` 或 `Task<TResult>`，并确保会等待对方法的调用。

```c#
async Task Main()
{
	try
	{
		await VoidAsync();
	}
	catch (Exception ex)
	{
		Console.WriteLine("我捕捉到了VoidAsync的异常");
	}

	Console.WriteLine("Done");
}

async Task VoidAsync()
{
	await Task.Delay(1000);
	throw new ArgumentException("抛出错误");
	Console.WriteLine("VoidAsync没有报错");
}

// outputs
我捕捉到了VoidAsync的异常
Done
```

### 阻塞情景

阻塞线程有什么影响那？比如在下面的示例，Winform程序中我点击按钮后调用一个同步方法

```c#
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private void button1_Click(object sender, EventArgs e)
    {
        var i = Foo();
    }

    private int Foo()
    {
        Thread.Sleep(3000);
        return 1;
    }
}
```

在我点击按钮后，去执行了Foo方法，但是这个时候也发现窗口卡死了，不能移动等，这是因为当执行到Foo方法的时候，里面的等待阻塞了主线程，这个时候导致窗口卡死，再测试下修改为异步方法

```c#
public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent();
    }

    private async void button1_Click(object sender, EventArgs e)
    {
        var i = await FooAsync();
    }

    private async Task<int> FooAsync()
    {
        await Task.Delay(3000);

        return 1;
    }
}
```

修改为异步方法后，当我们点击按钮执行FooAsync方法时候，这个时候主线程没有被阻塞，窗口可以拖动。这里在UI程序中会有这个影响，不在UI程序中，阻塞线程会导致当前线程一直在此处等待，降低系统响应能力。

#### Task.Wait & Task.Result

如果任务没有执行结束，那么就会阻塞当前线程，容易导致死锁。



Task.GetAwaiter().GetResult()和Task.Result有什么区别那，当抛出异常的时候，Task.Result会多包装一层，比如

```c#
async Task Main()
{
	try
	{
		Console.WriteLine("Result  异常会被包装一层");
		var a = FooAsync().Result;
	}
	catch (Exception ex)
	{
		Console.WriteLine($"异常类型:{ex.GetType().FullName}");
		Console.WriteLine($"message:{ex.Message}");
		Console.WriteLine($"message:{ex.InnerException.Message}");
	}

	Console.WriteLine("----分割线----");

	try
	{
		Console.WriteLine("GetAwaiter().GetResult()  异常没有被包装");
		var a = FooAsync().GetAwaiter().GetResult();
	}
	catch (Exception ex)
	{
		Console.WriteLine($"异常类型:{ex.GetType().FullName}");
		Console.WriteLine($"message:{ex.Message}");
	}

	Console.WriteLine("Done");
}

async Task<int> FooAsync()
{
	await Task.Delay(1000);
	throw new ArgumentException("抛出错误");
	Console.WriteLine("VoidAsync没有报错");
}

// outputs
Result  异常会被包装一层
异常类型:System.AggregateException
message:One or more errors occurred. (抛出错误)
message:抛出错误
----分割线----
GetAwaiter().GetResult()  异常没有被包装
异常类型:System.ArgumentException
message:抛出错误
Done
```

#### Task.Delay vs Thread.Sleep

Task.Delay：是一个异步任务，会立刻释放当前的线程

Thread.Sleep：会阻塞当前的线程



在带UI界面的项目中，如果使用Thread.Sleep会阻塞线程导致页面卡死（线程会休眠等待，等于浪费了资源）。所以在异步编程中如果遇到等待需要使用。

```csharp
await Task.Delay(1000);
```

避免线程的等待，让线程被高效利用，其底层是Timer实现的，通过Timer调度之后会切换线程

#### IO等操作的同步方法

如果一个方法实在没有异步方法，可以使用Task.Run进行包装

#### 其他繁重且耗时的操作

IO操作复杂的操作，要使用异步方法处理

### 如何实现不同的线程切换

按照计算机的执行原理，对同一个方法的一次调用期间，这个方法的所有代码都会运行在同一个线程中，不会出现一个方法的代码的其中一段和另一段运行在不同线程的情况，但是异步中会出现是因为异步方法的代码被拆分成了对MoveNext方法的多次调用，对MoveNext方法的多次调用当然就可以运行在不同的线程中。

总结：编辑器把async拆分成多次方法的调用，程序会运行的时候会通过从线程池中取出空闲线程执行不同的MoveNext调用的方式来避免线程的“空等”，这样子就可以像编写同步代码一样编写异步代码，从而提升系统的并发处理能力。

## 重要思想

:::tip

不阻塞

:::

* await会暂时释放当前线程，使得该线程可以执行其他工作，而不必阻塞当前线程直到异步操作完成
* 不要在异步方法里面使用任何方式阻塞当前线程

## 同步上下文

一种管理和协调线程的机制，允许开发者将代码的执行切换到特性的线程上。

Winforms和WPF拥有同步上下文(UI线程)，而在Asp.Net Core和控制台项目中没有SynchronizationContext因此不用管ConfigureAwait(false)等。

### ConfigureAwait

* 配置任务通过await方法结束后是否回到原来的线程，默认是True。
* 一般只有UI线程会采用这种策略，在UI程序中需要谨慎操作

## Task和ValueTask

`ValueTask<T>` 是 `Task<T>` 类型轻量化的封装，它是结构类型（值类型）。使用方式与 `Task<T>` 相似，但它在同步完成任务或返回立即可用的结果时（这在列举序列时会经常发生），可以避免不必要的内存开销，比 `Task<T>` 更高效。

- `ValueTask<T>`用于微优化的场景，你可能永远不需要编写返回此类型的方法
- `Task<T>`和Task是引用类型，实例化他们需要基于堆的内存分配和后续的收集。
- 优化的一种极端形式就是编写无需分配此类内存的代码；换句话说这不实例化任何引用类型，不会给垃圾收集增加负担。
- 为了支持这种模式，C#引入了`ValueTask`和`ValueTask<T>`这两个结构体，编译器允许使用他们替代`Task`和`Task<T>`
   - `async ValueTask<int> Foo() { ... }`

### 注意事项

- `ValueTask<T>`并不常见，它的出现纯粹是为了性能
- 这意味着它被不恰当的值类型语义所困扰，这可能会导致意外。为避免错误行为，必须避免以下情况
   - 多次await同一个`ValueTask<T>`
   - 操作没结束的时候调用 `.GetAwaiter().GetResult()`
- 如果你需要进行这些操作，那么先调用AsTask方法，操作它返回的Task。

## 操作

### 如何创建异步任务

已知一个同步方法SyncFoo，我们如何要将其变成一个异步方法，那么就可以使用Task.Run、Task.Factory.StartNew、new Task等方法

```c#
/// <summary>
/// 创建异步任务
/// </summary>
/// <returns></returns>
private async Task CreateAsyncTask()
{
    PrintThreadId("Before");
    await Task.Run(SyncFoo);
    PrintThreadId("After");
}

/// <summary>
/// 同步方法
/// </summary>
private void SyncFoo()
{
    PrintThreadId("Before");
    Thread.Sleep(1000);
    PrintThreadId("After");
}

private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

// outputs
CreateAsyncTask Before 1
SyncFoo Before 4        
SyncFoo After 4
CreateAsyncTask After 4
```

当执行SyncFoo方法的时候，这个时候已经不在主线程上了

### 如何开启多个异步任务

已知一个异步方法HeavyJob，要为其创建多个异步任务，那么该如何操作

```c#
private async Task CreateManyTask()
{
    var inputs = Enumerable.Range(0, 10).ToArray();
    var tasks = new List<Task<int>>();
    foreach (var input in inputs)
    {
        tasks.Add(HeavyJob(input));
    }

    await Task.WhenAll(tasks);
    var outputs = tasks.Select(t => t.Result).ToArray();
}

private async Task<int> HeavyJob(int input)
{
    // 模拟根据input值请求一个耗时的操作
    PrintThreadId("Before");
    await Task.Delay(1000);
    PrintThreadId("After");
    return input * input;
}

private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

// outputs
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob Before 1
HeavyJob After 5
HeavyJob After 7
HeavyJob After 8
HeavyJob After 8
HeavyJob After 5
HeavyJob After 7
HeavyJob After 5
HeavyJob After 8
HeavyJob After 9
HeavyJob After 7
```

### 异步任务如何取消

:::tip

推荐所有的异步方法都带上**CancellationToken**参数

取消令牌使用指南：[此处](https://dev.to/rahulpnath/a-net-programmers-guide-to-cancellationtoken-1m0l)

:::

* 任务取消并不是实时去取消的，而是触发后取消的，如下操作

```csharp
var tokenSource = new CancellationTokenSource(3000);
CancellationToken cancellationToken = tokenSource.Token;
while (true)
{
    // 这只是执行到这一步了，然后检测是否取消了，如果取消了就报错，而不是实时监听
    cancellationToken.ThrowIfCancellationRequested();
    Console.WriteLine(DateTime.Now);
}
```

- 使用CancellationTokenSource实现对异步进行取消

```csharp
using var cts = new CancellationTokenSource();

var sw = Stopwatch.StartNew();
try
{
    var task = Task.Delay(100000, cts.Token);

    Thread.Sleep(2000);
    await cts.CancelAsync();

    await task;
}
catch (TaskCanceledException ex)
{
    Console.WriteLine("Task canceled");
}

Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds} ms");

// outputs
Task canceled
Elapsed: 2262 ms
```

- 可以在构造CancellationTokenSource时候指定一个时间间隔，以便在一段时间之后启动取消。它对于实现超时非常有效，无论是同步还是异步

```csharp
using var cts = new CancellationTokenSource(3000);

var sw = Stopwatch.StartNew();
try
{
    await Task.Delay(100000, cts.Token);
}
catch (TaskCanceledException ex)
{
    Console.WriteLine("Task canceled");
}

Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds} ms");

// outputs
Task canceled
Elapsed: 3254 ms
```

- CancellationTokenSource还可以通过CancelAfter方法来取消

```csharp
using var cts = new CancellationTokenSource();
cts.CancelAfter(3000);

var sw = Stopwatch.StartNew();
try
{
    await Task.Delay(100000, cts.Token);
}
catch (TaskCanceledException ex)
{
    Console.WriteLine("Task canceled");
}

Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds} ms");

// outputs
Task canceled
Elapsed: 3247 ms
```

- CancellationToken这个结构体提供了一个Register方法，它可以让你注册一个回调委托，这个委托会在取消时候触发。它会返回一个对象，这个对象在取消注册时候可以被Dispose掉。支持注册多个，如果注册了多个，那么后注册的会先触发

```csharp
using var cts = new CancellationTokenSource(3000);

cts.Token.Register(() =>
{
    // 任务取消的善后操作
    // 比如关闭数据库连接，释放资源等
    Console.WriteLine("cancel");
});

var sw = Stopwatch.StartNew();
try
{
    await Task.Delay(100000, cts.Token);
}
catch (TaskCanceledException ex)
{
    Console.WriteLine("Task canceled");
}

Console.WriteLine($"Elapsed: {sw.ElapsedMilliseconds} ms");
```

* 在API中，框架会自动传递一个CancellationToken，如果前端请求取消，那么就直接触 发取消，节约服务器资源

```csharp
[HttpGet("{id:long}")]
public async Task<IResultModel<GetUserInfoResponse>> GetDetailsAsync([FromRoute] long id, CancellationToken cancellationToken)
{
    // xxx
}
```

* Task.Run传入CancellationToken

Task.Run也支持传入cancellationToken,这里传入的目的就相当于在执行之前先判断一下任务是否被取消，如果在执行前发现了任务已经被取消，那么就抛出异常

```csharp
var token = cancellationToken ?? CancellationToken.None;
Task.Run(() => { Console.WriteLine("aaa"); }, token);
```

但是如果想通过这个方法实现这个任务在执行中想被取消，这样子是实现不了的，需要在Task.Run的里面进行判断

```csharp
if (token.IsCancellationRequested)
    token.ThrowIfCancellationRequested();
```

### 如何编写支持取消的异步任务

推荐给所有异步方法传入CancellationToken来支持取消操作，那么我们该如何编写异步方法给其他人调用那，不仅仅需要考虑到对方可能会需要进行取消，也需要考虑到对方不需要取消，那么有下面几个方案

```csharp
// 使用方法重载

/// <summary>
/// 支持取消
/// </summary>
/// <param name="cancellationToken"></param>
public async Task FooAsync(CancellationToken cancellationToken)
{
    await Task.Delay(3000, cancellationToken);

    // xxx 其他的业务逻辑
}

/// <summary>
/// 不支持取消
/// </summary>
/// <returns></returns>
public Task FooAsync()
{
    return FooAsync(CancellationToken.None);
}


// 使用可为null的参数
public async Task FooAsync(int i, CancellationToken? cancellationToken = null)
{
    var token = cancellationToken ?? CancellationToken.None;
    await Task.Delay(3000, token);

    // xxx 其他的业务逻辑
    Console.WriteLine(i);
}
```

但是如果一个方法内的操作都是我们自己定义的操作，那么该如何支持取消那

```csharp
public Task CustomerSupportCancelTaskAsync(int i, CancellationToken? cancellationToken = null)
{
    var token = cancellationToken ?? CancellationToken.None;

    // 比如我们有一个同步方法，我们希望该方法支持取消
    return Task.Run(() =>
    {
        // 执行之前先判断下是否被取消
        if (token.IsCancellationRequested)
            token.ThrowIfCancellationRequested();

        // 循环执行某个操作
        for (var j = 0; j < 1000; j++)
        {
            if (token.IsCancellationRequested)
                token.ThrowIfCancellationRequested();

            Thread.Sleep(3000);
            Console.WriteLine("执行中" + i);
        }
    }, token);
}
```

上面示例我们为了可以取消，所以在每次循环的时候判断下是否被取消了，如果你的方法不是循环，实在是没有更好的方法了，那么就好使用笨方法了，在比较耗时的操作执行前加上下面的判断

```csharp
if (token.IsCancellationRequested)
    token.ThrowIfCancellationRequested();
```

当然，如果有支持传入CancellationToken的方法，首选该方法，就不要自己实现了

### 异步方法会在新线程中执行吗？

像这种异步，里面没有await，没有开启新线程，这个就不是在新线程中执行的。
```csharp
static async Task<decimal> CalcAsync(int n)
{
    Console.WriteLine($"threadid:{Thread.CurrentThread.ManagedThreadId}");
    decimal result = 1;
    Random random = new Random();
    for (int i = 0; i < n * n; i++)
    {
        result = result * (decimal)random.NextDouble();
    }
    return result;
}
```
异步方法并不会自动在新线程中执行，除非把代码放到新线程中执行。

### 任务超时如何实现

#### WhenAny

当任意一个线程成功就返回，然后判断返回的Task是否是我们想要的Task任务

```csharp
using var cts = new CancellationTokenSource();
var fooTask = FooAsync(cts.Token);
var completedTask = await Task.WhenAny(fooTask, Task.Delay(2000));
if (completedTask != fooTask)
{
    cts.Cancel();
    await fooTask;
    Console.WriteLine("Timeout ...");
}

Console.WriteLine("Done");

// 异步任务
async Task FooAsync(CancellationToken cancellationToken)
{
    try
    {
        Console.WriteLine("Foo start ...");
        await Task.Delay(5000, cancellationToken);
        Console.WriteLine("Foo end");
    }
    catch (OperationCanceledException ex)
    {
        Console.WriteLine($"Foo cancel  message:{ex.Message}");
    }
}
```

将上面的方法优化后还可以将其封装为一个扩展方法

```csharp
try
{
    await FooAsync(CancellationToken.None).TimeoutAfter(TimeSpan.FromSeconds(2));
    Console.WriteLine("Foo success");
}
catch (TimeoutException)
{
    Console.WriteLine("Foo timeout");
}

Console.WriteLine("Done");


// 异步任务
async Task FooAsync(CancellationToken cancellationToken)
{
    try
    {
        Console.WriteLine("Foo start ...");
        await Task.Delay(5000, cancellationToken);
        Console.WriteLine("Foo end");
    }
    catch (OperationCanceledException ex)
    {
        Console.WriteLine($"Foo cancel  message:{ex.Message}");
    }
}

static class AsyncExtensions
{
    /// <summary>
    /// 无返回值的超时处理
    /// </summary>
    /// <param name="task"></param>
    /// <param name="timeout"></param>
    /// <exception cref="TimeoutException"></exception>
    public static async Task TimeoutAfter(this Task task, TimeSpan timeout)
    {
        using var cts = new CancellationTokenSource();
        var completedTask = await Task.WhenAny(task, Task.Delay(timeout, cts.Token));
        if (completedTask != task)
        {
            // 注意：这里并没有将task给停止掉，需要优化
            cts.Cancel();
            throw new TimeoutException();
        }

        await task;
    }
}
```

#### WaitAsync(推荐)

在.Net6+中我们可以使用WaitAsync扩展方法来更方便的处理异步超时操作

```csharp
using var cts = new CancellationTokenSource();
try
{
    await FooAsync(cts.Token).WaitAsync(TimeSpan.FromSeconds(2));
    Console.WriteLine("Foo success");
}
catch (TimeoutException)
{
    // 超时后记得要取消任务
    cts.Cancel();
    Console.WriteLine("Foo timeout");
}

Console.WriteLine("Done");


// 异步任务
async Task FooAsync(CancellationToken cancellationToken)
{
    try
    {
        Console.WriteLine("Foo start ...");
        await Task.Delay(5000, cancellationToken);
        Console.WriteLine("Foo end");
    }
    catch (OperationCanceledException ex)
    {
        Console.WriteLine($"Foo cancel  message:{ex.Message}");
    }
}
```

#### CancellationTokenSource取消

借助CancellationTokenSource的取消操作来处理

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
try
{
    await FooAsync(cts.Token);
    Console.WriteLine("Foo success");
}
catch (TimeoutException)
{
    cts.Cancel();
    Console.WriteLine("Foo timeout");
}

Console.WriteLine("Done");


// 异步任务
async Task FooAsync(CancellationToken cancellationToken)
{
    try
    {
        Console.WriteLine("Foo start ...");
        await Task.Delay(5000, cancellationToken);
        Console.WriteLine("Foo end");
    }
    catch (OperationCanceledException ex)
    {
        Console.WriteLine($"Foo cancel  message:{ex.Message}");
        //为了更能描述情况，抛出超时异常
        throw new TimeoutException();
    }
}
```

#### Task的Wait

```csharp
try
{
    var cts = new CancellationTokenSource();
    var task = Task.Run(async () => { await FooAsync(cts.Token); });
    if (!task.Wait(TimeSpan.FromSeconds(2)))
    {
        cts.Cancel();
        // throw new TimeoutException("超时");
    }
}
catch (Exception ex)
{
    Console.WriteLine("task取消后抛出的超时异常信息被丢失了");
}

Console.WriteLine("Done");

Console.ReadLine();

// 异步任务
async Task FooAsync(CancellationToken cancellationToken)
{
    try
    {
        Console.WriteLine("Foo start ...");
        await Task.Delay(5000, cancellationToken);
        Console.WriteLine("Foo end");
    }
    catch (TaskCanceledException ex)
    {
        Console.WriteLine($"Foo task cancel  message:{ex.Message}");
        //为了输出更形象的超时
        throw new TimeoutException();
    }
}
```

### 在异步任务中如何汇报进度

```csharp
private async Task ProgressNotification()
{
    // 创建一个进度报告对象
    IProgress<ProgressData> progress = new Progress<ProgressData>(UpdateProgress);

    // 调用异步方法并传递进度报告器
    await PerformLongRunningOperation(progress);

    // 回调方法用于处理进度更新事件
    void UpdateProgress(ProgressData data)
    {
        Console.WriteLine($"进度：{data.Percentage}%，消息：{data.Message}");
    }
}

/// <summary>
/// 异步方法，在其中模拟长耗时操作并报告进度
/// </summary>
/// <param name="progressReporter"></param>
private static async Task PerformLongRunningOperation(IProgress<ProgressData> progressReporter)
{
    for (var i = 0; i <= 100; i++)
    {
        // 模拟工作...
        await Task.Delay(500); // 假设这是耗时的操作

        // 报告进度
        var progressData = new ProgressData { Percentage = i, Message = $"正在进行第{i}阶段" };
        progressReporter.Report(progressData);
    }
}
```

PerformLongRunningOperation 方法在每次迭代时都会报告进度，通过 progressReporter.Report 方法调用 UpdateProgress 回调函数来更新UI或其他监听者上的进度状态。这样可以在长时间运行的任务中保持与主线程的良好交互，而不阻塞主线程。

### 如何在同步方法中调用异步方法

:::tip

能用异步就不考虑使用同步

:::

在.NET Core中，如果你希望在一个同步上下文中执行异步操作，可以使用`.Wait`、`.Result`或`.GetAwaiter().GetResult()`来同步等待异步方法的结果。但这通常不建议这样做，因为可能会导致线程阻塞和潜在的死锁问题。

#### 阻塞示例

`GetAwaiter().GetResult()`相比较`.Result`的区别是，当抛出异常的时候，前者的异常信息没有被包装，后者包装了异常信息。控制台框架的异步Main方法也是通过`GetAwaiter().GetResult()`来实现的

示例如下

```csharp
private void BlockSample()
{
    PrintThreadId("Wait Before");
    FooAsync().Wait();
    PrintThreadId("Wait After");

    PrintThreadId("Result Before");
    var i = FooAsync2().Result;
    PrintThreadId("Result After");

    PrintThreadId("GetAwaiter().GetResult() Before");
    var a = FooAsync2().GetAwaiter().GetResult();
    PrintThreadId("GetAwaiter().GetResult() After");

    async Task FooAsync()
    {
        await Task.Delay(1000);
    }

    async Task<int> FooAsync2()
    {
        await Task.Delay(1000);
        return 1;
    }
}

/// <summary>
/// 打印线程ID
/// </summary>
/// <param name="message"></param>
/// <param name="name"></param>
private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

// outputs
BlockSample Wait Before 1
BlockSample Wait After 1
BlockSample Result Before 1
BlockSample Result After 1
BlockSample GetAwaiter().GetResult() Before 1
BlockSample GetAwaiter().GetResult() After 1
```

#### SafeFireAndForget

没有在实例化对象的时候占用时间，也没有说拿不到异常信息和最后结果

```csharp
/// <summary>
/// 一发即忘的方案
/// </summary>
private void SafeFireAndForgetMethod()
{
    PrintThreadId($"start {DateTime.Now.ToStandardString()}");
    // 这一步并没有阻塞在这里等待2s
    var syncModel = new MySyncModel();
    PrintThreadId($"loading Data {DateTime.Now.ToStandardString()}");
    Thread.Sleep(2500);
    var data = syncModel.Data;
    PrintThreadId($"Data is loaded:{syncModel.IsDataLoaded} {DateTime.Now.ToStandardString()}");
}

/// <summary>
/// 打印线程ID
/// </summary>
/// <param name="message"></param>
/// <param name="name"></param>
private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

class MySyncModel
{
    public List<int>? Data { get; private set; }

    public bool IsDataLoaded { get; private set; } = false;

    public MySyncModel()
    {
        SafeFireAndForget(LoadDataAsync(), () => { IsDataLoaded = true; }, e => throw e);
    }

    static async void SafeFireAndForget(Task task, Action? onCompleted = null, Action<Exception>? onError = null)
    {
        try
        {
            await task;
            onCompleted?.Invoke();
        }
        catch (Exception e)
        {
            onError?.Invoke(e);
        }
    }

    /// <summary>
    /// 构造类的时候加载该数据
    /// </summary>
    async Task LoadDataAsync()
    {
        await Task.Delay(2000);
        Data = Enumerable.Range(1, 10).Select(t => t).ToList();
    }
}

// outputs
SafeFireAndForgetMethod start 2024-04-01 21:27:40 1
SafeFireAndForgetMethod loading Data 2024-04-01 21:27:40 1
SafeFireAndForgetMethod Data is loaded:True 2024-04-01 21:27:43 1
```

#### ContinueWith

借助ContinueWith来实现调用异步方法

```csharp
private void ContinueWithMethod()
{
    PrintThreadId($"start {DateTime.Now.ToStandardString()}");
    // 这一步并没有阻塞在这里等待2s
    var syncModel = new MySyncModel2();
    PrintThreadId($"loading Data {DateTime.Now.ToStandardString()}");
    Thread.Sleep(2500);
    var data = syncModel.Data;
    PrintThreadId($"Data is loaded:{syncModel.IsDataLoaded} {DateTime.Now.ToStandardString()}");
}

/// <summary>
/// 打印线程ID
/// </summary>
/// <param name="message"></param>
/// <param name="name"></param>
private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

class MySyncModel2
{
    public List<int>? Data { get; private set; }

    public bool IsDataLoaded { get; private set; } = false;

    public MySyncModel2()
    {
        LoadDataAsync().ContinueWith(OnDataLoaded);
    }

    private bool OnDataLoaded(Task t)
    {
        if (t.IsFaulted)
        {
            Console.WriteLine(t.Exception.InnerException.Message);
        }

        return IsDataLoaded = true;
    }

    /// <summary>
    /// 构造类的时候加载该数据
    /// </summary>
    async Task LoadDataAsync()
    {
        await Task.Delay(2000);
        Data = Enumerable.Range(1, 10).Select(t => t).ToList();
    }
}
```

虽然ContinueWith是原生的操作，但是该操作会将传入的委托的方法包装为一个Task，就会造成多余的浪费，并且一般使用ContinueWith需要设置的第二个参数TaskScheduler配置

#### 私有字段方案

通过将异步方法赋值给类里面的私有Task字段，然后后续可以通过该私有字段进行获取值以及得到异常信息

```csharp
private async Task PrivateFieldMethod()
{
    PrintThreadId($"start {DateTime.Now.ToStandardString()}");
    // 这一步并没有阻塞在这里等待2s
    var syncModel = new MySyncModel3();
    PrintThreadId($"loading Data {DateTime.Now.ToStandardString()}");
    await syncModel.DisplayDataAsync();
    PrintThreadId($"Data is loaded {DateTime.Now.ToStandardString()}");
}

/// <summary>
/// 打印线程ID
/// </summary>
/// <param name="message"></param>
/// <param name="name"></param>
private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

class MySyncModel3
{
    public List<int>? Data { get; private set; }

    private readonly Task _loadDataTask;

    public MySyncModel3()
    {
        _loadDataTask = LoadDataAsync();
    }

    public async Task DisplayDataAsync()
    {
        await _loadDataTask;
    }

    /// <summary>
    /// 构造类的时候加载该数据
    /// </summary>
    async Task LoadDataAsync()
    {
        await Task.Delay(2000);
        Data = Enumerable.Range(1, 10).Select(t => t).ToList();
    }
}

// outputs
ieldMethod start 2024-04-01 21:41:27 1
PrivateFieldMethod loading Data 2024-04-01 21:41:27 1
PrivateFieldMethod Data is loaded 2024-04-01 21:41:29 5
```

只要涉及到await就会出现状态机切换，所以也造成了多余的资源浪费

#### Async Factory

通过将类设置为私有方式，不允许new的方法构建，然后通过调用一个Create的方法进行构建对象

```csharp
private async Task AsyncFactoryMethod()
{
    PrintThreadId($"start {DateTime.Now.ToStandardString()}");
    var syncModel = await MySyncModel4.CreateAsync();
    PrintThreadId($"Data is loaded {DateTime.Now.ToStandardString()}");
}

/// <summary>
/// 打印线程ID
/// </summary>
/// <param name="message"></param>
/// <param name="name"></param>
private void PrintThreadId(string message, [CallerMemberName] string? name = null)
{
    Console.WriteLine($"{name} {message} {Environment.CurrentManagedThreadId}");
}

class MySyncModel4
{
    public List<int>? Data { get; private set; }

    private MySyncModel4()
    {
    }

    public static async Task<MySyncModel4> CreateAsync()
    {
        var service = new MySyncModel4();
        await service.LoadDataAsync();
        return service;
    }

    /// <summary>
    /// 构造类的时候加载该数据
    /// </summary>
    async Task LoadDataAsync()
    {
        await Task.Delay(2000);
        Data = Enumerable.Range(1, 10).Select(t => t).ToList();
    }
}

// outputs
AsyncFactoryMethod start 2024-04-01 21:53:42 1
AsyncFactoryMethod Data is loaded 2024-04-01 21:53:44 5
```

#### Nito.AsyncEx

借助第三方nuget包来实现同步方法中调用异步方法

```xml
<PackageReference Include="Nito.AsyncEx" Version="5.1.2" />
```

编写示例代码

```csharp
var result = Nito.AsyncEx.AsyncContext.Run(GetName);
Console.WriteLine(result);

try
{
    Nito.AsyncEx.AsyncContext.Run(ThrowInfo);
}
catch (Exception ex)
{
    Console.WriteLine($"报错了：{ex.Message}");
}

Console.ReadLine();

async Task<string> GetName()
{
    await Task.Delay(100);
    return "test";
}

async Task<string> ThrowInfo()
{
    await Task.Delay(100);
    throw new ArgumentException("参数错误");
    return "test";
}

// outputs
test
报错了：参数错误
```

### 搭配Yield

```csharp
//同步方法中使用
static IEnumerable<string> Test1()
{
    yield return "a";
    yield return "b";
    yield return "c";
}

//异步方法中使用
static async IAsyncEnumerable<string> Test2()
{
    await Task.Delay(1000);
    yield return "a";
    yield return "b";
    yield return "c";
    yield return "c";
}
```

### 在异步方法中线程同步

#### 为什么不能使用lock

因为lock底层是使用Monitor来实现的线程同步，工作机制是基于互斥锁，在单个线程上获取锁并执行代码块的时候，其他试图获取相同锁的线程将被阻塞，直到锁释放。不直接支持异步编程是因为可能会导致意外的情况。

* 异步编程通常包含await表达式，当遇到await的时候，线程可能会释放当前线程到线程池，在这种情况下，已经持有锁的线程已经离开的lock代码块，锁也不会立即释放，这会导致其他线程被无效的阻塞。
* 在异步方法中使用lock可能会导致死锁，当异步任务完成的时候，线程可能在不同的上下文中回复执行，如果这种回复的线程试图重新获取已经在等待锁释放的线程持有的锁，就可能会导致死锁。
* 异步编程更倾向于采用非阻塞的并发策略，这些允许线程在等待资源释放的时候能够更有效的利用cpu时间，而不是简单地阻塞在那里。

```csharp
private Task LockSample()
{
    lock (_lock)
    {
    	// 不能在lock语句体中await
        // await Task.Delay(100);
    }

    return Task.CompletedTask;
}
```

#### SemaphoreSlim

使用SemaphoreSlim的WaitAsync方法来控制线程同步

```csharp
var sem = new SemaphoreSlim(1, 1);

var stopwatch = Stopwatch.StartNew();
var tasks = Enumerable.Range(0, 10).Select(HeavyJob).ToArray();

await Task.WhenAll(tasks);
var outputs = tasks.Select(t => t.Result).ToArray();
Console.WriteLine($"花费时间：{stopwatch.ElapsedMilliseconds}ms");

outputs.Dump();

async Task<int> HeavyJob(int input)
{
    // 模拟根据input值请求一个耗时的操作
    await sem.WaitAsync();
    await Task.Delay(200);
    sem.Release();
    return input * input;
}

// outputs
花费时间：2097ms
```

#### 其他方法

在某些复杂的同步场景下，可以结合 `TaskCompletionSource<T> `来协调异步任务之间的依赖关系和顺序执行，还可以通过第三方库来实现异步方法中的线程同步，例如Microsoft.VisualStudio.Threading包里面的AsyncManualResetEvent和Nito.AsyncEx包里面的AsyncLock

## 常见误区

### 异步一定是多线程吗？

* 异步编程不一定非得需要多线程来实现
  * 通过时间片轮转调度
* 比如在单个线程上使用异步I/O或者事件驱动的编程模型(EAP)
* 单线程异步：自己定好定时器，到时间之前去做别的事情
* 多线程异步：将任务交给不同的线程，并由自己来指挥调度

### 异步方法一定要写成`Async Task`

* async关键字只是用来配置await使用，从而将方法包装为状态机
* 本质上仍然是Task，只不过提供了语法糖，并且函数体中可以直接`return Task`的泛型类型
* 接口中无法声明`async Task`，只能写Task

### await是否一定会切换同步上下文

* 在使用await关键字调用并等待一个异步任务的时候，异步方法不一定会立刻来到新的线程上
* 如果await了一个已经完成的任务(包含`Task.Delay(0)`)，则会直接获得结果

### 异步可以全面取代多线程吗

异步编程与多线程有一定的关系，但是两者并不是可以完全互相替代

### `Task.Result`一定会阻塞当前线程吗

不一定，如果该Task任务已经完成，那么`Task.Result`就可以直接得到结果

### 开启的异步任务一定不会阻塞当前线程吗

await关键字不一定会立刻释放当前线程，所以如果调用的异步方法中存在阻塞(例如调用了`Thread.Sleep(0)`)，那么依旧会阻塞当前上下文对应的线程

## 参考文档

聊聊多线程哪一些事儿：[https://www.cnblogs.com/xiaoXuZhi/p/XYH_tsak_one.html](https://www.cnblogs.com/xiaoXuZhi/p/XYH_tsak_one.html)
勤快哥.net并行编程：[此处](https://masuit.com/1201?kw=%E8%B0%88%E4%B8%80%E8%B0%88.net%E4%B8%AD%E7%9A%84%E5%B9%B6%E8%A1%8C%E7%BC%96%E7%A8%8B&t=ud7cj3ltu0ow)
[https://www.cnblogs.com/Can-daydayup/p/17383651.html](https://www.cnblogs.com/Can-daydayup/p/17383651.html) | C# 异步有多少种实现方式？

## 资料
异步返回类型：[https://learn.microsoft.com/zh-cn/dotnet/csharp/asynchronous-programming/async-return-types](https://learn.microsoft.com/zh-cn/dotnet/csharp/asynchronous-programming/async-return-types)
