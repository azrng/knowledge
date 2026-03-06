---
title: 包管理服务BaGet
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: baoguanlifuwubaget
slug: iurkmg
docsId: '43761779'
---

## 1. 介绍
BaGet是一个轻量级的包管理服务。有些时候公司或者个人不希望某一些包进行公开，那么就需要使用私有的包管理服务程序，该服务是用.netcore进行编写的(感谢开发者为社区做出的共享)
> Github：[https://github.com/loic-sharma/BaGet](https://github.com/loic-sharma/BaGet)
> 官网：[https://loic-sharma.github.io/BaGet/](https://loic-sharma.github.io/BaGet/)


## 2. Docker部署
创建配置文件baget.env
```csharp
## The following config is the API Key used to publish packages.
## You should change this to a secret value to secure your server.
ApiKey=63edf12c-b70c-45c7-b3ed-f53c9f791e26 ## 随机生成，上传包时候使用

Storage__Type=FileSystem
Storage__Path=E:\nuget ## windows下的写法
Database__Type=Sqlite
Database__ConnectionString=Data Source=/var/baget/baget.db
Search__Type=Database
```
在当前目录下执行
```csharp
## linux
docker run -d --name BaGet-nuget -p 9002:80 --env-file baget.env -v "$(pwd)/baget-data:/var/baget" loicsharma/baget:latest

## windows
docker run -d --name BaGet-nuget -p 9002:80 --env-file baget.env -v "E://nuget//baget-data:/var/baget" loicsharma/baget:latest
```

## 3. 简单使用

### 3.1 访问
通过访问地址： localhost:9002 进入主界面
![image.png](/common/1618583664812-41eee20b-f1fa-4fcb-b47c-2543605cda34.png)
界面和 [https://www.nuget.org/](https://www.nuget.org/)  很相似。下面我们就开始随便创建一个类库然后打包推送
![image.png](/common/1618583720855-7c7ac08c-5786-4e00-b382-9120ec2d73bd.png)
右键进行打包，可以通过右键属性进行修改包的参数

### 3.2 推送
官方提供了四种方式
![image.png](/common/1618582940189-6b28c743-83b6-46a2-a195-218d0bebc4ad.png)
下面只对其中我个人习惯的方法做示例
```csharp
## .net cli
dotnet nuget push -s http://localhost:9002/v3/index.json UserLib.1.0.1.nupkg  --api-key  63edf12c-b70c-45c7-b3ed-f53c9f791e26
```
使用cmd
![image.png](/common/1618583051937-75725a1f-f677-4968-8a75-86ee8a66fd54.png)
> 注：
> 1.包版本要写对
> 2.命令需要在包的目录下执行
> 3.需要填写baget.env文件里面的api-key

打开网页端查看
![image.png](/common/1618583330262-60b6543c-d67b-45ba-90ec-a64fbf5d1095.png)

### 3.3 引用包
在我们想引用包的项目里面打开包管理器
添加程序包源
![image.png](/common/1618583401944-fcce6270-3d63-444f-873f-e18b551f3f9f.png)
然后搜索我们的nuget包
![image.png](/common/1618583441712-57395fc7-1282-422b-afe8-844d8331e007.png)
安装后就可以使用了

## 4. 参考文档

轻量NuGet服务—GaGet：https://mp.weixin.qq.com/s/xF5K2U3OhF7I9moGMeOibw