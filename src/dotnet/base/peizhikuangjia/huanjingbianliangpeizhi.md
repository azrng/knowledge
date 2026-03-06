---
title: 环境变量配置
lang: zh-CN
date: 2023-03-23
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: huanjingbianliangpeizhi
slug: wg2x5t
docsId: '51605673'
---

## 概述
通过环境变量来配置应用程序，同一个程序不同环境使用不同的配置信息。
特点：

- 对于配置的分层键：使用双下划线：“__”代替“:”
- 支持根据前缀加载

## 操作

### 简单获取

#### 控制台获取
引用组件
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.Extensions.Configuration" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Configuration.Abstractions" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Configuration.EnvironmentVariables" Version="5.0.0" />
</ItemGroup>
```
通过控制台配置进行演示效果
```csharp
var builder = new ConfigurationBuilder();
builder.AddEnvironmentVariables();

var configurationRoot = builder.Build();
Console.WriteLine($"ceshi1:{configurationRoot["ceshi1"] }");
            
//分层键
var section = configurationRoot.GetSection("ceshi2");
Console.WriteLine($"ceshi2_2:{section["ceshi2_2"] }");
            
Console.WriteLine($"ceshi2_2:{configurationRoot["ceshi2:ceshi2_2"] }");
```
注入配置(选项项目右键属性=>调试配置、修改launchSettings.json文件)
```csharp
{
  "profiles": {
    "ConsoleApp3": {
      "commandName": "Project",
      //之前的命令行配置
      "commandLineArgs": "CommandLineKey1=value1",
      //环境配置
      "environmentVariables": {
        "ceshi1": "value1",
        "ceshi2__ceshi2_2": "value2.2"
      }
    }
  }
}
```
或者命令行启动配置环境变量
```csharp
$Env:ceshi1 = "value1"
$Env:ceshi2__ceshi2_2 = "value2.2"
dotnet run
```
启用程序查看效果
```csharp
ceshi1:value1
ceshi2_2:value2.2
ceshi2_2:value2.2
```

#### API获取
在api项目中在appsetting中我又一个配置如下
```csharp
"RabbitMQ": {
  "Hosts": "195.168.1.10",
  "Port": "10",
  "UserName": "admin",
  "Password": "123",
  "VirtualHost": "myQueue"
},
```
然后我在launchSettings.json中设置环境变量为
```csharp
"WebApplication4": {
  "commandName": "Project",
  "dotnetRunMessages": true,
  "launchBrowser": true,
  "launchUrl": "swagger",
  "applicationUrl": "http://localhost:5093",
  "environmentVariables": {
    "ASPNETCORE_ENVIRONMENT": "Development",
    "RabbitMQ__Password": "654"
  }
},
```
这个时候我去读取配置信息
```csharp
var password = builder.Configuration["RabbitMQ:Password"]; // 654
var password2 = Environment.GetEnvironmentVariable("RabbitMQ:Password"); // null
var password3 = Environment.GetEnvironmentVariable("RabbitMQ__Password"); // 654
```
所以我们如果使用Environment.GetEnvironmentVariable直接去获取环境变量这时候需要注意，这个时候层级的key之间是通过__来获取值的，当你使用IConfiguration获取值的时候才是通过 : 获取的。

### 前缀过滤
可以通过前缀过滤将我们需要将那些配置注入
```csharp
var builder = new ConfigurationBuilder();
//前缀加载
builder.AddEnvironmentVariables("ce");

var configurationRoot = builder.Build();
Console.WriteLine($"ceshi1:{configurationRoot["shi1"] }");

//分层键
var section = configurationRoot.GetSection("shi2");
Console.WriteLine($"ceshi2_2:{section["ceshi2_2"] }");

Console.WriteLine($"ceshi2_2:{configurationRoot["shi2:ceshi2_2"] }");
```
在这里我们设置只注册键以“ce”开头的值，那么还使用上面的配置启动查看效果
> 注意：如果我们的键是ceshi1，前缀是ce，那么获取的时候应该是configurationRoot["shi1"]

```csharp
ceshi1:value1
ceshi2_2:value2.2
ceshi2_2:value2.2
```

## 开源组件

### dotenv.net

可以用来读取.env文件的配置，需要安装nuget包

```
<PackageReference Include="dotenv.net" Version="3.1.3" />
```

然后我们在项目目录下创建一个.env的文件，内容如

```
ENV_VAR1=hello
```

然后在控制台我们就可以编写代码来操作了，比如下面我们读取后将其加入到配置系统中

```c#
DotEnv.Load(); // env文件加载

var configBuilder = new ConfigurationBuilder();

// 需要引用 Microsoft.Extensions.Configuration.EnvironmentVariables
configBuilder.AddEnvironmentVariables();
```

## 参考资料

极客时间教程
