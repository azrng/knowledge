---
title: 鉴权
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jianquan
slug: xrs9ke
docsId: '61883727'
---
gRPC程序也是需要鉴权的，否则都可以随意请求如何处理?下面我们就来演示下如何进行鉴权。

### 配置Jwt认证
我们需要先在服务端配置jwt认证方案，此处我直接引用封装的组件包
```csharp
<PackageReference Include="Common.JwtToken" Version="1.1.2" />
```
startup中配置
```csharp
//使用jwt鉴权
services.AddJwtTokenService(() =>
{
    return new AuthorizationConfig
    {
        JwtAudience = "audience",
        JwtIssuer = "issuer",
        JwtSecretKey = "secretkeysecretkeysecretkeysecretkeysecretkey"
    };
});
```
Configure配置
```csharp
app.UseAuthentication();
app.UseAuthorization();
```

### 服务鉴权
对grpc服务配置需要认证才能访问
```csharp
/// <summary>
/// 用户服务
/// </summary>
[Authorize]
public class UserInfoGrpcService : UserInfoServiceBase
```
当没有传token的情况下访问
![image.png](/common/1638618914158-269370b9-6593-464b-a002-d50fc3d1c087.png)

### 访问服务
那么我们在服务端编写一个获取token的方法，然后获取token
```csharp
[HttpGet]
public string Get()
{
    var token = _jwtAuthService.CreateToken("admin", "张三");
    return token;
}
```
我们再请求grpc的时候就可以带着token进行访问了
```csharp
//传递token请求
var header = new Metadata
{
    { "Authorization", $"Bearer {token}" }
};
var result = await _userInfoServiceClient.GetUserInfoAsync(new GetUserInfoRequest { UserId = userId }, header);
```
再一次请求接口查看返回的结果
![image.png](/common/1638620421102-fdd44e31-1c18-45ee-97c3-b579b5f793a4.png)
已经可以正常的请求了
