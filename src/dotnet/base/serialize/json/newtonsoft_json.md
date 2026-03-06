---
title: Newtonsoft.Json
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: newtonsoft_json
slug: svin0m
docsId: '46045728'
---

## 概述
Json.NET是目前最流行的.Net中的Json支持包。
官网文档：

### 优点

- 灵活的 JSON 序列化器，用于在 .NET 对象和 JSON 之间进行转换
- LINQ to JSON 用于手动读写 JSON
- 高性能：比 .NET 的内置 JSON 序列化器更快(.NetF)
- 编写缩进的、易于阅读的 JSON
- 将 JSON 与 XML 相互转换
- 支持.NET Standard 2.0、.NET 2、.NET 3.5、.NET 4、.NET 4.5、Silverlight、Windows Phone 和 Windows 8 Store

## 操作
> 本文示例环境：vs2022、.Net6

需要用到的配置
```csharp
public class Product
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string[] Sizes { get; set; }
}

var product = new Product
{
    Name = "华为",
    ExpiryDate = new DateTime(1987, 10, 01),
    Price = 3.99M,
    Sizes = new string[] { "Small", "Medium", "Large" }
};
```

### 初始化Json对象
```csharp
JToken root = new JObject();
root["Name"] = "Ron";
root["ExpiryDate"] = DateTime.Now;
root["Price"] = 3.99M;
string jsonText = root.ToString();
```

### 接收动态Json

```csharp
class Program
{
	static void Main(string[] args)
	{
		var json = "{\"Code\":101,\"Items\":[{\"OrderTitle\":\"订单1\"},{\"OrderTitle\":\"订单2\"}]}";
		var rsp = JsonConvert.DeserializeObject<Result>(json);
		if (rsp.Code == 101)
		{
			var items = (rsp.Items as JArray).Select(m => m["OrderTitle"].Value<string>()).ToList();
			Console.WriteLine(string.Join(",", items));//订单1,订单2
		}
	}

}
public class Result
{
	public int Code { get; set; }
	public object Items { get; set; }
}
```
### 处理弱类型json

```csharp
var json = "{\"store\":{\"book\":[{\"category\":\"reference\",\"author\":\"Nigel Rees\",\"title\":\"Sayings of the Century\",\"price\":8.95}," +
	"{\"category\":\"fiction\",\"author\":\"Evelyn Waugh\",\"title\":\"Sword of Honour\",\"price\":12.99}," +
	"{\"category\":\"fiction\",\"author\":\"Herman Melville\",\"title\":\"Moby Dick\",\"isbn\":\"0-553-21311-3\",\"price\":8.99}," +
	"{\"category\":\"fiction\",\"author\":\"J. R. R. Tolkien\",\"title\":\"The Lord of the Rings\",\"isbn\":\"0-395-19395-8\",\"price\":22.99}]," +
	"\"bicycle\":{\"color\":\"red\",\"price\":19.95}}}";
JObject obj = JObject.Parse(json);
var dict = obj["store"]["book"].GroupBy(m => m["category"]).ToDictionary(k => k.Key, v => v.Select(n => n.Value<decimal>("price")).Sum());
foreach (var key in dict.Keys)
{
	Console.WriteLine($"key={key},value={dict[key]}");
}
```

### 序列化和反序列化

在json文本和.Net对象之间进行转换，JsonSerializer 将.Net中的.Net对象属性名称映射到JSON属性名称并且赋值返回JSON字符串，DeserializeObject将JSON字符串转换为.Net对象返回
```csharp
string output = JsonConvert.SerializeObject(product); // 序列化
//{
//  "Name": "华为",
//  "ExpiryDate": "1987-10-01T00:00:00",
//  "Price": 3.99,
//  "Sizes": [
//    "Small",
//    "Medium",
//    "Large"
//  ]
//}

var deserializedProduct = JsonConvert.DeserializeObject<Product>(output); //反序列化
```

#### 序列化设置

##### DateFormatHandling
获取或设置日期写入JSON文本的方式。  

###### IsoDateFormat
日期采用ISO 8601格式，如<c>"2012-03-21T05:40Z"</c>。  
```csharp
var jsonSetting = new JsonSerializerSettings
{
    DateFormatHandling = DateFormatHandling.IsoDateFormat,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
//{"Name":"华为","Price":3.99,"ExpiryDate":"1987-10-01T00:00:00","Sizes":["Small","Medium","Large"]}
```

