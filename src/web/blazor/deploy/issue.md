---
title: 问题
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: cuowuchuli
slug: mqspv3ycp38t3mae
docsId: '113298284'
---

### 禁用完整性检查
错误描述：
```csharp
Failed to find a valid digest in the 'integrity' attribute for resource 'https://xxxx/_framework/dotnet.7.0.2.ugjw1i20xy.js' with computed SHA-256 integrity 'DudsybyARYYY5kOlsB1ymRUBqrxe5DvlYrfPhSMlN8M='. The resource has been blocked.

Uncaught (in promise) Error: Failed to start platform. Reason: TypeError: Failed to fetch dynamically imported module: https://xxxx/_framework/dotnet.7.0.2.ugjw1i20xy.js at Object.Vt [as start] (blazor.webassembly.js:1:62194)
```
解决方案
请将以下内容添加到 Blazor WebAssembly 应用的项目文件 (.csproj) 中的属性组：
```csharp
<BlazorCacheBootResources>false</BlazorCacheBootResources>
```
资料：[https://learn.microsoft.com/zh-cn/aspnet/core/blazor/host-and-deploy/webassembly?view=aspnetcore-6.0#disable-integrity-checking-for-non-pwa-apps-1](https://learn.microsoft.com/zh-cn/aspnet/core/blazor/host-and-deploy/webassembly?view=aspnetcore-6.0#disable-integrity-checking-for-non-pwa-apps-1)

