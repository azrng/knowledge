---
title: redis发布订阅
lang: zh-CN
date: 2023-06-25
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: redisfabudingyue
slug: rrbkle
docsId: '47227880'
---
redis目前的订阅发布采用的是发送即忘策略，如果你的程序需要可靠性的事件通知，那么键空间通知可能就不适合你；当订阅事件的客户端断线时候，它就会丢失所有短线期间分给他的事件，并不能确保消息送达。

## 事件类型
对于每个修改数据库的操作，键空间通知都会发送两种不同类型的事件消息：keyspace 和 keyevent。以 keyspace 为前缀的频道被称为键空间通知（key-space notification）， 而以 keyevent 为前缀的频道则被称为键事件通知（key-event notification）。
```
事件是用  __keyspace@DB__:KeyPattern 或者  __keyevent@DB__:OpsType 的格式来发布消息的。
DB表示在第几个库；KeyPattern则是表示需要监控的键模式（可以用通配符，如：__key*__:*）；OpsType则表示操作类型。因此，如果想要订阅特殊的Key上的事件，应该是订阅keyspace。
比如说，对 0 号数据库的键 mykey 执行 DEL 命令时， 系统将分发两条消息， 相当于执行以下两个 PUBLISH 命令：
PUBLISH __keyspace@0__:sampleKey del
PUBLISH __keyevent@0__:del sampleKey
订阅第一个频道 __keyspace@0__:mykey 可以接收 0 号数据库中所有修改键 mykey 的事件， 而订阅第二个频道 __keyevent@0__:del 则可以接收 0 号数据库中所有执行 del 命令的键。
```

## 开启配置
键空间通知通常是不启用的，因为这个过程会产生额外消耗。所以在使用该特性之前，请确认一定是要用这个特性的，然后修改配置文件，或使用config配置。相关配置项如下：

| 字符 | 发送通知 |
| --- | --- |
| K | 键空间通知，所有通知以 keyspace@ 为前缀，针对Key |
| E | 键事件通知，所有通知以 keyevent@ 为前缀，针对event |
| _g_ | _DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知_ |
| $ | 字符串命令的通知 |
| l | 列表命令的通知 |
| s | 集合命令的通知 |
| h | 哈希命令的通知 |
| z | 有序集合命令的通知 |
| _x_ | _过期事件：每当有过期键被删除时发送_ |
| _e_ | _驱逐(evict)事件：每当有键因为 maxmemory 政策而被删除时发送_ |
| A | 参数 g$lshzxe 的别名，相当于是All |

输入的参数中至少要有一个 K 或者 E ， 否则的话， 不管其余的参数是什么， 都不会有任何通知被分发。上表中斜体的部分为通用的操作或者事件，而黑体则表示特定数据类型的操作。配置文件中修改 notify-keyspace-events “Kx”，注意：这个双引号是一定要的，否则配置不成功，启动也不报错。例如，“Kx”表示想监控某个Key的失效事件。
也可以通过config配置：CONFIG set notify-keyspace-events Ex （但非持久化）
```
Redis 使用以下两种方式删除过期的键：
1.当一个键被访问时，程序会对这个键进行检查，如果键已经过期，那么该键将被删除。
2.底层系统会在后台查找并删除那些过期的键，从而处理那些已经过期、但是不会被访问到的键。
当过期键被以上两个程序的任意一个发现、 并且将键从数据库中删除时， Redis 会产生一个 expired 通知。
Redis 并不保证生存时间（TTL）变为 0 的键会立即被删除： 如果程序没有访问这个过期键， 或者带有生存时间的键非常多的话， 那么在键的生存时间变为 0 ， 直到键真正被删除这中间， 可能会有一段比较显著的时间间隔。
因此， Redis 产生 expired 通知的时间为过期键被删除的时候， 而不是键的生存时间变为 0 的时候。
```
由于通知收到的是redis key，value已经过期，无法收到，所以需要在key上标记业务数据。

## 事件订阅

### 过期事件
需要修改配置启用过期事件，比如在windows客户端中，需要修改redis.windows.conf文件,在linux中需要修改redis.conf，修改内容是：
![image.png](/common/1656734552242-9019b076-f2f7-482c-a638-5d5be3caeeba.png)
```
-- 取消注释
notify-keyspace-events Ex

-- 注释
#notify-keyspace-events ""
```
然后重新启动服务器，比如windows
```
 .\redis-server.exe  .\redis.windows.conf
```
或者linux中使用docker-compose重新部署redis
```csharp
  redis:  #内存数据库服务
    container_name: redis
    image: redis
    hostname: redis
    restart: always
    ports: 
      - "6379:6379"
    volumes: 
      - $PWD/redis/redis.conf:/etc/redis.conf
      - /root/common-docker-compose/redis/data:/data
    command: 
      /bin/bash -c "redis-server /etc/redis.conf" #启动执行指定的redis.conf文件
```
然后使用客户端订阅事件
```
-- windows
.\redis-cli
 
-- linux
docker exec -it 容器标识 redis-cli
 
psubscribe __keyevent@0__:expired
```

#### 控制台订阅
使用StackExchange.Redis组件订阅过期事件
```csharp
var connectionMultiplexer = ConnectionMultiplexer.Connect(_redisConnection);
var db = connectionMultiplexer.GetDatabase(0);

db.StringSet("orderno:123456", "订单创建", TimeSpan.FromSeconds(10));
Console.WriteLine("开始订阅");

var subscriber = connectionMultiplexer.GetSubscriber();

//订阅库0的过期通知事件
subscriber.Subscribe("__keyevent@0__:expired", (channel, key) =>
{
    Console.WriteLine($"key过期 channel:{channel} key:{key}");
});

Console.ReadLine();
```
输出结果：
key过期 channel:__keyevent@0__:expired key:orderno:123456

> 如果启动多个客户端监听，那么多个客户端都可以收到过期事件。


#### WebApi中订阅
创建RedisListenService继承自：BackgroundService
```csharp
public class RedisListenService : BackgroundService
{
    private readonly ISubscriber _subscriber;

    public RedisListenService(IServiceScopeFactory serviceScopeFactory)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        var connectionMultiplexer = ConnectionMultiplexer.Connect(configuration["redis"]);
        var db = connectionMultiplexer.GetDatabase(0);
        _subscriber = connectionMultiplexer.GetSubscriber();
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        //订阅库0的过期通知事件
        _subscriber.Subscribe("__keyevent@0__:expired", (channel, key) =>
        {
            Console.WriteLine($"key过期 channel:{channel} key:{key}");
        });

        return Task.CompletedTask;
    }
}
```
注册该后台服务
```csharp
services.AddHostedService<RedisListenService>();
```
启用项目，给redis指定库设置值，等过期后会接收到过期通知事件。
