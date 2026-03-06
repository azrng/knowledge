---
title: 说明
lang: zh-CN
date: 2023-10-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: json
slug: pmpzbr
docsId: '30019719'
---

## 概述
一种数据格式

[将 Newtonsoft.Json 与 System.Text.Json 比较，并迁移到 System.Text.Json](https://learn.microsoft.com/zh-cn/dotnet/standard/serialization/system-text-json/migrate-from-newtonsoft?pivots=dotnet-7-0)

## 在线工具
jsonPath在线测试网站：[http://jsonpath.com/](http://jsonpath.com/)  
jsonSchema在线验证网站：[https://www.jsonschemavalidator.net/ ](https://www.jsonschemavalidator.net/)  
jsonSchema在线生成网站：[https://jsonformatter.org/json-to-jsonschema](https://jsonformatter.org/json-to-jsonschema)   
国内版本：[https://tooltt.com/json2schema/](https://tooltt.com/json2schema/)  
json在线编辑美化展示网站：[https://jsoncrack.com/editor ](https://jsoncrack.com/editor) 

## Linq to JSON
Linq to JSON是用来操作JSON对象的.可以用于快速查询,修改和创建JSON对象.当JSON对象内容比较复杂,而我们仅仅需要其中的一小部分数据时,可以考虑使用Linq to JSON来读取和修改部分的数据而非反序列化全部.

| 类名 | 说明 |
| --- | --- |
| JObject |  用于操作JSON对象 |
| JArray |  用语操作JSON数组 |
| JValue |  表示数组中的值 |
| JProperty |  表示对象中的属性,以"key/value"形式 |
| JToken |  用于存放Linq to JSON查询后的结果 |


## 1. JSON表现形式

### 1.1 对象
例子：
```json
var user = {"name":"Manas","gender":"Male","birthday":"1987-8-8"}
```

### 1.2 数组
例子：
```json
var userlist = [
       {"user":{"name":"Manas","gender":"Male","birthday":"1987-8-8"}},
       {"user":{"name":"Mohapatra","Male":"Female","birthday":"1987-7-7"}}
    ]
```

### 1.3 字符串
例子：
```json
var userlist = "{\"ID\":1,\"Name\":\"Manas\",\"Address\":\"India\"}"
            JObject jo = JObject.Parse(userlist);
var joHasValues = jo.HasValues;//true   当该下面存在子项，则为true  否则为false
```

## 2. 操作

### 2.1 序列化为json
```json
var userlist = "{\"ID\":1,\"Name\":\"Manas\",\"Address\":\"India\"}";
JObject jo= JObject.Parse(userlist);//转换成jobject格式
JObject jo = (JObject)JsonConvert.DeserializeObject(userlist);//转换成jobject格式

dynamic f = new { id =1, b = 2 };//{ id = 1, b = 2 }
string asa = JsonConvert.SerializeObject(f);//"{\"id\":1,\"b\":2}"
JObject v = JsonConvert.DeserializeObject(asa) as JObject;//{ "id": 1, "b": 2}

```

### 2.2 Json读取
```json
//简单读取
var userlist = "{\"ID\":1,\"Name\":\"Manas\",\"Address\":\"India\"}"
						//转json
            JObject jo = JObject.Parse(userlist);
var joHasValues = jo.HasValues;//true   当该下面存在子项，则为true  否则为false
var id = jo["ID"].ToString();
var idHasValues = jo["ID"].HasValues;//false

//SelectToken读取
var userlist = "{\"ID\":1,\"Name\":\"Manas\",\"Address\":\"India\"}";
JObject jObj = JObject.Parse(userlist);
JToken name = jObj.SelectToken("Name");
Console.WriteLine(name.ToString());//Manas


string strJson = "{\"code\":\"\",\"msg\":\"成功\",\"data\":[{\"houses\":[{\"bsm\":\"2\",\"ywh\":\"14\",\"slbsm\":\"11\"},{\"bsm\":\"2\",\"ywh\":\"14\",\"slbsm\":\"11\"}],\"housers\":{\"xmndzs\":\"权利表1房地产权_项目内多幢房屋信息\",\"dzs\":\"权利表3房地产权_独幢、层、套、间房屋信息\"},\"otheright\":{\"easements\":\"他项权表1地役权信息\",\"foreNotices\":\"他项权表2预告基信息\",\"objections\":\"他项权表3异议基本信息\",\"pledges\":\"他项权表4抵押信息\",\"sealups\":\"他项权表5查封信息\"},\"buscom\":{\"acceptances\":\"公共表1受理申请信息\",\"archives\":\"公共表2归档信息\",\"certiFicates\":\"公共表3发证信息\",\"charges\":\"公共表4收费信息\",\"obligees\":\"公共表5权利人信息\"}}]}";
JObject result = (JObject)JsonConvert.DeserializeObject(strJson);
object houses1 = result["data"][0]["houses"][0].ToString();
```

### 2.3 Json删除
```json
var userlist = "{\"ID\":1,\"Name\":\"Manas\",\"Address\":\"India\"}";
JObject jo= JObject.Parse(userlist);先转换成jobject格式
jo.Remove("Name");移除指定的内容
string json1 = JsonConvert.SerializeObject(jo);
```

### 2.4 创建Json
```json
JArray array = new JArray();
array.Add("北京");
array.Add("河南");
//创建json对象
JObject o = new JObject();
o["ID"] = "111";
o["数组"] = array;
o.Add(new JProperty("sex", "男"));
o.Add(new JProperty("Leader", new JObject(new JProperty("Name", "Tom"), new JProperty("Age", 44))));
string json = o.ToString();//{\r\n  \"ID\": \"111\",\r\n  \"数组\": [\r\n    \"北京\",\r\n    \"河南\"\r\n  ],\r\n  \"sex\": \"男\",\r\n  \"Leader\": {\r\n    \"Name\": \"Tom\",\r\n    \"Age\": 44\r\n  }\r\n}


//创建json数组
JArray arr = new JArray();
arr.Add(new JValue(1));
arr.Add(new JValue(2));
arr.Add(new JValue(3));
var arrJson = arr;//[1,2,3]
```

## JsonSchema
想学习 JSON Schema 编写可以查看以下文档：

- [https://json-schema.apifox.cn/](https://json-schema.apifox.cn/)
- [https://zhuanlan.zhihu.com/p/355175938](https://zhuanlan.zhihu.com/p/355175938)



用.NET代码生成JSON Schema 验证器[https://www.cnblogs.com/dotnet-diagnostic/p/18224293](https://www.cnblogs.com/dotnet-diagnostic/p/18224293)

### NJsonSchema

在.Net中可以使用NJsonSchema去操作JsonSchema，详情查阅[文档](https://github.com/RicoSuter/NJsonSchema/wiki/JsonSchemaGeneratorSettings)

```csharp
var json =
    "{\"IsCacheNotRecordMenu\":true,\"NotAllowSpecialChar\":[\"*\"],\"IsEnableStandardMedicalMenu\":true,\"IsEnableOrderEvent\":false,\"IsEnabledMultiHospital\":false,\"DefaultOrgCode\":\"42507230900\"}";

var schema = JsonSchema.FromSampleJson(json);
// 输出schema
var schemaStr = schema.ToJson();
Console.WriteLine(schema.ToJson());

var schema2 = await JsonSchema.FromJsonAsync(json);
var result = schema2.Validate(schemaStr);
// 验证schema
Console.WriteLine(result.Count == 0);
```

### Corvus.JsonSchema

一个使用Json Schema对Json进行序列化和验证

仓库地址：[https://github.com/corvus-dotnet/Corvus.JsonSchema/](https://github.com/corvus-dotnet/Corvus.JsonSchema/)



.NET 9.0 如何将 JSON 架构性能提高 32%：[此处](https://endjin.com/blog/2024/11/how-dotnet-9-boosted-json-schema-performance-by-32-percent)

### JsonSchemaExporter

.NET 9 Preview 6 中引入了一个 `JsonSchemaExporter`，我们可以借助它根据类型来生成 json schema。

```csharp
var type = typeof(Job);
var defaultSchemaNode = JsonSchemaExporter.GetJsonSchemaAsNode(
    JsonSerializerOptions.Default, type
    );
Console.WriteLine(JsonSerializer.Serialize(defaultSchemaNode, JsonSerializerOptions.Web));
```

可以参考文档：[.NET 9 中的 JsonSchemaExporter](https://mp.weixin.qq.com/s/5aVQOk1DEzTCtdZM264ssA)

### 非必填

可以使用关键字 "type": "null" 来表示一个属性为非必填属性。这意味着该属性可以被省略或设为 null 值。例如如果我们要描述一个人的信息，其中 middleName 为非必填属性，可以像下面这样编写 JSON Schema：
```csharp
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "middleName": {
      "type": ["string", "null"]
    }
  },
  "required": ["firstName", "lastName"]
}
```
在上面的示例中，属性 middleName 定义了类型为字符串或 null 值。由于其类型不是必需的，因此它没有包含在 required 关键字数组中。这意味着，即使 middleName 属性被省略，JSON 数据也将符合上述 schema。

## Json转其他格式

### Json转xml
将json转xml和将xml转为json
```sql
string json = @"{
  '@Id': 1,
  'Email': 'james@example.com',
  'Active': true,
  'CreatedDate': '2013-01-20T00:00:00Z',
  'Roles': [
    'User',
    'Admin'
  ],
  'Team': {
    '@Id': 2,
    'Name': 'Software Developers',
    'Description': 'Creators of fine software products and services.'
  }
}";
XNode node = JsonConvert.DeserializeXNode(json, "Root");
Console.WriteLine(node.ToString());
// <Root Id="1">
//   <Email>james@example.com</Email>
//   <Active>true</Active>
//  <CreatedDate>2013-01-20T00:00:00Z</CreatedDate>
//   <Roles>User</Roles>
//   <Roles>Admin</Roles>
//   <Team Id="2">
//     <Name>Software Developers</Name>
//     <Description>Creators of fine software products and services.</Description>
//   </Team>
// </Root>
```

### BSON-序列化和反序列化BSON
```sql
public class Event
{
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
}
Event e = new Event
{
    Name = "Movie Premiere",
    StartDate = new DateTime(2013, 1, 22, 20, 30, 0, DateTimeKind.Utc)
};
MemoryStream ms = new MemoryStream();
using (BsonWriter writer = new BsonWriter(ms))
{
    JsonSerializer serializer = new JsonSerializer();
    serializer.Serialize(writer, e);
}
string data = Convert.ToBase64String(ms.ToArray());
Console.WriteLine(data);
// MQAAAAJOYW1lAA8AAABNb3ZpZSBQcmVtaWVyZQAJU3RhcnREYXRlAED982M8AQAAAA==
```

## 资料
[https://mp.weixin.qq.com/s/1QZnP_z3HI8EL_ENsM19Bw](https://mp.weixin.qq.com/s/1QZnP_z3HI8EL_ENsM19Bw) | 分享一些在 dotnet 中处理 JSON 的常规及非主流操作

C# 技巧 ：JSON处理:[https://mp.weixin.qq.com/s/AxF_KoeEHJiTXNE4OSRX-Q](https://mp.weixin.qq.com/s/AxF_KoeEHJiTXNE4OSRX-Q)

