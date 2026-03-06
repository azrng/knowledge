---
title: 自定义配置数据源
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zidingyipeizhishujuyuan
slug: ewhdus
docsId: '51651102'
---
> 本文为学习笔记


## 需求
自定义数据源来扩展我们的配置框架，需要实现 IConfigurationProvider 接口。在实现过程中，需要重写 Load() 方法从数据源加载配置信息，并将其转换为键值对集合。另外，还可以根据需要实现其他方法，如 Set(), TryGet(), 和 GetChildKeys() 等。
步骤：

- 实现IConfigurationSource
- 实现IConfigurationProvider
- 实现AddXXX扩展方法

## 操作
新建一个MyConfigurationSource继承与我们的IConfigurationSource
```csharp
internal class MyConfigurationSource : IConfigurationSource
{
    public IConfigurationProvider Build(IConfigurationBuilder builder)
    {
        return new MyConfigurationProvider();
    }
}
```
> 注：这点是故意定义为internal，不直接暴露该类而去暴露扩展方法

实现IConfigurationProvider
```csharp
public class MyConfigurationProvider : ConfigurationProvider
{
    //用于定时刷新配置的更新
    private readonly Timer _timer;
    public MyConfigurationProvider() : base()
    {
        _timer = new Timer();
        _timer.Elapsed += Timer_Elapsed;
        _timer.Interval = 3000;
        _timer.Start();
    }

    private void Timer_Elapsed(object sender, ElapsedEventArgs ev)
    {
        Load(true);
    }
    public override void Load()
    {
        //加载数据
        Load(false);
    }

    void Load(bool reload)
    {
        //配置的值
        Data["lastTime"] = DateTime.Now.ToString();
        Data["name"] = "zhangsan";

        //可以也可以从其他地方获取配置，比如数据库等

        if (reload)
        {
            base.Load();
        }
    }
}
```
> 通过继承自 ConfigurationProvider 并实现 Load() 方法，我们可以轻松地自定义配置系统的行为，并从任意数据源中加载配置信息

定义暴露出来的扩展方法
```csharp
namespace Microsoft.Extensions.Configuration
{
    public static class MyConfigurationBuilderExtensions
    {
        public static IConfigurationBuilder AddMyConfiguration(this IConfigurationBuilder builder)
        {
            builder.Add(new MyConfigurationSource());
            return builder;
        }
    }
}
```

### 控制台使用
引用组件
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Configuration" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Configuration.Abstractions" Version="5.0.0" />
</ItemGroup>
```
引用上述配置
```csharp
 builder = new ConfigurationBuilder();

//将MyConfigurationSource修改为internal，而去访问扩展方法
//builder.Add(new MyConfigurationSource());
//使用扩展方法
builder.AddMyConfiguration();
var configurationRoot = builder.Build();
Console.WriteLine($"lastTime:{configurationRoot["lastTime"] }");
Console.WriteLine($"Name:{configurationRoot["name"] }");

//监控变更
ChangeToken.OnChange(() => configurationRoot.GetReloadToken(), () =>
{
    Console.WriteLine("变更后");
    Console.WriteLine($"lastTime:{configurationRoot["lastTime"] }");
    Console.WriteLine($"Name:{configurationRoot["name"] }");
});

Console.ReadLine();
```
输出结果
```csharp
lastTime:2021/8/22 19:01:33
Name:zhangsan
变更后
lastTime:2021/8/22 19:01:36
Name:zhangsan
变更后
lastTime:2021/8/22 19:01:40
Name:zhangsan
变更后
lastTime:2021/8/22 19:01:42
Name:zhangsan
变更后
lastTime:2021/8/22 19:01:45
Name:zhangsan
```

### WebAPI使用
修改CreateHostBuilder方法为
```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((_,config)=> {
        //config.Add(new MyConfigurationSource());
        config.AddMyConfiguration();
    })
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });
```
在.Net高版本中使用方法是
```csharp
builder.Configuration.Add(new MyConfigurationSource());
// 或者
builder.Configuration.AddMyConfiguration();
```
在控制器中注入IConfiguration
```csharp
private readonly IConfiguration _configuration;
public WeatherForecastController(IConfiguration configuration)
{
    _configuration = configuration;
}
```
获取配置
```csharp
Console.WriteLine($"lastTime:{_configuration["lastTime"] }");
Console.WriteLine($"Name:{_configuration["name"] }");
```
输出结果
```csharp
lastTime:2021/8/22 19:08:08
Name:zhangsan
```

## 参考资料
极客时间教程
