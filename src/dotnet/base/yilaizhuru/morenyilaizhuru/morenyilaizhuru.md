---
title: 默认依赖注入
lang: zh-CN
date: 2023-10-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: morenyilaizhuru
slug: ylms45
docsId: '29987964'
---

## 概述
不应该依赖于具体的实现，应该依赖于抽象，高层模块不应该依赖于底层模块，二者应该依赖于抽象(否则业务变更，改动比较大)。简单的说就是为了更好的解耦。而控制反转(Ioc)就是这样的原则的其中一个实现思路, 这个思路的其中一种实现方式就是依赖注入(DI)。(官方原话：依赖注入(DI)这是一种在类和依赖项之间实现控制反转(Ioc)的技术)，
dotNet内置有对依赖注入(DI)的支持，提供了一个内置的服务容器IServiceProvider，程序在启动时候我们预先将服务注册不同生命周期到ServiceCollection，然后利用ServiceCollection来创建ServiceProvider，利用后者提供服务实例，将服务注入到使用到它的类的构造函数中。

> 只要是用new实例化的都是存在依赖的。

内置的服务容器已经满足框架和大多数项目的需求，一般不需要替换，除非你用到了下面这些功能：

- 属性注入
- 基于名称的注入
- 子容器
- 自定义生命周期
- 对延缓初始化的`Func<T>`支持
- 基于约定的注册

## 优点
解耦，使得代码更具有维护性。
方便进行单元测试。

## 服务注册
```csharp
//注册
services.AddTransient<IEmailValidCodeQuery, EmailValidCodeQuery>(); // 自动释放对象
services.AddSingleton<IMyDep>(sp => new MyDep()); // 自动释放对象
services.AddSingleton<MyDep>(); // 不自动释放对象
services.AddSingleton<IMyDep>(new MyDep()); //不自动释放对象

// 如果该IMessageWriter已经注册实现，该代码将没有作用
services.TryAddSingleton<IMessageWriter, LoggingMessageWriter>();

//移除和替换注册
//services.Replace(ServiceDescriptor.Transient<IEmailValidCodeQuery, EmailValidCodeQuery2>());
services.RemoveAll<IEmailValidCodeQuery>();

//注册泛型模板
services.AddSingleton(typeof(IAService<>), typeof(AService<>));
```

## 生命周期
AddSingleton→AddTransient→AddScoped

如果一个类没有住哪个台，建议吧服务的声明周期设置为单例；如果一个类有状态，并切在框架环境中有范围控制(比如ASP.NET Core中有默认的请求相关的范围)，在这种情况下级建议把服务的生命周期设置为范围，因为通常在范围控制下，代码都是运行同一个线程中的，没有并发修改的问题的
问题；在瞬时生命周期的时候要谨慎，尽量在子范围中使用它们，而不要在根范围中使用它们，因为如果我们控制不好，容易造成程序中出现内存泄漏的问题。

> 被注入的服务应该与注入的服务具有相同或者更长的生命周期


