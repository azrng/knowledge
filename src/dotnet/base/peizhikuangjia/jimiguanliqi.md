---
title: 机密管理器
lang: zh-CN
date: 2022-03-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jimiguanliqi
slug: kzlgrh
docsId: '66380007'
---

## 介绍
ASP.NET Core 机密管理器工具提供了开发过程中在源代码外部保存机密的另一种方法 。若要使用机密管理器工具，请在项目文件中安装包 Microsoft.Extensions.Configuration.SecretManager 。如果该依赖项存在并且已还原，则可以使用 dotnet user-secrets 命令来通过命令行设置机密的值。这些机密将存储在用户配置文件目录中的 JSON 文件中（详细信息随操作系统而异），与源代码无关。
机密管理器工具设置的机密是由使用机密的项目的 UserSecretsId 属性组织的。因此，必须确保在项目文件中设置 UserSecretsId 属性，如下面的代码片段所示。默认值是 Visual Studio 分配的 GUID，但实际字符串并不重要，只要它在计算机中是唯一的。
```json

<PropertyGroup>
   <UserSecretsId>UniqueIdentifyingString</UserSecretsId>
</PropertyGroup> 
```
Secret Manager工具允许开发人员在开发ASP.NET Core应用程序期间存储和检索敏感数据。敏感数据存储在与应用程序源代码不同的位置。
由于Secret Manager将秘密与源代码分开存储，因此敏感数据不会提交到源代码存储库。但机密管理器不会对存储的敏感数据进行加密，因此不应将其视为可信存储。敏感数据作为键值对存储在JSON文件中。最好不要在开发和测试环境中使用生产机密。

## 存放位置
在windows平台下，机密数据的存放位置为：
```json
%APPDATA%\Microsoft\UserSecrets\\secrets.json
```
而在Linux/MacOs平台下，机密数据的存放位置为：
```json
 ~/.microsoft/usersecrets/<user_secrets_id>/secrets.json
```
在前面的文件路径中， `user_secrets_id`将替换UserSecretsId为.csproj文件中指定的值。

## 操作
如果是vs中使用，直接右键管理用户机密，然后直接进行编辑添加配置，直接就可以通过IConfiguration的方式、IOptions的方式，进行配置的访问。
> 注意：如果你的appsetting.json文件中有和secrets.json文件中相同节点（冲突）的配置项，那么就会被secrets.json中的设置项给覆盖掉


### 命令操作
通过命令设置
```json
 dotnet user-secrets set "Movies:ServiceApiKey" "12345" 
```
通过命令查询
```json
 dotnet user-secrets list
```
删除机密
```json
dotnet user-secrets remove "Movies:ConnectionString" 
```
清除所有的机密
```json
dotnet user-secrets clear
```

## 资料
开发环境保存机密信息：[https://www.cnblogs.com/savorboard/p/dotnetcore-user-secrets.html](https://www.cnblogs.com/savorboard/p/dotnetcore-user-secrets.html)
