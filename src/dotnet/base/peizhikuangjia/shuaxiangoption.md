---
title: 选项Option
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shuaxiangoption
slug: ocgez4
docsId: '30192830'
---

## 概述
选项是配置的升级版，一般情况下是把一个范围内的配置包装成类型以供使用，通过选项框架来处理服务和配置的关系
特性

- 支持单例模式读取配置
- 支持快照
- 支持配置变更通知
- 支持运行时动态修改选项的值

选项类别：
`IOption<XXXOptions>`(普通选项)、不会读取到新的值
`IOptionsSnapshot<XXXOptions>`(热更新)、会在同一个范围内保持一致。
`IOptionsMonitor<XXXOption>`（监控选项）

## 操作
> 本文示例代码：vs2022、.Net6


### 基本操作
采用下面的形式把配置类型 实体注入到容器中
```csharp
  "RabbitMQ": {
    "Hosts": [ "**.***.***.**" ],
    "Port": 5672,
    "UserName": "admin",
    "Password": "123456789",
    "VirtualHost": "myQueue"
  }
```
注入容器
```csharp
//startup配置 
services.Configure<RabbitMQConfig>(Configuration.GetSection(RabbitMQConfig.RabbitMQ));
```
使用方法
```csharp
private readonly RabbitMQConfig _rabbitMQConfig;
public WeatherForecastController(IOptions<RabbitMQConfig> options)
{
    _rabbitMQConfig = options.Value;
}
```
程序启动后再修改 JSON 配置文件所做的更改获取不到。 若要读取在应用启动后的更改，请使用 [IOptionsSnapshot](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/configuration/options?view=aspnetcore-5.0#ios)。

### 选项命名
当相同的配置有两组时，选项命名就非常有用了，比如一主一备
```csharp
"RedisSettings": {
    "Main": {
      "Host": "127.0.0.1",
      "Port": 6379,
      "Password": "123",
      "ConnectionTimeOut": "10ms"
    },
    "Prepare": {
      "Host": "127.0.0.1",
      "Port": 6380,
      "Password": "456",
      "ConnectionTimeOut": "12ms"
    }
  }
```
实体类可以用静态常量区分开来
```csharp
public record RedisSetting
{
    public const string Main = "Main";
    public const string Prepare = "Prepare";
    public string? Host { get; set; }
    public int Port { get; set; }
    public string? Password { get; set; }
    public string? ConnectionTimeOut { get; set; }
}
```
分别注入配置即可
```csharp
builder.Services.Configure<RedisSetting>(RedisSetting.Main,
                                   builder.Configuration.GetSection("RedisSettings:Main"));
builder.Services.Configure<RedisSetting>(RedisSetting.Prepare,
                                    builder.Configuration.GetSection("RedisSettings:Prepare"));
```
不过只有IOptionsSnapshot和IOptionsMonitor能通过Get方法来获取命名的配置，IOptions没有实现Get方法
```csharp
app.MapGet("/snapshotredissetting", (IOptionsSnapshot<RedisSetting> options) =>
{
    return options.Get(RedisSetting.Main);
});

app.MapGet("/monitorstart", (IOptionsMonitor<RedisSetting> options) =>
{
    options.OnChange(redisSetting =>
   {
       app.Logger.LogInformation(options.Get(RedisSetting.Main).ToString());
       app.Logger.LogInformation(options.Get(RedisSetting.Prepare).ToString());
   });
    return options.CurrentValue;
});
```

### IOptionsFactory<对象>
使用场景：一个配置类，但是配置类分别存储不同的内容。
注入配置
```json
//注入第一个配置
var con = new Action<RabbitMQConfig>(option =>
{
	option.Password = "aaaa111";
});
services.Configure("name1", con);
//注入第二个配置
var con2 = new Action<RabbitMQConfig>(option =>
{
	option.Password = "aaaa22222";
});
services.Configure("name2", con2);
```
理解：感觉类似于将两个配置放进了一个字典中，这个字典key是字符串，然后value就是对象。
使用
```json
private readonly RabbitMQConfig _rabbitMQConfig;
public WeatherForecastController(IOptionsFactory<RabbitMQConfig> factory)
{
	_rabbitMQConfig = factory.Create("name1");//相当于根据key去字典中找value
}
```

## 选项框架
实现需求：在Service里面读取配置并使用
这里我们新建一个简单的Web API程序，创建UserService服务以及服务选项配置(关于这个叫做选项很迷惑，知识盲区)
```csharp
public interface IUserService
{
    /// <summary>
    /// 获取默认积分
    /// </summary>
    /// <returns></returns>
    int GetDefaultIntegral();
}
public class UserOptions
{
    /// <summary>
    /// 积分
    /// </summary>
    public int Integral { get; set; } = 5;
}
```
并且这里我们给这个积分默认值设置成5，然后控制器中编写接口方法
```csharp
[HttpGet]
public int GetDefaultIntegral()
{
    return _userService.GetDefaultIntegral();
}
```

### 单例注册配置
服务注册
```csharp
//services.AddSingleton<UserOptions>();
services.AddSingleton<UserOptions>((option) => new UserOptions { Integral = 10 });
services.AddTransient<IUserService, UserService>();
```
使用UserOptions
```csharp
public class UserService : IUserService
{
    private readonly UserOptions _userOptions;
    public UserService(UserOptions userOptions)
    {
        _userOptions = userOptions;
    }
    ///<inheritdoc cref="IUserService.GetDefaultIntegral"/>
    public int GetDefaultIntegral()
    {
        return _userOptions.Integral;
    }
}
```
启动项目查看输出结果为10。

### 选项对比
`IOptions<T>`(普通选项)：是单例，所以在配置改变后，我们不能读取到新的值，必须重启程序才能读到新的值。
`IOptionsMonitor<T>`(热更新)：是单例，但是它通过IOptionsChangeTokenSource<> 能够和配置文件一起更新，但是在配置改变后，我们能够读取到新的值
`IOptionsSnapshot<T>`(监控选项)：是范围，所以在配置文件更新的下一次访问(同一个范围内，修改配置文件，获取到的值是不会变化的)，它的值会更新，但是它不能跨范围通过代码的方式更改值，只能在当前范围（请求）内有效。

通俗的说，在一个范围内，如果A、B两处代码都读取了某一个配置项，在运行A之后并且在运行B之前，这个配置项改变了，那么如果我们使用IOptionsMonitor读取配置，在A处我们将会是旧值，在B处我们读取到的是新值；如果我们使用IOptionsSnapshot读取配置，在A处和B处读取到的都是旧值，只有再次进入这个范围才会读取到新值。

由于`IOptions<T>`不监听配置的改变，因此它的资源占用比较少，适用于对服务器启动后就不会改变的值进行读取。由于`IOptionsMonitor<T>`可能会导致同一个请求过程中，配置的改变使读取同一个选项的值不一致，从而导致程序出错，因此如果我们需要在程序运行中读取修改后的值，建议使用`IOptionsSnapshot<T>`。综上所述，`IOptionsSnapshot<T>`更符合大部分场景的需求。


官方文档是这样介绍的：
`IOptionsMonitor<TOptions>`用于检索选项和管理TOptions实例的选项通知，它支持下面的场景：

- 实例更新通知。
- 命名实例。
- 重新加载配置。
- 选择性的让实例失效。

`IOptionsSnapshot<TOptions>`在需要对每个请求重新计算选项的场景中非常有用。
`IOptions<TOptions>`可以用来支持Options模式，但是它不支持前面两者所支持的场景，如果你不需要支持上面的场景，你可以继续使用`IOptions<TOptions>`。
所以你应该根据你的实际使用场景来选择到底是用这三者中的哪一个。
> 一般来说，如果你依赖配置文件，那么首先考虑IOptionsMonitor<>，如果不合适接着考虑IOptionsSnapshot<>，最后考虑IOptions<>。


### IOptions
这里需要引用组件，不过我们是API框架已经帮我们引用好了组件
```csharp
Microsoft.Extensions.Options
```
直接修改UserService进行使用
```csharp
public class UserService : IUserService
{
    private readonly IOptions<UserOptions> _userOptions;
    public UserService(IOptions<UserOptions> userOptions)
    {
        _userOptions = userOptions;
    }
    ///<inheritdoc cref="IUserService.GetDefaultIntegral"/>
    public int GetDefaultIntegral()
    {
        return _userOptions.Value.Integral;
    }
}
```
注册方式也有所改变,通过读取配置文件然后映射到UserOptions类上
```csharp
services.Configure<UserOptions>(Configuration.GetSection("UserOptions"));
services.AddTransient<IUserService, UserService>();
```
配置文件增加如下配置
```json
"UserOptions": {
  "Integral": 10
}
```
启动项目查看结束输出为10。但是我们更新配置里面的值，输出的值并不会热更新。

### IOptionsSnapshot
IOptionsSnapshot不能注入到单例服务里面使用，因为它是scoped的。
如果想实现热更新配置，那么就需要用到IOptionsSnapshot,修改UserService
```csharp
public class UserService : IUserService
{
    private readonly IOptionsSnapshot<UserOptions> _userOptions;
    public UserService(IOptionsSnapshot<UserOptions> userOptions)
    {
        _userOptions = userOptions;
    }

    ///<inheritdoc cref="IUserService.GetDefaultIntegral"/>
    public int GetDefaultIntegral()
    {
        return _userOptions.Value.Integral;
    }
}
```
修改注册方式
```csharp
services.Configure<UserOptions>(Configuration.GetSection("UserOptions"));
services.AddScoped<IUserService, UserService>();
```
启用调用接口我们输出积分为10，这个时候我们修改appsettings.json里面Integral值为100(不需要停止程序)，再次调用接口输出值已经变成100了。

### IOptionsMonitor
如果使用配置的服务是单例的，那么就应该使用IOptionsMonitor进行热更新配置。
修改UserService如下
```csharp
public class UserService : IUserService
{
    private readonly IOptionsMonitor<UserOptions> _userOptions;
    public UserService(IOptionsMonitor<UserOptions> userOptions)
    {
        _userOptions = userOptions;
    }

    ///<inheritdoc cref="IUserService.GetDefaultIntegral"/>
    public int GetDefaultIntegral()
    {
        return _userOptions.CurrentValue.Integral;
    }
}
```
修改注册方式
```csharp
services.Configure<UserOptions>(Configuration.GetSection("UserOptions"));
services.AddSingleton<IUserService, UserService>();
```
启用调用接口我们输出积分为100，这个时候我们修改appsettings.json里面Integral值为1000(不需要停止程序)，再次调用接口输出值已经变成1000了。

我们还可以在单例服务里面监听配置的变更，需要在UserService中修改
```csharp
private readonly IOptionsMonitor<UserOptions> _userOptions;
public UserService(IOptionsMonitor<UserOptions> userOptions)
{
    _userOptions = userOptions;
    _userOptions.OnChange((option) =>
    {
        Console.WriteLine($"积分配置变更为：{option.Integral}");
    });
}
```
当配置文件被修改时候会触发输出

### 代码更新选项
通过`IPostConfigureOptions<TOptions>`进行动态配置对象
需求：在我们读取配置然后在原来的基础上做一些操作
```csharp
services.Configure<UserOptions>(Configuration.GetSection("UserOptions"));
services.PostConfigure<UserOptions>(options =>
{
    options.Integral += 100;
});
services.AddSingleton<IUserService, UserService>();
```
这里实现了读取后再原来基金基础上增加100积分。

### 选项验证

#### 验证方法
三种验证方法

- 直接注册验证函数
- 实现`IValidateOptions<TOpions>`
- 使用Microsoft.Extensions.Options.DateAnnotations

##### Validate
```csharp
services.AddOptions<UserOptions>().Configure(options =>
{
    Configuration.Bind(options);
}).Validate(options =>
{
    //如果积分小于等于100属于符合条件
    return options.Integral <= 100;
}, "积分不能大于100");//不符合条件提示的错误信息
services.AddSingleton<IUserService, UserService>();
```

##### ValidateDataAnnotations
```csharp
services.AddOptions<UserOptions>().Configure(options =>
{
    Configuration.Bind(options);
}).ValidateDataAnnotations();
services.AddSingleton<IUserService, UserService>();
```
然后修改UserOptions
```csharp
/// <summary>
/// 积分
/// </summary>
[Range(1, 100,ErrorMessage ="积分最大为100")]
public int Integral { get; set; } = 5;
```

##### 编写UserOptionsValidateOptions
编写UserOptionsValidateOptions继承自：`IValidateOptions<UserOptions>`
```csharp
public class UserOptionsValidateOptions : IValidateOptions<UserOptions>
{
    public ValidateOptionsResult Validate(string name, UserOptions options)
    {
        if (options.Integral > 100)
        {
            return ValidateOptionsResult.Fail("积分不能大于100!");
        }
        else {
            return ValidateOptionsResult.Success;
        }
    }
}
```
然后在修改注册方法
```csharp
services.AddOptions<UserOptions>().Configure(options =>
{
    Configuration.Bind(options);
});
services.AddSingleton<IValidateOptions<UserOptions>, UserOptionsValidateOptions>();

services.AddSingleton<IUserService, UserService>();
```
如果配置的积分大于100就会报错。

#### 验证时机
默认情况下，如果你加了验证的配置，那么会在获取配置值的时候进行验证，但是我们可以通过下面的代码来实现在在项目启动的时候就进行验证
```csharp
services.AddOptions<MinioConfig>()
        .Bind(Configuration.GetSection("Minio"))
        .ValidateOnStart();
```

