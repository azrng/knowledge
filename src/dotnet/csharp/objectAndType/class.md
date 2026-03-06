---
title: 类
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: lei
slug: lu5xyr
docsId: '47109127'
---

## 开篇语
本文是读书笔记

## 概述
类是最常见的一种引用类型，最简单的声明如下
```csharp
class User { }       
```
 可以包含方法、属性、索引器、事件、构造函数、方法实现、可以定义partial

## 常用的概念
通过下面该代码来讲解类中常用的概念
```csharp
public class User
{
    /// <summary>
    /// Id
    /// </summary>
    public string ID { get; set; }

    /// <summary>
    /// 账号
    /// </summary>
    public string Account { get; set; }

    /// <summary>
    /// 密码
    /// </summary>
    public string PassWord { get; set; }
    
    public int Sex;
         
}
```

### 访问修饰符
常用的类修饰符有public、protected、internal、private、abstract、sealed、static、partial。

### 类成员

### 方法
方法是一组实现某个行为的语句，通过调用者的参数获取输入的数据，并通过指定的输出类型将输出数据返回给调用者。可以返回void类型，表名没有返回值，也可以通过ref/out参数返回输出数据。
方法可以用以下修饰符修饰：

- 静态修饰符：static
- 访问修饰符：public internal private protected
- 继承修饰符：new virtual abstract override
- 部分方法修饰符：partial
- 异步方法修饰符：async

#### 默认方法

#### 虚方法

父类定义虚方法，子类重写父类的方法
```csharp
    public class UserBase
    {
        public virtual void Sum(int x, int y) { }
    }

    public class User : UserBase
    {
        public override void Sum(int x, int y) { }
    }
```

#### 表达式体方法
```csharp
string GetName() => Name;
```

#### 重载方法
方法名字相同，参数类型不同或者参数个数不同。
```csharp
void Sum(int x) { }
void Sum(double x) { }
void Sum(int x, int y) { }
void Sum(double x, int y) { }
```
> 方法的返回值类型和params修饰符不属于判断是否重载的条件


#### 按值传递和按引用传递
```csharp
void Sum(int x) { }
void Sum(ref int x) { }
// 或
void Sum(out int x) { }
```
> 上述的ref和out代码不能同时出现一个类中


### 字段
字段属于类的成员，在该示例类中Sex叫做字段。
```csharp
public class User
{
    /// <summary>
    /// 性别
    /// </summary>
    public int Sex = 1;
}
```
字段可用以下修饰符进行修饰：

- 静态修饰符：static
- 访问修饰符：public internal private protected
- 继承修饰符：new
```csharp
public class UserBase
{
    /// <summary>
    /// 性别/级别
    /// </summary>
    public int Sex = 1;
}

public class User : UserBase
{
    /// <summary>
    /// 性别
    /// </summary>
    public new int Sex = 10;
}


 var us = new User();
 var sex = us.Sex; // 10
```

- 只读修饰符：readonly

可以设置只读(只能在声明时候或者在类的构造函数中赋值)。

- 线程访问修饰符：volatile

#### 字段初始化
字段不一定要初始化，没有初始化的字段会设置默认值。
```csharp
public class User
{
    /// <summary>
    /// 性别
    /// </summary>
    public int Sex;
}

var us = new User();
var sex = us.Sex; // 0
```