###### MicrosoftDateFormat
日期以Microsoft JSON格式书写，例如:<c>"\/Date(1198908717056)\/"</c>。  
```csharp
var jsonSetting = new JsonSerializerSettings
{
    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
//{"Name":"华为","Price":3.99,"ExpiryDate":"\/Date(1230393600000+0800)\/","Sizes":["Small","Medium","Large"]}
```

##### DateFormatString
获取或者设置DateTime和DateTimeOffset的值在写入json文本时候的格式以及读取json文本时候想要得到的日期格式。
默认格式："yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK" 示例：2012-04-11T09:57:25Z
常用格式：yyyy-MM-dd HH:mm:ss   示例：2012-04-11 09:57:25
> 注意：该格式在safari使用到时候，前端不支持该格式进行日期转换，支持默认格式或者“yyyy/MM/dd HH:mm:ss”格式


##### DateTimeZoneHandling
获取或设置在序列化和反序列化期间DateTime时区的处理方式
默认值：Json.DateTimeZoneHandling.RoundtripKind
```csharp
public enum DateTimeZoneHandling
{
	/// <summary>
	/// 当作当地时间。 如果<see cref="DateTime"/>对象表示协调世界时(UTC)，则将其转换为本地时间。 
	/// </summary>
	Local = 0,

	/// <summary>
	/// 当做UTC时间。 如果<see cref="DateTime"/>对象表示本地时间，则将其转换为UTC时间。  
	/// </summary>
	Utc = 1,

	/// <summary>
	/// 如果DateTime被转换为字符串，则视为本地时间。如果一个字符串被转换为DateTime，如果指定了时区，则转换为本地时间。   
	/// </summary>
	Unspecified = 2,

	/// <summary>
	/// 转换时应保留时区信息
	/// </summary>
	RoundtripKind = 3
}
```
常见配置：SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;

##### MissingMemberHandling
控制在反序列化期间如何处理丢失的成员，在原来的product的序列化json文件基础上增加了一个性别属性进行反序列化
Ignore：忽略增加或者缺少的属性
```csharp
var jsonSetting = new JsonSerializerSettings
{
    MissingMemberHandling = MissingMemberHandling.Ignore,
};
//string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
string json = "{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"],\"Sex\":\"25\"}";
var netObject = JsonConvert.DeserializeObject<Product>(json,jsonSetting);
```
Error：如果增加有多余的属性会报错，而缺少属性会给默认值
```csharp
var jsonSetting = new JsonSerializerSettings
{
    MissingMemberHandling = MissingMemberHandling.Error,
};
//string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
string json = "{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"],\"Sex\":\"25\"}";
var netObject = JsonConvert.DeserializeObject<Product>(json,jsonSetting);
```

##### ReferenceLoopHandling
控制循环引用是如何序列化的
```csharp
public class Product
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string[] Sizes { get; set; }
    public Product Children { get; set; }
}


var product = new Product
{
    Name = "华为",
    ExpiryDate = new DateTime(1987, 10, 01),
    Price = 3.99M,
    Sizes = new string[] { "Small", "Medium", "Large" },
};
product.Children = product;
```
Error：如果遇到循环引用，序列化将报错
```csharp
var jsonSetting = new JsonSerializerSettings
{
    ReferenceLoopHandling = ReferenceLoopHandling.Error,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
```
Ignore：忽略循环引用并且不会序列化它们。在第一次遇到该对象时候，它会像往常一样被序列化，但是如果该对象作为其自身的子对象遇到了，那么序列化程序将跳过它进行序列化。
```csharp
var jsonSetting = new JsonSerializerSettings
{
    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化

//{"Name":"华为","Price":3.99,"ExpiryDate":"1987-10-01T00:00:00","Sizes":["Small","Medium","Large"]}
```
Serialize：强制序列化引用循环中的对象。如果对象是嵌套的但不是无限期的时候使用。
```csharp
var jsonSetting = new JsonSerializerSettings
{
    ReferenceLoopHandling = ReferenceLoopHandling.Serialize,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
```

##### NullValueHandling
设置在序列化和反序列化期间如何处理null值。
Include：默认属性，将null值正常进行序列化和反序列化
```csharp
var product = new Product
{
    Name = "华为",
    ExpiryDate = new DateTime(1987, 10, 01),
    Price = 3.99M,
    Sizes = null
};
var jsonSetting = new JsonSerializerSettings
{
    NullValueHandling= NullValueHandling.Include,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
//{"Name":"华为","Price":3.99,"ExpiryDate":"1987-10-01T00:00:00","Sizes":null}
```
Ignore：如果属性里面包含null值，那么就跳过该属性
```csharp
var product = new Product
{
    Name = "华为",
    ExpiryDate = new DateTime(1987, 10, 01),
    Price = 3.99M,
    Sizes = null
};
var jsonSetting = new JsonSerializerSettings
{
    NullValueHandling= NullValueHandling.Ignore,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
//{"Name":"华为","Price":3.99,"ExpiryDate":"1987-10-01T00:00:00"}
```

