---
title: RabbitMQ消息可靠性分析和应用
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: rabbitmqxiaoxikekaoxingfenxiheyingyong
slug: yb3lfs
docsId: '29412195'
---
**RabbitMQ流程简介（带Exchange）**
       RabbitMQ使用一些机制来保证可靠性，如持久化、消费确认及发布确认等。
       先看以下这个图：
![image.png](/common/1609400243138-0d995cac-4498-4c03-a0a1-151e3a3dfdd0.png)
        P为生产者，X为中转站（Exchange），红色部分为消息队列，C1、C2为消费者。
       整个流程分成三部分：第一，生产者生产消息，发送到中转站；第二，中转站按定义的规则转发消息到消息队列；第三，消费者从消息队列获取消息进行消费（处理）。
**RabbitMQ消息可靠性分析和应用**
       应用代码均使用C#客户端代码实现。
**一、发布确认**
       生产者生产消息，发送到中转站的过程中，可能会因为网络丢包、网络故障等问题造成消息丢失。为了确保生产者发送的消息不会丢失，RabbitMQ提供了发布确认（Publisher Confirms）机制，从而提高消息的可靠性（注意：发布确认机制不能和事务机制一起使用）。
**       单条消息发布确认：**
      channel.ConfirmSelect();//发布确认机制
                string message = "msg";
                var body = Encoding.UTF8.GetBytes(message);
               channel.BasicPublish(
                        exchange: "MarkTopicChange",
                        routingKey: "MarkRouteKey.one",
                        basicProperties: null,
                        body: body
                        );
                bool isPublished = channel.WaitForConfirms();//通道（channel）里消息发送成功返回true
![image.gif](/common/1609400243132-e36d5f75-f697-4fd9-b953-dcac59c07e29.gif)
 
       使用channel.ConfirmSelect，一旦信道进入确认模式，所有在该信道上面发布的消息都会被指派一个唯一的ID（从1开始）。消息被投递到所有匹配的队列之后，RabbitMQ就会发送（Basic.Ack）给生产者（包含消息的唯一ID），生产者从而知道消息发送成功。
**       多条消息发布确认：**
![image.gif](/common/1609400243178-c3424240-5b6a-426c-94e7-7b07d4fc4c84.gif)
  channel.ConfirmSelect();//发布确认机制
                foreach (var itemMsg in lstMsg)
                {
                    byte[] sendBytes = Encoding.UTF8.GetBytes(itemMsg);
                    //发布消息
                   channel.BasicPublish(
                        exchange: "MarkTopicChange",
                        routingKey: "MarkRouteKey.one",
                        basicProperties: null,
                        body: sendBytes
                        );
                }
                bool isAllPublished = channel.WaitForConfirms();//通道（channel）里所有消息均发送才返回true
![image.gif](/common/1609400243127-262fc79a-4c12-471c-82b3-d86fb77b6423.gif)
   
       注意：多消息发布确认机制情况下，倘若要发送100条消息，发送90条后，突然网络故障，后面的消息发送失败了，那么isAllPublished返回的是false，而前面90条消息已经发送到消息队列了。我们还不知道哪些消息是发送失败的，所以很多条消息发布确认，建议分几次发送或多通道发送。
       此外，需要确保在中转站（Exchange）的消息可以顺利到达消息队列。
       （1）首先需要定义匹配的Exchange和Queue，根据Exchange的类型和routingKey确定转发的关系。
       （2）确保消息队列有足够内存存储消息。
       RabbitMQ默认配置vm_memory_high_watermark为0.4。意思是控制消息占40%内存左右。vm_memory_high_watermark_paging_ratio为0.5，当消息占用内存超过50%，RabbitMQ会把消息转移到磁盘上以释放内存。当磁盘剩余空间小于阀值disk_free_limit（默认为50M），所有生产者阻塞，避免充满磁盘，导致所有的写操作失败。
       RabbitMQ配置文件一般在%APPDATA%\RabbitMQ\rabbitmq.config.
       %APPDATA% 一般为 C:\Users\%USERNAME%\AppData\Roaming（Windows环境）
