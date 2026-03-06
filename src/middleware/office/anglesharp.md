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
slug: egrpyb
docsId: '32029985'
---

## 介绍

官网：[https://anglesharp.github.io/](https://anglesharp.github.io/)
GitHub仓库地址：[https://github.com/AngleSharp/AngleSharp](https://github.com/AngleSharp/AngleSharp)

## 操作
安装组件包
```csharp
<PackageReference Include="AngleSharp" Version="0.16.1" />
```
配置地区
```csharp
var config = Configuration.Default.WithCulture("zh-cn");
```

### 读取文档

#### 简单文档操作
```csharp
var str = File.ReadAllText(@"E:\Test\ConsoleApp3\ConsoleApp3\aa.html");

//配置地区
var config = Configuration.Default;
//用指定配置创建一个上下文
var context=BrowsingContext.New(config);
//从请求解析内容
var document = await context.OpenAsync(req => req.Content(str));

//输出html
Console.WriteLine(document.DocumentElement.OuterHtml);

//创建元素并赋值
var p = document.CreateElement("p");
p.TextContent = "新创建的元素";

//添加新标签
document.Body.AppendChild(p);
Console.WriteLine(document.DocumentElement.OuterHtml);

```

#### 字符串转文档
```csharp
var parser = new HtmlParser();
IHtmlDocument document = parser.ParseDocument(str);
var text = new StringWriter();
document.ToHtml(text);
Console.WriteLine(text);
```

### 读取元素

#### 获取某一些元素
```csharp
static async Task UsingLinq()
{
    //Create a new context for evaluating webpages with the default config
    var context = BrowsingContext.New(Configuration.Default);

    //Create a document from a virtual request / response pattern
    var document = await context.OpenAsync(req => req.Content("<ul><li>First item<li>Second item<li class='blue'>Third item!<li class='blue red'>Last item!</ul>"));

    //Do something with LINQ
    var blueListItemsLinq = document.All.Where(m => m.LocalName == "li" && m.ClassList.Contains("blue"));

    //Or directly with CSS selectors
    var blueListItemsCssSelector = document.QuerySelectorAll("li.blue");

    Console.WriteLine("Comparing both ways ...");

    Console.WriteLine();
    Console.WriteLine("LINQ:");

    foreach (var item in blueListItemsLinq)
    {
        Console.WriteLine(item.TextContent);
    }

    Console.WriteLine();
    Console.WriteLine("CSS:");

    foreach (var item in blueListItemsCssSelector)
    {
        Console.WriteLine(item.TextContent);
    }
}
```
或者使用
```csharp
//Same as document.All
var blueListItemsLinq = document.QuerySelectorAll("*").Where(m => m.LocalName == "li" && m.ClassList.Contains("blue"));
```

#### 获取单个元素
```csharp
static async Task SingleElements()
{
    //Create a new context for evaluating webpages with the default config
    var context = BrowsingContext.New(Configuration.Default);

    //Create a new document
    var document = await context.OpenAsync(req => req.Content("<b><i>This is some <em> bold <u>and</u> italic </em> text!</i></b>"));

    var emphasize = document.QuerySelector("em");

    Console.WriteLine("Difference between several ways of getting text:");
    Console.WriteLine();
    Console.WriteLine("Only from C## / AngleSharp:");
    Console.WriteLine();
    Console.WriteLine(emphasize.ToHtml());   //<em> bold <u>and</u> italic </em>
    Console.WriteLine(emphasize.Text());// bold and italic

    Console.WriteLine();
    Console.WriteLine("From the DOM:");
    Console.WriteLine();
    Console.WriteLine(emphasize.InnerHtml);  // bold <u>and</u> italic
    Console.WriteLine(emphasize.OuterHtml);  //<em> bold <u>and</u> italic </em>
    Console.WriteLine(emphasize.TextContent);// bold and italic
}
```
说明：[https://anglesharp.github.io/docs/core/03-Examples](https://anglesharp.github.io/docs/core/03-Examples)

### 修改元素
读取到某一个元素修改并返回最后的结果
```csharp
var str = File.ReadAllText(@"E:\Test\ConsoleApp3\ConsoleApp3\aa.html");

//配置地区
var config = Configuration.Default;
//用指定配置创建一个上下文
var context = BrowsingContext.New(config);
//从请求解析内容
var document = await context.OpenAsync(req => req.Content(str));

//输出html
var mobile = document.QuerySelector(".top2 a");
mobile.TextContent = "没有手机";


var text = new StringWriter();
document.ToHtml(text);
Console.WriteLine(text.ToString());
```

## 资料
官网地址：[https://anglesharp.github.io/](https://anglesharp.github.io/)
