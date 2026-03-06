---
title: System.Text.Json
lang: zh-CN
date: 2023-09-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: system_text_json
slug: btqeca
docsId: '29808563'
---

## 概述
一个默认的高性能、低内存的处理Json的工具。

- 将对象序列化为Json文本以及将Json文本反序列化为对象(支持UTF-8)
- 可以读取和写入编码为UTF-8的Json文本
- 创建内存中文档对象模型，以及访问元素的内容。

## 对象
在 System.Text.Json 中，有几个重量级的对象，所有的JSON互操作，都是围绕这几个对象进行，只要理解了他们各自的用途用法，就基本上掌握了JSON和实体对象的互操作。  

### **JsonDocument**

提供用于检查 JSON 值的结构内容，而不自动实例化数据值的机制。JsonDocument 有一个属性 RootElement，提供对JSON文档根元素的访问，RootElement是一个JsonElement对象。

### **JsonElement**

提供对JSON值的访问，在System.Text.Json 中，大到一个对象、数组，小到一个属性、值，都可以通过 JsonElement 进行互操作

### **JsonProperty**

JSON中最小的单元，提供对属性、值的访问

### **JsonSerializer**

提供JSON互操作的静态类，提供了一系列 Serializer/Deserialize 的互操作的方法，其中还有一些异步/流式操作方法。

### **JsonSerializerOptions**

与上面的 JsonSerializer 配合使用，提供自定义的个性化互操作选项，包括命名、枚举转换、字符转义、注释规则、自定义转换器等等操作选项。

其常用属性如下：

| 属性                        | 类型                   | 说明                                    |
| --------------------------- | ---------------------- | --------------------------------------- |
| AllowTrailingCommas         | `bool`                 | 忽略 JSON 中多余的逗号                  |
| Converters                  | `IList<JsonConverter>` | 转换器列表                              |
| DefaultBufferSize           | `int`                  | 默认缓冲区大小                          |
| DefaultIgnoreCondition      | `JsonIgnoreCondition`  | 当字段/属性的值为默认值时，是否忽略     |
| DictionaryKeyPolicy         | `JsonNamingPolicy`     | 字典 Key 重命名规则，如首字母生成小写   |
| IgnoreNullValues            | `bool`                 | 忽略 JSON 中值为 null 的字段/属性       |
| IgnoreReadOnlyFields        | `bool`                 | 忽略只读字段                            |
| IgnoreReadOnlyProperties    | `bool`                 | 忽略只读属性                            |
| IncludeFields               | `bool`                 | 是否处理字段，默认只处理属性            |
| MaxDepth                    | `int`                  | 最大嵌套深度，默认最大深度为 64         |
| NumberHandling              | `JsonNumberHandling`   | 如何处理数字类型                        |
| PropertyNameCaseInsensitive | `bool`                 | 忽略大小写                              |
| PropertyNamingPolicy        | `JsonNamingPolicy`     | 重命名规则，如首字母生成小写            |
| ReadCommentHandling         | `JsonCommentHandling`  | 处理注释                                |
| WriteIndented               | `bool`                 | 序列化时格式化 JSON，如换行、空格、缩进 |

### **Utf8JsonWriter/Utf8JsonReader**

这两个对象是整个 System.Text.Json 的核心对象，所有的JSON互操作几乎都是通过这两个对象进行，他们提供的高性能的底层读写操作。

## 操作

### 初始化Json对象
```csharp
using var ms = new MemoryStream();
using (var writer = new Utf8JsonWriter(ms))
{
    writer.WriteStartObject();
    writer.WriteString("Name", "Ron");
    writer.WriteNumber("No", 4);
    writer.WriteNumber("Price", 2.34m);
    writer.WriteEndObject();
    writer.Flush();
}
var json = Encoding.UTF8.GetString(ms.ToArray());
```

### 字符串转对象
```csharp
var json = "{\"name\":\"Ron\",\"money\":4.5}";
var jDoc = JsonDocument.Parse(json);
```

