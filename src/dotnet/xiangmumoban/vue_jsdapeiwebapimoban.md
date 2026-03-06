---
title: Vue.js搭配WebAPI模板
lang: zh-CN
date: 2023-09-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: vue_jsdapeiwebapimoban
slug: sgufdy
docsId: '93509828'
---

## 目的
创建一个Vue.js和Web API前后端集成的项目。

## 操作

### Vue JS 3.0 with .NET 5 Web API
安装扩展：Vue JS 3.0 with .NET 5 Web API
![image.png](/common/1663412657062-0a6f2772-9bf5-4723-884e-5fc5dad632fc.png)
> 该扩展只能安装在Vs2019上并且框架版本是.Net5，详细信息：[https://marketplace.visualstudio.com/items?itemName=alexandredotnet.vuejsdotnetfive&ssr=false#overview](https://marketplace.visualstudio.com/items?itemName=alexandredotnet.vuejsdotnetfive&ssr=false#overview)

安装成功后，在创建新项目窗口可以可以看到，多了“Vue JS 3.0 with .NET 5”项目模板，然后创建项目ClientApp目录下放置的就是Vue.js客户端代码，其他内容和普通WebAPI项目相同，当你直接运行的时候，它会自动运行npm install来安装需要的包。

发布项目的时候需要注意，该模板设置的configuration.RootPath的代码有点问题，需要做如下修改
```csharp
public Startup(IConfiguration configuration, IWebHostEnvironment env)
{
    Configuration = configuration;
    CurrentEnvironment = env;
}

public IConfiguration Configuration { get; }
private IWebHostEnvironment CurrentEnvironment { get; set; }

// This method gets called by the runtime. Use this method to add services to the container.
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    services.AddSpaStaticFiles(configuration =>
    {
        if (CurrentEnvironment.IsDevelopment())
        {
            configuration.RootPath = "ClientApp";
        }
        else
        {
            configuration.RootPath = "ClientApp/dist";
        }
    });
}
```
执行发布操作，它会自动执行npm run build,将前端代码编译输出到ClientApp/dist目录下。

### ASP.Net Core SPA with Vue Js
安装扩展：ASP.Net Core SPA with Vue Js
![image.png](/common/1663413086670-8e129f80-2980-4544-a88a-1f9e5e79b184.png)
> 该插件只能安装在Vs2022上，详细介绍的文章：[https://marketplace.visualstudio.com/items?itemName=TechQuantum.DeepakAspNetVueJs](https://marketplace.visualstudio.com/items?itemName=TechQuantum.DeepakAspNetVueJs)


## 资料
[https://mp.weixin.qq.com/s/LJP6_0LaaY0VOelIdHi_hA](https://mp.weixin.qq.com/s/LJP6_0LaaY0VOelIdHi_hA) | 一键生成Vue.js + Web API前后端集成项目
[https://cli.vuejs.org/guide/installation.html](https://cli.vuejs.org/guide/installation.html) | 安装Vue
