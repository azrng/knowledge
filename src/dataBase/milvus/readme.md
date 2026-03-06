---
title: 说明
lang: zh-CN
date: 2025-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - milvus
---

## 概述

Milvus 是一个开源的向量数据库，专为存储、索引和检索大规模高维向量数据而设计，广泛应用于人工智能、推荐系统、图像检索、自然语言处理等领域。

文档：[https://milvus.io/docs](https://milvus.io/docs/zh/overview.md)

Milvus的优势主要包括：

* 高效的向量检索性能：Milvus采用了多种先进的索引算法，如IVF, HNSW, ANNOY等，能够在大规模数据集上实现高效的近似最近邻搜索。
* 易于扩展和维护：Milvus支持水平和垂直扩展，能够适应不断增长的数据规模和查询需求。它的分布式架构使得数据存储和计算能力可以灵活扩展。
* 多种数据持久化选项：Milvus支持SSD, HDD等多种存储介质，并且可以与多种持久化存储解决方案集成，如MinIO, S3等。
* 丰富的数据接口：Milvus提供了Python, Java, RESTful等多种语言的SDK，方便开发者在不同的应用场景中使用。
* 强大的可扩展性和兼容性：支持各种大小和类型的向量数据，可以与现有的数据处理和机器学习工作流程无缝集成。
* 容器化和云原生支持：支持Docker和Kubernetes，方便在云环境中部署和管理。
* 开源社区支持：作为一个开源项目，Milvus拥有活跃的社区，不断有新的功能和改进被加入。

## 参考资料

在 .NET 中使用 Milvus 向量数据库 - .NET 博客：[https://mp.weixin.qq.com/s/X6WFIAB4FtgbuaNdvSdJ5w](https://mp.weixin.qq.com/s/X6WFIAB4FtgbuaNdvSdJ5w)