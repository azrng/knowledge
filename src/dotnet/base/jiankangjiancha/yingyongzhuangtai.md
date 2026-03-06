---
title: 应用状态
lang: zh-CN
date: 2022-04-23
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: yingyongzhuangtai
slug: dm1t2k
docsId: '30904393'
---

### 健康检查
新增一个Health控制器，里面包含一个check方法，通过不间断调用该方法来判断程序运行是否正常。

### 状态和统计

#### 操作方法
新增类继承IDashboardAuthorizationFilter类，实现Authorize 方法
```csharp
public class TokenVerification : IDashboardAuthorizationFilter
{
	public bool Authorize(HttpRequest request)
	{
		if (request.Headers.ContainsKey("Token") && request.Headers["Token"].Equals("test"))
		{
			return true;
		}
		return false;
	}
}
```
自定义返回路径和添加身份认证，在startup类的Configure方法中添加如下配置
```csharp
app.UseCLRStatsDashboard("/custom-link", new DashboardOptions()
{
	Authorization = new IDashboardAuthorizationFilter[] { new TokenVerification() }
});
```
启动项目通过访问站点/custom-link路径，并且请求头里面需要携带token参数，值为test，才能访问成功
使用windows系统下的curl工具进行测试，命令如下：
```csharp
curl "http://localhost:4409/custom-link" --header "Token: test"
```
> 注意：需要安装包 CLRStats

```csharp
Install-Package CLRStats -Version 1.0.0
```
