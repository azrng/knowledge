---
title: Mapperly
lang: zh-CN
date: 2025-05-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - mapper
  - Mapperly
---

## 前言

AutoMapper等工具，让映射的两个类之间断了引用关系，当其中一个类别修改比如说修改名称的时候，容易忽略没有修改映射的类，导致出现问题。

## 概述

Mapperly是一个专为.NET环境打造的现代化源代码生成器，专注于生成对象映射代码，可极大提升开发效率。

仓库地址：[https://github.com/riok/mapperly](https://github.com/riok/mapperly)

文档地址：https://mapperly.riok.app/docs/intro/

## 操作

引用nuget包

```xml
<PackageReference Include="Riok.Mapperly" Version="4.2.1-next.2"/>
```

### 最佳实践

已知两个model类

```c#
public enum Gender
{
    Unknown,
    Male,
    Female,
}

public class UserViewObject
{
    public string Id { get; set; }

    public string Name { get; set; }

    public Gender UserGender { get; set; }

    public DateTime Birthday { get; set; }

    public string HomeAddress { get; set; }

    public string Remark { get; set; }
}

public class UserEntry
{
    public string Id { get; set; }

    public string Name { get; set; }

    public int Gender { get; set; }

    public string Birthday { get; set; }

    public DateTime CreateTime { get; set; }

    public DateTime UpdateTime { get; set; }

    public string Address { get; set; }
}
```

需要将将 UserViewObject 转换为 UserEntry编写Mapper类

```csharp
/// <summary>
/// 对象映射类
/// </summary>
[Mapper(UseDeepCloning = true,
    AutoUserMappings = false,
    ThrowOnMappingNullMismatch = true,
    ThrowOnPropertyMappingNullMismatch = true,
    EnabledConversions = MappingConversionType.ExplicitCast | MappingConversionType.ImplicitCast)]
public partial class UserViewObjectMapper
{
    [MapProperty(nameof(UserViewObject.HomeAddress), nameof(UserEntry.Address))] // Map property with a different name in the target type
    [MapProperty(nameof(UserViewObject.UserGender),
        nameof(UserEntry.Gender),
        Use = nameof(ToIntegerGender))]
    [MapProperty(nameof(UserViewObject.Birthday), nameof(UserEntry.Birthday), Use = nameof(ToBirthdayString))]
    [MapperIgnoreSource(nameof(UserViewObject.Remark))]
    [MapperIgnoreTarget(nameof(UserEntry.CreateTime))]
    [MapperIgnoreTarget(nameof(UserEntry.UpdateTime))]
    public static partial UserEntry ToUserEntry(UserViewObject vo);

    [MapProperty(nameof(UserEntry.Address), nameof(UserViewObject.HomeAddress))]
    [MapProperty(nameof(UserEntry.Gender), nameof(UserViewObject.UserGender), Use = nameof(ToGender))]
    [MapProperty(nameof(UserEntry.Birthday), nameof(UserViewObject.Birthday), Use = nameof(ToBirthdayDatetime))]
    [MapperIgnoreSource(nameof(UserEntry.CreateTime))]
    [MapperIgnoreSource(nameof(UserEntry.UpdateTime))]
    [MapperIgnoreTarget(nameof(UserViewObject.Remark))]
    public static partial UserViewObject ToUserViewObject(UserEntry entry);

    private static int ToIntegerGender(Gender gender)
    {
        return (int)gender;
    }

    private static Gender ToGender(int gender)
    {
        return gender switch
        {
            0 => Gender.Unknown,
            1 => Gender.Male,
            2 => Gender.Female,
            _ => throw new ArgumentOutOfRangeException(nameof(gender)),
        };
    }

    private static string ToBirthdayString(DateTime birthday)
    {
        return birthday.ToString("yyyy-MM-dd");
    }

    private static DateTime ToBirthdayDatetime(string date)
    {
        return DateTime.Parse(date);
    }
}
```

进行转换映射

```c#
// 创建示例 UserViewObject 对象
        var viewObject = new UserViewObject
                         {
                             Id = "1",
                             Name = "张三",
                             UserGender = Gender.Male,
                             Birthday = new DateTime(1990, 1, 1),
                             HomeAddress = "北京市",
                             Remark = "这是一个备注",
                         };

        //

        var entry = UserViewObjectMapper.ToUserEntry(viewObject);

        _logger.LogInformation($"UserEntry: {entry.Id}, {entry.Name}, {entry.Gender}, {entry.Birthday}, {entry.Address}");

        // 创建示例 UserEntry 对象
        var newEntry = new UserEntry
                       {
                           Id = "2",
                           Name = "李四",
                           Gender = 1, // 男性
                           Birthday = "1995-05-05",
                           CreateTime = DateTime.Now,
                           UpdateTime = DateTime.Now,
                           Address = "上海市",
                       };

        // 将 UserEntry 转换为 UserViewObject
        var newViewObject = UserViewObjectMapper.ToUserViewObject(newEntry);
        Console.WriteLine(
            $"UserViewObject: {newViewObject.Id}, {newViewObject.Name}, {newViewObject.UserGender}, {newViewObject.Birthday}, {newViewObject.HomeAddress}");
```

另外编辑项目文件，增加

```xml
<WarningsAsErrors>RMG012;RMG020</WarningsAsErrors>
```

参考文档：[C# 对象映射框架（Mapster & mapperly） ](https://www.cnblogs.com/jasongrass/p/18746203)
