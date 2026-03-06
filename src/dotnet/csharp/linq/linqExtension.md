---
title: LINQ扩展
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: system_linq_dynamic_core
slug: bng18gtvuk9c25k3
docsId: '123244762'
---

## SimdLinq

SimdLinq 是 SIMD 对 LINQ 聚合操作（Sum、Average、Min、Max）的直接替代，速度非常快

仓库地址：https://github.com/Cysharp/SimdLinq 

## System.Linq.Dynamic.Core

使用此动态 LINQ 库，我们可以执行以下操作：

- 通过 LINQ 提供程序进行的基于字符串的动态查询。
- 动态分析字符串以生成表达式树，例如ParseLambda和Parse方法。
- 使用CreateType方法动态创建数据类。

仓库地址：[https://github.com/zzzprojects/System.Linq.Dynamic.Core](https://github.com/zzzprojects/System.Linq.Dynamic.Core)

## Gridify 

Gridify 是一个现代化动态 LINQ 库，它以最简单的方式将您的字符串转换为 LINQ 查询，并且有出色的性能。它还提供了一种使用基于文本的数据应用过滤、排序和分页的简单方法，您还可以很方便的和 Entity framework 结合使用。

仓库地址：https://github.com/alirezanet/Gridify

### 示例

```c#
void Main()
{
	List<Person> people = new List<Person>() {
				 new Person(18,"Lee"),
				 new Person(18,"James"),
				 new Person(30,"Mark")
			};

	// 字符串
	var p1 = people.AsQueryable().ApplyFiltering("Age=18").ToList();
	//等同于 LINQ
	var p2 = people.Where(x => x.Age == 18).ToList();

	// or
	people.AsQueryable().ApplyFiltering("Name=Lee | Name=Mark").ToList();
	people.Where(x => x.Name == "Lee" || x.Name == "Mark").ToList();

	// and 
	people.AsQueryable().ApplyFiltering("Age=18 , Name=James").ToList();
	people.Where(x => x.Age == 18 && x.Name == "James").ToList();

	// 模糊查询
	people.AsQueryable().ApplyFiltering("Name=*a").ToList();
	people.Where(x => x.Name.Contains("a")).ToList();

	// 性能
	people.AsQueryable().ApplyOrdering("Age desc,Name desc").ToList(); ;
	people.OrderByDescending(x => x.Age).ThenByDescending(x => x.Name).ToList();


}

public class Person
{
	public Person(int age, string name)
	{
		Age = age;
		Name = name;
	}
	public int Age { get; set; }
	public string Name { get; set; }
}
```

## 资料
.Net解析字符串表达式：[https://www.cnblogs.com/Z7TS/p/17339894.html](https://www.cnblogs.com/Z7TS/p/17339894.html)

