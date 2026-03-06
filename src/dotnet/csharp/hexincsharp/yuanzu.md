---
title: 元组
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: yuanzu
slug: lztka3
docsId: '62850876'
---

#### Tuple
元组是一种数据结构，具有特定数量和元素序列。比如设计一个三元组数据结构用于存储学生信息，一共包含三个元素，第一个是名字，第二个是年龄，第三个是身高。
```csharp
var tuple = new Tuple<string, int, int>("张三", 16, 175);
```

##### 缺点
1.访问元素的时候只能通过Itemx去访问，属性没有实际的意义，不方便记忆
2.最多有八个元素，想要更多只能通过最后一个元素进行嵌套扩展。
3.是一个引用类型不想其他简单类型一样是值类型，在堆上分配空间，在cpu密集操作时候可能有太多的创建和分配工作。 
```csharp
var bob = ("bob", 20);
Console.WriteLine(bob.Item1);
Console.WriteLine(bob.Item2);
```

#### ValueTuple
值元组也是一种数据结构，用于表示特定数量和元素序列，但是是和元组类不一样的，主要区别如下：
1.值元组是结构，不是类，而元组是类，引用类型
2.值元组是可变的不是只读的，也就是说可以改变值元组中的元素值。
3.值元组的数据成员是字段不是属性。

- 返回值可以不明显指定ValueTuple，使用新语法(,,)代替，如(string, int, uint)
- 返回值可以指定元素名字，方便理解记忆赋值和访问：(string name,int age)
- 可以通过var (x, y)或者(var x, var y)来解析值元组元素构造局部变量，同时可以使用符号”_”来忽略不需要的元素。
```csharp
var bob = (name:"bob",age: 20);// 对元组的元素进行命名
Console.WriteLine(bob.name);
Console.WriteLine(bob.age);

(double Sum, int Count) t2 = (4.5, 3);
Console.WriteLine($"Sum of {t2.Count} elements is {t2.Sum}.");

var t = (Sum: 4.5, Count: 3);
Console.WriteLine($"Sum of {t.Count} elements is {t.Sum}.");

public async Task<(long tenantId, string version)> UpdateVersion(long templateId)
{
    var entity = await _satisfactionTemplateRep.Entities.FirstOrDefaultAsync(t => t.StfTemplateId == templateId).ConfigureAwait(false);
    return new(entity.TenantId, entity.Version);
}
(long tenantId, string version) = await UpdateVersion(templateId).ConfigureAwait(false);
```

#### 对比
ValueTuple使C#变得更简单易用。较Tuple相比主要好处如下：

- ValueTuple支持函数返回值新语法”(,,)”，使代码更简单；
- 能够给元素命名，方便使用和记忆，这里需要注意虽然命名了，但是实际上value tuple没有定义这样名字的属性或者字段，真正的名字仍然是ItemX，所有的元素名字都只是设计和编译时用的，不是运行时用的（因此注意对该类型的序列化和反序列化操作）；
- 可以使用解构方法更方便地使用部分或全部元组的元素；
- 值元组是值类型，使用起来比引用类型的元组效率高，并且值元组是有比较方法的，可以用于比较是否相等
