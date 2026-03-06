---
title: 配置Jwt认证配置
lang: zh-CN
date: 2023-09-14
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: peizhijwtrenzhengpeizhi
slug: kgll59
docsId: '75191758'
---
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>//认证
{
    o.Challenge = JwtBearerDefaults.AuthenticationScheme;
    o.RequireHttpsMetadata = false;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        //3+2

        // 发行人验证，这里要和token类中Claim类型的发行人保持一致
        //是否验证发行人
        ValidateIssuer = true,
        ValidIssuer = config.JwtIssuer,//发行人

        // 是否验证接收人
        ValidateAudience = true,
        ValidAudience = config.JwtAudience,//验证人
        //或者
        //AudienceValidator = (m, n, z) =>
        //{
        //    //m:Audience集合  n:解析后的jwt  z: token验证参数
        //    return m != null && (m.FirstOrDefault()?.Equals(config.JwtAudience, StringComparison.Ordinal) ?? false);
        //},

        // 是否开启密钥去验证token
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config.JwtSecretKey)),

        RequireExpirationTime = true,
        //是否验证token有效期，使用当前时间与token 的claim中的notbefore和expires对比
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,//校验时间是否过期时， token验证间隔默认是300s验证一次   TimeSpan.Zero代表是0间隔
    };
    //2021年2月7日 13:49:04  增加token验证过期的时候给返回头设置提示
    o.Events = new JwtBearerEvents
    {
        //如果jwt过期  那么就先走这个失败的方法，再走OnChallenge
        OnAuthenticationFailed = content =>//过期时候的场景，会给返回头增加标识
        {
            if (content.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                content.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        //验证失败自定义返回类
        OnChallenge = async context =>
        {
            // 跳过默认的处理逻辑，返回下面的模型数据
            context.HandleResponse();

            context.Response.ContentType = "application/json;charset=utf-8";
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;

            var result = new ResultModel
            {
                IsSuccess = false,
                Message = "UnAuthorized",
                Code = "401"
            };//实例化返回类
            await context.Response.WriteAsync(result.ToJson());
        },
        //当消息被收到时候  实现目的可能是如果是signalr请求的，那么就把请求参数里面的token放到正常的token上进行处理
        //OnMessageReceived = context =>
        //{
        //    var accessToken = context.Request.Query["access_token"];

        //    //如果请求的是signalr
        //    var path = context.HttpContext.Request.Path;
        //    if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/api/xxxhub")))
        //    {
        //        //从查询字符串中读取令牌
        //        context.Token = accessToken;
        //    }
        //    return Task.CompletedTask;
        //}
    };
});
```
