---
title: 读写分离
lang: zh-CN
date: 2023-06-02
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: douxiefenli
slug: rrvlvr
docsId: '66543138'
---

## 介绍
20%操作是增删改，80%操作是查询。
一个主库对应多个从库，配置主库复制数据到从库，有延迟、很小、毫秒级，降低数据库服务器压力。

## 原理
SQLServer中主库修改，然后发布配置，从库订阅修改。
![image.png](/common/1644724929405-e72eeae5-c496-4fd1-b666-de439c3fccbf.png)

## 操作

- 多个数据库多个Context
- 单个Context多个连接数据库

### 多个Context
此处不叙述了

### 单个Context
比如根据传入的配置不同，然后读取不同的连接字符串。

