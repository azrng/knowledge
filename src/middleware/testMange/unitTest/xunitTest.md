---
title: xUnit
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - test
---

## 概述
xUnit 是一个针对 .NET 平台的开源单元测试框架，用于编写和执行自动化单元测试，常用来测试指定的方法。
官网：[https://xunit.net/](https://xunit.net/)

## 操作

### 快速上手

#### 创建单元测试项目

本次文章还在原来项目的基础上进行操作([https://gitee.com/AZRNG/my-example](https://gitee.com/AZRNG/my-example))，右键解决方案添加单元测试项目
![image.png](/common/1676439707756-ba969083-a7ab-48bf-bea7-8aa4ed63738d.png)
点击下一步
![image.png](/common/1631872707111-5bc7e39a-e7c5-484d-88e3-2687849ea4a9.png)
选择框架版本为.Net 5.0
![image.png](/common/1631872791679-fd470686-fef4-4c00-b540-f7a6e27c2019.png)
单元测试项目创建完成。然后引用我们的包

```csharp
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>.NETCoreApp,Version=v5.0</TargetFramework>

    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.TestHost" Version="5.0.10" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="16.9.4" />
    <PackageReference Include="xunit" Version="2.4.1" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.4.3">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="coverlet.collector" Version="3.0.2" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Net5ByDocker\Net5ByDocker.csproj" />
  </ItemGroup>

</Project>
```

:::details 组件说明

* TargetFramework：指定测试项目的目标框架
* IsPackable：设置是否允许打包单元测试项目
* xunit：该xunit包引入了三个子包，其中包括大多数开发人员想要的功能：（xunit.core测试框架本身）、 xunit.assert（包含Assert类的库）和xunit.analyzers（使 Roslyn 分析器能够检测单元测试和 xUnit.net 可扩展性的常见问题）
  包xunit.runner.visualstudio和Microsoft.NET.Test.Sdk 是能够在 Visual Studio 中运行测试项目以及使用 dotnet test.
* coverlet.collector：该coverlet.collector包允许收集代码覆盖率。如果您不打算收集代码覆盖率，则应删除此包引用。

:::

#### 编写测试方法

:::details 测试方法步骤

写单元测试一般有三个步骤：Arrange，Act 和 Assert。

- **Arrange** 是准备阶段，这个阶段是准备工作，比如模拟数据、初始化对象等；
- **Act** 是行为阶段，这个阶段是用准备好的数据去调用要测试的方法；
- **Assert** 是断定阶段，就是把调用目标方法返回的值和预期的值进行比较，如果和预期一致说明测试通过，否则为失败。

:::



要针对一个方法编写单元测试，并且要保证没有其他因素干扰的情况下去进行单元测试。

比如我们去对IUserService里面的GetListAsync做单元测试,然后查看该Service依赖于一些配置

```csharp
private readonly IBaseRepository<User> _userRep;
private readonly IUnitOfWork _unitOfWork;
private readonly IMapper _mapper;

public UserService(IMapper mapper,
    IBaseRepository<User> userRep, IUnitOfWork unitOfWork)
{
    _mapper = mapper;
    _userRep = userRep;
    _unitOfWork = unitOfWork;
}
```

那么我们就需要使用moq组件去模拟出来这些依赖项减少影响。这个时候就需要引用nuget包，比如这里使用Moq组件来进行Mock

```xml
<PackageReference Include="Moq" Version="4.18.2" />
```

不过该接口有些依赖项用不到，不需要模拟直接传null

```csharp
//模拟用户数据
var users = new List<User>
{
    new User {Account = "123", PassWord = "123456", IsValid = true},
    new User {Account = "456", PassWord = "123456", IsValid = true},
};
// mock 数据
var mockRepository = new Mock<IBaseRepository<User>>();
mockRepository.Setup(t => t.GetListAsync(_ => true)).ReturnsAsync(users);
```

然后就可以实例化UserService进行使用，完整代码如下

```csharp
[Fact]
public async Task GetUser_ReturnOk()
{
    //Arrange：准备阶段
    //模拟用户数据
    var users = new List<User>
    {
        new User {Account = "123", PassWord = "123456", IsValid = true},
        new User {Account = "456", PassWord = "123456", IsValid = true},
    };	
    var mockRepository = new Mock<IBaseRepository<User>>();
    mockRepository.Setup(t => t.GetListAsync(_ => true)).ReturnsAsync(users);

    var userService = new UserService(null, mockRepository.Object, null);

    //Act：行为阶段
    var result = await userService.GetListAsync();

    //Assert：断言阶段
    Assert.True(result.Any());
    Output.WriteLine(JsonConvert.SerializeObject(result));
}
```

然后就可以对该方法进行单元测试了，点击测试方法名字右键可以运行测试或者调试测试。

下面再演示一个对用户添加的方法编写单元测试
![image.png](/common/1631975072340-e40ce55e-c83a-45f7-9213-00374223b06c.png)
因为我们依赖这三个东西，那么就需要mock这三个

```csharp
var mockRepository = new Mock<IBaseRepository<User>>();
mockRepository.Setup(t => t.AddAsync(It.IsAny<User>(), false))
    .ReturnsAsync(1);

var mockUnitWork = new Mock<IUnitOfWork>();
mockUnitWork.Setup(t => t.SaveChangesAsync(new System.Threading.CancellationToken()))
    .ReturnsAsync(1);

var vm = new AddUserVm { Account = "789", PassWord = "455", Sex = Net5ByDocker.Model.Enum.SexEnum.Man };

var mockIMapper = new Mock<IMapper>();
mockIMapper.Setup(t => t.Map<User>(vm))
    .Returns(new User { Account = "789", PassWord = "455", IsValid = true });
```

这里我们模拟IBaseRepository传入任何的User到添加方法都返回，模拟单元提交也返回1，还模拟了IMapper进行映射，完整代码如下

```csharp
[Fact]
public async Task AddUser_ReturnOk()
{
    // 模拟数据
    var mockRepository = new Mock<IBaseRepository<User>>();
    mockRepository.Setup(t => t.AddAsync(It.IsAny<User>(), false))
        .ReturnsAsync(1);

    var mockUnitWork = new Mock<IUnitOfWork>();
    mockUnitWork.Setup(t => t.SaveChangesAsync(new System.Threading.CancellationToken()))
        .ReturnsAsync(1);

    var vm = new AddUserVm { Account = "789", PassWord = "455", Sex = Net5ByDocker.Model.Enum.SexEnum.Man };

    var mockIMapper = new Mock<IMapper>();
    mockIMapper.Setup(t => t.Map<User>(vm))
        .Returns(new User { Account = "789", PassWord = "455", IsValid = true });

    var userService = new UserService(mockIMapper.Object, mockRepository.Object, mockUnitWork.Object);

    //行为阶段
    var result = await userService.AddAsync(vm);

    // 断言阶段
    Assert.NotEmpty(result);
    Output.WriteLine(result);
}
```

然后单元测试就编写完成了，启动单元测试
![image.png](/common/1631976003428-be50fafe-b02e-48a0-b4e0-b75a6297b9f2.png)
单元测试成功，我理解的大概就是这样子的，如果有哪里不对的地方，麻烦指出来一起成长。

### 测试方法示例

使用 XUnit 来写测试方法可以使得测试代码更为简洁，更加简单，推荐使用 xunit 来测试自己的代码
测试示例：
```csharp
public class ResultModelTest
{
    [Fact]//标识该方法是一个测试方法
    public void SuccessTest()
    {
        var result = ResultModel.Success();
        Assert.Null(result.ErrorMsg);
        Assert.Equal(ResultStatus.Success, result.Status);
    }

    [Theory]//表明该方法是一个测试方法，并且具有数据驱动测试的功能
    [InlineData(ResultStatus.Unauthorized)]//InlineData特性用于提供测试数据
    [InlineData(ResultStatus.NoPermission)]
    [InlineData(ResultStatus.RequestError)]
    [InlineData(ResultStatus.NotImplemented)]
    [InlineData(ResultStatus.ResourceNotFound)]
    [InlineData(ResultStatus.RequestTimeout)]//多个InlineData将会使测试方法多次执行
    public void FailTest(ResultStatus resultStatus)
    {
        var result = ResultModel.Fail("test error", resultStatus);
        Assert.Equal(resultStatus, result.Status);
    }
}
```
最基本的测试，使用 Fact 标记测试方法，使用 Assert 来断言自己对结果的预期
可以使用 Theory 来自己指定一批数据来进行测试，来实现测试数据驱动测试，简单的数据可以通过 InlineData 直接指定，也可以使用 MemberData 来指定一个方法来返回用于测试的数据，也可以自定义一个继承于 DataAttribute 的 Data Provider

### 并行运行测试

在Xunit的2.x版本以后支持并行运行测试。这样子相比如之前可以更好利用服务器性能。
新建测试类RunnerTimeTest，

```csharp
public class RunnerTimeTest
{
    [Fact]
    public void Test1()
    {
        Thread.Sleep(2000);
    }

    [Fact]
    public void Test2()
    {
        Thread.Sleep(3000);
    }
}
```

我们猜一下运行该测试类的话需要耗时多少？2s？3s？
![image.png](/common/1631876238234-b6957159-6ddf-4415-b19e-974ae7084451.png)
通过这个结果我们可以得出来一个测试类内并不是并行执行的。默认情况下每一个测试类都是一个唯一的测试集合，同一个测试类的测试不会彼此并行运行。那么我们将这两个测试方法分别放入不同的测试类中

```csharp
public class RunnerTimeTest
{
    [Fact]
    public void Test1()
    {
        Thread.Sleep(2000);
    }
}

public class RunnerTimeTest2
{
    [Fact]
    public void Test2()
    {
        Thread.Sleep(3000);
    }
}
```

运行查看效果
![image.png](/common/1631877298918-c66d17bd-c606-4915-8650-26f3d4f4ab17.png)
可以得到不同的测试类之间是并行执行的。

## 资料

在.NetCore中使用xUnit的教程：[https://xunit.net/docs/getting-started/netcore/visual-studio](https://xunit.net/docs/getting-started/netcore/visual-studio)
[https://cat.aiursoft.cn/post/2023/8/12/five-minute-intro-to-dotnet-unit-testing](https://cat.aiursoft.cn/post/2023/8/12/five-minute-intro-to-dotnet-unit-testing) | 5 分钟 .NET 单元测试极简入门 - kitlau's blog
单元测试最佳做法：[https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices](https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices)
xunit学习教程：[https://www.meziantou.net/quick-introduction-to-xunitdotnet.htm](https://www.meziantou.net/quick-introduction-to-xunitdotnet.htm)

命令行创建单元测试项目：[https://xunit.net/docs/getting-started/netcore/cmdline](https://xunit.net/docs/getting-started/netcore/cmdline)
ASP.NET Core单元测试：[https://www.cnblogs.com/willick/p/aspnetcore-unit-tests-with-xunit.html](https://www.cnblogs.com/willick/p/aspnetcore-unit-tests-with-xunit.html)
并行运行测试：[https://xunit.net/docs/running-tests-in-parallel](https://xunit.net/docs/running-tests-in-parallel)
.NetCore单元测试：[https://www.cnblogs.com/baoshu/p/14500273.html](https://www.cnblogs.com/baoshu/p/14500273.html)
Mock：[https://github.com/Moq/moq4/wiki/Quickstart](https://github.com/Moq/moq4/wiki/Quickstart)
单元测试最佳做法：[https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices](https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices)
