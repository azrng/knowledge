---
title: 文本处理
lang: zh-CN
date: 2024-02-15
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - text
---

## Chinese

一个功能强大的中文处理库，Chinese 是一个中文解析通用工具，基于 C# 开发，包括拼音，简繁转换，数字读法，货币读法。和其他工具不一样的是，Chinese 可以在本地离线使用，而不需要对接到其他的第三方平台。

仓库地址：[https://github.com/zmjack/Chinese](https://github.com/zmjack/Chinese)

## Slugify可读性强的URL

Microsoft .NET 的简单 Slug / Clean URL 生成器帮助程序。可以实现任何字符串的连字符、小写字符、字母数字版本，删除变音符号，折叠空格和破折号以及修建空格。

Nuget：https://www.nuget.org/packages/Slugify.Core



简单示例，安装nuget包

```
PM> Install-Package Slugify.Core
```

将字符串添加连字符

```c#
void Main()
{
	var config = new SlugHelperConfiguration();
	config.ForceLowerCase = true;

	SlugHelper helper = new SlugHelper(config);

	String title = "Helllo World!";

	String slug = helper.GenerateSlug(title);

	Console.WriteLine(slug);
}

// helllo-world
```

## YamlDotNet

在 .NET 中，YamlDotNet 库是处理 YAML 文件的常用选择。该库非常易于使用，并为大多数 YAML 文件提供了非常好的支持。处理 YAML 文件时，提供两种不同的选项：通过字典访问键值或反序列化为类。这两种方法都有其优点和缺点，但在大多数情况下，反序列化为类是更方便、更好的选择。YamlDotNet从 YAML 反序列化。



文档：[https://mp.weixin.qq.com/s/0MieuyqUIEmDoxTNwCT85w](https://mp.weixin.qq.com/s/0MieuyqUIEmDoxTNwCT85w)





