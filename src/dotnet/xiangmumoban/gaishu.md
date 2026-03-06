---
title: 说明
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gaishu
slug: mngmrpp0spwhdty6
docsId: '110286402'
---

## 概述

自定义创建项目模板

## 开源项目模板

### Ardalis.CleanArchitecture.Template

干净架构和 ASP.NET Core 入门

```csharp
dotnet new --install Ardalis.CleanArchitecture.Template

dotnet new clean-arch -o Your.ProjectName
```

资料：[https://ardalis.com/clean-architecture-asp-net-core/](https://ardalis.com/clean-architecture-asp-net-core/)

### FluentConsole.Templates

- 🚀 提供快速开发模板，一键生成控制台应用的项目骨架
- 🐴 提供一个「现代化控制台应用项目结构的最佳实践」的参考方案
- 💉 依赖注入 - 基于 `Microsoft.Extensions.DependencyInjection` 的依赖注入支持
- 📄 日志 - 基于 `Microsoft.Extensions.Logging` 日志框架，搭配 `Serilog` 实现日志文件输出
- 🔧 配置 - 基于 `Microsoft.Extensions.Configuration` 配置框架，搭配 `dotenv.net` 等组件扩展功能

```
# 安装模板
dotnet new install FluentConsole.Templates

# 根据模板创建项目
dotnet new flu-cli -n MyProject
```

模板配置资料：https://www.cnblogs.com/deali/p/17823731.html

### fullstackhero

fullstackhero 的 .NET Web API 样板是您下一个Clean Architecture Project的起点，它包含您的项目所需的最基本的包和功能，包括开箱即用的多租户支持。这个项目可以为您的团队节省更多的开发时间。

特点

- 基于 .NET 7.0 构建
- 遵循干净的架构原则
- 领域驱动设计
- 云就绪。可以使用 Terraform 作为 ECS 容器部署到 AWS 基础设施！
- Docker-Compose 文件示例
- 记录在 [fullstackhero.net](https://fullstackhero.net/)
- 使用 Finbuckle 的多租户支持
  - 创建支持多数据库/共享数据库的租户
  - 按需激活/停用租户
  - 升级租户订阅 - 为每个租户添加更多有效期！
- 支持MySQL，MSSQL，Oracle和PostgreSQL！

文档地址：[https://fullstackhero.net/dotnet-webapi-boilerplate/](https://fullstackhero.net/dotnet-webapi-boilerplate/)  

仓库地址：[https://github.com/fullstackhero/dotnet-starter-kit](https://github.com/fullstackhero/dotnet-starter-kit)

## 参考文档
项目模板进阶：[https://mp.weixin.qq.com/s/Gwq0U5eW4OqcOc0inRyH0Q](https://mp.weixin.qq.com/s/Gwq0U5eW4OqcOc0inRyH0Q)

脚手架项目学习
[https://www.cnblogs.com/laozhang-is-phi/p/10205495.html](https://www.cnblogs.com/laozhang-is-phi/p/10205495.html)
[https://www.cnblogs.com/catcher1994/p/10061470.html](https://www.cnblogs.com/catcher1994/p/10061470.html)
