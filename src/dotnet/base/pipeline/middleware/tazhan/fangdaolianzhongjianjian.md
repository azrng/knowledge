---
title: 防盗链中间件
lang: zh-CN
date: 2022-02-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fangdaolianzhongjianjian
slug: ory6d0
docsId: '47036803'
---
通过一个简单的中间件实现防止项目内的图片被其他人引用从而占用服务器资源。

## 操作
编写中间件
```csharp
/// <summary>
///图片防盗链中间件
/// </summary>
public class RefuseStealingImgMiddleware
{
	private readonly RequestDelegate _next;

	public RefuseStealingImgMiddleware(RequestDelegate requestDelegate)
	{
		_next = requestDelegate;
	}

	public async Task Invoke(HttpContext context)
	{
		var url = context.Request.Path.Value;
		if (!url.Contains(".jpg"))
		{
			await _next(context).ConfigureAwait(false);
		}
		else
		{
			var urlReferer = context.Request.Headers["Referer"];
			if (string.IsNullOrWhiteSpace(urlReferer))//直接访问
			{
				context.Response.StatusCode = 404;
				await context.Response.WriteAsync("NoFind").ConfigureAwait(false);
			}
			else if (!urlReferer.ToString().Contains("http://localhost:5000"))
			{
				//await context.Response.SendFileAsync("wwwroot/forbidden.jpg");
				context.Response.StatusCode = 401;
				await context.Response.WriteAsync("401").ConfigureAwait(false);
			}
			else
			{
				await _next(context).ConfigureAwait(false);//走正常流程
			}
		}
	}
}
```
启用中间件
```csharp
app.UseMiddleware<RefuseStealingImgMiddleware>();
app.UseStaticFiles();
```
效果
如果直接访问 [http://localhost:5000/dotnet.jpg](http://localhost:5000/dotnet.jpg) 会直接提示404找不到
如果访问时候头部增加Referer 如果不符合条件，那么直接返回401未授权。

