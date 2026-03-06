---
title: 问题
lang: zh-CN
date: 2021-01-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: anerroroccurredwhilestartingtheapplication
slug: wvv9z3
docsId: '29455075'
---
## 部署

托管方式：
进程外：IIS工作进程(w3wp.exe)托管
进程内：自托管web服务器(Kestrel)


![image.png](/common/1609562353775-e3df218a-3e64-4a54-b05c-a4189cf8c036.png)


![image.png](/common/1609562353796-5e1ff8cd-3401-4ca7-83d0-284daabbbc8b.png)


如果使用swagger，切记一定要注意xml文档问题，很容易缺失导致出错。

## 访问swagger提示404

通常会在代码中限制ASPNETCORE_ENVIRONMENT为Production时关闭swagger。但是往往我们需要将api发布到本地iis调试或供他人使用时，swagger将会被禁止。发布后项目往往默认为Production环境，将其修改为Development即可解决。 解决办法： 打开发布好的项目，找到web.config文件，添加以下代码：

```csharp
<environmentVariables>
 <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Development" />
 </environmentVariables>
```

修改webconfig的大概结构是：

```csharp
<?xml version="1.0" encoding="utf-8"?>
<configuration>
<location path="." inheritInChildApplications="false">
<system.webServer>
<handlers>
<add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
</handlers>
<aspNetCore processPath="dotnet" arguments="*.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="InProcess">
<environmentVariables>
<environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Development" />
</environmentVariables>
</aspNetCore>
</system.webServer>
</location>
</configuration>
<!--ProjectGuid: 15af0485-b65a-422a-bf12-5877b85abb6c-->
```

## hostingModel

- 在节点     system.webServer/aspNetCore.hostingModel 中，可以选择的值为：inprocess(进程内托管)/outofprocess(进程外托管)，通过设置     hostingModel 的值来选择不同的托管模式
- 进程内托管

选择进程内托管，意味着将 .NetCore 应用程序的工作进程托管到 IIS 的工作进程 w3wp.exe 中，使用的 IIS 进程内服务器，即使用的是：IISHttpServer。

- 进程外托管

选择进程外托管时，web.config 配置节点system.webServer/aspNetCore.hostingModel 的值必须设置为：outofprocess，选择进程外托管，实际上就是告诉 IIS ，当前应用程序不使用 IISHttpServer，改为使用Kestrel 服务器

## An error occurred while starting the application

项目已经可以启动，证明环境已经正常，只不过在项目启动的时候，出现了错误，也就是说是项目代码的问题。
解决办法：
查看日志，看项目文件是否齐全

可以启用日志

```xml
 <aspNetCore processPath="dotnet" arguments=".\TicketPlatform.Web.dll" stdoutLogEnabled="true" stdoutLogFile=".\logs\" />
```

如果按照上面这种办法，那么记得创建logs文件夹

## 错误码

### 500

![image.png](/common/1609562546531-edab0ee4-2749-46d6-8b47-a9b8282f40bf.png)
应用池高级配置 - 启动32位应用程序 - 设置为True
方法2：
web.config 
 <aspNetCore processPath="%LAUNCHER_PATH%" arguments="%LAUNCHER_ARGS%" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" forwardWindowsAuthToken="false" startupTimeLimit="3600" requestTimeout="23:00:00" **hostingModel="InProcess"**>
删除 hostingModel="InProcess"

### 500.19

错误原因，没有安装 DotNetCore-WindowsHosting.exe 即托管程序，具体可以先检查IIS模块中有没有AspNetCoreModule，有则说明已安装，反正则无

### 500.21

![image.png](/common/1609562570583-5056578d-4277-4011-a24a-ec63ce4a6e6d.png)

没有安装指定的模块，如果你想问这个模块是在项目哪里写的，可以查看发布后的 web.config 文件
解决办法：
1、如果你没有安装上边的 windows-hosting ，直接安装就可以解决这个问题；
2、如果已经安装了服务器托管，发现还没有这个 V2 模块，就是你项目的问题了，这个时候你可以从本地再发布 publish 一次，然后拷贝到服务器即可。
     但是，如果还没有的话，证明你本地开发的项目异常了，不过这个情况基本可以排除，只要是 SDK 2.2 开发的，本地

最终要确保AspNetCoreModuleV2 模块被安装。
![image.png](/common/1609562570582-88b7aaca-7931-46ea-8517-71d613874dd6.png)

### 500.30

![image.png](/common/1609562584786-6cfcfd1a-928f-4189-ac16-99497476a7da.png)
进程内失败

解决办法:
检查是否安装了host

### 503

![image.jpeg](/common/1609562599822-3f3621f7-2695-4454-a70f-128ab66d8b61.jpeg)
解决办法：安装Visual C++ Redistributable for Visual Studio 2015 组件即可，重启后解决问题。
