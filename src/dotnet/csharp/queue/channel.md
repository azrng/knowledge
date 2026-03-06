---
title: Channel
lang: zh-CN
date: 2023-10-29
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - channel
---

## 概述
Channel是在.Net Core 3.0后推出的一个新的集合类型，具备异步API、高性能、线程安全的队列，支持在生产者和消费者之间传递数据。

Channel只是一种数据结构，用于存储生成的数据让消费者消费，还可以在拥有多个消费者。

利用Channel，通过发布和订阅，可以将生产者和消费者分开。生产者Producer负责接收请求，并写入Channel，而消费者Consumer为每个进入Channel的数据执行处理。这样做，一方面可以使生产者和消费者并行工作来提高性能，另一方面，可以通过创建更多的生产者或消费者来提高应用的吞吐量。

## 使用场景
用来做消息队列，进行数据的生产和消费, 公开的 Writer 和 Reader api对应消息的生产者和消费者，也让Channel更加的简洁和易用，与Rabbit MQ 等其他队列不同的是，Channel 是进程内的队列

## 操作

### 创建Channel
Channel提供了一个静态Channel类，提供了两个公开方法来创建两种类型的Channel。
```csharp
// 创建有限容量的channel 
var channel = Channel.CreateBounded<string>(100);

// 创建无限容量的channel 
var channel = Channel.CreateUnbounded<string>();
```
* 有限容量的Channel，容量是有上限的，到达上限后，可以让生产者非阻塞等待消费者使用并释放Channel容量后再继续。这种方式，好处是可以控制生产的速度，控制系统资源的使用，缺点也是。因为控制速度意味着生产速度会被限制，甚至停止。
* 无限容量，生产者可以全速进行生产。但也有缺点，如果消费者的消费速度低于生产者，Channel的资源使用会无限增加，会有服务器资源耗尽的可能。

有限容量Channels可以指定BoundedChannelFullMode枚举来告诉channel到达容量限制后应该继续写入还是怎么操作。
```csharp
public enum BoundedChannelFullMode
{
    Wait,
    DropNewest,
    DropOldest,
    DropWrite
}
```
* 默认为Wait，等待队列中有空间时写入，因此如果容量满了写入数据会返回false，直到数据被消费后才能继续写入
* DropOldest将删除“最旧”的数据，也就是从队列头部开始移除。
* DropNewest将删除最新的数据，也就是从队列尾部开始移除。
* DropWrite删除当前正在写入的数据，也就是写入成功，但是转头就把刚才的数据丢了。

因此，您可以根据你的场景选择适合的选项。

```csharp
// 创建有限容量的channel, 并指定容量达到最大的策略
var options = new BoundedChannelOptions(10)
{
    FullMode = BoundedChannelFullMode.Wait, // 满的话等待
    SingleReader = true, // 允许一个reader
    SingleWriter = true, // 允许一个writer
};
var channel = Channel.CreateBounded<string>(options);
```

### 写入Channel
使用写入器ChannelWriter，可以对Channel进行写入操作。ChannelWriter提供了以下几个方法：

- WriteAsync - 异步写入
- WaitToWriteAsync - 非阻塞等待，直到有空间可写入时或Channel关闭时，返回true/false
- TryWrite - 尝试写入，如果写入失败会返回false
- Complete - 标记Channel为关闭，并不再写入数据到该Channel
- TryComplete - 尝试标记Channel为关闭。
```csharp
await channel.Writer.WriteAsync("New message");
```

### 读取Channel
使用阅读器ChannelReader从Channel进行数据的读取。也提供了几个方法：

- ReadAsync - 异步读取
- ReadAllAsync - 异步读取Channel中的所有数据
- TryRead - 尝试读取
- WaitToReadAsync - 非阻塞等待，直到有数据可读取或Channel关闭时，返回true/false

当你需要一些后台任务，长时间消费，那么可以使用下面的方式
```csharp
while (await ChannelReader.WaitToReadAsync())
{
    if (ChannelReader.TryRead(out var timeString))
    {
          // xxx
    }
}
```
ReadAllAsync() 方法返回的是一个 `IAsyncEnumerable<T>` 对象，也可以用 await foreach 的方式来获取数据
```csharp
await foreach(var item in channel.Reader.ReadAllAsync())
{
    Console.WriteLine(item); 
}
```

