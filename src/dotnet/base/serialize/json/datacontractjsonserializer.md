---
title: DataContractJsonSerializer
lang: zh-CN
date: 2022-01-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: datacontractjsonserializer
slug: ick9p3
docsId: '65787805'
---
> 最后更新时间：2022年1月27日16:31:45


## 概述
在.NetF中使用一种序列化方法。

## 操作
> 示例环境：.NetF4.7

引用组件
```json
System.Runtime.Serialization
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
var serializer = new DataContractJsonSerializer(typeof(Person));
var stream = new MemoryStream();
serializer.WriteObject(stream, p);
byte[] dataBytes = new byte[stream.Length];
stream.Position = 0;
stream.Read(dataBytes, 0, (int)stream.Length);
string dataString = Encoding.UTF8.GetString(dataBytes);//{\"Age\":26,\"Name\":\"xfh\"}
```

## 总结
目前该方法已经不用了已经有更好的Newtonsoft或者官方的System.Test.Json。
