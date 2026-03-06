---
title: 健康检查
lang: zh-CN
date: 2023-05-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jiankangjiancha
slug: beckhl
docsId: '44014874'
---

## 1. 介绍
在开发AspNet Core应用的时候，我们经常会为该应用公布一个特殊的**检测接口**出来。该接口的目的很简单，告诉外界程序当前程序现在是可以访问或者不能访问的，便于外界做出相应的操作，比如监控报警，页面通知用户稍作等待等。

官网文档：[此处](https://learn.microsoft.com/zh-cn/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-8.0)

## 2. 官方包使用

### 2.1 基本使用
ConfigureServices中注入AddHealthChecks
```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers();

	services.AddHealthChecks();
    //或者通过安装其它nuget包实现下面方法
    services.AddHealthChecks().AddSqlServer("");
}
```
启用中间件MapHealthChecks
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
	if (env.IsDevelopment())
	{
		app.UseDeveloperExceptionPage();
	}

	app.UseRouting();

	app.UseAuthorization();

	app.UseEndpoints(endpoints =>
	{
		endpoints.MapControllers();
		## 通过访问地址加/health 进行访问
		endpoints.MapHealthChecks("/health");
	});
}
```
然后通过访问地址：localhost:5000/health 来检查此服务是否可以使用。

### 2.2 目的性检查(自定义)
```csharp
/// <summary>
/// mysql健康检查
/// </summary>
public class MySQLHealthCheck : IHealthCheck
{
	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		try
		{
			return await Task.FromResult(HealthCheckResult.Healthy()).ConfigureAwait(false);
		}
		catch
		{
			return await Task.FromResult(HealthCheckResult.Unhealthy("From Sql Serve")).ConfigureAwait(false);
		}
	}
}

