---
title: Issue
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shiyongzongjie
slug: ufr8ks
docsId: '29411611'
---

## PersistentChannel timed out

如果出现错误：System.TimeoutException: The operation requested on PersistentChannel timed out
原因是：

```
var bus = RabbitHutch.CreateBus("host=localhost;username=guest;password=guest");
```

这里面=必须直接接值，不能有空格

netcore使用rabbit [https://www.cnblogs.com/stulzq/p/7551819.html](https://www.cnblogs.com/stulzq/p/7551819.html)
