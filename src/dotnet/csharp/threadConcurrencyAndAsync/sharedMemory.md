---
title: 共享内存&Actor
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: gongxiangneicun&actor
slug: mqom4v
docsId: '72282804'
---

## 共享内存
面向对象编程中，万物都是对象，数据+行为=对象；
多核时代，可并行多个线程，但是受限于资源对象，线程之间存在对共享内存的抢占/等待，实质是多线程调用对象的行为方法，这涉及线程安全线程同步。
假如现在有一个任务，找100000以内的素数的个数，如果用共享内存的方法，代码如下：

可以看到，这些线程共享了sum变量，对sum做sum++操作时必须上锁。
```csharp
using System;
using System.Threading.Tasks;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Diagnostics;

namespace Paralleler
{
    class Program
    {
        static object syncObj = new object();
        static void Main(string[] args)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            ShareMemory();
            sw.Stop();
            Console.WriteLine($"共享内存并发模型耗时：{sw.Elapsed}");
        }

        static void ShareMemory()
        {
            var sum = 0;
            Parallel.For(1, 100000 + 1,(x, state) =>
            {
                var f = true;
                if (x == 1)
                    f = false;
                for (int i = 2; i <= x / 2; i++)
                {
                    if (x % i == 0)  // 被[2,x/2]任一数字整除，就不是质数
                        f = false;
                }
                if(f== true)
                {
                    lock(syncObj)
                    {
                        sum++;   // 共享了sum对象，“++”就是调用sum对象的成员方法
                    }
                }
            });
            Console.WriteLine($"1-100000内质数的个数是{sum}");
        }
    }
}
```
> 共享内存更贴合"面向对象开发者的固定思维"， 强调线程对于资源的掌控力。


## Actor模型
Actor模型则认为一切皆是Actor，share nothing， Actor模型内部的状态由自己的行为维护，外部线程不能直接调对象的行为，必须通过消息才能激发行为，也就是消息传递机制来代替共享内存模型对成员方法的调用， 这样保证Actor内部数据只能被自己修改，
Actor模型= 数据+行为+消息。
![](/common/1649149006943-dcfb7793-63b0-45b2-a7db-c386bd97d7f2.png)
还是找到100000内的素数，我们使用.NET TPL Dataflow来完成，代码如下：
每个Actor的产出物就是流转到下一个Actor的消息。
```csharp
using System;
using System.Threading.Tasks;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks.Dataflow;
using System.Diagnostics;

namespace Paralleler
{
    class Program
    {
        static void Main(string[] args)
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            Actor();
            sw.Stop();
            Console.WriteLine($"Actor并发模型耗时：{sw.Elapsed}");  
        }

        static void Actor()
        {
            var linkOptions = new DataflowLinkOptions { PropagateCompletion = true };
            var transfromBlock = new TransformBlock<int,bool>(x=> 
            {
                var f = true;
                if (x == 1)
                    f = false;
                for (int i = 2; i <= x / 2; i++)
                {
                    if (x % i == 0)  // 被[2,x/2]任一数字整除，就不是质数
                        f = false;
                }
                return f;
            }, new ExecutionDataflowBlockOptions { MaxDegreeOfParallelism =50 });
           
            var sum = 0;
            var actionBlock = new ActionBlock<bool>(x=>
            {
                if (x == true)
                    sum++;
            },new ExecutionDataflowBlockOptions { MaxDegreeOfParallelism = 1   });//这里必须使用默认并发度
            transfromBlock.LinkTo(actionBlock, linkOptions);
            // 准备从pipeline头部开始投递
            for (int i = 1; i <= 100000; i++)
            {
                transfromBlock.Post(i);
            }
            transfromBlock.Complete();  // 通知头部，不再投递了; 会将信息传递到下游。
            actionBlock.Completion.Wait();  // 等待尾部执行完成
            Console.WriteLine($"1-100000内质数的个数是{sum}");
        }
    }
}
```
> Actor并发模型强调的是消息触发。


## 总结
**共享内存模型**：其实是并行线程调用对象的成员方法，这里不可避免存在加锁/解锁， 需要开发者自行关注线程同步、线程安全。
**Actor模型**：以流水线管道的形式，各Actor独立挨个处理各自专属业务，等待消息流入。

## 资料
[https://mp.weixin.qq.com/s/QK_C0wmW2RAXcZvB1k6DYA](https://mp.weixin.qq.com/s/QK_C0wmW2RAXcZvB1k6DYA) | 三分钟掌握共享内存 & Actor并发模型