/// <summary>
/// redis健康检查
/// </summary>
public class RedisHealthCheck : IHealthCheck
{
	public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		return Task.FromResult(HealthCheckResult.Healthy());
	}
}
```
注入
```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers();
	
	//只有当所有的检查器都返回为Healthy的时候，才会认为是健康。
	services.AddHealthChecks()
		.AddCheck<MySQLHealthCheck>("mysql_check")
		.AddCheck<RedisHealthCheck>("redis_check");
}
```
> Configure方法不需要操作，默认配置是当检查器都返回健康时候才认为是健康。

单个检查，有时候我们又想进行单个检查，那就需要在 `endpoints` 的配置中新增另外的路由映射规则:
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
	if (env.IsDevelopment())
	{
		app.UseDeveloperExceptionPage();
		app.UseSwagger();
		app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApplication7 v1"));
	}

	app.UseRouting();

	app.UseAuthorization();

	app.UseEndpoints(endpoints =>
	{
		endpoints.MapControllers();

		endpoints.MapHealthChecks("/mysqlhealth", new HealthCheckOptions() {//mysql
			Predicate = s => s.Name.Equals("mysql_check"),
			ResponseWriter = WriteResponse
		});

		endpoints.MapHealthChecks("/redishealth", new HealthCheckOptions() //redis
		{
			Predicate = s => s.Name.Equals("redis_check"),
			ResponseWriter = WriteResponse
		});
	});
}
/// <summary>
/// 返回指定格式
/// </summary>
/// <param name="context"></param>
/// <param name="result"></param>
/// <returns></returns>
private static Task WriteResponse(HttpContext context, HealthReport result)
{
	context.Response.ContentType = "application/json";

	var json = new JObject(
		new JProperty("status", result.Status.ToString()),
		new JProperty("results", new JObject(result.Entries.Select(pair => new JProperty(pair.Key,
			new JObject(new JProperty("status", pair.Value.Status.ToString()),
				new JProperty("description", pair.Value.Description),
				new JProperty("data", new JObject(pair.Value.Data.Select(
					p => new JProperty(p.Key, p.Value))))))))));

	return context.Response.WriteAsync(json.ToString());
}
```
> 通过访问地址：[http://localhost:5000/mysqlhealth](http://localhost:5000/redishealth) 查看mysql连接状态
> 通过访问地址：[http://localhost:5000/redishealth](http://localhost:5000/redishealth)  查看redis连接状态

![image.png](/common/1619445707290-24896cd8-84f8-4c04-b00d-7d9905838b1b.png)

### 2.3 常见的健康检查
MongoDB
```csharp
//包引用：Install-Package AspNetCore.HealthChecks.MongoDb -Version 6.0.2

public static IServiceCollection AddCustomHealthCheck(
  this IServiceCollection services,
  IConfiguration configuration)
{
    var hcBuilder = services.AddHealthChecks();
    hcBuilder.AddCheck("self", () => HealthCheckResult.Healthy())
        .AddMongoDb(
            configuration["ConnectionString"],
            name: "CouponCollection-check",
            tags: new string[] { "couponcollection" });
```

## AspNetCore.HealthChecks

### 3.1 介绍
是一个用于.NetCore健康检查的包，支持的版本有：5.0，3.1，3.0，2.2
> GitHub：[https://github.com/xabaril/AspNetCore.Diagnostics.HealthChecks](https://github.com/xabaril/AspNetCore.Diagnostics.HealthChecks)

支持一一些封装的检查

- Sql Server
- MySql
- Oracle
- Sqlite
- RavenDB
- Postgres
- EventStore
- RabbitMQ
- IbmMQ
- Elasticsearch
- CosmosDb
- Solr
- Redis
- SendGrid
- System: Disk Storage, Private Memory, Virtual Memory, Process, Windows Service
- Azure Service Bus: EventHub, Queue and Topics
- Azure Storage: Blob, Queue and Table
- Azure Key Vault
- Azure DocumentDb
- Azure IoT Hub
- Amazon DynamoDb
- Amazon S3
- Google Cloud Firestore
- Network: Ftp, SFtp, Dns, Tcp port, Smtp, Imap, Ssl
- MongoDB
- Kafka
- Identity Server
- Uri: single uri and uri groups
- Consul
- Hangfire
- SignalR
- Kubernetes
- ArangoDB
- Gremlin

对应的Nuget包为
```csharp
Install-Package AspNetCore.HealthChecks.System
Install-Package AspNetCore.HealthChecks.Network
Install-Package AspNetCore.HealthChecks.SqlServer
Install-Package AspNetCore.HealthChecks.MongoDb
Install-Package AspNetCore.HealthChecks.Npgsql
Install-Package AspNetCore.HealthChecks.Elasticsearch
Install-Package AspNetCore.HealthChecks.CosmosDb
Install-Package AspNetCore.HealthChecks.Solr
Install-Package AspNetCore.HealthChecks.Redis
Install-Package AspNetCore.HealthChecks.EventStore
Install-Package AspNetCore.HealthChecks.AzureStorage
Install-Package AspNetCore.HealthChecks.AzureServiceBus
Install-Package AspNetCore.HealthChecks.AzureKeyVault
Install-Package AspNetCore.HealthChecks.Azure.IoTHub
Install-Package AspNetCore.HealthChecks.MySql
Install-Package AspNetCore.HealthChecks.DocumentDb
Install-Package AspNetCore.HealthChecks.SqLite
Install-Package AspNetCore.HealthChecks.RavenDB
Install-Package AspNetCore.HealthChecks.Kafka
Install-Package AspNetCore.HealthChecks.RabbitMQ
Install-Package AspNetCore.HealthChecks.IbmMQ
Install-Package AspNetCore.HealthChecks.OpenIdConnectServer
Install-Package AspNetCore.HealthChecks.DynamoDB
Install-Package AspNetCore.HealthChecks.Oracle
Install-Package AspNetCore.HealthChecks.Uris
Install-Package AspNetCore.HealthChecks.Aws.S3
Install-Package AspNetCore.HealthChecks.Consul
Install-Package AspNetCore.HealthChecks.Hangfire
Install-Package AspNetCore.HealthChecks.SignalR
Install-Package AspNetCore.HealthChecks.Kubernetes
Install-Package AspNetCore.HealthChecks.Gcp.CloudFirestore
Install-Package AspNetCore.HealthChecks.SendGrid
Install-Package AspNetCore.HealthChecks.ArangoDb
Install-Package AspNetCore.HealthChecks.Gremlin
```

### 3.2 基本使用
本次事例来演示一个带UI界面的健康监控的基本使用，需要以下nuget包
```csharp
    <PackageReference Include="AspNetCore.HealthChecks.UI" Version="5.0.1" />
    <PackageReference Include="AspNetCore.HealthChecks.UI.Client" Version="5.0.1" />
    <PackageReference Include="AspNetCore.HealthChecks.UI.InMemory.Storage" Version="5.0.1" />
```
部分代码使用上述的例子
注入
```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers();

	services.AddHealthChecks()
		.AddCheck<MySQLHealthCheck>("mysql_check")
		.AddCheck<RedisHealthCheck>("redis_check");

	services.AddHealthChecksUI().AddInMemoryStorage();
}
```
使用
```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
	if (env.IsDevelopment())
	{
		app.UseDeveloperExceptionPage();
	}

	app.UseRouting();

	app.UseAuthorization();

	app.UseEndpoints(endpoints =>
	{
		endpoints.MapControllers();

		endpoints.MapHealthChecks("/mysqlhealth", new HealthCheckOptions()
		{
			Predicate = s => s.Name.Equals("mysql_check"),
			ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
		});

		endpoints.MapHealthChecks("/redishealth", new HealthCheckOptions()
		{
			Predicate = s => s.Name.Equals("redis_check"),
			ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
		});

		endpoints.MapHealthChecksUI();
	});
}
```
配置文件
```csharp
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "HealthChecksUI": {
    "HealthChecks": [
      {
        "Name": "HTTP-Api-mysqlhealth",
        "Uri": "/mysqlhealth"//新版本可以使用相对路径
      },
      {
        "Name": "HTTP-Api-redishealth",
        "Uri": "/redishealth"
      }
    ],
    "Webhooks": [
      {
        "Name": "",
        "Uri": "",
        "Payload": "",
        "RestoredPayload": ""
      }
    ],
    "EvaluationTimeInSeconds": 10,//轮询间隔
    "MinimumSecondsBetweenFailureNotifications": 60
  },
  "AllowedHosts": "*"
}
```
启动程序访问：/healthchecks-ui 地址
![image.png](/common/1619445176401-398ea423-08a6-4538-b4c9-7a588b8e03be.png)
通过该UI界面可以直观查看哪些监控服务出现问题

## 4. 参考文档
> AspNetCore的HealthCheck ：[https://blog.csdn.net/uoyo_blog/article/details/104811948/](https://blog.csdn.net/uoyo_blog/article/details/104811948/)