##### DefaultValueHandling
控制在序列化和反序列化如何设置默认值
Include：如果该值与字段/属性的默认值相同，则在序列化的时候将字段/属性写入json，反系列化的时候也设置字段/属性。
```csharp
var product = new Product
{
    Name = "华为",
    ExpiryDate = new DateTime(1987, 10, 01),
    Price = 3.99M,
    Sizes = null
};
var jsonSetting = new JsonSerializerSettings
{
    DefaultValueHandling = DefaultValueHandling.Include,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
//{"Name":"华为","Price":3.99,"ExpiryDate":"1987-10-01T00:00:00","Sizes":null}
```
Ignore：如何该值和字段/属性的默认值或者指定的默认值相同，则跳过该字段/属性写入json，反序列化的时候也会跳过。
```csharp
var product = new Product
{
    Name = "华为",
    ExpiryDate = new DateTime(1987, 10, 01),
    Price = 3.99M,
    Sizes = null
};
var jsonSetting = new JsonSerializerSettings
{
    DefaultValueHandling = DefaultValueHandling.Ignore,
};
string jsonOutput = JsonConvert.SerializeObject(product, jsonSetting); // 序列化
//{"Name":"华为","Price":3.99,"ExpiryDate":"1987-10-01T00:00:00"}
```

##### ObjectCreationHandling
在对象创建的时候决定是否替换。默认是Auto.
实体类
```json
public class Product
{
    public Product()
    {
        Sizes = new List<string> { "11", "22", "33" };
    }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public List<string> Sizes { get; set; }
}
```
Auto、Reuse：尝试将 JSON 值设置到现有对象上，并在反序列化期间将 JSON 值添加到现有集合。
```json
var jsonSetting = new JsonSerializerSettings
{
    ObjectCreationHandling = ObjectCreationHandling.Auto,
};
var json = "{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"]}";

var obj = JsonConvert.DeserializeObject<Product>(json,  jsonSetting);
var str = JsonConvert.SerializeObject(obj);
//"{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"11\",\"22\",\"33\",\"Small\",\"Medium\",\"Large\"]}"
```
Replace：将始终重新创建对象和集合，然后在反序列化期间为它们设置值。
```json
var jsonSetting = new JsonSerializerSettings
{
    ObjectCreationHandling = ObjectCreationHandling.Replace,
};
var json = "{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"]}";

var obj = JsonConvert.DeserializeObject<Product>(json, jsonSetting);
var str = JsonConvert.SerializeObject(obj);
//"{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"]}"
```

##### ContractResolver
设置序列化序列化属性格式
> 注意：如果对JToken或者JObject序列化，是达不到更新命名方式的效果。


###### CamelCasePropertyNamesContractResolver(驼峰命名)
```csharp
var json = JsonConvert.SerializeObject(product, new JsonSerializerSettings
{
    ContractResolver = new CamelCasePropertyNamesContractResolver()
});
//"{\"price\":3.99,\"expiryDate\":\"1987-10-01T00:00:00\",\"sizes\":[\"Small\",\"Medium\",\"Large\"]}"
```

###### SnakeCaseNamingStrategy(蛇形命名)
```csharp
var json = JsonConvert.SerializeObject(product, new JsonSerializerSettings
{
    ContractResolver = new DefaultContractResolver()
    {
        NamingStrategy = new SnakeCaseNamingStrategy()
    }
});
//"{\"price\":3.99,\"expiry_date\":\"1987-10-01T00:00:00\",\"sizes\":[\"Small\",\"Medium\",\"Large\"]}"
```

##### Formatting.Indented
默认情况下所有的json是挤压在一块的，特别不方便阅读，如图
```csharp
{"Price":3.99,"ExpiryDate":"1987-10-01T00:00:00","Sizes":["Small","Medium","Large"]}
```
通过配置代码序列化后格式化
```csharp
var json = JsonConvert.SerializeObject(product, Formatting.Indented);
```
当配置后结果
```csharp
{
  "Price": 3.99,
  "ExpiryDate": "1987-10-01T00:00:00",
  "Sizes": [
    "Small",
    "Medium",
    "Large"
  ]
}
```

