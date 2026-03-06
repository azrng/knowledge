---
title: BinaryFormatter
lang: zh-CN
date: 2023-09-07
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: binaryformatter
slug: cgk2q1
docsId: '65747192'
---

## 概述
二进制序列化

注意：BinaryFormatter已经弃用，因为包含安全漏洞，资料：[https://learn.microsoft.com/zh-cn/dotnet/standard/serialization/binaryformatter-security-guide#binaryformatter-security-vulnerabilities](https://learn.microsoft.com/zh-cn/dotnet/standard/serialization/binaryformatter-security-guide#binaryformatter-security-vulnerabilities)

## 操作
> 本文示例环境：vs2022、.Net6

模型类
```csharp
[Serializable]
public class Person
{
    public string Name { set; get; }
    public int Age { set; get; }
}
```
> 注意：Serializable在二进制序列化时候必须添加

创建变量
```json
// 创建对象
var p = new Person
{
    Name = "xfh",
    Age = 26
};
```

### 二进制序列化
```csharp
//创建二进制文件temp.dat
using var fileStream = new FileStream("d:\\temp.dat", FileMode.Create);
BinaryFormatter bf = new BinaryFormatter();
//将Person实例对象序列化给fileStream流：其含义是这时候的Person对象已经存储到temp.dat文件中
bf.Serialize(fileStream, p);
```

### 二进制反序列化
```csharp
//创建二进制文件temp.dat
using var fileStream = new FileStream("d:\\temp.dat", FileMode.Open);
BinaryFormatter bf = new BinaryFormatter();
var per = (Person)bf.Deserialize(fileStream);
```

### 工具类
深拷贝使用工具类
```csharp
public static class CloneUtil
{
    public static T Clone<T>(T obj)
    {
        if (!typeof(T).IsSerializable)
            throw new ArgumentException("The type must be serializable.", nameof(obj));
        if (obj == null)
            return default(T);
#pragma warning disable SYSLIB0011 // 类型或成员已过时
        var formatter = new BinaryFormatter() as IFormatter;
#pragma warning restore SYSLIB0011 // 类型或成员已过时
        using var serializationStream = new MemoryStream();
        formatter.Serialize(serializationStream, obj);
        serializationStream.Seek(0L, SeekOrigin.Begin);
        return (T)formatter.Deserialize(serializationStream);
    }
}
```

## 总结
这种方法在.net6中已经提示过时了，在.netCore中应该使用其他方法。
