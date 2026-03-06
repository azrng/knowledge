---
title: 分布式事务-最终一致性Cap
lang: zh-CN
date: 2022-10-30
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fenbushishiwu-zuizhongyizhixingcap
slug: ei8ymy
docsId: '29412042'
---

## 介绍
可以实现非实时、异步场景下的最终一致性分布式事务。

## 操作
首先需要引用的组件：
基础组件：DotNetCore.CAP.RabbitMQ
不同的数据库再使用不同的数据库组件
DotNetCore.CAP.MySql
DotNetCore.CAP.SqlServer
DotNetCore.CAP.PostgreSql
DotNetCore.CAP.MongoDB
Cap支持mssql，postgresql，mysql，mongodb用户存储操作记录
 
 
 
appsettings.json中进行配置参数
```csharp
"CAP": {
    "DefaultGroup": "队列名称",
    "RabbitMQ": {
      "HostName": "请求地址",
      "VirtualHost": "myQueue",
      "UserName": "登录名",
      "Password": "登录密码"
    }
  }
```
然后在startup配置
```csharp
services.AddCap(x =>
            {
               x.UseMySql(Configuration["DbConfig:MQConnectionString"]);
                x.DefaultGroup = Configuration["CAP:DefaultGroup"];
                x.UseRabbitMQ(mqOptions =>
                {
                    mqOptions.HostName = Configuration["CAP:RabbitMQ:HostName"];
                    mqOptions.UserName = Configuration["CAP:RabbitMQ:UserName"];
                    mqOptions.Password = Configuration["CAP:RabbitMQ:Password"];
                    mqOptions.VirtualHost = Configuration["CAP:RabbitMQ:VirtualHost"];
                });
            });
```
然后我们就可以在控制器注入ICapPublisher，通过该组件直接发布消息
await _capBus.PublishAsync("主题名称","要发布的内容")；
接受消息时候直接在方法的头部添加[CapSubscribe("主题名称")],这个方法可以带参数，参数格式就是发布时候参数的类型
 
 
**注**：
> 如果订阅者在控制器，直接添加[CapSubscribe("")] 来订阅相关消息。
> 如果你的方法没有位于Controller 中，那么你订阅的类需要继承 ICapSubscribe，然后添加[CapSubscribe("")]标记

 
 
 

教程：
netcore使用rabbitmq [https://www.cnblogs.com/savorboard/p/cap.html](https://www.cnblogs.com/savorboard/p/cap.html)
