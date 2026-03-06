---
title: 命令行
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: minglinghang
slug: sa38o7ntytoe6kyy
docsId: '138113714'
---

## 概述
通过命令行来运行测试任务

## 操作
在单元测试目录下运行下面命令
```bash
## 执行所有测试任务
dotnet test

## 运行指定名字任务
dotnet test --filter TestMethod1
dotnet test --filter Name~TestMethod1

## 排除某个方法
dotnet test --filter FullyQualifiedName!=Walterlv.Demo.Tests.FooTest.TestMethod1

## 执行某一个类下的测试任务
dotnet test --filter ClassName=Walterlv.Demo.Tests.FooTest

```

官方文档：[https://learn.microsoft.com/zh-cn/dotnet/core/testing/selective-unit-tests?pivots=mstest](https://learn.microsoft.com/zh-cn/dotnet/core/testing/selective-unit-tests?pivots=mstest)

### MSTest

#### 分类与优先级
查找标记了 [TestCategory("CategoryA")] 的方法并执行单元测试：
```javascript
dotnet test --filter TestCategory=CategoryA
```
查找标记了 [Priority(2)] 的方法并执行单元测试：
```javascript
dotnet test --filter Priority=2
```

#### 条件与或
条件或（|）：
```javascript
dotnet test --filter Name~TestMethod1|TestCategory=CategoryA
```
条件与（’&’）：
```javascript
dotnet test --filter Name~TestMethod1&TestCategory=CategoryA
```

