---
title: HtmlAgilityPack
lang: zh-CN
date: 2023-08-06
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: htmlagilitypack
slug: outgqv
docsId: '83255501'
---

## 介绍
这是一个敏捷的HTML解析器，它构建一个读/写DOM，并支持普通的XPATH或XSLT的.Net代码库，允许解析web地址之外的HTML文件，解析器对畸形HTML非常宽容。
文档地址：[https://html-agility-pack.net/documentation](https://html-agility-pack.net/documentation)
GitHub仓库地址：[https://github.com/zzzprojects/html-agility-pack](https://github.com/zzzprojects/html-agility-pack)

## 使用场景

- 将HTML字符串转HTML，然后取值或者循环HTML结构

## 操作
安装nuget包
```csharp
<PackageReference Include="HtmlAgilityPack" Version="1.11.43" />
```

### 解析HTML字符串并循环结构
将html字符串转为HtmlDocument结构，然后读取里面的body元素，修改body元素，然后保存最后结果为HTML字符串。
```csharp
var htmlStr = File.ReadAllText("html.txt");
var htmlDoc = new HtmlDocument();
htmlDoc.LoadHtml(htmlStr);

var htmlbody = htmlDoc.DocumentNode.SelectSingleNode("//body");
foreach (var node in htmlbody.ChildNodes)
{
    if (node.NodeType == HtmlNodeType.Element)
    {
        Console.WriteLine(node.OuterHtml);
    }
}
var resultStr = htmlDoc.ParsedText;
```

### 获取文本值
```csharp
var htmlDoc = new HtmlDocument();
htmlDoc.LoadHtml(htmlStr);
var result = htmlDoc.DocumentNode.InnerText.Trim()
    .Replace(" ", "")
    .Replace("\t", "")
    .Replace("\r\n", "") ?? string.Empty; //清除HTML标签
```


## 资料
[https://mp.weixin.qq.com/s/l3VX5WuNNRZ4UG9McwTSQg](https://mp.weixin.qq.com/s/l3VX5WuNNRZ4UG9McwTSQg) | 聊一聊.NET的网页抓取和编码转换
