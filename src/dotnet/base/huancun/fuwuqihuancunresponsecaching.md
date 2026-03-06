---
title: 服务器缓存ResponseCaching
lang: zh-CN
date: 2023-08-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fuwuqihuancunresponsecaching
slug: zisdsv
docsId: '30869209'
---

## 介绍
服务端缓存，将东西存储在服务器，如果服务器缓存中有，那么就直接返回结果，并不会重新访问Action的内容。

可以对来自不同客户端的相同请求或者不支持客户端缓存的客户端进行处理，能降级服务器端的压力。

## 操作
ConfigureServices使用
```csharp
services.AddResponseCaching(options =>
{
    options.MaximumBodySize = 1024;//用于指定单个缓存项的最大尺寸，默认65mb
    options.UseCaseSensitivePaths = true;//指定response cache是否对缓存key区分大小写
    //options.SizeLimit = 1024 * 100;//用户指定response cache的最大缓存尺寸，默认是100mb
});
```
Configure使用
```csharp
//使用cache
app.UseResponseCaching();
```
方法上使用
```csharp
[ResponseCache(Duration = 6000)] // 为了测试效果
[HttpGet]
public string Get()
{
    return DateTime.Now.ToString();
}
```
> 参数说明
> Duration：用于指定 Response Cache 的存活时间(秒)。
> Location：用于指定 Response Cache 缓存的位置，有：Any，Client,None。
> NoStore：用于指定是否存储数据在客户端。
> CacheProfileName：用于指定 cache profile 的名字。
> VaryByHeader：用于指定Vary响应头。
> VaryByQueryKeys：基于 querystring 参数来实现缓存。

关于配置查看
> 通过查看响应头：Cache-Control: public,max-age=10  可以看出来被缓存了10s
> 该中间件只缓存http 200的服务端响应，非200的或者一些错误是没有被缓存的。


## 请求示例
当按照上面配置后，我通过postman发现并没有效果，经过检查发现
![image.png](/common/1629346436931-7827203b-7003-4c14-8397-b1ba3a67bee4.png)
这是因为postman默认发送了不缓存的请求头，通过浏览器查看，直接用过地址栏访问该Get接口，也会自动发送不缓存的请求头，不过经过swagger调用则不会增加该请求头，会出来我们想要的结果。

## 了解源码
请求的内容使用IMemoryCache进行缓存的
![image.png](/common/1629345827282-1af8d8e0-a0c8-44e5-9e39-2de2cdec1f62.png)

## 鸡肋
为什么感觉很鸡肋？
1.无法解决恶意请求给服务器带来的压力(如果调用方给请求头设置不缓存，那么服务端缓存就不会生效)。
2.服务器端缓存还有很多限制，包括但是不限于：响应码状态为200的get或者head响应才可能被缓存，报文头不能含有Authorization、Set-Cookie等。
