---
title: CsvHelper
lang: zh-CN
date: 2022-06-26
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - csv
---

## 概述
CsvHelper 是用于读取和写入 CSV 文件的库，支持自定义类对象的读写。

## 操作
安装nuget包CsvHelper
```csharp
//写CSV文件
using (var writer = new StreamWriter(path))
using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
{
    csv.WriteRecords(records);
}

using (var writer = new StreamWriter(path,true))
using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
{
    //追加
    foreach (var record in records)
    {
        csv.WriteRecord(record);
    }
}

//读CSV文件
using (var reader = new StreamReader(path))
using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
{
    records = csv.GetRecords<Test>().ToList();
    //逐行读取
    //records.Add(csv.GetRecord<Test>());
}
```
