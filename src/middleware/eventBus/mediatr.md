---
title: MediatR
lang: zh-CN
date: 2023-08-26
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: mediatr
slug: hlcelx
docsId: '29634226'
---

## 概述
MediatR是一款基于中介者模式的思想而实现的.NET library，主要是为了解决进程内消息发送与消息处理过程之间的耦合问题。MediatR 提供了一种简洁的方式来协调应用程序内部的消息传递。通过将请求发送给中介者，可以确保每个处理程序只处理与其相关的请求，而不需要直接依赖其他处理程序。

MediatR 的效果可以类比为进程内的事件总线。虽然 MediatR 不是一个传统意义上的事件总线，但它在应用程序内部实现了中介者模式，可以将请求发送给对应的处理程序进行处理，从而达到解耦和组织代码的目的。

> 中介者模式(Mediator Pattern)定义：用一个中介对象来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。中介者模式又称为调停者模式，它是一种对象行为型模式。


![image.png](/common/1609838443244-8e178c00-db63-468e-ae97-d7bbf8695096.png)
优点：减少类间的依赖，将原有的一对多的依赖编程的一对一的依赖，同事类只依赖中介者，减少了依赖，当然同时也降低了类间的耦合性。
缺点：中介者会膨胀的很大，而且逻辑复杂，原来N个对象的相互依赖关系转换为中介者和同事类的依赖关系，同事类越多，中介者的逻辑就越复杂。

## 操作
安装组件
```csharp
MediatR
MediatR.Extensions.Microsoft.DependencyInjection
```
startup中注册服务
```csharp
//扫描 Startup 所在程序集内实现了 Handler 的对象并添加到 IoC 容器中 
//services.AddMediatR(typeof(Startup));
 services.AddMediatR(typeof(Program).Assembly);
```
> 注意：如果你的程序不在一个程序集下，需要注册多个程序集。


### **单播模式**
创建对应的请求类，继承irequest
```shell
public class Ping : IRequest<string>
{
    public string Name { get; set; }
}
```
然后单播处理类
```csharp
public class PingHandler : IRequestHandler<Ping, string>
{
	private readonly ILogger<PingHandler> _logger;

	public PingHandler(ILogger<PingHandler> logger)
	{
		_logger = logger;
	}

	public Task<string> Handle(Ping request, CancellationToken cancellationToken)
	{
	   _logger.LogError(JsonConvert.SerializeObject(request));
		return Task.FromResult("pong");
	}
}
```
发布单播消息
```csharp
var aaa = await _mediator.Send(new Ping(){Name = "张三"});
```

### 多播模式
创建多播请求类，继承INotification
```csharp
public class AddOperationLogBo : INotification
{
   public string Name { get; set; }
}
```
多播处理类
```csharp
public class OperationLogHandler : INotificationHandler<AddOperationLogBo>
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public OperationLogHandler(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task Handle(AddOperationLogBo notification, CancellationToken cancellationToken)
    {
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var _httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
            var _operationLogRepository = scope.ServiceProvider.GetRequiredService<IOperationLogRepository>();
            var _logger = scope.ServiceProvider.GetRequiredService<ILogger<OperationLogHandler>>();

            if (notification is null || !notification.IsValidOperation())
                return;

            var ip = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString();
            var entity = new OperationLog
            {
                DepartureTime = notification.DepartureTime,
                OperationContent = notification.OperationContent,
                OperationIp = ip,
                OperationTime = DateTime.Now.ToCstDateTime(),
                OperationType = (int)notification.OperationType,
                UserId = notification.UserId,
            };
            await _operationLogRepository.AddAsync(entity).ConfigureAwait(false);
            _logger.LogInformation($"记录操作日志成功，用户ID{notification.UserId} 操作内容：{notification.OperationContent}");
        }
    }
}
```
依赖注入IMediator
```csharp
private readonly IMediator _mediator;
```
发布多播消息
```csharp
await _mediator.Publish(new Ping2 {Name = "测试"});
```

