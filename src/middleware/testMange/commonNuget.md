---
title: 常用类库
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: changyongleiku
slug: khwyom
docsId: '66006048'
---

## 模拟工具

### NSubstitute
NSubstitute 是 .NET 模拟库的友好替代品。它具有简单、简洁的语法，可帮助开发人员编写更清晰的测试。NSubstitute专为Arrange-Act-Assert（AAA）测试而设计，并考虑了测试驱动开发（TDD）。
官网文档：[https://nsubstitute.github.io/](https://nsubstitute.github.io/)


资料
从Moq迁移到NSubstitute：[https://timdeschryver.dev/blog/a-cheat-sheet-to-migrate-from-moq-to-nsubstitute](https://timdeschryver.dev/blog/a-cheat-sheet-to-migrate-from-moq-to-nsubstitute#number-of-invocations-timesexactlyn--receivedn)
moq迁移
[https://timdeschryver.dev/blog/a-cheat-sheet-to-migrate-from-moq-to-nsubstitute#method-without-arguments](https://timdeschryver.dev/blog/a-cheat-sheet-to-migrate-from-moq-to-nsubstitute#method-without-arguments)


### Moq(261M)
Moq是一个非常流行的模拟库, 只要有一个接口它就可以动态生成一个对象, 底层使用的是Castle的动态代理功能.
官方地址：[https://github.com/moq/moq4](https://github.com/moq/moq4)



https://mp.weixin.qq.com/s/izO_hYmXjEYkViWRl0xiIw | 使用 Moq.AutoMock 简化 moq 的使用

#### 示例

##### 基本示例
在进行单元测试的时候, 可以使用Moq对_userService.GetUser进行模拟返回值
```csharp
[Fact]
public void GetUser_ShouldReturnNotFound_WhenCannotFoundUser()
{
    // arrange
    // 新建一个IUserService的mock对象
    var mockUserService = new Mock<IUserService>();
    // 使用moq对IUserService的GetUs方法进行mock: 当入参为233时返回null
    mockUserService
      .Setup(it => it.GetUser(233))
      .Return((User)null);
    var controller = new UserController(mockUserService.Object);
    
    // act
    var actual = controller.GetUser(233) as NotFoundResult;
    
    // assert
    // 验证调用过userService的GetUser方法一次，且入参为233
    mockUserService.Verify(it => it.GetUser(233), Times.AtMostOnce());
}
```

##### 模拟ILogger
由于ILogger的LogError等方法都是属于扩展方法，所以不需要特别的进行方法级别的mock。
针对平时的一些使用场景封装了一个帮助类, 可以使用如下的帮助类进行Mock和Verify
```csharp
public static class LoggerHelper
{
    public static Mock<ILogger<T>> LoggerMock<T>() where T : class
    {
        return new Mock<ILogger<T>>();
    }

    public static void VerifyLog<T>(this Mock<ILogger<T>> loggerMock, LogLevel level, string containMessage, Times times)
    {
        loggerMock.Verify(
        x => x.Log(
            level,
            It.IsAny<EventId>(),
            It.Is<It.IsAnyType>((o, t) => o.ToString().Contains(containMessage)),
            It.IsAny<Exception>(),
            (Func<It.IsAnyType, Exception, string>)It.IsAny<object>()),
        times);
    }

    public static void VerifyLog<T>(this Mock<ILogger<T>> loggerMock, LogLevel level, Times times)
    {
        loggerMock.Verify(
        x => x.Log(
            level,
            It.IsAny<EventId>(),
            It.IsAny<It.IsAnyType>(),
            It.IsAny<Exception>(),
            (Func<It.IsAnyType, Exception, string>)It.IsAny<object>()),
        times);
    }
}
```
使用方法
```csharp
[Fact]
public void Echo_ShouldLogInformation()
{
    // arrange
    var mockLogger = LoggerHelper.LoggerMock<UserController>();
    var controller = new UserController(mockLogger.Object);
    
    // act
    controller.Echo();
    
    // assert
    mockLogger.VerifyLog(LogLevel.Information, "hello", Times.Once());
}
```

### MockQueryable

#### MockQueryable.Core(11.1M 2023年9月2日15:08:27)
MockQueryable扩展的核心包，用于模仿ToListAsync, FirstOrDefaultAsync等操作。  

#### MockQueryable.Moq(8.95M 2023年9月2日15:07:41)
模拟实体框架操作的扩展，例如ToListAsync, FirstOrDefaultAsync等,避免访问数据库。也可以Mock Dbset等。
仓库地址：[https://github.com/romantitov/MockQueryable](https://github.com/romantitov/MockQueryable)

引用组件
```csharp
<PackageReference Include="MockQueryable.Moq" Version="5.0.1" />
```
该组件依赖于Moq、MockQueryable.EntityFrameworkCore、MockQueryable.Core

##### 模拟DbSet
```csharp
// 1. 测试时创建一个模拟的List<T>
var users = new List<UserEntity>()
{
  new UserEntity{LastName = "ExistLastName", DateOfBirth = DateTime.Parse("01/20/2012")},
  ...
};

// 2. 通过扩展方法转换成DbSet<UserEntity>
var mockUsers = users.AsQueryable().BuildMock();

// 3. 赋值给给mock的DbContext中的Users属性
var mockDbContext = new Mock<DbContext>();
mockDbContext
  .Setup(it => it.Users)
  .Return(mockUsers);
```

## 填充库

### AutoFixture(54.6M)
AutoFixture是一个假数据填充库，旨在最小化3A中的arrange阶段，使开发人员更容易创建包含测试数据的对象，从而可以更专注与测试用例的设计本身。  

官方仓库：[https://github.com/AutoFixture/AutoFixture](https://github.com/AutoFixture/AutoFixture)  

文档地址：[https://autofixture.github.io/docs/quick-start/](https://autofixture.github.io/docs/quick-start/)

引用组件

```csharp
<PackageReference Include="AutoFixture" Version="4.17.0" />
```

#### 基本用法
直接使用如下的方式创建强类型的假数据
```csharp
Fixture fixture = new Fixture();
int expectedNumber = fixture.Create<int>();
var sut = fixture.Create<List<UserInfo>>();
```

#### 生成数据
```csharp
// 生成指定数据量的TestDataModel数据
var fixture = new Fixture();
var data = fixture.CreateMany<TestDataModel>(600000);

// 初始化 Fixture
var fixture = new Fixture();
// 自定义属性生成规则
// fixture.Customize<GenDataUser>(composer =>
// {
//     return composer.With(u => u.Id)
//         .With(u => u.Account, "John")
//         .With(u => u.Name, "Doe")
//         .With(u => u.Sex)
//         .With(u => u.Deleted, false);
// });
var userWithCustomData = fixture.CreateMany<GenDataUser>(number);
```

#### 与xUnit测试框架结合
上述示例也可以和测试框架本身结合，比如xUnit
```csharp
[Theory, AutoData]
public void IntroductoryTest(
    int expectedNumber, MyClass sut)
{
    // act
    int result = sut.Echo(expectedNumber);
    
    // assert
    Assert.Equal(expectedNumber, result);
}
```

### Bogus(21.9M)
Bogus是一个简单的假数据生成器，适用于C#、F#和VB.NET等.NET语言。
Github：[https://github.com/bchavez/Bogus](https://github.com/bchavez/Bogus)

Bogus 实战：使用 Bogus 和 EFCore 生成模拟数据和种子数据【完整教程】https://www.cnblogs.com/ruipeng/p/18138134本文介绍了在 xUnit 单元测试中结合 xUnit.DependencyInject 使用依赖注入的方法，并展示了如何使用 Bogus 库创建模拟数据以及 EFCore 生成种子数据。Bogus 是一个.NET 下的假数据生成器，具有丰富的数据类型支持、可重复性、易用性、内置规则、灵活性和社区支持。文章通过示例展示了 Bogus 生成测试数据的过程，并提供了单元测试成功的证明。还介绍了 Bogus 的国际化特性，包括各种地区设置和语言的支持。



引用组件

```csharp
<PackageReference Include="Bogus" Version="34.0.1" />
```

#### 基础使用
生成一些模拟数据，先定义模型类
```csharp
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
    public string ContactName { get; set; }
    public IEnumerable<Order> Orders { get; set; }
}

public class Order
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public Decimal OrderValue { get; set; }
    public bool Shipped { get; set; }
}
```
实现代码
```csharp
//为Randomizer.Seed属性指定一个固定的随机种子，因此每次生成的数据都是一样的
Randomizer.Seed = new Random(123456);
var ordergenerator = new Faker<Order>()
    .RuleFor(o => o.Id, Guid.NewGuid)
    .RuleFor(o => o.Date, f => f.Date.Past(3))
    .RuleFor(o => o.OrderValue, f => f.Finance.Amount(0, 10000))
    .RuleFor(o => o.Shipped, f => f.Random.Bool(0.9f));
var customerGenerator = new Faker<Customer>()
    .RuleFor(c => c.Id, Guid.NewGuid())
    .RuleFor(c => c.Name, f => f.Company.CompanyName())
    .RuleFor(c => c.Address, f => f.Address.FullAddress())
    .RuleFor(c => c.City, f => f.Address.City())
    .RuleFor(c => c.Country, f => f.Address.Country())
    .RuleFor(c => c.ZipCode, f => f.Address.ZipCode())
    .RuleFor(c => c.Phone, f => f.Phone.PhoneNumber())
    .RuleFor(c => c.Email, f => f.Internet.Email())
    .RuleFor(c => c.ContactName, (f, c) => f.Name.FullName())
    .RuleFor(c => c.Orders, f => ordergenerator.Generate(f.Random.Number(10)));
var list = customerGenerator.Generate(100);
```

#### 定义对象生成值

```csharp
public class UnitTest1
{
    private static readonly Faker _faker = new();

    /// <summary>
    /// 生成测试数据
    /// </summary>
    [Fact]
    public void BogusGenData()
    {
        var list = Enumerable.Range(1, 100)
                             .Select(_ => new UserInfo
                                          {
                                              Id = _faker.Random.UInt(),
                                              FirstName = _faker.Name.FirstName(),
                                              LastName = _faker.Name.LastName(),
                                              Email = _faker.Internet.Email(),
                                              PhoneNumber = _faker.Phone.PhoneNumber()
                                          })
                             .ToList();
        Assert.True(list.Count > 0);
    }
}

file class UserInfo
{
    public uint Id { get; set; }

    public string LastName { get; set; }

    public string FirstName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }
}
```

#### 定义生成规则

```csharp
// 用户数据生成规则
var fakerPerson = new Faker<User>("zh_CN")                                      // 使用中文数据
        .RuleFor(p => p.Name, f => f.Name.FullName())                           // 随机汉字名
        .RuleFor(p => p.Age, f => f.Random.Number(1, 100))                      // 随机年龄(1-100岁)
        .RuleFor(p => p.Gender, f => f.PickRandom<Name.Gender>())               // 随机性别
        .RuleFor(p => p.Company, p => p.Company.CompanyName())                  // 随机公司名称
        .RuleFor(p => p.Phone, p => p.Phone.PhoneNumber("1##########"))         // 随机手机号
    ;
```



### Faker.Net

Faker是一个用于生成伪造数据的强大工具。它基于Java版的Faker，并针对C#进行了优化和扩展。通过使用Faker.NET，你可以快速地创建大量具有真实感的随机数据，从而在不需要访问真实数据的情况下完成多种任务。

仓库地址：[https://github.com/jonwingfield/Faker.Net](https://github.com/jonwingfield/Faker.Net)

## 断言工具

### FluentAssertions

[文档](https://fluentassertions.com/)

### FluentAssertions.Web

Fluent Assertions 是.NET 平台下的一组扩展方法,用于单元测试中的断言。它使你的单元测试中的断言看起来更自然流畅。
> [https://mp.weixin.qq.com/s/SEhC8MOsicSL8q1n67C5Sw](https://mp.weixin.qq.com/s/SEhC8MOsicSL8q1n67C5Sw)


### Shouldly
仓库地址：[https://github.com/shouldly/shouldly](https://github.com/shouldly/shouldly)

## Testcontainers
.NET 的 Testcontainers 是一个库，用于支持所有兼容的 .NET 标准版本的 Docker 容器的一次性实例进行测试。该库基于 .NET Docker 远程 API 构建，并提供轻量级实现，可在所有情况下支持测试环境。

官网：[https://dotnet.testcontainers.org/](https://dotnet.testcontainers.org/)



使用 testcontainers 进行功能测试：https://www.dejandjenic.com/blogs/functional-testing-with-testcontainers.html

## Respawn
Respawn 是一个非常小但是实用的工具，它可以很方便的将测试或开发数据库重置为空状态。
这特别适合在集成测试中使用，集成测试运行之后，通过 Respawn 自动化的清除数据，回到测试之前的数据库状态。

[https://mp.weixin.qq.com/s/AvV7MJk7iEDQdidKoHQNfQ](https://mp.weixin.qq.com/s/AvV7MJk7iEDQdidKoHQNfQ) | 使用 Respawn 在 .NET 测试中轻松重置数据库

## 日志

### MartinCostello.Logging.XUnit
此包允许使用打印打印的日志，并将其记录在测试运行日志中。 此外，通过调整日志级别，您可以进行调整，例如在生产执行期间不显示它，以便您可以根据需要将日志输出代码保留在库中。 以下是使用它的方法：ILogger、ITestOutputHelper
文档地址：[https://github.com/martincostello/xunit-logging](https://github.com/martincostello/xunit-logging)

### Meziantou.Extensions.Logging.Xunit
在xunit测试中输出日志操作

文档地址：[https://www.meziantou.net/how-to-get-asp-net-core-logs-in-the-output-of-xunit-tests.htm](https://www.meziantou.net/how-to-get-asp-net-core-logs-in-the-output-of-xunit-tests.htm)


## 资料
[https://mp.weixin.qq.com/s/lVhTd4bjmMn12U1QUDZTsg](https://mp.weixin.qq.com/s/lVhTd4bjmMn12U1QUDZTsg) | 浅谈.Net Core后端单元测试
