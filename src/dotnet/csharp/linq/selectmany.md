---
title: Select/SelectMany
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: select/selectmany
slug: ftbndg
docsId: '29501538'
---
```csharp
public class PhoneNumber
{
    public string Number { get; set; }
}

public class Person
{
    public List<PhoneNumber> PhoneNumbers { get; set; }
    public string Name { get; set; }
}

var people = new List<Person>();
people.Add(new Person { Name = "张三", PhoneNumbers = new List<PhoneNumber> { new PhoneNumber { Number = "11" }, new PhoneNumber { Number = "22" } } });
people.Add(new Person { Name = "李四", PhoneNumbers = new List<PhoneNumber> { new PhoneNumber { Number = "33" }, new PhoneNumber { Number = "44" } } });

// Select
var phoneLists = people.Select(p => p.PhoneNumbers).ToList();
//[[{"Number":"11"},{"Number":"22"}],[{"Number":"33"},{"Number":"44"}]]
// SelectMany
var phoneNumbers = people.SelectMany(p => p.PhoneNumbers).ToList();
//[{"Number":"11"},{"Number":"22"},{"Number":"33"},{"Number":"44"}]
var directory = people.SelectMany(p => p.PhoneNumbers, (parent, child) => new { parent.Name, child.Number }).ToList();
//[{"Name":"张三","Number":"11"},{"Name":"张三","Number":"22"},{"Name":"李四","Number":"33"},{"Name":"李四","Number":"44"}]            
```

## Select
遍历一级查找

## SelectMany
相当于二次遍历查找，先遍历一级出来item，再遍历二级item. 和Select的区别,Select只遍历一级。
```csharp
string[] text = { "Albert was here", "Burke slept late", "Connor is happy" };
var d1 = text.Select(s => s.Split(' ')).ToList();   //3个元素，每个元素里面又有3个
var d2 = text.SelectMany(s => s.Split(' ')).ToList();   //9个元素
var d3 = text.Select(s => s.ToString()).ToList();   //3个元素
var d4 = text.SelectMany(s => s.ToString()).ToList();   //45个元素，一个字母一个元素，空格也算
foreach (var item in d4)
{
    Console.WriteLine(item);
}
```

### 笛卡尔积
```csharp
var animals = new List<string>() { "cat", "dog", "donkey" };
var number = new List<int>() { 10, 20 };

var mix = number.SelectMany(num => animals, (n, a) => new { n, a }).ToList();
```
输出结果:
> {(10,cat), (10,dog), (10,donkey), (20,cat), (20,dog), (20,donkey)}

