---
title: 类库运行WebApi
lang: zh-CN
date: 2023-06-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: leikuyunhangwebapi
slug: pux56b
docsId: '94420176'
---

## 概述
有些场景需要我们使用类库来运行WebApi(例如加载dll创建控制器)。

## 操作
创建一个控制台项目作为主程序，然后我们创建一个Embed.WebApi的类库来运行WebApi项目。我们在该类库中创建下面的接口，并实现相关的方法来运行WebApi
```csharp
public class InitTest : IInitTest
{
    public void Init()
    {
        var builder = WebApplication.CreateBuilder();

        builder.Services.AddControllers();

        var app = builder.Build();

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapDefaultControllerRoute();
        });

        app.Run();
    }
}

public interface IInitTest
{
    /// <summary>
    /// 初始化服务
    /// </summary>
    void Init();
}
```
因为Embed.WebApi项目我们创建的是一个类库，但是有为了WebApi里面的Api等，所以我们需要引用框架，完整的Embed.WebApi.csproj内容如下
```csharp
<Project Sdk="Microsoft.NET.Sdk">

	<PropertyGroup>
		<TargetFramework>net6.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
	</PropertyGroup>

	<ItemGroup>
		<FrameworkReference Include="Microsoft.AspNetCore.App" />
	</ItemGroup>
</Project>
```
这个时候我们在该类库中创建Controllers文件夹，并创建测试控制器，如下所示
```csharp
using Microsoft.AspNetCore.Mvc;

namespace Embed.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Test()
        {
            return Ok("Hello World");
        }
    }
}
```
最后在控制台主程序中注册上面的接口并调用初始化方法(记得让主程序引用该类库项目)，如下：
```csharp
var services = new ServiceCollection();
services.AddTransient<IInitTest, InitTest>();

var serviceProvider = services.BuildServiceProvider();

var initTest = serviceProvider.GetRequiredService<IInitTest>();

initTest.Init();

Console.Read();
```
启用项目，然后我们调用接口：/api/test/test  提示404，但是当我们将类库里面的控制器移动到控制台中的时候，此时请求可以成功，这是因为WebApi控制器的激活是以入口的主程序集来查询控制器并且激活的。

### AddApplicationPart
虽然移动控制器可以实现效果，但是这样子属于代码入侵了，我们想要让类库作为WebApi程序的一部分应用手动加载并激活，在初始化方法里面做如下修改即可让我们的接口请求成功。
```csharp
public class InitTest : IInitTest
{
    private static readonly string _assemblyName = typeof(InitTest).Assembly.GetName().Name!;

    public void Init()
    {
        var builder = WebApplication.CreateBuilder();

        //如果不配置AddApplicationPart，那么我们的控制器只能写在启用的项目中才能被找到
        builder.Services.AddControllers()
                .AddApplicationPart(Assembly.Load(new AssemblyName(_assemblyName)));

        var app = builder.Build();

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapDefaultControllerRoute();
        });

        app.Run();
    }
}

public interface IInitTest
{
    /// <summary>
    /// 初始化服务
    /// </summary>
    void Init();
}
```
这个情况更适合于底层的主入口已经封装好，所以只能采用这种方式，如果主入口我们可控，那么可以采用另外一个方式。

