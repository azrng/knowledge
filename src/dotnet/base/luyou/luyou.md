---
title: 路由
lang: zh-CN
date: 2023-04-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: luyou
slug: sygtr9
docsId: '29808000'
---

## 路由注册方式
- 路由模板的方式
- RouteAttribute方式

## 路由约束
| 约束 | 示例 | 说明 |
| --- | --- | --- |
| `int` | `{id:int}` | 匹配任何整数 |
| `bool` | `{active:bool}` | 匹配 `true`
 或 `false`
。 不区分大小写 |
| `datetime` | `{dob:datetime}` | 在固定区域性中匹配有效的 `DateTime`
 值。  |
| `decimal` | `{price:decimal}` | 在固定区域性中匹配有效的 `decimal`
 值。 |
| `double` | `{weight:double}` | 在固定区域性中匹配有效的 `double`
 值。  |
| `float` | `{weight:float}` | 在固定区域性中匹配有效的 `float`
 值。  |
| `guid` | `{id:guid}` | 匹配有效的 `Guid`
 值 |
| `long` | `{ticks:long}` | 匹配有效的 `long`
 值 |
| `minlength(value)` | `{username:minlength(4)}` | 字符串必须至少为 4 个字符 |
| `maxlength(value)` | `{filename:maxlength(8)}` | 字符串不得超过 8 个字符 |
| `length(length)` | `{filename:length(12)}` | 字符串必须正好为 12 个字符 |
| `length(min,max)` | `{filename:length(8,16)}` | 字符串必须至少为 8 个字符，且不得超过 16 个字符 |
| `min(value)` | `{age:min(18)}` | 整数值必须至少为 18 |
| `max(value)` | `{age:max(120)}` | 整数值不得超过 120 |
| `range(min,max)` | `{age:range(18,120)}` | 整数值必须至少为 18，且不得超过 120 |
| `alpha` | `{name:alpha}` | 字符串必须由一个或多个字母字符组成，`a`
-`z`
，并区分大小写。 |
| `regex(expression)` | `{ssn:regex(^\\\\d{{3}}-\\\\d{{2}}-\\\\d{{4}}$)}` | 字符串必须与正则表达式匹配。 请参阅有关定义正则表达式的提示。 |
| `required` | `{name:required}` | 用于强制在 URL 生成过程中存在非参数值 |


### 类型约束
```csharp
[HttpGet("{id:int}")]
public int GetInfo(int id)
{
    return  id;
}
```

### 范围约束
```csharp
[HttpGet("{age:range(18,120)}")]
public int GetByAge(int age)
{
    return age;
}
```

### 正则约束
```csharp
[HttpGet("{phone:regex(^1[[3,5,7,8]]\\d{{9}}$)}")]
public string GetByPhone(string phone)
{
    return phone;
}
```

### 是否必选
```csharp
[HttpGet("{id:required}")]
public string GetUser(string id)
{
    return id;
}
```

### 自定义IRouteConstraint

#### 示例一
添加自定义路由约束，偶数约束
```csharp
public class CustomRouteConstraint : IRouteConstraint
{
    /// <summary>
    /// 自定义路由约束关键匹配方法  偶数约束
    /// </summary>
    /// <param name="httpContext">请求上下文</param>
    /// <param name="route">路由</param>
    /// <param name="routeKey">对应的key，即参数名</param>
    /// <param name="values">对应的参数和值的数据字典，count对应的值开从这里取出</param>
    /// <param name="routeDirection">路由方向</param>
    /// <returns></returns>
    public bool Match(HttpContext httpContext, IRouter route, string routeKey,
        RouteValueDictionary values, RouteDirection routeDirection)
    {
        if (string.IsNullOrWhiteSpace(routeKey))
        {
            return false;
        }

        //根据key获取value
        var v = values[routeKey];
        try
        {
            //判断是否是偶数，级是否能够被2整除
            if (v != null && (Convert.ToInt32(v) % 2 == 0))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (Exception)
        {
            return false;
        }
    }
}
```
> 满足约束时候，它返回true，否则返回false

注入
```csharp
//提前注入并且制定一个名称
services.AddRouting(option => option.ConstraintMap.Add("CustomerRoute", typeof(CustomRouteConstraint)));
```
使用
```csharp
[HttpGet("{id:CustomerRoute}")]
public string GetInfo(int id) 
{
    return id.ToString();
}
```

