---
title: docker下安装
lang: zh-CN
date: 2023-09-23
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: dockerxiaanzhuang
slug: agvmtl
docsId: '26493261'
---
> SQLserver从2017版本已经开始支持运行在docker上，也就是说sql server现在可以运行在linux下


## 安装
```shell
# 镜像地址
https://hub.docker.com/_/microsoft-mssql-server  

## 拉取镜像
docker pull mcr.microsoft.com/mssql/server:2017-latest

## 查看镜像
docker images

## 启动镜像生成容器 
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Sql987654"  -p 1433:1433 --name sqlserver  -d mcr.microsoft.com/mssql/server:2017-latest

# 生成容器 冰创建sa密码以及创建一个新用户以及新用户的密码
docker run --name sqlserver2017  -d -e 'ACCEPT_EULA=Y'  -e SA_PASSWORD='Sql987654' -e SQLSERVER_DATABASE=demo -e SQLSERVER_USER=azrng -e SQLSERVER_PASSWORD='Sql987654321'   -p 1433:1433 mcr.microsoft.com/mssql/server:2017-latest
    
# 或者使用阿里云镜像源
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Sql987654"  -p 1433:1433 --name sqlserver2019  -d registry.cn-hangzhou.aliyuncs.com/zrng/mssql:2019-latest
```
> 注意：
> 密码过于简单启动不来会提示：密码长度至少为8位字符，并且包含以下四种字符中的三种:大写字母、小写字母、基数10数字和符号。
> 记得指定data目录挂载到容器外，避免因为不小心删除容器而丢失了数据


## 操作
可以使用可视化界面或者命令的方式创建数据库，以下介绍几个常用的命令
通过命令进入容器
```csharp
docker exec -it 容器ID bash
```
创建库创建表
```csharp
## 创建库
CREATE DATABASE TestDB

## 使用库创建表
USE TestDB
CREATE TABLE UserInfo(id INT, LastName NVARCHAR(50), FirstName NVARCHAR(50))

## 查询
Select * from  Inventory
```

## 其他配置
```csharp
## 更改sa的登录密码
sudo docker exec -it sql1 /opt/mssql-tools/bin/sqlcmd  -S localhost -U SA -P "MyPassWord123"  -Q 'ALTER LOGIN SA WITH PASSWORD="MyPassWord456"'
    
## 将主机目录装载为数据卷
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=MyPassWord456' -p 1433:1433 -v  /var/opt/mssql -d mcr.microsoft.com/mssql/server:2017-latest    

## 使用数据卷容器
docker run -e 'ACCEPT_EULA=Y' -e 'MSSQL_SA_PASSWORD=MyPassWord456' -p 1433:1433 -v sqlvolume:/var/opt/mssql -d mcr.microsoft.com/mssql/server:2017-latest
```

## 参考文档
> 小世界的野孩子：[https://www.cnblogs.com/hulizhong/p/11271739.html](https://www.cnblogs.com/hulizhong/p/11271739.html)

