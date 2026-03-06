---
title: 使用Autofac
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shiyongautofac
slug: iolofwswe8be4fn4
docsId: '120345827'
---

## 概述
Autofac 是一个开源的控制反转容器，通过将.NET 程序的控制反转容器替换为 Autofac，可以实现例如属性注入、面向切面编程等功能。

## 操作

### 引用包
从 NuGet 引用 Autofac.Extensions.DependencyInjection包。

### 使用容器
打开MauiProgram.cs文件，在**所有代码最后**、return builder.Build();**之前**，通过ConfigureContainer来使用AutofacServiceProviderFactory来构建使用 Autofac 容器：
```csharp
public static MauiApp CreateMauiApp()
{
    // 添加以下代码
    builder.ConfigureContainer(new AutofacServiceProviderFactory((containerBuilder) =>
    {
        containerBuilder.Populate(builder.Services);

        containerBuilder.RegisterType<MainPage>();
        containerBuilder.RegisterType<MainViewModel>();
    }));

    return builder.Build();
}
```
在上述代码中，通过调用Populate方法，将 Maui 在ServiceCollection中的服务注册，配置到了 Autofac 容器中，然后通过RegisterType将项目中的服务注册到 Autofac 容器中。
> 上述步骤中的代码顺序至关重要，他将影响服务在容器中的注册，详情参见 Autofac 文档。


### 解析依赖项
通过上述步骤将依赖注入容器替换为 Autofac，将不会影响在 Maui 中解析依赖项的方式。正如[如何在 Maui 中使用依赖注入](https://mp.weixin.qq.com/s?__biz=Mzg2MTcyODU5Mg==&mid=2247483657&idx=1&sn=4761e7e87ec27cc25d9a47bd02507ac8&scene=21#wechat_redirect)中所介绍的，可以通过构造函数来解析依赖项。
```csharp
public partial class App : Application
{
    public App(MainPage mainPage)
    {
        InitializeComponent();

        MainPage = mainPage;
    }
}
```

## 参考资料
公众号【捕获异常】： zhangchi.io
