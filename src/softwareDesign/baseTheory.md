---
title: Base理论
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - base
filename: baseTheory
---

## 概述

BASE是Basically Available（基本可用）、Soft state（软状态）和Eventually consistent（最终一致性）三个短语的缩写。BASE理论是对CAP中一致性和可用性权衡的结果，其来源于对大规模互联网系统分布式实践的总结， 是基于CAP定理逐步演化而来的。BASE理论的核心思想是：即使无法做到强一致性，但每个应用都可以根据自身业务特点，采用适当的方式来使系统达到最终一致性。

`为了解决关系型数据库强一致性引起的问题而引起可用性降低而提出来的解决方案。`

## 参考资料

分布式CAP理论和BASE理论：https://zhuanlan.zhihu.com/p/141376066
