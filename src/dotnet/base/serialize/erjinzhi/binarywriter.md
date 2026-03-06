---
title: BinaryWriter
lang: zh-CN
date: 2023-09-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: binarywriter
slug: oe5o6osa1ywkawaw
docsId: '138322798'
---

## 概述
[BinaryReader](https://learn.microsoft.com/zh-cn/dotnet/api/system.io.binaryreader) 和 [BinaryWriter](https://learn.microsoft.com/zh-cn/dotnet/api/system.io.binarywriter)，适用于 XML 和 JSON。

## 操作

### 序列化示例
```csharp
using System;
using System.IO;

public static class BinarySerializationHelper
{
    // 使用 BinaryWriter 将对象序列化为二进制数据
    public static byte[] SerializeObjectToBinary<T>(T obj)
    {
        if (obj is null)
            return null;

        using (MemoryStream memoryStream = new MemoryStream())
        {
            using (BinaryWriter writer = new BinaryWriter(memoryStream))
            {
                // 根据对象类型实现自定义的序列化逻辑
                // 这里只是一个简单示例，你需要根据自己的对象结构编写相应的序列化逻辑
                if (obj is Person person)
                {
                    writer.Write(person.Name);
                    writer.Write(person.Age);
                }
                // 添加其他对象类型的序列化逻辑

                writer.Flush();
                return memoryStream.ToArray();
            }
        }
    }
}

```
在上述示例中，我们使用 BinaryWriter 将 Person 对象序列化为二进制数据。请注意，这只是一个简单的示例，你需要根据自己的对象结构编写相应的序列化逻辑。
以下是一个 Person 类的示例，用于演示如何使用 BinaryWriter 进行序列化：
```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

```
然后，你可以使用 SerializeObjectToBinary 方法将对象序列化为二进制数据：
```csharp
var person = new Person { Name = "John", Age = 30 };
byte[] binaryData = BinarySerializationHelper.SerializeObjectToBinary(person);

```
