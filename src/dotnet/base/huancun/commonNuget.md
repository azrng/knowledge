---
title: 开源Nuget包
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: easycaching
slug: uxycrozf3xugtb7d
docsId: '120402664'
---

## FusionCache

FusionCache 是一款易于使用、快速且强大的缓存，具有高级弹性功能和可选的分布式第二级缓存。

它是在处理各种不同类型的缓存多年后诞生的：内存缓存、分布式缓存、http 缓存、CDN、浏览器缓存、离线缓存，应有尽有。

仓库地址：https://github.com/ZiggyCreatures/FusionCache

## EasyCaching

EasyCaching 是一个开源的缓存库，包含了缓存的基本用法和一些高级用法，可以帮助我们更轻松的处理缓存！

仓库地址：[https://github.com/dotnetcore/EasyCaching](https://github.com/dotnetcore/EasyCaching)

### 项目特色
1、统一缓存接口：方便我们随时调整缓存策略；
2、支持多种缓存：可以满足我们多种业务场景；
3、支持多种缓存系列化：BinaryFormatter、Newtonsoft.Json，MessagePack和Protobuf；
4、支持缓存AOP：able, put，evict，可以简化我们的代码量；
5、多实例支持；
6、支持Diagnostics：方便我们跟踪定位；
7、针对Redis支持特殊Provider：比如原子递增递减的操作等等；
8、二级缓存。

### 操作

#### 基本操作
在Startup.cs，配置缓存
```csharp
public void ConfigureServices(IServiceCollection services)
{
    ......
    services.AddEasyCaching(option =>
    {
        //内存缓存：default
        option.UseInMemory("default");

        //内存缓存：cus
        option.UseInMemory("cus");

        //redis缓存：redis1
        option.UseRedis(config =>
        {
            config.DBConfig.Endpoints.Add(new ServerEndPoint("127.0.0.1", 6379));
            config.DBConfig.SyncTimeout = 10000;
            config.DBConfig.AsyncTimeout = 10000;
            config.SerializerName = "mymsgpack";
        }, "redis1")
        .WithMessagePack("mymsgpack")//with messagepack serialization
        ;

        //redis缓存：redis2
        option.UseRedis(config =>
        {
            config.DBConfig.Endpoints.Add(new ServerEndPoint("127.0.0.1", 6380));
        }, "redis2");

        //sqlite缓存
        option.UseSQLite(config =>
        {
            config.DBConfig = new SQLiteDBOptions { FileName = "my.db" };
        });

        //memcached 缓存
        option.UseMemcached(config =>
        {
            config.DBConfig.AddServer("127.0.0.1", 11211);
        });

        option.UseMemcached(Configuration);

        //fasterKv缓存
        option.UseFasterKv(config =>
        {
            config.SerializerName = "msg";
        })
            .WithMessagePack("msg");
    });
}
```
使用方法
```csharp
public class CusController : Controller
{
    //缓存
    private readonly IEasyCachingProviderFactory _factory;
    public CusController(IEasyCachingProviderFactory factory)
    {
        this._factory = factory;
    }

    // GET api/cus/inmem?name=Default
    [HttpGet]
    [Route("inmem")]
    public string Get(string name = EasyCachingConstValue.DefaultInMemoryName)
    {
        //根据name，获取缓存实例
        var provider = _factory.GetCachingProvider(name);
        var val = name.Equals("cus") ? "cus" : "default";
        var res = provider.Get("demo", () => val, TimeSpan.FromMinutes(1));
        return $"cached value : {res}";
    }
    ......
}
```
ResponseCache缓存
```csharp
[ResponseCache(Duration = 30, VaryByQueryKeys = new string[] { "page" })]
public IActionResult List(int page = 0)
{
return Content(page.ToString());
}
```
Aop缓存
```csharp
[EasyCachingAble(Expiration = 10)]
string GetCurrentUtcTime();

[EasyCachingPut(CacheKeyPrefix = "Castle")]
string PutSomething(string str);

[EasyCachingEvict(IsBefore = true)]
void DeleteSomething(int id);
```

## 参考资料
开源缓存中间件：[https://mp.weixin.qq.com/s/WK-LLmv6ifBIRhQkJLensg](https://mp.weixin.qq.com/s/WK-LLmv6ifBIRhQkJLensg)
