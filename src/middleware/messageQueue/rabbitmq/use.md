---
title: 使用
lang: zh-CN
date: 2023-09-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: kongzhiqishiyongrabbitmq
slug: oode3o
docsId: '29412234'
---
## 控制台消费消息

发送消息

```csharp
//Send.cs 
public static void Main(string[] args)
{
    //1.1.实例化连接工厂
    var factory = new ConnectionFactory() { HostName = "localhost" };
    //2. 建立连接
    using (var connection = factory.CreateConnection())
    {
        //3. 创建信道
        using (var channel = connection.CreateModel())
        {
            //4. 申明队列
            channel.QueueDeclare(queue: "hello", durable: false, exclusive: false, autoDelete: false, arguments: null);
            //5. 构建byte消息数据包
            string message = args.Length > 0 ? args[0] : "Hello RabbitMQ!";
            var body = Encoding.UTF8.GetBytes(message);
            //6. 发送数据包
            channel.BasicPublish(exchange: "", routingKey: "hello", basicProperties: null, body: body);
            Console.WriteLine(" [x] Sent {0}", message);
        }
    }
}
```
 接收消息
```csharp
 
//Receive.cs  省略部分代码
public static void Main()
{
    //1.实例化连接工厂
    var factory = new ConnectionFactory() { HostName = "localhost" };
    //2. 建立连接
    using (var connection = factory.CreateConnection())
    {
        //3. 创建信道
        using (var channel = connection.CreateModel())
        {
            //4. 申明队列
            channel.QueueDeclare(queue: "hello", durable: false, exclusive: false, autoDelete: false, arguments: null);
            //5. 构造消费者实例
            var consumer = new EventingBasicConsumer(channel);
            //6. 绑定消息接收后的事件委托
            consumer.Received += (model, ea) =>
            {
                var message = Encoding.UTF8.GetString(ea.Body);
                Console.WriteLine(" [x] Received {0}", message);
                Thread.Sleep(6000);//模拟耗时
                Console.WriteLine (" [x] Done");
            };
            //7. 启动消费者
            channel.BasicConsume(queue: "hello", autoAck: true, consumer: consumer);
            Console.WriteLine(" Press [enter] to exit.");
            Console.ReadLine();
        }
    }
}
 
```


颜圣杰：[https://www.cnblogs.com/sheng-jie/p/7192690.html](https://www.cnblogs.com/sheng-jie/p/7192690.html)

## 日志记录

生产者

```csharp
services.AddRabbitLogger(options => //添加日志相关的服务，数据以json形式发送到rabbitmq中
        {
            options.Hosts = hosts;
            options.Password = password;
            options.Port = port;
            options.UserName = userName;
            options.VirtualHost = virtualHost;

            options.Arguments = arguments;
            options.Durable = true;
            options.AutoDelete = true;

            options.Category = "Home";
            options.MinLevel = LogLevel.Warning;

            //队列模式
            options.Queue = "queue.logger";

            //交换机模式
            //options.Exchange = "exchange.logger"; 
            //options.RouteQueues = new RouteQueue[] { new RouteQueue() { Queue = "queue.logger", Route = "#" } };
            //options.Type = RabbitExchangeType.Topic;
        });
```

消费者

```csharp
            services.AddRabbitConsumer(options =>
            {
                options.Hosts = hosts;
                options.Password = password;
                options.Port = port;
                options.UserName = userName;
                options.VirtualHost = virtualHost;

                options.Arguments = arguments;
                options.Durable = true;
                options.AutoDelete = true;

                //options.AutoAck = true;
                //options.FetchCount = 10;
                //options.RouteQueues = new RouteQueue[] { new RouteQueue() { Queue = "queue.logger", Route = "#" } };//交换机模式
                //options.Type = RabbitExchangeType.Topic;//交换机模式
            })

            //.AddListener("queue.logger", result =>
            //{
            //    Console.WriteLine("Message From queue.logger:" + result.Body);
            //});

            .AddListener<RabbitConsumerListener>("queue.logger");
```

