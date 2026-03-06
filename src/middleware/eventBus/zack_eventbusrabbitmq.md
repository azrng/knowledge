---
title: Zack.EventBusRabbitMq
lang: zh-CN
date: 2023-10-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: zack_eventbusrabbitmq
slug: bi6dgrs2o1r0zlku
docsId: '137493150'
---

## 概述
该包是杨中科老师基于开源项目改造的一个基于rabbitmq的的事件总线封装包

仓库地址：[https://github.com/yangzhongke/NETBookMaterials/tree/main/%E6%9C%80%E5%90%8E%E5%A4%A7%E9%A1%B9%E7%9B%AE%E4%BB%A3%E7%A0%81/YouZack-VNext/Zack.EventBus](https://github.com/yangzhongke/NETBookMaterials/tree/main/%E6%9C%80%E5%90%8E%E5%A4%A7%E9%A1%B9%E7%9B%AE%E4%BB%A3%E7%A0%81/YouZack-VNext/Zack.EventBus)

## 逻辑
一个服务对应一个交换机，如果也是作为消费端使用，那么也对应一个队列(如果一个服务内有多个消费的地方，然后只是这个队列接收到消息后在分别去执行多个消费的地方)

## 操作
安装nuget包
```csharp
<PackageReference Include="Zack.EventBus" Version="1.1.3" />
```

### 基础使用
注入服务
```csharp
// 一个服务对应一个交换机 并且也是一个队列

builder.Services.Configure<IntegrationEventRabbitMQOptions>(options =>
{
    options.HostName = "localhost";
    options.ExchangeName = "aa";
    options.UserName = "admin";
    options.Password = "123456";
});

// 将一个队列内的消息交给多个地方触发
builder.Services.AddEventBus("queue-a", Assembly.GetExecutingAssembly());
```
使用服务
```csharp
app.UseEventBus();
```


然后就可以在需要使用的地方去注入IEventBus进行使用了，比如我们发送一个事件
```csharp
_eventBus.Publish("test", Guid.NewGuid());
```

然后在当前项目中设置消费的地方
```csharp
[EventName("test")]
public class EventHandler1 : IIntegrationEventHandler
{
    public async Task Handle(string eventName, string eventData)
    {
        await Task.Delay(100);
        Console.WriteLine($"A 收到消息 内容为：{eventData}");
    }
}

[EventName("test")]
public class EventHandler2 : IIntegrationEventHandler
{
    public async Task Handle(string eventName, string eventData)
    {
        await Task.Delay(100);
        Console.WriteLine($"B 收到消息 内容为：{eventData}");
    }
}
```

那么在我们启动项目发送事件后，消费的代码就会收到消息并进行消费


## 总结
该nuget包是一个基于rabbitmq的事件总线实现，里面包含了消息确认，但是没有包含重试等操作。
