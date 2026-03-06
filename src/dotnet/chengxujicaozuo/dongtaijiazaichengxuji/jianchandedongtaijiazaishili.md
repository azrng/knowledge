---
title: 简单的动态加载示例
lang: zh-CN
date: 2023-07-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jianchandedongtaijiazaishili
slug: symc5v
docsId: '94663155'
---

## 目的
实现一个可以动态加载，动态更新服务的插件需求。插件的好处是什么？我们可以编写代码来动态去替换或者增加现有服务，使用得当的情况下风险小、操作方便。

## AssemblyLoadContext
AssemblyLoadContext 类是在 .NET Core 中引入的，在 .NET Framework 中不可用。在.Net5+和.NetCore的应用程序中均隐式使用它，它是运行时的提供程序，用来定位和加载依赖项，只要加载了依赖项，就会调用它的示例来定位该依赖项目。
卸载程序集：[https://learn.microsoft.com/zh-cn/dotnet/standard/assembly/unloadability#use-a-custom-collectible-assemblyloadcontext](https://learn.microsoft.com/zh-cn/dotnet/standard/assembly/unloadability#use-a-custom-collectible-assemblyloadcontext)

### 版本控制
单个 AssemblyLoadContext 实例限制为每个简单程序集名称只加载 Assembly 的一个版本。 当针对已加载同名程序集的 AssemblyLoadContext 实例解析程序集引用时，会将请求的版本与加载的版本进行比较。 仅当加载的版本等于或高于所请求的版本时，解析才会成功。

## 操作
> 本文示例环境：VS2022、.Net6

思路：通过将插件文件(类库的dll)保存在文件存储等地方，然后在项目启动的时候下载插件，然后加载到当前宿主的服务内进行实现需求。
> 注意：下面的示例为毛坯房版本


### 准备

#### 创建插件基础类库
首先我们需要先创建一个插件基础服务的类库DefaultPluginsExternalProvider，为了提高该类库扩展性，我们引用框架
```csharp
<ItemGroup>
  <FrameworkReference Include="Microsoft.AspNetCore.App" />
</ItemGroup>
```
该类库被插件服务所引用，该类库中包含一个插件服务基础类IProviderBase接口，内容如下
```csharp
/// <summary>
/// 插件提供基础类
/// </summary>
public interface IProviderBase
{
    /// <summary>
    /// 插件名称
    /// </summary>
    string Name { get; }

    /// <summary>
    /// 插件显示名
    /// </summary>
    string DisplayName { get; }

    /// <summary>
    /// 插件描述
    /// </summary>
    string Description { get; }

    /// <summary>
    /// 插件服务注册
    /// </summary>
    /// <param name="services">ioc容器</param>
    /// <param name="configuration">插件配置</param>
    void PluginsConfigureService(IServiceCollection services, IConfiguration configuration);
}
```
这里的PluginsConfigureService用来注册插件的服务，然后再创建保存插件信息的类Plugin
```csharp
/// <summary>
/// 插件服务类(保存插件加载信息)
/// </summary>
public class Plugin
{
    /// <summary>
    /// 插件地址信息
    /// </summary>
    public string Path { get; set; }

    /// <summary>
    /// 程序集名称
    /// </summary>
    public string AssemblyName { get; set; }

    /// <summary>
    /// 程序集版本
    /// </summary>
    public string Version { get; set; }

    /// <summary>
    /// 默认程序集
    /// </summary>
    public Assembly Assembly { get; set; }

    /// <summary>
    /// 服务提供基础类
    /// </summary>
    public IProviderBase ProvideInstance { get; set; }

    /// <summary>
    /// 错误信息
    /// </summary>
    public string Error { get; set; }

    /// <summary>
    /// 配置
    /// </summary>
    public string Configuration { get; set; }

    /// <summary>
    /// 插件元数据信息
    /// </summary>
    public PluginMatadata Matadata { get; set; }
}
```
增加一个插件元数据信息的类
```csharp
/// <summary>
/// 插件元数据配置
/// </summary>
public class PluginMatadata
{
    /// <summary>
    /// 名称
    /// </summary>
    [JsonPropertyName("name")]
    public string Name { get; set; }

    /// <summary>
    /// 显示名
    /// </summary>
    [JsonPropertyName("displayName")]
    public string DisplayName { get; set; }

    /// <summary>
    /// 描述
    /// </summary>
    [JsonPropertyName("description")]
    public string Description { get; set; }
}
```
该类用来映射上面IProviderBase实现类中配置的信息。
![image.png](/common/1667739757250-c1d83f8d-a952-42d2-9d9c-9715255d8883.png)

#### 创建宿主程序
新建一个.NetCoreWebApi程序DefaultSample，然后创建插件加载帮助类PluginHelper
```csharp
/// <summary>
/// 插件帮助类
/// </summary>
public static class PluginHelper
{
    /// <summary>
    /// 获取插件加载的信息
    /// </summary>
    /// <param name="rootPath"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public static List<Plugin> GetPluginLoaders(string rootPath)
    {
        var loaders = new List<Plugin>();
        Directory.CreateDirectory(Path.Combine(rootPath, "Plugins"));
        var pluginsDir = Path.Combine(rootPath, "Plugins");
        foreach (var dir in Directory.GetDirectories(pluginsDir))
        {
            var dirName = Path.GetFileName(dir);
            var pluginDll = Path.Combine(dir, dirName + ".dll");
            if (!File.Exists(pluginDll))
            {
                continue;
            }

            var context = new AssemblyLoadContext(pluginDll);
            using var stream = File.OpenRead(pluginDll);
            var assembly = context.LoadFromStream(stream);

            var plugin = new Plugin
            {
                AssemblyName = assembly.GetName().Name,
                Version = assembly.GetName().Version.ToString(),
                Path = dir,
                Assembly = assembly,
            };
            try
            {
                // 判断插件中是否存在IProviderBase的实现类
                var instance = assembly.GetTypes()
                    .Where(t => typeof(IProviderBase).IsAssignableFrom(t) && !t.IsAbstract)
                    .Select(x => Activator.CreateInstance(x) as IProviderBase)
                    .FirstOrDefault();
                if (instance == null)
                {
                    throw new ArgumentException("No Matching Plugin Entry");
                }
                plugin.ProvideInstance = instance;
                plugin.Matadata = new PluginMatadata
                {
                    Name = instance.Name,
                    DisplayName = instance.DisplayName,
                    Description = instance.Description
                };
                var configurationRaw = "";
                if (File.Exists(Path.Join(dir, "configurations.json")))
                {
                    using var sr = new StreamReader(Path.Join(dir, "configurations.json"));
                    configurationRaw = sr.ReadToEnd();
                }
                plugin.Configuration = configurationRaw;

                loaders.Add(plugin);
            }
            catch (Exception ex)
            {
                plugin.Error = ex.Message;
                Console.WriteLine($"插件 {plugin.AssemblyName} 不兼容于当前版本，请升级到该插件的最新版本, Error: {ex.Message}");
            }
        }
        return loaders;
    }
}
```
在项目启动的时候加载插件
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var loaders = PluginHelper.GetPluginLoaders(builder.Environment.ContentRootPath);

/*
  注册当前宿主服务的服务
 */

// 读取插件
foreach (var p in loaders)
{
    var pluginInstance = p.ProvideInstance;
    // 映射配置文件
    var configurationRoot = (new ConfigurationBuilder()).SetBasePath(p.Path).AddJsonFile("configurations.json").Build();
    pluginInstance?.PluginsConfigureService(builder.Services, configurationRoot);
    Console.WriteLine($"加载插件{p.AssemblyName} {p.Matadata.Name} 成功,版本号:{p.Version} ");
}

var app = builder.Build();
```
完整结构如下
![image.png](/common/1667739832573-36eca67c-3bc8-43a3-bd7c-57974424c122.png)

### 动态替换服务
在.NetCore中，我们都是通过IOC容器注册服务然后通过构造函数等来获取服务，那么我们也可以通过依赖注入的方式替换宿主服务默认注册的实现，来实现替换的功能。

在上面的.NetCore服务中来实现一个发送消息通知的接口，因为我们要使用插件来替换默认实现，所以需要将接口类放在一个共享的类库中，新建类库DefaultSample.IService，在该类库中新建服务IMsgService
```csharp
/// <summary>
/// 消息服务
/// </summary>
public interface IMsgService
{
    /// <summary>
    /// 发送消息服务
    /// </summary>
    /// <returns></returns>
    bool SendMsg();
}
```
完整结构如下
![image.png](/common/1667739872799-36142922-b3bc-4f55-832f-f6d986d556c8.png)
在宿主程序中引用该类库并且创建消息通知的实现类DefaultMsgService
```csharp
public class DefaultMsgService : IMsgService
{
    private readonly ILogger<DefaultMsgService> _logger;

    public DefaultMsgService(ILogger<DefaultMsgService> logger)
    {
        _logger = logger;
    }

    public bool SendMsg()
    {
        _logger.LogInformation("使用邮箱发送消息成功");
        return true;
    }
}
```
新建控制器MsgController，来创建WebApi接口SendMsg
```csharp
[ApiController]
[Route("[controller]")]
public class MsgController : ControllerBase
{
    private readonly IMsgService _msgService;

    public MsgController(IMsgService msgService)
    {
        _msgService = msgService;
    }

    /// <summary>
    /// 发送消息通知
    /// </summary>
    /// <returns></returns>
    [HttpGet("sendMsg")]
    public bool SendMsg()
    {
        return _msgService.SendMsg();
    }
}
```
启动项目调用该接口输出信息，呕吼居然是错误信息
> System.InvalidOperationException: Unable to resolve service for type 'DefaultSample.IService.IMsgService' while attempting to activate 'DefaultSample.Controllers.MsgController'.

居然是忘了注入服务了，那么我们在program中注入短信服务
```csharp
/*
  注册当前宿主服务的服务
 */

builder.Services.AddScoped<IMsgService, DefaultMsgService>();
```
再次启动调用接口可以看到日志中输出了：使用邮箱发送消息成功

这个时候，我们正常的服务已经好了，那么下面开始编写插件来替换默认的服务，新建类库DefaultPluginsExternalProvider.Sample1来实现短信消息通知的功能，在该项目中，继承自类库DefaultPluginsExternalProvider和DefaultSample.IService(这里可以做成nuget包)，并且默认应该包含以下文件
> configurations.json：当前插件的配置文件
> PluginProvider：插件的入口程序，继承自接口IProviderBase
> {插件名}Options：用来将configurations的配置映射到模型

因为我们要发送短信，那么就弄一个短信服务的伪配置吧，修改configurations.json文件
```csharp
{
  "SmsUrl": "http://www.baidu.com"
}
```
修改Sample1Options文件
```csharp
/// <summary>
/// 配置文件
/// </summary>
public class Sample1Options
{
    /// <summary>
    /// 短信服务地址
    /// </summary>
    public string SmsUrl { get; set; }
}
```
修改PluginProvider类的文件内容
```csharp
public class PluginProvider : IProviderBase
{
    public string Name => "Sample1";

    public string DisplayName => "短信服务";

    public string Description => "发送短信服务";

    public void PluginsConfigureService(IServiceCollection services, IConfiguration configuration)
    {
        // 固定写法
        services.AddOptions();
        services.Configure<Sample1Options>(options => configuration.Bind(options));

        //自定义服务
        services.AddScoped<IMsgService, SmsService>();
    }
}
```
增加发送短信的实现类SmsService
```csharp
public class SmsService : IMsgService
{
    private readonly ILogger<SmsService> _logger;
    private readonly Sample1Options _sample1Options;

    public SmsService(ILogger<SmsService> logger, IOptions<Sample1Options> options)
    {
        _logger = logger;
        _sample1Options = options.Value;
    }

    public bool SendMsg()
    {
        _logger.LogInformation($"使用短信发送消息,服务地址 {_sample1Options.SmsUrl}");
        return true;
    }
}
```
完整项目结构如下
![image.png](/common/1667740068043-b489a8d2-ab77-4452-ab40-530ac80dcf13.png)
然后将该类库Release发布，并拷贝configurations.json、DefaultPluginsExternalProvider.Sample1.dll文件，并且宿主服务的Plugins文件夹下新建DefaultPluginsExternalProvider.Sample1文件夹，拷贝插件文件放到该目录下，如图所示
![image.png](/common/1664113888131-c68a0efb-b932-441f-976d-eecc30f03c73.png)
这个时候启动宿主项目并调用接口我们可以看到输出信息为：使用短信发送消息,服务地址 [http://www.baidu.com](http://www.baidu.com)

到此，动态替换服务功能完成。

### 动态增加接口
有时候，我们需要实现另外开放一些对外提供的WebApi接口，那我该如何使用插件实现那？

因为我们的插件基类已经引用了Microsoft.AspNetCore.App，所以我们直接在插件中创建控制器就可以了
```csharp
[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private readonly IMsgService _msgService;
    private readonly ILogger<TestController> _logger;

    public TestController(IMsgService msgService, ILogger<TestController> logger)
    {
        _msgService = msgService;
        _logger = logger;
    }

    /// <summary>
    /// 发送消息通知
    /// </summary>
    /// <returns></returns>
    [HttpGet("sendMsg")]
    public bool SendMsg()
    {
        _logger.LogInformation("我是插件中新添加的控制器");
        return _msgService.SendMsg();
    }
}
```
项目结构如下
![image.png](/common/1667740248154-018d90ab-8c1f-43e6-a5e6-96f07e9de26d.png)
然后按照上面的步骤，重新发布，然后拷贝到宿主程序的插件目录下，然后按照之前文章的经验，修改宿主服务注册代码为
```csharp
var mvcBuilder = builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var loaders = PluginHelper.GetPluginLoaders(builder.Environment.ContentRootPath);

/*
  注册当前宿主服务的服务
 */

builder.Services.AddScoped<IMsgService, DefaultMsgService>();

// 读取插件
foreach (var p in loaders)
{
    var loader = p.Assembly;
    // 注册控制器
    mvcBuilder.AddApplicationPart(loader);

    var pluginInstance = p.ProvideInstance;
    // 映射配置文件
    var configurationRoot = (new ConfigurationBuilder()).SetBasePath(p.Path).AddJsonFile("configurations.json").Build();
    pluginInstance?.PluginsConfigureService(builder.Services, configurationRoot);
    Console.WriteLine($"加载插件{p.AssemblyName} {p.Matadata.Name} 成功,版本号:{p.Version} ");
}

var app = builder.Build();
```
重点就是这一句：mvcBuilder.AddApplicationPart(loader);
然后再启动项目后就可以看到插件中添加的控制器了
![image.png](/common/1667740473464-73a8429d-c9d3-47ec-8613-fc44334238bd.png)
调用接口后会输出内容表示接口添加成功。

### 创建带依赖项的插件
使用 System.Runtime.Loader.AssemblyDependencyResolver 类型来允许插件具有依赖项，在宿主项目新建文件PluginLoadContext
```csharp
/// <summary>
/// 可以加载依赖项的AssemblyLoadContext
/// </summary>
public class PluginLoadContext : AssemblyLoadContext
{
    private readonly AssemblyDependencyResolver _resolver;

    public PluginLoadContext(string pluginPath)
    {
        // 使用.net类库的路径构建的，她根据类库的deps.json文件将程序集和本机库解析为他们的相对路径
        _resolver = new AssemblyDependencyResolver(pluginPath);
    }

    protected override Assembly Load(AssemblyName assemblyName)
    {
        string? assemblyPath = _resolver.ResolveAssemblyToPath(assemblyName);
        if (assemblyPath != null)
        {
            return LoadFromAssemblyPath(assemblyPath);
        }

        return null;
    }

    /// <summary>
    /// 加载非托管的dll
    /// </summary>
    /// <param name="unmanagedDllName"></param>
    /// <returns></returns>
    protected override IntPtr LoadUnmanagedDll(string unmanagedDllName)
    {
        string? libraryPath = _resolver.ResolveUnmanagedDllToPath(unmanagedDllName);
        if (libraryPath != null)
        {
            return LoadUnmanagedDllFromPath(libraryPath);
        }

        return IntPtr.Zero;
    }
}
```
然后修改我们的PluginHelper文件中加载程序集的方法，修改为
```csharp
/// <summary>
/// 加载程序集
/// </summary>
/// <param name="pluginLocation"></param>
/// <returns></returns>
private static Assembly LoadPlugin(string pluginLocation)
{
    // 不能加载带依赖项的
    //var context = new AssemblyLoadContext(Guid.NewGuid().ToString());
    //using var stream = File.OpenRead(pluginLocation);
    //return context.LoadFromStream(stream);

    var loadContext = new PluginLoadContext(pluginLocation);
    return loadContext.LoadFromAssemblyName(new AssemblyName(Path.GetFileNameWithoutExtension(pluginLocation)));
}

var assembly = LoadPlugin(pluginDll);
```
然后我们修改我们的插件项目(DefaultPluginsExternalProvider.Sample2)引用第三方包并设置项目配置为
```csharp
<PropertyGroup>
  <TargetFramework>net6.0</TargetFramework>
  <ImplicitUsings>enable</ImplicitUsings>
  <Nullable>enable</Nullable>
  <!--插件项目使用该配置，以便它们将其所有依赖项复制到 dotnet build 的输出中。 使用 dotnet publish 发布类库也会将其所有依赖项复制到发布输出-->
  <EnableDynamicLoading>true</EnableDynamicLoading>
</PropertyGroup>

<ItemGroup>
  <PackageReference Include="AzrngCommon" Version="1.3.0-beta9" />
</ItemGroup>

<ItemGroup>
  <ProjectReference Include="..\..\share\DefaultPluginsExternalProvider\DefaultPluginsExternalProvider.csproj">
    <!--配置是否将该引用项目输出，如果输出那么就不是从上下文继承IProviderBase，会导致找不到IProviderBase-->
    <private>false</private>
    <!--如果PluginBase引用其他包，则当前元素也很重要。 此设置与Private的效果相同，但适用于 PluginBase 项目或它的某个依赖项可能包括的包引用-->
    <ExcludeAssets>runtime</ExcludeAssets>
  </ProjectReference>
  <ProjectReference Include="..\..\share\DefaultSample.IService\DefaultSample.IService.csproj">
    <private>false</private>
    <ExcludeAssets>runtime</ExcludeAssets>
  </ProjectReference>
</ItemGroup>
```
在该配置中，引用了一个第三方的包，并设置了ProjectReference，这时候生成项目，查看输出的dll已经不包含项目引用的dll文件
![image.png](/common/1667739609380-4ed74aae-caf5-432f-8a2c-7041e543c75a.png)
将该目录的dll文件拷贝到插件文件夹下，调该插件的接口，返回结果
```csharp
{
  "data": true,
  "isSuccess": true,
  "code": "200",
  "message": "success",
  "errors": []
}
```
该返回结构代表第三方包已经加载成功了。

## 总结
该文档甚至算不上是实现，应该说是算是一种思路吧，毕竟关于插件存储，插件管理等功能都未提供，在合适的使用插件确实会很方便。

## 资料
.NET Core Web APi类库如何内嵌运行：[https://mp.weixin.qq.com/s/FdSlY-5SKfaQ6XpUarPKfw](https://mp.weixin.qq.com/s/FdSlY-5SKfaQ6XpUarPKfw)
使用插件创建.Net应用程序：[https://learn.microsoft.com/zh-cn/dotnet/core/tutorials/creating-app-with-plugin-support](https://learn.microsoft.com/zh-cn/dotnet/core/tutorials/creating-app-with-plugin-support)
