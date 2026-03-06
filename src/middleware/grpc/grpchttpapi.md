---
title: gRPC HTTP API
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: grpchttpapi
slug: odg5sc
docsId: '61477453'
---



另外需要引用的组件
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Grpc.HttpApi" Version="0.1.0-alpha.21317.5" />
  <PackageReference Include="Microsoft.AspNetCore.Grpc.Swagger" Version="0.1.0-alpha.21317.5" />
</ItemGroup>
```
startup配置
```csharp
services.AddGrpcHttpApi();// grpc httpapi

services.AddGrpcSwagger();//参考：https://docs.microsoft.com/zh-cn/aspnet/core/grpc/httpapi?view=aspnetcore-6.0
```



现在还没跑通

