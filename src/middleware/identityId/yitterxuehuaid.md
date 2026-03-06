---
title: Yitter雪花ID
lang: zh-CN
date: 2023-07-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: yitterxuehuaid
slug: fb1yfy
docsId: '71264964'
---

## 介绍
一种全新的雪花漂移算法，让ID更短、生成速度更快。 核心在于缩短ID长度的同时，还能拥有极高瞬时并发处理量（50W/0.1s），及强大的配置能力。
gitee：[https://gitee.com/yitter/idgenerator](https://gitee.com/yitter/idgenerator)

示例：271488814194757

## 功能

- 雪花算法（雪花漂移），它生成的ID更短、速度更快
- 支持 k8s 等容器环境自动扩容（自动注册 WorkerId），可在单机或分布式环境生成数字型唯一ID。

## 操作
引用组件包
```csharp
<PackageReference Include="Yitter.IdGenerator" Version="1.0.11" />
```
注册
```csharp
// 创建 IdGeneratorOptions 对象，请在构造函数中输入 WorkerId：
var options = new IdGeneratorOptions(1);
// options.WorkerIdBitLength = 10; // WorkerIdBitLength 默认值6，支持的 WorkerId 最大值为2^6-1，若 WorkerId 超过64，可设置更大的 WorkerIdBitLength
// ...... 其它参数设置参考 IdGeneratorOptions 定义，一般来说，只要再设置 WorkerIdBitLength （决定 WorkerId 的最大值）。

// 保存参数（必须的操作，否则以上设置都不能生效）：
YitIdHelper.SetIdGenerator(options);
```
生成ID
```csharp
// 初始化以后，即可在任何需要生成ID的地方，调用以下方法：
var newId = YitIdHelper.NextId();
```
