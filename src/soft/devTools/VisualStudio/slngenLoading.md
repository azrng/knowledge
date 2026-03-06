---
title: 通过Slngen加载指定项目树
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 010
category:
  - Visual Studio
tag:
  - 无
filename: tongguoslngenjiazaizhidingxiangmushu
---

## 前言
当你一个解决方案中项目太多的时候，导致加载等非常慢，所以就可以考虑一次只加载部分项目，那么就使用到了这个slngen，SlnGen 是一个 Visual Studio 解决方案文件生成器，读取一个给定项目的项目引用，按需创建一个 Visual Studio 解决方案。例如，你可以针对一个单元测试项目运行 SlnGen，并呈现一个包含单元测试项目及其所有项目引用的 Visual Studio 解决方案。你也可以针对一个有根的文件夹中的遍历项目运行 SlnGen，打开一个包含你的项目树的那个视图的 Visual Studio 解决方案。

## 操作
安装slngen工具
```csharp
dotnet tool install --global Microsoft.VisualStudio.SlnGen.Tool --add-source https://api.nuget.org/v3/index.json --ignore-failed-sources
```
然后就全局安装了slngen工具，可以在任何地方使用slngen命令了
```csharp
slngen --help
```
为项目中所有需要启动的入口项目安装nuget包
```csharp
<ItemGroup>
  <PackageReference Include="Microsoft.VisualStudio.SlnGen" Version="9.5.2" />
</ItemGroup>
```
然后比如我们有两个Api项目A、B，一个类库C，这个A、B都引用了类库C，这时候我们如果想只加载A的对应的引用项目解决方案，我们就需要这么操作

slngen 是通过驱动 Visual Studio 来生成解决方案的，因此需要在命令行中具备 MSBuild.exe 的路径。所以我们需要使用Developer Command Prompt for VS 2022(**在电脑中搜索该程序，并切换到项目目录下**)来运行slngen命令，比如
```csharp
slngen A/A.csproj
```
通过上面的命令，我们就使用slngen加载了A项目以及对应的引用项目C，并且B项目没有被加载。

## 总结
通过 slngen，我们可以很方便地加载一个项目及其所有的项目引用。这对于我们在 Visual Studio 中打开一个项目树的视图非常有用。可惜 Rider 不行。

## 参考资料
C## 如何部分加载“超大”解决方案中的部分项目：[https://mp.weixin.qq.com/s/GDI0dMLpwe2tkw_FaDhOxg](https://mp.weixin.qq.com/s/GDI0dMLpwe2tkw_FaDhOxg)