### 主入口可控
来看一段关键性源码
```csharp
/// <summary>
/// Populates the given <paramref name="feature"/> using the list of
/// <see cref="IApplicationFeatureProvider{TFeature}"/>s configured on the
/// <see cref="ApplicationPartManager"/>.
/// </summary>
/// <typeparam name="TFeature">The type of the feature.</typeparam>
/// <param name="feature">The feature instance to populate.</param>
public void PopulateFeature<TFeature>(TFeature feature)
{
    if (feature == null)
    {
        throw new ArgumentNullException(nameof(feature));
    }

    foreach (var provider in FeatureProviders.OfType<IApplicationFeatureProvider<TFeature>>())
    {
        provider.PopulateFeature(ApplicationParts, feature);
    }
}

internal void PopulateDefaultParts(string entryAssemblyName)
{
    var assemblies = GetApplicationPartAssemblies(entryAssemblyName);

    var seenAssemblies = new HashSet<Assembly>();

    foreach (var assembly in assemblies)
    {
        if (!seenAssemblies.Add(assembly))
        {
            // "assemblies" may contain duplicate values, but we want unique ApplicationPart instances.
            // Note that we prefer using a HashSet over Distinct since the latter isn't
            // guaranteed to preserve the original ordering.
            continue;
        }

        var partFactory = ApplicationPartFactory.GetApplicationPartFactory(assembly);
        foreach (var applicationPart in partFactory.GetApplicationParts(assembly))
        {
            ApplicationParts.Add(applicationPart);
        }
    }
}

private static IEnumerable<Assembly> GetApplicationPartAssemblies(string entryAssemblyName)
{
    var entryAssembly = Assembly.Load(new AssemblyName(entryAssemblyName));

    // Use ApplicationPartAttribute to get the closure of direct or transitive dependencies
    // that reference MVC.
    var assembliesFromAttributes = entryAssembly.GetCustomAttributes<ApplicationPartAttribute>()
        .Select(name => Assembly.Load(name.AssemblyName))
        .OrderBy(assembly => assembly.FullName, StringComparer.Ordinal)
        .SelectMany(GetAssemblyClosure);

    // The SDK will not include the entry assembly as an application part. We'll explicitly list it
    // and have it appear before all other assemblies \ ApplicationParts.
    return GetAssemblyClosure(entryAssembly)
        .Concat(assembliesFromAttributes);
}

private static IEnumerable<Assembly> GetAssemblyClosure(Assembly assembly)
{
    yield return assembly;

    var relatedAssemblies = RelatedAssemblyAttribute.GetRelatedAssemblies(assembly, throwOnError: false)
        .OrderBy(assembly => assembly.FullName, StringComparer.Ordinal);

    foreach (var relatedAssembly in relatedAssemblies)
    {
        yield return relatedAssembly;
    }
}
```
从上述源码可知，通过主入口程序集还会加载引用的程序集去查找并激活相关特性（比如控制器），当然前提是实现ApplicationPartAttribute特性，此特性必须在主入口程序集里定义，定义在程序集上.

所以我们就只需要一行代码即可搞定，我们在控制台入口命名空间顶部加入特性，引入Web APi类库作为程序集作为引用程序一部分，比如在控制台的Program最上面添加
```csharp
using Embed.WebApi;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using Microsoft.Extensions.DependencyInjection;
[assembly: ApplicationPart("Embed.WebApi")] // 引入程序集
```
经过测试我们是可以调用成功的。

### 运行多个WebApi
当我们需要运行多个WebApi类库的时候，我们也可以通过MSBuild任务来进行构建将相关特性自动添加到主入口程序集描述信息里面去，例如：
```csharp
<ItemGroup>
	<AssemblyAttribute Include="Microsoft.AspNetCore.Mvc.ApplicationParts.ApplicationPartAttribute">
		<_Parameter1>Embed.WebApi</_Parameter1>
	</AssemblyAttribute>
	<AssemblyAttribute Include="Microsoft.AspNetCore.Mvc.ApplicationParts.ApplicationPartAttribute">
		<_Parameter1>Embed.WebApi2</_Parameter1>
	</AssemblyAttribute>
</ItemGroup>
```
> 注入：如果两个控制器包含相同的路由地址，那么会出错

这样子一个一个写，或者将多个WebApi放在同一个解决方案下，然后在此解决发难下创建可构建任务的.targets文件，并在主项目中引用，将程序集名称作为变量引入。
配置文件如下
```csharp
<ItemGroup>
    <AssemblyAttribute Include="Microsoft.AspNetCore.Mvc.ApplicationParts.ApplicationPartAttribute">
        <_Parameter1>$(AssemblyName)</_Parameter1>
    </AssemblyAttribute>
</ItemGroup>
```

## 资料
汪鹏老师的WebApi类库如何内嵌运行：[https://mp.weixin.qq.com/s/b8j_sXJyl0e1w4rH_SEtcw](https://mp.weixin.qq.com/s/b8j_sXJyl0e1w4rH_SEtcw)
