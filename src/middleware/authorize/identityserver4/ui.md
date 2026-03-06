---
title: 可视化界面
lang: zh-CN
date: 2022-05-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: keshihuajiemian
slug: vm4hix
docsId: '32032194'
---

## 官方模板
官方为我们提供了一个快速启动的UI界面，我们只需要下载下来即可，这里有两个方法
```csharp
1、直接从这个地址下来下载，拷贝到项目中，一共三个文件夹；// https://github.com/IdentityServer/IdentityServer4.Quickstart.UI

2、在当前文件夹中执行命令，自动下载；

iex ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/IdentityServer/IdentityServer4.Quickstart.UI/master/getmaster.ps1'))
```
下载完官方提供的默认UI界面后，会提供默认的三个目录文件夹分别为：Quickstart (控制器方法)、Views(视图)、wwwroot (静态文件)

## IdentityServer4.Admin

大神开源了自制的管理模块，包含了一些基本包、3个可执行项目（主身份服务器，网页版管理器和 Web Api 版管理器）和一个 VS 解决方案模板

ids4 GitHub：[https://github.com/skoruba/IdentityServer4.Admin](https://github.com/skoruba/IdentityServer4.Admin)

Duende.IdentityServer.Admin：https://github.com/skoruba/Duende.IdentityServer.Admin


### 操作

#### 生成项目
安装模板
```csharp
dotnet new -i Skoruba.IdentityServer4.Admin.Templates::2.1.0
```
创建项目
```csharp
dotnet new skoruba.is4admin --name MyProject --title MyProject --adminemail "admin@example.com" --adminpassword "Pa$$word123" --adminrole MyRole --adminclientid MyClientId --adminclientsecret MyClientSecret --dockersupport true
```
项目模板选项：
> --name: [string value] for project name
> --adminpassword: [string value] admin password
> --adminemail: [string value] admin email
> --title: [string value] for title and footer of the administration in UI
> --adminrole: [string value] for name of admin role, that is used to authorize the administration
> --adminclientid: [string value] for client name, that is used in the IdentityServer4 configuration for admin client
> --adminclientsecret: [string value] for client secret, that is used in the IdentityServer4 configuration for admin client
> --dockersupport: [boolean value] include docker support

示例
```csharp
dotnet new skoruba.is4admin --name AuthCenter --title AuthCenter --adminemail "itzhangyunpeng@163.com" --adminpassword "123456" --adminrole admin --adminclientid client01 --adminclientsecret secret --dockersupport true
```
