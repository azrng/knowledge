---
title: 分布式缓存
lang: zh-CN
date: 2023-08-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fenbushihuancun
slug: su11b7
docsId: '30871436'
---

## 说明
分布式缓存用于提高应用程序的性能和可伸缩性，通常分布式缓存被多个应用服务器共享，在分布式缓存中，缓存的数据不会存储在个别的web服务器内存找那个，这些缓存采用集中化存储的，这样子多个应用服务器都可以直接使用。好处在于，如果任意一个服务器宕机或者停止响应，其他的应用服务器仍然能够检索缓存的数据。另一个优点是存储的数据在服务器重启后仍然存在。

## 使用
通过实现微软官方的Microsoft.Extensions.Caching里面的IDistributedCache接口实现缓存集成到ASPNETCore中。
IDistributedCache骨架代码
```csharp
namespace Microsoft.Extensions.Caching.Distributed
{
        public interface IDistributedCache
        {
            byte[] Get(string key);
            void Refresh(string key);
            void Remove(string key);
            void Set(string key, byte[] value,
            DistributedCacheEntryOptions options);
        }
}
```

### Redis
微软给netcore的缓存提供了Redis和Sqlserver的实现，通过Sqlserver来缓存的场景比较少，这里我们简单看一下官方提供的Redis缓存用法。

#### Caching.Redis(不更新了)
> 安装组件：Microsoft.Extensions.Caching.Redis


##### WebAPI
ConfigureServices中使用
```csharp
services.AddDistributedRedisCache(options =>
{
	options.Configuration = "xxxx:6379,password=xxxx,defaultdatabase=10";
	options.InstanceName = "AZRNG";
});
```
控制器中使用
```csharp
private readonly ILogger<WeatherForecastController> _logger;
private readonly IDistributedCache _cache;

public WeatherForecastController(ILogger<WeatherForecastController> logger,
	IDistributedCache cache)
{
	_logger = logger;
	_cache = cache;
}

[HttpGet]
public string Get()
{
	var data = _cache.GetString("login");
	if (string.IsNullOrWhiteSpace(data))
		_cache.SetString("login", "你好世界");

	return _cache.GetString("login");
}
```
> 还可以借助其他方式实现分布式缓存，比如SqlServer


#### Caching.StackExchangeRedis

##### 控制台程序
添加Nuget包
```csharp
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="5.0.1" />
```
写一个简单的控制台程序实现一下netcore中的分布式缓存redis实现
```csharp
private static void Main(string[] args)
{
	//获取RedisCache实例
	RedisCache redisCache = new RedisCache(new RedisCacheOptions()
	{
		Configuration = "localhost:6379,password=123456",
		InstanceName = "MyData"
	});
	//在redis中是以hash表的模式存放的
	redisCache.SetString("Name", "jack");
	redisCache.SetString("Age", "20");
	redisCache.SetString("Address", "上海", new DistributedCacheEntryOptions()
	{
		//SlidingExpiration = TimeSpan.FromSeconds(3)
		AbsoluteExpiration = DateTimeOffset.Now.AddDays(1)//过期时间
	});
	//获取缓存
	Console.WriteLine(redisCache.GetString("Name"));
}
```

##### Web API
新建一个net5 Web API应用程序添加Nuget包
```csharp
<PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="5.0.1" />
```
注入服务
```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers();
	
	services.AddStackExchangeRedisCache(options =>
	{
		options.Configuration = "localhost:6379,password=123456,defaultdatabase=1";
		options.InstanceName = "MyData";
	});
}
```
依赖注入使用
```csharp
private readonly IDistributedCache _cache;

public WeatherForecastController(IDistributedCache cache)
{
	_cache = cache;
}

[HttpGet]
public async Task<string> TestAsync()
{
	//永不过期
	await _cache.SetAsync("add", Encoding.UTF8.GetBytes("北京"));
	var add = await _cache.GetStringAsync("add");//北京

	//配置过期时间
	await _cache.SetStringAsync("Address", "上海", new DistributedCacheEntryOptions()
	{
		//SlidingExpiration = TimeSpan.FromSeconds(3)
		AbsoluteExpiration = DateTimeOffset.Now.AddDays(1)
	});
	var address = await _cache.GetStringAsync("Address");//上海

	return "";
}
```

#### Caching.CSRedis
分布式缓存 CSRedisCore 实现 Microsoft.Extensions.Caching

#### FreeRedis

分布式缓存nuget包

### Garnet

Garnet 是 Microsoft Research 推出的一个新的远程缓存存储,旨在实现极快、可扩展和低延迟.Garnet 可在单个节点内进行线程扩展.它还支持分片集群执行,包括复制、检查点、故障转移和事务.它可以在主内存以及分层存储（例如 SSD 和 Azure 存储）上运行.Garnet 支持丰富的 API 图面和强大的扩展性模型。

仓库地址：https://github.com/joesdu/GarnetServer

#### 部署

```dockerfile
#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:9.0-preview AS base
USER app
WORKDIR /app
EXPOSE 3278

FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
RUN mkdir GarnetServer
RUN dotnet new console -n GarnetServer
RUN dotnet add "./GarnetServer/GarnetServer.csproj" package Microsoft.Garnet
RUN printf 'using Garnet;try{using var server = new GarnetServer(args);server.Start();Thread.Sleep(Timeout.Infinite);}catch (Exception ex){Console.WriteLine($"Unable to initialize server due to exception: {ex.Message}");}' > ./GarnetServer/Program.cs
RUN dotnet restore "./GarnetServer/GarnetServer.csproj"
WORKDIR "/src/GarnetServer"
RUN dotnet build "./GarnetServer.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./GarnetServer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GarnetServer.dll"]
```

运行命令

```shell
docker build -f ./Dockerfile -t garnet:latest .
```

#### 资料

使用.NET自托管 Garnet 服务：https://mp.weixin.qq.com/s/AiHxkt86v5li0erPnZ51gQ

## 参考文档
> 作者：捞月亮的猴子  [https://www.cnblogs.com/wyy1234/p/10519681.html](https://www.cnblogs.com/wyy1234/p/10519681.html)
> 官方教程：[https://docs.microsoft.com/zh-cn/aspnet/core/performance/caching/memory?view=aspnetcore-5.0](https://docs.microsoft.com/zh-cn/aspnet/core/performance/caching/memory?view=aspnetcore-5.0)