### Singleton(单例)
服务在第一次请求时被创建（或者当我们在ConfigureServices中指定创建某一实例并运行方法），其后的每次请求将沿用已创建服务。当应用程序关闭并释放SericeProvider时候，会释放单例服务。
![image.png](/common/1620437795433-1878377b-ead3-4b6b-a749-87f27b0907c0.png)
> 图片来源自：[https://blog.csdn.net/weixin_47498376/article/details/116177389](https://blog.csdn.net/weixin_47498376/article/details/116177389)

```csharp
services.AddSingleton<IApplicationService,ApplicationService>
```
> 比如有状态的、静态类和成员。


### Scoped(作用域)
一次请求开始到请求结束 ，这次请求中获取的对象都是同一个，请求结束时候会释放有作用域的服务。
![image.png](/common/1620437843902-34480f40-cbe1-4cad-a5bd-4f1c84cfca78.png)
> 图片来源自：[https://blog.csdn.net/weixin_47498376/article/details/116177389](https://blog.csdn.net/weixin_47498376/article/details/116177389)

```csharp
services.AddScoped<IApplicationService,ApplicationService>
```
> 如果该service在一个请求过程中多次被用到，并且可能共享其中的字段或者属性，那么就使用scoped，例如httpcontext。 (感谢群里老哥的帮助)


### Transient(瞬时)
每一次获取的对象都不是同一个，适合于轻量级、无状态的服务，请求结束时候会释放服务。
![image.png](/common/1620437917664-c31fe30a-c429-4d5a-b66b-4a065089dd92.png)
> 图片来源自：[https://blog.csdn.net/weixin_47498376/article/details/116177389](https://blog.csdn.net/weixin_47498376/article/details/116177389)

```csharp
services.AddTransient<IApplicationService,ApplicationService>
```
> 如果该service在一次请求中只使用一次，那么就注册Transient就好了。


## 注入方式
```csharp
/// <summary>
/// 用户接口
/// </summary>
public interface IUserService
{
	string GetName();
}

/// <summary>
/// 用户实现
/// </summary>
public class UserService : IUserService
{
	public string GetName()
	{
		return "AZRNG";
	}
}
```
> 需要在ConfigureServices方法进行注入


### 构造函数注入
服务作为构造函数参数添加，并且运行时从服务容器中解析服务。
```csharp
private readonly IUserService _userService;

public UserController(IUserService userService
	,IEnumerable<IMessageWriter>)// 解析多个服务
{
	_userService = userService;
}

[HttpGet]
public ActionResult GetName()
{
	return Ok(_userService.GetName());
}
```

### FromServices注入 
```csharp
[HttpGet]
public ActionResult GetName([FromServices] IUserService _userService)
{
	 return Ok(_userService.GetName());
}
```

### 其他注入

#### 根据已注入服务配置注入新服务

```c#
services.AddScoped<IAmazonS3>(sp =>
{
    // 这里可能需要创建scope来操作
    var chartReview = sp.GetRequiredService<IChartReviewConfigDomainService>();
    var minioConfig = chartReview.GetChartReviewConfigAsync<MinioInfoConfig>(MinioInfoConfig.Key).GetAwaiter().GetResult();
    var credentials = new BasicAWSCredentials(minioConfig.AccessKey, minioConfig.SecretKey);
    var clientConfig = new AmazonS3Config { ServiceURL = minioConfig.Url, ForcePathStyle = true };

    return new AmazonS3Client(credentials, clientConfig);
});
```

## 获取服务

在.NET Core中DI的核心分为两个组件：IServiceCollection和 IServiceProvider。

- IServiceCollection负责注册
- IServiceProvider负责提供实例
```csharp
public void ConfigureServices(IServiceCollection services)
{
	//将服务生命期的范围限定为单个请求的生命期
    services.AddTransient<IUserService, UserService>();
}
```

### 构造函数获取服务
```csharp
private readonly IUserService _userService;
public HomeController(IUserService userService)
{
	_userService = userService;
}

public IActionResult Index()
{
	var info = _userService.GetInfo();
	return View();
}
```

### IServiceProvider获取
生命周期是Scope的
```csharp
private readonly IServiceProvider _service;
public UserController(IServiceProvider service)
{
	_service = service;
}

[HttpGet]
public ActionResult GetName()
{
	var _userService = (IUserService)_service.GetService(typeof(IUserService));
	return Ok(_userService.GetName());
}
```

使用 ActivatorUtilities 创建

```csharp
var testTask = ActivatorUtilities.CreateInstance<TestTask>(serviceProvider, "test");
await testTask.Execute(new CancellationToken());
```

### ConfigureServices中获取服务

```csharp
var provider = services.BuildServiceProvider();
var userserivce = provider.GetService<IUserService>(); // 获取不到为null
//或
var userservice2 = provider.GetRequiredService<IUserService>(); // 获取不到抛出异常
```

### Configure中获取服务
```csharp
var manualScope = app.ApplicationServices.CreateScope();
 
var service = manualScope.ServiceProvider.GetRequiredService<IUserService>();
service.SayHello();
```

### 构建子容器
```csharp
using (var serviceProvider = new ServiceCollection()
                .AddSingleton<ISingletonService, SingletonService>()
                .BuildServiceProvider())
{
    var app = serviceProvider.GetService<ISingletonService>();

    app.Execute();
}
```
> 自己构建这种需要手动释放，防止内存泄露。避免在ConfigureService中调用BuildServiceProvider。


### 后台任务获取
当使用异步获取或者后台任务处理的时候，应该使用CreateScope创建一个完全独立于任何当前作用域的新作用域。如果从新作用域解析服务，它将返回该服务的新实例。

#### IServiceScopeFactory
IServiceScopeFactory的具体实例是Microsoft.Extensions.DependencyInjection.ServiceLookup.ServiceProviderEngineScope，是一个根容器的作用域，基于根容器创建的IServiceScope可以得到平行于当前作用域的独立作用域。
```csharp
public class MyFirstHostedService : BackgroundService
{
    private readonly IServiceScopeFactory _factory;
    private readonly IServiceScope _serviceScope;

    public MyFirstHostedService(IServiceScopeFactory factory)
    {
        _factory = factory;
        _serviceScope = factory.CreateScope();
    }

    protected override async Task ExecuteAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            //xxx 逻辑处理
            Console.WriteLine($"输出时间：{DateTime.Now}");
            await Task.Delay(1000, token);
        }
    }

    public override void Dispose()
    {
        this._serviceScope.Dispose();
        base.Dispose();
    }
}
```
IServiceScopeFactory的CreateScope方法实现是ServiceProviderEngineScope下面的
```csharp
public IServiceScope CreateScope() => this.RootProvider.CreateScope();
```
CreateScope方法实现是
```csharp
internal IServiceScope CreateScope()
{
    if (this._disposed)
      ThrowHelper.ThrowObjectDisposedException();
    return (IServiceScope) new ServiceProviderEngineScope(this, isRootScope:false);
}
```
创建出来的IServiceScope生命周期不是根容器的。

#### IServiceProvider
该接口在控制器中使用的时候，范围是scope的，但是在后台服务中注入的时候，生命周期是单例的，比如
```csharp
public class PingHand2 : INotificationHandler<Ping2>
{
    private readonly ILogger<PingHandler> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IServiceScopeFactory _serviceProviderFactory;

    public PingHand2(ILogger<PingHandler> logger, IServiceProvider serviceProvider, IServiceScopeFactory serviceProviderFactory)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _serviceProviderFactory = serviceProviderFactory;
    }

    public Task Handle(Ping2 notification, CancellationToken cancellationToken)
    {
        var isEqual = _serviceProviderFactory == _serviceProvider.GetService<IServiceScopeFactory>();// True

        return Task.CompletedTask;
    }
}
```
所以下面这个代码不使用IServiceScopeFactory获取也不会报错
```csharp
public class OperationLogHandler : INotificationHandler<AddOperationLogEvent>
{
    private readonly IServiceProvider _serviceProvider;

    public OperationLogHandler(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task Handle(AddOperationLogEvent notification, CancellationToken cancellationToken)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var _httpContextAccessor = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>();
            var _operationLogRepository = scope.ServiceProvider.GetRequiredService<IOperationLogRepository>();

            if (notification is null || !notification.IsValidOperation())
                return;

            //xxx
        }
    }
}
```
IServiceProvider的CreateScope方法实现是Microsoft.Extensions.DependencyInjection.ServiceProviderServiceExtensions的CreateScope
```csharp
public static IServiceScope CreateScope(this IServiceProvider provider) => provider.GetRequiredService<IServiceScopeFactory>().CreateScope();
```
这个CreateScope最后调用的就是IServiceScopeFactory的CreateScope
```csharp
/// <summary>
/// 对比IServiceScopeFactory和IServiceProvider
/// </summary>
public class HostTaskService4 : BackgroundService
{
    private readonly IServiceScopeFactory _serviceProviderFactory;
    private readonly IServiceProvider _serviceProvider;

    public HostTaskService4(IServiceScopeFactory serviceProviderFactory, IServiceProvider serviceProvider)
    {
        _serviceProviderFactory = serviceProviderFactory;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var isEqual = _serviceProviderFactory == _serviceProvider.GetService<IServiceScopeFactory>();// True
    }
}
```
所以在后台任务中IServiceScopeFactory就是根据IServiceProvider获取出来的。

### 控制器异步处理
如果在控制器中想异步处理一些数据操作的代码，比如你注入IServiceProvider来创建Scope，那么会存在问题
```csharp
[ApiController]
[Route("[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly OpenDbContext _baseDbContext;
    private readonly IServiceProvider _serviceProvider; // 这里注入的服务本身是scope的，只在当前请求内有效
    private readonly ILogger<UserController> _logger;

    public UserController(OpenDbContext baseDbContext,
        IServiceProvider serviceProvider,
        ILogger<UserController> logger)
    {
        _baseDbContext = baseDbContext;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    /// <summary>
    /// 测试IServiceProvider释放问题
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<string> GetInfo()
    {
        var user = new User
        {
            Id = 1,
            Name = "李思"
        };
        await _baseDbContext.AddAsync(user);
        await _baseDbContext.SaveChangesAsync();

        var name = await _baseDbContext.Set<User>().Where(t => t.Id == 1).Select(t => t.Name).FirstOrDefaultAsync();
        _logger.LogInformation($"name:{name}");

        /*
         解决方案
         1.就是给Task添加await，等待请求结束之前执行完task
         2.就是从跟容器来创建CreateScope
         */

        _ = Task.Run(async () =>
        {
            try
            {
                // 错误原因解读：当请求然后之后在开始执行CreateScope操作，那么就会因为IServiceProvider被释放掉了所以报错:Cannot access a disposed object.
                await Task.Delay(1000);

                // task创建了新的IServiceScope
                using var scope = _serviceProvider.CreateScope();
                //通过IServiceScope创建具体示例
                var dbContext = scope.ServiceProvider.GetService<OpenDbContext>();
                var info = await dbContext.Set<User>().Where(t => t.Id == 1).FirstOrDefaultAsync();
                _logger.LogInformation($"结束结果  {info.Name}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        });
        return "success";
    }
}
```
因为这个时候IServiceProvider只会在当前请求内有效，请求结束就释放了(这个时候的IServiceProvider实例来自HttpContext.RequestServices实例)
```csharp
[ApiController]
[Route("[controller]/[action]")]
public class UserController : ControllerBase
{
    private readonly OpenDbContext _baseDbContext;
    private readonly IServiceProvider _serviceProvider; // 这里注入的服务本身是scope的，只在当前请求内有效
    private readonly ILogger<UserController> _logger;

    public UserController(OpenDbContext baseDbContext,
        IServiceProvider serviceProvider,
        ILogger<UserController> logger)
    {
        _baseDbContext = baseDbContext;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    /// <summary>
    /// 测试控制器中的_serviceProvider从哪里获取的
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public bool TestEquals()
    {
        // 这里的IServiceProvider是从HttpContext.RequestServices中获取的
        var isEquals = HttpContext.RequestServices == _serviceProvider; //True
        return isEquals;
    }
}
```
所以我们要不就等待处理完操作后再返回结果要不就直接使用IServiceScopeFactory来操作，例如
```csharp
[HttpGet("/fire-and-forget-3")]
public IActionResult FireAndForget3([FromServices]IServiceScopeFactory serviceScopeFactory)
{
    _ = Task.Run(async () =>
    {
        await Task.Delay(1000);

        using (var scope = serviceScopeFactory.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<ContosoDbContext>();
            context.Contoso.Add(new Contoso());
            await context.SaveChangesAsync();                                        
        }
    });

    return Accepted();
}
```
微软的建议是：

- 注入一个IServiceScopeFactory以便在后台工作项中创建一个范围。
- IServiceScopeFactory是一个单例对象。
- 在后台线程中创建一个新的依赖注入范围。
- 不引用控制器中的任何东西。
- 不从传入请求中捕获DbContext。

## 键控服务

在.Net8中增加了键控服务，我们可以通过下面的方式去注入多个实现

```c#
// Program.cs
builder.Services.AddKeyedScoped<IVehicleService, CarService>("car");
builder.Services.AddKeyedScoped<IVehicleService, MotorbikeService>("motorbike");
```

资料：https://www.roundthecode.com/dotnet-tutorials/keyed-services-dotnet-8-dependency-injection-update

## 注册Lazy服务

创建LazilyResolved继承自Lazy
```csharp
public class LazilyResolved<T> : Lazy<T>
{
    public LazilyResolved(IServiceProvider serviceProvider) : base(serviceProvider.GetRequiredService<T>)
    {
    }
}
```
注入服务
```csharp
/// <summary>
/// 注入lazy方案
/// </summary>
/// <param name="services"></param>
/// <returns></returns>
public static IServiceCollection AddLazyResolution(this IServiceCollection services)
{
    return services.AddScoped(typeof(Lazy<>), typeof(LazilyResolved<>));
}
```

## 资料

详解.NET 依赖注入中对象的创建与“销毁”https://www.cnblogs.com/tenleft/p/17766501.html

## 参考文档

> 依赖关系注入：[https://docs.microsoft.com/zh-cn/dotnet/core/extensions/dependency-injection](https://docs.microsoft.com/zh-cn/dotnet/core/extensions/dependency-injection)

