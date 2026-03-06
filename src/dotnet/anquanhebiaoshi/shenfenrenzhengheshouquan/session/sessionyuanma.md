---
title: Session源码
lang: zh-CN
date: 2022-04-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: sessionyuanma
slug: wmplw3
docsId: '49946478'
---
注册
```csharp
services.AddDistributedMemoryCache();
services.AddSession((option) =>
{
    option.IdleTimeout = TimeSpan.FromDays(1);//过期时间
    option.Cookie.HttpOnly = true;//是否允许js访问
    option.Cookie.IsEssential = true;//为true则绕过策略检查
});
```
session依赖于IDistributedCache来存储数据，那么查看AddDistributedMemoryCache里面做了什么
```csharp
services.AddOptions();
services.TryAdd(ServiceDescriptor.Singleton<IDistributedCache, MemoryDistributedCache>());
```
添加了选项所需服务(这个我见好多第三方服务注册都注册了这个，此时先跳过)，我们查看IDistributedCache里面包含的接口
```csharp
/// <summary>
/// Represents a distributed cache of serialized values.
/// 表示序列化的分布式缓存
/// </summary>
public interface IDistributedCache
{
    /// <summary>
    /// 根据键获取值
    /// </summary>
    /// <returns></returns>
    byte[] Get(string key);

    /// <summary>
    /// 根据键获取值
    /// </summary>
    /// <returns></returns>
    Task<byte[]> GetAsync(string key, CancellationToken token = default(CancellationToken));

    /// <summary>
    /// 给指定的键设置值
    /// </summary>
    /// <returns></returns>
    void Set(string key, byte[] value, DistributedCacheEntryOptions options);

    /// <summary>
    /// 给指定键设置值
    /// </summary>
    /// <returns></returns>
    Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default(CancellationToken));

    /// <summary>
    /// 根据键刷新缓存中的值，重置其滑动过期超时(如果有的话)。  
    /// </summary>
    /// <param name="key">标识请求值的字符串</param>
    void Refresh(string key);

    /// <summary>
    /// 根据键刷新缓存中的值，重置其滑动过期超时(如果有的话)。  
    /// </summary>
    /// <param name="key">标识请求值的字符串.</param>
    /// <param name="token"> 用于传播应用取消操作的通知.</param>
    /// <returns>The <see cref="Task"/> that represents the asynchronous operation.</returns>
    Task RefreshAsync(string key, CancellationToken token = default(CancellationToken));

    /// <summary>
    /// 删除指定键的值
    /// </summary>
    /// <param name="key">标识请求值的字符串.</param>
    void Remove(string key);

    /// <summary>
    /// 删除指定键的值.
    /// </summary>
    /// <param name="key">标识请求值的字符串.</param>
    /// <param name="token">用于传播应用取消操作的通知.</param>
    /// <returns>The <see cref="Task"/> that represents the asynchronous operation.</returns>
    Task RemoveAsync(string key, CancellationToken token = default(CancellationToken));
}
```
这个接口里面包含了基本的增删查缓存的方法，MemoryDistributedCache实现这个接口并在构造函数中通过new的形式创建了一个MemoryCache实例
```csharp
private readonly IMemoryCache _memCache;

public MemoryDistributedCache(IOptions<MemoryDistributedCacheOptions> optionsAccessor)
	: this(optionsAccessor, NullLoggerFactory.Instance) { }

public MemoryDistributedCache(IOptions<MemoryDistributedCacheOptions> optionsAccessor, ILoggerFactory loggerFactory)
{
	_memCache = new MemoryCache(optionsAccessor.Value, loggerFactory);
}
```
> 该代码有删减，去除了参数校验代码

通过查看MemoryCache注释，我们知道了这个是一个内存存储(通过字典存储)，大概就是MemoryDistributedCache又去调用了MemoryCache进行存储。
下面我们查看services.AddSession()g方法
```csharp
public static IServiceCollection AddSession(this IServiceCollection services)
{
    if (services == null)
    {
        throw new ArgumentNullException(nameof(services));
    }

    services.TryAddTransient<ISessionStore, DistributedSessionStore>();
    services.AddDataProtection(); // 数据保护
    return services;
}
```
该方法中和我们本文相关的就是那个瞬时注册的东西，在ISessionStore中只有一个方法声明
```csharp
// 创建一个新的ISession
ISession Create(string sessionKey, TimeSpan idleTimeout, TimeSpan ioTimeout, Func<bool> tryEstablishSession, bool isNewSessionKey);
```
DistributedSessionStore中实现Create方法创建实例DistributedSession(继承与ISession)
```csharp
    public ISession Create(
      string sessionKey,
      TimeSpan idleTimeout,
      TimeSpan ioTimeout,
      Func<bool> tryEstablishSession,
      bool isNewSessionKey)
    {
      if (string.IsNullOrEmpty(sessionKey))
        throw new ArgumentException(Resources.ArgumentCannotBeNullOrEmpty, nameof (sessionKey));
      if (tryEstablishSession == null)
        throw new ArgumentNullException(nameof (tryEstablishSession));
      return (ISession) new DistributedSession(this._cache, sessionKey, idleTimeout, ioTimeout, tryEstablishSession, this._loggerFactory, isNewSessionKey);
    }
```
DistributedSession里面封装了一些操作ISession的方法


Session操作
最简单的在控制器中，直接通过上下文去访问Session
```csharp
var bb = Encoding.UTF8.GetBytes("bbb");
HttpContext.Session.Set("aaa", bb);

var bytes= HttpContext.Session.Get("aaa");
```
更常用的是借助Microsoft.AspNetCore.Http对ISession封装的扩展方法
```csharp
HttpContext.Session.SetString("aaaa","bbbb");
var value = HttpContext.Session.GetString("aaaa");
```