**二、持久化**
       消息存放到消息队列后，在不配置消息持久化的情况下，若服务器重启、关闭或宕机等，消息都会丢失。配置持久化可以有效提高消息的可靠性。持久化需要同时配置消息持久化和队列持久化。单配置消息持久化，队列消失了，消息没有地方存放；单配置队列持久化，队列还在，消息没了。
       队列持久化在定义队列时候配置
                //定义队列
               channel.QueueDeclare(
                    queue: "Mark_Queue", //队列名称
                    durable: true, //队列磁盘持久化                  
                    exclusive: false,//是否排他的，false。如果一个队列声明为排他队列，该队列首次声明它的连接可见，并在连接断开时自动删除
                    autoDelete: false,//是否自动删除，一般设成false
                    arguments: null
                    );
![image.gif](/common/1609400243149-6462b212-d0c2-4784-81ad-03e214a3b676.gif)
消息持久化在发布消息时候配置
![image.gif](/common/1609400243134-9bedb472-37e4-4d09-8dc0-a05ea25323ca.gif)
                //消息持久化，把DeliveryMode设成2
                IBasicProperties properties = channel.CreateBasicProperties();
                properties.DeliveryMode = 2;
                    //发布消息
                   channel.BasicPublish(
                        exchange: "MarkTopicChange",
                        routingKey: "MarkRouteKey.one",
                        basicProperties: properties,
                        body: sendBytes
                        );
![image.gif](/common/1609400243137-574d78ca-f4ce-4962-9b04-2d693ec77c32.gif)
       如何配置了事务机制或发布确认（publisher confirm）机制，服务端的返回Basic.Ack是在消息落盘之后执行的，进一步的提高了消息的可靠性。
       为了防止磁盘损坏带来的消息丢失，可以配置镜像队列，这里不作介绍。
**三、消费确认**
       为了确保消息被消费者消费，RabbitMQ提供消费确认模式（consumer Acknowledgements）。自动确认模式，当消费者**成功接收到**消息后，自动通知RabbitMQ，把消息队列中相应消息删除。这很大程度上满足不了我们，假如消费者接收到消息后，服务器宕机，消息还没处理完成，这样就会造成消息丢失。手动确认模式，当消费者**成功处理完**消息后，手动发消息通知RabbitMQ，把消息队列中相应消息删除。
                    consumer.Received += (model, ea) =>
                    {
                        var body = ea.Body;
                        var message = Encoding.UTF8.GetString(body);
                        var routingKey = ea.RoutingKey;
                       Console.WriteLine(" [x] Received '{0}':'{1}'",
                                         routingKey,
                                         message);
//确认该消息已被消费,发删除消息给RabbitMQ，把消息队列中的消息删除 
                   channel.BasicAck(ea.DeliveryTag, false);
                    //消费消息失败，拒绝此消息，重回队列，让它可以继续发送到其他消费者 
                   //channel.BasicReject(ea.DeliveryTag, true);
                    //消费消息失败，拒绝多条消息，重回队列，让它们可以继续发送到其他消费者 
                   //channel.BasicNack(ea.DeliveryTag, true, true);
                    };
                    //手动确认消息，把autoAck设成false
                   channel.BasicConsume(queue: "Mark_Queue",
                                        autoAck: false,
       这里值得注意的是，消息处理完成后，一定要把处理完成的消息发送到RabbitMQ（channel.BasicAck(ea.DeliveryTag, false)），不然RabbitMQ会一直等待，从而造成内存泄露。若处理消息过程中发生异常，可以使用channel.BasicReject(ea.DeliveryTag, true)来拒绝此消息，让它重回队列。若RabbitMQ收不到消费者任何确认消息的信号（包括确认信号，拒绝信号灯），直到此消费者断开连接，消息才能重回队列，继续发送到其他消费者。
       提醒一下，假如消费者消费消息的方法不支持并发（取决于需求），可以限制消费者每次只接收一条消息。
channel.BasicQos(0, 1, false);
