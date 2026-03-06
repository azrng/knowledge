---
title: 安卓发布
lang: zh-CN
date: 2022-10-22
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: anzhuofabu
slug: yrpugg
docsId: '97589395'
---

## 目的
将MAUI程序生成apk包来玩。
> 切记项目目录不要带中文


## 程序包设置
每个应用都应该指定唯一的包标识符和版本，配置在项目的.csproj文件中
```csharp
<!-- 显示名 -->
<ApplicationTitle>MauiAppBlazor</ApplicationTitle>

<!-- App 标识 -->
<ApplicationId>com.companyname.mauiappblazor</ApplicationId>
<ApplicationIdGuid>48CF021D-51ED-47B9-B8BC-E6005BE37A8A</ApplicationIdGuid>

<!-- 版本 -->
<ApplicationDisplayVersion>1.0</ApplicationDisplayVersion>
<ApplicationVersion>1</ApplicationVersion>
```

## 创建密钥存储文件
使用密钥存储文件对包进行签名， Java/Android SDK 包含生成密钥存储所需的工具。 生成密钥存储文件后，将它添加到项目中，并将项目文件配置为引用它。提前安装 Java SDK ，以便你可以运行 _keytool_ 工具。
执行下面的步骤创建密钥存储文件
1.打开终端程序并导航到项目文件夹
![image.png](/common/1666449750699-d987ea22-6a0f-4d88-a494-64aaec095c89.png)
2.运行keytool工具
```csharp
keytool -genkey -v -keystore myapp.keystore -alias key -keyalg RSA -keysize 2048 -validity 10000
```
按照提示输入密码等设置
![image.png](/common/1666449805533-abf78679-6cd0-4b98-8a21-53cdb7aef38c.png)
该工具生成 一个 myapp.keystore 文件，该文件应与项目位于同一文件夹中。

## 添加对密钥存储文件的引用
修改项目的csproj文件做以下配置
```csharp
<PropertyGroup Condition="$(TargetFramework.Contains('-android')) and '$(Configuration)' == 'Release'">
  <AndroidKeyStore>True</AndroidKeyStore> <!--设置为 True 对应用进行签名-->
  <AndroidSigningKeyStore>myapp.keystore</AndroidSigningKeyStore> <!--在上一部分中创建的密钥存储文件： myapp.keystore-->
  <AndroidSigningKeyAlias>key</AndroidSigningKeyAlias> <!--传递给 keytool 工具的参数值：键-->
  <AndroidSigningKeyPass>123456</AndroidSigningKeyPass> <!--创建密钥存储文件时提供的密码-->
  <AndroidSigningStorePass>123456</AndroidSigningStorePass> <!--创建密钥存储文件时提供的密码-->
</PropertyGroup>
```

## 发布
使用.Net命令行来发布
```csharp
dotnet publish -f:net7.0-android -c:Release /p:AndroidSigningKeyPass=123456 /p:AndroidSigningStorePass=123456
```
> 参数介绍
> -f ：目标框架，例如net7.0-android
> -c：生成配置，例如Release
> /p:AndroidSigningKeyPass：上面AndroidSigningKeyPass项目设置的值，也就是创建密钥文件时候的密码
> /p：AndroidSigningStorePass ：上面AndroidSigningStorePass项目设置的值，也就是创建密钥文件时候的密码

发布之后会生成到相对路径为：\bin\Release\net7.0-android\publish 
![image.png](/common/1666451120428-276a9ea0-f401-4546-bdb4-feceb836eef2.png)
包含aab文件和apk文件，有两个 aab 文件，一个未签名，另一个已签名。 签名的变体在文件名中具有 -signed 。

## 错误处理
如果打包的时候遇到“error XA5300: 找不到 Android SDK 目录。请检查 Visual Studio 中的 Android SDK 管理器是否显示有效的安装。若要使用命令行 生成的自定义 SDK 路径，请将 "AndroidSdkDirectory" MSBuild 属性设置为自定义路径。 ”那么可以修改上面的发布命令为
```csharp
dotnet publish -f:net7.0-android -c:Release /p:AndroidSigningKeyPass=123456 /p:AndroidSigningStorePass=123456 /p:AndroidSdkDirectory=D:\Android\android-sdk
```
这个安卓sdk的地址只能你自己在你电脑上找了。

## 参考资料
官网资料：[https://learn.microsoft.com/zh-cn/dotnet/maui/android/deployment/publish-cli](https://learn.microsoft.com/zh-cn/dotnet/maui/android/deployment/publish-cli)
