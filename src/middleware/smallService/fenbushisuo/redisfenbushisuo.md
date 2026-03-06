---
title: Redis分布式锁
lang: zh-CN
date: 2023-10-04
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: redisfenbushisuo
slug: nzefwk
docsId: '32085426'
---

## 实现原理

### 基础实现
Redis 本身可以被多个客户端共享访问，正好就是一个共享存储系统，可以用来保存分布式锁，而且 Redis 的读写性能高，可以应对高并发的锁操作场景。
Redis 的 SET 命令有个 NX 参数可以实现「key不存在才插入」，所以可以用它来实现分布式锁：

- 如果 key 不存在，则显示插入成功，可以用来表示加锁成功；
- 如果 key 存在，则会显示插入失败，可以用来表示加锁失败。

SET lock_keyunique_value NX PX 10000

- lock_key 就是 key 键；
- unique_value 是客户端生成的唯一的标识，区分来自不同客户端的锁操作；
- NX 代表只在 lock_key 不存在时，才对 lock_key 进行设置操作；
- PX 10000 表示设置 lock_key 的过期时间为 10s，这是为了避免客户端发生异常而无法释放锁。

释放锁的时候需要删除key，或者使用lua脚本来保证原子性。
```csharp
// 释放锁时，先比较 unique_value 是否相等，避免锁的误释放
if redis.call("get",KEYS[1]) == ARGV[1] then
return redis.call("del",KEYS[1])
    else
    return 0
    end
```

### 续租机制
基于上文中的实现方式，我们在设置key过期时间时，不能准确的描述业务处理时间。为了防止因为业务处理时间较长导致锁过期而提前释放锁，通过不断更新锁的过期时间来保持锁的有效性，避免了因锁过期而导致的并发问题。
关于这个问题，目前常见的解决方法有两种：
1、实现自动续租机制：额外起一个线程，定期检查线程是否还持有锁，如果有则延长过期时间。DistributedLock里面就实现了这个方案，使用“看门狗”定期检查（每1/3的锁时间检查1次），如果线程还持有锁，则刷新过期时间。
2、实现快速失败机制：当我们解锁时发现锁已经被其他线程获取了，说明此时我们执行的操作已经是“不安全”的了，此时需要进行回滚，并返回失败。
以下是使用StackExchange.Redis 库实现分布式锁和续租机制的示例代码：
```csharp
public class RedisLock
{
    private readonly IDatabase _database;
    private readonly string _lockKey;
    private string _lockValue;
    private readonly TimeSpan _lockTimeout;

    private readonly TimeSpan _renewInterval;
    private bool _isLocked;

    public RedisLock(IDatabase database, string lockKey, TimeSpan lockTimeout, TimeSpan renewInterval)
    {
        _database = database;
        _lockKey = lockKey;
        _lockTimeout = lockTimeout;
        _renewInterval = renewInterval;
    }

    //尝试获取锁，如果成功，则启动一个续租线程
    public async Task<bool> AcquireAsync()
    {
        _lockValue = Guid.NewGuid().ToString();
        var acquired = await _database.StringSetAsync(_lockKey, _lockValue, _lockTimeout, When.NotExists);
        if (acquired)
        {
            _isLocked = true;
            StartRenewal();
        }
        return acquired;
    }

    //定期使用 KeyExpireAsync 命令重置键的过期时间，从而实现续租机制
    private async void StartRenewal()
    {
        while (_isLocked)
        {
            await Task.Delay(_renewInterval);
            await _database.KeyExpireAsync(_lockKey, _lockTimeout);
        }
    }
}
```


## 容易遇到的问题
分布式锁方法容易遇到的问题
1.得到锁后系统出现问题，这个时候未设置过期时间，锁一直未释放。(最好设置锁的同时原子性的设置过期时间)
2.A,B,C在排队获取锁，a业务未处理完，锁过期了，然后等待的b任务拿到了锁，等a处理完成后，将锁释放这个时候c就又拿到锁了。(在设置锁的时候，将guid作为value存储，释放锁的时候，如果value值是存储的的那个，那么就释放，否则就不释放)
```
var id = Guid.NewGuid().ToString("N");
//获取锁
do
{
    //set : key存在则失败,不存在才会成功,并且过期时间5秒
    var success = redisClient.Set(lockKey, id, expireSeconds: 5, exists: RedisExistence.Nx);
    if (success == true)
    {
        break;
    }
    Thread.Sleep(TimeSpan.FromSeconds(1));//休息1秒再尝试获取锁
} while (true);
Console.WriteLine($"线程:{Task.CurrentId} 拿到了锁,开始消费");
.........
//业务处理完后,释放锁.
var value = redisClient.Get<string>(lockKey);
if (value == id)
{
    redisClient.Del(lockKey);
}
```
3.如果设置的锁时间为5s，这个时候过期了，这个时候锁过期了，但是任务还未结束，如何进行锁续费时间。

