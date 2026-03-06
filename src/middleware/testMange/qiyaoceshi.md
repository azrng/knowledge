---
title: 契约测试
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: qiyaoceshi
slug: rezsu5g9i8472vhy
docsId: '141234659'
---

## 概述
契约测试：对程序的输入和输出进行测试，测试的时候，将测试请求发送到内置的模拟服务器而不是真是的服务器。

### 为什么需要契约测试？
构建和维护微服务是一项艰巨的任务。 在众多服务必须彼此无缝交互的世界中，确保对一项服务的更改不会破坏另一项服务的功能是很让人头疼的。 传统的集成测试针对的是整个系统之间的交互，工作量太大、速度太慢，甚至无法直接识别问题。 与之相反的是，契约测试侧重于测试各个服务之间的契约。 合同测试根据消费者和提供商之间商定的契约分别对消费者和提供商进行测试。

### 如何执行契约测试
在契约测试中，消费者端程序员编写“消费者测试”，其中包含期望的输入和输出，并且期望将被保存到 Pact Json 文件中。 运行时，测试将请求发送到内置的模拟服务器而不是真实服务器，模拟服务器使用保存的 Pact Json 文件发送响应，该响应将用于验证消费者端测试用例。
此外，契约测试框架将读取保存的 Pact Json 文件，并向服务提供者（服务器）发送请求，并且将根据Pact Json 文件中的预期输出来验证响应。

## 操作
使用nuget包：PactNet

## 资料
[https://mp.weixin.qq.com/s/x9j2CCERhAJoUvFjLvk4Cg](https://mp.weixin.qq.com/s/x9j2CCERhAJoUvFjLvk4Cg) | 10分钟理解契约测试及如何在C#中实现
