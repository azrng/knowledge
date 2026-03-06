---
title: 概述
lang: zh-CN
date: 2023-05-09
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - 无
filename: gaishu
slug: ibsgnl
docsId: '67220188'
---

## 概述
基于Material Design和BlazorComponent的交互能力提供标准的基础组件库。提供如布局、弹框标准、Loading、全局异常处理等标准场景的预置组件。
官网：[https://docs.masastack.com/blazor/introduction/why-masa-blazor](https://docs.masastack.com/blazor/introduction/why-masa-blazor)

## 操作

### 基本操作

#### 安装Masa.Template模板
Masa.Template包含 MASA 系列所有项目模板。
```
dotnet new --install Masa.Template
```
关于模板的说明
```csharp
模板名                  短名称  语言  标记
----------------------  ------  ----  -----------------------------
MASA Blazor App         masab   [C#]  Blazor/MASA (不带任何样式)
MASA Blazor Pro Web     masabp  [C#]  Blazor/Pro/MASA/Web (直接创建一个pro模板的样式)
MASA Blazor Website     masabw  [C#]  Blazor/MASA/Web/Site (套用官网的样式方案)
MASA Framework Project  masafx  [C#]  Service/MASA/Minimal API/Dapr
```
创建项目
MASA Blazor 对应模板名为masab，根据项目模板名创建项目，并指定输出目录，即项目的根文件夹。
```
dotnet new masab -o MasaBlazorApp
```
> 默认为 Server 模式，通过参数--mode WebAssembly 创建 WebAssembly 模式项目。


#### 手动创建
创建一个Blazor项目
```
$ dotnet new blazorserver -o BlazorApp
或者
$ dotnet new blazorwasm -o BlazorApp
```
> blazorserver为 Blazor Server App 短名称。blazorwasm为 Blazor WebAssembly App 短名称

安装nuget包
```
$ dotnet add package Masa.Blazor
```
引入资源文件
Blazor Server在Pages/_Host.cshtml 中引入资源文件：
```csharp
<!--masa blazor css style-->
<link href="_content/Masa.Blazor/css/masa-blazor.css" rel="stylesheet" />
<link href="_content/Masa.Blazor/css/masa-extend-blazor.css" rel="stylesheet" />
<!--icon file,import need to use-->
<link href="https://cdn.masastack.com/npm/@("@mdi")/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
<link href="https://cdn.masastack.com/npm/materialicons/materialicons.css" rel="stylesheet">
<link href="https://cdn.masastack.com/npm/fontawesome/v5.0.13/css/all.css" rel="stylesheet">
<!--js(should lay the end of file)-->
<script src="_content/BlazorComponent/js/blazor-component.js"></script>
```
Blazor WebAssembly在wwwroot\index.html中引入资源文件：
```csharp
<link href="_content/Masa.Blazor/css/masa-blazor.css" rel="stylesheet" />
<link href="_content/Masa.Blazor/css/masa-extend-blazor.css" rel="stylesheet" />
<link
  href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css"
  rel="stylesheet"
/>
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
<link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet" />
<script src="_content/BlazorComponent/js/blazor-component.js"></script>
```
添加Masa.Blazor相关服务
```csharp
// Add services to the container.
builder.Services.AddMasaBlazor();
```
全局引用：修改_Imports.razor 文件,添加以下内容:
```csharp
@using Masa.Blazor
```
修改 Shared/MainLayout.razor 文件，设置 MApp 为根元素：
```csharp
<MApp> //layout </MApp>
```

## 开源示例

### Blazor-Blog-Web

通过Masa Blazor开发的个人博客Web项目

https://github.com/witeem/Blazor-Blog-Web
