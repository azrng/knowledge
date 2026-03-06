---
title: 包版本自动升级
lang: zh-CN
date: 2023-03-16
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: baobanbenzidongshengji
slug: gkg6fpdqqb7dg310
docsId: '113668819'
---

## 前言
因为公司有自己的私有包服务，但是在发包的过程中，时常会出现忘记升级包版本的情况，导致需要重新发包，就显得比较麻烦，于是就有了实现自动升级包版本的想法。鉴于服务是区分为四个环境的（dev，test，staging和master），所以对应的包版本标识也应该有四个。
预设的环境与包版本标识对应关系如下

| 环境 | 包版本标识 | 举例 |
| --- | --- | --- |
| dev | alpha | 1.0.1-alpha.2108211136 |
| test | beta | 1.0.1-beta.2108211137 |
| staging | rc | 1.0.1-rc.2108211138 |
| master | release | 1.0.1.2 |


## 自动升级包版本
自动升级包版本是实现通过调整csproj文件的配置来实现的。
两个生成版本号的逻辑

1. 版本号由每次编译打包时的当前时间去确定的。
2. 版本号通过传入的参数去确定的。

### 版本号由每次编译打包时的当前时间去确定的
打开需要实现自动升级包版本的项目的csproj文件,调整如下
```xml
<Project Sdk="Microsoft.NET.Sdk">
	<PropertyGroup>
		<TargetFramework>net7.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
		<!--编译时候是否生成nuget包-->
		<GeneratePackageOnBuild>true</GeneratePackageOnBuild>
		<!--包环境标识-->
		<PackageVersion></PackageVersion>
	</PropertyGroup>

	<PropertyGroup>
		<!--版本-->
		<VersionPrefix>1.0.0</VersionPrefix>
		<!--VersionSuffix顺序不能乱-->
		<VersionSuffix Condition="'$(Package_Version)' == ''">alpha.$([System.DateTime]::Now.ToString(`yyMMddHHmm`))</VersionSuffix>
		<VersionSuffix Condition="'$(Package_Version)' != ''">$(Package_Version).$([System.DateTime]::Now.ToString(`yyMMddHHmm`))</VersionSuffix>
		<VersionSuffix Condition="'$(Package_Version)' == 'release'" >$([System.DateTime]::UtcNow.Date.Subtract($([System.DateTime]::Parse("2021-01-01"))).TotalDays)</VersionSuffix>
	</PropertyGroup>

</Project>
```
其中 VersionPrefix 为包版本的前缀，VersionSuffix 为包版本的后缀，两个组合起来为当前的包版本。Package_Version 为自定义参数，用于辅助生成对应环境的nuget包，不传默认为是alpha，即对应dev环境的包。
每次build都会生成一个新的包,包的环境默认为alpha，版本号为build时的当前时间。如果需要打包其他环境的包可以通过打包命令去生成。
打包命令为
```csharp
dotnet build /p:Package_Version=alpha
```

### 版本号通过传入的参数去确定的
打开需要实现自动升级包版本的项目的csproj文件,调整如下
```xml
<Project Sdk="Microsoft.NET.Sdk">
	<PropertyGroup>
		<TargetFramework>net7.0</TargetFramework>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
		<GeneratePackageOnBuild>true</GeneratePackageOnBuild>
		<!--编译时是否生成nuget包-->
		<Package_Version></Package_Version>
		<!--包环境标识-->
		<Build_Version></Build_Version>
		<!--包版本号标识-->
	</PropertyGroup>

	<PropertyGroup>
		<!--版本-->
		<VersionPrefix>1.0.0</VersionPrefix>
		<!--VersionSuffix顺序不能乱-->
		<VersionSuffix Condition="'$(Package_Version)' == ''">alpha.$([System.DateTime]::Now.ToString(`yyMMddHHmm`))</VersionSuffix>
		<VersionSuffix Condition="'$(Package_Version)' != ''">$(Package_Version).$(Build_Version)</VersionSuffix>
		<VersionSuffix Condition="'$(Package_Version)'=='release'">$(Build_Version)</VersionSuffix>
	</PropertyGroup>
</Project>
```
其中 VersionPrefix 为包版本的前缀，VersionSuffix 为包版本的后缀，两个组合起来为当前的包版本。Package_Version 为自定义参数，用于辅助生成对应环境的nuget包，不传默认为是alpha，即对应dev环境的包。Build_Version 为自定义参数，用于指定生成包的最后一位版本号。
每次build都会生成一个新的包,包的环境默认为alpha，版本号为build时的当前时间。如果需要打包其他环境的包或者指定版本号的包可以通过打包命令去生成。命令如下
打包命令为
```csharp
dotnet build /p:Package_Version=alpha /p:Build_Version=11
```

## 资料来源
来源: 小猫的代码之旅
文章作者: caty
文章链接: https://blog.chcaty.cn/2021/08/22/net-core-nuget-bao-ban-ben-zi-dong-sheng-ji-shi-xian
本文章著作权归作者所有，任何形式的转载都请注明出处。
