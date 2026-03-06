---
title: 轮询API
lang: zh-CN
date: 2023-10-26
publish: true
author: azrng
isOriginal: false
category:
  - article
tag:
  - log
filename: poolAPI
---

## 使用场景

当你需要执行一个比较耗时的操作，然后这个时候我们一般需要编写好几个接口，比如一个提交操作的接口，一个定时获取状态的接口以及一个获取结果的接口，每次都需要写多麻烦，这个时候就用到本文介绍的组件了

## 效果图

当配置完成后，可以在swagger界面查看到多出来下面几个接口，然后分别是用来提交、获取状态、获取错误信息、获取结果、删除等操作

![image-20231026222547431](/common/image-20231026222547431.png)

## 操作

下面以.Net6的API项目为例，安装nuget包

```xml
<ItemGroup>
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  <PackageReference Include="AsyncFlow" Version="1.1.0" />
  <PackageReference Include="Hangfire.AspNetCore" Version="1.8.5" />
  <PackageReference Include="Hangfire.MemoryStorage" Version="1.8.0" />
</ItemGroup>
```

注入服务并使用

```c#
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 配置hangfire
builder.Services.AddHangfire(config => config.UseMemoryStorage());
builder.Services.AddHangfireServer();

// 配置AsyncFlow
builder.Services.AddAsyncFlow(options => options.UseMemoryCache());

builder.Services.AddScoped<AnalysisJob>();

var app = builder.Build();

// 配置flow
app.MapFlow<AnalysisJob, AnalysisRequest, AnalysisResult>("analysis");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
```

这里使用到的AnalysisJob为

```c#
/// <summary>
/// 解析的job
/// </summary>
public class AnalysisJob : IAsyncFlow<AnalysisRequest, AnalysisResult>
{
    public async Task<AnalysisResult> ProcessAsync(AnalysisRequest request, IProgress<ProgressData> progress,
        CancellationToken cancellationToken)
    {
        // 用于执行耗时的操作
        await Task.Delay(30, cancellationToken);
        return new AnalysisResult
        {
            Str = "123456"
        };
    }
}

public class AnalysisRequest
{
    /// <summary>
    /// 用户名
    /// </summary>
    public string Name { get; set; }
}

public class AnalysisResult
{
    public string Str { get; set; }
}
```

这样子启动后再打开swagger界面就可以看到上面效果图的示例了

## 资料

如何快速实现异步轮询API：https://mp.weixin.qq.com/s/RvYeDTkeUncOY6H07pHZwA
