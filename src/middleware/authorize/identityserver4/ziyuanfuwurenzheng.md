---
title: 资源服务认证
lang: zh-CN
date: 2022-05-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: ziyuanfuwurenzheng
slug: tte3g1
docsId: '75727432'
---
通过组件JwtBearer
```csharp
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="5.0.6" />
```
具体代码
```csharp
//JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
////关闭默认映射，否则它可能修改从授权服务返回的各种claim属性
//JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

// prevent from mapping "sub" claim to nameidentifier.
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Remove("sub");

var authority = "http://localhost:5010";
services.AddAuthentication("Bearer")
            .AddJwtBearer(options => //为授权服务器注册为token的处理人，即在本API程序中设计到token的处理
    {
        //移交给指定服务器（ids4）进行处理
        options.Authority = authority;
        options.RequireHttpsMetadata = false;
        options.Audience = "userResource";

        options.BackchannelHttpHandler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback = (_, __, ___, ____) => true
        };
         optins.SaveTokens = true;//用于在cookie中保留来自identityserver的令牌
        //显示[PII is hidden]占位符隐藏的信息：
        IdentityModelEventSource.ShowPII = true;
    });

//允许检查客户端请求的访问令牌中是否存在作用域的代码
services.AddAuthorization(options =>
{
    //客户端Scope中包含userScope才能访问
    options.AddPolicy("userScope", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "userScope");
    });
    ////客户端Scope中包含orderScope才能访问
    options.AddPolicy("orderScope", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "orderScope");
    });

});
```
另一种
```csharp
JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
//关闭默认映射，否则它可能修改从授权服务返回的各种claim属性
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
var identityService = Configuration.GetValue<string>("Config:IdentityService");
//将身份验证服务添加到容器
services.AddAuthentication(options =>
{
    // 客户端应用设置使用"Cookies"进行认证
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // identityserver4设置使用"oidc"进行认证  用户登录时候使用openid connect协议
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
}).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
//用于配置执行openid connect协议的处理程序
.AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, optins =>
{
    optins.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    optins.Authority = identityService;//信任的认证地址

    optins.ClientId = "ClientMvc";//识别客户端
                                    // optins.ClientSecret = "secret";
                                    //optins.ResponseType = "code";
    optins.RequireHttpsMetadata = false;//如果不使用https，那么就需要配置这个

    optins.SaveTokens = true;//用于在cookie中保留来自identityserver的令牌

    //指定客户端引用程序需要访问的范围并设置选项
    // optins.Scope.Add("profile");
    //optins.GetClaimsFromUserInfoEndpoint = true;
});
```
