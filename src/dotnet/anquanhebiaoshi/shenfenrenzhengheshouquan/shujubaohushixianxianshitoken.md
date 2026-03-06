---
title: 数据保护实现限时Token
lang: zh-CN
date: 2022-04-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shujubaohushixianxianshitoken
slug: inpnlw
docsId: '75342843'
---

## 使用场景
生成有过期时间的token凭据。比如重置密码的令牌。

## 操作

### 数据保护组件
注册数据保护
```csharp
services.AddDataProtection();
```
在 Controller 的构造函数中注入 IDataProtectionProvider 对象，使用 Provider 创建一个实现 IDataProtector 接口的数据保护器对象：
```csharp
private readonly IDataProtector _dataProtector;
public TokenController(IDataProtectionProvider dataProtectionProvider)
{
    _dataProtector = dataProtectionProvider.CreateProtector("Token Protector");
}
```
就可以使用Protect和Unprotect加解密数据：
```csharp
[HttpGet]
[Route("Generate")]
public string Generate(string name)
{
    return _dataProtector.Protect(name);
}

[HttpGet]
[Route("Check")]
public string Check(string token)
{
    return _dataProtector.Unprotect(token);
}
```
我们可以使用 IDataProtector 接口的 ToTimeLimitedDataProtector 方法创建一个带过期时间的数据保护器：
```csharp
private readonly ITimeLimitedDataProtector _dataProtector;
public TokenController(IDataProtectionProvider dataProtectionProvider)
{
    _dataProtector = dataProtectionProvider.CreateProtector("Token Protector").ToTimeLimitedDataProtector();
}
```
我们就可以在Protect中加入TimeSpan参数，指定加密数据的过期时间：
```csharp
_dataProtector.Protect(name, TimeSpan.FromSeconds(5));
```
这样，当前 Token 的有效时间只有5秒，超期后无法解密。

## 资料
[https://mp.weixin.qq.com/s/9oB1Vc_yWCrH3KwusCiJRw](https://mp.weixin.qq.com/s/9oB1Vc_yWCrH3KwusCiJRw) | 利用 .NET Core 中的数据保护组件实现限时 Token
