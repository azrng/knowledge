---
title: Xunit.DependencyInjection
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jitacaozuo
slug: qagknl4g1hs5sgbg
docsId: '142316218'
---

## 概述
一个用来简化xUnit编写单元测试和集成测试的包
仓库地址：[https://github.com/pengweiqhca/Xunit.DependencyInjection](https://github.com/pengweiqhca/Xunit.DependencyInjection)

## 工作流程

首先会去尝试寻找项目中的 Startup ，这个 Startup 很类似于 asp.net core 中的 Startup，只是有一点不同， Startup 不支持依赖注入，不能像 asp.net core 中那样注入一个 IConfiguration 对象来获取配置，除此之外，和 asp.net core 的 Startup 有着一样的体验，如果找不到这样的 Startup 就会认为没有需要依赖注入的服务和特殊的配置，直接使用 Xunit 原有的 XunitTestFrameworkExecutor，如果找到了 Startup 就从 Startup 约定的方法中配置 Host，注册服务以及初始化配置流程，最后使用 DependencyInjectionTestFrameworkExecutor 执行我们的 test case.

## 操作

### 快速上手

首先创建一个名为ApiSim的.Net6.0的Api项目，在项目里面增加IUserService的接口和实现(这个实现只依赖一个日志)

```c#
public interface IUserService
{
    /// <summary>
    /// 求和
    /// </summary>
    /// <param name="a"></param>
    /// <param name="b"></param>
    /// <returns></returns>
    int Sum(int a, int b);
}

public class UserService : IUserService
{
    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public int Sum(int a, int b)
    {
        _logger.LogInformation($"输出入参 a:{a} b:{b}");
        return a + b;
    }
}
```

然后创建一个单元测试项目并且去引用上面创建的项目，然后再引用Xunit.DependencyInjection包

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>net6.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>

        <IsPackable>false</IsPackable>
        <IsTestProject>true</IsTestProject>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Xunit.DependencyInjection" Version="8.7.1" /> 👈 
        <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.5.0"/>
        <PackageReference Include="xunit" Version="2.4.2"/>
        <PackageReference Include="xunit.runner.visualstudio" Version="2.4.5">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>
        <PackageReference Include="coverlet.collector" Version="3.2.0">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>
    </ItemGroup>

    <ItemGroup>
      <ProjectReference Include="..\..\src\ApiSim\ApiSim.csproj" /> 👈 
    </ItemGroup>

</Project>
```

在测试项目中新建一个Startup类并使用下面的方式进行注入服务

:::tip

默认使用 Microsoft.Extensions.DependencyInjection 解析 xUnit 测试用例

:::

```c#
public class Startup
{
    public void ConfigureHost(IHostBuilder hostBuilder)
    {
    }

    public void ConfigureServices(IServiceCollection services)
    {
        //var configuration = hostBuilderContext.Configuration;

        services.AddScoped<IUserService, UserService>();
    }

    public void Configure()
    {
    }
}
```

然后就可以在测试项目中新建一个测试类来编写测试方法进行测试

```c#
public class UserServiceTest
{
    private readonly IUserService _userService;

    public UserServiceTest(IUserService userService)
    {
        _userService = userService;
    }

    [Fact]
    public void Sum_ReturnOk()
    {
        // 准备
        var originA = 10;
        var originB = 20;

        // 行为
        var result = _userService.Sum(originA, originB);

        // 断言
        Assert.True(result == 30);
    }
}
```

然后光标聚焦到测试方法上右键就可以运行测试(日志没有输出是正常的，因为在单元测试中输出日志不是这么用的)

### 搭配TestServer使用

`TestServer` 主要用于集成测试，使用 `TestServer` 的好处在于它是基于内存进行交互的没有真正的 HTTP 请求和 TCP 链接，会非常的高效，而且也不会监听某一个端口，所以不会有端口权限的问题。`TestServer` 的使用主要有两步，首先是服务的注册，可以使用 `IHostBuilder` 或 `IWebHostBuilder` 的 `UseTestServer` 扩展方法注册 `TestServer`，可以使用 `IHost` 的 `GetTestClient` 扩展方法来注册和 `TestServer` 进行交互的 `HttpClient，这里也可以通过Xunit.DependencyInjection来集成TestServer

#### Startup Testing

新建一个API项目(.Net6之下的版本)，然后比如我们有一个控制器

```c#
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly IUserService _userService;

    public WeatherForecastController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("sum")]
    public int Sum(int a, int b)
    {
        return _userService.Sum(a, b);
    }
}
```

并且IUserService已经在该项目中已经注入到DI容器，现在我们要测试该控制器，那么就可以在测试项目中这么新建Startup

```c#
/// <summary>
/// 引用nuget包：Xunit.DependencyInjection
/// </summary>
public class Startup
{
    public void ConfigureHost(IHostBuilder hostBuilder)
    {
        hostBuilder.ConfigureWebHostDefaults(builder =>
        {
            builder.UseStartup<WebApplication2.Startup>();

            // 引用nuget包：Microsoft.AspNetCore.Mvc.Testing
            builder.UseTestServer();
            builder.ConfigureServices(services =>
            {
                services.AddSingleton(sp => sp.GetRequiredService<IHost>().GetTestClient());
            });
        });
    }

    public void ConfigureServices(IServiceCollection services)
    {
        //var configuration = hostBuilderContext.Configuration;
    }

    public void Configure()
    {
    }
}
```

然后就可以在测试项目中编写测试用例

```c#
public class ApiTest
{
    private readonly HttpClient _client;
    private readonly ITestOutputHelper _testOutputHelper;

    public ApiTest(HttpClient client, ITestOutputHelper testOutputHelper)
    {
        _client = client;
        _testOutputHelper = testOutputHelper;
    }

    [Fact]
    public async Task GetSum()
    {
        // 准备
        var originA = 10;
        var originB = 20;

        // 行为
        var response = await _client.GetAsync($"WeatherForecast/sum?a={originA}&b={originB}");

        // 断言
        Assert.True(response.IsSuccessStatusCode);

        var responseTest = await response.Content.ReadAsStringAsync();
        _testOutputHelper.WriteLine(responseTest);
        Assert.True(responseTest == "30");
    }
}
```

.Net6之下的写法参考：https://www.cnblogs.com/weihanli/p/14152452.html#test-server-integration

#### Minimal API Testing

新建单元测试项目，然后在测试项目中需要引用Xunit.DependencyInjection.AspNetCoreTesting的nuget包

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>net8.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>

        <IsPackable>false</IsPackable>
        <IsTestProject>true</IsTestProject>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
        <PackageReference Include="xunit" Version="2.6.2" />
        <PackageReference Include="Xunit.DependencyInjection.AspNetCoreTesting" Version="8.2.1" /> 👈
        <PackageReference Include="xunit.runner.visualstudio" Version="2.5.4">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>
        <PackageReference Include="coverlet.collector" Version="6.0.0">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>
    </ItemGroup>

    <ItemGroup>
      <ProjectReference Include="..\..\src\ApiSample\ApiSample.csproj" />
    </ItemGroup>

</Project>

```

然后在测试项目中编写startup，默认格式如下

:::details Program部分类

由于高版本中没有Startup类，只有Program，并且Program不对外公开，所以需要手动在Program中新建一个部分类

```c#
/// <summary>
/// 集成测试引用使用
/// </summary>
public partial class Program;
```

:::

```c#
public class Startup
{
    public IHostBuilder CreateHostBuilder()
    {
        // Program是API项目的Program
        return MinimalApiHostBuilderFactory.GetHostBuilder<Program>();
    }
}
```

测试用例示例：举例我们调用一个接口

```c#
public class GroupTest
{
    private readonly HttpClient _client;

    public GroupTest(HttpClient client)
    {
        _client = client;
    }

    [Fact]
    public async Task Get_GroupList()
    {
        // 准备

        // 测试
        var result =
            await _client.GetFromJsonAsync<ResultModel<IEnumerable<GetGroupListResponse>>>("/api/Group/GetGroupList");

        // 断言
        Assert.NotNull(result);
        Assert.True(result.IsSuccess);
        Assert.True(result.Data.Any());
    }
}
```

这个时候我们集成测试还使用的是正式的数据库配置等，我们还可以搭配Testcontainers等不使用正式配置

### 使用Autofac替换默认DI

当你的项目是使用Autofac作为DI处理的，那么就需要使用Autofac替换默认的DI

```c#
public class Startup
{
    public void ConfigureHost(IHostBuilder hostBuilder)
    {
        hostBuilder.UseServiceProviderFactory(new AutofacServiceProviderFactory(builder =>
        {
            builder.RegisterType<UserService>()
                .As<IUserService>()
                .SingleInstance();
        }));
    }

    public void ConfigureServices(IServiceCollection services)
    {
        //var configuration = hostBuilderContext.Configuration;
    }

    public void Configure()
    {
    }
}
```

### Logging

在快速上手示例基础上，我们想在测试用例中输出日志信息，默认是使用ITestOutputHelper类来实现，直接在测试用例中进行注入

```c#
public class UserServiceTest
{
    private readonly IUserService _userService;
    private readonly ITestOutputHelper _outputHelper;

    public UserServiceTest(IUserService userService, ITestOutputHelper outputHelper)
    {
        _userService = userService;
        _outputHelper = outputHelper;
    }

    [Fact]
    public void Sum_ReturnOk()
    {
        // 准备
        var originA = 10;
        var originB = 20;

        // 行为
        var result = _userService.Sum(originA, originB);
        _outputHelper.WriteLine($"输出测试结果：{result}");

        // 断言
        Assert.True(result == 30);
    }
}
```

运行测试方法，效果如下

![image-20231113092808439](/common/image-20231113092808439.png)

仔细看就可以知道我们UserService中还有一个ILogger的日志并没有输出出来，这个就不太好了，所以得找个解决方案，如在Xunit.DependencyInjection包的基础上使用日志，通过引用nuget包Xunit.DependencyInjection.Logging，然后项目文件如下

```c#
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <TargetFramework>net6.0</TargetFramework>
        <ImplicitUsings>enable</ImplicitUsings>
        <Nullable>enable</Nullable>

        <IsPackable>false</IsPackable>
        <IsTestProject>true</IsTestProject>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Xunit.DependencyInjection" Version="8.7.1" />
        <PackageReference Include="Xunit.DependencyInjection.Logging" Version="8.1.0" />  👈
        <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.5.0"/>
        <PackageReference Include="xunit" Version="2.4.2"/>
        <PackageReference Include="xunit.runner.visualstudio" Version="2.4.5">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>
        <PackageReference Include="coverlet.collector" Version="3.2.0">
            <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
            <PrivateAssets>all</PrivateAssets>
        </PackageReference>
    </ItemGroup>

    <ItemGroup>
      <ProjectReference Include="..\..\src\ApiSim\ApiSim.csproj" />
    </ItemGroup>

</Project>

```

然后在单元测试项目startup中进行配置，这时候startup类就变成了

```c#
public class Startup
{
    public void ConfigureHost(IHostBuilder hostBuilder)
    {
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        // 注入日志
        services.AddLogging(x => x.AddXunitOutput()); // 👈
    }

    public void Configure()
    {
    }
}
```
然后在测试用例文件中直接注入ILogger<测试用例类>进行使用，例如

```c#
public class UserServiceTest
{
    private readonly IUserService _userService;
    private readonly ITestOutputHelper _outputHelper;
    private readonly ILogger<UserServiceTest> _logger;

    public UserServiceTest(IUserService userService, ITestOutputHelper outputHelper, ILogger<UserServiceTest> logger)
    {
        _userService = userService;
        _outputHelper = outputHelper;
        _logger = logger;
    }

    [Fact]
    public void Sum_ReturnOk()
    {
        // 准备
        var originA = 10;
        var originB = 20;

        // 行为
        var result = _userService.Sum(originA, originB);
        _outputHelper.WriteLine($"输出测试结果：{result}");
        _logger.LogInformation($"输出测试结果：{result}");

        // 断言
        Assert.True(result == 30);
    }
}

-- 输出结果
[2023-11-24 08:10:27Z] info: UserService[0]
      输出入参 a:10 b:20
输出测试结果：30
[2023-11-24 08:10:27Z] info: ApiSim.XunitDependencyInjection.Test.UserServiceTest[0]
      输出测试结果：30
```

### ITestOutputHelperAccessor

暂时未知使用场景

```c#
public class InvokeHelper
{
    private readonly ITestOutputHelperAccessor _outputHelperAccessor;

    public InvokeHelper(ITestOutputHelperAccessor outputHelperAccessor)
    {
        _outputHelperAccessor = outputHelperAccessor;
    }

    public void Profile(Action action, string actionName)
    {
        var watch = Stopwatch.StartNew();
        action();
        watch.Stop();
        _outputHelperAccessor.Output?.WriteLine($"{actionName} elapsed:{watch.ElapsedMilliseconds}ms");
    }
}

public class HostTest
{
    private readonly InvokeHelper _invokeHelper;

    public HostTest(InvokeHelper invokeHelper)
    {
        _invokeHelper = invokeHelper;
    }

    [Fact]
    public void OutputHelperAccessorTest()
    {
        _invokeHelper.Profile(() =>
        {
            Thread.Sleep(3000);
        },nameof(OutputHelperAccessorTest));
    }
}
```

## 资料

使用 Xunit.DependencyInjection 改造测试项目：[https://www.cnblogs.com/weihanli/p/13941796.html](https://www.cnblogs.com/weihanli/p/13941796.html)

源码参考：https://github.com/pengweiqhca/Xunit.DependencyInjection/tree/main/test/Xunit.DependencyInjection.Test.AspNetCore
