---
title: MessagePack
lang: zh-CN
date: 2023-09-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: messagepack
slug: sbrkmq
docsId: '30019753'
---

## 概述
MessagePack for C＃（MessagePack-CSharp）是用于C＃的极速MessagePack序列化程序，比MsgPack-Cli快10倍，与其他所有C＃序列化程序相比，具有最好的性能。 MessagePack for C＃具有内置的LZ4压缩功能，可以实现超快速序列化和二进制占用空间小。 性能永远是重要的！ 可用于游戏，分布式计算，微服务，数据存储到Redis等。支持.NET, .NET Core, Unity, Xamarin。MessagePack比json序列化快并且小。

## 操作
引用nuget包
```csharp
<PackageReference Include="MessagePack" Version="2.5.124" />
```

### 基础操作
创建一个用户信息类
```csharp
/// <summary>
/// 用户信息
/// </summary>
[MessagePackObject]
public partial class UserInfo
{
    [Key(0)] public int Id { get; set; }
    [Key(2)] public string Name { get; set; } = null!;
    [Key(1)] public bool IsVaild { get; set; }
    [Key(3)] public double Grade { get; set; }
    [Key(4)] public long Identity { get; set; }
}
```
执行序列化操作
```csharp
public static class SearializeHelper
{
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static byte[] Serialize<T>(this T origin)
    {
        return MessagePackSerializer.Serialize(origin);
    }

    public static T Deserialize<T>(this byte[] bytes)
    {
        return MessagePackSerializer.Deserialize<T>(bytes);
    }
}

var userInfo = new UserInfo
{
    Id = 1,
    Name = "张三",
    Identity = 123_456_789L,
    IsVaild = true,
    Grade = 10.1,
};

var bytes = userInfo.Serialize();
var base64 = Convert.ToBase64String(bytes);
```

### Lz4 压缩
提供了 Lz4 算法的压缩程序,压缩有两种方式，Lz4Block和Lz4BlockArra，我们只需要配置 Option，即可使用 Lz4 压缩
```csharp
public static class SearializeHelper
{
    public static readonly MessagePackSerializerOptions MpLz4BOptions = MessagePackSerializerOptions.Standard
        .WithCompression(MessagePackCompression.Lz4Block);

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static byte[] Serialize<T>(this T origin)
    {
        return MessagePackSerializer.Serialize(origin, MpLz4BOptions);
    }

    public static T Deserialize<T>(this byte[] bytes)
    {
        return MessagePackSerializer.Deserialize<T>(bytes, MpLz4BOptions);
    }
}
```
可能小的对象压缩后看不出来效果，但是当我们创建一个大一点的对象，再次进行序列化就可以看到压缩前后的区别了
```csharp
var list = new List<UserInfo>();
for (int i = 0; i < 1000; i++)
{
    list.Add(new UserInfo
    {
        Id = i,
        Name = "张三" + i,
        Identity = 123_456_789L + i,
        IsVaild = true,
        Grade = 10.1 + i,
    });
}

var bytes2 = list.Serialize();
var base642 = Convert.ToBase64String(bytes2);
```

```csharp
安装MessagePack组件
分析器：Install-Package MessagePackAnalyzer
分析器是在类上加MessagePackAnalyzer检测格式是否规范

    [MessagePackObject]
    public class MyClass
    {
        // Key 是序列化索引，对于版本控制非常重要。
        [Key(0)]
        public int Age { get; set; }

        [Key(1)]
        public string FirstName { get; set; }

        [Key(2)]
        public string LastName { get; set; }

        // 公共成员中不序列化目标，标记IgnoreMemberAttribute
        [IgnoreMember]
        public string FullName { get { return FirstName + LastName; } }
    }

 			var mc = new MyClass
            {
                Age = 99,
                FirstName = "hoge",
                LastName = "huga",
            };

            // 序列化
            var bytes = MessagePackSerializer.Serialize(mc);
            //反序列化
            var mc2 = MessagePackSerializer.Deserialize<MyClass>(bytes);

            // 你可以将msgpack二进制转储为可读的json。
            // 在默认情况下，MeesagePack for C＃减少了属性名称信息。
            // [99,"hoge","huga"]
            var json = MessagePackSerializer.ConvertToJson(bytes);

            Console.WriteLine(json);
```

## 资料
[https://www.cnblogs.com/stulzq/p/8039933.html](https://www.cnblogs.com/stulzq/p/8039933.html) | 快速序列化组件MessagePack介绍 - 晓晨Master - 博客园
[https://mp.weixin.qq.com/s/_J3B1sJrFC8oT4Xx3e3wyQ](https://mp.weixin.qq.com/s/_J3B1sJrFC8oT4Xx3e3wyQ) | .NET性能优化-是时候换个序列化协议了