#### 序列化特性

##### JsonProperty

###### 重命名
修改属性序列化后的名字。
```csharp
[JsonProperty("ProductName")]
public string Name { get; set; }
```
操作示例：
```csharp
var json = JsonConvert.SerializeObject(product);
//"{\"ProductName\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"]}"
```

###### 私有属性赋值
当一个属性被设置私有字段的时候，默认是无法赋值的，然后可以通过给私有属性上标注该特性达到可以反序列化赋值的效果
```csharp
void Main()
{
	var classInfo = new Class1("aa", "bb");
	var jsonText = JsonConvert.SerializeObject(classInfo);// {"Name":"aa","Description":"bb"}
	jsonText.Dump();

	var info = JsonConvert.DeserializeObject<Class1>(jsonText); // 这里Description已经被赋值
	info.Dump();
}

internal class Class1
{
	public Class1(string name, string descript)
	{
		Name = name;
		Description = descript;
	}
	public string Name { get; set; }

	[JsonProperty]
	public string Description { get; private set; }
}
```

##### JsonIgnore
可以在属性上标注JsonIgnore特性来实现序列化的时候忽略该属性。

也可以通过自定义序列化设置来动态配置是否显示该属性，现在有一个UserInfo类，我需要动态的设置Password序列化的时候是否显示
```csharp
public class UserInfo
{
    public string UserName { get; set; }

    public string Password { get; set; }
}
```
第一种方法是直接在上面的类中创建下面的方法
```csharp
public class UserInfo
{
	public string UserName { get; set; }

	public string Password { get; set; }

	// 返回true则序列化该属性，返回false则忽略该属性
	public bool ShouldSerializeUserName()
	{
		return false;
	}
}
```
这里需要注意的是该方法必须是ShouldSerialize+属性名，返回值等和上面保持一致，我们进行测试一下上面的方法是否起作用
```csharp
var user1 = new UserInfo
{
    UserName = "admin",
    Password = "123456"
};

// 进行序列化操作
string json = JsonConvert.SerializeObject(user1); // {"Password":"123456"}
```


另一种方法是在上面的类中创建下面的方法
```csharp
public bool ShouldSerializeSomeProperty()
{
    // 返回true则序列化该属性，返回false则忽略该属性
    return !string.IsNullOrWhiteSpace(Password);
}
```
然后创建CustomContractResolver，并调用ShouldSerializeSomeProperty方法
```csharp
/// <summary>
/// 实现IContractResolver接口：通过实现IContractResolver接口，可以自定义属性的序列化行为
/// </summary>
public class CustomContractResolver : DefaultContractResolver
{
    protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
    {
        JsonProperty property = base.CreateProperty(member, memberSerialization);

        // 自定义属性的序列化行为
        if (property.PropertyName == "Password")
        {
            // 忽略该属性
            property.ShouldSerialize = (obj) =>
            {
                // 根据方法判断是否忽略该属性
                if (obj is UserInfo u)
                {
                    return u.ShouldSerializeSomeProperty();
                }
                return false;
            };
        }

        return property;
    }
}
```
使用自定义序列化设置，并序列化
```csharp
var settings = new JsonSerializerSettings
{
    ContractResolver = new CustomContractResolver()
};

var user1 = new UserInfo
{
    UserName = "admin",
    Password = "123456"
};

// 进行序列化操作
string json = JsonConvert.SerializeObject(user1, settings);
Console.WriteLine(json);// {"UserName":"admin","Password":"123456"}

var user2 = new UserInfo
{
    UserName = "admin",
    Password = ""
};

// 进行序列化操作
json = JsonConvert.SerializeObject(user2, settings);
Console.WriteLine(json); // {"UserName":"admin"}
```

##### MemberSerialization
实体类上面使用[JsonObject(MemberSerialization.OptIn)]，所有的成员并不会被序列化，类中的成员只有使用标注特性JsonProperty的才会被实例化
```csharp
[JsonObject(MemberSerialization.OptIn)]
public class Product
{
   [JsonProperty]
    public string Name { get; set; }
    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string[] Sizes { get; set; }
}
```
示例：
```csharp
var json = JsonConvert.SerializeObject(product);
//"{\"Name\":\"华为\"}"
```
实体类上面使用[JsonObject(MemberSerialization.OptOut)]，默认情况下，所有的成员都会被实例化，只有标注JsonIgnore的不会被实例化
```csharp
[JsonObject(MemberSerialization.OptOut)]
public class Product
{
    [JsonIgnore]
    public string Name { get; set; }

    public decimal Price { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string[] Sizes { get; set; }
}
```
示例：
```csharp
var json = JsonConvert.SerializeObject(product);
//"{\"Price\":3.99,\"ExpiryDate\":\"1987-10-01T00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"]}"
```

