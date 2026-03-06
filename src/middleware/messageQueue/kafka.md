---
title: Kafka
lang: zh-CN
date: 2023-07-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: kafka
slug: otplne
docsId: '29411648'
---

## 描述
是一个开源的、分布式、可扩展的、高性能的发布订阅模式的消息中间件。

## 架构
![](/common/1615282098271-a59d460c-3027-4fda-bf31-4bab916b0e04.png)

## 简单例子
> 安装组件：Install-Package kafka-net

```csharp
//构建生产者
        static void Main(string[] args)
        {
            string payload ="Welcome to Kafka!";
            string topic ="IDGTestTopic";
            Message msg = new Message(payload);
            Uri uri = new Uri("http://localhost:9092");
            var options = new KafkaOptions(uri);
            var router = new BrokerRouter(options);
            var client = new Producer(router);
            client.SendMessageAsync(topic, new List<Message> { msg }).Wait();
            Console.ReadLine();
        }

//构建消费者
        static void Main(string[] args)
        {
            string topic ="IDGTestTopic";
            Uri uri = new Uri("http://localhost:9092");
            var options = new KafkaOptions(uri);
            var router = new BrokerRouter(options);
            var consumer = new Consumer(new ConsumerOptions(topic, router));
            foreach (var message in consumer.Consume())
            {
                Console.WriteLine(Encoding.UTF8.GetString(message.Value));
            }
            Console.ReadLine();
        }
```

## 文章
[https://www.cnblogs.com/whuanle/p/17069128.html](https://www.cnblogs.com/whuanle/p/17069128.html) | 1.5万字长文：从 C## 入门 Kafka - 痴者工良 - 博客园
从 C## 入门 Kafka：[https://kafka.whuanle.cn](https://kafka.whuanle.cn)
[https://www.cnblogs.com/hsxian/p/12907542.html](https://www.cnblogs.com/hsxian/p/12907542.html) | .Net(c#)使用 Kafka 小结 - 麦比乌斯皇 - 博客园
