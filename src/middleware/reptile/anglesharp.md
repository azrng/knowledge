---
title: AngleSharp
lang: zh-CN
date: 2022-10-26
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: anglesharp
slug: ktztw4
docsId: '67220730'
---

## 介绍
[AngleSharp](https://www.yuque.com/docs/share/73bf6054-28b9-4a1f-8253-b621453f54ea?view=doc_embed)

## 示例
爬取博客园事例：
```csharp
var list = new List<HotNews>();
var config = Configuration.Default.WithDefaultLoader();
var address = "https://www.cnblogs.com";
var context = BrowsingContext.New(config);
var document = await context.OpenAsync(address);

var cellSelector = "article.post-item";
var cells = document.QuerySelectorAll(cellSelector);

foreach (var item in cells)
{
    var a = item.QuerySelector("section>div>a");
    list.Add(new HotNews
    {
        Title = a.TextContent,
        Url = a.GetAttribute("href")
    });
}
```
爬取指定class标签下的li集合
```csharp
var parser = new HtmlParser();
IHtmlDocument dom = parser.ParseDocument("网页字符串");
var data = dom.QuerySelectorAll(".name_show li").ToList();
for (int i = 0; i < 500; i++)
{
    Console.WriteLine(data[i].InnerHtml);
}
```
