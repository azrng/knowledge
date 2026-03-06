---
title: Yarp
lang: zh-CN
date: 2023-09-08
publish: true
author: azrng
isOriginal: true
lastupdated: true
category:
  - dotNET
tag:
  - yarp
---

## 概述
YARP（Yet Another Reverse Proxy）是一个开源的、高性能的反向代理库，由Microsoft使用 `ASP.NET` 和 `.NET`（`.NET 6` 及更高版本）的基础结构在` .NET` 上构建的，通过 .NET 代码轻松自定义和调整，以满足每个部署方案的特定需求。

文档地址：[https://microsoft.github.io/reverse-proxy/articles/getting-started.html](https://microsoft.github.io/reverse-proxy/articles/getting-started.html)

## 功能和特点

1. **模块化和可扩展性：** YARP设计成高度模块化的，这意味着可以根据需要替换或扩展内部组件，如HTTP请求路由、负载均衡、健康检查等。
2. **性能：** YARP针对高性能进行了优化，利用了.NET的异步编程模型和高效的IO操作，以处理大量并发连接。
3. **配置驱动：** YARP的行为可以通过配置来控制，支持从文件、数据库或其他来源动态加载配置。
4. **路由：** 可以基于各种参数（如路径、头部、查询参数）配置请求路由规则。
5. **负载均衡：** 内置多种负载均衡策略，如轮询、最少连接、随机选择等，并且可以自定义负载均衡策略。
6. **健康检查：** 支持后端服务的健康检查，以确保请求只会被转发到健康的后端服务实例。
7. **转换器：** 允许对请求和响应进行转换，如修改头部、路径或查询参数。
8. **会话亲和性：** 支持会话亲和性（Session Affinity），确保来自同一客户端的请求被发送到相同的后端服务实例。
9. **身份验证、授权**

## 使用场景

- **反向代理：** 在客户端和后端服务之间提供一个中间层，用于请求转发和负载均衡。
- **API网关：** 作为微服务架构中的API网关，提供路由、鉴权、监控等功能。
- **边缘服务：** 在应用程序和外部世界之间提供安全层，处理SSL终止、请求限制等任务。

## 操作

### 开始

新建一个Api项目，引用nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Yarp.ReverseProxy" Version="2.2.0" />
</ItemGroup>
```
然后在Program中配置
```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddReverseProxy()
       .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) { }

app.MapReverseProxy();

var summaries = new[]
                {
                    "Freezing",
                    "Bracing",
                    "Chilly",
                    "Cool",
                    "Mild",
                    "Warm",
                    "Balmy",
                    "Hot",
                    "Sweltering",
                    "Scorching"
                };

app.MapGet("/weatherforecast", () =>
   {
       var forecast = Enumerable.Range(1, 5)
                                .Select(index =>
                                    new WeatherForecast(DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                                        Random.Shared.Next(-20, 55),
                                        summaries[Random.Shared.Next(summaries.Length)]))
                                .ToArray();
       return forecast;
   })
   .WithName("GetWeatherForecast")
   .WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
```
YARP 的配置在 appsettings.json 文件中定义，配置文件中这么配置
```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "ReverseProxy": {
        "Routes": {
            "route1": {
                "ClusterId": "cluster_product",
                "Match": {
                    "Path": "{**catch-all}"
                }
            }
        },
        "Clusters": {
            "cluster_product": {
                "Destinations": {
                    "destination1": {
                        "Address": "https://example.com/"
                    }
                }
            }
        }
    }
}
```
当访问项目启动地址： http://localhost:5147 的时候，会自动转向到 https://example.com/ 地址

### 网关添加swagger

将各个服务的swagger汇总到网关swagger界面，并且在网关swagger界面调用服务

```csharp
builder.Services.AddControllers(); //Web MVC
......
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Gateway", Version = "v1" 
    });
    options.DocInclusionPredicate((docName, description) => true);
    options.CustomSchemaIds(type => type.FullName);
});

......
// 添加内部服务的Swagger终点
app.UseSwaggerUIWithYarp();

