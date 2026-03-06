---
title: Nswag
lang: zh-CN
date: 2021-06-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: nswag
slug: miodht
docsId: '30112550'
---
添加nuget引用Nawag.AspNetCore
然后在startup.cs方法中添加服务
```csharp
services.AddSwaggerDocument(); //注册Swagger 服务
```
然后再configure中添加nswag中间件
```csharp
app.UseOpenApi(); //添加swagger生成api文档（默认路由文档 /swagger/v1/swagger.json）
 app.UseSwaggerUi3();//添加Swagger UI到请求管道中(默认路由: /swagger).
```
然后还需要去属性那里生成xml文件
访问方式的话还是浏览器中查看然后再url后面添加/swagger