锁示例
```csharp
var redisClient = new CSRedisClient("192.168.7.253:6379,password=2000,defaultDatabase=13,prefix=my_");

var lockKey = "lockKey";
var stock = 5;//商品库存
var taskCount = 10;//线程数量
redisClient.Del(lockKey);//测试前,先把锁删了.
for (int i = 0; i < taskCount; i++)
{
	Task.Run(() =>
	{
		var id = Guid.NewGuid().ToString("N");//生成唯一标识  标识当前线程
		//获取锁
		do
		{
			//setnx : key不存在才会成功,存在则失败.
			var success = redisClient.Set(lockKey, id, expireSeconds: 5, RedisExistence.Nx);//设置过期时间防止死锁 并且将存储和设置过期时间原子性处理
			if (success == true)
			{
				break;
			}
			Thread.Sleep(TimeSpan.FromSeconds(1));//休息1秒再尝试获取锁
		} while (true);
		Console.WriteLine($"线程:{Task.CurrentId} 拿到了锁,开始消费");
		if (stock <= 0)
		{
			Console.WriteLine($"库存不足,线程:{Task.CurrentId} 抢购失败!");
			redisClient.Del(lockKey);
			return;
		}
		stock--;


		//模拟处理业务
		Thread.Sleep(TimeSpan.FromSeconds(new Random().Next(1, 3)));


		Console.WriteLine($"线程:{Task.CurrentId} 消费完毕!剩余 {stock} 个");
		//业务处理完后,释放锁.
		//redisClient.Del(lockKey); //这种方法会出现a线程处理业务，然后超时后锁失效，然后b就在a线程没有结束前去处理了，然后b处理完后删除了线程
		//稍微高级一点写法    更应该删除和查询弄成一条命令，然后保证原子性,可以考虑下使用lua
		var value = redisClient.Get<string>(lockKey);
		if (value == id)
			redisClient.Del(lockKey);

	});
```
> 参考文档：[https://mp.weixin.qq.com/s/z0SRVU1zW6WyaCTrbKJTog](https://mp.weixin.qq.com/s/z0SRVU1zW6WyaCTrbKJTog)


简单锁
```csharp
/// <summary>
/// 是否可以获得到简单锁
/// </summary>
/// <param name="key">键名称</param>
/// <param name="expireSeconds">过期时间</param>
/// <param name="interval">重试时间</param>
/// <param name="loop">重试次数</param>
/// <returns>true得到锁，false得不到</returns>
public static async Task<bool> GetEasyLockAsync(string key, int expireSeconds = 5, int interval = 200, int loop = 3)
{
    bool isSuccess = false;
    for (int i = 0; i < loop; i++)
    {
        isSuccess = await RedisHelper.SetAsync(key, "lock", expireSeconds, RedisExistence.Nx).ConfigureAwait(false);
        if (isSuccess)
            break;
        if (interval > 0 && loop > 1)
            await Task.Delay(interval);
    }
    return isSuccess;
}
```
> key包含用户的id，然后用户请求的时候去调用该方法判断是否锁定，如果返回true，那么说明没有获取到锁，直接返回。

## 开源组件

### DistributedLock

DistributedLock 是一个 .NET 库，它基于各种底层技术提供强大且易于使用的分布式互斥锁、读写器锁和信号量。
仓库地址：[https://github.com/madelson/DistributedLockopen in new window](https://github.com/madelson/DistributedLock)

#### 支持

- [DistributedLock.SqlServeropen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.SqlServer.md) ：使用 Microsoft SQL Server
- [DistributedLock.Postgresopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.Postgres.md) ：使用 Postgresql
- [DistributedLock.MySqlopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.MySql.md) ：使用 MySQL 或 MariaDB
- [DistributedLock.Oracleopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.Oracle.md) ：使用 Oracle
- [DistributedLock.Redisopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.Redis.md) ：使用 Redis
- [DistributedLock.Azureopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.Azure.md) ：使用 Azure blob
- [DistributedLock.ZooKeeperopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.ZooKeeper.md) ：使用 Apache ZooKeeper
- [DistributedLock.FileSystemopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.FileSystem.md) : 使用锁文件
- [DistributedLock.WaitHandlesopen in new window](https://github.com/madelson/DistributedLock/blob/master/docs/DistributedLock.WaitHandles.md) ：使用操作系统全局WaitHandles（仅限 Windows）

#### 资料

[https://mp.weixin.qq.com/s/aZm42B2vmaTn74c0EkOOsgopen in new window](https://mp.weixin.qq.com/s/aZm42B2vmaTn74c0EkOOsg) | .NET开源分布式锁DistributedLock

### Masa分布式锁

:::tip

从依赖包信息上看貌似也是依赖上面DistributedLock组件的

:::



比如使用redis锁，需要安装包： Masa.Contrib.Caching.Distributed.StackExchangeRedis



[https://mp.weixin.qq.com/s/VtbfZ2o3QBuNfnvX7ttBcgopen in new window](https://mp.weixin.qq.com/s/VtbfZ2o3QBuNfnvX7ttBcg) | MASA Framework的分布式锁设计

