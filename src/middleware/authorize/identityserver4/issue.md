---
title: 问题
lang: zh-CN
date: 2022-02-03
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: userisnotauthenticated
slug: yk5o8r
docsId: '32032030'
---
## User is not authenticated

ids4登录不上，显示的错误日志是:Showing login: User is not authenticated

原因：
由于最新版的Chrome的Cookie策略导致写Cookie失败,从而导致用户认证的失败.
SameSite=strict:对于来自不同于源站的站点发出的请求，不发送cookie,为了防止CSRF攻击。
SameSite=lax:类似于strict，但是当用户有意地通过单击链接或发送表单启动请求时，就会发送cookies。不会在脚本请求时发送。
SameSite=none:无论请求来自哪里都可以(但是需要https)。

 

解决方案：
把Cookie策略设置了lax即可
```csharp
public void ConfigureServices(IServiceCollection services)
{
    ....
    // 配置cookie策略
   services.Configure<CookiePolicyOptions>(options =>
    {
        options.MinimumSameSitePolicy = Microsoft.AspNetCore.Http.SameSiteMode.Lax;
    }
}
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    ....
    app.UseCookiePolicy();
}
```

