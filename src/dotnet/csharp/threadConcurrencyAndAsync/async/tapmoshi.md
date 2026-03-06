---
title: TAP模式
lang: zh-CN
date: 2023-11-12
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: tapmoshi
slug: ifashs
docsId: '29634492'
---

## 描述
- async和await关键字可以让你写出来和同步代码一样简洁且结构相同的异步代码。
- await关键字简化了附加Continuation的过程
- async修饰符会让编译器把await当作关键字而不是标识符(c#5以前可能会使用await作为标识符)
- async修饰符只能作用于方法(包括lambda表达式)
   - 该方法可以返回void、Task、`Task<TResult>`
- async修饰符对方法的签名或者public元数据没有影响，它只会影响方法内部
   - 在接口内使用async是没有意义的
   - 使用async来重载非async的方法却是合理的(只要方法签名一致)
- 在C#中只要类包含GetAwaiter() 方法和bool IsCompleted属性，并且GetAwaiter()的返回值包含 GetResult()方法、bool IsCompleted属性和实现了 INotifyCompletion接口，那么这个类的实例就是可以await 的

无论方法是同步还是异步都可以用async关键字来进行标识，因为用async标识只是显示表明在该方法内可能会用到await关键字使其变为异步方法，而且将该异步方法进行了明确的划分，只有用了await关键字时才是异步操作，其余一并为同步操作。

用async标识方法并不会影响方法运行完成是否是同步或者异步，相反，它能够将方法划分成多块，有可能有些在异步中运行，以至于这些方法是异步完成的，而划分异步和同步方法的边界就是使用await关键字。也就是说如果在方法中未用到await关键字时则该方法就是一整块没有所谓的划分，会在同步中运行，在同步中完成。


## 示例
await包含等待的意思，不过他的等待是挂起，而不是阻塞，在等待的时候，cpu可以去做其他事情。
```csharp
var result = await Task.Run(async () =>
{
    await Task.Delay(3000);
    return "success";
});
Console.WriteLine(result);

//作用相当于

var task = Task.Run(async () =>
{
    await Task.Delay(3000);
    return "success";
});
var awaiter = task.GetAwaiter();
awaiter.OnCompleted(() =>
{
    var value = awaiter.GetResult();
    Console.WriteLine(value);
});
```
异步动作时在状态机中完成，当执行到这里时，编译器会自动生成代码来检测该动作是否已经完成，如果已经完成则继续同步执行await关键字后面的代码，通过判断其状态机状态若未完成则会挂起一个继续的委托为await关键字的对象直到完成为止，调用这个继续动作的委托重新进入未完成的这样一个方法。

## 工作机制
微软提出Task线程包装类、 await/async语法糖简化了异步编程的方式：

- 遇到await表达式，执行(正常情况下)返回给调用者
   - 就像iterator里面的yield return
   - 在返回前，运行时会附件一个continuation到await的task
      - 为保证task结束时候，执行会跳转会原始方法，从停止的地址继续执行。
   - 如果发生故障，那么异常会被重新抛出
   - 如果一切正常，那么它的返回值就会被赋值给await表达式

![](/common/1622078328301-f0e28dc1-9dbe-4359-b144-d00269bf0b4c.webp)
第②步：调用异步方法GetStringAsync时，开启异步任务；
第⑥步：遇到await关键字，框架会捕获调用线程的同步上下文(`SynchronizationContext`)对象, 附加给异步任务；同时控制权上交到上层调用函数；
第⑦步：异步任务完成，通过IO完成端口通知上层线程， 第⑧步：通过捕获的线程同步上下文执行后继代码块；
> 引用：[https://mp.weixin.qq.com/s/eefBRr2wVOb8jC-elIVJvA](https://mp.weixin.qq.com/s/eefBRr2wVOb8jC-elIVJvA)

.NET 6.0 中的 await 原理浅析 https://www.cnblogs.com/broadm/p/17833442.html


## await之后的执行线程

- 在await表达式之后，编译器依赖continuation(通过awaiter模式)来继续执行
- 如果在富客户端应用的UI线程上，同步上下文会保证后续是在原始线程上执行
- 否则，就会在task结束的线程上继续执行
```csharp
Console.WriteLine(Thread.CurrentThread.ManagedThreadId);
await File.WriteAllTextAsync(@"D:\docs\1.txt", "Hello World!");
Console.WriteLine(Thread.CurrentThread.ManagedThreadId);
await File.ReadAllTextAsync(@"D:\docs\1.txt");
Console.WriteLine(Thread.CurrentThread.ManagedThreadId);

输出结果：
1
9
6
```
> 总结：在遇到await等待的时候，当前线程归还线程池，等异步方法执行结束的时候，再次从
> 线程池取一个出来执行后续的代码，这个新取出来的线程可能是刚才归还的线程。如果异步方法耗时比较短，这个后续的线程还是当前线程(因为到等待的时候发现已经执行结束了，那么就没必要再切换线程了，后续还在当前线程上执行)。


## async/await语法糖的底层原理
async/await只是编辑器提供的语法糖，它不是一种新的异步模型，只是一种简化异步代码编写的方式。从反编译的代码后来看，对于async/await的方法编译器会新生成一个实现了IAsyncStateMachine接口的状态机类。

- IAsyncStateMachine接口定义：
```csharp
public interface IAsyncStateMachine
{
    void MoveNext();
    void SetStateMachine(IAsyncStateMachine stateMachine);
}
```

- AsyncStateMachine实现类的基本执行步骤
   - 初始化一个异步状态机machine
   - 初始化一个asyncTaskMethodBuilder的实例，赋予machine.Builder
   - 设置异步状态机的状态为-1，将类接入状态机的内部
   - 调用machine.builder的Start方法
   - 返回machine.builder.Task

![a8e969df08f79ea9253a0a051c8264b0.png](/common/1677077797920-bedf58c6-47f4-4219-b3bf-0f7c4d458cdf.png)

## 有些异步方法没有async和await
对于async方法，编译器会把代码根据await调用分成若干片段，然后对不同的片段采用状态机的方式切换执行，不过有些时候这个语法糖反而是一个负担

方法举例
```csharp
async Task Main()
{
	await System.IO.File.WriteAllTextAsync("d:/aa.txt","aaaa");
	await System.IO.File.WriteAllTextAsync("d:/bb.txt","aaaa");
	await System.IO.File.WriteAllTextAsync("d:/cc.txt","aaaa");
}
```
生成的实际代码是
```csharp
<Main>d__4 stateMachine = new <Main>d__4 ();
stateMachine.<>t__builder = AsyncTaskMethodBuilder.Create ();
stateMachine.<>4__this = this;
stateMachine.<>1__state = -1;
stateMachine.<>t__builder.Start (ref stateMachine);
return stateMachine.<>t__builder.Task;
```
生成的`<Main>`d__4类内容为
```csharp
int num = <>1__state;
try
{
	TaskAwaiter awaiter3;
	TaskAwaiter awaiter2;
	TaskAwaiter awaiter;
	switch (num)
	{
		 default:
			  awaiter3 = File.WriteAllTextAsync ("d:/aa.txt", "aaaa").GetAwaiter ();
			  if (!awaiter3.IsCompleted)
			  {
				   num = (<>1__state = 0);
				   <>u__1 = awaiter3;
				   <Main>d__4 stateMachine = this;
				   <>t__builder.AwaitUnsafeOnCompleted (ref awaiter3, ref stateMachine);
				   return;
			  }
			  goto IL_0092;
		 case 0:
			  awaiter3 = <>u__1;
			  <>u__1 = default(TaskAwaiter);
			  num = (<>1__state = -1);
			  goto IL_0092;
		 case 1:
			  awaiter2 = <>u__1;
			  <>u__1 = default(TaskAwaiter);
			  num = (<>1__state = -1);
			  goto IL_0107;
		 case 2:
			  {
				   awaiter = <>u__1;
				   <>u__1 = default(TaskAwaiter);
				   num = (<>1__state = -1);
				   break;
			  }
			  IL_0107:
			  awaiter2.GetResult ();
			  awaiter = File.WriteAllTextAsync ("d:/cc.txt", "aaaa").GetAwaiter ();
			  if (!awaiter.IsCompleted)
			  {
				   num = (<>1__state = 2);
				   <>u__1 = awaiter;
				   <Main>d__4 stateMachine = this;
				   <>t__builder.AwaitUnsafeOnCompleted (ref awaiter, ref stateMachine);
				   return;
			  }
			  break;
			  IL_0092:
			  awaiter3.GetResult ();
			  awaiter2 = File.WriteAllTextAsync ("d:/bb.txt", "aaaa").GetAwaiter ();
			  if (!awaiter2.IsCompleted)
			  {
				   num = (<>1__state = 1);
				   <>u__1 = awaiter2;
				   <Main>d__4 stateMachine = this;
				   <>t__builder.AwaitUnsafeOnCompleted (ref awaiter2, ref stateMachine);
				   return;
			  }
			  goto IL_0107;
	}
	awaiter.GetResult ();
}
catch (Exception exception)
{
	<>1__state = -2;
	<>t__builder.SetException (exception);
	return;
}
<>1__state = -2;
<>t__builder.SetResult ();
```
当有些方法只是简单的调用一个异步方法，那么就可以去掉async和await关键字。因为你方法加了async，他会把这点编译成一个类，然后涉及类的实例化等操作，所以有些方法我们可以这么写
```csharp
public class TestService
{
    public async Task Main() => await NantokaAsync();

    public ValueTask NantokaAsync()
    {
        // 异步写入文件
        var message = "Hello!";

        // 这里不加await并且返回不加async
        return WriteAsync(message);
    }

    public async ValueTask WriteAsync(string message)
    {
        await Task.Delay(100);
        Console.WriteLine($"WriteAsync: {message}");
    }
}

```
但是有些情况await和async又是不可以省略的，会存在一些陷阱，比如下面不加await就可能会导致异常
```csharp
public class TestService
{
    public static async Task Main() => await NantokaAsync();

    public static ValueTask NantokaAsync()
    {
        var message = "Hello Konnichiwa!";

        using (var conn = new NanikaConnection())
        {
            // 如果这里不加await，会导致错误，因为作用域问题，释放了不应该释放的NanikaConnection
            return WriteAsync(conn, message);
        }
    }

    public static async ValueTask WriteAsync(NanikaConnection conn, string message)
    {
        await Task.Delay(100);
        await conn.WriteAsync(message);
    }

    public class NanikaConnection : IDisposable
    {
        private bool _disposed;
        public async Task WriteAsync(string message)
        {
            if (_disposed) throw new ObjectDisposedException(nameof(NanikaConnection));
            Console.WriteLine($"NanikaConnection.WriteAsync: {message}");
        }

        public void Dispose()
        {
            Console.WriteLine("NanikaConnection.Dispose");
            _disposed = true;
        }
    }
}
```

还可能存在其他问题，比如

- 当你没有await，然后调用方那边发现错误的时候，堆栈跟踪中会缺少调用的堆栈
- 还会引起AsyncLocal泄露

资料：[https://zenn.dev/mayuki/articles/96a17916096714](https://zenn.dev/mayuki/articles/96a17916096714)

## 编写异步函数

- 对于任何异步函数，你可以使用Task替代void作为返回类型，让该方法称为更有效的异步(可以进行await)
- 并不需要在方法的返回体中显式返回Task。编译器会生成一个Task(当方法完成或者发生异常时候)，这使得创建异步的调用链非常方便。
```csharp
static async Task<string> Go()
{
    await Task.Delay(3000);
    return "success";
}
```

- 编译器会对返回Task的异步函数进行扩展，使其成为当发送信息或者发生故障时使用TaskCompletionSource来创建Task的代码。

**.NET 4.5开始提供的async/await，本质是.NET 4.0的Task + 状态机**
**.NET 4.0开始提供的Task，本质是.NET 3.5提供的Thread+ThreadPool+等待/取消等API操作**

## Tap模式演化

看不懂await，async执行流，其实看不懂太正常了，因为你没用过ContinueWith就不知道await,async有多重要，下面我举两个案例佐证一下？

摘抄自：微信公众号【一线码农】
[https://mp.weixin.qq.com/s/ZGMC-g3FM6oXsmHJzsorCQ](https://mp.weixin.qq.com/s/ZGMC-g3FM6oXsmHJzsorCQ) | async,await执行流看不懂？看完这篇以后再也不会了

### 嵌套下的异步

写了这么多年的程序，相信大家都知道连接数据库少不了这几个对象，DbConnection，DbCommand，DbDataReader等等。。先来看看ContinueWith在连接数据库时嵌套过深的尴尬。

#### 1. NetFramework 4.0之前的写法

这个时期的代码没有什么好说的，都是程式代码，一撸到底，简洁明了。

```csharp
public static int SyncGetCount()
{
	using (var connection = new MySqlConnection("server=xxx.xxx.xxx.xxx;userid=xxx;password=xxx;database=xxx;charset=utf8;port=3306;"))
	{
		connection.Open();
		using (var command = connection.CreateCommand())
		{
			command.CommandText = "select count(1) from messages";

			var count = command.ExecuteScalar();

			Console.WriteLine($"记录条数:{count}");

			return Convert.ToInt32(count);
		}
	}
}

--------output------------ -

记录条数:75896
```

#### 2. NetFramework 4.0下ContinueWith的写法

当年异步和并发编程概念特别火，这个时期的C#率先使用新的Task一网兜，在数据库操作的几大类中开始有了Async结尾的方法，如OpenAsync,ExecuteScalarAsync,ReadAsync 等等,但遗憾的是那时写异步，只能像下面这样写。

```csharp
public static Task<object> ContinueWithGetCount()
{
	var connection = new MySqlConnection("server=xxx.xxx.xxx.xxx;userid=xxx;password=xxx;database=xxx;charset=utf8;port=3306;");

	var task = connection.OpenAsync().ContinueWith(t1 =>
	 {
		 var command = connection.CreateCommand();

		 command.CommandText = "select count(1) from messages";

		 return command.ExecuteScalarAsync().ContinueWith(t2 =>
		 {
			 command.Dispose();
			 connection.Dispose();

			 Console.WriteLine($"记录条数:{t2.Result}");

			 return t2.Result;
		 });
	 }).Unwrap();


	return task;
}

--------output------------ -

记录条数:75896
```

相比同步代码，这异步代码写的是不是很憋屈，为了应对渐进式的Async方法，我不得不进行ContinueWith的深层嵌套，如果Async更多，那对可读性将是毁灭性的打击，这就是所谓的回调地狱。

#### 3. NetFramework 4.5 下 await,async的写法

写到这里让我想起了邢老大的那本自传书《左手梦想，右手疗伤》，这苦这心酸只有真正经历过的人才会懂，没有人能够随随便便成功，接下来大家的期望就是如何做到有同步式的代码又有异步功效，鱼和熊掌我都要，当然是可以的，看看如何用await,async进行改造。

```csharp
public static async Task<int> AsyncGetCount()
{
	using (var connection = new MySqlConnection("server=xxx.xxx.xxx.xxx;userid=xxx;password=xxx;database=xxx;charset=utf8;port=3306;"))
	{
		await connection.OpenAsync();
		using (var command = connection.CreateCommand())
		{
			command.CommandText = "select count(1) from messages";

			var count = await command.ExecuteScalarAsync();

			Console.WriteLine($"记录条数:{count}");

			return Convert.ToInt32(count);
		}
	}
}

--------output------------ -

记录条数:75896
```

 上面这代码太简洁了，眼花的朋友还以为是同步代码呢？改造的地方也仅仅是方法签名处加上一个async，异步方法前加上await，相当于痛苦版的ContinueWith。

### 循环下的异步

上一个案例只是使用ExecuteScalarAsync从数据库中读取一个值来得到表中的记录数，在业务开发中更多的是使用ExecuteReader从数据库中获取批量记录，这个就涉及到了如何在循环中使用异步，想想就太苦难了(┬＿┬)。

#### 1. NetFramework 4.0之前的写法

这里我从messages表中读取5条记录，然后输出到控制台，详细代码如下：

```csharp
public static List<string> SyncGetMessageList()
{
	var messageList = new List<string>();
	using (var connection = new MySqlConnection("server=xxx.xxx.xxx.xxx;userid=xxx;password=xxx;database=xxx;charset=utf8;port=3306;"))
	{
		connection.Open();
		using (var command = connection.CreateCommand())
		{
			command.CommandText = "select message from messages limit 5;";
			using (var reader = command.ExecuteReader())
			{
				while (reader.Read())
				{
					messageList.Add(reader.GetString("message"));
				}
			}
		}
	}
	messageList.ForEach(Console.WriteLine);
	return messageList;
}
```

#### 2. NetFramework 4.0下ContinueWith的写法

要想用ContinueWith完成这功能，最简单有效的办法就是使用递归，用递归的方式把若干个ContinueWith串联起来，而要用递归的话还要单独定义一个方法，写的有点乱，大家将就着看吧。

```csharp
public class Program
{
	public static void Main(string[] args)
	{
		var task = ContinueWithAsyncGetMessageList();

		task.Result.ForEach(Console.WriteLine);

		Console.Read();
	}

	public static Task<List<string>> ContinueWithAsyncGetMessageList()
	{
		var connection = new MySqlConnection("server=xxx.xxx.xxx.xxx;userid=xxx;password=xxx;database=xxx;charset=utf8;port=3306;");

		var task = connection.OpenAsync().ContinueWith(t1 =>
		 {
			 var messageList = new List<string>();

			 var command = connection.CreateCommand();

			 command.CommandText = "select message from messages limit 5;";

			 return command.ExecuteReaderAsync().ContinueWith(t2 =>
			 {
				 var reader = (MySqlDataReader)t2.Result;
				 return GetMessageList(reader, messageList).ContinueWith(t3 =>
				 {
					 reader.Dispose();
					 command.Dispose();
					 connection.Dispose();
				 });
			 }).Unwrap().ContinueWith(t3 => messageList);

		 }).Unwrap();

		return task;
	}

	/// <summary>
	/// 采用递归处理循环
	/// </summary>
	/// <param name="reader"></param>
	/// <param name="messageList"></param>
	/// <returns></returns>
	public static Task<List<string>> GetMessageList(MySqlDataReader reader, List<string> messageList)
	{
		var task = reader.ReadAsync().ContinueWith(t =>
		  {
			  if (t.Result)
			  {
				  var massage = reader.GetString("message");
				  messageList.Add(massage);
				  return GetMessageList(reader, messageList);
			  }
			  else
			  {
				  return Task.FromResult(new List<string>());
			  }
		  }).Unwrap();

		return task;
	}
}
```

在递归下探的过程中把messageList集合给填满了，而后将messageList返回给调用端即可，如果没看明白，我画一张图吧！
![](/common/1697290664180-01986408-3ef6-43d9-a68d-50e4d683bb8e.png)

#### 3. NetFramework 4.5 下 await,async的写法

刚刚是不是噩梦般经历，救世主来啦，还是要鱼和熊掌一起兼得。

```csharp
public static async Task<List<string>> AsyncGetMessageList()
{
	var messageList = new List<string>();
	using (var connection = new MySqlConnection("server=xxx.xxx.xxx.xxx;userid=xxx;password=xxx;database=xxx;charset=utf8;port=3306;"))
	{
		await connection.OpenAsync();
		using (var command = connection.CreateCommand())
		{
			command.CommandText = "select message from messages limit 5;";
			using (var reader = await command.ExecuteReaderAsync())
			{
				while (await reader.ReadAsync())
				{
					messageList.Add(reader["message"].ToString());
				}
			}
		}
	}
	return messageList;
}
```

天底下还有如此简洁的代码就可以实现ContinueWith那种垃圾般代码所实现的功能，我都想仰天长啸，我太难了。

## 优化同步完成

- 异步函数可以在await之前就返回
```csharp
var result = Go(11);
Console.WriteLine(result);

static async Task<string> Go(int id)
{
    var name = _cache.GetValue(id);
    if(name != null)
        return name;
    return await _userInfo.GetName(id);
}
```

- 如果URI在缓存中存在，那么就不会有await发生，执行者就会返回给调用者，方法会返回一个已经设置信号的Task，这就是同步完成。
- 当await同步完成Task时候，执行不会返回到调用者，也不会通过Continuation调回。它会立即执行到下个语句。
   - 编译器是通过检查awaiter上的IsCompleted属性来实现这个优化的，当你await的时候执行完成awaiter.IsCompleted为true，否则直接输出

### 使用Result方法死锁

- 慎用Result
   - 场景1：带有同步上下文的编程模型中可能会出现死锁
      - 例如：winform、wpf
   - 场景2：同步+异步场景中也可能会出现死锁
      - result=》同步等待，其实已经违背了异步编程的初心。
      - 同步+异步混用会异常复杂，产生的bug不易被发现
      - 比如在winform下，同步调用异步方法(task.GetResult())时候，async的callback进入了Quene，而主线程需要不断读取Quene的内容来执行，就容易造成死锁
      - 为啥会出现死锁
         - 主线程要结束阻塞，必须要等待延续Task执行完毕
         - 延续Task要执行完毕，必须要主线程从Quene中调取执行
- 解决方案
   - 不使用同步上下文，比如WindowsFormSynchronizationContext，在自己的IO线程中完成，就没有所谓的Quene了
```csharp
var content = await client
  .GetStringAsync("http://cnblogs.com")
  .ConfigureAwait(false);
```

   - 不阻塞主线程
      - 适用我们熟知的async+await
   - 使用线程池完成

用线程池中的thread执行（比如：Task.Run），不用 main thread
```csharp

private void button1_Click(object sender, EventArgs e)
{
   var task = Task.Run(() =>
   {
       var content = GetContent().Result;

       return content;
   });

   textBox1.Text = task.Result;
}
```

## ConfigureAwait
ConfigureAwait方法仅仅是一个返回结构体(ConfiguredTaskAwaitable)的方法，该结构体包装调用它的原始任务以及调用者指定的布尔值。
当使用async/await得时候，默认情况下得到结果后它需要在开始请求的原始线程上继续运行，如果当另一个长时间运行得进程已经接管了该线程，那么你就不得不等待它完成。要避免这个问题，可以使用ConfigureAwait的方法和false参数，当你使用该方法时候，可以告诉Task它可以在任何可用的线程上恢复自己继续运行，而不是等待最初创建它的线程，这可以加快响应速度并且避免死锁。
> AspNetSynchronizationContext维护了HttpContext.Current、用户身份和文化，但在ASP. NET Core这些信息天然依赖注入，故不再需要SynchronizationContext；另一个好处是不再获取同步上下文对性能也是一种提升。因此，对于ASP.NET Core程序，ConfigureAwait(false)不是必需的，然而，在基础库时最好还是使用ConfigureAwait(false)，因为你保不准上层会混用同步/异步代码。


- ConfigureAwait(bool)：true(默认处理方式)  表示尝试在捕获的原调用线程SynchronizationContext 中执行后继代码；
- ConfigureAwait(bool)：false 不再尝试在捕获原调用线程SynchronizationContext中执行后继代码。 ConfigureAwait(false)  能解决`因调用线程同步阻塞`引发的死锁，但是同步阻塞没有利用异步编程的优点。
   - 不用再等在原始上下文或调度程序中进行回调。
   - 避免死锁。假如有一个方法，使用await等待网络下载结果，你需要通过同步阻塞的方式调用该方法等待其完成，比如使用.Wait()、.Result或.GetAwaiter().GetResult()。思考一下，如果限制当前SynchronizationContext并发数为1，会发生什么情况？方式不限，无论是显式地通过类似于前面所说的MaxConcurrencySynchronizationContext的方式，还是隐式地通过仅具有一个可以使用的线程的上下文来实现，例如UI线程，你都可以在那个线程上调用该方法并阻塞它等待操作完成，该操作将开启网络下载并等待。在默认情况下， 等待Task会捕获当前SynchronizationContext，所以，当网络下载完成时，它会将回调排队返回到SynchronizationContext中执行剩下的操作。但是，当前唯一可以处理排队回调的线程却还被你阻塞着等待操作完成，不幸的是，在回调处理完毕之前，该操作永远不会完成。完蛋，死锁了！

### 缺点
当在另一个线程上继续时候，线程同步上下文将丢失，然后会失去归属于线程的Culture和Language，其中包含了国家语言时区信息，以及来自原始线程的HttpContext Current之类的信息，因此当不需要这些信息的时候，可以使用CongifureAwait该方法的调用。
> 注意：如果需要language/culture，可以始终在await之前存储当前相关状态值，然后在await新线程之后重新应用它。


### 防止卡死的场景
在使用async/await关键字时，应该尽可能使用ConfigureAwait(false)方法，这个方法可以让异步操作不必恢复到原始的SynchronizationContext上，从而减少线程切换的开销和提高性能。某些情况下，如果在异步操作完成后需要返回到原始的SynchronizationContext上，使用ConfigureAwait(false)会导致调用者无法正确处理结果。因此，建议仅在确定不需要返回到原始的SynchronizationContext上时才使用ConfigureAwait(false)方法。

示例代码：假设我们有一个控制台应用程序，其中有两个异步方法：MethodAAsync()和MethodBAsync()。MethodAAsync()会等待1秒钟，然后返回一个字符串。MethodBAsync()会等待2秒钟，然后返回一个字符串。代码如下所示：
```csharp
async Task<string> MethodAAsync()
{
    await Task.Delay(1000);
    return $"{DateTime.Now:ss.fff}>Hello";
}

async Task<string> MethodBAsync()
{
    await Task.Delay(2000);
    return $"{DateTime.Now:ss.fff}>World";
}
```
现在，我们想要同时调用这两个方法，并将它们的结果合并成一个字符串。我们可以像下面这样编写代码：
```csharp
async Task<string> CombineResultsAAsync()
{
    var resultA = await MethodAAsync();
    var resultB = await MethodBAsync();
    return $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}: {resultA} | {resultB}";
}
```
这个代码看起来非常简单明了，但是它存在一个性能问题。当我们调用CombineResultsAAsync()方法时，第一个await操作将使执行上下文切换回原始SynchronizationContext（即主线程），因此我们的异步操作将在UI线程上运行。由于我们要等待1秒钟才能从MethodAAsync()中返回结果，因此UI线程将被阻塞，直到异步操作完成并且结果可用为止。
这种情况下，我们可以使用ConfigureAwait(false)方法来指定不需要保留当前上下文的线程执行状态，从而让异步操作在一个线程池线程上运行。这可以通过下面的代码实现：
```csharp
async Task<string> CombineResultsBAsync()
{
    var resultA = await MethodAAsync().ConfigureAwait(false);
    var resultB = await MethodBAsync().ConfigureAwait(false);
    return $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}: {resultA} | {resultB}";
}
```
通过使用ConfigureAwait(false)方法，我们告诉异步操作不需要保留当前上下文的线程执行状态，这样异步操作就会在一个线程池线程上运行，而不是在UI线程上运行。这样做可以避免一些潜在的性能问题，因为我们的UI线程不会被阻塞，并且异步操作可以在一个新的线程池线程上运行。

### 注意事项

#### 同步方法调用异步方法
如果要使用async/await，需要注意一些事情。您可能遇到的最大问题是处理异步方法请求同步方法。如果你开发一个新项目，通常可以将async/await从上到下贯穿于整个方法链中，而不需要做太多工作。但是，如果你在外层是同步的，并且必须调用异步库，那么就会出现一些有隐患的操作。如果一不小心，便会引发大批量的死锁。

如果有同步方法调用异步方法,则必须使用ConfigureAwait(false)。如果不这样做，就会立即掉进死锁陷阱。发生的情况是主线程将调用async方法，最终会阻塞这个线程，直到那个async方法完成。然而，一旦异步方法完成，它必须等待原始调用者完成后才能继续。他们都在等待对方完成，而且永远不会。通过在调用中使用configurewait (false)， async方法将能够在另一个线程上完成自己操作，而不关心自己的状态机的位置，并通知原始线程它已经完成。进行这个调用的最佳实践如下:
```csharp
 [HttpPut]
 public IActionResult Put([FromBody]UpdateCommand command) =>
     _responseMediator.ExecuteAsync(command).ConfigureAwait(false).GetAwaiter().GetResult();
```

#### .NET Standard与ConfigureAwait(false)
在.NETCore中，微软删除了导致我们在任何地方都需要ConfigureAwait(false)的SynchronizationContext。因此，ASP.NETCore应用程序在技术上不需要任何ConfigureAwait(false)逻辑，因为它是多余的。但是，如果在开发有一个使用.NETStandard的库，那么强烈建议仍然使用.ConfigureAwait(false)。在.NETCore中，这自动是无效的。但是如果有.NETFramework的人最终使用这个库并同步调用它，那么它们将会遇到一堆麻烦。但是随着.NET5是由.NETCore构建的，所以未来大多都是.NetCore调用.Netstandard，你如果不准备让.NetFramework调用你的standard库，大可不必兼容。

#### ConfigureAwait(false) 贯穿始终
如果同步调用有可能调用您的异步方法，那么在整个调用堆栈的每个异步调用上，您都将被迫设置. configureAwait (false) 如果不这样做，就会导致另一个死锁。这里的问题是，每个async/ await对于调用它的当前方法都是本地的。因此，调用链的每个异async/await都可能最终在不同的线程上恢复。如果一个同步调用一路向下，遇到一个没有configurewait(false)的任务，那么这个任务将尝试等待顶部的原始线程完成，然后才能继续。虽然这最终会让你感到心累，因为要检查所有调用是否设置此属性。

#### 开销
虽然async/ await可以极大地增加应用程序一次处理的请求数量，但是使用它是有代价的。每个async/ await调用最终都将创建一个小状态机来跟踪所有信息。虽然这个开销很小，但是如果滥用async/ await，则会导致速度变慢。只有当线程不得不等待结果时，才应该等待它。

#### Async Void
虽然几乎所有的async / await方法都应返回某种类型的Task，但此规则有一个例外：有时，您可以使用async void。但是，当您使用它时，调用者实际上不会等待该任务完成后才能恢复自己。它实际上是一种即发即忘的东西。有两种情况你想要使用它。 
   第一种情况是事件处理程序，如WPF或WinForms中的按钮单击。默认情况下，事件处理程序的定义必须为void。如果你把一个任务放在那里，程序将无法编译，并且返回某些东西的事件会感觉很奇怪。如果该按钮调用异步async，则必须执行async void才能使其正常工作。幸运的是，这是我们想要的，因为这种使用不会阻塞UI。 
 第二个是请求你不介意等待获得结果的东西。最常见的示例是发送日志邮件，但不想等待它完成或者不关心它是否完成。 
然而，对于这两种情况，都有一些缺点。首先，调用方法不能try/catch调用中的任何异常。它最终将进入AppDomain UnhandledException事件。不过，如果在实际的async void方法中放入一个try catch，就可以有效地防止这种情况发生。另一个问题是调用者永远不会知道它何时结束，因为它不返回任何东西。因此，如果你关心什么时候完成某个Task，那么实际上需要返回一个Task。

## 参考文档

微软异步编程概述：[https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/async/](https://docs.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/async/)
理解c#中的configureAwait：[https://mp.weixin.qq.com/s/CvpesplSFOcR2I_x5qkJSw](https://mp.weixin.qq.com/s/CvpesplSFOcR2I_x5qkJSw) / [https://www.cnblogs.com/xiaoxiaotank/p/13529413.html](https://www.cnblogs.com/xiaoxiaotank/p/13529413.html)
研究c#异步操作async await状态机的总结：[https://mp.weixin.qq.com/s/t5CTzpnJ7fakUSgRqvGE6w](https://mp.weixin.qq.com/s/t5CTzpnJ7fakUSgRqvGE6w)
async/await 到底是如何工作的：[https://mp.weixin.qq.com/s/OPnWHs1aArkBHZ8QALhV1g](https://mp.weixin.qq.com/s/OPnWHs1aArkBHZ8QALhV1g)
Async/Await在 C#语言中是如何工作的：[https://devblogs.microsoft.com/dotnet-ch/async-await%e5%9c%a8-c%e8%af%ad%e8%a8%80%e4%b8%ad%e6%98%af%e5%a6%82%e4%bd%95%e5%b7%a5%e4%bd%9c%e7%9a%84/](https://devblogs.microsoft.com/dotnet-ch/async-await%e5%9c%a8-c%e8%af%ad%e8%a8%80%e4%b8%ad%e6%98%af%e5%a6%82%e4%bd%95%e5%b7%a5%e4%bd%9c%e7%9a%84/)
