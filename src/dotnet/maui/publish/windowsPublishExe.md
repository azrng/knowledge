---
title: windows发布exe
lang: zh-CN
date: 2023-07-06
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: windowsfabuexe
slug: pllex88sgo2bg693
docsId: '132369850'
---
修改两项设置就可以做到（在主程序的工程文件csproj），增加如下两个配置（使用该配置后就不再支持anycpu编译，所以我们做一个条件编译）：
```markdown
<!--这个方案可以让你的Maui在Windows下生成的exe做回自己-->
<PropertyGroup Condition="'$(Platform)' != 'AnyCPU' And $(TargetFramework.Contains('-windows'))">
  <!-- Unpack : SelfContainedDeployment for winui3 -->
  <WindowsPackageType>None</WindowsPackageType>
  <WindowsAppSDKSelfContained>true</WindowsAppSDKSelfContained>
</PropertyGroup>
```
