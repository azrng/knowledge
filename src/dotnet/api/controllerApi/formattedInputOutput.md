---
title: 格式化输入输出数据
lang: zh-CN
date: 2023-10-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - format
filename: geshihuaxiangyingshuju
slug: qvrc31
docsId: '30020427'
---
## 概述

- 以序列化发送到客户端的数据，请创建输出格式化程序类。
- 以反序列化从客户端收到的数据，请创建输入格式化程序类。

自定义格式化程序：[https://learn.microsoft.com/zh-cn/aspnet/core/web-api/advanced/custom-formatters](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/advanced/custom-formatters)

格式化响应数据：[https://learn.microsoft.com/zh-cn/aspnet/core/web-api/advanced/formatting](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/advanced/formatting)

> 本文示例环境：vs2022、.net5+


## 返回内容协商
WebApi提供了多种内容格式，那么可以通过accept header来选择最好的内容返回格式，比如application/json, application/xml等等，如果没有专门设置，那么webapi就会使用默认的格式。默认是json格式，也可以配置xml等格式。

## 配置格式化程序
要想支持额外的格式可以添加相应的nuget包并配置来支持。输入和输出的格式化程序不同。 模型绑定使用输入格式化程序。 格式响应使用输出格式化程序。

### 添加XML格式支持
若要配置使用 XmlSerializer 实现的 XML 格式化程序，请调用 AddXmlSerializerFormatters：
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddXmlSerializerFormatters();
```
然后再请求接口的时候，当你不传Accept的时候返回json格式，当你传递的值为application/xml，那么该接口就会返回xml格式


或者也可以直接清除其他输出类型，只保留xml格式输出
```csharp
builder.Services.AddControllers(options =>
{
    // 如果没有选择格式化程序会返回406
    options.ReturnHttpNotAcceptable = true;

    // 清除其他输出类型
    options.OutputFormatters.Clear();
    // 修改输出类型为xml
    options.OutputFormatters.Add(new XmlDataContractSerializerOutputFormatter());
}).AddXmlSerializerFormatters();
```

### 基于System.Text.Json的格式化程序
默认配置下

- 接口地址是原样输出，WeatherForecastController输出为WeatherForecast
- 路由地址是原样输出，GetUserName接口输出为GetUserName
- 属性名称是小驼峰输出，属性UsetName输出为usetName


以下突出显示的代码配置 PascalCase 格式，而不是默认的 camelCase 格式：
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
```


#### 属性驼峰设置
```csharp
services.AddControllers()
    .AddJsonOptions(options => {
        //options.JsonSerializerOptions.PropertyNamingPolicy = null;//大驼峰:UserName
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;//小驼峰:userName
    });
```

#### 解决中文编码
```csharp
services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);//解决后端返回数据中文被编码
            });
```


#### 修改返回类成员名称
```csharp
public class UserInfo
{
    public string aaaa { get; set; }

    [JsonPropertyName("name")]
    public string bbbb { get; set; }

    [JsonIgnore]
    public string ddd { get; set; }
}
```
输出结果
```csharp
{
  "aaaa": "1111",
  "name": "222"
}
```



### 基于Newtonsoft.Json 的 JSON 格式支持
默认的 JSON 格式化程序使用 System.Text.Json。 若要使用基于 Newtonsoft.Json 的格式化程序，请安装 `Microsoft.AspNetCore.Mvc.NewtonsoftJson NuGet` 包并在 Program.cs 中进行配置：
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddNewtonsoftJson();
```

#### 数据首字母大写，原样输出
```csharp
services.AddControllers().AddNewtonsoftJson(options => {
    //json字符串大小写原样输出  默认是小驼峰
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    //options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver(); //序列化时key为驼峰样式
});
//比如说Name字段，默认输出是name，加上就原样输出了
```

#### 设置字段的数据格式
```csharp
services.AddControllers().AddNewtonsoftJson(options => {
    // 设置返回的DataTime时间格式
    options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
});
```

#### 忽略返回值为null的字段
```csharp
services.AddControllers().AddNewtonsoftJson(options => {
    //忽略空值 序列化和反序列化时候需要忽略值为null的属性
    //options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
    //序列化和反序列化需要忽略默认值属性  
    options.SerializerSettings.DefaultValueHandling = DefaultValueHandling.Ignore;
});
```
如果对象某一个字段值为null，那么就直接忽略该字段。

#### 忽略循环引用
```csharp
services.AddControllers().AddNewtonsoftJson(options => {
    //忽略循环引用
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});
```

#### 首字母小写
```bash
services.AddControllers()
    .AddNewtonsoftJson(options => {
        //修改属性名称的序列化方式，首字母小写
        options.SerializerSettings.ContractResolver = new DefaultContractResolver {
            NamingStrategy = new CamelCaseNamingStrategy {
                OverrideSpecifiedNames = false
            }
        };
    });
```

#### 修改返回类成员名称
```csharp
public class UserInfo
{
    public string aaaa { get; set; }

    [JsonProperty("Name")] 
    public string bbbb { get; set; }

    [JsonIgnore]
    public string ddd { get; set; }
}
```
输出结果
```csharp
{
  "aaaa": "1111",
  "bbbb": "222",
  "ddd": "333"
}
```
原因是因为在3.0以后Newtonsoft.Json不再是默认的Json解析器，而是使用System.Text.Json，如果我们还想使用Newtonsoft.Json作为默认的json解析器，那么就需要修改
```csharp
services.AddControllers().AddNewtonsoftJson();
```
修改后重新运行
```csharp
{
  "aaaa": "1111",
  "Name": "222"
}
```

#### 枚举返回值处理

如果想让接口响应值中的枚举输出的时候转换为枚举字符串，那么就需要针对返回类的指定属性上面增加特性

```c#
[JsonConverter(typeof(StringEnumConverter))]
public SexInfo Sex { get; set; }
```

如果想让全局开启枚举响应转换，那么需要做下面处理

```c#
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.Converters.Add(new StringEnumConverter());
    });
