---
title: 数据结构
lang: zh-CN
date: 2024-01-31
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - es
  - struct
---

## 数据结构

以数据库为对比，比较数据库和es的结构

| 数据库       | ElasticSearch                              |
| ------------ | ------------------------------------------ |
| database 库  | index 索引                                 |
| table 表     | type 类型(7.x版本Type名称固定且默认为_doc) |
| row 行       | document 文档(Json格式)                    |
| column 列    | field 字段                                 |
| chema 表结构 | mapping 映射                               |
| SQL          | DSL                                        |
| select       | GET                                        |
| update       | PUT                                        |
| delete       | delete                                     |

## 数据类型

数据类型文档：https://www.elastic.co/guide/en/elasticsearch/painless/7.8/painless-types.html

- 字符串：text，keyword  （重点类型）
- 数值：long，integer，short，byte，double，float，half float，scaled float
- 日期类型：date
- 布尔类型：boolean
- 二进制类型：binary
- 等等。。。、
