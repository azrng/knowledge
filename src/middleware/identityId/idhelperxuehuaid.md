---
title: IdHelper雪花Id
lang: zh-CN
date: 2023-08-08
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: idhelperxuehuaid
slug: av22d6
docsId: '65978806'
---

## 介绍
IdHelper是一个.NET（支持.NET45+或.NET Standard2+）生成分布式趋势自增Id组件，有两个版本：原始版为基于雪花Id方案，需要手动管理设置WorkerId；完美版在原始版的基础上使用Zookeeper来解决原始版中的WorkerId的分配问题和时间回拨问题。

原始版安装方式：Nuget安装IdHelper即可
完美版安装方式：Nuget安装IdHelper.Zookeeper即可
github：[https://github.com/Coldairarrow/IdHelper](https://github.com/Coldairarrow/IdHelper)

## 操作

### 原始版
引用组件
```csharp
<PackageReference Include="IdHelper" Version="1.4.1" />
```
配置服务
```csharp
new IdHelperBootstrapper().SetWorkderId(workId).Boot();//workId是机器码
```
获取ID
```csharp
var id = IdHelper.GetLongId();
```
