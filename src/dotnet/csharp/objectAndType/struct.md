---
title: 结构体
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: jiegouti
slug: yoec3m
docsId: '49181457'
---

## 介绍
和类相似不过和类不同的是，结构体是值类型，而类是引用类型，不支持继承(除了隐式派生自object类型)，结构体可以包含类的所有成员，除了后面这些：无参数的构造器、字段初始化器、终结器、虚成员。
当表示一个值类型语义时候，应该推荐使用结构体。

## 结构体构造
不隐式包含一个无法重写的无参数构造函数，不能重写。
在使用构造函数的时候，必须为每个字段进行赋值操作。
```csharp
public struct UserInfo
{
    //错误：在控制方法返回调用方之前，自定实现的属性“UserInfo。Age”必须完全赋值
    public UserInfo(string name, int age)
    {
        Name = name;
        //Age = age;
    }
    public string Name { get; set; }

    public int Age { get; set; }

    public virtual string Account { get; set; }//错误：virtual对该项无效

    public int x, y;

    public string Birthday => "2021-07-16";
    //错误：结构中不能实例化属性或者字段初始值设定项
    public string Creater { get; set; } = "admin";
}
```
如果将上面结构体改为类，那么将没有那些错误。
```csharp
internal class Program
{
    private static void Main(string[] args)
    {
        Console.WriteLine("Hello World!");

        var userInfo = new UserInfo
        {
            Age = 1,
            Name = "张三"
        };
        var newUserInfo = userInfo;
        newUserInfo.Name = "李四";
        Console.WriteLine(userInfo.Name);//张三
    }
}

public struct UserInfo
{
    public string Name { get; set; }

    public int Age { get; set; }
}
```
如果是类，那么将输出 “李四”。

## 资料
性能优化结构化替代类：[https://mp.weixin.qq.com/s/oKC4pwbZtxXCvPOXgDOo3Q](https://mp.weixin.qq.com/s/oKC4pwbZtxXCvPOXgDOo3Q)
