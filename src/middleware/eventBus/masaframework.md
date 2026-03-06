---
title: MasaFramework
lang: zh-CN
date: 2023-03-04
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: masaframework
slug: cytg2zs2i5tycueb
docsId: '116716629'
---

## 概述
支持进程内和进程外事件总线。

## 优点

- 模块解耦
   - 模块间没有强依赖关系
   - 可在任意位置发送事件
- 支持AOP
   - 一种装配到事件管道以处理事件请求和响应的技术
- 支持Saga
   - 一种业务补偿模式，将一个请求处理程序划分为不同的步骤执行
- Handler支持编排
   - 事件的处理程序可以分成不同的步骤按顺序有序执行
- 自动提交、错误回滚
   - 结合UnitOfWork支持自动提交、错误回滚等。
   - 操作成功后，框架自动保存
   - 操作失败后，框架自动回滚
- 提供跨进程事件总线
   - 不需要我们自己对接RabbitMq、Kafka等消息队列

## 操作
安装nuget包
```
<PackageReference Include="Masa.Contrib.Dispatcher.Events" Version="0.6.0" />
```

### 快速上手
创建API项目，然后注册服务
```
builder.Services.AddEventBus();
```
创建注册事件类
```csharp
/// <summary>
/// 注册事件类
/// </summary>
public record RegisterUserEvent : Event
{
    public string Account { get; set; }

    public string UserName { get; set; }
}
```
创建处理程序
```csharp
public class UserHanlder
{
    private readonly ILogger<UserHanlder> _logger;

    public UserHanlder(ILogger<UserHanlder> logger = null)
    {
        //todo: 根据需要可在构造函数中注入其它服务 (需支持从DI获取)
        _logger = logger;
    }

    [EventHandler(1)] // 1为接收的顺序
    public void RegisterUser(RegisterUserEvent @event)
    {
        _logger.LogInformation($"注册用户成功，用户名为：{@event.UserName}");
    }

    [EventHandler(2)]
    public void SendSms(RegisterUserEvent @event)
    {
        _logger.LogInformation($"注册用户成功，发送短信用户名为：{@event.UserName}");
    }
}
```
发送事件
```csharp
[ApiController]
[Route("[controller]")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public async Task<int> GetConfig([FromServices] IEventBus eventBus)
    {
        await eventBus.PublishAsync(new RegisterUserEvent { Account = "admin", UserName = "张三" });
        return 1;
    }
}
```
然后两个处理程序就会接收到请求进行处理。

## 参考资料
文档：[https://docs.masastack.com/framework/building-blocks/dispatcher/overview](https://docs.masastack.com/framework/building-blocks/dispatcher/overview)
