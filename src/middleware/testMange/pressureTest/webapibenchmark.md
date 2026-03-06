---
title: WebApiBenchmark
lang: zh-CN
date: 2022-07-31
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: webapibenchmark
slug: hghwt9
docsId: '26355330'
---

## 概述
WebApi管理和测试工具
项目地址：[https://github.com/IKende/WebApiBenchmark](https://github.com/IKende/WebApiBenchmark)
windows平台运行方式
```html
dotnet BeetleX.WebApiBenchmarks.dll
```
docker运行方式
```csharp
docker pull ikende/beetlex_webapi_benchmark:v0.8.6
    
docker run -p 9090:9090 --name benchmark -d ikende/beetlex_webapi_benchmark:v0.8.6
    
http://host:9090/
```
