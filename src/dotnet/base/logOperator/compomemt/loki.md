---
title: Loki
lang: zh-CN
date: 2022-10-30
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: loki
slug: vvr64t
docsId: '100360487'
---

## 概述
Loki 是一个受Prometheus启发的水平可扩展、高可用性、多租户日志聚合系统。它的设计非常具有成本效益且易于操作。它不索引日志的内容，而是为每个日志流设置一组标签。
与其他日志聚合系统相比，Loki：

- 不对日志进行全文索引。通过存储压缩的非结构化日志和仅索引元数据，Loki 操作更简单，运行成本更低。
- 使用已在 Prometheus 中使用的相同标签对日志流进行索引和分组，使您能够使用已在 Prometheus 中使用的相同标签在指标和日志之间无缝切换。
- 特别适合存储Kubernetes Pod 日志。Pod 标签等元数据会被自动抓取和索引。
- 在 Grafana 中有原生支持（需要 Grafana v6.0）。

基于 Loki 的日志记录堆栈由 3 个组件组成：

- promtail是代理，负责收集日志并将其发送给 Loki。
- loki是主服务器，负责存储日志和处理查询。
- Grafana用于查询和显示日志。

## 资料
.Net6+Loki+Grafana实现轻量级日志可视化服务功能：[https://mp.weixin.qq.com/s/TOWSmZPX1M82G-tCQvDUJg](https://mp.weixin.qq.com/s/TOWSmZPX1M82G-tCQvDUJg)
