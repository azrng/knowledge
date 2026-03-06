---
title: 版本控制
lang: zh-CN
date: 2022-01-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: banbenkongzhi
slug: uuuigo
docsId: '30622258'
---
> 本文示例代码环境：vs2019+.Net5


## 1. 优点

1. 有助于保护原有系统，不受影响，并及时修改问题
2. 可以实现用户的私人定制（比如是付费接口）
3. 快速迭代

## 2. API版本控制

- 在URL中追加版本或者作为查询字符串参数
- 通过自动以标头和通过接受标头

### 2.1 安装组件
ASP.NET API versioning为您提供了一种功能强大但易于使用的方法，用于将API版本控制语义添加到使用ASP.NET构建的新的和现有的REST服务中。API版本控制扩展定义了简单的元数据属性和约定，用于描述您的服务实现了哪些API版本。
```csharp
<PackageReference Include="Microsoft.AspNetCore.Mvc.Versioning" Version="4.2.0" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer" Version="4.2.0" />
```

#### 2.1.1 常用配置
```csharp
[ApiVersion("1.1")] //设置版本号
[ApiVersionNeutral]//退出版本控制
[MapToApiVersion("1.1")] //设置独立版本
[ApiVersion("1.0", Deprecated = true)]//api版本已经被弃用
HttpContext.GetRequestedApiVersion().ToString(); //访问版本信息 
```

### 2.2 QueryString来实现版本控制

#### 2.2.1 ConfigureServices中配置
```csharp
//Versioning用来实现API的版本控制
services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 1);//默认版本号
    options.AssumeDefaultVersionWhenUnspecified = true;//此选项将用于不提供版本的请求，默认情况下假定API的版本为1.0
    options.ReportApiVersions = true;//当设置为true时候，api将返回响应标头中支持的版本信息
    //下面这句默认不写也可以
    //options.ApiVersionReader = new QueryStringApiVersionReader(parameterNames: "api-version");//该名称用于查询时候使用
});
```

#### 2.2.2 控制器设置版本
```csharp
namespace NetCore_SwaggerVersion.Controllers.v1
{
    /// <summary>
    /// 版本1.1
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.1")]//可以设置多个
    [ApiVersion("1.2")]
    public class TestController : ControllerBase
    
namespace NetCore_SwaggerVersion.Controllers.v2
{
    /// <summary>
    /// 版本2.0
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("2.6")]
    public class TestController : ControllerBase
```
> 不同命名空间下可以存在相同的控制器


#### 2.2.3 特定方法设置版本
```csharp
[MapToApiVersion("1.1")]
[HttpGet]
public IEnumerable<string> Get()
```

#### 2.2.4 设置不受版本控制
```csharp
[ApiVersionNeutral]//退出版本控制
[ApiController]
[Route("api/[controller]/[action]")]
 public class WeatherForecastController : ControllerBase
```

#### 2.3.5 访问地址
```csharp
http://localhost:5000/api/WeatherForecast/Get //不写版本号的话走的是默认的版本号
http://localhost:5000/api/Test?api-version=1.1
http://localhost:5000/api/Test?api-version=1.2
http://localhost:5000/api/Test?api-version=2.6
```

### 2.3 URL Path Segment来实现版本控制

#### 2.3.1 ConfigureServices中配置
```csharp
//Versioning用来实现API的版本控制
services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 1);//默认版本号
    options.AssumeDefaultVersionWhenUnspecified = true;//此选项将用于不提供版本的请求，默认情况下假定API的版本为1.0
    options.ReportApiVersions = true;//当设置为true时候，api将返回响应标头中支持的版本信息
});
```

#### 2.3.2 控制器设置版本
```csharp
namespace NetCore_SwaggerVersion.Controllers.v1
{
    /// <summary>
    /// 版本1.1
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("1.0")]
    [ApiVersion("1.1")]//定义控制器提供哪个版本的API
    public class TestController : ControllerBase
    
namespace NetCore_SwaggerVersion.Controllers.v2
{
    /// <summary>
    /// 版本2.0
    /// </summary>
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.6")]
    public class TestController : ControllerBase
```
> 不同命名空间下可以存在相同的控制器


#### 2.3.3 特定方法设置版本
```csharp
[MapToApiVersion("1.1")]
[HttpGet]
public IEnumerable<string> Get()
```

