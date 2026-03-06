---
title: 命令模式
lang: zh-CN
date: 2023-07-23
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: minglingmoshi
slug: imgs3a5q3sgcs0lg
docsId: '116932009'
---

## 概述
命令模式将请求(命令)封装为一个对象，这样可以使用不同的请求参数化其他对象(将不同请求依赖注入到其他对象)，并且能够支持请求(命令)的排队执行、记录日志、撤销等(附加功能)。

主要作用和场景：控制命令的执行，比如异步、延迟、排队执行命令、撤销重做命令、存储命令、给命名记录日志等等，这就是命令模式发挥作用的地方。

## 操作
比如游戏开发中，客户端和服务端一般采用长连接的方式来进行通信，这个时候客户端给服务器的请求中，一般都包含两部分内容：指令和数据，其中，指令我们可以叫做事件，数据是执行这个指令所需要的数据。

服务器在收到客户端的请求之后，会解析出来指令和数据，并且根据指令的不同，执行不同的处理逻辑。对于这样子的一个业务场景，一般有以下的实现思路

第一种就是利用多线程，一个线程接受请求，收到请求后，启动一个新的线程来处理请求，具体来说就是一般通过一个主线程来接收客户端发来的请求，每当接收到一个请求之后，就从线程池中取一个线程来处理。

另一种就是让一个线程固定去轮询来接收请求和处理请求，他不包含线程对性能的损耗，下面使用该方案来操作

服务器轮询获取客户端发来的请求，获取到请求后，借助命令模式，把请求包含的数据和处理逻辑封装为命令对象，并存储在内存队列中，然后再从队列中取出命令来执行，具体代码如下
创建一个请求命令接口，然后包含两个逻辑的实现
```csharp
public interface IRequestCommand
{
    void Excute();
}

/// <summary>
/// 发送短信
/// </summary>
public class SendSmsCommand : IRequestCommand
{
    public void Excute()
    {
        Console.WriteLine("发送短信" + DateTime.Now);
    }
}

/// <summary>
/// 发送邮件
/// </summary>
public class SendEmailCommand : IRequestCommand
{
    public void Excute()
    {
        Console.WriteLine("发送邮件" + DateTime.Now);
    }
}
```
然后方法中包含一个线程去后台轮询处理，以及主线程收到请求后，将请求交给内存队列去处理
```csharp
public class CommandService : IService
{
    private static readonly Queue<IRequestCommand> queue = new Queue<IRequestCommand>();

    public void Main()
    {
        _ = queue.EnsureCapacity(5);

        // 后台消费请求
        HandlerReqestBackgroupService();

        // 前端生产请求
        while (true)
        {
            var requests = new List<IRequestCommand>();

            #region 伪造请求

            var random = new Random();
            for (var i = 0; i < random.Next(1, 5); i++)
            {
                if (i % 2 == 0)
                {
                    requests.Add(new SendSmsCommand());
                }
                else
                {
                    requests.Add(new SendEmailCommand());
                }
            }

            #endregion

            foreach (var request in requests)
            {
                IRequestCommand command = null;
                if (request is SendSmsCommand sendSmsCommand)
                {
                    command = sendSmsCommand;
                }
                else if (request is SendEmailCommand sendEmailCommand)
                {
                    command = sendEmailCommand;
                }

                queue.Enqueue(command);
            }

            Thread.Sleep(1000);
        }
    }

    private void HandlerReqestBackgroupService()
    {
        Task.Factory.StartNew(async () =>
        {
            while (true)
            {
                while (queue.Count != 0)
                {
                    await Console.Out.WriteLineAsync($"当前队列容量：{queue.Count}");
                    var command = queue.Dequeue();
                    command.Excute();
                    await Task.Delay(1000);
                }
            }
        });
    }
}
```
这样子就实现了，接收客户端请求，然后另外独立线程进行处理请求。

## 总结
命令模式最核心的实现手段就是将函数封装为对象。

主要目的是用来控制命令的执行。
