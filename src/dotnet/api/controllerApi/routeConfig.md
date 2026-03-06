---
title: 路由配置
lang: zh-CN
date: 2024-06-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - api
---

## 特性

### [HttpPost]

表示请求的谓词是Post. 加上Controller的Route前缀, 那么访问这个Action的地址就应该是: 'api/product'
后边也可以跟着自定义的路由地址, 例如 [HttpPost("create")], 那么这个Action的路由地址就应该是: 'api/product/create'.

### [FromBody]

请求的body里面包含着方法需要的实体数据, 方法需要把这个数据Deserialize成ProductCreation, [FromBody]就是干这些活的.
客户端程序可能会发起一个Bad的Request, 导致数据不能被Deserialize, 这时候参数product就会变成null. 所以这是一个客户端发生的错误, 程序为让客户端知道是它引起了错误, 就应该返回一个**Bad Request** 400 (Bad Request表示客户端引起的错误)的 Status Code.

```csharp
 if (product == null)
 {
    return BadRequest();
 }
```

### 不显示接口

如果需要不显示某些接口，直接在controller上或者action上，增加特性

```csharp
[ApiExplorerSettings(IgnoreApi = true)]
```

## 路由

### 自定义动态路由

新建一个路由特性SettingMatchRouteAttribute

```
/// <summary>
/// 匹配路由设置
/// </summary>
public class SettingMatchRouteAttribute : Attribute, IRouteTemplateProvider
{
    public string Template => $"{ServiceCollectionExtensions.ApiRoutePrefix}/[controller]";

    public int? Order { get; set; }

    public string Name { get; set; }
}
```

Template格式动态生成，然后使用方法为

```csharp
[Authorize]
[ApiController]
[SettingMatchRoute]
```

## 路由约束

### 默认路由约束

```csharp
[HttpGet("{id:int}")]
[HttpGet("{id:}")]
```

### 自定义路由约束

举例一个限制路由参数值长度的例子

```csharp
public class FixedLengthParameter : IRouteConstraint
{
    public bool Match(HttpContext? httpContext, IRouter? route, string routeKey, RouteValueDictionary values,
        RouteDirection routeDirection)
    {
        ArgumentNullException.ThrowIfNull(routeKey, nameof(routeKey));
        ArgumentNullException.ThrowIfNull(values, nameof(values));
        if (!values.TryGetValue(routeKey, out var obj) || obj == null)
            return false;
        if (obj is int)
            return true;
        var valueString = Convert.ToString(obj, CultureInfo.InvariantCulture);
        return valueString != null && valueString.Length == 5;
    }
}
```

注入该配置

```csharp
builder.Services.Configure<RouteOptions>(opt => { opt.ConstraintMap.Add("fixedLength", typeof(FixedLengthParameter)); });
```

使用示例

```csharp
[HttpGet("{id:fixedLength}")]
public string GetInfo(string id)
{
    return id + DateTime.Now.ToString();
}
```

当传递不符合条件的id的时候，那么会返回400错误
