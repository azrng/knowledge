---
title: 数据类型
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: shujuleixing
slug: lgayke
docsId: '46546440'
---

## 概述
值类型和引用类型
值类型：struct、enum、int、float、char、bool、decimal
引用类型：class、delegate、interface、array、object、string

### 值类型
值类型包含大多数的内置类型(所有的数值类型、char类型和bool类型)以及自定义的struct类型和enum类型。值类型的变量或常量的内容仅仅是一个值。例如，内置的int类型的内容是32位的数据。值类型比引用类型更高效，因为它没有指针引用，不用分配在托管堆中，也不用被 GC 回收。

通过struct关键字定义自定义值类型
![image.png](/common/1622735518261-499fa3a9-679d-41cd-8032-a17dc2f7c0ac.png)
> 内存中值类型的实例

```csharp
    public struct Point
    {
        public int X, Y;
    }
```
值类型实例的赋值总是会进行实例的复制。
```csharp
    var p1 = new Point();
    p1.X = 7;
    var p2 = p1;
    Console.WriteLine(p1.X);//7
    Console.WriteLine(p2.X);//7
    p1.X = 9;
    Console.WriteLine(p1.X);//9
    Console.WriteLine(p2.X);//7
```
![image.png](/common/1622735885792-3554866c-5909-443e-8256-74b16161b794.png)

> 赋值操作复制了值类型的实例


### 引用类型
引用类型包含所有的类、数组、委托、和接口类型(包括预定于的string类型)。

引用类型比值类型复杂，它包含：对象和对象的引用。引用类型变量或变量中的内容是一个包含值对象的引用(只是一个地址)
![image.png](/common/1622736068317-320f7e00-4b80-47ce-be3f-ee138b42bb88.png)
> 内存汇总的引用类型实例

```csharp
    public class Point
    {
        public int X, Y;
    }
```
给引用类型变量赋值只会复制引用，而不是直接复制对象实例。如果重复之前的复制操作，那么对P1的修改操作就会影响到P2。
```csharp
    var p1 = new Point();
    p1.X = 7;
    var p2 = p1;
    Console.WriteLine(p1.X);//7
    Console.WriteLine(p2.X);//7
    p1.X = 9;
    Console.WriteLine(p1.X);//9
    Console.WriteLine(p2.X);//9
```
这是因为P1和P2指向同一个对象的两个不同的引用。
![image.png](/common/1622736318320-07d89ede-a729-4c86-8eb0-b418f6cabd45.png)
> 赋值操作复制了引用


### 泛型参数

### 指针类型

## 分配区域
值类型一般都分配在栈上，引用类型存放在堆上，引用地址在栈上。
“值类型分配的时候都在栈上”， 这是一句错误的说法，如果是局部变量，那就在线程栈上，如果是类中字段，那就在托管堆上，如果是静态变量，那就是clr的高频堆上。

## 类型转换

### 隐式转换
```csharp
int myInt = 3;
Console.WriteLine($"int: {myInt}");

decimal myDecimal = myInt;
Console.WriteLine($"decimal: {myDecimal}");
```

### 显式转换
```csharp
string str = "123";
int myInt = Convert.ToInt32(str);

decimal myDecimal = 3.14m;
int myInt = (int)myDecimal;
Console.WriteLine($"int: {myInt}");
```

#### 转换的对比

##### int.Parse
该方法在命名空间System的Int32结构体下，该方法接收一个字符串，返回一个int类型的值。
```
int.Parse("");
```
先简单看下里面的写法
```
public static int Parse(string s)
{
  if (s == null)
	ThrowHelper.ThrowArgumentNullException(ExceptionArgument.s);
  return Number.ParseInt32((ReadOnlySpan<char>) s, NumberStyles.Integer, NumberFormatInfo.CurrentInfo);
}
```
从该方法可以看到如果传入的参数是null，直接就报错。接着进入ParseInt32方法，我们发现这里居然有调用了TryParseInt32，然后根据调用该方法的返回值判断，如果不是OK，那么就抛出异常ThrowOverflowOrFormatException。
```
internal static int ParseInt32(ReadOnlySpan<char> value,NumberStyles styles,NumberFormatInfo info)
{
  int result;
  Number.ParsingStatus int32 = Number.TryParseInt32(value, styles, info, out result);
  if (int32 != Number.ParsingStatus.OK)
	Number.ThrowOverflowOrFormatException(int32, TypeCode.Int32);
  return result;
}
```
再往下的代码TryParseInt32里面又调用了**Number.TryParseInt32IntegerStyle**，虽然我没看懂，不过不影响这次的目的。
> 总结：传入null时候，抛出异常ThrowArgumentNullException，传入转换失败的内容就抛出异常ThrowOverflowOrFormatException。转换成功就返回转换成功的值。


