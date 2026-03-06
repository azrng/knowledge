---
title: Program文件
lang: zh-CN
date: 2023-04-25
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: programwenjian
slug: bdsc9lccqnug1eim
docsId: '123023902'
---

## 文件示例
```csharp
internal static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
        // 若要自定义应用程序配置，例如设置高DPI设置或默认字体，
        // 看 https://aka.ms/applicationconfiguration.
        ApplicationConfiguration.Initialize();
        Application.Run(new Main());
    }
}
```

## STAThreadAttribute
[STAThread]，这个特性在Main函数上面，也只有在这里会起作用。它完整写法是STAThreadAttribute，指示应用程序的 COM 线程模型是单线程单元 (STA)。

注意：
COM（ Component Object Model）组件对象模型 ：定义了一个二进制互操作性标准，用于创建在运行时交互的可重用软件库。
Aparment叫套间：是线程模型概念的一个继承者，实现是一个结构而已。如查一个套间是STA，那么这个套间有且只有一个线程和其关联。
Single-threaded Apartments单线程套间：是COM提供的线程模型之一。

 如果不声明STAThread就会报一个ThreadStateException类型的异常，Message是“在可以调用 OLE 之前，必须将当前线程设置为单线程单元(STA)模式。请确保您的 Main 函数带有 STAThreadAttribute 标记”。因为剪切板是系统的，需要通过COM协议来访问，如果应用不是STA的，会限制对其访问。


## Application
Main方法里有Application对象，这里可以看作是一个程序，或一个进程序，代表当前程序，第一行是配置的初始化，这个方法也是近期提升成一个方法，方法里是对WinForm可视化，应用渲染，高DPI的一些配置。第二行就是启动就用了，Run里的窗体就是主窗体，如果关闭主窗体程序会退出，或者调用Application.Exit()，应用也会退出。

Application，代表应用，它可以全局设置一些程序的信息，订阅一些应用的事件，比如主线程退出，应用退出，全局异常捕获等。同时还提供了一些方法，比如应用重启，和各种全局设置方法。

## 依赖注入
使用依赖注入，通过DI服务器获取窗体等
```csharp
internal static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();

        var host = CreateHostBuilder().Build();
        ServiceProviderHelper.InitServiceProvider(host.Services);

        var loginForm = ServiceProviderHelper.GetRequiredService<loginForm>();
        if (loginForm.ShowDialog() == DialogResult.OK)
        {
            Application.Run(ServiceProviderHelper.GetRequiredService<Main>());
        }
    }

    private static IHostBuilder CreateHostBuilder()
    {
        return Host.CreateDefaultBuilder()
            .ConfigureServices((context, services) =>
            {
                //services.AddLogging(loggingBuilder =>
                //{
                //    loggingBuilder.ClearProviders();
                //    loggingBuilder.SetMinimumLevel(LogLevel.Information);
                //    loggingBuilder.AddNLog("nlog.config");
                //});
                services.AddTransient<loginForm>();
                services.AddTransient<Main>();
            });
    }
}
```

### 操作数据库示例

```c#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MySQL_NetCoreWinform_EFCore.Model;
using System;
using System.Reflection;
using System.Windows.Forms;

namespace MySQL_NetCoreWinform_EFCore
{
    internal static class Program
    {
        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        [STAThread]
        private static void Main()
        {
            Application.SetHighDpiMode(HighDpiMode.SystemAware);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            //Application.Run(new Form1());

            var hostBuilder = Host.CreateDefaultBuilder()
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddLogging(configure => configure.AddDebug());
                    services.AddTransient<Form1>();

                    // 读取配置获取连接字符串
                    var conn = hostContext.Configuration["DbConfig:Mysql:ConnectionString"];

                    // 注入连接配置
                    var migrationsAssembly = IntrospectionExtensions.GetTypeInfo(typeof(Program)).Assembly.GetName().Name;
                    services.AddDbContext<DataContext>(options =>
                        options
                            .UseMySql(conn,ServerVersion.AutoDetect(conn),
                                x => x.MigrationsAssembly(migrationsAssembly)).UseLoggerFactory(LoggerFactory.Create(builder =>
                                {
                                    builder.AddFilter((category, level) =>
                                    category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information)
                                .AddConsole();
                                })));
                });

            var builderDefault = hostBuilder.Build();

            using (var serviceScope = builderDefault.Services.CreateScope())
            {
                var services = serviceScope.ServiceProvider;
                ServiceProviderHelper.InitServiceProvider(services);

                var form1 = services.GetRequiredService<Form1>();
                Application.Run(form1);
            }
        }
    }
}
```

ServiceProviderHelper说明

```csharp
public static class ServiceProviderHelper
{
    /// <summary>
    /// 全局服务提供者
    /// </summary>
    public static IServiceProvider ServiceProvider { get; private set; } = null!;

    /// <summary>
    /// 初始化构建ServiceProvider对象
    /// </summary>
    /// <param name="serviceProvider"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public static void InitServiceProvider(IServiceProvider serviceProvider)
    {
        if (serviceProvider == null)
        {
            throw new ArgumentNullException(nameof(serviceProvider));
        }
        ServiceProvider = serviceProvider;
    }

    /// <summary>
    /// 获取Form服务
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public static Form GetFormService(Type type)
    {
        var service = ServiceProvider.GetRequiredService(type);
        if (service is Form fService)
        {
            return fService;
        }
        else
        {
            throw new ArgumentException($"{type.FullName} is not a Form");
        }
    }

    /// <summary>
    /// 获取服务
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public static T GetRequiredService<T>() where T : class
    {
        return ServiceProvider.GetRequiredService<T>();
    }
}
```

注入示例

```c#
public partial class Form1 : Form
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<Form1> _logger;
    private readonly DataContext _dataContext;

    public Form1(IConfiguration configuration,
        ILogger<Form1> logger,
        DataContext dataContext)
    {
        InitializeComponent();
        _configuration = configuration;
        _logger = logger;
        _dataContext = dataContext;
    }
}
```

