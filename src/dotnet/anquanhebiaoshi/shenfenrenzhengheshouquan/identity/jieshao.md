---
title: 介绍
lang: zh-CN
date: 2023-04-02
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jieshao
slug: vy51it
docsId: '45180777'
---

## 介绍
是一个API，支持用户登录界面等功能，可以管理用户、密码、配置文件数据、角色等。

## 要解决的问题
以下就是我针对此次任务给你提出来的需求。
**身份系统**

- 可以同时被所有的ASP.NET 框架使用（Web MVC，Web Forms，Web Api，SignalR）
- 可以应用于构建 Web, 手机，存储，或者混合应用。

**能够对用户资料（User Profile）很方便的扩展**

- 可以针对用户资料进行扩展。

**持久化**

- 默认把用户信息存储在数据库中，可以支持使用EF进行持久化。（**可以看到，EF 其实只是Identity的一个功能点而已**）
- 可以控制数据库架构，更改表名或者主键的数据类型（int，string）
- 可以使用不同的存储机制（如 NoSQL，DB2等）

**单元测试**

- 使WEB 应用程序可以进行单元测试，可以针对ASP.NET Identity编写单元测试

**角色机制**

- 提供角色机制，可以使用不同的角色来进行不同权限的限制，可以轻松的创建角色，向用户添加角色等。

**要支持基于Claims**

- 需要支持基于 Claims 的身份验证机制，其中用户身份是一组Claims，一组Claims可以比角色拥有更强的表现力，而角色仅仅是一个bool值来表示是不是会员而已。

**第三方社交登陆**

- 可以很方便的使用第三方登入，比如 Microsoft 账户，Facebook， Twitter，Google等，并且存储用户特定的数据。

**封装为中间件**

- 基于中间件实现，不要对具体项目产生依赖
- 基于 Authorzation 中间件实现，而不是使用 FormsAuthentication 来存储cookie。

**NuGet包提供**

- 发布为 Nuget 包，这样可以容易的进行迭代和bug修复，可以灵活的提供给使用者。

以上，就是我提出来的需求，如果让你来封装这样一个用户身份认证组件，你是不是想到以上的这些功能点。
> 参考资料：[https://www.cnblogs.com/savorboard/p/aspnetcore-identity3.html](https://www.cnblogs.com/savorboard/p/aspnetcore-identity3.html)


## 操作
引用组件
```csharp
<ItemGroup>
	<PackageReference Include="AzrngCommon" Version="1.2.6" />
	<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.1">
		<PrivateAssets>all</PrivateAssets>
		<IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
	</PackageReference>
	<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="6.0.0" />
	<PackageReference Include="Swashbuckle.AspNetCore" Version="6.2.3" />
	<PackageReference Include="Microsoft.EntityFrameworkCore.Relational" Version="6.0.1" />
	<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="6.0.1">
		<PrivateAssets>all</PrivateAssets>
		<IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
	</PackageReference>
	<PackageReference Include="Microsoft.AspNetCore.Identity.EntityFrameworkCore" Version="6.0.1" />
</ItemGroup>
```

### 数据库表
重点放在包Microsoft.AspNetCore.Identity.EntityFrameworkCore
该包默认生成的数据库表为：

- AspNetUsers：用户表
- AspNetUserClaims：用户Claim(单个信息项)表
- AspNetUserLogins：用户登录信息表
- AspNetUserTokens：用户token信息表
- AspNetRoles：角色表
- AspNetRoleClaims：角色Claim(单个信息项)表
- AspNetUserRoles：用户角色关系表

### 代码
三个对象
**SignInManager**： 主要处理注册登录相关业务逻辑。
**UserManager**： 处理用户相关添加删除，修改密码，添加删除角色等。
**RoleManager**：角色相关添加删除更新等。
有些同学可能很好奇，都没有依赖具体的数据库或者是EF，是怎么样做到的增删改查的呢？
这个时候，就需要几个 Store 接口派上用场了。以下是Identity中定义的Store接口：

- IQueryableRoleStore
- IQueryableUserStore
- IRoleClaimStore
- IRoleStore
- IUserAuthenticationTokenStore
- IUserClaimStore
- IUserEmailStore
- IUserLockoutStore
- IUserLoginStore
- IUserPasswordStore
- IUserPhoneNumberStore
- IUserRoleStore
- IUserSecurityStampStore
- IUserStore
- IUserTwoFactorStore

## 参考文档
介绍：[https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity?view=aspnetcore-5.0&tabs=visual-studio](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity?view=aspnetcore-5.0&tabs=visual-studio)
配置Identity：[https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity-configuration?view=aspnetcore-6.0](https://docs.microsoft.com/zh-cn/aspnet/core/security/authentication/identity-configuration?view=aspnetcore-6.0)
源码地址：[https://github.com/dotnet/aspnetcore/tree/v6.0.1/src/Identity](https://github.com/dotnet/aspnetcore/tree/v6.0.1/src/Identity)
系列文章：[https://mp.weixin.qq.com/s/mh5mB1v9HXzgqhnX1vNYsw](https://mp.weixin.qq.com/s/mh5mB1v9HXzgqhnX1vNYsw)
