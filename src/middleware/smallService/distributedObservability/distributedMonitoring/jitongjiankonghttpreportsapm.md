---
title: 系统监控HttpReports APM
lang: zh-CN
date: 2023-09-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jitongjiankonghttpreportsapm
slug: znd2ez
docsId: '32382975'
---

## 1. 说明
HttpReports 基于.NET Core 开发的APM监控系统，使用MIT开源协议，主要功能包括，统计, 分析, 可视化， 监控，追踪等，适合在中小项目中使用。

![](/common/1614927187309-f9906533-1844-4204-86be-23557f142bc1.png)

## 2. 操作

### 2.1 部署

#### 2.1.1 部署监控系统
引用组件
HttpReports.Dashboard ，HttpReports.MySQL（或者是HttpReports.SqlServer, HttpReports.PostgreSQL）
```csharp
    <PackageReference Include="HttpReports.Dashboard" Version="2.5.10" />
    <PackageReference Include="HttpReports.MySQL" Version="2.5.10" />
```

#### 2.1.2 服务对接
引用组件
```csharp
    <PackageReference Include="HttpReports" Version="2.5.10" />
    <PackageReference Include="HttpReports.Transport.Http" Version="2.5.10" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="5.6.3" />
```

### 2.2 预警监控
支持监控类型

- 响应超时
- 请求错误
- 请求量监控

### 2.3 健康检查
支持两种方式的健康检查

- Self
- Http

**Self** :  服务使用 HttpReports 组件后，会收集性能数据，每10s 一次 发送到 Dashboard，  所以从 Dashboard 就可以检查有哪些服务发送了性能数据上来， 来判断程序是否健康
**Http**:   Dashboard 每分钟会检查一次所有服务和实例的健康检查接口 （Endpoint），判断接口响应在正常时间内和 状态码为 200，来判断程序是否健康，**HttpReports** 默认内置了一个健康检查的接口，当然你也可以自定义这个地址，如果使用默认的话，Endpoint参数留空即可 ，Range参数定义了响应时间的标准，三个状态 Passing （健康） Warning （警告）Critical （严重）， "Range": "500, 2000" , 代表 响应时间分别为：
0-500 ms 健康，500 - 2000 ms 警告，2000以上 严重


> 参考地址：[https://www.yuque.com/httpreports/docs/uyaiil](https://www.yuque.com/httpreports/docs/uyaiil)


