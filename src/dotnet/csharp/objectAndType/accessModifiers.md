---
title: 访问修饰符
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: fangwenxiushifu
slug: qcqig1
docsId: '47625832'
---

## 概述
为了提高封装性，类型或者类型成员可以在声明中添加以下五个访问权限修饰符来限定其他类型和其他程序集的对它的访问。

通过下面的实例来进行操作
新建两个控制台程序和一个类库程序，类库程序里面有一个类为User，控制台下有一个类为Animal

### public
完全访问权限。枚举类型成员或者接口成员默认的可访问性。
```csharp
namespace Model
{
    //设置该类的访问修饰符为public，默认是internal
    public class User 
    {
    }
}

public class Animal
{
    public Animal()
    {
        var user = new User(); //User类可以在其他程序集下访问
    }
    public string Name { get; set; }
    public string Sex { get; set; }
}
```

### internal
仅可以在同一个程序集内可以访问，或供友元程序集访问。这是非嵌套类型的默认可访问性。
```csharp
namespace Model
{
    internal class User
    {
    }
}


public class Animal
{
    public Animal()
    {
        //错误 “User”不可访问，因为具有一定的保护级别
        var user = new User();
    }
    public string Name { get; set; }
    public string Sex { get; set; }
}
```

### private
仅可以在包含类型中访问，这是类或者结构体成员的默认可访问性。
```csharp
private class User
{
    //错误 命名空间中定义的元素无法显示声明为private、protected、protected internal或private protected
}
```
```csharp
public class Animal
{
    private string Name { get; set; }
    public string Sex { get; set; }
}

var animal = new Animal
{
    Sex = "男",
    Name = "张三" // name不可访问
};
```

### projected
仅可以在包含类型或者子类中访问
```csharp
public class Animal
{
    public string Name { get; set; }
    public string Sex { get; set; }

    protected void Sum()
    {
    }
}

public class User : Animal
{
    public void Test()
    {
       base.Sum();//仅可以在包含类型或者子类中访问
    }
}

var animal = new Animal();
animal.Sum();//无法访问
```

### protected internal
> 注意：CLR有protected和internal可访问呢性交集的定义，但是c#不支持

protected和internal可访问性的并集。默认情况尽可能将一切规定为私有，然后每一个修饰符都会提高其访问级别。所以要哪个protected internal修饰的成员在两个方面的访问级别都提高了

## 其他概念

### 可访问性封顶
类的可访问性是它内部声明成员可访问性的最大访问性。

### 访问修饰符限制

- 继承基类重写函数，重写的函数访问性必须一致。
- 子类可以比基类的访问权限低，但是不能比基类访问权限高。
