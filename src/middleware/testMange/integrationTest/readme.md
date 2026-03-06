---
title: 概述
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: nvf4up2k7uozq7xi
docsId: '119506716'
---

## 概述
系统集成测试是一种测试单个系统内各个模块之间交互的方法，在单元测试的基础上，将所有的模块组装成子系统或者系统，然后再进行联合测试。与[单元测试](https://learn.microsoft.com/zh-cn/dotnet/core/testing/)相比，集成测试可在更广泛的级别上评估应用的组件。 单元测试用于测试独立软件组件，如单独的类方法。 集成测试确认两个或更多应用组件一起工作以生成预期结果，可能包括完整处理请求所需的每个组件。 

[微软集成测试文档](https://learn.microsoft.com/zh-cn/aspnet/core/test/integration-tests?view=aspnetcore-7.0)  

常用于测试应用的基础结构和整个框架，包括以下组件

- 数据库
- 文件系统
- 网络设备
- 请求-响应管道

与单元测试相比，集成测试：

- 使用应用在生产环境中使用的实际组件。
- 需要进行更多代码和数据处理。
- 需要更长时间来运行。

## 优点

* 检测集成问题：从单元测试中发现单元测试可能遗漏的模块集成问题
* 验证业务逻辑：确定端到端业务流程在模块之间正常运行
* 确保数据完整性：验证数据在模块之间准确一致地流动
* 提高系统稳定性：及早发现并解决问题，从而从使系统更稳定
* 建立信心：确保系统集成良好并准备好部署

## 框架

- [TestServer](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests)
- Xunit.DependencyInjection：搭配TestServer更加方便的进行集成测试(详情看单元测试的Xunit.DependencyInjection)
- [WireMock-Net](https://github.com/WireMock-Net/WireMock.Net)
- Alba：[基于TestServer的封装](https://mp.weixin.qq.com/s/wAWvV6tfw29lCEoX2j6tdg)

## 参考资料
使用c#破解谷歌浏览器cookie的值：[https://mp.weixin.qq.com/s/xu7ylY_gHh5E_kcH6GMZKg](https://mp.weixin.qq.com/s/xu7ylY_gHh5E_kcH6GMZKg)  

[在集成测试中使用Xunit.DependencyInjection ](https://www.cnblogs.com/weihanli/p/13941796.html#%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95)
