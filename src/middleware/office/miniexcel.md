---
title: MiniExcel
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: miniexcel
slug: toi2vq
docsId: '70203542'
---

## 概述
MiniExcel简单、高效避免OOM的.NET处理Excel查、写、填充数据工具。
目前主流框架大多需要将数据全载入到内存方便操作，但这会导致内存消耗问题，MiniExcel 尝试以 Stream 角度写底层算法逻辑，能让原本1000多MB占用降低到几MB，避免内存不够情况。

Github：[https://gitee.com/dotnetchina/MiniExcel](https://gitee.com/dotnetchina/MiniExcel)


## 操作


### 读Excel

#### IEnumerable
通过IEnumerable延迟查询的方式，避免使用ToList一下子将数据读取到内存中，显著降低内存(对比NPOI等)

```csharp
var filePath = "D:\\Downloads\\xxx.xlsx";
var stream = File.Open(filePath, FileMode.Open, FileAccess.Read);
var sheet = stream.Query();
foreach (ExpandoObject row in sheet)
{
    var dictionary = (IDictionary<string, object>)row;
    Console.WriteLine(dictionary.Count);
}
```

#### Dynamic Query转IDictionary

```csharp
var filePath = "D:\\Downloads\\xxx(1).xlsx";
foreach(IDictionary<string,object> row in MiniExcel.Query(filePath))
{
    Console.WriteLine(row.Count);
}
```

### 读取大文件硬盘

此优化是以`时间换取内存减少`，所以读取效率会变慢，假如不需要能用以下代码关闭硬盘缓存

```csharp
var config = new OpenXmlConfiguration { EnableSharedStringCache = false };
MiniExcel.Query(path,configuration: config)
```

也能使用 SharedStringCacheSize 调整 sharedString 文件大小超过指定大小才做硬盘缓存

```csharp
var config = new OpenXmlConfiguration { SharedStringCacheSize=500*1024*1024 };
MiniExcel.Query(path, configuration: config);
```





## 资料

[https://mp.weixin.qq.com/s/KytkuLI28jaUoKIJuEmXng](https://mp.weixin.qq.com/s/KytkuLI28jaUoKIJuEmXng) | 开源项目MiniWord .NET Word 操作由Word模板和数据简单、快速生成文件