##### ChinaDateTimeConverter
ChinaDateTimeConverter是自己定义的一个重写类。
时间转换格式的方法
因为默认格式化后格式是1987-10-01T00:00:00，不符合我们使用要求，这时候我们可以使用IsoDateTimeConverter或者在编写自定义的转换方法。
```json
public class ChinaDateTimeConverter : DateTimeConverterBase
{
    private static readonly IsoDateTimeConverter _dtConverter = new() { DateTimeFormat = "yyyy-MM-dd HH:mm:ss" };

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        return _dtConverter.ReadJson(reader, objectType, existingValue, serializer);
    }

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        _dtConverter.WriteJson(writer, value, serializer);
    }
}
```
标注特性
```csharp
public class Product
{
    public Product()
    {
        Sizes = new List<string> { "11", "22", "33" };
    }

    public string Name { get; set; }
    public decimal Price { get; set; }
    [JsonConverter(typeof(ChinaDateTimeConverter))]
    public DateTime ExpiryDate { get; set; }
    public List<string> Sizes { get; set; }
}
```
测试结果
```json
var json = JsonConvert.SerializeObject(product);
//"{\"Name\":\"华为\",\"Price\":3.99,\"ExpiryDate\":\"1987-10-01 00:00:00\",\"Sizes\":[\"Small\",\"Medium\",\"Large\"]}"
```



