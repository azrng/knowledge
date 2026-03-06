---
title: 导出文件
lang: zh-CN
date: 2023-09-26
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: daochuwenjian
slug: gawfa6lirk6cycal
docsId: '140128674'
---

## 导出MD文件
安装nuget包，仓库地址：[https://github.com/liuweichaox/SwaggerDoc](https://github.com/liuweichaox/SwaggerDoc)
```csharp
<PackageReference Include="SwaggerDoc" Version="1.0.1" />
```

然后在正常配置swagger的基础上去添加导出md文件的配置
```csharp
using SwaggerDoc.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerDoc(); //（用于MarkDown生成）

var app = builder.Build();
```

然后就可以通过访问：https://{localhost}:{port}/doc?swaggerVersion={swaggerVersion} 进行导出md文件
说明：swaggerVersion 是 swagger 文档版本（AddSwaggerGen 中的 Version 参数，默认 v1）
