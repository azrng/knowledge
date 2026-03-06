---
title: CLI
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: changyongcaozuomingling
slug: neasdg
docsId: '30912677'
---

## 概述

关于dotNet的一些命令使用

## SDK信息

sdk下载地址：[https://dotnet.microsoft.com/zh-cn/download/dotnet](https://dotnet.microsoft.com/zh-cn/download/dotnet)
```csharp
## 查看已经安装的sdk
dotnet --list-sdks
```

自定义执行程序运行时目录：https://www.cnblogs.com/lindexi/p/18847625

### Dots

Dots 是一个用于管理 .NET SDK 的 GUI 工具，它使用 .NET MAUI 开发的，可用于 Windows 和 macOS。
仓库地址：[https://github.com/nor0x/Dots](https://github.com/nor0x/Dots)

## 工作负载

### 快速上手

::: details

```shell
# 获取已经安装的列表
dotnet workload list

# 安装
dotnet workload install wrokload_id

# 安装项目或解决方案所需的工作负载
dotnet workload restore

# 示例安装.net aspire
dotnet workload install aspire

# 修复工作负载安装
dotnet workload repair

# 更新已安装的工作负载
dotnet workload update

# 卸载指定的工作负载
dotnet workload uninstall
```

:::

### dotnetTool

::: details

```bash
## 获取已经安装的工具列表
dotnet tool list -g

## 安装工具
dotnet tool install xxx

### 比如安装下面这些东西
dotnet tool install --global PowerShell
dotnet tool install -g csharpier

## 更新
dotnet tool update -g csharpier

## 卸载
dotnet tool uninstall xxx
```

:::

## 项目操作

### 项目模板
```shell
# 查看已经安装的模板
dotnet new --list

# 安装模板，如
dotnet new -i Xunit.DependencyInjection.Template

# 卸载模板
dotnet new -u Xunit.DependencyInjection.Template

# 更新所有的项目模板
dotnet new update
```

### 创建解决方案
```shell
# 创建解决方案
dotnet new sln

# 创建指定名称的解决方案
dotnet new sln -n ThirdNugetStudy
```

### 创建项目

```shell
# 使用xunit-di模板创建项目 
dotnet new xunit-di

# 创建项目并指定名称
dotnet new console -n ConseoleApp1

# 创建下项目并指定框架版本
dotnet new xunit-di -f net5.0
```

### 构建

```shell
# 构建服务
dotnet build  
```

### 启动服务
```shell
dotnet run  #直接启动服务,启用源码
dotnet run --urls=http://*:8080 #使用指定端口启动
# 发布到win下需要双击启用api程序的时候没法设定监听http://*:8080，可以通过代码设置
# builder.WebHost.UseUrls("http://*:8080");

# 启动并且传递参数生成数据库
dotnet run -s send 
# 以Release模式启用
dotnet run -c Release
# 运行并分析
dotnet run analyzer


dotnet WebApi.dll --urls="http://*:5000"
dotnet WebApi.dll --urls="http://*:5000;https://*:5001" --environment=Development 
dotnet run --Logging:LogLevel:Default="Warning" #启动并且修改配置文件

# 启动并且监视，如果有改动就会重新启动
dotnet watch run 
```
如果想自己电脑启用服务，然后让局域网同事访问，需要关闭防火墙，然后修改launchSettings.json文件里面的 http://localhost:5000 为 http://0.0.0.0:5000

### 发布服务
```shell
# 发布项目并指定发布目录
dotnet publish -o ./publish

dotnet publish -f net8.0 -c Release

# 发布自包含单文件
dotnet publish -f net9.0 -r win-x64 -c Release --self-contained true -p:PublishSingleFile=true
dotnet publish -f net9.0-windows -r win-x64 -c Release --self-contained true -p:PublishSingleFile=true

# 发布Aot
dotnet publish -f net9.0 -r win-x64 -c Release --self-contained -p:PublishAot=true
```

### 删除编译文件
删除项目下的编译文件，假设您有可用的 Powershell，我发现以下脚本非常有用。
```powershell
Get-ChildItem .\ -include bin,obj -Recurse | foreach ($_) { remove-item $_.fullname -Force -Recurse }
```
该脚本的原始来源还包括 bash/zsh 和 Windows cmd 版本的选项，尽管我很少需要这些。一个稍微更紧凑的版本是：
```powershell
gci -exclude "*.dll" -include bin,obj -recurse | remove-item -force -recurse
```
如果您想将命令放入批处理文件中（用于 cmd 使用或从 Windows 资源管理器双击），此脚本应该可以解决问题（注意它不使用回收站或删除前确认！）：
```
for /d /r . %d in (bin,obj) do @if exist "%d" rd /s/q "%d"
```
## 项目依赖项审计

对Nuget包等包管理器进行审计，涉及分析软件项目中包含的包安全性。包括识别漏洞、评估风险以及提出提高安全性的建议。

审计包依赖项的安全漏洞：[https://learn.microsoft.com/en-us/nuget/concepts/auditing-packages](https://learn.microsoft.com/en-us/nuget/concepts/auditing-packages)

借助 NuGet Audit 让我们的应用更安全：[https://mp.weixin.qq.com/s/Q4DVH_fd8BIuKlbJWmD9mw](https://mp.weixin.qq.com/s/Q4DVH_fd8BIuKlbJWmD9mw)



NuGet 审计是在还原包时触发的也就是 `dotnet restore`。

### 命令行

可以通过下面的命令来检查包的依赖项

```sh
# 需要先进行构建操作
dotnet build

# 输出依赖项
dotnet list package --vulnerable

# 间接依赖也会被输出
dotnet list package --vulnerable --include-transitive
```

### 配置NugetAudit

.NET 8 引入了 NuGet 审计的支持，升级到 .NET 8 之后的版本后，NuGet 审计默认是打开的，如果你的项目只是示例之类的项目不想打开可以通过 `NuGetAudit` 这个 property 来显式地禁用，下面可以在解决方案文件中进行配置

```xml
 <NuGetAudit>true</NuGetAudit>
 <NuGetAuditMode>all</NuGetAuditMode>
 <NuGetAuditLevel>high</NuGetAuditLevel>
```

* NuGetAudit：direct只审计顶级依赖项，all审计所有依赖项
* NuGetAuditLevel：要报告的最低严重性级别，low、moderate、higth、critical
* NuGetAudit：是否进行安全审核

