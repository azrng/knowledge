---
title: Borwser对象
lang: zh-CN
date: 2023-08-19
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: borwserduixiang
slug: bnzzlx
docsId: '29630422'
---

## Window 对象
Window 对象表示浏览器打开的窗口

### top属性
top属性返回当前窗口的最顶层浏览器窗口
语法：
Window.top
 
实例
```csharp
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>菜鸟教程(runoob.com)</title>
<script>
function check(){
    if (window.top!=window.self) {
        document.write("<p>这个窗口不是最顶层窗口!我在一个框架?</p>")
    }
    else{ 
        document.write("<p>这个窗口是最顶层窗口!</p>")
    } 
}
</script>
</head>
<body>
    
<input type="button" onclick="check()" value="检查窗口">
    
</body>
</html>
```


## Navigatot 对象

### appversion
appVersion属性可返回浏览器的平台和版本信息，该属性是一个只读的字符串。
语法：
navigator.appVersion
 
实例1：返回浏览器版本
```csharp
<script>
document.write("版本信息: " + navigator.appVersion);
</script>
```
实例2：
```csharp
if (navigator.appVersion.indexOf("MSIE") == -1) {
    alert("提醒 : 本管理系统建议议采用Internet Explorer 5.5 (或以上版本) 的浏览器。请开启浏览器的 Cookies 与JavaScript 功能。");
}
```

## Screen 对象

## History 对象

## Location 对象

## 存储对象
