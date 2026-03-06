---
title: 自定义ApiKey认证
lang: zh-CN
date: 2023-02-11
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: zidingyiapikeyrenzheng
slug: cnnnhs
docsId: '75208588'
---

## 介绍
APIKey支持两种模式认证Spatialmap、CRS、OC、AI服务：

- Token认证：通过HTTP头部传递直接认证。Web用户推荐这种，避免secret写进javascript客户端。
- signature签名认证：参数传递apikey以及对参数和密钥计算SHA256摘要的签名认证。

## 操作
下面的操作来演示一下token认证的方案

编写配置常量类用于存储认证方式
```csharp
public static class ApiKeyAuthenticationDefaults
{
    /// <summary>
    /// 认证schema名称
    /// </summary>
    public const string AuthenticationSchema = "ApiKey";
}
```
编写apikey认证方式配置类ApiKeyAuthenticationOptions，继承自AuthenticationSchemeOptions
```csharp
public class ApiKeyAuthenticationOptions : AuthenticationSchemeOptions
{
    /// <summary>
    /// key
    /// </summary>
    public string ApiKey { get; set; }

    /// <summary>
    /// key名称
    /// </summary>
    public string ApiKeyName { get; set; } = "X-ApiKey";

    /// <summary>
    /// key传递的位置
    /// </summary>
    public KeyLocation KeyLocation { get; set; } = KeyLocation.Header;

    public Func<HttpContext, string, Task<bool>> ApiKeyValidator { get; set; }
    public Func<HttpContext, ApiKeyAuthenticationOptions, Claim[]> ClaimsGenerator { get; set; }


    public override void Validate()
    {
        if (string.IsNullOrWhiteSpace(ApiKey))
        {
            throw new ArgumentException("Invalid ApiKey configured");
        }
    }
}

/// <summary>
/// key来源
/// </summary>
public enum KeyLocation
{
    Header = 0,
    Query = 1,
    HeaderOrQuery = 2,
    QueryOrHeader = 3,
}
```
编写自定义认证处理程序
```csharp
public sealed class ApiKeyAuthenticationHandler : AuthenticationHandler<ApiKeyAuthenticationOptions>
{
    public ApiKeyAuthenticationHandler(IOptionsMonitor<ApiKeyAuthenticationOptions> options, ILoggerFactory logger,
        UrlEncoder encoder, ISystemClock clock) : base(options, logger, encoder, clock)
    {
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // 获取传递过来的apikey
        StringValues keyValues;
        var keyExists = Options.KeyLocation switch
        {
            KeyLocation.Query => Request.Query.TryGetValue(Options.ApiKeyName, out keyValues),
            KeyLocation.HeaderOrQuery => Request.Headers.TryGetValue(Options.ApiKeyName, out keyValues) ||
                                         Request.Query.TryGetValue(Options.ApiKeyName, out keyValues),
            KeyLocation.QueryOrHeader => Request.Query.TryGetValue(Options.ApiKeyName, out keyValues) ||
                                         Request.Headers.TryGetValue(Options.ApiKeyName, out keyValues),
            _ => Request.Headers.TryGetValue(Options.ApiKeyName, out keyValues),
        };
        if (!keyExists)
            return AuthenticateResult.NoResult();

        // 验证apikey是否有效
        var validator = Options.ApiKeyValidator ??
                        ((_, keyValue) => Task.FromResult(string.Equals(Options.ApiKey, keyValue)));
        if (!await validator.Invoke(Context, keyValues.ToString()))
            return AuthenticateResult.Fail("Invalid ApiKey");

        // 将用户内容进行存储
        var claims = new[]
        {
            new Claim("issuer", ClaimsIssuer),
        }.Union(Options.ClaimsGenerator?.Invoke(Context, Options) ?? Array.Empty<Claim>());

        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(claims, Scheme.Name,
            ClaimTypes.NameIdentifier, ClaimTypes.Role));
        var ticket = new AuthenticationTicket(claimsPrincipal, new AuthenticationProperties
        {
            //获取或设置身份验证会话是否跨多个请求持久化
            IsPersistent = false
        }, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
```
然后就是编写注入的配置扩展了
```csharp
public static AuthenticationBuilder AddApiKey(this AuthenticationBuilder builder)
{
    return builder.AddApiKey(ApiKeyAuthenticationDefaults.AuthenticationSchema);
}

public static AuthenticationBuilder AddApiKey(this AuthenticationBuilder builder,
    string schema)
{
    return builder.AddApiKey(schema, _ => { });
}

public static AuthenticationBuilder AddApiKey(this AuthenticationBuilder builder,
    Action<ApiKeyAuthenticationOptions> configureOptions)
{
    return builder.AddApiKey(ApiKeyAuthenticationDefaults.AuthenticationSchema, configureOptions);
}

public static AuthenticationBuilder AddApiKey(this AuthenticationBuilder builder, string schema,
    Action<ApiKeyAuthenticationOptions> configureOptions)
{
    if (configureOptions != null)
    {
        builder.Services.Configure(configureOptions);
    }

    return builder.AddScheme<ApiKeyAuthenticationOptions, ApiKeyAuthenticationHandler>(schema, configureOptions);
}
```
最后就是使用的示例了
```csharp
builder.Services.AddAuthentication(ApiKeyAuthenticationDefaults.AuthenticationSchema)
    .AddApiKey(options =>
    {
        options.ApiKey = "123456";
        options.ApiKeyName = "X-ApiKey";
        options.ClaimsIssuer = "azrng.com";
        options.KeyLocation = KeyLocation.Header;
    });
```
如果我们使用了swagger，那么还可以扩展swagger进行传入apikey
```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "API说明"
    });

    //定义认证方式
    options.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme()
    {
        Description = "输入你的的ApiKey",
        Name = "X-ApiKey", //默认的参数名称
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKeySchema"
    });

    //声明一个Scheme，注意下面的Id要和上面AddSecurityDefinition中的参数name一致
    var scheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "ApiKey"
        }
    };
    //注册全局认证（所有的接口都可以使用认证）
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [scheme] = Array.Empty<string>()
    });
});
```

## 资料
[https://mp.weixin.qq.com/s/6E9qwm0StgitgAU6PEr-fw](https://mp.weixin.qq.com/s/6E9qwm0StgitgAU6PEr-fw) | ASP.NET Core 实现基于 ApiKey 的认证