### 查找元素
```csharp
var user = new UserDto
{
	Id = 1,
	Name = "张三",
	CreateTime = DateTime.Now,
	Sizes = new List<string> { "111" },
	No = 10,
	Price = 2.34m,
	Email = "Test.@qq.com",
};

//查找元素
var json = "{\"name\":\"Ron\",\"money\":4.5,\"price\":null}";
var jDoc = JsonDocument.Parse(json);
// var obj = jDoc.RootElement[0];// 这里会报错，索引仅支持 Array 类型的JSON文档

//查找name的值
var nameValue = "";

//方案一，迭代获取
var enumerate = jDoc.RootElement.EnumerateObject();
while (enumerate.MoveNext())
{
	if (enumerate.Current.Name == "name")
	{
		nameValue = enumerate.Current.Value.ToString();
	}
}
//方案二
//var nameValue2 = jDoc.RootElement.GetProperty("name").ToString();//如果不存在会报错
//var nameValue2 = jDoc.RootElement.GetProperty("name").GetString();//如果获取的值是int类型，但是如果为null就会报错
//_ = jDoc.RootElement.TryGetProperty("name", out JsonElement nameJsonElement2);

//获取值类型值，可能获取到是null，如果GetProperty不存在的值，会报错，所以就需要TryGetProperty
var priceJsonElement2 = jDoc.RootElement.GetProperty("price");
var moneyValue = 0m;
if (priceJsonElement2.ValueKind != JsonValueKind.Null)
{
	moneyValue = priceJsonElement2.GetDecimal();
}
```