app.UseRouting();
```

其中，调用方法 **app.UseSwaggerUIWithYarp();** 

```csharp
public static class YarpSwaggerUiBuilderExtensions
{
    public static IApplicationBuilder UseSwaggerUiWithYarp(this IApplicationBuilder app, bool enableSelfSwaggerUi = true)
    {
        var serviceProvider = app.ApplicationServices;

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
            var proxyConfigProvider = serviceProvider.GetRequiredService<IProxyConfigProvider>();
            if (proxyConfigProvider is DbConfigProvider dbConfigProvider)
            {
                dbConfigProvider.RefreshAsync().GetAwaiter().GetResult();
            }

            var yarpConfig = proxyConfigProvider.GetConfig();

            var groupedClusters = yarpConfig.Clusters
                                            .SelectMany(t => t.Destinations,
                                                (clusterId, destination) => new { clusterId.ClusterId, destination.Value })
                                            .GroupBy(q => q.Value.Address)
                                            .Select(t => t.First())
                                            .Distinct()
                                            .ToList();

            if (enableSelfSwaggerUi)
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Gateway v1");

            foreach (var clusterGroup in groupedClusters)
            {
                var routeConfig = yarpConfig.Routes.FirstOrDefault(q =>
                    q.ClusterId == clusterGroup.ClusterId);
                if (routeConfig == null)
                {
                    logger.LogWarning($"Swagger UI: Couldn't find route configuration for {clusterGroup.ClusterId}...");
                    continue;
                }

                options.SwaggerEndpoint($"{clusterGroup.Value.Address}/swagger/v1/swagger.json", $"{routeConfig.RouteId} API");

                // options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
                // options.OAuthClientSecret(configuration["AuthServer:SwaggerClientSecret"]);
            }
        });

        return app;
    }
}
```

## 配置文件

### 支持多个配置源

地址：https://microsoft.github.io/reverse-proxy/articles/config-files.html#multiple-configuration-sources

### 配置结构

ReverseProxys配置包含路由和集群两个子项，例如

```json
{
  "ReverseProxy": {
    "Routes": {
      "route1" : {
        "ClusterId": "cluster1",
        "Match": {
          "Path": "{**catch-all}",
          "Hosts" : [ "www.aaaaa.com", "www.bbbbb.com"]
        }
      }
    },
    "Clusters": {
      "cluster1": {
        "Destinations": {
          "cluster1/destination1": {
            "Address": "https://example.com/"
          }
        }
      }
    }
  }
}
```

### Routes

该项配置的是路由匹配项以及其关联配置的集合，路由至少需要以下字段

* RouteId：唯一名称
* ClusterId：指clusters部分中条目的名称
* Match：包含Hosts数组或者Path模式字符串
  * Path：一个 ASP.NET Core 路由模板，可以按照[此处的说明](https://docs.microsoft.com/aspnet/core/fundamentals/routing#route-templates)进行定义。路由匹配基于具有最高优先级的最具体路由，如此[处](https://docs.microsoft.com/aspnet/core/fundamentals/routing#url-matching)所述。可以使用 `order` 字段实现显式排序，值越低，优先级越高。
  * 星号或双星号可用作路由参数的前缀，来绑定到uri的其他部分，比如`blog/{**catch-all}`代表匹配以`blog/`开头的并在后面包含任何值的任何url，`blog/`后面的值分配给`blog/`路由值
* Transforms：请求和响应转换，参考[此处](https://microsoft.github.io/reverse-proxy/articles/transforms.html)

还有其他配置，比如Headers、Authorization、CORS，可以参考[RouteConfig](https://microsoft.github.io/reverse-proxy/api/Yarp.ReverseProxy.Configuration.RouteConfig.html)。

#### Transforms

##### RequestHeader

添加或替换请求标头

```csharp
new Dictionary<string, string> { { "RequestHeader", "header1" }, { "Append", "TestHeaderValue" } },
```

##### RequestHeaderRemove

删除请求标头

```csharp
new Dictionary<string, string> { { "RequestHeaderRemove", "Authorization" } }
```

##### 请求地址增加前缀

```csharp
new Dictionary<string, string>{   { "PathPrefix", "/api" },}
```

##### 请求地址移除前缀

```csharp
new Dictionary<string, string> { { "PathRemovePrefix", $"/{app.Code}" } }, // 修改请求路径，删除前缀值
```

##### 客户端证书提取转发

```csharp
new Dictionary<string, string> { { "ClientCert", "X-Client-Cert" }, }
```

##### 原始请求头复制

RequestHeadersCopy默认值为true

```
new Dictionary<string, string> {  { "RequestHeadersCopy", "true" }, }
```

##### PathPattern

使用模式模板替换请求路径

参考资料：[https://microsoft.github.io/reverse-proxy/articles/transforms.html#pathpattern](https://microsoft.github.io/reverse-proxy/articles/transforms.html#pathpattern)

##### QueryValueParameter

在请求查询字符串中添加或替换参数

```csharp
new Dictionary<string, string> { { "QueryValueParameter", "foo" } ,{ "Append", "bar" } },
```

##### QueryRemoveParameter

从请求查询字符串中删除指定的参数

```csharp
new Dictionary<string, string> { { "QueryRemoveParameter", "foo" } }
```

#####  X-Forwarded

添加包含有关原始客户端请求信息的标头

参考地址：[https://microsoft.github.io/reverse-proxy/articles/transforms.html#x-forwarded](https://microsoft.github.io/reverse-proxy/articles/transforms.html#x-forwarded)

##### ResponseHeader

添加或替换响应标头

```csharp
new Dictionary<string, string>
{
    { "ResponseHeader", "HeaderName" }, { "Append", "bar" }, { "When", "Success" }
},
```

* When：Success/Always/Failure 成功/始终/失败，默认成功

##### ResponseHeaderRemove

删除响应标头

```
new Dictionary<string, string>
{
    { "ResponseHeaderRemove", "HeaderName" }, { "When", "Success" }
},
```

* When：Success/Always/Failure 成功/始终/失败，默认成功

### Clusters

该部分是一个集合，主要包含一组命名目标和对应的地址，详细字段请参阅 [ClusterConfig](https://microsoft.github.io/reverse-proxy/api/Yarp.ReverseProxy.Configuration.ClusterConfig.html)。

### 所有配置示例

[https://microsoft.github.io/reverse-proxy/articles/config-files.html#all-config-properties](https://microsoft.github.io/reverse-proxy/articles/config-files.html#all-config-properties)

## 配置提供程序

支持通过从 appsettings.json 加载的代理配置或者通过编程的方式加载代理配置。

详情参考：[此处](https://microsoft.github.io/reverse-proxy/articles/config-providers.html)

## 服务配置

### 集群配置

```json
{
    "Logging": {
        "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
        }
    },
    "ReverseProxy": {
        "Routes": {
            "api-route": {
                "ClusterId": "api-cluster",
                "Match": {
                    "Path": "api/{**catch-all}"
                },
                "Transforms": [
                    {
                        "PathPattern": "{**catch-all}"
                    }
                ]
            }
        },
        "Clusters": {
            "api-cluster": {
                "LoadBalancingPolicy": "RoundRobin",
                "Destinations": {
                    "destination1": {
                        "Address": "http://192.168.0.114:8081"
                    },
                    "destination2": {
                        "Address": "http://192.168.0.114:8082"
                    }
                }
            }
        }
    },
    "AllowedHosts": "*"
}
```

该配置可以实现当访问该服务地址，比如http://localhost:8080/api/health的时候，会轮询的方式调用http://192.168.0.114:8081和http://192.168.0.114:8082

## 资料


[https://mp.weixin.qq.com/s/ng8JG7wmlllpjUrthXaovQ](https://mp.weixin.qq.com/s/ng8JG7wmlllpjUrthXaovQ) | 基于 YARP 实现一个 Github 的反向代理
[https://mp.weixin.qq.com/s/Eo7yesGDxFEBRMZheDEl4Q](https://mp.weixin.qq.com/s/Eo7yesGDxFEBRMZheDEl4Q) | 分享一个基于Abp 和Yarp 开发的API网关项目

微软用它取代了`Nginx`吞吐量提升了百分之八十：https://www.cnblogs.com/hejiale010426/p/17954360

使用YARP作为API网关和速率限制器：https://www.codecrash.net/2024/03/01/rate-limiting-in-yarp.html

FastGateway 一个可以用于代替Nginx的网关：https://mp.weixin.qq.com/s/0uTVdDdrFXJlBxS4CCN9rg
