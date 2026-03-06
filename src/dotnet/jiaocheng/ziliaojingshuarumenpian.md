---
title: 资料精选入门篇
lang: zh-CN
date: 2023-09-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: ziliaojingshuarumenpian
slug: vndoi9
docsId: '65198247'
---
:::tip
来自网络，内容是否过时自行判断
:::
### .NET 简介
.NET 开源之路
[![image.png](/common/1642519528170-9865d003-934c-4436-9ff6-f0b07f66cfe4.png)](https://img2018.cnblogs.com/blog/106337/201907/106337-20190716091427767-2084221958.png)
[.NET 时间轴](https://mp.weixin.qq.com/s/7nRaUSUM2wnStcari3ggcw)
[.NetFrameWork发展史](https://blog.csdn.net/humourer/article/details/76030968)

[C## 语言版本发展史](https://docs.microsoft.com/zh-cn/dotnet/csharp/whats-new/csharp-version-history)
[认识.NET Core（结构体系、特点、构成体系、编译器等）](https://www.cnblogs.com/yubinfeng/p/6626694.html)
[2014.11月 .NET Core 项目启动，2016.06月 .NET Core 1.0 发布](https://www.oschina.net/news/74707/dot-net-core-1-0)
[.NET Core 3.0 新特性：支持 Windows 桌面应用（windows only）](https://www.oschina.net/news/95906/dotnet-core-3-new-features)
[![image.png](/common/1642519528111-d4044f11-ae1c-4ef3-b564-78cca6597348.png)](https://img2018.cnblogs.com/blog/106337/201910/106337-20191003211859690-1982786713.png)
[.NET Core 3.0 下一个版本命名为：.NET 5](https://www.cnblogs.com/Rwing/p/introducing-net-5.html)
![image.png](/common/1642519528526-146a7ec3-0b64-4f0c-bad7-8fa590b32b52.png)
微软将此新版本命名为.NET 5.0而不是.NET Core 4.0的原因有两个：
#、跳过版本号4.x，以避免与.NET Framework 4.x混淆。
#、从名称中删除了“ Core”，以强调这是.NET未来的主要实现。与.NET Core或.NET Framework相比，.NET 5.0支持更多类型的应用程序和平台。 
ASP.NET Core 5.0基于.NET 5.0，但保留名称“ Core”以避免将其与ASP.NET MVC 5混淆。同样，Entity Framework Core 5.0保留名称“ Core”以避免将其与Entity Framework 5和6混淆。 
值得注意的是，.NET 5并没有计划支持ASP.NET Web Form和Windows工作流（WF），因此.NET 5并不能完全代替.NET Framework。（[更多 .NET5 功能](https://docs.microsoft.com/zh-cn/dotnet/core/dotnet-five)） 
.NET Core Roadmap
[![image.png](/common/1642519527650-7118c945-92ee-4a1f-8834-cc15c19e169d.png)](https://img2018.cnblogs.com/blog/106337/201910/106337-20191003211901467-621734962.png)
[长期支持 LTS（Long-term Support）是怎样的一种支持方式](https://blog.csdn.net/WPwalter/article/details/104101282)
微软对 .NET Core 的长期支持策略有两种支持的时长：
#、某个 release 版本发布之后三年；
#、后续替代此 release 的另一个新的 release 发布之后一年
[[翻译] .NET 官宣跨平台 UI 框架 MAUI (.NET 6)](https://www.cnblogs.com/hez2010/p/12920729.html)
[微软停止更新 .NET Standard，.NET 5 取而代之](https://www.oschina.net/news/118690/the-future-of-net-standard?from=20200920)
#、用于在 .NET Framework 和所有其他平台之间共享代码，使用 netstandard2.0
#、用于在 Mono，Xamarin 和 .NET Core 3.x 之间共享代码，使用 netstandard2.1
#、向后共享代码，使用net5.0
[.NET 6 正式发布（LTS、性能、热重载、WebAssembly AOT 编译等）](https://www.sohu.com/a/500015271_827544) 

#、.NET Core提供的特性
1.免费和最宽松的开源协议
.NET Core从属于.NET基金会，由微软进行官方支持。使用最宽松的MIT和Apache 2开源协议，文档协议遵循CC-BY。这将允许任何人任何组织和企业任意处置，包括使用，复制，修改，合并，发表，分发，再授权，或者销售。唯一的限制是，软件中必须包含上述版权和许可提示，后者协议将会除了为用户提供版权许可之外，还有专利许可，并且授权是免费，无排他性的(任何个人和企业都能获得授权)并且永久不可撤销，用户使用.NET Core完全不用担心收费问题，你可以很自由的部署在任何地方.
2.轻量级、跨平台
3.组件化、模块化、IOC+Nuget、中间件
4.高性能
5.统一了MVC和WebAPI编程模型
a 比如：ASP.NET Core 中MVC 和Web API 直接或间接继承同一个基类 ControllerBase，提供可使用的API也一致化
b 比如：旧ASP.NET时代，写全局filter需要针对MVC 和Web API 分别编写代码，但在ASP.NET Core，直接使用一套中间件代码即可
6.可测试性
7.微服务、容器化支持
8.标准化 .NET API 规范- .NET STANDARD

#、迁移到.NET Core
目前市面上还存在很多传统 .NET 旧项目，我们需要根据公司情况决定是否升级到.NET Core。
如果需要进行旧项目升级的，可以参考文章：《[.NET项目迁移到.NET Core操作指南](https://www.cnblogs.com/heyuquan/p/dotnet-migration-to-dotnetcore.html)》


### VS和.NET Core安装
Vistual Studio
 [Visual Studio 中使用Libman管理客户端库](https://blog.csdn.net/qq_22949043/article/details/86766808)
 [把.net Core 项目迁移到VS2019 for MAC（无需改一行代码）](https://www.cnblogs.com/wangbin5542/p/12436135.html)
VS 使用技巧
 [几个超级实用但很少人知道的 VS 技巧](https://www.cnblogs.com/willick/p/13722370.html)
调试
[.Net、C## 逆向反编译四大工具利器（dnSPY、ILSPY、Net Reflector、doPeek）](https://blog.csdn.net/kongwei521/article/details/54927689)
[怎么直接在VS2017/2019按F12进行反编译查看源代码？](https://www.cnblogs.com/liutaovip/p/13861492.html)
[使用dnSpy调试asp.net core源码](https://mp.weixin.qq.com/s/Rk06TKNKrkNZt0uS57DqIA)
[Visual Studio 2017中使用SourceLink调试Nuget包源码（SourceLink方式）](https://www.cnblogs.com/lwqlun/p/9988369.html)

[Visual Studio 2017调试开源项目代码（下载源代码文件方式）](https://www.cnblogs.com/seekdream/p/9203566.html)
[使用.NET 6开发minimal api以及依赖注入的实现、VS2022热重载和自动反编译功能的演示](https://www.cnblogs.com/weskynet/p/15626899.html)
VS Code 开发.NET Core
[使用VS Code 开发.NET CORE 程序指南](https://www.cnblogs.com/xboo/p/11431222.html)
[完整构建VSCode开发调试环境](https://www.cnblogs.com/tianqing/p/11874558.html)
.NET Core SDK
[安装 .NET Core Runtime 和.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core)
[如何为.NETCore安装汉化包智能感知](https://www.cnblogs.com/yyfh/p/12073240.html)
[Linux/MacOS 安装 .NET Core SDK 命令](https://dotnet.microsoft.com/learn/aspnet/hello-world-tutorial/install)
[如何删除 .NET Core 过时的运行时和 SDK](https://docs.microsoft.com/zh-cn/dotnet/core/versions/remove-runtime-sdk-versions?tabs=windows) (dotnet-core-uninstall) 
指定.NET版本
[指定要使用的 .NET Core 版本](https://docs.microsoft.com/zh-cn/dotnet/core/versions/selection)
[Dotnet Core使用特定的SDK&Runtime版本(global.json)](https://www.cnblogs.com/tiger-wang/p/13811777.html)
[修改nuget包默认存放路径，避免C盘膨胀](https://blog.csdn.net/u011405698/article/details/85222651)
[【微软官方文档】ASP.NET Core *.* 各版本新特性](https://docs.microsoft.com/zh-cn/aspnet/core/release-notes/aspnetcore-5.0?view=aspnetcore-2.2)
[使用 Visual Studio 2019 批量添加代码文件头](https://www.cnblogs.com/ittranslator/p/13599691.html)


### 基础
术语：
 [程序员需要知道的缩写和专业名词](https://github.com/Panmax/Awsome-Programmer-Abbreviation)
 [后端开发术语大全](https://mp.weixin.qq.com/s/i4MAVUnDbP1tsdxaQpkjAQ)
 [一文读懂QPS、TPS、PV、UV、GMV、IP、RPS](https://www.citrons.cn/jishu/226.html)
[ASP.NET Core开发者路线指南](https://github.com/MoienTajik/AspNetCore-Developer-Roadmap/blob/master/ReadMe.zh-Hans.md)
[微软官方 asp.net core 教程文档（入口）](https://docs.microsoft.com/zh-cn/aspnet/?view=aspnetcore-2.2#pivot=core&panel=core_overview)
[.NET Core 命令行接口 (CLI) 工具](https://docs.microsoft.com/zh-cn/dotnet/core/tools/?tabs=netcore2x)
 [使用cmd命令行(.NET Core CLI)来启动ASP.NET Core 应用程序的多个实例](https://www.cnblogs.com/xyh9039/p/13155059.html)
[.NET Core 运行程序注意事项（dotnet dll 与 dotnet run）](https://www.cnblogs.com/DHclly/p/9606866.html)
core api 支持情况
[ASP.NET Core API 一览表](https://docs.microsoft.com/zh-cn/dotnet/api/index?view=aspnetcore-2.2)
[查询 NET API 及类库在各版本中实现情况](https://apisof.net/catalog/)
[ASP.NET Core 项目目录结构介绍](https://baijiahao.baidu.com/s?id=1620334909551970021&wfr=spider&for=pc)
ASP.NET Core 端口配置
[.NET Core项目解读launchSettings.json(启动文件)](https://www.cnblogs.com/qtiger/p/12958493.html)
[ASP.NET Core启动地址配置方法及优先级顺序](https://mp.weixin.qq.com/s/TpApYeKaCzTR3iiHNX2xkg)
.NET Core 应用启动
[ASP.NET Core 中的Startup类](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/startup?view=aspnetcore-5.0)
[ASP.NET Core 中 Startup 区分多个环境(IWebHostEnvironment)](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/environments?view=aspnetcore-5.0#environment-based-startup-class-and-methods)
[ASP.NET Core 2.0 服务是如何加载并运行的, Kestrel、配置与环境](https://www.cnblogs.com/FlyLolo/p/ASPNETCore2_5.html)
![image.png](/common/1642519529338-84cb4559-a4bf-42f5-986f-66ed1aa98e72.png)
[[视频]基于Webhost分析netcore启动原理](https://www.bilibili.com/video/av58096866/?p=3)
[ASP.NET Core 中使用多个环境（开发、预发布、生产）](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/environments?view=aspnetcore-3.1)- 调试默认为：Development；发布后默认为 Production
[发布 asp.net core 时如何修改 ASPNETCORE_ENVIRONMENT 环境变量](https://mp.weixin.qq.com/s/nppiJJuZ1Lq07X-agatJ4g)
ASP.NET Core 返回类型`ActionResult`|`ActionResult<T>`|Dto
 [ASP.NET Core 动作结果（ActionResult）](https://www.cnblogs.com/lonelyxmas/p/9724233.html)
 [ASP.NET Core 中控制器操作的多路径返回类型（IActionResult）](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-3.0)
 [ASP.NET Core中的Action的返回值类型](https://www.cnblogs.com/kklldog/p/aspnetcore-actionresult.html)
[在.Net Core 3.0中尝试新的System.Text.Json API](https://www.cnblogs.com/muran/p/11770629.html)
[C#常见的文件路径Api（运行路径BaseDirectory、启动路径CurrentDirectory、程序集路径）](https://www.cnblogs.com/ryzen/p/14771328.html)--看评论3


### 配置
[ASP.NET Core 中的配置（dotnet run变量、json、xml、环境变量、内存变量等）](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/configuration/?view=aspnetcore-2.2)
[在 .NET Core 中使用 ViewConfig 中间件调试配置](https://github.com/SpringLeee/ViewConfig)
[ASP.NET Core 中的选项模式](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/configuration/options?view=aspnetcore-2.2)
[ASP.NET Core 中IOptions、IOptionsMonitor以及IOptionsSnapshot](https://www.cnblogs.com/wenhx/p/ioptions-ioptionsmonitor-and-ioptionssnapshot.html)
[ASP.NET Core 中修改配置不重启自动生效（ReadOnChange参数、IOptionsMonitor对象）](https://www.cnblogs.com/wei325/p/15277177.html)
[ASP.NET Core 为选项数据添加验证](https://mp.weixin.qq.com/s/dp4XIgVN0Lgk8UE0gxtPEA)
[.Net Core 自定义配置源从远程API读取配置（ConfigurationProvider）](https://www.cnblogs.com/kklldog/p/configruation_source.html)
[迈向现代化的 .Net 配置指北（配置到类自动映射）](https://www.cnblogs.com/chenug/p/9610172.html)


### 路由、模型绑定
ASP.NET Core WebAPI中，Controller标注 [ApiController] 特性，其路由只能使用[route]特性方式
[ASP.NET Core MVC 构建可读性更高的ASP.NET Core 路由](https://www.cnblogs.com/danvic712/p/10952541.html)

[ASP.NET Core 3.x 为什么采用新的 Endpoint Routing 路由系统](https://mp.weixin.qq.com/s/zkozn6guLgXfo-FqYxBNKQ)
[ASP.NET Core 3.0中使用动态控制器路由](https://www.cnblogs.com/lwqlun/p/11461657.html)
[ASP.NET Core 中的模型绑定](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/models/model-binding?view=aspnetcore-3.0)
[ASP.NET Core 中的自定义模型绑定（IModelBinder）](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/advanced/custom-model-binding?view=aspnetcore-3.0)
[使用Dynamic来直接操作API请求的数据（JTextAccessor）](http://www.bubuko.com/infodetail-3700328.html)
[ASP.NET Core 中的 URL 重写中间件](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/url-rewriting?view=aspnetcore-3.0)
ASP.NET Core API默认支持的InputFormatters：application/json-patch+json、application/json、text/json、application/*+json
ASP.NET Core API默认支持的OutputFormatters：text/plain、application/json、text/json、application/*+json
[ASP.NET Core Web API 入参解析InputFormatter](https://www.cnblogs.com/tcjiaan/p/9567371.html)
[ASP.NET Core Web API 对输入流stream的支持](https://www.cnblogs.com/CreateMyself/p/8410686.html)
[ASP.Net Core Web Api中异步视频流的IOutputFormatter](https://www.jb51.cc/aspnet/248587.html)
[ASP.NET Core 实现支持自定义 Content-Type](https://www.cnblogs.com/weihanli/p/14530672.html)
InputFormatter 用来解析请求 Body 的数据，将请求参数映射到强类型的 model，Request Body => Value
OutputFormatter 用来将强类型的数据序列化成响应输出，Value => Response Body
Formatter 需要指定支持的 MediaType，可以理解为请求类型，体现在请求头上，对于 InputFormatter 对应的就是 Content-Type ，对于 OutputFormatter 对应的是 Accept，asp.net core 会根据请求信息来选择注册的 formatter。


### 控制反转、依赖注入
什么是控制反转，和依赖注入：
依赖倒置原则（Dependence inversion principle，DIP）：软件设计原则，要依赖于抽象，不要依赖具体实现。
控制反转（Inversion of Control，IoC）：IOC是一种实现DIP原则的模式。平常我们需要一个类对象的时候需要new出来，而现在我们把new一个类对象的工作交给了IOC容器，当我们需要一个类对象的时候直接向IOC容器要，就可以了，这个就是控制反转。（控制权交个了IOC容器）
依赖注入（Dependency Injection，DI）：DI是实现IOC的一种方式。当我需要一个类对象，IOC容器给我们这个类对象的**过程**其实就是依赖注入，依赖注入有构造函数注入和属性注入。

[[官方]ASP.NET Core 依赖注入](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2)
[全面理解 ASP.NET Core 依赖注入](https://www.cnblogs.com/jesse2013/p/di-in-aspnetcore.html)
官方推荐通过构造函数。这也是所谓的显式依赖。Asp.Net Core 的标准依赖注入容器不支持属性注入。（可以使用autofac或者其他来实现属性注入）
[ASP.NET Core 中依赖注入的N种玩法](https://www.cnblogs.com/artech/p/di-asp-net-core-pipeline-2.html)
[ASP.NET Core 自定义特性实现属性注入](https://www.cnblogs.com/viter/p/11085318.html)
[ASP.NET Core 原生DI实现批量注册](http://www.cnblogs.com/ShenNan/p/10256562.html)
可以参考 Abp 框架，设计三个全局注入接口，来实现自动化注入：ISingletonDependency 和 ITransientDependency 、 IScopedDependency （ 单例、瞬时、范围）。
如何实现一个接口注入多个实现类？
[.Net Core DI依赖注入：一个接口注入多个实现类](https://blog.csdn.net/qq_26900081/article/details/106251107)
[ASP.NET Core默认注入方式下如何注入多个实现（多种方式）](https://blog.csdn.net/starfd/article/details/81282651)
案例1：使用nlog时，想根据需要使用不同的配置文件 Nlog.config 写日志时
案例2：使用分布式缓存 IDistributedCache 时，想根据需要在一个项目中同时使用redis和sqlserver
[ASP.NET Core 中多个接口对应同一个实现的正确姿势](https://andrewlock.net/how-to-register-a-service-with-multiple-interfaces-for-in-asp-net-core-di/)
[ASP.NET Core 依赖注入扩展库 Scrutor](https://www.cnblogs.com/catcher1994/p/10316928.html)
[[OSharp]使用 `IServiceProvider.GetService<T>()` 实现按需注入，优化性能](https://www.cnblogs.com/guomingfeng/p/osharpns-steps-service.html)
[在WPF中使用.NET Core 3.0依赖项注入和服务提供程序](https://www.cnblogs.com/muran/p/11759899.html)
[.NetCore之依赖注入作用域和对象释放(根容器、请求容器)](https://mp.weixin.qq.com/s/DUL4CUsZIWmwE7N6mpgqLw)
.NetCore 中IServiceProvider的 GetService（）和GetRequiredService（）之间的区别

- GetService- 如果服务未注册，则返回null
- GetRequiredService- 如果服务未注册，则抛出一个Exception异常


**#、ASP.NET Core 结合 Autofac 的使用**
[AutoFac三种注入方式：按类型、按名称、按键](http://www.cnblogs.com/wolegequ/archive/2012/06/03/2532605.html)
[Asp.Net Core 2.0 之旅---AutoFacIOC容器的使用教程（批量注入）](https://blog.csdn.net/huanghuangtongxue/article/details/78914306)
[Asp.Net Core 2.0 之旅---AutoFac仓储泛型的依赖注入（泛型注入）](https://blog.csdn.net/huanghuangtongxue/article/details/78937494)
[ASP.NET Core 技巧之伪属性注入](https://www.cnblogs.com/stulzq/p/12610026.html)(属性注入会造成类型的依赖关系隐藏，测试不友好等)

ASP.NET Core 2.0中使用Autofac实现属性注入的代码片段

```
public IServiceProvider ConfigureServices(IServiceCollection services) 
{
    // 第一步：替换系统默认Controller创建器（否则Controller下面无法使用属性注入）
    // 在 services.AddMvc() 之前
    services.Replace(ServiceDescriptor.Transient<IControllerActivator, ServiceBasedControllerActivator>());
    services.AddMvc();
 
    var builder = new ContainerBuilder();
 
    // 第二步：找到所有Controller的类型
    // 通过Autofac对Controller类型进行属性注册 PropertiesAutowired()
    var assembly = this.GetType().GetTypeInfo().Assembly;
    var manager = new ApplicationPartManager();
    manager.ApplicationParts.Add(new AssemblyPart(assembly));
    manager.FeatureProviders.Add(new ControllerFeatureProvider());
    var feature = new ControllerFeature();
    manager.PopulateFeature(feature);
    builder.RegisterTypes(feature.Controllers.Select(ti => ti.AsType()).ToArray()).PropertiesAutowired();
    // 第三步：配置 ContainerBuilder，返回 IServiceProvider 
    builder.Populate(services);
    return new AutofacServiceProvider(builder.Build());
}
```
[浅谈.Net Core 3.1中使用Autofac替换自带的DI容器](https://www.cnblogs.com/cool-net/p/14903129.html)
在 .Net Core2 中一般是把 Startup 的 ConfigureServices 方法返回值类型改为IServiceProvider，然后通过构建Autofac容器并注入服务后返回。
在 .Net Core3.0之后，集成方式做了部分调整

**#、构造函数注入&属性注入**
描述来源于Abp.io中文文档：[查看详情](https://docs.abp.io/zh-Hans/abp/latest/Dependency-Injection)
构造方法注入
是将依赖项注入类的首选方式.这样,除非提供了所有构造方法注入的依赖项,否则无法构造类.因此,该类明确的声明了它必需的服务.
属性注入
```
public class MyService : ITransientDependency
{
public ILogger<MyService> Logger { get; set; }
public MyService()
{
Logger = NullLogger<MyService>.Instance;
}
}
```
对于属性注入依赖项,使用公开的setter声明公共属性.这允许DI框架在创建类之后设置它.
属性注入依赖项通常被视为可选依赖项.这意味着没有它们,服务也可以正常工作.Logger就是这样的依赖项,MyService可以继续工作而无需日志记录.
为了使依赖项成为可选的,我们通常会为依赖项设置默认/后备(fallback)值.在此示例中,NullLogger用作后备.因此,如果DI框架或你在创建MyService后未设置Logger属性,则MyService依然可以工作但不写日志.
属性注入的一个限制是你不能在构造函数中使用依赖项,因为它是在对象构造之后设置的.
当你想要设计一个默认注入了一些公共服务的基类时,属性注入也很有用.如果你打算使用构造方法注入,那么所有派生类也应该将依赖的服务注入到它们自己的构造方法中,这使得开发更加困难.但是,对于非可选服务使用属性注入要非常小心,因为它使得类的要求难以清楚地看到.

### ASP.NET Core WebAPI
[API接口设计最佳实践](https://blog.csdn.net/justyman/article/details/103221939)（token，协议规范，路径规范，版本管理，调用门槛，返回规范，安全性，幂等性）
[AspNetCore打造一个“最安全”的api接口](https://www.cnblogs.com/xuejiaming/p/15384015.html)
[面试官:你连HTTP请求Post和Get都不了解？](https://mp.weixin.qq.com/s/B8jP79pdl8mtfBGei23Y5w)
[简单聊下.NET6 Minimal API的使用方式](https://www.cnblogs.com/wucy/p/15611641.html)
[创建ASP.NET Core Web API （ControllerBase、参数绑定源）](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/?view=aspnetcore-6.0)
版本控制
[RESTful API版本控制策略](https://www.cnblogs.com/kenshinobiy/p/4462424.html)
[ASP.Net Core WebAPI 几种版本控制对比](https://www.cnblogs.com/runningsmallguo/p/7484954.html)（nuget：Microsoft.AspNetCore.Mvc.Versioning）
[ASP.NET Core 构建带有版本控制的 API 接口（结合SwaggerUI）](https://www.cnblogs.com/danvic712/p/10176823.html)
[ABP 适用性改造 - 添加 API 版本化支持](https://www.cnblogs.com/danvic712/p/add-api-version-support-in-abp-framework.html)
[使用 ASP.NET Core WebAPI 小技巧](https://www.cnblogs.com/danvic712/p/11255423.html)
[使用 Web API 约定](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/advanced/conventions?view=aspnetcore-3.0)
[使用 Web API 分析器告警缺失的约定](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/advanced/analyzers?view=aspnetcore-3.0&tabs=visual-studio)
[ASP.NET Core AutoWrapper 自定义响应输出](https://www.cnblogs.com/yyfh/p/12602087.html)
API调试工具
[简单的Postman，还能玩出花？](https://www.cnblogs.com/trunks2008/p/15107170.html)
[常见的几个接口管理平台简介](https://www.cnblogs.com/mrjade/p/12162188.html)
[API集成管理平台YAPI的搭建和使用](http://www.bewindoweb.com/222.html) （具有多人协作的功能） （[体验地址](https://yapi.baidu.com/)）
[API集成管理工具Apifox](https://www.cnblogs.com/jinjiangongzuoshi/p/13371537.html)

### ASP.NET Core：MVC 与 Razor Pages
[ASP.NET Core MVC 静态文件目录配置与访问授权](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/static-files?view=aspnetcore-2.2)
[ASP.NET Core 十种方式扩展你的 Views](https://www.cnblogs.com/savorboard/p/aspnetcore-views.html)
[ASP.NET Core 中的特殊视图文件（_Layout.cshtml、_ViewStart.cshtml、_ViewImports.cshtml）](https://www.cnblogs.com/jesen1315/p/11041967.html)
[ASP.NET Core 3.1 Razor 视图预编译、动态编译](https://www.cnblogs.com/Gxiaopan/p/13834673.html)
新的 Razor 机制
[ASP.NET Core Razor SDK](https://docs.microsoft.com/zh-cn/aspnet/core/razor-pages/sdk?view=aspnetcore-2.2)
[ASP.NET Core 的 Razor 语法参考](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/views/razor?view=aspnetcore-3.0)
[ASP.NET Core 中的 Razor 页面介绍（OnGet、OnPost、单页多Handler方式）](https://docs.microsoft.com/zh-cn/aspnet/core/razor-pages/?tabs=visual-studio&view=aspnetcore-2.2)
[ASP.NET Core 中 Razor 页面的IPageFilter](https://docs.microsoft.com/zh-cn/aspnet/core/razor-pages/filter?view=aspnetcore-2.2)
[ASP.NET Core 中 Razor 页面的路由和应用约定](https://docs.microsoft.com/zh-cn/aspnet/core/razor-pages/razor-pages-conventions?view=aspnetcore-2.2)
[ASP.NET Core Razor 配置：预编译，动态编译，混合编译](http://www.zkea.net/codesnippet/detail/razor-compilation.html)
WebForm & MVC & Razor Pages
[[译]ASP.NET：WebForms vs MVC](https://www.cnblogs.com/heyuquan/p/webForms-vs-mvc.html)
[ASP.NET Core Razor页面 vs MVC](https://www.cnblogs.com/tdfblog/p/asp-net-razor-pages-vs-mvc.html)
[[译]ASP.Net Core 2.0中的Razor Page不是WebForm](https://www.cnblogs.com/runningsmallguo/articles/7376565.html)
[ASP.NET Core Razor页面简化了 ASP.NET MVC 应用程序](https://msdn.microsoft.com/magazine/mt842512)

### HttpContext
[ASP.NET Core 中访问 HttpContext 的方法](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/http-context?view=aspnetcore-3.0)
[ASP.NET Core 中通过IHttpContextAccessor实现公用静态HttpContext](https://www.cnblogs.com/gdsblog/p/9119611.html)

### 状态管理
常见方式：Cookie、Session、TempData、查询字符串、HttpContext.Items、缓存、依赖关系注入
[ASP.NET Core 中的会话和应用状态](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/app-state?view=aspnetcore-3.0)
#、session
[ASP.NET Core 在通用数据保护条例规则下使用 session](https://www.cnblogs.com/lwqlun/p/10526380.html)
[ASP.NET Core 使用Redis存储Session](https://www.cnblogs.com/stulzq/p/7729105.html)
#、cookie
[Cookie 的 SameSite 属性](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)（注意http>>https重定向跨域导致的cookie丢失问题）
[.Net Core3.1中SameSite的使用方法](https://www.cnblogs.com/w821759016/p/14595832.html)
[ASP.NET Core SameSite 设置引起 Cookie 在 QQ 浏览器中不起作用](https://www.cnblogs.com/dudu/p/10959557.html)
[[github]ASP.NET Core CookieManager](https://github.com/nemi-chand/CookieManager)


### 通信
[对比 gRPC 服务和 HTTP API 服务](https://docs.microsoft.com/zh-cn/aspnet/core/grpc/comparison?view=aspnetcore-3.0)
[.NET Core 基于Websocket的在线聊天室](https://www.cnblogs.com/kklldog/p/core-for-websocket.html)
#、HttpClient
传统.NET HttpClient坑
[ASP.NET Core HttpClient的演进和避坑](https://www.cnblogs.com/viter/p/10086997.html)
[C#中HttpClient使用注意：静态化、预热和长连接](https://www.cnblogs.com/dudu/p/csharp-httpclient-attention.html)
[ASP.NET Core HttpClient的各种用法、生命周期管理](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.2)
[DotNetCore 使用Http请求及基于 Polly 的处理故障](https://www.cnblogs.com/haosit/p/9722213.html)
[DotNetCore 中 HttpClientFactory 类源码分析](https://www.cnblogs.com/lizhizhang/p/9502862.html)
#、RPC
Grpc
 [[github]google protobuf](https://github.com/protocolbuffers/protobuf)
 [Protobuf3语法详解](https://www.cnblogs.com/tohxyblog/p/8974763.html)
 [C## protobuf3的序列化和反序列化](https://blog.csdn.net/weixin_39637610/article/details/97012140)
 [protocol buffer的命令protoc整理](https://www.jianshu.com/p/78abc30d2710)
[使用 gRPC-UI 调试.NET 5的gPRC服务](https://www.cnblogs.com/myshowtime/p/14304668.html)
 [ASP.NET Core 3.0 使用gRPC](https://www.cnblogs.com/stulzq/p/11581967.html)
 [ASP.NET Core 3.0 gRPC 双向流](https://www.cnblogs.com/stulzq/p/11590088.html)
 [使用 ASP.NET Core 的 gRPC 服务](https://docs.microsoft.com/zh-cn/aspnet/core/grpc/aspnetcore?view=aspnetcore-3.1&tabs=visual-studio)
 [[netcore]GRpc添加客户端的五种方式](https://www.cnblogs.com/ancold/p/12965813.html)
 [.NET Core 中的 gRPC 客户端工厂集成（依赖注入）](https://docs.microsoft.com/zh-cn/aspnet/core/grpc/clientfactory?view=aspnetcore-3.1)
 [两个gRPC的C#库：grpc-dotnet vs Grpc.Core](https://mp.weixin.qq.com/s/CVjfWCWuCerBSJIc8iLPSw)
 [Grpc调试：AspNetCore.Grpc.Swagger 由微软提供（.NET5.0版本）](https://github.com/aspnet/AspLabs/tree/master/src/GrpcHttpApi/src/Microsoft.AspNetCore.Grpc.Swagger)--（[github issue](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/1306)）
 [支持使用Restful API方式调用Grpc方法：GrpcJsonTranscoder](https://github.com/thangchung/GrpcJsonTranscoder)
 [[github]基于gRPC的实时网络引擎：MagicOnion](https://github.com/Cysharp/MagicOnion)      
DotNetty
 [[github]Azure开源的网络通信框架DotNetty](https://github.com/Azure/DotNetty)
#、SignalR
[ASP.NET Core SignalR 简介](https://docs.microsoft.com/zh-cn/aspnet/core/signalr/introduction?view=aspnetcore-2.2)
[ASP.NET Core基于SignalR实现消息推送实战演练](https://www.jianshu.com/p/7c23875d0b02)
[SignalR 中丰富多彩的消息推送方式](https://www.cnblogs.com/viter/p/10638331.html)
[在后台主机中托管SignalR服务并广播心跳包](https://www.cnblogs.com/viter/p/10771974.html)


### 发布部署
nginx
[Nginx 常用配置清单](https://mp.weixin.qq.com/s/eUindWNZiCv_tSLQeYfmLg)
[nginx 之 https 证书配置](https://www.cnblogs.com/crazymagic/p/11042333.html)
[asp.net core 只有发布之后才能在IIS上部署访问（而asp.net 程序 是可以直接指定到源代码目录访问）](https://q.cnblogs.com/q/116899/)
[.Net Core 跨平台：一个简单程序的多平台(windows、Linux、osx)发布](https://www.cnblogs.com/sndnnlfhvk/p/11613685.html)
[.NET Core应用的三种部署方式](https://www.cnblogs.com/Cwj-XFH/p/11612821.html)
[.NET Core RID 目录 （参数：-r|--runtime）](https://docs.microsoft.com/zh-cn/dotnet/core/rid-catalog)
[.NET Core 目标框架 （参数：-f|--framework）](https://docs.microsoft.com/zh-cn/dotnet/standard/frameworks)
[快速搞懂.NET 5/.NET Core应用程序的发布部署](https://www.cnblogs.com/tianqing/p/14403255.html)
[发布 .NET 5 带运行时单文件应用时优化文件体积的方法（.pubxml）](https://www.cnblogs.com/Soar1991/p/14771254.html)
IIS上部署.NET Core应用
第一步：[安装 ASPNetCoreModule2 模块](https://blog.csdn.net/honeycandys/article/details/103574881)  （[ASPNetCoreModule和ASPNetCoreModuleV2之间有什么区别？](https://www.5axxw.com/questions/content/szungv)）
第二步：[IIS部署.Net5全流程](https://www.cnblogs.com/azrng/p/14787882.html)

[ASP.NET Core 部署到 Linux 进行托管](https://www.cnblogs.com/viter/p/10408012.html)
[在Linux上使用 pm2 守护你的 .NET Core 应用程序](https://www.cnblogs.com/stulzq/p/9775973.html)--([pm2](https://github.com/Unitech/pm2) github starts 31.1k)
[在Linux上使用Nginx + supervisor部署ASP.NET Core程序](https://www.cnblogs.com/esofar/p/8043792.html)--([supervisor](https://github.com/Supervisor/supervisor) github starts 5.8k)
[ASP.NET Core 使用Docker进行容器化托管](https://www.cnblogs.com/viter/p/10463907.html)
[在Docker上部署自动更新ssl证书的nginx + .NET Core](https://www.cnblogs.com/podolski/p/13992405.html)
[配置 ASP.NET Core 以使用代理服务器和负载均衡器](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/proxy-load-balancer?view=aspnetcore-2.2)
 [使用 Nginx 在 Linux 上托管 ASP.NET Core](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-2.2)
 [使用 Apache 在 Linux 上托管 ASP.NET Core](https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/linux-apache?view=aspnetcore-2.2)
[ASP.NET Core nginx反向代理部署](https://www.cnblogs.com/sheng-jie/p/Deploy-ASP-NET-CORE-WITH-REVERSE-PROXY.html)


### 单元测试
[.NET Core 和 .NET Standard 单元测试最佳做法](https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-best-practices)
[.NET 测试篇之Moq框架简单使用](https://www.cnblogs.com/tylerzhou/p/11410337.html)
[使用 dotnet test 和 xUnit 在 .NET Core 中进行 C## 单元测试](https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-with-dotnet-test)
[使用 dotnet test 和 NUnit 在 .NET Core 中进行 C## 单元测试](https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-with-nunit)
[使用 dotnet test 和 MSTest 在 .NET Core 中进行 C## 单元测试](https://docs.microsoft.com/zh-cn/dotnet/core/testing/unit-testing-with-mstest)
[使用 dotnet test --filter 进行选择性单元测试](https://docs.microsoft.com/zh-cn/dotnet/core/testing/selective-unit-tests)


### 视频教程
[从零开始学ASP.NET Core -- 角落的白板报](https://www.bilibili.com/video/av48164112)
[ASP.NET Core 3.0 入门视频 -- solenovex](https://www.bilibili.com/video/av65313713/)
[NetCore 视频教程（Blog.Core）--- 老张](https://www.bilibili.com/video/av58096866/?p=1)


### 一些坑
时间相关
[c#：细说时区、DateTime和DateTimeOffset在国际化中的应用](https://blog.csdn.net/u010476739/article/details/118339679)
DateTimeOffset(推荐)
[C#中DateTime的缺陷与代替品DateTimeOffset](https://www.cnblogs.com/zlmdy/p/8560396.html)
DateTime（旧系统）
[dotnet core windows和linux的时区处理](https://www.cnblogs.com/xiaoXuZhi/p/netcoredatetime.html)([开源库：nodatime](https://github.com/nodatime/nodatime))
[时间扩展库：FluentDateTime](https://github.com/FluentDateTime/FluentDateTime)


### Blazor
[Blazor VS 传统Web应用程序](https://mp.weixin.qq.com/s/0ghXzpdEsZycaarIxGLNRg)
Blazor托管模型：在客户端模型中，Blazor在浏览器内部的WebAssembly（WASM）上运行，在服务器端模型中，Blazor在服务器上运行，并通过Signal-R将HTML传输到客户端
[大量 Blazor 学习资源（一）](https://www.cnblogs.com/MrHuo/p/12951494.html)

### 资料
[https://www.cnblogs.com/heyuquan/p/dotnet-basic-learning-resource.html](https://www.cnblogs.com/heyuquan/p/dotnet-basic-learning-resource.html)
