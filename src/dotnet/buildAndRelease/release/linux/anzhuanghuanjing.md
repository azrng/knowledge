---
title: 安装环境
lang: zh-CN
date: 2021-12-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: anzhuanghuanjing
slug: qttsat
docsId: '32029584'
---

## 添加yum源
1、如果是新环境，需要我们手动将 Microsoft 包签名密钥添加到受信任密钥列表，并添加 Microsoft 包存储库。
```csharp
rpm -Uvh https://packages.microsoft.com/config/centos/7/packages-microsoft-prod.rpm
```
2、升级所有包同时也升级软件和系统内核
```csharp
yum update
```
完成并且没出现异常

## 安装环境
3、安装netcore sdk
命令：yum install dotnet-sdk-3.1  --推荐这种
或者
命令：sudo yum install aspnetcore-runtime-3.1
![image.png](/common/1614391867883-3c09bd39-f4a9-460b-9eae-644a4620792b.png)
安装成功。

## 测试
4、测试环境是否装好
命令：dotnet --version
或者使用
命令：dotnet --list-sdks
5、查看支持哪些项目类型
命令：dotnet new --help
6、安装lrzsz
命令：yum install -y lrzsz（上传文件使用）

 
