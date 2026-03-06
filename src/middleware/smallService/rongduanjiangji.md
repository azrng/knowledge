---
title: 熔断降级
lang: zh-CN
date: 2023-06-23
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: rongduanjiangji
slug: kc2hsh
docsId: '32034341'
---

## 介绍
熔断器如同电力过载保护器。它可以实现快速失败,如果它在一段时间内侦测到许多类似的错误,会强迫其以后的多个调用快速失败,不再访问远程服务器,从而防止应用程序不断地尝试执行可能会失败的操作,使得应用程序继续执行而不用等待修正错误,或者浪费时间去等到长时间的超时产生。

降级的目的是当某个服务提供者发生故障的时候,向调用方返回一个错误响应或者替代响应。举例子:如视频播放器请求playsafe的替代方案;加载内容评论时如果出错,则以缓存中加载或者显示"评论暂时不可用" 。

## Resilience

https://mp.weixin.qq.com/s/CaR-SC_hmlgAtjS97mzRvg | .NET 8 中的 Microsoft.Extensions.Http.Resilience库

## Polly

.Net Core中有一个被.Net基金会认可的库Polly,可以用来简化熔断降级的处理。主要功能：重试(Retry) ；断路器(Circuit-breaker) ；超时检测(Timeout) ；缓存(Cache) ；失败处理(FallBack) ；
官网: [https://github.com/App-vNext/Polly](https://github.com/App-vNext/Polly)

### 重试
出现故障自动重试，常见单场景

### 断路
当系统遇到严重问题是还，限制系统出错单消耗，有助于系统恢复。比如限制系统出现两次某个异常就停下来，等待一分钟后再继续，还可以在断路时定义中断单回调和重启单回调。

### 超时
当系统超过一定时间的等待，就可以判断不可能会有成功单结果。

### 隔离
当系统的一处出现故障时，可能触发多个失败的调用，对资源有较大的消耗，下游系统出现故障可能导致上游的故障的调用，甚至可能蔓延到导致系统崩溃，所以要将可控的操作限制在一个固定大小的资源池中，以隔离有潜在可能相互影响的操作；

### 回退
有些错误无法避免，就要有备用单方案，当无法避免单错误发生时，我们要有一个合理单返回来代替失败。

### 缓存
把频繁使用并且不怎么变化的资源缓存起来，以提高系统的响应速度。

参考文章：[https://www.cnblogs.com/edisonchou/p/9159644.html](https://www.cnblogs.com/edisonchou/p/9159644.html)  
介绍文章: [https://www.cnblogs.com/CreateMyself/p/7589397.html](https://www.cnblogs.com/CreateMyself/p/7589397.html)

 

 
