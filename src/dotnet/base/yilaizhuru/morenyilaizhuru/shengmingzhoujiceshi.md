---
title: 生命周期测试
lang: zh-CN
date: 2022-10-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shengmingzhoujiceshi
slug: odso5f
docsId: '51579914'
---

## 介绍
- 依赖注入只负责由其创建的对象实例
- 容器或者子容器释放的时候，会释放由其创建的对象实例。

推荐使用容器来来管理我们的对象的创建和释放。

| **--** | **---** | **---** | **---** |
| --- | --- | --- | --- |
| Singleton | 单例 | 服务容器首次请求会创建，后续都使用同一实例 | AddSingleton |
| Scoped | 特定范围 | 在一个请求(连接)时被创建一次实例，生命周期横贯整次请求 | AddScoped |
| Transient | 瞬时 | 服务容器每次请求，都会创建一个实例，适合轻量级、无状态服务 | AddTransient |


## 操作
为了演示，我们创建一个UserService，并让该Service继承IDisposable
```csharp
public class UserService : IUserService, IDisposable
{
    public int Sum(int x, int y)
    {
        return x + y;
    }

    public void Dispose()
    {
        Console.WriteLine($"UserService服务被释放  {this.GetHashCode()}");
    }
}
public interface IUserService
{
    int Sum(int x, int y);
}
```
在控制器中我们通过FromServices去注入IUserService
```csharp
[HttpGet]
public string Get([FromServices] IUserService userService, [FromServices] IUserService userService2)
{
    Console.WriteLine($"当前创建的UserService  {userService.GetHashCode()}");
    Console.WriteLine($"当前创建的UserService2  {userService2.GetHashCode()}");

    //为当前请求创建一个子容器,一次请求会创建一次
    using (var scope = HttpContext.RequestServices.CreateScope())
    {
        var service = scope.ServiceProvider.GetRequiredService<IUserService>();
        Console.WriteLine($"子容器创建的UserService  {service.GetHashCode()}");

        Console.WriteLine($"子容器创建的UserService处理完毕");
    }

    Console.WriteLine("接口处理完毕 ");
    return DateTime.Now.ToString();
}
```

### 瞬时生命周期
现在我们将刚才的服务注册为瞬时生命周期
```csharp
services.AddTransient<IUserService, UserService>();
```
运行查看对象释放的时机,输出结果
```csharp
// 第一次请求结束
当前创建的UserService  35827753
当前创建的UserService2  4419630
子容器创建的UserService  40124269
子容器创建的UserService处理完毕
UserService服务被释放  40124269
接口处理完毕
UserService服务被释放  4419630
UserService服务被释放  35827753
    
// 第二次请求结束       
当前创建的UserService  17653682
当前创建的UserService2  42194754
子容器创建的UserService  15688314
子容器创建的UserService处理完毕
UserService服务被释放  15688314
接口处理完毕
UserService服务被释放  42194754
UserService服务被释放  17653682
```
通过结果可以得出结论，瞬时生命周期对象的释放在这次请求结束的时候释放，并且一次请求可能产生多次实例，多次请求产生多次实例。

但是如果我们是在跟容器进行获取的瞬时服务，那么它就不是请求结束的时候释放了。
ConfigureServices中注册
```csharp
services.AddTransient<IUserService,UserService>();
```
Configure中配置
```csharp
var servise = app.ApplicationServices.GetService<IUserService>();
Console.WriteLine(servise.Sum(1, 2));
```
会在项目启动的时候进行输出，中间调用接口并不会释放服务,当程序关闭的时候释放服务
```csharp
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
UserService服务被释放  30995104
```

### 范围生命周期
现在我们将刚才的服务注册为范围生命周期
```csharp
services.AddScoped<IUserService, UserService>();
// 或者
services.AddTransient<IUserService>(p => new UserService());
```
运行查看对象释放的时机，输出结果
```csharp
// 第一次请求结束
当前创建的UserService  43182754
当前创建的UserService2  43182754
子容器创建的UserService  49229074
子容器创建的UserService处理完毕
UserService服务被释放  49229074
接口处理完毕
UserService服务被释放  43182754
    
// 第二次请求结束    
当前创建的UserService  28952583
当前创建的UserService2  28952583
子容器创建的UserService  51571199
子容器创建的UserService处理完毕
UserService服务被释放  51571199
接口处理完毕
UserService服务被释放  28952583
```
通过结果可以得出结论，范围生命周期对象的释放在这次请求结束的时候释放，并且一次请求内只产生一次实例，多次请求产生多次实例。

### 单例生命周期
现在我们将刚才的服务注册为范围生命周期
```csharp
services.AddSingleton<IUserService, UserService>();
```
运行查看对象释放的时机，输出结果
```csharp
// 第一次接口请求结束
当前创建的UserService  26224738
当前创建的UserService2  26224738
子容器创建的UserService  26224738
子容器创建的UserService处理完毕

// 第二次
接口处理完毕
当前创建的UserService  26224738
当前创建的UserService2  26224738
子容器创建的UserService  26224738
子容器创建的UserService处理完毕
接口处理完毕

// 当Ctrl+C关闭程序
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
UserService服务被释放  13588007
```
通过结果可以得出结论，单例生命周期对象的释放在程序停止运行的时候释放，并且多次请求只产生一次相同的实例。

当服务是我们自己创建的然后再次测试
```csharp
var userService = new UserService();
services.AddSingleton<IUserService>(userService);
```
> 只有单例模式下支持该方式，可能故意限制的

输出结果
```csharp
// 第一次请求
当前创建的UserService  62006733
当前创建的UserService2  62006733
子容器创建的UserService  62006733
子容器创建的UserService处理完毕
接口处理完毕

// 第二次请求
当前创建的UserService  62006733
当前创建的UserService2  62006733
子容器创建的UserService  62006733
子容器创建的UserService处理完毕
接口处理完毕

//关闭程序
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
```
通过结果得出结论，我们自己创建的实例，并不通过容器管理，也就是说不会自己释放。
