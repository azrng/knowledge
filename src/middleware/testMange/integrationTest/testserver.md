---
title: TestServer
lang: zh-CN
date: 2023-10-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: testserver
slug: bfux7cxgwl536xgn
docsId: '131826931'
---

## 概述
为了方便 ASP.NET Core 中 API 的测试，微软提供了 [TestServer](https://docs.microsoft.com/ZH-CN/dotnet/api/microsoft.aspnetcore.testhost.testserver?view=aspnetcore-6.0)，它可以让我们在没有 IIS 或者任何外部事物的情况下对 Web 应用进行测试，使用 `TestServer` 的好处在于它是基于内存进行交互的没有真正的 HTTP 请求和 TCP 链接，会非常的高效，而且也不会监听某一个端口，所以不会有端口权限的问题。`TestServer` 的使用主要有两步，首先是服务的注册，可以使用 `IHostBuilder` 或 `IWebHostBuilder` 的 `UseTestServer` 扩展方法注册 `TestServer`，可以使用 `IHost` 的 `GetTestClient` 扩展方法来注册和 `TestServer` 进行交互的 `HttpClient`。

## 操作
在.Net中使用集成测试的基础结构组件（如测试 Web 主机和内存中测试服务器 (TestServer)）由 Microsoft.AspNetCore.Mvc.Testing 包提供或管理。 使用此包可简化测试创建和执行。
Microsoft.AspNetCore.Mvc.Testing 包处理以下任务：

- 将依赖项文件 (.deps) 从 SUT 复制到测试项目的 bin 目录中。
- 将内容根目录设置为 SUT 的项目根目录，以便可在执行测试时找到静态文件和页面/视图。
- 提供 WebApplicationFactory 类，以简化 SUT 在 TestServer 中的启动过程。

新建xUnit单元测试项目并且引用nuget包
```powershell
Microsoft.AspNetCore.Mvc.Testing
```

### 测试方法中使用

```c#
[Fact]
public async Task HelloWorld()
{
    using var host = Host.CreateDefaultBuilder()
        .ConfigureWebHostDefaults(builder =>
        {
            // Use the test server and point to the application's startup
            builder.UseTestServer()
                    .UseStartup<WebApplication1.Startup>();
        })
        .ConfigureServices(services =>
        {
            // Replace the service
            services.AddSingleton<IHelloService, MockHelloService>();
        })
        .Build();

    await host.StartAsync();

    var client = host.GetTestClient();

    var response = await client.GetStringAsync("/");

    Assert.Equal("Test Hello", response);
}

class MockHelloService : IHelloService
{
    public string HelloMessage => "Test Hello";
}
```

下面是一个简单封装的示例，不过不推荐使用了，再往下有更好的方案

```c#
/// <summary>
/// 构建webhost
/// </summary>
public class DefaultWebHostTest
{
    private readonly TestServer _server;

    public DefaultWebHostTest(Action<IServiceCollection> action)
    {
        var service = Host.CreateDefaultBuilder()
            .ConfigureWebHostDefaults(webBuilder =>
            {
                // webBuilder.ConfigureAppConfiguration((_, config) =>
                // {
                //     config.AddJsonFile("appsettings.json", false, true);
                // });
                webBuilder.ConfigureTestServices(services =>
                {
                    action(services);
                });

                webBuilder.UseTestServer();
            }).Build().Services;
        _server = new TestServer(service);
    }
}

/// <summary>
/// 测试控制器Api
/// </summary>
public class BaseHostTest
{
    private readonly TestServer _server;

    public BaseHostTest() : base()
    {
        _server = new TestServer(WebHost.CreateDefaultBuilder()
            .UseEnvironment("Development") //测试使用
            .ConfigureServices(services =>
            {
            }));
    }
}
```

如果想使用TestServer请继续往下看

### Startup方案

在写测试的过程中，如果每次都创建一个 TestServer，不单单麻烦，而且效率非常低，所以，微软官方的建议是让测试类实现 `IClassFixture<TFixture>` 接口，这是 xUnit 中的一个特性，其作用是让 TFixture 这个具体的类型，在运行第一个测试用例前被初始化。而如果 TFixture 这个类型实现了 IDisposable 接口，则 xUnit 会在运行最后一个测试用例后调用其 Dispose() 方法。直白一点的说法就是，它解决的是测试类中共享的数据如何初始化、如何销毁的问题，对我们而言，我们当然希望 TestServer 只初始化一次，下面是一个基本的示例：
```csharp
public class BaseControllerTest<TStartup> : IClassFixture<CustomWebApplicationFactory<TStartup>> where TStartup : class
{
    private readonly HttpClient _httpClient;

    public BaseControllerTest(CustomWebApplicationFactory<TStartup> factory)
    {
        _httpClient = factory.CreateClient();
    }
}

/// <summary>
/// 自定义的WebApplicationFactory
/// </summary>
/// <typeparam name="TStartup"></typeparam>
public class CustomWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            //var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<TestDbContext>));
            //if (descriptor != null)
            //{
            //    services.Remove(descriptor);
            //}

            //services.AddDbContext<TestDbContext>(options =>
            //{
            //    options.UseInMemoryDatabase("InMemoryTestDb");
            //});
        });
        base.ConfigureWebHost(builder);
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        // ...
        return base.CreateHost(builder);
    }

    protected override TestServer CreateServer(IWebHostBuilder builder)
    {
        // ...
        return base.CreateServer(builder);
    }

    protected override void ConfigureClient(HttpClient client)
    {
        // ...
    }
}
```
然后实际使用步骤如下
```csharp
public class TokenControllerTest : BaseControllerTest<Startup>
{
    private readonly HttpClient _client;

    public TokenControllerTest(CustomWebApplicationFactory<Startup> factory)
        : base(factory)
    {
        _client = factory.CreateClient();
    }

    [Theory]
    [InlineData("/api/token/gettoken")]
    public async void Test1(string url)
    {
        var response = await _client.GetAsync(url);
        response.EnsureSuccessStatusCode();
    }
}
```
如果遇到连接数据库的场景，还可以使用内存数据库来替换之前的操作
```csharp
public class WebAppTest : IClassFixture<WebApplicationFactory<Startup>>
{
    private readonly WebApplicationFactory<Startup> _factory;
    public WebAppTest(WebApplicationFactory<Startup> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task InMemeryDBTest()
    {
        // 使用 WithWebHostBuilder() 方法对 Startup 里的行为进行自定义或者覆盖
        var factroy = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                services.AddDbContext<ChinookContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDB");
                });
            });
        });

        var serviceProvider = factroy.Services;
        using (var scope = serviceProvider.CreateScope())
        {
            var respository = scope.ServiceProvider
                .GetRequiredService<IBaseRepository<VehicleRecord>>();
            var dbContext = scope.ServiceProvider
                .GetRequiredService<ChinookContext>();

            respository.Add(new VehicleRecord() { 
                FleetNum = "12138", StatusCode = "AVB" 
            });
            await dbContext.SaveChangesAsync();

            var instance = await respository.GetFirstOrDefaultAsync(
                x => x.FleetNum == "12138"
            );

            Assert.NotNull(instance);
            Assert.True(instance.StatusCode == "AVB");
        }
    }
}
```
可以注意到，这里我们对默认的 _factory 进行了一点加工，因为我们不希望这些测试代码对当前的数据库产生影响，所以，我们通过 WithWebHostBuilder() 方法对默认的 ChinookContext 进行了覆盖，使其可以使用一个基于内存的数据库，这在写测试的时候，其实是一个非常不错的特性，因为这样确保了一个用例可以重复多次运行，或者是我们希望能够隔离开发环境和测试环境

### Program方案
单元测试项目引用WebApi项目，然后在program中新建一个部分类
```csharp
/// <summary>
/// 集成测试引用使用
/// </summary>
public partial class Program
{ }
```

直接编辑基础的IntergrationTestWebAppFactory
```csharp
// 这里Program是被测试API项目的Program
public class IntergrationTestWebAppFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            // 效果就是启动的时候通过docker创建一个pgsql数据库容器，然后用于集成测试，然后测试完成后进行释放
            // var descriptor = services.SingleOrDefault(s => s.ServiceType == typeof(DbContextOptions<OpenDbContext>));
            //
            // if (descriptor is not null)
            // {
            //     services.Remove(descriptor);
            // }
            //
            // var conn = _dbContainer.GetConnectionString();
            // services.AddEntityFramework<OpenDbContext>(conn, true);
        });
    }
}
```
然后编写BaseIntergrationTest
```csharp
/// <summary>
/// 基础集成测试
/// </summary>
public class BaseIntergrationTest : IClassFixture<IntergrationTestWebAppFactory>
{
    private readonly IServiceScope _scope;
    protected readonly HttpClient _httpClient;

    public BaseIntergrationTest(IntergrationTestWebAppFactory factory)
    {
        _scope = factory.Services.CreateScope();
        _httpClient = factory.CreateClient();
    }
}
```
然后对指定的内容进行测试的时候直接继承自BaseIntergrationTest
```csharp
public class UserTest : BaseIntergrationTest
{
    public UserTest(IntergrationTestWebAppFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task XXX()
    {
        // 获取服务测试
        var userService = _scope.ServiceProvider.GetRequiredService<IUserService>();
    }
}
```

## 资料
[https://blog.yuanpei.me/posts/i-have-to-say-asp.net-core-integration-testing/](https://blog.yuanpei.me/posts/i-have-to-say-asp.net-core-integration-testing/) | 不得不说的 ASP.NET Core 集成测试 | 素履独行
配置日志：[https://www.meziantou.net/how-to-get-asp-net-core-logs-in-the-output-of-xunit-tests.htm#how-to-use-the-logge](https://www.meziantou.net/how-to-get-asp-net-core-logs-in-the-output-of-xunit-tests.htm#how-to-use-the-logge)
