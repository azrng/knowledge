---
title: VS简单插件创建
lang: zh-CN
date: 2023-04-28
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: vschajian
slug: mh3om8
docsId: '66672286'
---

## 目的
创建简易Vsix安装包提高生产效率。

## 操作

### 创建扩展项目
新建一个项目，选择扩展项目(VSIX Project)，选择c#开发

### 创建模板项目
新建一个项目，选择 c# Item Template。
点击class.cs，增加如下代码，里面有定义好的宏。
```csharp

/*----------------------------------------------------------------
 Copyright (C) 2021 webmote 版权所有

 创建者：$username$
 创建时间：$time$
 文件：$itemname$.cs
 功能描述：

----------------------------------------------------------------*/
namespace $rootnamespace$
{
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


    /// <summary>
    /// $safeitemname$接口输入参数
    /// </summary>
    public class $safeitemname$Args 
    {

    }

    /// <summary>
    /// $safeitemname$接口输出参数
    /// </summary>
    public class $safeitemname$Result 
    {

    }
}
```
好了，一次建立，接口的入参和出参类都写好了， 我们只需要写内容即可。
双击 扩展名`.vstemplate`的文件，配置 菜单项名称，如下：
```csharp

...
 <TemplateData>
    <Name>WebApi参数类</Name>
    <Description>WebApiTemplate</Description>
    ...
```

### 配置VSIX包
回到第一个项目，我们引用Item template项目，然后找到文件为“`source.extension.vsixmanifest`”的文件
![](/common/1644850042765-46f0b917-e141-46a3-88f4-d3231bb57b49.webp)
vsix内的资产就是我们的模板项目，增加到里面。
![](/common/1644850053441-75060cf8-e19b-4e80-a08c-9a000c0471b1.webp)
OK，build，发包。

### 安装
在bin目录找到 “`VSIXProject1.vsix`” 安装。
安装的时候需要退出软件

### 使用
我们在DTO目录建立接口 RegisterUser的入参和出参，只需要找到我们自定义名字。
建立效果如下：
```csharp

/*----------------------------------------------------------------
Copyright (C) 2021 webmote 版权所有

创建者：admin
创建时间：2021/4/7 16:45:11
文件：RegisterUser.cs
功能描述：

----------------------------------------------------------------*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Service.DTO.User
{
   /// <summary>
   /// RegisterUser接口输入参数
   /// </summary>
   public class RegisterUserArgs
   {

   }

   /// <summary>
   /// RegisterUser接口输出参数
   /// </summary>
   public class RegisterUserResult
   {

   }
}

```

## 资料
生产力提升！ 自己动手自定义Visual Studio 2019的 类创建模板，制作简易版Vsix安装包 
 <!-- https://mp.weixin.qq.com/s/6Mikl0tbW5vJhIP_LSvk4Q -->