##### int.TryParse
该方法也在命名空间System的Int32结构体下，该方法接收一个字符串以及一个输出参数，并且返回一个bool类型的值。
```
var value = int.TryParse(str, out int result);
```
首先和上面不同的是，这个方法的入参是一个可为null的string字符串
```
public static bool TryParse([NotNullWhen(true)] string? s, out int result)
{
  if (s != null)
	return Number.TryParseInt32IntegerStyle((ReadOnlySpan<char>) s, NumberStyles.Integer, NumberFormatInfo.CurrentInfo, out result) == Number.ParsingStatus.OK;
  result = 0;
  return false;
}
```
可以看到如果参数传null，那么输出参数result就会赋值给0，至于为什么是0，是因为int类型的默认值就是0，如果是double.TryParse，那么默认值就是0.0，给一个默认的输出参数值后，返回了一个false，代表转换失败。具体的转换方法在于**Number.TryParseInt32IntegerStyle**。
> 总结：传入null或者传入不能转换的值就返回false，并且输出参数为默认值。转换成功就返回true，并且输出参数返回转换后的值。


##### Convert.ToInt32
该方法也在命名空间System的Convert类下，该方法接收一个可为null字符串，并且返回一个int类型的值。
```
Convert.ToInt32(str);
```
进入该方法我们可以看到,如果传入的参数为null，那么就返回默认值。
```
public static int ToInt32(string? value)
{
	if (value == null)
		return 0;
	return int.Parse(value);
}
```
如果入参不为null，那么就调用int.Parse(value)的转换。

#### 总结
|  | int.Parse | int.TryParse | Convert.ToInt32 |
| --- | --- | --- | --- |
| 入参为null | 抛出ThrowArgumentNullException | 返回false，输出参数为默认值 | 返回默认值 |
| 转换失败 | 抛出ThrowOverflowOrFormatException | 返回false，输出参数为默认值 | 抛出ThrowOverflowOrFormatException |
| 转换成功 | 返回转换成功后的值 | 返回true，输出参数为成功的值 | 返回转换成功后的值 |
| 参数为浮点数 | 不支持 | 不支持 | 四舍五入取整，4.2返回4，4.6返回5 |


