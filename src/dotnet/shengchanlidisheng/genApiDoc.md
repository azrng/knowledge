---
title: API文档生成
lang: zh-CN
date: 2023-11-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNet
tag:
  - api
# 是否显示到列表
article: false
---

## Sandcastle

可以将c#类库方法根据注释生成帮助文档(chm)的工具

工具使用心得：https://www.cnblogs.com/edisoner/p/7494279.html

使用文档：https://mp.weixin.qq.com/s/ejmSHn43j32eGiTA62VHgQ

### 下载安装

Help File Builder and Tools v2021.4.9.0最新版本

下载链接：https://github.com/EWSoftware/SHFB/releases

单纯Sandcastle好像是没有界面的， 这个链接提供的下载可以包含图形界面。

注意：如果需要生成chm还需要微软的 MicrosoftHTMLHelpWorkshop 支持，Sandcastle生成时会自动去查找MicrosoftHTMLHelpWorkshop 的安装目录。

## DocFX

:::tip

貌似微软使用的就是该工具

:::

DocFX是一个静态文档生成器，用于帮助开发者创建高质量的API文档、用户手册和其他类型的技术文档。它能够从Markdown文件、代码注释和其他文档源自动生成文档，并支持多种文档格式。DocFX提供了丰富的主题和插件，允许用户定制文档的外观和功能。它被广泛用于软件项目、开源项目和企业文档等领域，为文档的创建和维护提供了便捷的工具。

它具有以下功能：

1. **自动生成API文档：** DocFX可以从代码注释中提取信息，自动生成详细的API文档，包括类、方法、参数等说明。
2. **Markdown支持：** 除了API文档，它还支持使用Markdown语法创建教程、使用手册等其他文档。
3. **自定义主题：** 用户可以根据需求定制文档的主题，使文档风格符合项目的整体设计。
4. **多语言支持：** DocFX支持多种编程语言，包括C#和VB等。
5. **与代码集成：** 可以直接从源代码中提取注释，与代码紧密集成，确保文档的准确性。
6. **版本控制：** 支持版本控制，可以为不同版本的代码生成相应版本的文档。
7. **丰富的插件系统：** 具有丰富的插件系统，可以扩展其功能，满足特定需求。

仓库地址：https://github.com/dotnet/docfx

官网：[https://dotnet.github.io/docfx/]

