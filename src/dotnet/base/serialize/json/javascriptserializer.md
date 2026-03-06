---
title: JavaScriptSerializer
lang: zh-CN
date: 2022-01-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: javascriptserializer
slug: mpqyxq
docsId: '65787053'
---
> 最后更新时间：2022年1月27日16:28:19


## 概述
在.NetF中使用一种序列化方法。

## 操作
> 示例环境：.NetF4.7

引用组件
```json
System.Web.Extensions
```
先编写要序列化的类
```json
[Serializable]
public class Person
{
    public string Name { set; get; }
    public int Age { set; get; }
}
```
序列化和反序列化
```json
// 创建对象
var p = new Person
{
    Name = "xfh",
    Age = 26
};
var javaScript = new JavaScriptSerializer();
var json = javaScript.Serialize(p);//序列化：{\"Name\":\"xfh\",\"Age\":26}
var result = javaScript.Deserialize<Person>(json);//反序列化
```

## 总结
目前该方法已经不用了已经有更好的Newtonsoft或者官方的System.Test.Json。
