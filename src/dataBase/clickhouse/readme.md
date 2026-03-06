---
title: 说明
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shuiming
slug: xzr4ah
docsId: '100489306'
---

## 概述
ClickHouse 是俄罗斯第一大搜索引擎 Yandex 开发的列式储存数据库。令人惊喜的是，这个列式储存数据库的性能大幅超越了很多商业 MPP 数据库软件，比如 Vertica,InfiniDB.

官网：[https://clickhouse.com/](https://clickhouse.com/) 

仓库地址：[https://github.com/ClickHouse/ClickHouse](https://github.com/ClickHouse/ClickHouse)

## 使用场景
ClickHouse是一种快速、可靠、高性能的开源列式数据库。以下是ClickHouse的一些典型应用场景：

1. 实时OLAP：ClickHouse可以在秒级别内执行复杂的分析查询，支持海量数据存储和快速数据检索，因此是实时在线分析处理（OLAP）的理想选择。
2. 日志管理：由于ClickHouse具有高度可扩展性和出色的读写性能，因此它经常用于处理大量的日志文件和事件流数据。
3. 时序数据：ClickHouse的分布式架构和列式存储引擎非常适合存储和处理时间序列数据，如传感器数据、监控指标等。
4. 大数据仓库：ClickHouse的高性能、低延迟和可扩展性使其成为构建大型数据仓库的理想选择，可以处理数十亿行甚至数万亿行的数据。
5. 数据分析和BI：ClickHouse可以作为数据分析和商业智能（BI）平台的后端数据库，提供高速的数据查询和分析功能，以帮助企业做出更准确的决策。



另一个白话文的适用说明

- 大多数是读请求
- 每次写入大于1000行的数据（不适用于单条插入）
- 不修改已添加的数据
- 每次查询都从数据库中读取大量的行，但是同时又仅需要少量的列
- 宽表，即每个表包含着大量的列
- 较少的查询(通常每台服务器每秒数百个查询或更少)
- 对于简单查询，允许延迟大约50毫秒
- 列中的数据相对较小：数字和短字符串(例如，每个URL 60个字节)
- 处理单个查询时需要高吞吐量（每个服务器每秒高达数十亿行）
- 事务不是必须的
- 对数据一致性要求低
- 每一个查询除了一个大表外都很小
- 查询结果明显小于源数据，换句话说，数据被过滤或聚合后能够被盛放在单台服务器的内存中



总之，ClickHouse适用于需要高速查询、高可靠性、高性能和大规模数据处理的场景，特别是那些需要进行实时分析和数据挖掘的应用程序。比如公交轨迹、消费转账流水、日志记录、天气数据

## 数据类型

官网数据类型介绍：[https://clickhouse.com/docs/en/sql-reference/data-types](https://clickhouse.com/docs/en/sql-reference/data-types)

ClickHouse支持多种数据类型，可以划分为基础类型、复合类型和特殊类型，具体如下：

### 基础类型

- **数值类型**
  - **整数**：包括有符号整型和无符号整型。
    - `Int8`：-128 ~ 127
    - `Int16`：-32768 ~ 32767
    - `Int32`：-2147483648 ~ 2147483647
    - `Int64`：-9223372036854775808 ~ 9223372036854775807
    - `UInt8`：0 ~ 255
    - `UInt16`：0 ~ 65535
    - `UInt32`：0 ~ 4294967295
    - `UInt64`：0 ~ 18446744073709551615
  - **浮点数**：`Float32`和`Float64`。建议尽可能以整数形式存储数据，因为浮点型进行计算时可能引起四舍五入的误差。
  - **定点数**：有符号的浮点数，可在加、减和乘法运算过程中保持精度，对于除法，最低有效数字会被丢弃（不舍入）。
    - `Decimal32(s)`：相当于`Decimal(9-s,s)`，有效位数为1~9。
    - `Decimal64(s)`：相当于`Decimal(18-s,s)`，有效位数为1~18。
    - `Decimal128(s)`：相当于`Decimal(38-s,s)`，有效位数为1~38。
- **字符串类型**
  - `String`：可以任意长度的字符串，可以包含任意的字节集，包含空字节。
  - `FixedString(n)`：固定长度的字符串，长度为n。
  - `UUID`：用于存储UUID字符串。
- **时间类型**
  - `Date`：用于存储日期。
  - `DateTime`：用于存储日期和时间。
  - `DateTime64`：用于存储日期和时间，支持小数秒。

### 复合类型

- **数组**：`Array(T)`，T可以是任意类型，包括数组类型，但不推荐使用多维数组，因为对其的支持有限（MergeTree引擎表不支持存储多维数组）。
- **元组**：`Tuple`，可以存储多个不同类型的数据。
- **枚举**：包括`Enum8`和`Enum16`两种枚举类型，它们固定使用(String:Int) Key/Value键值对的形式定义数据。
- **嵌套**：`Nested`，可以存储嵌套的数据结构。

### 特殊数据类型

- **Nullable**：用于表示可以为空的类型。
- **Domain**：用于定义数据的约束和规则。

## 资料

ClickHourse及可视化界面安装介绍：[https://mp.weixin.qq.com/s/VtRyfaqIShbxEl0ILs0zow](https://mp.weixin.qq.com/s/VtRyfaqIShbxEl0ILs0zow)
[https://mp.weixin.qq.com/s/BmI9TLI30E70sBzuOB4ptw](https://mp.weixin.qq.com/s/BmI9TLI30E70sBzuOB4ptw) | .NET轻松处理亿级数据ClickHouse介绍

数据操作：https://www.cnblogs.com/ShaoJianan/p/11163091.html