```

## 指定格式

通过使用Produces筛选器，可以在Action、控制器上或者全局范围设置相应格式，比如在控制器上指定
```csharp
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TodoItemsController : ControllerBase
```

### 通过Url指定相应格式

可以在url中请求特定的格式，使用固定的文件扩展名来返回指定的格式，如果想返回xml格式需要添加该序列化程序
```csharp
builder.Services.AddControllers().AddXmlSerializerFormatters();
```
然后操作如下
```csharp
[ApiController]
[Route("[controller]")]
[FormatFilter] // 配置过滤器
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet("content/{format?}")] // 配置路由
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}

```

### 自定义返回格式
比如一个系统中返回类的格式大多数都是小驼峰，但是我们其中一些接口想给第三方暴露，并且对方要求大驼峰等，我们就可以使用下面的方法实现自定义返回类型。

#### 动态操作返回格式(方案一)
通过动态去操作返回的SystemTextJsonOutputFormatter格式来实现，添加默认的自定义数据格式
```csharp
/// <summary>
/// 自定义返回类格式
/// </summary>
public class CustomJsonOutputFormatter : SystemTextJsonOutputFormatter
{
    private readonly SystemTextJsonOutputFormatter _pascalCaseFormatter;

    public CustomJsonOutputFormatter(JsonSerializerOptions jsonSerializerOptions) : base(jsonSerializerOptions)
    {
        var newOptions = new JsonSerializerOptions(jsonSerializerOptions)
        {
            //设置格式 大驼峰风格
            PropertyNamingPolicy = null
        };
        _pascalCaseFormatter = new SystemTextJsonOutputFormatter(newOptions);
    }

    public override Task WriteAsync(OutputFormatterWriteContext context)
    {
        if (GetFormat(context) == "json2")
        {
            return _pascalCaseFormatter.WriteAsync(context);
        }

        return base.WriteAsync(context);
    }

    private string GetFormat(OutputFormatterWriteContext context)
    {
        if (context.HttpContext.Request.RouteValues.TryGetValue("format", out var obj))
        {
            var routeValue = Convert.ToString(obj, CultureInfo.InvariantCulture);
            return string.IsNullOrEmpty(routeValue) ? null : routeValue;
        }

        var query = context.HttpContext.Request.Query["format"];
        return query.Count > 0 ? query.ToString() : "json";
    }
}
```
在startup中进行配置
```csharp
services.AddControllers(options =>
{
    options.FormatterMappings.SetMediaTypeMappingForFormat
        ("json2", MediaTypeHeaderValue.Parse("application/json"));

    for (var i = 0; i < options.OutputFormatters.Count; i++)
    {
        if (options.OutputFormatters[i] is Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonOutputFormatter jsonOutputFormatter)
        {
            options.OutputFormatters[i] = new CustomJsonOutputFormatter(jsonOutputFormatter.SerializerOptions);
            break;
        }
    }
});
```
就可以实现如果请求的参数中包含format并且值是json2，那么就使用大驼峰，否则使用小驼峰，示例请求
```csharp
http://localhost:5000/Home/Get?format=json2
```
上面的这种方法是通过url中传递参数的，我更喜欢过请求头中设置参数，下面我们将其修改
```csharp
/// <summary>
/// 自定义返回类格式
/// </summary>
public class CustomJsonOutputFormatter : SystemTextJsonOutputFormatter
{
    private readonly SystemTextJsonOutputFormatter _pascalCaseFormatter;