### 数据丢失
类型之间进行转换遵从的原则是“扩大转换”，如果一个可以保留较少信息的数据类型转换为一种可保留较多信息的数据类型，这种情况下，不会丢失信息，反之可能会丢失信息。
> 如何判断是否是扩大转换，参考：[https://docs.microsoft.com/zh-cn/dotnet/standard/base-types/conversion-tables](https://docs.microsoft.com/zh-cn/dotnet/standard/base-types/conversion-tables)


## 装箱拆箱

### 装箱
**装箱**就是将一个值类型的数据存储在一个引用类型的变量中。
假设你一个方法中创建了一个 int 类型的本地变量，你要将这个值类型表示为一个引用类型，那么就表示你对这个值进行了装箱操作，如下所示：
```csharp
static void SimpleBox()
{
  int myInt = 25;

  // 装箱操作
  object boxedInt = myInt;
}
```
确切地说，装箱的过程就是将一个值类型分配给 Object 类型变量的过程。当你装箱一个值时，CoreCLR 会在堆上分配一个新的对象，并将该值类型的值复制到该对象实例。返回给你的是一个在托管堆中新分配的对象的引用。

### 拆箱
反过来，将 Object 引用类型变量的值转换回栈中相应的值类型的过程则称为**拆箱**。
从语法上讲，拆箱操作看起来就像一个正常的转换操作。然而，其语义是完全不同的。CoreCLR 首先验证接收的数据类型是否等同于被装箱的类型，如果是，它就把值复制回基于栈存储的本地变量中。
例如，如果下面的 boxedInt 的底层类型确实是 int，那就完成了拆箱操作：
```csharp
static void SimpleBoxUnbox()
{
  int myInt = 25;

  // 装箱操作
  object boxedInt = myInt;

  // 拆箱操作
  int unboxedInt = (int)boxedInt;
}
```
记住，与执行典型的类型转换不同，你必须将其拆箱到一个恰当的数据类型中。如果你试图将一块数据拆箱到不正确的数据类型中，将会抛出 InvalidCastException 异常。为了安全起见，如果你不能保证 Object 类型背后的类型，最好使用 try/catch 逻辑把拆箱操作包起来，尽管这样会有些麻烦。考虑下面的代码，它将抛出一个错误，因为你正试图将装箱的 int 类型拆箱成一个 long 类型：
```csharp
static void SimpleBoxUnbox()
{
  int myInt = 25;

  // 装箱操作
  object boxedInt = myInt;

  // 拆箱到错误的数据类型，将触发运行时异常
  try
  {
    long unboxedLong = (long)boxedInt;
  }
  catch (InvalidCastException ex)
  {
    Console.WriteLine(ex.Message);
  }
}
```

### 总结
对一个整型数进行装箱和拆箱所需要的步骤

1. 在托管堆中分配一个新对象；
2. 在栈中的数据值被转移到该托管堆中的对象上；
3. 当拆箱时，存储在堆中对象上的值被转移回栈中；
4. 堆上未使用的对象将最终被 GC 回收。

## 正确实现浅拷贝和深拷贝
对于值类型而言，copy就相当于是全盘复制了，真正的实现了复制，属于深拷贝；而对于引用类型而言，一般的copy只是浅拷贝，只是copy到了引用对象的地址，相当于值传递了一个引用指针，新的对象通过地址引用仍然指向原有内存中的对象。

浅拷贝：是指将对象中的数值类型的字段拷贝到新的对象中，而对象中的引用类型的字段则指复制它的一个引用到目标对象。如果改变目标对象中引用型字段的值在原始对象也会跟随者变化。
深拷贝：与浅拷贝的不同是对于引用的处理，深拷贝将会在内存中创建一个新的对象，对应字段和原始对象完全相同。也就是说这个引用和原始对象的引用地址是不相同的，所以我们在改变新对象中的这个字段的时候是不会影响到原始字段中对应字段的内容。

### 浅拷贝
将对象中的所有字段复制到新的对象（副本）中。其中，值类型字段的值被复制到副本中后，在副本中的修改不会影响到源对象对应的值。而引用类型的字段被复制到副本中的是引用类型的引用，而不是引用的对象，在副本中对引用类型的字段值做修改会影响到源对象本身。

一个简单的浅拷贝的实现代码如下所示：
C#中System.Object 是所有类类型、结构类型、枚举类型和委托类型的基类，可以说它是类型继承的基础。System.Object包括一个用于拷贝当前对象实例的MemberwiseClone的方法。MemberwiseClone方法创建一个新对象的浅拷贝，并把当前对象实例的非静态字段拷贝至新对象实例中。通过属性，对象拷贝能够正确执行：如果属性是值类型，那么将拷贝数据，如果属性是引用类型，那么将拷贝原始对象的引用，也就是说，克隆对象指向同一个对象实例。这就意味着MemberwiseClone方法并未创建一个对象的深拷贝。
```csharp
public class CloneClass
{
    public string IdCode { get; set; }
    public int Age { get; set; }
    public Department Department { get; set; }

    /// <summary>
    /// 浅拷贝
    /// </summary>
    /// <returns></returns>
    public CloneClass Clone()
    {
        return (CloneClass)this.MemberwiseClone();
    }
}

public class Department
{
    public string Name { get; set; }
}
```
使用示例
```csharp
var cloneClass = new CloneClass();
cloneClass.IdCode = "user";
cloneClass.Department = new Department { Name = "血液肿瘤科" };

var newCloneClass = cloneClass.Clone();
newCloneClass.IdCode = "newUser";
newCloneClass.Department.Name = "内科";

"输出老的对象".Dump();
cloneClass.Dump();

"输出新的对象".Dump();
newCloneClass.Dump();

// 输出效果
"输出老的对象"
            CloneClass
┌────────────┬───────────────────┐
│ Name       │ Value             │
├────────────┼───────────────────┤
│ IdCode     │ "user"            │
│ Age        │ 0                 │
│ Department │    Department     │
│            │ ┌──────┬────────┐ │
│            │ │ Name │ Value  │ │
│            │ ├──────┼────────┤ │
│            │ │ Name │ "内科" │ │
│            │ └──────┴────────┘ │
└────────────┴───────────────────┘

"输出新的对象"
            CloneClass
┌────────────┬───────────────────┐
│ Name       │ Value             │
├────────────┼───────────────────┤
│ IdCode     │ "newUser"         │
│ Age        │ 0                 │
│ Department │    Department     │
│            │ ┌──────┬────────┐ │
│            │ │ Name │ Value  │ │
│            │ ├──────┼────────┤ │
│            │ │ Name │ "内科" │ │
│            │ └──────┴────────┘ │
└────────────┴───────────────────┘
```
注意到CloneClass的IdCode属性是string类型。理论上string类型是引用类型，但是由于该引用类型的特殊性（无论是实现还是语义），Object.MemberwiseClone方法仍旧为其创建了副本。也就是说，在浅拷贝过程，我们应该将字符串看成是值类型。

### 深拷贝
同样，将对象中的所有字段复制到新的对象中。不过，无论是对象的值类型字段，还是引用类型字段，都会被重新创建并赋值，对于副本的修改，不会影响到源对象本身。

深拷贝实现样例如下(建议使用序列化的形式来进行深拷贝,写法简单，但是性能稍差)

#### BinaryFormatter
> 注意：BinaryFormatter方法已经被弃用了

```csharp
[Serializable] // 二进制序列化需要添加
public class Department
{
    public string Name { get; set; }
}

[Serializable]
public class DeepCopyClass
{
    public string IdCode { get; set; }
    public int Age { get; set; }
    public Department Department { get; set; }

    /// <summary>
    /// 浅拷贝
    /// </summary>
    /// <returns></returns>
    public DeepCopyClass DeepClone()
    {
        using var objectStream = new MemoryStream();
        IFormatter formatter = new BinaryFormatter();
        formatter.Serialize(objectStream, this);
        objectStream.Seek(0, SeekOrigin.Begin);
        return formatter.Deserialize(objectStream) as DeepCopyClass;
    }
}
```
使用示例
```csharp
var cloneClass = new DeepCopyClass();
cloneClass.IdCode = "user";
cloneClass.Department = new Department { Name = "血液肿瘤科" };

var newCloneClass = cloneClass.DeepClone();
newCloneClass.IdCode = "newUser";
newCloneClass.Department.Name = "内科";

"输出老的对象".Dump();
cloneClass.Dump();

"输出新的对象".Dump();
newCloneClass.Dump();

// 输出结果
"输出老的对象"
             DeepCopyClass
┌────────────┬─────────────────────────┐
│ Name       │ Value                   │
├────────────┼─────────────────────────┤
│ IdCode     │ "user"                  │
│ Age        │ 0                       │
│ Department │       Department        │
│            │ ┌──────┬──────────────┐ │
│            │ │ Name │ Value        │ │
│            │ ├──────┼──────────────┤ │
│            │ │ Name │ "血液肿瘤科" │ │
│            │ └──────┴──────────────┘ │
└────────────┴─────────────────────────┘

"输出新的对象"
          DeepCopyClass
┌────────────┬───────────────────┐
│ Name       │ Value             │
├────────────┼───────────────────┤
│ IdCode     │ "newUser"         │
│ Age        │ 0                 │
│ Department │    Department     │
│            │ ┌──────┬────────┐ │
│            │ │ Name │ Value  │ │
│            │ ├──────┼────────┤ │
│            │ │ Name │ "内科" │ │
│            │ └──────┴────────┘ │
└────────────┴───────────────────┘
```

#### SystemTextJson序列化和反序列化
通过自带的Systen.Text.Json包的序列化和反序列化来实现深拷贝效果，扩展方式示例如下
```csharp
public static class CloneExtensions
{
    public static T DeepCopy<T>(this T obj)
        where T : class
    {
        using var ms = new MemoryStream();
        var options = new JsonSerializerOptions
        {
            ReferenceHandler = ReferenceHandler.Preserve,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        JsonSerializer.SerializeAsync(ms, obj, options);
        ms.Position = 0;
        return JsonSerializer.Deserialize<T>(ms, options);
    }
}
```
操作示例
```csharp
var cloneClass = new DeepCopyClass();
cloneClass.IdCode = "user";
cloneClass.Department = new Department { Name = "血液肿瘤科" };

var newCloneClass = cloneClass.DeepCopy();
newCloneClass.IdCode = "newUser";
newCloneClass.Department.Name = "内科";

"输出老的对象".Dump();
cloneClass.Dump();

"输出新的对象".Dump();
newCloneClass.Dump();
```

#### Newtonsoft序列化和反序列化
借助Newtonsoft.Json包来实现
```csharp
public static T Clone<T>(this T obj) where T : class
{
    return (obj == null) ? null : JsonConvert.DeserializeObject<T>(JsonConvert.SerializeObject(obj));
}
```

## 参考文档
> 《C#核心技术指南》
> [https://mp.weixin.qq.com/s/5wv8VGq16l8Bp9x4kMfOKA](https://mp.weixin.qq.com/s/5wv8VGq16l8Bp9x4kMfOKA) | [019] C#基础：理解装箱与拆箱


