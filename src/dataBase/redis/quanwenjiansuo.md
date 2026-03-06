---
title: 全文检索
lang: zh-CN
date: 2023-08-06
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: quanwenjiansuo
slug: lewvwpe3oc5uns0w
docsId: '135421879'
---

## 概述
Redis Search是一个Redis模块，它使用压缩的倒排索引来实现快速的索引和低内存占用。Redis Search可以对Redis数据进行精确短语匹配、模糊搜索、数值过滤、地理空间筛选等多种搜索功能。Redis Search还支持聚合、高亮、词干提取、拼写纠错等特性。
文档地址：[https://redis.io/docs/interact/search-and-query/](https://redis.io/docs/interact/search-and-query/)


## 安装
docker方式安装
```shell
$ docker run -p 6379:6379 redis/redis-stack-server:latest

## 连接实例
$ redis-cli
```




## 资料
[https://mp.weixin.qq.com/s/mAKrTqhhwqw4Oo0sE5_cuw](https://mp.weixin.qq.com/s/mAKrTqhhwqw4Oo0sE5_cuw) | C#+Redis Search：如何用Redis实现高性能全文搜索
