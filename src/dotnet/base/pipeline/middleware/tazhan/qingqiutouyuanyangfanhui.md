---
title: 请求头原样返回
lang: zh-CN
date: 2023-07-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qingqiutouyuanyangfanhui
slug: wpafftznbhhrtuob
docsId: '131919013'
---

## 概述
可以实现将请求头的内容进行原样返回出来

## 操作
```powershell
public class RequestIdMiddleware
{
	private readonly RequestDelegate _next;
	private const string RequestIdHeader = "X-RequestId";

	public RequestIdMiddleware(RequestDelegate next) => this._next = next;

	public async Task Invoke(HttpContext context)
	{
		IHttpRequestIdentifierFeature requestIdFeature = context.Features.Get<IHttpRequestIdentifierFeature>();
		if (requestIdFeature?.TraceIdentifier != null)
		{
			if (((IDictionary<string, StringValues>)context.Request.Headers).ContainsKey("X-RequestId"))
				requestIdFeature.TraceIdentifier = (string)context.Request.Headers["X-RequestId"];
			context.Response.Headers["X-RequestId"] = (StringValues)requestIdFeature.TraceIdentifier;
		}
		await this._next(context);
	}
}
```
