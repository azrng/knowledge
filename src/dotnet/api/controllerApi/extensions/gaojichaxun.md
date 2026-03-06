---
title: 高级查询
lang: zh-CN
date: 2023-05-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaojichaxun
slug: qr1c31
docsId: '69572416'
---

## AutoFilterer
在业务开发中，一个常用的功能就是“高级查询”，就是客户可以根据自己的需要设置查询条件查找数据，类似下图： 
![image.png](/common/1647351202528-27db7cf5-7a43-4f9b-a919-1544347ebcf5.png)
通常，我们需要为每个“高级查询”定制Dto类，用于传输条件，并要根据条件组合成查询语句执行数据库查询操作，费时费力。
现在，使用AutoFilterer.Generators可以轻松实现上述功能。

### 示例
引用组件
```csharp
<PackageReference Include="AutoFilterer.Generators" Version="2.12.0" />
```
在WeatherForecast类上添加GenerateAutoFilterAttribute:
```csharp
[GenerateAutoFilter]
public class WeatherForecast
{
    public DateTime Date { get; set; }

    public int TemperatureC { get; set; }

    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

    public string Summary { get; set; }
}
```
然后，修改WeatherForecastController.cs的Get方法，增加WeatherForecastFilter参数：
```csharp
[HttpGet]
public IEnumerable<WeatherForecast> Get([FromQuery]WeatherForecastFilter filter)
{
    var rng = new Random();
    // Change range to 100 from 5 to get more reasonable results.
    return Enumerable.Range(1, 100).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
    })
    .AsQueryable().ApplyFilter(filter)//使用filter
    .ToArray();
}
```
AutoFilterer.Generators提供了IQueryable.ApplyFilter(filter)扩展方法，可以根据高级查询条件进行数据筛选。
运行程序，可以在Swagger UI看到多了许多参数，高级查询”服务已经完成了。你可以传入最小最大值范围，排序方式，分页方式。

### 缺点
只能提供简单的范围筛选。

## Dynamic.Core
使用Dynamic LINQ轻松实现更强大的高级查询服务。
官网：[https://dynamic-linq.net/](https://dynamic-linq.net/)

### 示例
引用组件
```csharp
<PackageReference Include="System.Linq.Dynamic.Core" Version="1.2.18" />
```
创建DynamicLinqDto，用于传递返回字段、查询条件、排序方式、分页方式等:
```csharp
public class DynamicLinqDto
{
    public string Fields { get; set; }

    public string Filter { get; set; }

    public string OrderBy { get; set; }
        
    public int? PageNo { get; set; }

    public int? PageSize { get; set; }
}
```
修改默认的Get方法如下：
```csharp

[HttpGet]
[ProducesDefaultResponseType(typeof(WeatherForecast))]
public IEnumerable<dynamic> Get([FromQuery] DynamicLinqDto dto)
{
    var rng = new Random();
    IQueryable query = Enumerable.Range(1, 5).Select(index => new WeatherForecast
    {
        Date = DateTime.Now.AddDays(index),
        TemperatureC = rng.Next(-20, 55),
        Summary = Summaries[rng.Next(Summaries.Length)]
    })
    .AsQueryable();

    return query.ToDynamicArray(dto);
}
```
由于Get方法的返回类型是IEnumerable，因此需要使用ProducesDefaultResponseTypeAttribute指定实际返回的类型，以便Swagger页面能显示正确。

上面最关键的代码是ToDynamicArray方法。实际上，这是我们封装的扩展方法，对于任意IQueryable对象，实现高级查询：
```csharp
public static class DynamicLinqExtentions
{
    public static dynamic[] ToDynamicArray(this IQueryable query, DynamicLinqDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Fields))
        {
            query = query.Select($@"new({dto.Fields})");
        }

        if (!string.IsNullOrWhiteSpace(dto.Filter))
        {
            query = query.Where(dto.Filter);
        }

        if (!string.IsNullOrWhiteSpace(dto.OrderBy))
        {
            query = query.OrderBy(dto.OrderBy);
        }

        var pageNo = dto.PageNo ?? 1;
        var pageSize = dto.PageSize ?? 10;
        query = query.Page(pageNo, pageSize);

        return query.ToDynamicArray();
    }
}
```
运行项目，传入指定的参数并执行
![image.png](/common/1647351477831-f9d384d4-39db-49f1-a43f-80b79d241577.png)
可以看到，现在，“高级查询”服务已经完成了。

## 资料
[https://mp.weixin.qq.com/s/rHhkbms8P2-ttEKh0c9DNQ](https://mp.weixin.qq.com/s/rHhkbms8P2-ttEKh0c9DNQ) | 使用Dynamic LINQ创建高级查询服务
[https://mp.weixin.qq.com/s/61BefU8xxXo79IU7kbjA3A](https://mp.weixin.qq.com/s/61BefU8xxXo79IU7kbjA3A) | 一秒创建高级查询服务
