---
title: 面向对象和面向过程
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: mianxiangduixianghemianxiangguocheng
slug: pirfp1
docsId: '67516278'
---

## 介绍
下面讲述了一些看似是面向对象，但是实际上是面向过程的操作。

## 操作

### 1、滥用get、set方法
面向过程写法：外部可以随意的修改属性的值，并且会导致和Item属性的值不一致的情况。
```csharp
public class ShoppingCart1
{
    public int ItemCount { get; set; }

    public double ToTalPrice { get; set; }

    public List<ShoppingCartItem> Items { get; set; }
}
```
面向对象写法
```csharp
public class ShoppingCart2
{
    public int ItemCount { get; private set; }

    public double ToTalPrice { get; private set; }

    public List<ShoppingCartItem> Items { get; }

    public IReadOnlyCollection<ShoppingCartItem> GetItems()
    {
        return Items;
    }

    public void AddItem(ShoppingCartItem item)
    {
        Items.Add(item);
        ItemCount++;
        ToTalPrice += item.Price;
    }

    public void Clear()
    {
        Items.Clear();
        ToTalPrice = 0;
        ItemCount = 0;
    }
}
```
不允许外部直接修改里面的属性，也不允许外部调用者去修改集合内容，将操作这个类的方法都写到这个类中。

> 总结：在设计实现类的时候，除非真的需要，否则，尽量不要给属性设置set方法，除此之外，尽管get方法相对set方法安全些，如果返回的是集合容器，也要防范集合内部数据被修改的危险。


### 2、滥用全局变量和全局方法
在面向对象编程中，常见的全局变量有单例类对象、静态成员变量、常量，常见的全局方法有静态方法。
静态方法讲方法与数据分离，破坏了封装的特性，是典型的面向过程风格。

平常是专门建立一个常量文件，将所有的常量配置放到这一个类中，这个时候会导致代码的可维护性变差、因为依赖它的文件多，所以编译时间也会增加、还影响代码的可复用性，如果某一个地方只需要里面的一个常量，这个时候异能一并引用。改进方案：

- 将这个类拆解成功能更加单一的多个类，比如将各个不同配置的常量，放到各自的配置类中。
- 不单独设置常量类，而是哪个类用到了某个常量，就把这个常量定义到这个类中。比如redisconfig类用到的redis的常量，就直接在这个类中定义常量，提到类设计的内聚性和代码的复用性。
   - **但是运引发了一个疑问？如果我多个地方都需要这个常量，那不是要定义多次吗？这样子合适吗？**

定义静态方法的时候，最好能细化一下，比如针对不同的功能，设计不同的Utils类，比如FileUtils、IOUtils、StringUtils等。

### 3、定义数据和方法分离的类
常见的面向过程风格的代码，那就是数据定义在一个类中，方法定义在另一个类中。映射到代码中就是Controller层负责暴露接口给前端使用、Service层负责核心业务逻辑，而Repository层负责数据读写操作。而在每一层中，又会定义相应的VO(View object)、BO(Business Object)、Entity。一般情况下，VO、BO、Entity中只会定义数据，不会定义方法，所有操作这些数据的业务逻辑都被定义到对应的Controller类、Service类、Repository类中。

## 为什么
为什么我们会不由自主写出来面向过程的代码，因为在生活中你去完成一个任务就会思考，先做什么，在做什么，面向过程编程风格恰恰符合这流程化思维的方式。而面向过程编程风格正好相反，它是一种自底向上的思考方式，**不是先去按照流程分解任务，而是将任务翻译成一个一个小的模块(类)，设计类之间的交互，最后按照流程将类组装起来，完成整个任务**。这个方式比较符合复杂程序的开发。

## 总结
面向对象编程离不开基础的面向过程编程，因为类中的每个方法的实现逻辑，不就是面向过程的代码吗。
