---
title: 数据迁移
lang: zh-CN
date: 2023-10-15
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shujuqianyi
slug: qgmmu0014fyhrp7m
docsId: '142374227'
---

## 概述
ETL(是Extract-Transform-Load的缩写，即数据抽取、转换、装载的过程)，对于企业应用来说，我们经常会遇到各种数据的处理、转换、迁移的场景。

## 数据迁移工具

### Kettle
Kettle是一款国外开源的ETL工具，纯Java编写，绿色无需安装，数据抽取高效稳定 (数据迁移工具)。
Kettle 中有两种脚本文件，transformation 和 job，transformation 完成针对数据的基础转换，job 则完成整个工作流的控制。
Kettle 中文名称叫水壶，该项目的主程序员 MATT 希望把各种数据放到一个壶里，然后以一种指定的格式流出。

Kettle 家族目前包括 4 个产品：Spoon、Pan、CHEF、Kitchen。

- SPOON：允许你通过图形界面来设计 ETL 转换过程（Transformation）。
- PAN：允许你批量运行由 Spoon 设计的 ETL 转换 (例如使用一个时间调度器)。Pan 是一个后台执行的程序，没有图形界面。
- CHEF：允许你创建任务（Job）。任务通过允许每个转换，更有利于自动化更新数据仓库的复杂工作。
- KITCHEN：允许你批量使用由 Chef 设计的任务 (例如使用一个时间调度器)。KITCHEN 也是一个后台运行的程序。

### DataX
DataX是阿里云 DataWorks 数据集成的开源版本，在阿里巴巴集团内被广泛使用的离线数据同步工具/平台。
DataX 是一个异构数据源离线同步工具，致力于实现包括关系型数据库(MySQL、Oracle等)、HDFS、Hive、ODPS、HBase、FTP 等各种异构数据源之间稳定高效的数据同步功能。

### DataPipeline
DataPipeline采用基于日志的增量数据获取技术（ Log-based Change Data Capture ），支持异构数据之间丰富、自动化、准确的语义映射构建，同时满足实时与批量的数据处理。
可实现 Oracle、IBM DB2、MySQL、MS SQL Server、PostgreSQL、GoldenDB、TDSQL、OceanBase 等数据库准确的增量数据获取。
平台具备“数据全、传输快、强协同、更敏捷、极稳定、易维护”六大特性。
在支持传统关系型数据库的基础上，对大数据平台、国产数据库、云原生数据库、API 及对象存储也提供广泛的支持，并在不断扩展。
DataPipeline 数据融合产品致力于为用户提供企业级数据融合解决方案，为用户提供统一平台同时管理异构数据节点实时同步与批量数据处理任务，在未来还将提供对实时流计算的支持。
采用分布式集群化部署方式，可水平垂直线性扩展的，保证数据流转稳定高效，让客户专注数据价值释放。

### Sqoop 
Sqoop 是 Cloudera 公司创造的一个数据同步工具，现在已经完全开源了。
目前已经是 hadoop 生态环境中数据迁移的首选。Sqoop 是一个用来将 Hadoop 和关系型数据库中的数据相互转移的工具，可以将一个关系型数据库（例如 ：MySQL ,Oracle ,Postgres 等）中的数据导入到 Hadoop 的 HDFS 中，也可以将 HDFS 的数据导入到关系型数据库中。

### FineDataLink 
FineDataLink 是国内做得比较好的 ETL 工具，FineDataLink 是一站式的数据处理平台，具备高效的数据同步功能，可以实现实时数据传输、数据调度、数据治理等各类复杂组合场景的能力，提供数据汇聚、研发、治理等功能。
FDL 拥有低代码优势，通过简单的拖拽交互就能实现 ETL 全流程。
FineDataLink——中国领先的低代码/高时效数据集成产品，能够为企业提供一站式的数据服务，通过快速连接、高时效融合多种数据，提供低代码 Data API 敏捷发布平台，帮助企业解决数据孤岛难题，有效提升企业数据价值。

### Airbyte
ELT管道的数据集成平台，从API，数据库和文件到数据库，仓库和湖泊
仓库地址：[https://github.com/airbytehq/airbyte](https://github.com/airbytehq/airbyte)

## 资料
数据迁移工具：[https://mp.weixin.qq.com/s/ZWWZJEUqQ6wSjPgOqxtNfA](https://mp.weixin.qq.com/s/ZWWZJEUqQ6wSjPgOqxtNfA)