开始：[htthttps://www.newtonsoft.com/json/help/html/SerializationAttributes.htm](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm)

##### StringEnumConverter

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

### LINQ to JSON

#### 转JSON
将json字符串转json对象
```csharp
string json = @"{
  CPU: 'Intel',
  Drives: [
    'DVD read/writer',
    '500 gigabyte hard drive'
  ]
}";

JObject o = JObject.Parse(json);
```
官网：[https://www.newtonsoft.com/json/help/html/ParsingLINQtoJSON.htm](https://www.newtonsoft.com/json/help/html/ParsingLINQtoJSON.htm)

### 验证JSON Schema
xxx


### JsonPath
是xpath在json中的应用，是参照xpath表达式来解析xml文档的方式，用一个抽象的名字$来表示最外层的对象。常见的写法
```csharp
$.store.book[0].title
$['store']['book'][0]['title']
```
> **在线测试网站：**[**http://jsonpath.com/**](http://jsonpath.com/)

JSONPath 允许使用通配符 * 表示所以的子元素名和数组索引。还允许使用 '..' (从E4X参照过来的和数组切分语法)，示例
```csharp
$.store.book[(@.length-1)].title

-- 使用'@'符号表示当前的对象，?(<判断表达式>) 使用逻辑表达式来过滤。
$.store.book[?(@.price < 10)].title
```
JSONPath语法元素和对应XPath元素的对比。

| XPath | JSONPath | Description |
| --- | --- | --- |
| / | $ | 表示根元素 |
| . | @ |  当前元素 |
| / | . or [] | 子元素 |
| .. | n/a | 父元素 |
| // | .. | 递归下降，JSONPath是从E4X借鉴的。 |
| * | * | 通配符，表示所有的元素 |
| @ | n/a |  属性访问字符 |
| [] | [] | 子元素操作符 |
| &#124; | [,] | 连接操作符在XPath 结果合并其它结点集合。JSONP允许name或者数组索引。 |
| n/a | [start:end:step] | 数组分割操作从ES4借鉴。 |
| [] | ?() | 应用过滤表示式 |
| n/a | () | 脚本表达式，使用在脚本引擎下面。 |
| () | n/a | Xpath分组 |

示例
下面是一个简单的json数据结构代表一个书店
```csharp
{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}
```
操作示例
```csharp
var str = File.ReadAllText("aa.txt");
JObject jobj = JObject.Parse(str);

var bb = jobj.SelectToken("$.data.emrMenuDisplayModels[2]['identify']");

//书点所有书的作者
var autherList = jobj.SelectTokens("$.store.book[*].author");

// 查询书Moby Dick的价格
var autherList = jobj.SelectToken("$.store.book[?(@.title=='Moby Dick')].price");

//所有的作者
var autherList2 = jobj.SelectTokens("$...author");

//store的所有元素。所有的bookst和bicycle
var store1 = jobj.SelectTokens("$.store.*");

//store里面所有东西的price
var store2 = jobj.SelectTokens("$.store..['price']");
var store3 = jobj.SelectTokens("$.store..price");

//第三个书
var book1 = jobj.SelectTokens("$.store.book[2]");
var book2 = jobj.SelectTokens("$..book[2]");

// 最后一本书
var book3 = jobj.SelectTokens("$..book[-1:]");
//var book3 = jobj.SelectTokens("$..book[(@.len-1)]");//不支持@.length
//var book4 = jobj.SelectTokens("$.store.book[(@.length-1)]");

//前面的两本书
var laing = jobj.SelectTokens("$..book[0,1]");

//过滤出所有的包含isbn的书
var contain = jobj.SelectTokens("$..book[?(@.isbn)]");

//过滤出价格低于10的书。
var price = jobj.SelectTokens("$..book[?(@.price<10)]");

//所有元素
var all = jobj.SelectTokens("$..*");
```
参考资料：[https://blog.csdn.net/myself8202/article/details/80724968](https://blog.csdn.net/myself8202/article/details/80724968)

## 实践

### 入参时间时区处理

入参的时间为utc时间，我需要将其转为本地时间，编写LocalTimeConverter

```csharp
public class LocalTimeConverter : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return objectType == typeof(DateTime) || objectType == typeof(DateTime?);
    }

    public override object? ReadJson(JsonReader reader, Type objectType, object? existingValue,
        JsonSerializer serializer)
    {
        if (reader.TokenType == JsonToken.Null) return null;

        if (reader.Value is not DateTime dateTime)
        {
            return null;
        }

        if (dateTime.Kind == DateTimeKind.Utc)
        {
            dateTime = DateTime.SpecifyKind(dateTime.AddHours(8), DateTimeKind.Local);
        }

        return dateTime;
    }

    public override void WriteJson(JsonWriter writer, object? value, JsonSerializer serializer)
    {
        var dateTime = value is DateTime dt ? dt : ((DateTime?)value).Value;
        writer.WriteValue(dateTime);
    }
}
```

如果在Api中使用需要安装nuget包

```xml
<PackageReference Include="Microsoft.AspNetCore.Mvc.NewtonsoftJson" Version="8.0.8" />
```

然后可以全局注册配置

```csharp
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
	// 这里不写，只在对应入参模型上加，只在那个模型生效不是全局生效
    options.SerializerSettings.Converters.Add(new LocalTimeConverter());
});
```

也可以针对某一个类的入参设置

```csharp
public class UserInfo
{
    public string Name { get; set; }

    [JsonConverter(typeof(LocalTimeConverter))]
    public DateTime? DateTime { get; set; }
}
```

针对单个类设置也需要设置下面内容

```csharp
builder.Services.AddControllers().AddNewtonsoftJson();
```

## 公共类

```c#
public static class Json
{
    public static object ToJson(this string Json)
    {
        return Json == null ? null : JsonConvert.DeserializeObject(Json);
    }
    public static string ToJson(this object obj)
    {
        var timeConverter = new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd HH:mm:ss" };
        return JsonConvert.SerializeObject(obj, timeConverter);
    }
    public static string ToJson(this object obj, string datetimeformats)
    {
        var timeConverter = new IsoDateTimeConverter { DateTimeFormat = datetimeformats };
        return JsonConvert.SerializeObject(obj, timeConverter);
    }
    public static T ToObject<T>(this string Json)
    {
        return Json == null ? default(T) : JsonConvert.DeserializeObject<T>(Json);
    }
    public static List<T> ToList<T>(this string Json)
    {
        return Json == null ? null : JsonConvert.DeserializeObject<List<T>>(Json);
    }
    public static DataTable ToTable(this string Json)
    {
        return Json == null ? null : JsonConvert.DeserializeObject<DataTable>(Json);
    }
    public static JObject ToJObject(this string Json)
    {
        return Json == null ? JObject.Parse("{}") : JObject.Parse(Json.Replace("&nbsp;", ""));
    }
}

```

## 资料

官方文档：[https://www.newtonsoft.com/json/help/html/Introduction.htm](https://www.newtonsoft.com/json/help/html/Introduction.htm)
[https://www.cnblogs.com/foxhappy/p/14760775.html](https://www.cnblogs.com/foxhappy/p/14760775.html)