### 序列化和反序列化
实体类
```csharp
/// <summary>
/// 用户
/// </summary>
public class UserDto
{
    /// <summary>
    /// 标识ID
    /// </summary>
    public int Id { get; set; }

    [JsonPropertyName("TestName")]
    public string Name { get; set; }

    /// <summary>
    /// 邮箱
    /// </summary>
    public string Email { get; set; }

    public decimal Price { get; set; }

    public DateTime CreateTime { get; set; }

    public List<string> Sizes { get; set; }

    /// <summary>
    /// 编号
    /// </summary>
    public long No { get; set; }

    public SexEnum Sex { get; set; }

    [JsonIgnore]
    public string TestValue { get; set; }

    /// <summary>
    /// 用来存储多余溢出的值
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, object> ExtensionData { get; set; }
}

public enum SexEnum
{
    ///<summary>
    ///未知
    /// </summary>
    Unknown,

    ///<summary
    ///男
    ///</summary>
    Man,

    ///<summary>
    ///女
    /// </summary>
    Woman
}
```
具体操作代码
```csharp
//基本操作
var json = JsonSerializer.Serialize(user);
//result："{\"Id\":1,\"TestName\":\"\\u5F20\\u4E09\",\"Email\":\"Test.@qq.com\",\"Price\":2.34,\"CreateTime\":\"2022-05-08T17:01:17.6049701+08:00\",\"Sizes\":[\"111\"],\"No\":10}"
var user2 = JsonSerializer.Deserialize<UserDto>(json);

var json2 = JsonSerializer.Serialize(user, new JsonSerializerOptions
{
    //设置中文编码，默认会转义
    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(UnicodeRanges.All),
    //json美化
    WriteIndented = true,
    //属性名不区分大小写
    PropertyNameCaseInsensitive = true,
    //允许有逗号的json
    AllowTrailingCommas = true,
    //默认缓冲区大小
    DefaultBufferSize = 1024,
    //默认忽略条件
    DefaultIgnoreCondition = JsonIgnoreCondition.Never,
    //驼峰命名 默认null
    DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
    //忽略只读字段
    IgnoreReadOnlyFields = true,
    //忽略只读属性
    IgnoreReadOnlyProperties = true,
    //包含字段
    IncludeFields = true,
    //最大深度
    MaxDepth = 10,
    ////数字处理方式
    NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
    //属性命名
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    //是否读取注释
    ReadCommentHandling = JsonCommentHandling.Skip,
    //未知类型处理
    UnknownTypeHandling = JsonUnknownTypeHandling.JsonElement,
    //ReferenceHandler = new CustomReferenceHandler(),//引用处理
    //Converters = new JsonConverter[] { new CustomJsonConverter() },//自定义转换器
});
//result："{\r\n  \"id\": 1,\r\n  \"TestName\": \"张三\",\r\n  \"email\": \"Test.@qq.com\",\r\n  \"price\": 2.34,\r\n  \"createTime\": \"2022-05-08T17:01:17.6049701+08:00\",\r\n  \"sizes\": [\r\n    \"111\"\r\n  ],\r\n  \"no\": 10\r\n}"

//设置自定义属性名称命名策略
var json3 = JsonSerializer.Serialize(user, new JsonSerializerOptions
{
    PropertyNamingPolicy = new LowerCaseNamingPolicy()
});
//result:"{\"id\":1,\"TestName\":\"\\u5F20\\u4E09\",\"email\":\"Test.@qq.com\",\"price\":2.34,\"createtime\":\"2022-05-08T17:10:16.7422842+08:00\",\"sizes\":[\"111\"],\"no\":10,\"sex\":0}"

//设置枚举名称序列化
var user4 = new UserDto
{
    Id = 1,
    Name = "张三",
    CreateTime = DateTime.Now,
    Sizes = new List<string> { "111" },
    No = 10,

    Price = 2.34m,
    Email = "Test.@qq.com",
    Sex = SexEnum.Man
};
var options4 = new JsonSerializerOptions();
// 添加转换器
options4.Converters.Add(new JsonStringEnumConverter());

var json4 = JsonSerializer.Serialize(user4, options4);
//result:"{\"Id\":1,\"TestName\":\"\\u5F20\\u4E09\",\"Email\":\"Test.@qq.com\",\"Price\":2.34,\"CreateTime\":\"2022-05-08T17:12:08.7925047+08:00\",\"Sizes\":[\"111\"],\"No\":10,\"Sex\":\"Man\"}"

//排除值为null的属性
var user5 = new UserDto
{
    Id = 1,
    Name = null,
    CreateTime = DateTime.Now,
    Sizes = new List<string> { "111" },
    No = 10,

    Price = 2.34m,
    Email = "Test.@qq.com",
    Sex = SexEnum.Man
};
var json5 = JsonSerializer.Serialize(user5, new JsonSerializerOptions
{
    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
});
//result："{\"Id\":1,\"TestName\":\"张三\",\"Email\":\"Test.@qq.com\",\"Price\":2.34,\"CreateTime\":\"2022-05-08T17:15:36.3579325+08:00\",\"Sizes\":[\"111\"],\"No\":10,\"Sex\":1}"

//排除指定标记属性
//使用特性：[JsonIgnore]

//设置排除派生类的属性
var json6 = JsonSerializer.Serialize(user5, typeof(UserDto));

//设置包含注释序列化
//默认情况下你的json字符串不允许出现注释，除非你配置 JsonCommentHandling.Skip，但是我们可以配置让注释出现到反序列化里面
var json7 = "{\"Id\":1/* 标识 */,\"TestName\":\"张三\",\"Email\":\"Test.@qq.com\",\"Price\":2.34,\"CreateTime\":\"2022-05-08T17:15:36.3579325+08:00\",\"Sizes\":[\"111\"],\"No\":10,\"Sex\":1}";
var user7 = JsonSerializer.Deserialize<UserDto>(json7, new JsonSerializerOptions
{
    AllowTrailingCommas = true,
    ReadCommentHandling = JsonCommentHandling.Skip
});

//设置允许字段溢出   允许json里面包含多余的值  默认是忽略多余的值
//使用特性JsonExtensionData可以读取溢出的值

//使用自定义转换器
var options8 = new JsonSerializerOptions();
options8.Converters.Add(new JsonConverterUnixDateTime());
//然后再需要应用的属性上面标注特性：    [JsonConverter(typeof(JsonConverterUnixDateTime))]
```
自定义命名策略
```csharp
/// <summary>
/// 转小写命名策略
/// </summary>
public class LowerCaseNamingPolicy : JsonNamingPolicy
{
    public override string ConvertName(string name)
    {
        return name.ToLower();
    }
}
```
自定义转换器
```csharp
/// <summary>
/// 将日期类型输出为 Unix 时间戳而不是格式化的日期内容
/// </summary>
public class JsonConverterUnixDateTime : JsonConverter<DateTime>
{
    private static DateTime Greenwich_Mean_Time = TimeZoneInfo.ConvertTime(new DateTime(1970, 1, 1), TimeZoneInfo.Local);
    private const int Limit = 10000;

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var unixTime = reader.GetInt64();
            var dt = new DateTime(Greenwich_Mean_Time.Ticks + unixTime * Limit);
            return dt;
        }
        else
        {
            return reader.GetDateTime();
        }
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        var unixTime = (value - Greenwich_Mean_Time).Ticks / Limit;
        writer.WriteNumberValue(unixTime);
    }
}
```

### 序列化和反序列化通知
在 .NET 6 中，System.Text.Json 公开序列化和反序列化的通知。
有四个新接口可以根据您的需要进行实现：

