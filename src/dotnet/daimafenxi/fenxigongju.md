---
title: 分析工具
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: fenxigongju
slug: tedi5k
docsId: '32029315'
---

## MiniProfiler 

### 概述
一个简单但有效的mini分析器。
官网：[https://miniprofiler.com/](https://miniprofiler.com/)

### 安装组件
```bash
Install-Package MiniProfiler.AspNetCore.Mvc
```

### 添加服务并启用服务
注册服务
```csharp
//配置路由基础路径，默认地址是/mini-profiler-resources
services.AddMiniProfiler(options => options.RouteBasePath = "/profiler");
```
启用服务
```csharp
app.UseMiniProfiler();
```
> 查看请求时间地址：[http://localhost:8001/profiler/results](http://localhost:8001/profiler/results)
> 当前页面只会显示最近一次的请求


### 查阅效果
如果想看最后一次请求的效果：[http://localhost:8001/profiler/results](http://localhost:8001/profiler/results)
如果想看列表：[http://localhost:8001/profiler/results-index](http://localhost:5969/profiler/results-index)

### 单独监控分析的代码
```csharp
[HttpGet]
public IEnumerable<string> Get()
{
	string url1 = string.Empty;
	string url2 = string.Empty;
	using (MiniProfiler.Current.Step("Get方法"))
	{
		using (MiniProfiler.Current.Step("准备数据"))
		{
			using (MiniProfiler.Current.CustomTiming("SQL", "SELECT * FROM Config"))
			{
				// 模拟一个SQL查询
				Thread.Sleep(500);

				url1 = "https://www.baidu.com";
				url2 = "https://www.sina.com.cn/";
			}
		}
		using (MiniProfiler.Current.Step("使用从数据库中查询的数据，进行Http请求"))
		{
			using (MiniProfiler.Current.CustomTiming("HTTP", "GET " + url1))
			{
				var reply = _httpClient.GetAsync<string>(url1);
			}

			using (MiniProfiler.Current.CustomTiming("HTTP", "GET " + url2))
			{
				var reply = _httpClient.GetAsync<string>(url2);
			}
		}
	}
	return new string[] { "value1", "value2" };
}
```
> 代码解释：
> - `MiniProfiler.Current.Step`方法定义了分析的步骤，这个方法可以接受一个`String`类型的参数，它会显示在最终的报告中
> - `MiniProfiler.Current.CustomTiming`方法是更细粒度的对报告内容进行分类，以上代码中定义了2种分类，一种是SQL, 一种是Http
> - 上述程序的功能： 模拟从数据库拉取2个网站的Url, 并使用`WebClient`来分别请求网站的Url

让某些代码不要显示在 mini-profile 中，需要做的是调用 Ignore() 即可，如下代码所示：
```csharp
using (MiniProfiler.Current.Ignore())
{
  // Write code here that you don't
  // want MiniProfiler to profile
}
```

### Swagger集成
下载index页面放到根目录，下载地址
> [https://github.com/domaindrivendev/Swashbuckle.AspNetCore/blob/master/src/Swashbuckle.AspNetCore.SwaggerUI/index.html](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/blob/master/src/Swashbuckle.AspNetCore.SwaggerUI/index.html)

在该文件的头部加入下面脚本
```csharp
<script async="async" id="mini-profiler" src="/profiler/includes.min.js?v=4.0.138+gcc91adf599" 
        data-version="4.0.138+gcc91adf599" data-path="/profiler/" 
        data-current-id="4ec7c742-49d4-4eaf-8281-3c1e0efa748a" data-ids="" data-position="Left" 
        data-authorized="true" data-max-traces="15" data-toggle-shortcut="Alt+P" 
        data-trivial-milliseconds="2.0" data-ignored-duplicate-execute-types="Open,OpenAsync,Close,CloseAsync">
</script>
```
将该文件设置为嵌入资源始终复制
安装自定义页面，需要在启用swagger配置地方增加
```csharp
c.IndexStream = () => GetType().GetTypeInfo().Assembly.GetManifestResourceStream("APIStudy.index.html");
```
> 注意：APIStudy是你项目的命名空间


## 资料
> 参考教程：[https://www.cnblogs.com/sylone/p/11024386.html](https://www.cnblogs.com/sylone/p/11024386.html)

