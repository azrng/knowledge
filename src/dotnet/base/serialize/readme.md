---
title: 说明
lang: zh-CN
date: 2023-07-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - serialize
---

## 概述
序列化：将对象的状态信息以及类型信息，转换为一种易于传输或者存储形式(流，即字节序列)的过程。
序列化整理流程(图片来自微软官网)  
![](/common/1643209935836-5d34426a-c9d4-469b-ae24-35b3cbf8f3f3.gif)  
该对象被序列化为携带数据的流。该流还可能包含有关对象类型的信息，例如其版本、文化和程序集名称。从该流中，对象可以存储在数据库、文件或内存中。
反序列化：与序列化相反，将流转换为对象的过程。

## 常见的序列化格式和方法
在.net中，常见的序列化格式主要有json，二进制和xml，总结如图：

| 数据格式 | 序列化的方法 | 程序集 | 命名空间 | 描述 |
| --- | --- | --- | --- | --- |
| JSON | JavaScriptSerializer | System.Web.Extensions | System.Web.Script.Serialization | 主要在web端，.netf使用 |
| JSON | DataContractJsonSerializer | System.Runtime.Serialization | System.Runtime.Serialization.Json | 主要在web端，.netf使用 |
| JSON | Newtonsoft.Json  | Newtonsoft.Json  | 通用 |  |
| JSON | System.Text.Json | System.Text.Json  | 通用 |  |
| 二进制 |  |  |  |  |
|  |  |  |  |  |

![image.png](/common/1643209449243-64ba2184-0c09-4c1e-bcad-a9b22a338964.png)
注意事项：

- .net中所有用于序列化的实体的class上应该加上[Serializable]标记，如果不加的话，json序列化的时候没有问题，但是**使用BinaryFormatter进行二进制序列化的时候就会报错**。
- 如果应用在wcf中，所有实体的class上还应该加上[DataContract]标记，字段上要加[DataMember]。
- 在使用newtonsoft.json的时候，如果实体类加了[DataContract]，有些字段加了[DataMember]，而有些字段没有加，但是序列化的时候也要包含那些没有加[DataMember]的字段，可以在实体类上加[JsonObject(MemberSerialization.OptOut)]来解决，表示输出全部的公共字段。
- 使用newtonsoft.json时，System.Web.UI.WebControls.ListItem不能序列化，解决方法是，自定义一个类并标记[Serializable]。

## 资料
[https://www.cnblogs.com/mcgrady/p/5674410.html](https://www.cnblogs.com/mcgrady/p/5674410.html)：.Net中的序列化  
[https://www.cnblogs.com/Cwj-XFH/p/10330671.html](https://www.cnblogs.com/Cwj-XFH/p/10330671.html)：.Net中的序列化和反序列化  
[https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/serialization/](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/serialization/) ：序列化(c#)  
[https://mp.weixin.qq.com/s/_J3B1sJrFC8oT4Xx3e3wyQ](https://mp.weixin.qq.com/s/_J3B1sJrFC8oT4Xx3e3wyQ) | .NET性能优化-是时候换个序列化协议了
