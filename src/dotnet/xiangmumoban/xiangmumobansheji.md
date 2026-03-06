---
title: 项目模板设计
lang: zh-CN
date: 2023-10-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xiangmumobansheji
slug: pur36x
docsId: '66025348'
---

## 需求
通过创建项目模板，省去在新建项目的时候拷贝公共类，创建各个公共配置的步骤。

## 基本配置

### 构建模板
在合适做项目模板的项目根目录下新建一个文件夹.template.config，同时在这个文件夹下面创建template.json。
示例如下
```csharp
{
  "author": "Azrng", //必须
  "classifications": [ "Web/WebAPI" ], //必须，这个对应模板的Tags
  "name": "EFCoreDemo", //必须，这个对应模板的Templates
  "identity": "EFCoreMySQLTemplate", //可选，模板的唯一名称
  "shortName": "efmy", //必须，这个对应模板的Short Name
  "tags": {
    "language": "C#",
    "type": "project"
  },
  "sourceName": "EFMyDemo", // 可选，要替换的名字
  "preferNameDirectory": true // 可选，添加目录  
}
```
在模板文件的上一层执行安装命令
```shell
dotnet new -i ./MySQL_NetCoreAPI_EFCore
```
然后就可以看到我们安装的模板
```shell
模板名      短名称  语言  标记
----------  ------  ----  ----------
EFCoreDemo  efmy    [C#]  Web/WebAPI
```

卸载模板

```shell
dotnet new uninstall EFCoreDemo
```

### 查看模板信息

通过命令来查看模板信息
```csharp
dotnet new efmy -h
```
输出结果
```csharp
EFCoreDemo (C#)
作者: Azrng
    (无参数)
```

### 创建项目
在合适的目录下执行命令
```csharp
dotnet new efmy -n FirstTemplateProject
```
回车生成项目，打开运行一切正常。还有很多神奇的配置在等着我们使用。

## 资料
[https://mp.weixin.qq.com/s/YNbfDrhVT_CKnZfvGAVIrw](https://mp.weixin.qq.com/s/YNbfDrhVT_CKnZfvGAVIrw) | 打造自己的.NET Core项目模板
dotnet new下面默认的模板 https://github.com/aspnet/Templating
templating的源码 https://github.com/dotnet/templating
template.json的说明 https://github.com/dotnet/templating/wiki/Reference-for-template.json
dotnet cli的文档 https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet?tabs=netcore21

