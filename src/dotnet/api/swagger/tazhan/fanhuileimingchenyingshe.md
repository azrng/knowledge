---
title: 返回类名称映射
lang: zh-CN
date: 2023-04-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fanhuileimingchenyingshe
slug: rdx8xv
docsId: '49574404'
---

## 开篇语
在给其他团队的同事提供接口的时候，因为接口返回参数是他们定义的，但是他们定义的成员名称我又不习惯，这个时候我只能去修改成员的名称。修改后发现swagger显示的信息和返回的不一致，这我都懵逼了。

## 操作
我的测试代码如下，使用的是Newtonsoft.Json的Json解析器
ConfigureServices代码
```csharp
services.AddControllers().AddNewtonsoftJson();
```
控制器
```csharp
public class UserInfo
{
    public string aaaa { get; set; }

    [JsonProperty("Name")] public string bbbb { get; set; }

    [JsonIgnore] public string ddd { get; set; }
}

[HttpGet]
public UserInfo Get()
{
    return new UserInfo {aaaa = "1111", bbbb = "222", ddd = "333"};
}
```
展示效果
![image.png](/common/1626948389388-b2de3df1-40c7-45f6-a6ed-5976825f714f.png)
这个时候肯定swagger哪里配置我没有设置(毕竟这么多人用，这种问题肯定早就发现了)，经过搜索后发现一个包
```csharp
Swashbuckle.AspNetCore.Newtonsoft
```
引用该包后需要增加一个配置在services.AddSwaggerGen()下面
```csharp
services.AddSwaggerGenNewtonsoftSupport();
```
重新运行项目，swagger显示的ui已经修改正确
![image.png](/common/1626952113091-4d9d236a-0d4a-4fdc-9ed4-6e44c6b5f6f9.png)
这次我也测试了使用默认的System.Text.Json组件，和Newtonsoft.Json不同的是想修改成员的名称是这样子的
```csharp
public class UserInfo
{
    public string aaaa { get; set; }

    [JsonPropertyName("name")] public string bbbb { get; set; }

    [JsonIgnore] public string ddd { get; set; }
}
```
 这样子也不用单独做配置，也不需要引用另外的组件就可以实现效果。

## 参考文档
> [https://github.com/domaindrivendev/Swashbuckle.AspNetCore](https://github.com/domaindrivendev/Swashbuckle.AspNetCore)

