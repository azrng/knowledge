---
title: RabbitMQ延迟队列
lang: zh-CN
date: 2022-07-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: rabbitmqyanchiduilie
slug: vpa9xu
docsId: '82140527'
---

## 场景
比如用户下单，多久之后未支付取消订单等延迟处理的场景。

## 操作
Rabbitmq版本：3.10.5  Erlang版本：24.3.4.2
> 下面的例子没有进行封装，所以代码仅供参考


### 安装插件
要使用rabbitmq做延迟是需要安装插件(rabbitmq_delayed_message_exchange)的，下载地址：[https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)
将下载好的插件(d:/Download/rabbitmq_delayed_message_exchange-3.10.2.ez)映射到容器的plugins目录下：
```csharp
docker run -d --name myrabbit -p 9005:15672 -p 5672:5672  -e RABBITMQ_DEFAULT_VHOST=customer -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=123456 -v d:/Download/rabbitmq_delayed_message_exchange-3.10.2.ez:/plugins/rabbitmq_delayed_message_exchange-3.10.2.ez  rabbitmq:3-management-alpine
```
进入容器
```csharp
docker exec -it 容器名称/标识 bash
```
启用插件
```csharp
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```
查看是否启用
```csharp
rabbitmq-plugins list
```
[E*]和[e*]表示启用，然后重启服务
```csharp
rabbitmq-server restart
```
然后在管理界面添加交换机都可以看到
![image.png](/common/1656758867110-653eb9da-9018-4546-9376-4c0d06f9197d.png)

### 生产消息
```csharp
[HttpGet("send/delay")]
public string SendDelayedMessage()
{
    var factory = new ConnectionFactory()
    {
        HostName = "localhost",//IP地址
        Port = 5672,//端口号
        UserName = "admin",//用户账号
        Password = "123456",//用户密码
        VirtualHost = "customer"
    };
    using var connection = factory.CreateConnection();
    using var channel = connection.CreateModel();

    var exchangeName = "delay-exchange";
    var routingkey = "delay.delay";
    var queueName = "delay_queueName";

    //设置Exchange队列类型
    var argMaps = new Dictionary<string, object>()
    {
        {"x-delayed-type", "topic"}
    };
    //设置当前消息为延时队列
    channel.ExchangeDeclare(exchange: exchangeName, type: "x-delayed-message", true, false, argMaps);
    channel.QueueDeclare(queueName, true, false, false, argMaps);
    channel.QueueBind(queueName, exchangeName, routingkey);

    var time = 1000 * 5;
    var message = $"发送时间为 {DateTime.Now:yyyy-MM-dd HH:mm:ss} 延时时间为:{time}";
    var body = Encoding.UTF8.GetBytes(message);
    var props = channel.CreateBasicProperties();
    //设置消息的过期时间
    props.Headers = new Dictionary<string, object>()
            {
                {  "x-delay", time }
            };
    channel.BasicPublish(exchange: exchangeName, routingKey: routingkey, basicProperties: props, body: body);
    Console.WriteLine("成功发送消息:" + message);

    return "success";
}
```

### 消费消息
消费消息我是弄了一个后台任务(RabbitmqDelayedHostService)在处理
```csharp
public class RabbitmqDelayedHostService : BackgroundService
{
    private readonly IModel _channel;
    private readonly IConnection _connection;

    public RabbitmqDelayedHostService()
    {
        var connFactory = new ConnectionFactory//创建连接工厂对象
        {
            HostName = "localhost",//IP地址
            Port = 5672,//端口号
            UserName = "admin",//用户账号
            Password = "123456",//用户密码
            VirtualHost = "customer"
        };
        _connection = connFactory.CreateConnection();
        _channel = _connection.CreateModel();

        //交换机名称
        var exchangeName = "exchangeDelayed";
        var queueName = "delay_queueName";
        var routingkey = "delay.delay";
        var argMaps = new Dictionary<string, object>()
        {
            {"x-delayed-type", "topic"}
        };
        _channel.ExchangeDeclare(exchange: exchangeName, type: "x-delayed-message", true, false, argMaps);
        _channel.QueueDeclare(queueName, true, false, false, argMaps);
        _channel.QueueBind(queue: queueName, exchange: exchangeName, routingKey: routingkey);
        //声明为手动确认
        _channel.BasicQos(0, 1, false);
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var queueName = "delay_queueName";

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += (model, ea) =>
        {
            var message = Encoding.UTF8.GetString(ea.Body.ToArray());
            var routingKey = ea.RoutingKey;
            Console.WriteLine($"接受到消息的时间为 {DateTime.Now:yyyy-MM-dd HH:mm:ss},routingKey:{routingKey} message:{message} ");

            //手动确认
            _channel.BasicAck(ea.DeliveryTag, true);
        };
        _channel.BasicConsume(queue: queueName, autoAck: false, consumer: consumer);

        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _connection.Dispose();
        _channel.Dispose();
        base.Dispose();
    }
}
```
注册该后台任务
```csharp
services.AddHostedService<RabbitmqDelayedHostService>();
```
输出结果
成功发送消息:发送时间为 2022-07-02 18:54:22 延时时间为:5000
成功发送消息:发送时间为 2022-07-02 18:54:22 延时时间为:5000
成功发送消息:发送时间为 2022-07-02 18:54:22 延时时间为:5000
成功发送消息:发送时间为 2022-07-02 18:54:23 延时时间为:5000
成功发送消息:发送时间为 2022-07-02 18:54:23 延时时间为:5000
成功发送消息:发送时间为 2022-07-02 18:54:23 延时时间为:5000
接受到消息的时间为 2022-07-02 18:54:27,routingKey:delay.delay message:发送时间为 2022-07-02 18:54:22 延时时间为:5000
接受到消息的时间为 2022-07-02 18:54:27,routingKey:delay.delay message:发送时间为 2022-07-02 18:54:22 延时时间为:5000
接受到消息的时间为 2022-07-02 18:54:27,routingKey:delay.delay message:发送时间为 2022-07-02 18:54:22 延时时间为:5000
接受到消息的时间为 2022-07-02 18:54:28,routingKey:delay.delay message:发送时间为 2022-07-02 18:54:23 延时时间为:5000
接受到消息的时间为 2022-07-02 18:54:28,routingKey:delay.delay message:发送时间为 2022-07-02 18:54:23 延时时间为:5000
接受到消息的时间为 2022-07-02 18:54:28,routingKey:delay.delay message:发送时间为 2022-07-02 18:54:23 延时时间为:5000

## 资料
官网插件：[https://blog.rabbitmq.com/posts/2015/04/scheduling-messages-with-rabbitmq](https://blog.rabbitmq.com/posts/2015/04/scheduling-messages-with-rabbitmq)

