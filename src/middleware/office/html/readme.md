---
title: 说明
lang: zh-CN
date: 2022-06-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - html
---

## HtmlSanitizer

HtmlSanitizer 是一个强大的库，它能够审查和清理 HTML 内容，移除或转义那些可能被用于 XSS 攻击的标签和属性。

仓库地址：[https://github.com/mganss/HtmlSanitizer](https://github.com/mganss/HtmlSanitizer)

### 操作

**简单示例：清理 HTML 内容**

```csharp
// 引入Ganss.Xss命名空间，以便使用HtmlSanitizer类
using Ganss.Xss;

// 创建HtmlSanitizer类的实例
var sanitizer = new HtmlSanitizer();

// 定义一个包含潜在XSS攻击向量的HTML字符串
// 这里的HTML包含<script>标签和带有JavaScript代码的onload属性
// 以及一个带有JavaScript代码的style属性
var html = @"<script>alert('xss')</script><div onload=""alert('xss')"""
    + @"style=""background-color: rgba(0, 0, 0, 1)"">Test<img src=""test.png"""
    + @"style=""background-image: url(javascript:alert('xss')); margin: 10px""></div>";

// 使用sanitizer对象的Sanitize方法来清理HTML
// 第一个参数是要清理的HTML字符串
// 第二个参数是基URL，用于解析相对URL
var sanitized = sanitizer.Sanitize(html, "https://www.xxx.com");

// 定义一个期望的清理后的HTML字符串
// 这个字符串中不包含任何脚本，只包含安全的样式和图像
var expected = @"<div style=""background-color: rgba(0, 0, 0, 1)"">"
    + @"Test<img src=""https://www.xxx.com/test.png""  style=""margin: 10px""></div>";

// 使用Assert.Equal方法来验证清理后的HTML是否符合预期
Assert.Equal(expected, sanitized);
```

#### **添加允许的属性**

```csharp
var sanitizer = new HtmlSanitizer();
sanitizer.AllowedAttributes.Add("class");
var sanitized = sanitizer.Sanitize(html);
```

#### **添加允许的URL方案**

```csharp

var sanitizer = new HtmlSanitizer();
// 允许用户点击链接直接发送邮件
sanitizer.AllowedSchemes.Add("mailto");
```