- IJsonOnDeserialized
- IJsonOnDeserializing
- IJsonOnSerialized
- IJsonOnSerializing
```csharp
Product invalidProduct = new() { Name = "Name", Test = "Test" };
JsonSerializer.Serialize(invalidProduct);
// The InvalidOperationException is thrown

string invalidJson = "{}";
JsonSerializer.Deserialize<Product>(invalidJson);
// The InvalidOperationException is thrown

class Product : IJsonOnDeserialized, IJsonOnSerializing, IJsonOnSerialized
{
    public string Name { get; set; }

    public string Test { get; set; }

    public void OnSerialized()
    {
        throw new NotImplementedException();
    }

    void IJsonOnDeserialized.OnDeserialized() => Validate(); // Call after deserialization
    void IJsonOnSerializing.OnSerializing() => Validate();   // Call before serialization

    private void Validate()
    {
        if (Name is null)
        {
            throw new InvalidOperationException("The 'Name' property cannot be 'null'.");
        }
    }
}
```
> [https://mp.weixin.qq.com/s/y9fPateH8Mg6iS5PUgOvMQ](https://mp.weixin.qq.com/s/y9fPateH8Mg6iS5PUgOvMQ) | .NET 6 中的七个 System.Text.Json 特性


### 转义问题
默认情况下会将中文进行转义，你不确定是哪种字符集或者有全球化的需求，可以直接使用 UnicodeRanges.All 来支持所有的字符
```csharp
var option9 = new JsonSerializerOptions
{
    Encoder = JavaScriptEncoder.Create(UnicodeRanges.All),
};
```
对于一些包含 html 标签的文本即使指定了所有字符集也会被转义，这是出于安全考虑。如果觉得不需要转义也可以配置，配置使用 JavaScriptEncoder.UnsafeRelaxedJsonEscaping 即可，示例如下：
```csharp
var option9 = new JsonSerializerOptions
{
    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
};
var user9 = new UserDto
{
    Id = 1,
    Name= "<h1>这是标题</h1>"
};
var json8 = JsonSerializer.Serialize(user9, option9);
//result:"{\"Id\":1,\"TestName\":\"<h1>这是标题</h1>\",\"Email\":null,\"Price\":0,\"CreateTime\":\"0001-01-01T00:00:00\",\"Sizes\":null,\"No\":0,\"Sex\":0}"
```

### 反序列化读取溢出值
当你需要返回反序列化的json字符串中包含对象中没有的属性时候，默认会忽略，但是我们还可以使用其他方法来读取。首先需要修改对象增加下面的属性
```csharp
/// <summary>
/// 用来存储多余溢出的值
/// </summary>
[JsonExtensionData]
public Dictionary<string, object> ExtensionData { get; set; }

//or

[JsonExtensionData]
public Dictionary<string, JsonElement> ExtensionData { get; set; }
```
操作示例，UserDto对象中不包含age，但是会映射到上面的ExtensionData中
```csharp
var json8 = "{\"Id\":1,\"age\":10,\"TestName\":\"张三\",\"Email\":\"Test.@qq.com\",\"Price\":2.34,\"CreateTime\":\"2022-05-08T17:15:36.3579325+08:00\",\"Sizes\":[\"111\"],\"No\":10,\"Sex\":1}";
var user8 = JsonSerializer.Deserialize<UserDto>(json8);
```

### 序列化顺序
默认的顺序是按照属性的位置来进行排列的，现在可以通过标注特性来自定义顺序
```csharp
 [JsonPropertyOrder(1)]
 public decimal Price { get; set; }
```

### JSON 和 Stream 互转
资料：[https://mp.weixin.qq.com/s/t-TL0KXFxuDZwtDdtwc8_A](https://mp.weixin.qq.com/s/t-TL0KXFxuDZwtDdtwc8_A) | .NET 6 中 System.Text.Json 的新特性
```csharp
string json = "{\"Value\":\"Deserialized from stream\"}";
byte[] bytes = Encoding.UTF8.GetBytes(json);

// Deserialize from stream
using MemoryStream ms = new MemoryStream(bytes);
Example desializedExample = JsonSerializer.Deserialize<Example>(ms);
Console.WriteLine(desializedExample.Value);
// Output: Deserialized from stream

// ==================================================================

// Serialize to stream
JsonSerializerOptions options = new() { WriteIndented = true };
using Stream outputStream = Console.OpenStandardOutput();
Example exampleToSerialize = new() { Value = "Serialized from stream" };
JsonSerializer.Serialize<Example>(outputStream, exampleToSerialize, options);
// Output:
// {
//    "Value": "Serialized from stream"
// }

class Example
{
    public string Value { get; set; }
}
```

## AOT下序列化

新建一个控制台项目，然后修改项目文件，使其支持AOT发布

```xml
<PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <PublishAot>true</PublishAot>
    <InvariantGlobalization>true</InvariantGlobalization>
</PropertyGroup>
```

新建一个类用于测试

```c#
public class DocumentRetrieveResultBo
{
    /// <summary>
    /// 文档流水号
    /// </summary>
    public string DocumentSerialNumber { get; set; }

    /// <summary>
    /// 文档类型
    /// </summary>
    public string DocumentType { get; set; }

    /// <summary>
    /// 文档类型名称
    /// </summary>
    public string DocumentTypeName { get; set; }

    /// <summary>
    /// 注册时间
    /// </summary>
    public DateTime? EffectiveTime { get; set; }
}
```

然后进行下面的操作

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Unicode;

var list = new List<DocumentRetrieveResultBo>
{
    new DocumentRetrieveResultBo
    {
        DocumentSerialNumber = "22",
        DocumentType = "001",
        DocumentTypeName = "概况",
        EffectiveTime = DateTime.Now,
    }
};

var content = JsonSerializer.Serialize(list, new JsonSerializerOptions
{
    //设置中文编码，默认会转义
    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(UnicodeRanges.All),
    //json美化
    WriteIndented = true,
    //属性命名
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    //是否读取注释
    ReadCommentHandling = JsonCommentHandling.Skip,
});

Console.WriteLine(content);
```

直接运行是没有问题的，但是当你将其AOT发布后，运行就会报错，这个时候就需要修改上面的[JsonSerializerOptions配置](https://learn.microsoft.com/zh-cn/dotnet/standard/serialization/system-text-json/source-generation?pivots=dotnet-8-0)了，首先需要给类增加一个上下文，继承自JsonSerializerContext

```csharp
[JsonSourceGenerationOptions(WriteIndented = true)]
[JsonSerializable(typeof(List<DocumentRetrieveResultBo>))]
internal partial class DocumentRetrieveSourceGenerationContext : JsonSerializerContext
{
}
```

然后还需要修改序列化方法，序列化的方法设置TypeInfoResolver

```csharp
var list = new List<DocumentRetrieveResultBo>
{
    new DocumentRetrieveResultBo
    {
        DocumentSerialNumber = "22",
        DocumentType = "001",
        DocumentTypeName = "概况",
        EffectiveTime = DateTime.Now,
        UserInfos =new List<UserInfo>{ new UserInfo {  Id="aa"} }
    }
};

var content = JsonSerializer.Serialize(list, new JsonSerializerOptions
{
    //设置中文编码，默认会转义
    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.Create(UnicodeRanges.All),
    //json美化
    WriteIndented = true,
    //属性命名
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    //是否读取注释
    ReadCommentHandling = JsonCommentHandling.Skip,
    TypeInfoResolver = DocumentRetrieveSourceGenerationContext.Default  // 👈  增加该内容
});

Console.WriteLine(content);
```

然后就可以正常的进行序列化操作了

## 自定义转换器

### 使用类型转换器

#### 在枚举字段中使用自定义特性

```csharp
public class Model
{
    public string Name { get; set; }

    [EnumConverter]
    public NetworkType Netwotk1 { get; set; }

    [EnumConverter]
    public NetworkType? Netwotk2 { get; set; }
}
```

#### 使用 `JsonConverter` 特性

```csharp
public class Model
{
    public string Name { get; set; }

    [JsonConverter(typeof(EnumConverter))]   
    public NetworkType Netwotk1 { get; set; }

    [JsonConverter(typeof(EnumConverter))]
    public NetworkType? Netwotk2 { get; set; }
}
```

#### 在配置中添加转换器

```csharp
jsonSerializerOptions.Converters.Add(new EnumStringConverterFactory());
var obj = JsonSerializer.Deserialize<Model>(json, jsonSerializerOptions);
```

### Json时间转化器

将时间类型转换为我们常用的字符串格式

```
yyyy-MM-dd HH:mm:ss
YYYY-MM-DDTHH:mm:ss.sssZ
YYYY-MM-DDTHH:mm:ss.sss+HH:mm
YYYY-MM-DDTHH:mm:ss.sss-HH:mm
```

::: details 详情

```csharp
/// <summary>
/// 时间转换器
/// </summary>
public class DateTimeToStringConverter : JsonConverter<DateTime>
{
    private readonly string _formatString;

    public DateTimeToStringConverter()
    {
        _formatString = "yyyy-MM-dd HH:mm:ss";
    }

    public DateTimeToStringConverter(string inFormatString)
    {
        _formatString = inFormatString;
    }

    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var value = reader.GetString() ?? throw new FormatException("当前字段格式错误");
            return DateTime.ParseExact(value, _formatString, null);
        }

        return reader.GetDateTime();
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(_formatString));
    }
}
```

:::

### DateTimeOffset和时间戳

通过一个自定义转换器来将序列化内容里面的DateTimeOffset时间转为时间戳

::: details 详情

```csharp
using System;
using System.Text.Json;

