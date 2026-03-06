---
title: 分布式锁
lang: zh-CN
date: 2023-10-04
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fenbushisuo
slug: lor0gr
docsId: '48321000'
---

## 概述
分布式锁也可以理解为跨主机的线程同步。

| 进程内 | 跨进程 | 跨主机 |
| --- | --- | --- |
| Lock/Monitor、SemaphoreSlim | Metux、Semaphore | 分布式锁 |
| 用户态线程安全 | 内核态线程安全 | 

单机服务器可以通过共享堆内存来标记上锁/解锁，线程同步是建立在单击操作系统的用户态、内核态对共享内存的访问控制。

实现锁，需要实现的是需要锁的东西必须对这个锁都可以访问，比如内锁同一个项目，那么就可以使用lock，那么锁不同的项目，就需要这多个项目的进程都能访问到的地方，这个时候我们常用redis来实现。

## 实现分布式锁
不常用的操作：获取锁超时、锁重入、锁延期 

![图片](/common/5F4F1D78-7AE1-45BC-BB52-E0D183F12830.png)

> 该图片来自MASA技术团队公众号

### 基本要求
简述：同一时间只能一个获取到、避免死锁、防止释放错锁。
1.分布式系统，一个锁在同一时间只能被一个服务器获取（这是分布式锁的基础）
2.具备锁失效机制，防止死锁（防止某些意外，锁没有得到方式，别人也无法获取到锁）

```bash
SET 命令支持多个参数：
EX seconds-- 设置过期时间(s)
NX -- 如果key不存在，则设置 ......
因为SET命令参数可以替代SETNX，SETEX，GETSET，这些命令在未来可能被废弃。
```
当上面设置key返回成功的时候，说明已经获取到了锁，任务完成后通过del命令解锁，或者超时后自动释放锁。
3.不要使用固定的string值作为锁标记着(比如设置该redis的值和当前业务相关起来，如果删除的时候，值是该业务的值，再执行删除操作)，而是使用一个不易被猜中的随机值，比如token
4.不适用del命令释放锁，而是发送script去移除key
> 3、4是为了解决：锁提前过期，客户a还没有执行完命令，然后客户b获取锁去执行，这个时候a执行完然后删除锁的时候将锁着b的锁给删除了。


### 实现示例
```bash
/// <summary>
/// Acquires the lock.
/// </summary>
/// <param name="key"></param>
/// <param name="token">随机值</param>
/// <param name="expireSecond"></param>
 /// <param name="waitLockSeconds">非阻塞锁</param>
static bool Lock(string key, string token,int expireSecond=10, double waitLockSeconds = 0)
{
    var waitIntervalMs = 50;
    bool isLock;
            
    DateTime begin = DateTime.Now;
    do
    {
         isLock = Connection.GetDatabase().StringSet(key, token, TimeSpan.FromSeconds(expireSecond), When.NotExists);
         if (isLock)
             return true;
             //不等待锁则返回
             if (waitLockSeconds == 0) break;
             //超过等待时间，则不再等待
             if ((DateTime.Now - begin).TotalSeconds >= waitLockSeconds) break;
             Thread.Sleep(waitIntervalMs);
     } while (!isLock);
     return false;
 }
       
/// <summary>  
/// Releases the lock.  
/// </summary>  
/// <returns><c>true</c>, if lock was released, <c>false</c> otherwise.</returns>  
/// <param name="key">Key.</param>  
/// <param name="value">value</param>  
static bool UnLock(string key, string value)
{
    string lua_script = @"  
    if (redis.call('GET', KEYS[1]) == ARGV[1]) then  
         redis.call('DEL', KEYS[1])  
          return true  
          else  
          return false  
        end  
      ";
     try
     {
          var res = Connection.GetDatabase().ScriptEvaluate(lua_script,
                                                           new RedisKey[] { key },
                                                           new RedisValue[] { value });
            return (bool)res;
      }
     catch (Exception ex)
     {
          Console.WriteLine($"ReleaseLock lock fail...{ex.Message}");
          return false;
     }
}
        
        private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
        {
            ConfigurationOptions configuration = new ConfigurationOptions
            {
                AbortOnConnectFail = false,
                ConnectTimeout = 5000,
            };
            configuration.EndPoints.Add("10.100.219.9", 6379);
            return ConnectionMultiplexer.Connect(configuration.ToString());
        }); 
        public static ConnectionMultiplexer Connection => lazyConnection.Value;
```
为了避免无限制抢锁操作，增加了非阻塞锁，就是轮询n秒后如果还没有获取的锁，那么就直接返回。
```csharp
static void Main(string[] args)
{
     // 尝试并行执行3个任务
     Parallel.For(0, 3, x =>
     {
           string token = $"loki:{x}";
           bool isLocked = Lock("loki", token, 5, 10);
            
           if (isLocked)
           {
               Console.WriteLine($"{token} begin reduce stocks (with lock) at {DateTime.Now}.");
               Thread.Sleep(1000);
               Console.WriteLine($"{token} release lock {UnLock("loki", token)} at {DateTime.Now}. ");
           }
           else
           {
             Console.WriteLine($"{token} don't get lock at {DateTime.Now}.");
           }
       });
}
```

## 中意的写法
借助委托去实现，看着好看不像有些，获取锁就在第一行，获取不到不往下面走
```csharp
var result = await _lockProvider.TryLockAsync(key, async () =>
{
    await Task.Delay(1000);
    return "success";
});
```

## 组件
[https://mp.weixin.qq.com/s/LfuEj0iB0oG3fAfINPDDqA](https://mp.weixin.qq.com/s/LfuEj0iB0oG3fAfINPDDqA) | 功能强大，基于 .NET 实现的分布式锁
[https://www.cnblogs.com/Z7TS/p/17359113.html](https://www.cnblogs.com/Z7TS/p/17359113.html) | .NET开源分布式锁DistributedLock - Broder - 博客园
RedLock.net

## 参考文档
> 码甲哥：[https://mp.weixin.qq.com/s/hixBhYgbuJSgAUpMXwZSQQ](https://mp.weixin.qq.com/s/hixBhYgbuJSgAUpMXwZSQQ)
> 
> .Net Redis 实现分布式锁以及实现Gzip数据压缩提升性能：[https://mp.weixin.qq.com/s/BkrKD86va-UQYhN7AyBIJA](https://mp.weixin.qq.com/s/BkrKD86va-UQYhN7AyBIJA)

