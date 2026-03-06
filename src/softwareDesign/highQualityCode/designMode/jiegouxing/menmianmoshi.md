---
title: 门面模式
lang: zh-CN
date: 2022-08-21
publish: true
author: azrng
isOriginal: true
category:
  - 软件设计
tag:
  - 无
filename: menmianmoshi
slug: dh0pi3
docsId: '90151830'
---

## 概述
门面模式也叫做外观模式，定义翻译为中文就是，门面模式为子系统提供一组统一的接口让子系统更易用。

意思就是，原本我们需要调用多个接口，现在利用门面模式，提供一个包裹了之前多个接口的门面接口给其他系统使用。

## 使用场景

### 解决易用性问题
可以用来封装系统的底层实现，隐藏系统的复杂性，提供一组更加简单易用、更高层的接口。比如调用系统的函数就可以看做是一种“门面”。它是系统暴露给开发者的一组“特殊”的编程接口。

### 解决性能问题
通过将多个接口调用替换为一个门面接口调用，减少网络通信成本，提高客户端的响应速度。

### 解决分布式事务问题
比如我们一个业务要同时操作两个数据库执行添加逻辑，原来这是两个接口的逻辑，为了保证在一个事务中执行，需要使用到分布式事务，但是如果我们利用数据库事务，在一个事务中执行这两个添加的SQL，这就要求这两个SQL在一个接口中完成，所以可以借钱门面模式的思想，在设计一个包裹这两个操作的新接口，在新接口中让一个事务去执行这两个sql操作。

### 系统解耦
原来是需要依赖多个子系统才能够处理的逻辑，通过使用门面模式封装之后，依赖项变少了

## 操作
示例：当前有一个抵押的系统，当有一个客户来的时候，有几个事情需要确定 大银行子系统查询客户首付有足够的存款、到信用子系统查询是否有良好的信用、到贷款子系统查询是否有劣迹贷款，只有这三个系统都通过的时候才可以进行抵押，当不考虑门面模式的情况下，类结构图如下
![c492e79a40256a1f5190af7184b1e865_Facade05.jpg](/common/1661049193464-89f24c8c-1dba-4cce-8b87-7b6f633e521e.jpeg)
这里，我们首先有一个顾客类，只是保存抵押人是谁，并没有实际的操作
```csharp
/// <summary>
/// 顾客类
/// </summary>
public class Customer
{
    public Customer(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}
```
然后创建三个子系统的列，代码如下
```csharp
/// <summary>
/// 银行子系统
/// </summary>
public class Bank
{
    public bool HasSufficientSavings(Customer customer, int amount)
    {
        Console.WriteLine("检查顾客" + customer.Name + "余额");
        return true;
    }
}

/// <summary>
/// 信用子系统
/// </summary>
public class Credit
{
    public bool HasGoodCredit(Customer customer)
    {
        Console.WriteLine($"检查顾客{customer.Name}信用");
        return true;
    }
}

/// <summary>
/// 贷款子系统
/// </summary>
public class Loan
{
    public bool HasNoBadLoans(Customer customer)
    {
        Console.WriteLine($"检查顾客{customer.Name}是否有不良的贷款");
        return true;
    }
}
```
编写客户端的调用代码
```csharp
public void Main()
{
    const int amout = 1000;

    var customer = new Customer("张三");

    var bank = new Bank();
    var loan = new Loan();
    var credit = new Credit();

    var eligible = true;
    if (!bank.HasSufficientSavings(customer, amout))
    {
        eligible = false;
    }
    else if (!loan.HasNoBadLoans(customer))
    {
        eligible = false;
    }
    else if (!credit.HasGoodCredit(customer))
    {
        eligible = false;
    }

    var result = eligible ? "满足" : "不满足";
    Console.WriteLine($"顾客{customer.Name} {result}贷款要求");
}
```
这种写法，客户程序和三个子系统都发生了耦合，使得该客户端程序依赖于这三个子系统，如果这三个系统变化的时候，客户端程序也得跟着变化，但是当我们引入门面模式之后，我们就可以将这三个子系统包裹成一个，类结构图如下
![ac45424964205b12def211c74978ddaf_Facade06.jpg](/common/1661051018361-2d773a35-3578-4657-a0ba-ad9b0253bee9.jpeg)
门面类实现如下
```csharp
/// <summary>
/// 外观类
/// </summary>
public class Mortage
{
    /// <summary>
    /// 是否符合要求
    /// </summary>
    /// <param name="customer"></param>
    /// <param name="amount"></param>
    /// <returns></returns>
    public bool isEligible(Customer customer, int amount)
    {
        var bank = new Bank();
        var loan = new Loan();
        var credit = new Credit();

        var eligible = true;
        if (!bank.HasSufficientSavings(customer, amount))
        {
            eligible = false;
        }
        else if (!loan.HasNoBadLoans(customer))
        {
            eligible = false;
        }
        else if (!credit.HasGoodCredit(customer))
        {
            eligible = false;
        }
        return eligible;
    }
}
```
顾客类和子系统的类实现保持不变，客户端的实现改为
```csharp
public void Main()
{
    var customer = new Customer("张三");

    var mortage = new Mortage();
    var eligible = mortage.isEligible(customer, 1000);

    var result = eligible ? "满足" : "不满足";
    Console.WriteLine($"顾客{customer.Name} {result}贷款要求");
}
```
在引入门面模式之后，客户端程序只和Mortage类发生依赖，借助Mortage屏蔽了和子系统之间的负责操作，达到了解耦内部子系统与客户程序之间的依赖。

## 资料
参考资料：[https://www.cnblogs.com/Terrylee/archive/2006/03/17/352349.html](https://www.cnblogs.com/Terrylee/archive/2006/03/17/352349.html)
