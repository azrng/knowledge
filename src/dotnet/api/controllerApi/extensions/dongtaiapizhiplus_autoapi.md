---
title: 动态API之Plus.AutoApi
lang: zh-CN
date: 2023-08-24
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dongtaiapizhiplus_autoapi
slug: ffgo2d
docsId: '72277176'
---

## 概述
介绍一个组件 Plus.AutoApi 可以用它来动态生成 Restful 风格的 WebApi，不用写 Controller。
地址：[https://github.com/Meowv/Plus.AutoApi](https://github.com/Meowv/Plus.AutoApi)

## 操作
引用组件
```csharp
Install-Package Plus.AutoApi
```
在 Startup 中注册 AutoApi
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddAutoApi(x => { });
}
```
AddAutoApi 同时也支持各种 Options 参数，可以自行查看。
让你的服务直接或者间接实现IAutoApi，添加特性[AutoApi]即可，示例代码如下：
```csharp
[AutoApi]
public class WeatherService : IAutoApi
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    public IEnumerable<WeatherForecast> Get()
    {
        return WeatherForecast();
    }

    [HttpGet("{id}")]
    public IEnumerable<WeatherForecast> Get(int id)
    {
        return WeatherForecast();
    }

    public IEnumerable<WeatherForecast> Post()
    {
        return WeatherForecast();
    }

    [HttpPut("{id}")]
    public IEnumerable<WeatherForecast> Put(int id)
    {
        return WeatherForecast();
    }

    [HttpDelete("{id}")]
    public IEnumerable<WeatherForecast> Delete(int id)
    {
        return WeatherForecast();
    }

    private static IEnumerable<WeatherForecast> WeatherForecast()
    {
        var rng = new Random();
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = rng.Next(-20, 55),
            Summary = Summaries[rng.Next(Summaries.Length)]
        }).ToArray();
    }
}
```
需要注意的是你的服务层命名规范，默认要以Service或者ApplicationService结尾，也可以通过配置替换默认名称。
如果你想让某个服务不自动生成API，可以给特性传递参数：[AutoApi(Disabled = true)]
让生成的API兼容 Swagger，需要添加下面这句代码。
```csharp
services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Plus AutoApi Sample",
        Version = "v1.0.0"
    });
    options.DocInclusionPredicate((docName, description) => true);
});
```
同时自动生成API也可以和控制器共存，互不影响。你可以手动指定HTTP方法，也可以根据默认规则自动创建。
默认自动创建HTTP方法的规则如下：
```csharp
static PlusConsts()
{
    HttpVerbs = new Dictionary<string, string>()
    {
        ["add"] = "POST",
        ["create"] = "POST",
        ["post"] = "POST",
        ["insert"] = "POST",
        ["get"] = "GET",
        ["find"] = "GET",
        ["fetch"] = "GET",
        ["query"] = "GET",
        ["update"] = "PUT",
        ["put"] = "PUT",
        ["delete"] = "DELETE",
        ["remove"] = "DELETE"
    };
}
```
然后就可以正常在swagger展示了。

## 资料
[https://mp.weixin.qq.com/s/Xj-WFPdejWqBEGvQsiTAow](https://mp.weixin.qq.com/s/Xj-WFPdejWqBEGvQsiTAow) | 动态 Restful API 生成
