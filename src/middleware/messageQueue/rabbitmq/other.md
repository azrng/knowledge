---
title: 其他
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: xiaoxiquerenmoshi
slug: qn9vku
docsId: '29445940'
---

## 持久化

```c#
channel.QueueDeclare(queue: "task_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
```

设置是否持久化，如果设置为false，那么关闭服务再打开服务，那么队列会消息，如果设置了持久化，那么关闭服务开启服务，甚至电脑关机该队列都存在。

## 消息确认模式

### 自动确认

只要消息从队列中取出，无论消费者获取到消息后是否成功消费，都认为是消息成功消费。

### 手动确认
消息从队列中获取到消息后，服务器会将该消息处于不可用状态，等待消费者反馈
修改消息确认模式改为手动即可
```csharp
consumer.Received += (model, ea) =>
{
    Thread.Sleep(1000);//等待1秒,
    byte[] message = ea.Body;//接收到的消息
    Console.WriteLine("接收到信息为:" + Encoding.UTF8.GetString(message));
    //返回消息确认
    channel.BasicAck(ea.DeliveryTag, true);
};
//消费者开启监听
//将autoAck设置false 关闭自动确认
channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);
```

## 限制循环消费

限制循环消费：https://mp.weixin.qq.com/s/x6CdKe10YTYt3frBEFy9ow
