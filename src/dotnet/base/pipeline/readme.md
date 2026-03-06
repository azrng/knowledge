---
title: 管道模式
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: guandaomoshi
slug: bq68qf
docsId: '56085646'
---

## 概述
.NET Core管道是一种服务器端处理程序请求的方法。它以指定的顺序将Kestrel（ASP.NET Core的应用服务器）中的请求发送到服务器的中间件，每个中间件都可以选择性地处理请求或将其传递到下一个中间件。例如，一个中间件可以负责认证用户，另一个中间件可以填充查询字符串，而另一个中间件可以处理所有请求并返回响应。这使得.NET Core应用程序可以对来自用户的每个请求做出不同的反应，而不需要繁琐的代码。

## 实现
管道是一种概念，这个概念下面有多种实现方案。

方案一
ASP.NET Core中间件
方案二
ASP.NET Core过滤器
方案三
借助MediatR提供的Behaviors概念来实现，通过继承自IPipelineBehavior可以实现对请求的处理和响应。Request(请求)在管道中传递，依次经过管道中每个处理，实现管道模式后可以实现对请求和响应的处理。
```csharp
public class FirstPipelineBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
    {
        Console.WriteLine("FirstPipelineBehavior执行中");

        var response = await next();

        Console.WriteLine("FirstPipelineBehavior执行完成");

        return response;
    }
}
```
和MiddleWare类似，调用next()可以将请求向下传递。
控制器层
```csharp
[HttpGet]
public async Task<string> Demo([FromQuery] DemoQuery request)
{
    return await _mediator.Send(request);
}


public class DemoQuery : IRequest<string>
{
    public string Name { get; set; }
}

public class DemoQueryHandler : IRequestHandler<DemoQuery, string>
{ 
    public async Task<string> Handle(DemoQuery request, CancellationToken cancellationToken)
    {
        Console.WriteLine("DemoQueryHandler执行");
        return request.Name;
    }
}
```
接着在Startup.cs中注册管道
```csharp
services.AddMediatR(typeof(Startup));
services.AddTransient(typeof(IPipelineBehavior<,>), typeof(FirstPipelineBehavior<,>));
services.AddTransient(typeof(IPipelineBehavior<,>), typeof(SecondPipelineBehavior<,>));
services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ThirdPipelineBehavior<,>));
```
访问API可以看到，**管道可以在IRequestHandler执行之前和之后执行代码，并且处理顺序和注册顺序相同**

## 业务层管道
业务层实现管道目的

- **与顶级框架解耦**，不能保证应用程序代码始终运行在ASP.NET Core下，如果将业务迁移到WPF，记录访问日志这类放在管道中的功能还是需要实现
- **同时支持不同来源请求**，请求可能来自于Web API，也可能来自于Windows Service定时调用，但业务层处理逻辑应保持一样

因此，ASP.NET Core框架应该只用于接收输入和返回输出，而在业务层实现管道模式。

## 资料
公众号My IO：[https://mp.weixin.qq.com/s/EMNddSYFRsdgkgU1IWbR8g](https://mp.weixin.qq.com/s/EMNddSYFRsdgkgU1IWbR8g)