### 常用的场景
创建 Channel 时，可以设置 ChannelOptions 的 SingleWriter 和 SingleReader，来指定 Channel 时单一的生产者和消费者，默认都是 false，当设置了 SingleWriter = true 时, 会限制同一个时间只能有一个生产者可以写入数据, SingleReader = true 是同样的。另外，如果只需要一个消费者的话，你应该设置 SingleReader = true, Channel 在内部做了一些优化，在读取时避免了锁操作，性能上有些许的提升。

实现一个多个生产者生产数据，一个消费者消费数据，且在生产者生产完完毕后设置生产完成，然后消费者消费结束后停止。

```csharp
var options = new BoundedChannelOptions(1000)
{
    FullMode = BoundedChannelFullMode.Wait, // 满的话等待
    SingleReader = true, // 允许一个reader
};
var channel = Channel.CreateBounded<int>(options);

// 在这一步 方法都已经开始执行了，只是没有通过await去拿结果而已
var sender1 = SendMessageAsync(channel.Writer, 1);
var sender2 = SendMessageAsync(channel.Writer, 2);
var sender3 = SendMessageAsync(channel.Writer, 3);

// 消费者
var receiver = ReceiveMessageAsync(channel.Reader, 10);

await Task.WhenAll(sender1, sender2, sender3);

// 显示任务完成
channel.Writer.Complete();

// 等待接收消息
await receiver;

async Task SendMessageAsync(ChannelWriter<int> channelWriter, int id)
{
    for (var i = 0; i <= 20; i++)
    {
        await channelWriter.WriteAsync(i);
        Console.WriteLine($"{id}写入{i}");
    }
}

async Task ReceiveMessageAsync(ChannelReader<int> channelReader, int id)
{
    // try
    // {
    //     while (!channelReader.Completion.IsCompleted)
    //     {
    //         var item = await channelReader.ReadAsync();
    //         Console.WriteLine($"{id}读取{item}");
    //
    //         await Task.Delay(100);
    //     }
    // }
    // catch (ChannelClosedException e)
    // {
    //     // 这里错误 只是关闭的时候才会被抛出
    //     Console.WriteLine($"线程{id} channel closed。");
    // }

    await foreach (var item in channelReader.ReadAllAsync())
    {
        Console.WriteLine($"{id}读取{item}");
        await Task.Delay(100);
    }
}
```

## 实操

### 后台任务读写

写的任务
```csharp
public class WriteService : BackgroundService
{
    private readonly ChannelWriter<int> _channelWriter;

    public WriteService(ChannelWriter<int> channelWriter)
    {
        _channelWriter = channelWriter;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        int count = 0;
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
            Console.WriteLine("write data" + count);
            await _channelWriter.WriteAsync(count++, stoppingToken);
            Console.WriteLine("write data" + count);
            await _channelWriter.WriteAsync(count++, stoppingToken);
        }
    }
}
```
读的任务
```csharp
public class ReaderService : BackgroundService
{
    private readonly ChannelReader<int> _channelReader;

    public ReaderService(ChannelReader<int> channelReader)
    {
        _channelReader = channelReader;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
            try
            {
                var result = await _channelReader.ReadAsync(stoppingToken);
                Console.WriteLine("read data" + result);
            }
            catch (Exception ex)
            {
                Console.WriteLine("cannel closed" + ex.Message);
            }
        }
    }
}
```
配置队列
```csharp
//配置channel
builder.Services.AddSingleton(Channel.CreateUnbounded<int>(new UnboundedChannelOptions
{
    SingleReader = true
}));
builder.Services.AddSingleton(t => t.GetRequiredService<Channel<int>>().Writer);
builder.Services.AddSingleton(t => t.GetRequiredService<Channel<int>>().Reader);
```

### 消息队列示例

选择了使用channel来做优化。拿到设备数据之后直接把消息丢入到channel，然后后台使用定时任务或者自己实现hostservice去不断的消费数据。

生产者代码如下

```csharp
public async Task ProduceHeartBeat(string message)
{
    await channel.Writer.WriteAsync(message);
}
```