### IPipelineBehavior
```csharp
public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : ICacheableQuery
{
    private readonly IDistributedCache _cache;

    public CachingBehavior(IDistributedCache cache)
    {
        _cache = cache;
    }
    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        TResponse response;
        if (request.SlidingExpiration == null)
        {
            return await next();
        }
        var key =GetCacheKey(request);
        var cachedResponse = await _cache.GetAsync(key, cancellationToken);
        if (cachedResponse != null)
        {
            response = JsonConvert.DeserializeObject<TResponse>(Encoding.UTF8.GetString(cachedResponse));
        }
        else
        {
            response = await next();
            var options = new DistributedCacheEntryOptions { SlidingExpiration = request.SlidingExpiration };
            var serializedData = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(response));
            await _cache.SetAsync(key, serializedData, options, cancellationToken);
            return response;
        }
        return response;
    }
}
```
 以TRequest作为缓存Key，如果缓存存在，则反序列化得到缓存的响应，否则执行请求，缓存响应。使用Mediator，设置缓存时间为5秒：
```csharp
public class WeatherForecastController : ControllerBase
{
    private readonly IMediator _mediator;

    public WeatherForecastController(IMediator mediator)
    {
        this._mediator = mediator;
    }


    [HttpGet]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {
        return await this._mediator.Send(new GetWeatherForecastQuery());              
    }
}

public class GetWeatherForecastQuery : IRequest<IEnumerable<WeatherForecast>>, ICacheableQuery
{
    public TimeSpan? SlidingExpiration { get; set; } = TimeSpan.FromSeconds(5);
}

internal class GetWeatherForecastQueryHandler : IRequestHandler<GetWeatherForecastQuery, IEnumerable<WeatherForecast>>
{
    public async Task<IEnumerable<WeatherForecast>> Handle(GetWeatherForecastQuery request, CancellationToken cancellationToken)
    {
        await Task.Delay(1000);
        var rng = new Random();
        return Enumerable.Range(1, 1).Select(index => new WeatherForecast
        { 
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
```

### dotNet6+
在.Net高版本中，只需要去引用nuget包MediatR，然后注入方法如下
```csharp
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Startup).Assembly));
```

## Mock MediatR
> 当前知识点来自：[https://blog.chcaty.cn/2021/09/22/net-core-mock-mediatr/](https://blog.chcaty.cn/2021/09/22/net-core-mock-mediatr/)

如何在单元测试中Mock MediatR 返回的数据，在网上已经有很多的写好的例子了。但是他们大部分都是通过控制器构造函数直接使用Mock的MediatR。而我需求是直接把Mock 出来的 MediatR 直接注入到IoC在容器中，在阅读官方文档以后，发现对应注入IMediatR的方法。下面是封装的一个Mock MediatR的方法
```csharp
// <summary> 
/// MockMediator 调用方单元测试时可以模拟Mediator返的数据
/// </summary> 
public static class Mock
{
	public static IServiceCollection UseMockMediator(this IServiceCollection services)
	{
		// 移除原来的Mediator注入
		var mediator = services.SingleOrDefault(d => d.ServiceType == typeof(IMediator));
		if (mediator != null) services.Remove(mediator);
		// Mock Mediator
		var fakeMediator = new Mock<IMediator>();
		fakeMediator.Setup(x => x.Send(It.IsAny<GetStudentByIdQuery>(), It.IsAny<CancellationToken>()))
		.Returns(async () => await Task.FromResult(new StudentInfo
		{
			BirthTime = DateTime.Now,
			ClassName = "测试班级",
			Code = "test0001",
			CreateTime = DateTime.Now.AddDays(-10),
			Id = 1,
			Name = "测试学生"
		}));
		// 将MockMediator注入 
		services.TryAdd(new ServiceDescriptor(typeof(IMediator), fakeMediator.Object));
		return services;
	}
}
```

## 资料
教程：[https://www.cnblogs.com/sheng-jie/p/10280336.html](https://www.cnblogs.com/sheng-jie/p/10280336.html)
[https://mp.weixin.qq.com/s/RuWFL5pWT-Bg-Se_O7w5IA](https://mp.weixin.qq.com/s/RuWFL5pWT-Bg-Se_O7w5IA) | 在 ASP.NET Core 项目中使用 MediatR 实现中介者模式