namespace JsonSerialization
{
    class Program
    {
        static void Main(string[] args)
        {
            // 创建一个 DateTimeOffset 对象
            var dateTimeOffset = new DateTimeOffset(2020, 10, 25, 10, 15, 0, TimeSpan.FromHours(8));

            // 序列化 DateTimeOffset 对象为 JSON
            var json = JsonSerializer.Serialize(dateTimeOffset, new JsonSerializerOptions
            {
                // 设置时间戳格式
                Converters = { new DateTimeOffsetConverter() }
            });

            // 输出结果
            Console.WriteLine(json);

            // 等待用户输入
            Console.ReadKey();
        }
    }

    // 定义 DateTimeOffset 转换器
    public class DateTimeOffsetConverter : JsonConverter<DateTimeOffset>
    {
        public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTimeOffset.FromUnixTimeMilliseconds(reader.GetInt64());
        }

        public override void Write(Utf8JsonWriter writer, DateTimeOffset value, JsonSerializerOptions options)
        {
            writer.WriteNumberValue(value.ToUnixTimeMilliseconds());
        }
    }
}
```

:::

## 注意

### 无法序列化字段
.netcore3.1版本不支持序列化字段， .net5版本增加了IncludeFields属性
```csharp
internal class Program
{
    private static void Main(string[] args)
    {
        Customer car = new Customer()
        {
            Id = 2021,
            Name = "张三"
        };

        //netcore3.1版本不支持序列化字段， net5版本增加了IncludeFields属性
        var option = new JsonSerializerOptions { IncludeFields = true };
        string json = JsonSerializer.Serialize(car, option);  // "{\"Id\":2021}"  无法直接序列化字段
        var custoemr = JsonSerializer.Deserialize<Customer>(json,option);
        Console.WriteLine(custoemr.Name); // null
    }
}

