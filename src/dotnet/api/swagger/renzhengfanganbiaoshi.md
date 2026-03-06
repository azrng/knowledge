---
title: 认证方案标识
lang: zh-CN
date: 2023-10-13
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: renzhengfanganbiaoshi
slug: kedd13luou8rgm43
docsId: '114120076'
---

## 概述
不论那种认证方式，需要注意的就是下面代码
```csharp
//定义认证方式
options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme()
{
    Description = "输入你的的ApiKey", // 认证方式的备注
    Name = "x-api-key", //jwt默认的参数名称
    In = ParameterLocation.Header, // 认证标识存储的位置
    Type = SecuritySchemeType.ApiKey,
    Scheme = "ApiKeySchema" //认证方案名
});
```

## Jwt认证
方式一，输入的请求头不需要带Bearer
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "API说明"
    });

    //定义JwtBearer认证方式一
    options.AddSecurityDefinition("JwtBearer", new OpenApiSecurityScheme()
    {
        Description = "这是方式一(直接在输入框中输入认证信息，不需要在开头添加Bearer)",
        Name = "Authorization", //jwt默认的参数名称
        In = ParameterLocation.Header, //jwt默认存放Authorization信息的位置(请求头中)
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    //声明一个Scheme，注意下面的Id要和上面AddSecurityDefinition中的参数name一致
    var scheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference 
            { 
                Type = ReferenceType.SecurityScheme,
                Id = "JwtBearer"
            }
    };
    //注册全局认证（所有的接口都可以使用认证）
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = Array.Empty<string>()
    });
});
```
方式二，输入的请求头需要带Bearer
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "API说明"
    });

    //定义JwtBearer认证方式二
    options.AddSecurityDefinition("JwtBearer", new OpenApiSecurityScheme()
    {
        Description = "这是方式二(JWT授权(数据将在请求头中进行传输) 直接在下框中输入Bearer {token}（注意两者之间是一个空格）)",
        Name = "Authorization", //jwt默认的参数名称
        In = ParameterLocation.Header, //jwt默认存放Authorization信息的位置(请求头中)
        Type = SecuritySchemeType.ApiKey
    });

    //声明一个Scheme，注意下面的Id要和上面AddSecurityDefinition中的参数name一致
    var scheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference 
            { 
                Type = ReferenceType.SecurityScheme,
                Id = "JwtBearer"
            }
    };
    //注册全局认证（所有的接口都可以使用认证）
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = Array.Empty<string>()
    });
});
```

## ApiKey
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "API说明"
    });
    
    //定义认证方式
    options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme()
    {
        Description = "输入你的的ApiKey",
        Name = "x-api-key", //默认的参数名称
        In = ParameterLocation.Header, 
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKeySchema"
    });

    //声明一个Scheme，注意下面的Id要和上面AddSecurityDefinition中的参数name一致
    var scheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference 
            { 
                Type = ReferenceType.SecurityScheme,
                Id = "ApiKey"
            }
    };
    //注册全局认证（所有的接口都可以使用认证）
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = Array.Empty<string>()
    });
});
```