    public CustomJsonOutputFormatter(JsonSerializerOptions jsonSerializerOptions) : base(jsonSerializerOptions)
    {
        var newOptions = new JsonSerializerOptions(jsonSerializerOptions)
        {
            //还原默认格式 大驼峰风格
            PropertyNamingPolicy = null
        };
        _pascalCaseFormatter = new SystemTextJsonOutputFormatter(newOptions);
    }

    public override Task WriteAsync(OutputFormatterWriteContext context)
    {
        if (context.HttpContext.Request.Headers.TryGetValue("format", out StringValues format) && format.Equals("json2"))
        {
            return _pascalCaseFormatter.WriteAsync(context);
        }
        return base.WriteAsync(context);
    }
}
```
通过在header中传递{format:json2}来显示大驼峰规则

#### 修改格式化(方案二)
在ASP.NET Core 3.0或更高版本中，默认JSON格式化程序基于 System.Text.Json，可以配置Microsoft.AspNetCore.Mvc.JsonOptions.JsonSerializerOptions实现自定义功能。
比如，设置返回值属性名是PascalCase格式：
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers()
            .AddJsonOptions(options => 
               options.JsonSerializerOptions.PropertyNamingPolicy = null);
}
```
但是，这种只能实现固定设置，不能满足不同请求返回不同格式的需求。
这时，我们可以利用Newtonsoft.Json实现更灵活的配置。

#### Newtonsoft.Json支持
引用nuget包Microsoft.AspNetCore.Mvc.NewtonsoftJson，并修改Startup.cs，代码如下：
```csharp
public void ConfigureServices(IServiceCollection services)
{
    ...
        
    services.AddControllers().AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new MyCustomContractResolver();
    });
} 
```
使用自定义类MyCustomContractResolver格式化JSON。

MyCustomContractResolver实现代码如下：
```csharp
public class MyCustomContractResolver : DefaultContractResolver {
    private CamelCaseNamingStrategy _camelCase = new CamelCaseNamingStrategy();
    public override JsonContract ResolveContract(Type type)
    {
        return CreateContract(type);
    }
    protected override string ResolvePropertyName(string propertyName)
    {
        if (GetFormat() == "json2")
        {
            return propertyName;
        }

        return _camelCase.GetPropertyName(propertyName, false);
    }

    private string GetFormat()
    {
        Microsoft.Extensions.Primitives.StringValues headerValues;

        if (AppContext.Current.Request.Headers.TryGetValue("x-format", out headerValues))
        {
            return headerValues.FirstOrDefault();
        }
        return "json";
    }
}
```

- 默认的ResolveContract缓存了指定类型的格式化设置，以加快运行速度，不能满足不同请求对同一类型执行不同的格式化要求。因此，为演示方便，这里去掉了缓存，你也可以实现自定义缓存
- GetFormat是判断当前请求格式化方式的自定义方法。为演示方便，这里判断的是x-format Header，你也可以改成其他方式，比如根据当前用户凭证进行判断
- AppContext.Current是对当前请求的HttpContext的封装.

完全满足了要求，只需要客户在每个API请求加上x-format Header即可.

## 资料
[https://mp.weixin.qq.com/s/3QTR5qBVpHJcFhfv7McOnA](https://mp.weixin.qq.com/s/3QTR5qBVpHJcFhfv7McOnA) | 客户要求ASP.NET Core API返回特定格式，怎么办？(续)
[https://docs.microsoft.com/zh-cn/aspnet/core/web-api/advanced/custom-formatters?view=aspnetcore-6.0](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/advanced/custom-formatters?view=aspnetcore-6.0)：自定义格式序列化程序
json序列化：[http://furion.baiqian.ltd/docs/json-serialization](http://furion.baiqian.ltd/docs/json-serialization)



细聊ASP.NET Core WebAPI格式化程序：https://mp.weixin.qq.com/s/cxBm9ot3mbloWja-Ofqacw
