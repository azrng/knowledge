---
title: 注册多个实现
lang: zh-CN
date: 2023-10-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zhuceduogeshixian
slug: cfnfhr
docsId: '43527088'
---

## 基础配置
```csharp
public interface IUserService
{
    string GetName();
}

public class UserServiceA : IUserService
{
    public string GetName()
    {
        return "aaaaa";
    }
}

public class UserServiceB : IUserService
{
    public string GetName()
    {
        return "bbbbbb";
    }
}
```

## 获取

### 通过IEnumerable获取
```csharp
services.AddTransient<IUserService, UserServiceA>();
services.AddTransient<IUserService, UserServiceB>();


private readonly ILogger<UserController> _logger;
private readonly IUserService _userServiceA;
private readonly IUserService _userServiceB;

public UserController(ILogger<UserController> logger,
                      IEnumerable<IUserService> userServices)
{
    _logger = logger;
    _userServiceA = userServices.FirstOrDefault(t => t.GetType() == typeof(UserServiceA));
    _userServiceB = userServices.FirstOrDefault(t => t.GetType() == typeof(UserServiceB));
}
```

### Func
```csharp
            services.AddTransient<UserServiceA>();
            services.AddTransient<UserServiceB>();
            services.AddTransient(serviceProvider =>
            {
                return (Func<Type, IUserService>)(key =>
                {
                    if (key == typeof(UserServiceA))
                        return serviceProvider.GetService<UserServiceA>();
                    else if (key == typeof(UserServiceB))
                        return serviceProvider.GetService<UserServiceB>();
                    else
                        throw new ArgumentException($"不支持的DI Key: {key}");
                });
            });


        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userServiceA;
        private readonly IUserService _userServiceB;

        public UserController(ILogger<UserController> logger,
            Func<Type,IUserService> userServiceList)
        {
            _logger = logger;
            _userServiceA = userServiceList(typeof(UserServiceA));
            _userServiceB = userServiceList(typeof(UserServiceB));
        }
```

## 参考文档
> .Net Core DI依赖注入：一个接口注入多个实现类: [https://www.cnblogs.com/OpenCoder/p/13646648.html](https://www.cnblogs.com/OpenCoder/p/13646648.html)

