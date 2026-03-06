---
title: aspx接受postman传的json对象
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: aspxjieshoupostmanchuandejsonduixiang
slug: sao8bq
docsId: '31541425'
---
通过postman的post方式调用aspx页面，传输数据
 
```csharp
using (var reader = new System.IO.StreamReader(Request.InputStream))
        {
            String xmlData = reader.ReadToEnd();
            if (!string.IsNullOrEmpty(xmlData))
            {
                         //业务处理
             }
        }
```