public class Customer
{
    public int Id { get; set; } // 只能序列化属性
    public string Name; // 不能序列化字段
}
```

## 参考文档 
[https://mp.weixin.qq.com/s/ZLN4lldxPNgAXlINDMSAKw](https://mp.weixin.qq.com/s/ZLN4lldxPNgAXlINDMSAKw) | System.Text.Json 中的字符编码  
[https://mp.weixin.qq.com/s/jB_ZbNoVzm6_SlPh9RWxBw](https://mp.weixin.qq.com/s/jB_ZbNoVzm6_SlPh9RWxBw) | System.Text.Json 中的 JsonExtensionData  
[https://mp.weixin.qq.com/s/MJYx2-bvph_1RVBsoAkJdw](https://mp.weixin.qq.com/s/MJYx2-bvph_1RVBsoAkJdw) | System.Text.Json 自定义 Conveter  
[https://mp.weixin.qq.com/s/t-TL0KXFxuDZwtDdtwc8_A](https://mp.weixin.qq.com/s/t-TL0KXFxuDZwtDdtwc8_A) | .NET 6 中 System.Text.Json 的新特性  
[https://mp.weixin.qq.com/s/y9fPateH8Mg6iS5PUgOvMQ](https://mp.weixin.qq.com/s/y9fPateH8Mg6iS5PUgOvMQ) | .NET 6 中的七个 System.Text.Json 特性  

[https://devblogs.microsoft.com/dotnet/the-convenience-of-system-text-json](https://devblogs.microsoft.com/dotnet/the-convenience-of-system-text-json/System.Text.Json) System.Text.Json的便利性说明  

## 资料

自定义 Key 类型的字典无法序列化的 N 种解决方案：https://www.cnblogs.com/artech/p/18075402/dictionary_key_serialization