不断的向里面写入数据即可.

消费者代码如下

```csharp
/// <summary>
/// timespan时间内消费多少数据
/// </summary>
/// <param name="count"></param>
/// <param name="timeSpan"></param>
/// <returns></returns>
public async Task<List<string>> ConsumeHeartBeatAsync(int count,TimeSpan timeSpan)
{
     var result = new List<string>(count);
     CancellationTokenSource cts = new CancellationTokenSource();
     var cancellationToken = cts.Token;
     cts.CancelAfter(timeSpan);
     int rcount = 0;
     while ( !cancellationToken.IsCancellationRequested && rcount<count)
     {
         //await Task.Delay(2000);
         if (channel.Reader.TryRead(out var number))
         {
             Console.WriteLine(number);
             result.Add(number);
             rcount++;
         }
         else
         {
             break;
         } 
     }  
    return result;
}
```

里面加入了一个cancellationToken，进行消费的时长限制。在此时长内消费多少条数据，超时直接结束，这就是基本的代码。

后台定时消费数据

```csharp
public class HeartBeatService : BackgroundService
{
     private readonly HeartBeatsChannel heartBeatsChannel;

     public HeartBeatService(HeartBeatsChannel heartBeatsChannel)
     {
         this.heartBeatsChannel = heartBeatsChannel;
     }

     protected override async Task ExecuteAsync(CancellationToken stoppingToken)
     {
         try
         {

             Task.Factory.StartNew(() =>
             {
                 while (!stoppingToken.IsCancellationRequested)
                 {
                     //阻塞的队列使得一直在同一个线程运行
                     Process(15,heartBeatsChannel).Wait();
                 }

             }, TaskCreationOptions.LongRunning);

             Console.WriteLine("主线程 现在运行的线程id为：" + Thread.CurrentThread.ManagedThreadId);

             }
         catch (Exception ex)
         {
             Console.WriteLine(ex.ToString());
         }
     }
     /// <summary>
     /// 消费数据
     /// </summary>
     /// <param name="count">一次消费数量</param>
     /// <param name="heartBeatsChannel"></param>
     /// <returns></returns>
     private async Task Process(int count ,HeartBeatsChannel heartBeatsChannel)
     {
         Console.WriteLine("子线程_现在运行的线程id为：" + Thread.CurrentThread.ManagedThreadId);
         //每次消费三十个
         if (heartBeatsChannel.IsHasContent)
         {
             //int count = 15;
             //进行消费
             await heartBeatsChannel.ConsumeHeartBeatAsync(count, TimeSpan.FromSeconds(3));
         }           
         await Task.Delay(3000);
     }
}
```

使用的是BackgroundService，直接实现要处理的业务逻辑就好了。在这里使用的是TaskCreationOptions.LongRunning，新开一个线程去处理心跳数据。

## 总结

Channel 实际上还是使用ConcurrentQueue做的封装, 使用起来更方便，对异步更友好。

## 参考资料

[https://mp.weixin.qq.com/s/h12m3Znu3PUnuMKj4u3MVw](https://mp.weixin.qq.com/s/h12m3Znu3PUnuMKj4u3MVw) | .NET Core 使用 Channel 消息队列

## 资料

[https://mp.weixin.qq.com/s/8opt_fC9-9rRQMm_X3l8wQ](https://mp.weixin.qq.com/s/8opt_fC9-9rRQMm_X3l8wQ) | 如何在C#中使用Channels进行异步排队
[https://mp.weixin.qq.com/s/63-7yOqeoZzGiUhDaH1Q2w](https://mp.weixin.qq.com/s/63-7yOqeoZzGiUhDaH1Q2w) | .NET 中的高性能队列 Channel
官方介绍：[https://devblogs.microsoft.com/dotnet/an-introduction-to-system-threading-channels/](https://devblogs.microsoft.com/dotnet/an-introduction-to-system-threading-channels/)
[https://mp.weixin.qq.com/s/LKlyIg5FimqzS2xeiXW3rA](https://mp.weixin.qq.com/s/LKlyIg5FimqzS2xeiXW3rA) | 理解并掌握C#的Channel：从使用案例到源码解读（一）
