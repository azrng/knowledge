---
title: 基于数据库分布式ID
lang: zh-CN
date: 2023-08-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jiyushujukufenbushiid
slug: db7gzi
docsId: '71014524'
---

## 概述
一个根据数据库来生成分布式ID的组件。
长度：16位，前端可以使用number类型来接收
结构：6位年月日+3位机器码+7位ID
例如：2021年8月31日1号pod生成的第10个数据，2108310010000010

> 生成内容唯一性待确认


## 雪花ID问题

- 雪花Id的long类型，需要19位数字，前端的number类型是16位的，需要后端改序列化或前端改成string
- 需要一个唯一的工作机器ID，一般用于zookper实现。

处理方案

- 16位ID，前端支持使用
- number类型来接收，不会有精度丢失问题
- 使用数据库保证每台pod的workid唯一

## 通信
服务启动：
1.服务创建的时候，拉去DB中24小时内活跃的WorkId列表，尝试插入一个不存在的WorkId，插入成功获取到唯一的WorkId
2.删除不活跃的WorkId，24小时内没有上传心跳包的机器
服务运行中：
1.ObjectId.Next，根据时间+WorkId+序列号生成Id，因为序列号是唯一的，所有生成的ObjectId也是唯一的
2.每6个小时上传一次心跳包

## 具体代码
看gitee

