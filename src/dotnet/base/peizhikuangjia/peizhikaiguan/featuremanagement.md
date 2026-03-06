---
title: FeatureManagement
lang: zh-CN
date: 2023-08-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: featuremanagement
slug: tdwga0
docsId: '26485839'
---

## 介绍
通过一些简单的配置文件配置来决定某一个功能是否开启，方便快捷。
> 示例环境：vs2019、net5


## 引用组件包
> Microsoft.FeatureManagement.AspNetCore


### 简单使用

#### 配置文件
```csharp
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "FeatureManagement": {
    "ActiveStatus": true
  },
  "AllowedHosts": "*"
}

```

#### 注入容器
```csharp
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddFeatureManagement();
        }
```

#### 控制器使用
```csharp
        private readonly IFeatureManager _featureManager;

        public HomeController(IFeatureManager featureManager)
        {
            _featureManager = featureManager;
        }

        [HttpGet]
        public async Task<string> GetAsync()
        {
            if (await _featureManager.IsEnabledAsync("ActiveStatus"))//通过这个if去判断是否执行
            {
                return "启用";
            }

            return "输出";
        }
```
> 通过这个if去判断是否执行

![image.png](/common/1620829882545-2591e49c-b0b0-4edf-850f-62a44d8af05f.png)

#### 对整个控制器or单个action控制
```csharp
        [HttpGet]
        [FeatureGate("ActiveStatus")]
        public string Get()
        {
            //if (await _featureManager.IsEnabledAsync("FubaoEnabled"))
            //{
            //    return "启用";
            //}

            return "输出";
        }
```
> 如果状态改为false，通过http去调用接口提示404


### 通过时间模式控制

#### 配置文件
```csharp
"FeatureManagement": {
    "Fubao": { //这个配置的名称
      "EnabledFor": [
        {
          "Name": "TimeWindow",
          "Parameters": {
            "Start": "12/05/2020 03:00:00 GMT", //UTC时间起点
            "End": "12/05/2020 03:10:00 GMT" //UTC时间终点
          }
        }
      ]
    }
  }
```

#### 注入容器
```csharp
services.AddFeatureManagement().AddFeatureFilter<TimeWindowFilter>();
```

#### 控制器使用
```csharp
        private readonly IFeatureManager _featureManager;

        public HomeController(IFeatureManager featureManager)
        {
            _featureManager = featureManager;
        }

        [HttpGet]
        public async Task<string> GetAsync()
        {
            if (await _featureManager.IsEnabledAsync("FubaoEnabled"))//通过这个if去判断是否执行
            {
                return "启用";
            }

            return "输出";
        }
```

#### 对整个控制器or单个action控制
```csharp
        [HttpGet]
        [FeatureGate("FubaoEnabled")]
        public string Get()
        {
            //if (await _featureManager.IsEnabledAsync("FubaoEnabled"))
            //{
            //    return "启用";
            //}

            return "输出";
        }
```
> 注意：
> 功能开关的配置值更改，无需重启应用程序，修改配置文件后可以热更新，立即生效！
> 由于 TimeWindow 的时间属性是 DateTimeOffset? 类型的，因此我们没法配置具体时区（如中国CST）的时间，必须人工转换为 GMT 时间才行。


## 参考文档
> [https://github.com/microsoft/FeatureManagement-Dotnet](https://github.com/microsoft/FeatureManagement-Dotnet)