#### 2.3.4 设置不受版本控制
```csharp
[ApiVersionNeutral]//退出版本控制
[ApiController]
[Route("api/[controller]/[action]")]
public class WeatherForecastController : ControllerBase
```

#### 2.3.5 访问地址
```csharp
http://localhost:5000/api/v1.0/Test
http://localhost:5000/api/v1.1/Test
http://localhost:5000/api/v2.6/Test
http://localhost:5000/api/WeatherForecast/Get 不受版本控制
```

### 2.4 HTTP Headers来实现版本控制

#### 2.4.1 ConfigureServices中配置
```csharp
//Versioning用来实现API的版本控制
services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 1);//默认版本号
    options.AssumeDefaultVersionWhenUnspecified = true;//此选项将用于不提供版本的请求，默认情况下假定API的版本为1.0
    options.ReportApiVersions = true;//当设置为true时候，api将返回响应标头中支持的版本信息
    //header传递版本信息
    options.ApiVersionReader = new HeaderApiVersionReader("version");
    options.ApiVersionSelector = new CurrentImplementationApiVersionSelector(options);//如果没有传输版本号，那么会使用最大版本号  LowestImplementedApiVersionSelector是最小版本号
    options.UseApiBehavior = false;//是否使用API行为
});
```

#### 2.4.2 控制器设置版本
```csharp
namespace NetCore_SwaggerVersion.Controllers.v1
{
    /// <summary>
    /// 版本1.1
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("1.1")]//定义控制器提供哪个版本的API
    public class TestController : ControllerBase
    
namespace NetCore_SwaggerVersion.Controllers.v2
{
    /// <summary>
    /// 版本2.0
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [ApiVersion("2.6")]
    public class TestController : ControllerBase
```
> 不同命名空间下可以存在相同的控制器


#### 2.4.3 特定方法设置版本
```csharp
[MapToApiVersion("1.1")]
[HttpGet]
public IEnumerable<string> Get()
```

#### 2.4.4 设置不受版本控制
```csharp
[ApiVersionNeutral]//退出版本控制
[ApiController]
[Route("api/[controller]/[action]")]
public class WeatherForecastController : ControllerBase
```

#### 2.4.5 访问地址
```csharp
http://localhost:5000/api/Test  //需要在headers里面增加 version: 1.1
http://localhost:5000/api/WeatherForecast/Get 不受版本控制
```

### 2.5 同时支持多种模式
```csharp
services.AddApiVersioning(o =>
{
    o.ReportApiVersions = true;
    o.AssumeDefaultVersionWhenUnspecified = true;
    o.DefaultApiVersion = new ApiVersion(1, 0);
    o.ApiVersionReader = ApiVersionReader.Combine(new HeaderApiVersionReader("api-version"), new QueryStringApiVersionReader("api-version"));
    //或者
    //同时支持查询字符串和标头
    o.ApiVersionReader = new QueryStringOrHeaderApiVersionReader(parameterName: "version"){HeaderNames = { "api-version", "x-ms-version" }}
});
```

### 2.6 不借助包，封装文件
```csharp
public class NameSpaceVersionRoutingConvention : IApplicationModelConvention
{
    private readonly string apiPrefix;
    private const string urlTemplate = "{0}/{1}/{2}";
    public NameSpaceVersionRoutingConvention(string apiPrefix = "api")
    {
        this.apiPrefix = apiPrefix;
    }

    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        {

            var hasRouteAttribute = controller.Selectors
            .Any(x => x.AttributeRouteModel != null);
            if (!hasRouteAttribute)
            {
                continue;
            }
            var nameSpaces = controller.ControllerType.Namespace.Split('.');
            //获取namespace中版本号部分
            var version = nameSpaces.FirstOrDefault(x => Regex.IsMatch(x, @"^v(\d+)$"));
            if (string.IsNullOrEmpty(version))
            {
                continue;
            }
            string template = string.Format(urlTemplate, apiPrefix, version,
            controller.ControllerName);
            controller.Selectors[0].AttributeRouteModel = new AttributeRouteModel()
            {
                Template = template
            };
        }
    }
}
```
调试代码发现这种方式只在程序第一次运行的时候会执行，之后不会再执行多次，因此效率很高。
> 借鉴于：[https://www.cnblogs.com/runningsmallguo/p/7484954.html](https://www.cnblogs.com/runningsmallguo/p/7484954.html)


## 参考文档
> [https://github.com/microsoft/aspnet-api-versioning](https://github.com/microsoft/aspnet-api-versioning)

