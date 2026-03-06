---
title: 引用头检查
lang: zh-CN
date: 2023-02-10
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: yinyongtoujiancha
slug: szviy4
docsId: '30622048'
---
对API请求引用头进行检查可以防止API滥用，以及跨站点请求伪造（CSRF）攻击
```csharp
public class ValidateReferrerAttribute : ActionFilterAttribute
{
    private IConfiguration _configuration;

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        _configuration = (IConfiguration)context.HttpContext.RequestServices.GetService(typeof(IConfiguration));

        base.OnActionExecuting(context);

        if (!IsValidRequest(context.HttpContext.Request))
        {
            context.Result = new ContentResult
            {
                Content = $"Invalid referer header",
            };
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.ExpectationFailed;
        }
    }
    private bool IsValidRequest(HttpRequest request)
 	{
        string referrerURL = "";

        if (request.Headers.ContainsKey("Referer"))
        {
            referrerURL = request.Headers["Referer"];
        }
        if (string.IsNullOrWhiteSpace(referrerURL)) return true;

        var allowedUrls = _configuration.GetSection("CorsOrigin").Get<string[]>()?.Select(url => new Uri(url).Authority).ToList();

        bool isValidClient = allowedUrls.Contains(new Uri(referrerURL).Authority);

        return isValidClient;
    }
}
```
增加一个配置文件：
```csharp
{
  "CorsOrigin": ["https://test.com", "http://test1.cn:8080"]
}
```
CorsOrigin参数中加入允许引用的来源域名:端口列表。
接口使用方式：
```csharp
[HttpGet]
[ValidateReferrer]
public IEnumerable<WeatherForecast> Get()
{
    ...
}
```
