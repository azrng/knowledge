---
title: CSharp规范
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 规范
filename: cSharpStandard
docsId: '03dbe131-f0f9-47c4-887d-efea272647c2'
# 是否显示到列表
article: false
---

## 指导信息

命名准则：https://learn.microsoft.com/zh-cn/dotnet/standard/design-guidelines/naming-guidelines

编码风格：https://github.com/dotnet/runtime/blob/main/docs/coding-guidelines/coding-style.md

编码约定：https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/coding-style/coding-conventions

## 正确操作字符串

- 拼接字符串一定要考虑使用StringBuilder ,默认长度为16,实际看情况设置。
- StringBuilder本质：是以非托管方式分配内存。
- 同时StringFormat方法内部也是使用StringBuilder进行字符串格式化。

## 区别对待强制转型与as和is

为了编译更强壮的代码，建议更常使用as和is



什么时候使用as

如果类型之间都上溯到了某个共同的基类，那么根据此基类进行的转型（即基类转型为子类本身）应该使用as。子类与子类之间的转型，则应该提供转换操作符，以便进行强制转型。

as操作符永远不会抛出异常，如果类型不匹配（被转换对象的运行时类型既不是所转换的目标类型，也不是其派生类型），或者转型的源对象为null，那么转型之后的值也为null。



什么时候使用is

as操作符有一个问题，即它不能操作基元类型。如果涉及基元类型的算法，就需要通过is转型前的类型来进行判断，以避免转型失败。

## 区别readonly和const的使用方法

使用const的理由只有一个，那就是效率。之所以说const变量的效率高，是因为经过编译器编译后，我们在代码中引用const变量的地方会用const变量所对应的实际值来代替。比如： const=100, const和100被使用的时候是等价，const自带static光圈。

const和readonly的本质区别如下：

- const是编译期常量，readonly是运行期常量
- const只能修饰基元类型、枚举类型或字符串类型，readonly没有限制。

注意：在构造方法内，可以多次对readonly赋值。即在初始化的时候。

## 将0值作为枚举的默认值

允许使用的枚举类型有byte、sbyte、short、ushort、int、uint、long和ulong。应该始终将0值作为枚举类型的默认值。不过，这样做不是因为允许使用的枚举类型在声明时的默认值是0值，而是有工程上的意义。



既然枚举类型从0开始，这样可以避免一个星期多出来一个0值。

## 区别对待==和Equals

无论是操作符“==”还是方法“Equals”，都倾向于表达这样一个原则：

- 对于值类型，如果类型的值相等，就应该返回True。
- 对于引用类型，如果类型指向同一个对象，则返回True。

注意　

- 由于操作符“==”和“Equals”方法从语法实现上来说，都可以被重载为表示“值相等性”和“引用相等性”。所以，为了明确有一种方法肯定比较的是“引用相等性”，FCL中提供了Object.ReferenceEquals方法。该方法比较的是：两个示例是否是同一个示例。
- 对于string这样一个特殊的引用类型，微软觉得它的现实意义更接近于值类型，所以，在FCL中，string的比较被重载为针对“类型的值”的比较，而不是针对“引用本身”的比较。

## 资料



https://mp.weixin.qq.com/s/SZAkiBbbn8YRvdOkPQ_BcA | C# 规范整理·语言要素

