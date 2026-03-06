---
title: 操作
lang: zh-CN
date: 2023-10-04
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - es
  - operator
---

## 准备
需要提前安装好es环境

## 组件
创建项目安装nuget包
```csharp
<PackageReference Include="NEST" Version="7.16.0"/>
```

## 初体验
注入服务
```csharp
services.AddScoped<IElasticClient>(sp =>
{
    var url = "http://用户名:密码@localhost:9200/"
    var settings = new ConnectionSettings(url);
    return new ElasticClient(settings);
});
```
然后就可以在注入服务IElasticClient进行操作，举例我们有一个订单的，然后我们即将搜索该信息，所以我们会将其存储es中，所以创建该类，并且通过特性的方式指定其属性对应es的类型
```csharp
public class OrderInfo
{
    [Keyword(Name = "Id")]
    public string Id { get; set; }

    [Date(Name = "CreateTime")]
    public DateTime CreateTime { get; set; }

    [Keyword]
    public string Name { get; set; }

    [Text]
    public string GoodsName { get; set; }

    public string Status { get; set; }
}
```

然后就可以通过调用IElasticClient的方法来插入数据
```csharp
var order = new OrderInfo
{
    Id = Guid.NewGuid().ToString(),
    CreateTime = DateTime.Now,
    Name = "张三",
    GoodsName = "手机P50",
    Status = "购物车"
    };
var indexResponse = _client.Index(order, i => i.Index("order"));
if (!indexResponse.IsValid)
{
    //插入失败处理
    throw new SystemException("插入失败");
}
```

简单的查询如下
```csharp
//查询name=张三
var searchResponse = _client.Search<OrderInfo>(s => s
    .Index("order")
    .Query(q => q.Term(o => o.Name, "张三"))
);
//获取查询数据
var datas = searchResponse.Documents.ToList();
```

## 查询方式

### Match查询
执行全文搜索

### Term查询
精确匹配字段中的值

### Terms查询
匹配字段中包含指定多个值的文档

### Range查询
检索字段值在指定范围内的文档

### Bool查询
组合多个查询条件，支持逻辑操作符

### Prefix查询
匹配以指定前缀开头的字段值

### Wildcard查询
支持通配符搜索

### Exists查询
检查文档中是否存在某个字段

### Fuzzy查询
执行模糊匹配

### Nested查询
在嵌套对象中进行查询

### QueryString查询
使用类似Lucene的查询语法进行搜索

### Regexp查询
使用正则表达式进行搜索

### FunctionScore查询
根据自定义评分函数对匹配度进行调整

## Http操作
| 请求方式 | url地址 | 描述 |
| --- | --- | --- |
| PUT | http://localhost:9200/索引名称 | 创建索引 |
| POST | 
 |   |


资料：[https://www.cnblogs.com/wei325/p/15828705.html](https://www.cnblogs.com/wei325/p/15828705.html)
