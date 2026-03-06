---
title: 加载方式
lang: zh-CN
date: 2022-11-20
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: jiazaifangshi
slug: wxns14
docsId: '77753865'
---

## 前言
- 延迟加载(懒加载)，默认不支持延迟加载
- 预先加载(贪婪加载、饥饿加载)

## 贪婪加载
贪婪加载也叫预先加载。
所谓贪婪加载，就是在查询结果中包含导航关系，而这就需要明确的要求。
比如这个示例中，User拥有Group导航属性
> 导航关系有一对一和一对多

```csharp
public class User : DataEntity
{
    xxx

    /// <summary>
    /// 组
    /// </summary>
    public Group Group { get; set; }
}
```
当你查询语句中不使用导航属性的时候，该Group属性的值为null。
在 EF Core 中，只有明确要求的情况下，才会在结果中包含导航关系。

如果使用贪婪加载，可以让 EF Core 在查询结果中包含导航属性的值。
贪婪加载通过使用 Include() 和 ThenInclude() 方法实现，如下所示：
```csharp
var gradeList = await db.Users
    .Include(t => t.Group)
    .ToListAsync();
```
Include 方法用来加载第一层导航关系，如果想进一步加载导航关系需要使用ThenInclude 方法用来进一步加载导航关系。该方法可以无限递进非关系深度，如果关系不存在，查询也不会失败，只是不会返回任何东西。

总结：
优点：以一种高效的方式查询关系型数据，使用最少的数据库访问次数。
缺点：一次性加载了所有数据，即使我们不需要使用其中的某些数据。

## 显式加载
就是EFCore显式地将关系加载到已经加载的实体中。用的时候才去加载导航属性的内容。
比如这个示例：
```csharp
var account = _context.Accounts.FirstOrDefault();

_context.Entry(account)
    .Collection(ss => ss.AccountSubjects)
    .Load();

foreach (var accountSubject in account.AccountSubjects)
{
    _context.Entry(accountSubject)
        .Reference(s => s.Subject)
        .Load();
}
```
我们首先加载的是 Acount 实体，然后通过 AccountSubjects 导航属性关联所有相关的子项。
在这种情况下，Acount 实体被称为主实体。
Collection 方法可以把一个集合纳入主实体，Reference 方法可以把单一的实体纳入主实体。
Account 实体通过使用 Collection 方法，包含了 AccountSubjec 集合。
AccountSubject 实体通过使用 Reference 方法，包含了 Subject 实体。
使用显式加载时，除了 Load 加载方法，还可以使用查询方法，它允许将查询应用到关系中：
```csharp
var count = _context.Entry(account)
    .Collection(a => a.AccountSubjects)
    .Query()
    .Count();

var subjects = _context.Entry(account)
    .Collection(a => a.AccountSubjects)
    .Query()
    .Select(s => s.Subject)
    .ToList();
```
总结：
优点：只有当真正需要的时候，我们才会在实体类上加载一个导航关系。以及如果我们有复杂的业务逻辑，那就可以分别加载导航关系。并且导航关系可以封装到一个方法、甚至一个类中，从而让代码更容易阅读和维护。
缺点：会产生更多的数据库查询次数来加载所有需要的关系，会降低查询的效率。

## 延迟加载/懒惰加载
懒加载也叫延迟加载、按需加载，它和贪婪加载相反，顾名思义，暂时不需要的数据就不加载，而是推迟到使用它时再加载。
延迟加载是一个比较重要的数据访问特性，它可以有效地减少与数据源的交互。
> 注意，这里所指的交互不是指交互次数，而是指交互的数据量。

EF Core 中默认是不开启这个功能的，因为在使用不当的情况下，它会降低应用的性能。
想要使用懒加载，最简单的办法就是安装 Microsoft.EntityFrameworkCore.Proxies 库，使用代理模式实现懒加载。
在上下文类的配置方法中启用懒加载代理：
```csharp
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseLazyLoadingProxies();
}
```
配置完成后，EF Core 会为任何可以被重载的导航属性，启用懒惰加载。
需要注意的是，这是一种全局配置，所有的导航属性都必须使用 virtual 修饰，否则会发生异常错误。
不过，这样一来的话，所有的导航属性都默认启用了懒加载。
除了使用代理模式，还可以使用 EF Core 中的懒加载服务，这种方式不需要用 virtual 修饰导航属性，而且可以只针对特定实体进行懒加载。
具体来看示例：
```csharp
public class Account
{
    private readonly ILazyLoader _lazyLoader;

    public Account(ILazyLoader lazyLoader)
    {
        _lazyLoader = lazyLoader;
    }
 
    private ICollection<AccountSubject> _accountSubjects;
    public ICollection<AccountSubject> AccountSubjects
    {
        get => _lazyLoader?.Load(this, ref _accountSubjects);
        set => _accountSubjects = value;
    }

}
```
使用构造函数注入的方式，将 ILazyLoader 服务注入到实体类中，然后修改需要开启懒加载的字段。
需要注意的是，滥用懒加载，会造成性能上的问题。
虽然懒加载只在需要读取关联数据的时候才进行加载，但是如果在遍历中使用的话，每次读取一条数据，那么就会查询一次数据库，增加了访问数据库的次数，会导致数据库的压力增大。
贪婪加载也一样会有性能上的问题，因为一次性读取所有相关的数据，有可能会导致部分数据在实际上用不到，从而使查询数据的效率降低。

总结
优点：只在读取关联数据的时候才会加载。
缺点：在遍历中使用的时候，会增加访问数据库的次数。

## 总结
如果在开发时不确定是否会需要相关联的数据，那么可以选择懒加载，待确定需要后再加载它。
如果在开发时就可以预见，需要一次性加载所有的数据，而且需要包含导航关系的所有数据， 那么使用贪婪加载是比较好的选择。
