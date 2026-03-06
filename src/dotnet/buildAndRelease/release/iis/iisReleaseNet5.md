---
title: IIS部署.Net5
lang: zh-CN
date: 2023-04-22
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: iisbushu_net5
slug: avyu27
docsId: '29455093'
---

## 介绍
Internet Information Services (IIS) 是一种灵活、安全且可管理的 Web 服务器，用于托管 Web 应用（包括 ASP.NET Core）。虽然我们的程序可以跨平台了，不过还是有些服务是部署在windows服务器下的，下面我们就从头开始部署下我们的程序到IIS.
> 本次示例环境：Windows Server 2012 R2 、vs2019、MySQL、.net5


## 安装环境

### 支持平台

- Windows 7 或更高版本
- Windows Server 2012 R2 或更高版本
> 本次代码将安装在Windows Server 2012 R2 版本上，感觉这个版本使用的公司还不少。


### 安装ASP.NET Core托管捆绑包
安装的文件应该和项目对应的版本相同，现在我项目使用的.net版本是5，那么我应该也用5的，下载地址是：[此处](https://dotnet.microsoft.com/download/dotnet/thank-you/runtime-aspnetcore-5.0.6-windows-hosting-bundle-installer)
安装其他版本的请参考官网地址：[.NET Core托管捆绑包](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/hosting-bundle?view=aspnetcore-5.0)
> 捆绑包可安装 .NET Core 运行时、.NET Core 库和 [ASP.NET Core 模块](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/aspnet-core-module?view=aspnetcore-5.0)。 该模块允许 ASP.NET Core 应用在 IIS 运行。

 ![image.png](/common/1621430404995-81a66bf0-d43f-432c-931d-c9da9239912d.png)
安装后查看应用程序目录
![image.png](/common/1621432192325-6321b024-3a82-47d8-8b2b-cd8d4fbe2e13.png)

## 发布项目
新建一个net5 WebAPI程序，当前程序主要包含一个用户控制器(包含用户信息的增删改查)并且连接MySQL数据库。
项目结构如下
![image.png](/common/1621431500383-f3718698-75cb-4cc1-971f-a94987fd728a.png)
> 源码地址：[https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example)  需要自取

通过vs2019发布我们的项目，然后将发布后的项目拷贝到要部署的服务器上面。
![image.png](/common/1621432479264-a4ad0599-9c44-48f8-9f60-66e4b2e92c6f.png)
发布后如下
![image.png](/common/1621432762660-7cbee968-8fb8-4506-a44c-86f91c08eca9.png)
> 为了正确设置 ASP.NET Core 模块，web.config 文件必须存在于已部署应用的根路径中。里面可以设置一些环境、日志等配置。


## 托管方式

### 进程内托管(IIS HTTP 服务器)
> 自 ASP.NET Core 3.0 起，默认情况下已为部署到 IIS 的所有应用启用进程内托管。

进程内托管在与其 IIS 工作进程相同的进程中运行 ASP.NET Core 应用。 进程内承载相较进程外承载提供更优的性能，因为请求并不通过环回适配器进行代理，环回适配器是一个网络接口，用于将传出的网络流量返回给同一计算机。
![](/common/1621418975218-e1cf8916-d1b1-4478-ab06-27d68955f2cd.png)
> 该图说明了 IIS、ASP.NET Core 模块和进程内托管的应用之间的关系

显式配置进行内托管，需要在项目文件(.csproj)中增加如下配置
```csharp
<PropertyGroup>
  <AspNetCoreHostingModel>InProcess</AspNetCoreHostingModel>
</PropertyGroup>
```

### 进程外托管(Kestrel服务器)
由于运行 ASP.NET Core 进程与 IIS 工作进程分开，所以ASP.NET Core 模块会负责进程管理。
![](/common/1621419731758-573dae98-6398-4ff8-b74e-3bed05092e05.png)
> 该图说明了 IIS、ASP.NET Core 模块和进程外托管的应用之间的关系

进程外托管配置，在项目文件 ( .csproj) 中将 `<AspNetCoreHostingModel>` 属性的值设置为 OutOfProcess
```csharp
<PropertyGroup>
  <AspNetCoreHostingModel>OutOfProcess</AspNetCoreHostingModel>
</PropertyGroup>
```
关于两种托管方式的差异：[此处](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/in-process-hosting?view=aspnetcore-5.0#differences-between-in-process-and-out-of-process-hosting)

## 部署项目
将项目进行发布，然后拷贝到我们的服务器一个文件夹内。
打开IIS添加网站，选择物理路径为我们项目文件
![image.png](/common/1621434077105-2e447da1-5082-4ac9-87c2-a22c7bcf825c.png)
修改应用程序池为无托管模式
![image.png](/common/1621434518735-f09c0f97-ea01-490a-be38-dbf59d5ab886.png)
启动程序转到swagger页面
![image.png](/common/1621434688002-1abc9d39-c4a4-435c-88e8-5ff52ece4db7.png)
因为当前我并没有连接数据库，直接调用接口应该报错，我们看下错误日志。启动输出日志
![image.png](/common/1621434770504-dcf4f9c6-7481-496d-8cd1-0a02094edde8.png)
说明我们项目已经部署成功了
![image.png](/common/1621434890333-450eab2d-434a-491d-9b95-d68d1648662a.png)
如果出现了错误可以查看点此处查看常见错误解决方案：[此处](https://docs.microsoft.com/zh-cn/aspnet/core/test/troubleshoot-azure-iis?view=aspnetcore-5.0)

题外话：当初部署2.1版本时候，windows server 2012r2需要打好几个补丁，并且需要重启多次，没想到这次安装net5这么顺利(服务器是从朋友那借的，我自己的是linux)，如果你所在公司需要部署.net，还是推荐linux进行部署。

## 参考文档
> [https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/?view=aspnetcore-5.0](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/iis/?view=aspnetcore-5.0)

