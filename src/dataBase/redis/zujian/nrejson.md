---
title: NReJSON
lang: zh-CN
date: 2023-09-02
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: nrejson
slug: kzz94g
docsId: '68290081'
---

## 介绍
NReJSON 是StackExchange.Redis库的一系列扩展方法，可让您与[Redis](https://redis.io/)模块[RedisJSON](https://github.com/RedisJSON/RedisJSON)进行交互。这可以通过SE.Redis 库中已经存在的Execute和方法实现。

## 操作
> 本文示例环境：vs2022、.Net6

引用组件
```csharp
<PackageReference Include="NReJSON" Version="4.0.0" />
```
model类
```csharp
    public class UserInfo
    {
        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 年龄
        /// </summary>
        public int Age { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime Time { get; set; }
        /// <summary>
        /// 地址
        /// </summary>
        public Address Address { get; set; }
    }
    /// <summary>
    /// 地址
    /// </summary>
    public class Address
    {
        public string Name { get; set; }
    }
```
示例代码
```csharp
//创建redis对象
var db = ConnectionMultiplexer.Connect("127.0.0.1").GetDatabase();
var key = "test";
string json = JsonConvert.SerializeObject(new UserInfo() { Age = 19, Name = "张三", Time = DateTime.Now, Address = new Address() { Name = "北京" } }, new JsonSerializerSettings() { DateFormatString = "yyyy-MM-dd HH:mm:ss" });
OperationResult result = await db.JsonSetAsync(key, json);
if (result.IsSuccess)
{
	Console.WriteLine("json保存成功!");
}
RedisResult result2 = await db.JsonGetAsync(key, ".");
if (!result2.IsNull)
{
	Console.WriteLine($"获取成功：{result2}");
}
OperationResult result3 = await db.JsonSetAsync(key, JsonConvert.SerializeObject("成都"), ".Address.Name");
OperationResult result4 = await db.JsonSetAsync(key, JsonConvert.SerializeObject("王五"), ".Name");
if (result3.IsSuccess && result4.IsSuccess)
{
	Console.WriteLine("json修改成功!");
}
RedisResult result5 = await db.JsonGetAsync(key, ".Name", ".Age", ".Time", ".Address.Name");
if (!result5.IsNull)
{
	Console.WriteLine($"获取成功:{result5}");
}
Console.WriteLine("redis json 测试!");
Console.ReadLine();
```
将对象保存为json格式到数据库中。
