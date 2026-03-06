---
title: CSRedis
lang: zh-CN
date: 2023-07-01
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: csredis
slug: lmlmgv
docsId: '32064765'
---

## 1. 介绍
CSRedis 是 redis.io 官方推荐库，支持 redis-trib集群、哨兵、私有分区与连接池管理技术，简易 RedisHelper 静态类, 它主要又两个程序集。

1. CSRedisCore：主库,实现对接redis各种功能
2. Caching.CSRedis：分布式缓存 CSRedisCore 实现 Microsoft.Extensions.Caching，通过IDistributedCache进行操作
> GitHub地址：[https://github.com/2881099/csredis](https://github.com/2881099/csredis)
> GitHub地址翻译中文版本：[https://www.cnblogs.com/tuyile006/p/14051569.html](https://www.cnblogs.com/tuyile006/p/14051569.html)
> 操作说明文档：[https://www.cnblogs.com/yaopengfei/p/14211883.html](https://www.cnblogs.com/yaopengfei/p/14211883.html)

最新更新：2022年末

## 2. IDistributedCache
实现 Microsoft.Extensions.Caching

### 2.1 引用包
```csharp
    <PackageReference Include="Caching.CSRedis" Version="3.6.60" />
    <PackageReference Include="CSRedisCore" Version="3.6.6" />
    <PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="5.0.0" />
```

### 2.2 注册方式
```csharp
/// <summary>
/// 添加redis缓存配置
/// </summary>
/// <param name="services"></param>
public static void AddRedisCacheService(this IServiceCollection services, Func<RedisConfig> func)
{
    if (services is null)
        throw new ArgumentNullException(nameof(services));

    services.AddTransient<IRedisCacheManager, RedisCacheManager>();//封装的类
    var config = func.Invoke();
    RedisHelper.Initialization(new CSRedisClient($"{config.ConnectionString},prefix={config.InstanceName}"));
    services.AddSingleton<IDistributedCache>(new CSRedisCache(RedisHelper.Instance));
}
```

### 2.3 封装类
```csharp
        private readonly IDistributedCache _cache;

        public RedisCacheManager(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task SetAsync<T>(string key, T value, int timeoutSeconds)
        {
            if (value.GetType().IsClass)
            {
                await _cache.SetAsync(key, Encoding.UTF8.GetBytes(
                    JsonConvert.SerializeObject(value, new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                    })), new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(timeoutSeconds)
                    });
            }
            else
            {
                await _cache.SetAsync(key, Encoding.UTF8.GetBytes(value.ToString()), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(timeoutSeconds)
                });
            }
        }
```

## 3. RedisHelper

### 3.1 引用包
```csharp
    <PackageReference Include="CSRedisCore" Version="3.6.6" />
    <PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="5.0.0" />
```

### 3.2 注册方式
```csharp
        /// <summary>
        /// 添加redis缓存配置
        /// </summary>
        /// <param name="services"></param>
        public static void AddRedisCacheService(this IServiceCollection services, Func<RedisConfig> func)
        {
            if (services is null)
                throw new ArgumentNullException(nameof(services));

            services.AddTransient<IRedisCache, RedisCache>();//封装类
            var config = func.Invoke();
            RedisHelper.Initialization(new CSRedisClient($"{config.ConnectionString},prefix={config.InstanceName}"));
        }
```

### 3.3 封装类
```csharp
        public async Task<TEntity> GetAsync<TEntity>(string key)
        {
            return await RedisHelper.HGetAsync<TEntity>(key, "data");
        }

        public async Task SetAsync<T>(string key, T value, double? second)
        {
            await RedisHelper.HSetAsync(key, "data", JsonConvert.SerializeObject(value));
            await RedisHelper.ExpireAsync(key, TimeSpan.FromMinutes(second ?? 600));
        }
```