[https://mp.weixin.qq.com/s/lVRuhJgA_2zV2hmDqchebA](https://mp.weixin.qq.com/s/lVRuhJgA_2zV2hmDqchebA) | 为什么应该尽可能避免在静态构造函数中初始化静态字段？


#### 声明多个字段
可以同时声明多个字段,但是这些字段类型必须一致
```csharp
public class User
{
    /// <summary>
    /// 性别/级别
    /// </summary>
    public int Sex = 1, level = 5;
}
```

### 属性
一眼看过去，属性和字段很相似，但是属性内部可以像方法一样包含逻辑，在下面示例中Account和PassWord就是属性，比字段(sex)多了get/set访问器，属性get出来的值不一定是set进去的值，因为可能在set时候被修改。
```csharp
public class User
{
    public string Account { get; set; }
    public string PassWord { get; set; }

    public int Sex;
}
```
Get和Set是属性的访问器，可以用来控制属性的访问级别。
```csharp
private string name;
public string Name
{
    get { return name; }
    set { name = value; }
}
```
> 尽管访问属性和字段的方式是相同的，但不同之处在于，属性在获取和设置值的时候给实现者提供了完全的控制能力。

属性支持以下的修饰符：

- 静态修饰符：static
- 访问权限修饰符：public internal privateprotected
- 继承修饰符：new virtual abstract overridesealed

#### 只读属性
如果只定义了get访问器，属性就是只读的。如果只定义了set访问器，那么就是只写的。
```csharp
public class User
{
    public string Address { get; }
}
```

#### 表达式属性
```csharp
public class User
{
    public string Address { get; }

    private decimal _price, _num;

    public decimal TotalPrice { get { return _price * _num; } }

    public decimal TotalPrice2 { get => _price * _num; }

    public decimal TotalPrice3 => _price * _num;
}
```

#### 自动属性
属性最常见的实现方式是使用get和set访问器读写私有字段(字段和属性类型相同)。因此编译器会将自动属性声明自动转换为在这种实现方式。
```csharp
public class User
{
    public string Address { get; set; }
}
```
编译器会自动生成一个后台私有字段，该字段的名称由编译器生成且无法引用。

#### 属性初始化器
```csharp
public class User
{
    public string Address { get; set; } = "中国";

    public int Price { get;} = 1;
}
```

#### 属性自定义值
获取指定类型的属性值
```csharp
public static string GetPropertyName(Type type, string property)
{
    var displayName = type.GetProperty(property)?.GetCustomAttribute<DisplayNameAttribute>();
    if (!string.IsNullOrEmpty(displayName?.DisplayName))
        return displayName.DisplayName;

    var display = type.GetProperty(property)?.GetCustomAttribute<DisplayAttribute>();
    return !string.IsNullOrEmpty(display?.Name) ? display.Name : string.Empty;
}
```
例如：
```
var bb = GetPropertyName(typeof(Userinfo), "Name");
```

#### volatile
volatile关键字用于确保多个线程对该字段的访问是可见和有序的
```csharp
private volatile int _next = -1;
```

### 索引器
索引器为要访问的类或者结构体中封住的列表或者字典类型的数据提供访问接口。索引器通过索引值访问数据。例如string类具有索引器，可以通过int索引访问每一个char值。
```csharp
var str = "max"[1]; // 'a'
```

#### 索引器的实现
编写索引器需要定义一个名为this的属性，并将参数定义放在一对方括号中
```csharp
    public class User
    {
        private string[] words = "the quick brown fox".Split();

        public string this[int wordNum]
        {
            get { return words[wordNum]; }
            set { words[wordNum] = value; }
        }
    }


    var us = new User();
    System.Console.WriteLine(us[3]); // fox
```
一个类可以定义多个参数类型不同的索引器，一个索引器也可以包含多个参数。

### 常量
是一种永远不会改变的静态字段。常量会在编译时候静态赋值，编译器会在常量使用的地方上直接替换值。常量用关键字const生命，并且必须用值初始化。
```csharp
    public class User
    {
        public const string Name = "张三";
    }
```
未来可能发生变化的任何值都不应当表示为常量。

### 事件
事件(event)基于委托，是类或者对象向其他类或对象通知发生的事情的一种委托，是一种特殊的受限制的委托(只能施加+=，-=操作符)。
事件的定义
```csharp
public event 委托类型 事件名;
```
简单示例
```csharp
    internal class Program
    {
        //声明委托
        public delegate void MyDelegate();

        //声明事件，作为类的成员
        public event MyDelegate mydelgate;
        private static void Main(string[] args)
        {
            var p = new Program();
            p.mydelgate = Test;
            p.mydelgate();
            Console.ReadKey();
        }
        static void Test()
        {
            Console.WriteLine("test");
        }
    }
```
> 参考资料：[https://www.cnblogs.com/ezhar/p/12864342.html](https://www.cnblogs.com/ezhar/p/12864342.html)


### 构造器
构造器执行类或者结构体的初始化代码，构造器的定义和方法很相似，不过构造器的名字和返回值只能和封装它的类型相同
```csharp
    public class UserBase
    {
        public UserBase(string name)
        {
            Name = name;
        }

        public string Name { get; set; }
    }
```
实例构造器支持以下修饰符：

- 静态修饰符：static
- 访问修饰符：public internal private protected

#### 构造器重载
为了避免重复代码，构造器可以使用this来调用另一个构造器
```csharp
    public class UserBase
    {
        public UserBase() {}
        public UserBase(string name) : this()
        {
            Name = name;
        }

        public string Name { get; set; }
    }
```

#### 隐式无参数构造器
默认编译器会为我们的类生成一个无参数公有的构造器，不过如果你显式定义了构造器，编译器就不再自动生成无参数构造器

#### 对象初始化器
为了简化对象的初始化，可以在调用构造器后直接通过对象初始化器设置对象的可访问字段或属性
```csharp
    public class User
    {
        public User()
        {
        }

        public User(string name) : this()
        {
            Name = name;
        }

        public string Name { get; set; }

        public int Sex;

        public string Address { get; set; }
    }

  new User() { Sex = 1, Name = "张三", Address = "中国台湾省" };
  new User("张三") { Sex = 1, Address = "中国台湾省" };
```

### 继承
类可以通过继承一个类来对自身进行扩展或者定制，继承了一个了类，那么就拥有父类所有的功能而无需重新构建。类只支持单继承，但是可以被多个类继承。
```csharp
public class Animal
{
    public string Name { get; set; }
    public string Sex { get; set; }
    public void Cry()
    {
        Console.WriteLine($"{Name} 在叫");
    }
}
public class Dog : Animal
{    }
    

// dog继承了Animal，那么就拥有animal里面的属性和方法
var dog = new Dog { Name = "二哈", Sex = "公" };
dog.Cry();  // 二哈 在叫
```

## 空引用问题
通过编辑器的null检查来处理空引用问题，或者通过Optional模式来处理空引用问题。


[https://cat.aiursoft.cn/post/2023/7/22/solving-null-reference-problem-with-optional-pattern-in-csharp](https://cat.aiursoft.cn/post/2023/7/22/solving-null-reference-problem-with-optional-pattern-in-csharp) | 如何使用 Optional 模式解决 C## 中的烦人的空引用问题 - kitlau's blog

## 对象比较

### 实现比较器

根据需要继承自IComparable来实现比较器

```csharp
file class Salary : IComparable // 这里IComparable最好使用泛型版本，可以避免转型
{
    public string Name { get; set; }

    public int BaseSalary { get; set; }

    public int Bonus { get; set; }


    public int CompareTo(object? obj)
    {
        if (obj is null)
            return 1;

        // 
        var staff = obj as Salary;
        // return BaseSalary.CompareTo(staff.BaseSalary); 整型默认的比较方法
        if (BaseSalary > staff.BaseSalary)
        {
            return 1;
        }
        else if (BaseSalary == staff.BaseSalary)
        {
            return 0;
        }
        else
        {
            return -1;
        }
    }
}

var companySalary = new List<Salary>();
var mikeIncome = new Salary { Name = "a", BaseSalary = 10, Bonus = 2 };
companySalary.Add(mikeIncome);
var roseIncome = new Salary { Name = "b", BaseSalary = 20, Bonus = 1 };
companySalary.Add(roseIncome);

// 会根据BaseSalary排序
companySalary.Sort();
```

通过该比较器，可以实现根据BaseSalary的排序，如果想再根据其他列排序，比如Bonus还可以实现一个自定义的比较器

```csharp
file class BonusComparer : IComparer<Salary>
{
    public int Compare(Salary x, Salary y)
    {
        return x.Bonus.CompareTo(y.Bonus);
    }
}

var companySalary = new List<Salary>();
var mikeIncome = new Salary { Name = "a", BaseSalary = 10, Bonus = 2 };
companySalary.Add(mikeIncome);
var roseIncome = new Salary { Name = "b", BaseSalary = 20, Bonus = 1 };
companySalary.Add(roseIncome);


// 根据Bonus排序
companySalary.Sort(new BonusComparer());
```





### 重写Equals
默认情况下如果两个对象引用了同一个对象才说这两个对象相等，那么如果想比较两个对象的值是否相等，就需要重写比较的方法了
```csharp
public override bool Equals(object obj)
{
    if (obj is null)
        return false;
    var target = obj as userinfo;

    return target.Id == this.Id && target.Name == this.Name;
}
```

### ObjectsComparer
借助nuget包来实现对象的比较。
仓库地址：[https://github.com/ValeraT1982/ObjectsComparer](https://github.com/ValeraT1982/ObjectsComparer)
简单示例
```csharp
var u1 = new userinfo("12345", "张三");
var u2 = new userinfo("12345", "张三5");

var comparer = new ObjectsComparer.Comparer<userinfo>();

// 比较对象
IEnumerable<Difference> differences;
var isEquals = comparer.Compare(u1, u2, out differences);

// 输出结果
Console.WriteLine(isEquals ? "对象相等" : string.Join(Environment.NewLine, differences));
```

### 去重
当使用结构体的话直接可以使用Distinct进行去重，但是在类中需要使用DistinctBy或者使用Distinct+重写GetHashCode+重写Equals来实现去重。

新建一个Person类，并重写GetHashCode和重写Equals方法
```csharp
public class Person
{
    public string Name { get; set; }

    public string Age { get; set; }

    public override int GetHashCode()
    {
        return (Name + Age).GetHashCode();
    }

    public override bool Equals(object obj)
    {
        if (obj == null) return false;
        if (obj is not Person) return false;

        Person other = (Person)obj;
        return this.Name == other.Name && this.Age == other.Age;
    }
}
```
操作示例
```csharp
var persons = new List<Person>();
persons.Add(new Person { Name = "张三", Age = "11" });
persons.Add(new Person { Name = "李四", Age = "22" });
persons.Add(new Person { Name = "李四", Age = "22" });

// 最后的结果只有两条数据
var person2 = persons.Distinct().ToList();
```

## 树形结构

[https://mp.weixin.qq.com/s/tDl3oYLRg56SvaDxKvmwjA](https://mp.weixin.qq.com/s/tDl3oYLRg56SvaDxKvmwjA) | C#性能优化-树形结构递归优化

## 对象的释放
当将一个对象设置为null的时候，这可以帮助让对象变为不可达的状态，最终会被垃圾回收，但是并不会自动调用其Dispose方法，Dispose() 方法一般是用来释放非托管资源的，比如文件、网络连接、数据库连接等。由于垃圾回收器只负责释放托管资源（即由 .NET 框架管理的内存），可以不会自动调用Dispose方法
```csharp
// 该写法在调用GC.Collect();的时候会很快输出被释放了
//using (UserInfo userInfo = new UserInfo())
//{
//    Console.WriteLine("Hello World");
//}

UserInfo userInfo = new UserInfo();
Console.WriteLine("Hello World");
userInfo = null;

GC.Collect(); //默认的GC垃圾回收器

Console.ReadLine();

public class UserInfo : IDisposable
{
    public string UserName { get; set; }

    public void Dispose()
    {
        Console.WriteLine("被释放了");
    }
}
```

## 依赖关系图
通过工具来制作类关系图：[https://mp.weixin.qq.com/s/ig0BIzX0ZH09zc9PmLKx8g](https://mp.weixin.qq.com/s/ig0BIzX0ZH09zc9PmLKx8g)

仓库地址：[https://github.com/pierre3/PlantUmlClassDiagramGenerator](https://github.com/pierre3/PlantUmlClassDiagramGenerator)

