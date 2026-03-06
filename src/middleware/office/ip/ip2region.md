---
title: ip2region
lang: zh-CN
date: 2022-06-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: ip2region
slug: yocdb2
docsId: '80764275'
---

## 介绍
ip2region - 准确率99.9%的**离线IP**地址定位库，0.0x毫秒级查询，ip2region.db数据库只有数MB，提供了java,php,c,python,nodejs,golang,c#等查询绑定和Binary,B树,内存三种查询算法。每条ip数据段都固定了格式：

- 城市Id|国家|区域|省份|城市|ISP_

github地址:https://github.com/lionsoul2014/ip2region

## 操作
引用组件
```csharp
<PackageReference Include="IP2Region" Version="1.2.0" />
```
将源码里面data文件夹下的数据库文件ip2region.db拷贝到项目中并且设置始终复制，然后编写代码
```csharp
using (var _search = new DbSearcher(Environment.CurrentDirectory + @"\DB\ip2region.db"))
{
    Console.WriteLine(_search.MemorySearch("183.129.193.166").Region);
}
```

