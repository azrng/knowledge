---
title: 控制台输出
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: kongzhitaishuchu
slug: op09xdtt8yei7svr
docsId: '138430709'
---

## 前言
有时候需要临时编写测试代码，会使用LINQPad进行编写代码，虽然该工具很轻量级，还可以安装Nuget包，特别合适写测试demo等(目前我只是简单测试使用)，但是有时候还是习惯使用Visual Studio编写代码，感觉提示的效果更好，所以就是还是习惯性去开Visual Studio。

## 然而
LINQPad里面的Dump扩展方法确实用着很舒服，比如我们这么使用
```csharp
void Main()
{
	var p = new Person { Name = "张三", Age = 26 };
	// 输出对象
	p.Dump();

	var list = new List<Person>
	{
		new Person{ Name="李四", Age=20 },
		new Person{ Name="王五", Age=10 },
	};
	list.Dump();
}

public class Person
{
	public string Name { set; get; }

	public int Age { set; get; }
}

```
可以使用Dump方法输出下面很清晰的结果
![image.png](/common/1693919319536-5db38320-96b9-48c1-ab83-b3d865d377a4.png)

如果我使用Visual Studio新建一个控制台项目，将该代码拷贝进去
```csharp
internal class Program
{
    private static void Main(string[] args)
    {
        var p = new Person { Name = "张三", Age = 26 };
        // 输出对象
        p.Dump();

        var list = new List<Person>
        {
            new Person { Name = "李四", Age = 20 },
            new Person { Name = "王五", Age = 10 },
        };
        list.Dump();
    }
}

public class Person
{
    public string Name { set; get; }

    public int Age { set; get; }
}

```
那么就会提示报错，因为Dump方法是LINQPad才有的内容，如果我直接使用Console输出
```csharp
private static void Main(string[] args)
{
    var p = new Person { Name = "张三", Age = 26 };
    // 输出对象
    //p.Dump();
    Console.WriteLine(p);

    var list = new List<Person>
    {
        new Person { Name = "李四", Age = 20 },
        new Person { Name = "王五", Age = 10 },
    };
    // list.Dump();
    Console.WriteLine(list);
}
```
输出结果又不是我们想要的内容
![image.png](/common/1693919679600-fae45950-d296-4607-98c4-d2f4c3dcf6fc.png)
所以就想，那么自己是不是要写一个扩展方法，来实现Console的输出，效果类似LINQPad的输出，造轮子之前当然要看了一下是否有现成的轮子使用，毕竟我遇到的问题基本上网上的朋友都遇到过了，然后就简单查看找到了下面两个最近还在更新的且符合我需求的nuget包
```csharp
<PackageReference Include="Dumpify" Version="0.6.0" />
<PackageReference Include="Dumpper" Version="0.0.7" />
```
简单对比，我选择了下载量更高的Dumpify，下面就简单演示一下

## Dumpify操作
官方文档地址：[https://github.com/MoaidHathot/Dumpify](https://github.com/MoaidHathot/Dumpify)

在引用Dumpify包的前提下，取消注释上面的Dump扩展方法
```csharp
using Dumpify;

internal class Program
{
    private static void Main(string[] args)
    {
        var p = new Person { Name = "张三", Age = 26 };
        // 输出对象
        p.Dump();

        var list = new List<Person>
        {
            new Person { Name = "李四", Age = 20 },
            new Person { Name = "王五", Age = 10 },
        };
        list.Dump();
    }
}

public class Person
{
    public string Name { set; get; }

    public int Age { set; get; }
}
```
展示效果如下
![image.png](/common/1693920083114-5591d0dc-40da-4d84-820e-8ead6da9045b.png)
是不是很直观方便我们查看内容，那么这个包还有哪些功能那，可以访问它的文档查看，下面列举一些

### 嵌套和循环引用
```csharp
using Dumpify;

var p = new Person { Name = "张三", Age = 26 };
p.Children = new List<Person>
{
    new Person
    {
        Name = "李四",
        Age = 20,
        Children = new List<Person>
        {
            new Person { Name = "11", Age = 10 }
        }
    },
    new Person { Name = "王五", Age = 10 },
};
p.Dump();

public class Person
{
    public string Name { set; get; }

    public int Age { set; get; }

    public List<Person> Children { get; set; }
}
```
![image.png](/common/1693921203298-a25f3e0b-54d0-4072-a66e-a7a8905191ac.png)

### 支持数组字典和集合
```csharp
new[] { 1, 2, 3, 4 }.Dump();
new Dictionary<string, string> { { "11", "111" }, { "22", "222" } }.Dump();
```
![image.png](/common/1693920644746-38fb3b3f-afbd-4307-bc60-2b8b3cebb375.png)

### 打开或者关闭字段和私有成员
```csharp
new AdditionValue(1, 2).Dump(members: new MembersConfig { IncludeFields = true, IncludeNonPublicMembers = true });


public class AdditionValue
{
    private readonly int _a;
    private readonly int _b;

    public AdditionValue(int a, int b)
    {
        _a = a;
        _b = b;
    }

    private int Value => _a + _b;
}
```
![image.png](/common/1693920723889-8ee4b8f3-08f2-4d2c-bf75-c6bf250c61b3.png)

### 自定义颜色
```csharp
var package = new { Name = "Dumpify", Description = "Dump any object to Console" };
package.Dump(colors: ColorConfig.NoColors);
package.Dump(colors: new ColorConfig { PropertyValueColor = new DumpColor(Color.RoyalBlue) });
```
![image.png](/common/1693920789263-63593cbd-428c-4b7d-b05a-d445dafdc9f3.png)

## 最后
从官方文档中得知下个版本会添加更多的支持，如果有需要可以查看官方文档，目前上面那些已经够我测试使用了。
