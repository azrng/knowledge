---
title: 触摸验证码SimCaptcha
lang: zh-CN
date: 2023-05-11
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: chumoyanzhengmasimcaptcha
slug: vy4o0oxhszirm6mq
docsId: '124495312'
---

## 概述
SimCaptcha 是一个简单易用的触摸验证码，包含了前端与后端。一个简单易用的触摸验证码促进你的开发。
仓库地址：[https://github.com/yiyungent/SimCaptcha](https://github.com/yiyungent/SimCaptcha)

## 操作
使用 Nuget 安装 SimCaptcha.AspNetCore
验证码注册
```csharp
// Startup.cs 
// 注意: 省略了部分代码, 只保留主要部分, 详见示例(/examples/EasyAspNetCoreService)
// 仅适用于 SimCaptcha.AspNetCore v0.3.0+
public void ConfigureServices(IServiceCollection services)
{
    // 1.重要: 注册验证码配置
    services.Configure<SimCaptchaOptions>(Configuration.GetSection(SimCaptchaOptions.SimCaptcha));

    // 2.添加 SimCaptcha
    services.AddSimCaptcha();
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // 3.启用 SimCaptcha 中间件
    app.UseSimCaptcha();

    // 现在
    // "https://yourdomain.com/api/SimCaptcha/Img", "https://yourdomain.com/api/SimCaptcha/Check", "https://yourdomain.com/api/SimCaptcha/TicketVerify"
    // 将开始工作
}
```

## 参考资料
开源触摸验证码：[https://mp.weixin.qq.com/s/mJxql05VN34ovpPk9zF3-g](https://mp.weixin.qq.com/s/mJxql05VN34ovpPk9zF3-g)
