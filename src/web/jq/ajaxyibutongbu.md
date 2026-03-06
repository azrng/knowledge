---
title: ajax异步同步
lang: zh-CN
date: 2022-08-14
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: ajaxyibutongbu
slug: hzowyt
docsId: '29634400'
---
Ajax请求默认的都是异步的
如果想同步 async设置为false就可以（默认是true）
```csharp
var html = $.ajax({
  url: "some.php",
  async: false
}).responseText;
```
 
或者在全局设置Ajax属性
```csharp
$.ajaxSetup({
  async: false
  });
```
再用post，get就是同步的了
