---
title: 代理模式
lang: zh-CN
date: 2022-10-20
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: dailimoshi
slug: lbwqqz
docsId: '83632270'
---

## 简述
代理模式(proxy design pattern)是通过引入代码类来给原始类附加功能。

## 使用场景

- 业务系统的非功能性需求开发
   - 比如监控、统计、鉴权、限流、事务等
- RPC框架也可以看作是一种代理，通过远程单代理，将网络通信、数据编解码等细节隐藏起来，客户端调用就跟使用本地函数一样，无需去了解跟服务器交互的细节。

## 静态代理
有一个公共的输出日志监控的类
```csharp
/// <summary>
/// 模拟记录日志
/// </summary>
public class MetricsService
{
    public void WriteLog(string log)
    {
        Console.WriteLine(log);
    }
}
```

### 基于接口实现
参照基于接口而非实现的编程思想，将原始类对象替换为代理类对象， 并且让代理类和原始类实现相同的接口
```csharp
internal interface IUserService
{
    string GetUserName(int userId);

    bool Login(string account, string password);
}

internal class UserService : IUserService
{
    public string GetUserName(int userId)
    {
        return "用户名"+ userId;
    }

    public bool Login(string account, string password)
    {
        return account=="admin" && password=="123456";
    }
}

/// <summary>
/// 用户服务代理类
/// </summary>
internal class UserServiceProxy : IUserService
{
    private readonly MetricsService _metricsService;
    private readonly UserService _userService;

    public UserServiceProxy(UserService userService)
    {
        _metricsService=new MetricsService();
        _userService=userService;
    }

    public string GetUserName(int userId)
    {
        _metricsService.WriteLog($"记录请求时间 内容是：{userId}");

        return _userService.GetUserName(userId);
    }

    public bool Login(string account, string password)
    {
        _metricsService.WriteLog($"记录请求日志 内容是：account：{account}  password：{password}");
        return _userService.Login(account, password);
    }
}
```
但是这个操作需要我们去修改原始类，但是如果原始类没有定义接口或者原始类代码并不是由我们开发维护的，那么我们就没办法通过该方式去实现，所以就用到了下面通过继承的方式实现。

### 基于继承实现
通过继承的方式来实现一种不需要修改源代码文件，然后给方法增加功能的方法。
```csharp
internal class UserService2
{
    public string GetUserName(int userId)
    {
        return "用户名";
    }

    public bool Login(string account, string password)
    {
        return account=="admin" && password=="123456";
    }
}

/// <summary>
/// 用户服务代理类
/// </summary>
internal class UserServiceProxy2 : UserService2
{
    private readonly MetricsService _metricsService;

    public UserServiceProxy2()
    {
        _metricsService=new MetricsService();
    }

    public new string GetUserName(int userId)
    {
        _metricsService.WriteLog($"记录请求时间 内容是：{userId}");

        return base.GetUserName(userId);
    }

    public new bool Login(string account, string password)
    {
        _metricsService.WriteLog($"记录请求日志 内容是：account：{account}  password：{password}");
        return base.Login(account, password);
    }
}
```
使用示例
```csharp
var userService = new UserServiceProxy2();
userService.Login("admin", "123456");
```
输出信息：记录请求日志 内容是：account：admin  password：123456

## 动态代理
上面的方案需要我们将原始类的所有方法都重新实现一遍，并且为每个方法都附加相似的代码逻辑，另一方面，如果要添加的附加功能的类不止有一个，我们需要针对每个类都创建一个代理类，这增加了代码维护的成本，并且每个代理类的代码都有点像是同一个模板的重复代码，所以这个时候就需要动态代理来解决这个问题。

动态代理：就是我们不事先为每个原始类编写代理类，而是运行的时候，动态地创建原始类对应的代理类，然后再系统中使用代理类替换掉原始类。

实现原理：用户配置好需要给哪些类创建代理，并定义好执行原始类的业务代码前后执行哪些附加功能，然后通过反射语法给每个需要的类创建代理类。

可以借助组件来实现动态代理功能，比如
[Castle.Core](https://www.yuque.com/docs/share/53044ea9-8d3c-4acb-a8a1-faa564a887ce?view=doc_embed)

## 总结
在不改变原始类代码的情况下，通过引入代理类拉给原始类附加功能。常在业务系统中开发一些非功能性需求，比如：监控、统计、鉴权、限流、事务、幂等、日志等。
