---
title: HtmlAgilityPack
lang: zh-CN
date: 2023-02-19
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: htmlagilitypack
slug: rxu7w8
docsId: '32029959'
---

## 介绍
[HtmlAgilityPack](https://www.yuque.com/docs/share/8a134a56-0272-4d3d-9a41-c84b5f35af89?view=doc_embed)

## 示例 
抓取事例：
```csharp
var list = new List<HotNews>();
var web = new HtmlWeb();
var htmlDocument = await web.LoadFromWebAsync("https://www.cnblogs.com/");
var node = htmlDocument.DocumentNode.SelectNodes("//*[@id='post_list']/article/section/div/a").ToList();
foreach (var item in node)
{
    list.Add(new HotNews
    {
        Title = item.InnerText,
        Url = item.GetAttributeValue("href", "")
    });
}
```