#### 示例二
添加long类型约束，必须大于0
```csharp
/// <summary>
/// 自定义路由限制（必须为Ulong）
/// </summary>
public static class MyRouteConstraint
{
    public class ULong : IRouteConstraint
    {
        public bool Match(HttpContext? httpContext, IRouter? route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {
            if (values == null || values.Count == 0 || string.IsNullOrWhiteSpace(routeKey))
                return false;
            return ulong.TryParse(values[routeKey]?.ToString(), out _);
        }
    }
}
```
注入该配置
```csharp
builder.Services.AddRouting(options =>
{
    options.ConstraintMap["ulong"] = typeof(MyRouteConstraint.ULong);
});
```
使用该自定义约束
```csharp
app.MapGet("/user/{userId:ulong}", (long userId) =>
{
    Console.WriteLine("用户信息" + userId);
    return userId;
}).WithTags("user");
```

## 控制器路由
动态控制器路由
```csharp
/// <summary>
/// 设置匹配路由配置
/// </summary>
public class SettingMatchRouteAttribute : Attribute, IRouteTemplateProvider
{
    public string Template => ServiceCollectionExtensions.injectUIOptions.ApiRoutePrefix + "/[controller]";

    public int? Order { get; set; }

    public string Name { get; set; }
}
```
使用方法
```csharp
[SettingMatchRoute]
public class ConfigSettingController : ControllerBase
```

## 基础使用
```csharp
[HttpGet("{id}", Name = "GetTodo")]
public IActionResult GetById(long id)
```
"{id}" 是 todo 项 的 ID 的占位符变量。 调用 GetById 时，它会将 URL 中“{id}”的值分配给方法的 id 参数。Name = "GetTodo" 创建一个命名的路由，使你能够 HTTP 响应中链接到此路由。

### Route约束
单个约束
示例：[HttpGet("TestRequiredConstraint/{name:required}")]
多个约束：限定id是整数并且最小值为1
示例：[HttpGet("TestMultiConstraint/{id:int:range(8,18)}")]

[Route("")]
[Route("Default")]
[Route("Default/Index")]
真实请求地址
```csharp
http://localhost:11277
http://localhost:11277/home
http://localhost:11277/home/index
```

### 路由的配置
路由的两个功能离不开一个基本的操作:路由的基本配置。在stratup中默认routes.MapRoute(name: "default",template: "{controller=Home}/{action=Index}/{id?}")定义，当然我们还可以继续routes.MapRoute(…);这样子就定义了一系列的路由匹配方式组成的一个路由表，例如这样子
```csharp
app.UseMvc(routes =>
{
    routes.MapRoute(name: "test", template: "Hello");
    routes.MapRoute("flylolo/{code}/{name}", MyRouteHandler.Handler);
    routes.MapRoute(name: "default", template: "{controller=Home}/{action=Index}/{id?}");
});
```
每个MapRoute会生成一个route，第二个看起来有点特殊，我们可以传入一个自定义的requestdelegate来处理flylolo/{code}/{name}”这样的请求，
```csharp
public static class MyRouteHandler
{
    public static async Task Handler(HttpContext context)
    {
        await context.Response.WriteAsync("MyRouteHandler");
    }
}
```

### Url全小写模式
默认接口风格是大驼峰，所以会存在大小写混在一起的情况，如果想让接口URL全部小写需要增加
```csharp
public void ConfigureServices(IServiceCollection services)
{
    // 采用小写的 URL 路由模式
    services.AddRouting(options =>
    {
        options.LowercaseUrls = true;
    });
}
```

## 参考资料
[ASP.NET Core 中的自定义模型绑定（IModelBinder）](https://docs.microsoft.com/zh-cn/aspnet/core/mvc/advanced/custom-model-binding?view=aspnetcore-3.0)
[ASP.NET Core 中的 URL 重写中间件](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/url-rewriting?view=aspnetcore-3.0)
.netcore路由最佳实现：[https://mp.weixin.qq.com/s/YMiYnhVYDD4x1UwQGWjKow](https://mp.weixin.qq.com/s/YMiYnhVYDD4x1UwQGWjKow)
