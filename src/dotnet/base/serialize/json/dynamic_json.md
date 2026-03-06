---
title: Dynamic.Json
lang: zh-CN
date: 2022-08-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dynamic_json
slug: xdk2hb
docsId: '90089292'
---

## 介绍
用于基于新的System.Text.Json提供轻量级动态包装器。
github：[https://github.com/Groxan/Dynamic.Json](https://github.com/Groxan/Dynamic.Json)

## 操作

## 实例化动态Json
```csharp
// parse json from string/stream/etc, for example
var json = DJson.Parse(@"
{
    ""versionNumber"": 1,
    ""product_name"": ""qwerty"",
    ""items"": [ 1, 2, 3 ],
    ""settings"": {
        ""enabled"": false
    }
}");

// or read json from file
var json = DJson.Read("file.json");

// or get json from HTTP
var json = await DJson.GetAsync("https://api.com/endpoint");

// or use HttpClient extension
var json = await httpClient.GetJsonAsync("https://api.com/endpoint");
```

### 中间件读取请求体
```csharp
if (content.Request.HasJsonContentType())
{
    var requestStream = content.Request.BodyReader.AsStream();
    dynamic jsonObject = DJson.Parse(requestStream);
    content.Items["BodyJson"] = jsonObject;
    await _next(content);
}
```
