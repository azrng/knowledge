---
title: EditorConfig
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - Visual Studio
tag:
  - 无
filename: editorconfig
---

## 介绍
EditorConfig 是帮助跨多个编辑器和 IDE 的从事同一项目的多个开发人员保持一致性编码风格的一个文本文件。EditorConfig 文件可以设置诸如缩进样式、选项卡宽度、行尾字符以及编码等，而无需考虑使用的编辑器或 IDE。向项目添加 EditorConfig 文件，可以强制对使用该项目的所有人员实施一致的编码风格。EditorConfig 设置优先于全局 Visual Studio 文本编辑器设置。由于这些设置包含在基本代码的文件中，因此能与基本代码一起移动。只要在 EditorConfig 兼容的编辑器中打开代码文件，就能实现文本编辑器设置。有关 EditorConfig 文件的详细信息，请参阅 EditorConfig.org(https://editorconfig.org/) 网站。
> 常见的IDE支持：vs、rider、vscode等


## 操作

### 创建文件

#### 通过VS创建

> 如果是VS2019，那么需要在 Visual Studio 中打开项目或解决方案，点击“帮助” > “关于”，查看您的IDE版本是否是 16.7.1 或更高版本，如果不是请先升级。

向项目或解决方案添加 EditorConfig。
根据要应用 .editorconfig 设置的对象（是解决方案中的所有项目还是其中一个项目），选择项目或解决方案节点。还可在项目或解决方案中选择一个文件夹，向其添加 .editorconfig 文件。
从菜单栏中，选择“项目” > “添加新项”，或按 Ctrl+Shift+A ：
或者在“解决方案资源管理器”中右键单击项目、解决方案或文件夹，选择“添加” > “新建 EditorConfig”：
添加完成后在 .editorconfig 文件中添加 file_header_template 项
![image.png](/common/1610978154039-db4e98f3-2ca8-4ec7-a270-f636215c03d0.png)

```
file_header_template = 添加文件头（add fileheader）示例程序\n Copyright (c) [https://ittranslator.cn/](https://ittranslator.cn/) 
```

.editorconfig 中换行需要使用 Unix 换行符(\n)来插入新行。
将光标置于任意 C## 或 Visual Basic 文件的第一行， 触发“快速操作和重构”菜单，选择“添加文件头”，如图：
![image.png](/common/1610978154043-57356cfb-70fc-4f3b-835f-af93efe9c915.png)

在“修复以下对象中的所有实例:”处可以选择 “文档”、“项目”或“解决方案”

#### 命令行创建

1. 打开命令提示符或终端，然后导航到您的 .NET 项目或解决方案的根目录。
2. 运行以下命令：

```
dotnet new editorconfig
```

这将会在您的项目中创建一个名为 `.editorconfig` 的文件。

> 注意 .editorconfig 文件会应用到当前目录以及所有子目录的所有文件。如果您想要在特定目录中使用不同的编码样式，您可以在该目录中创建一个新的 .editorconfig 文件来覆盖上层目录中的设置。但是，建议仅使用一个 .editorconfig 文件，以避免不必要的混乱。

### 格式化

#### 保存时格式化

1、使用 Visual Studio 打开您的 .NET 项目或解决方案。点击 **工具** > **选项** > **文本编辑器** > **代码清理**。选择 **在保存时格式化代码** 复选框。

![image-20231015172247928](/common/image-20231015172247928.png)

2、点击 **设置代码清理**。您可以选择保存文件时要格式化的代码样式。点击 **确定**。

![image-20231015172345203](/common/image-20231015172345203.png)

3、打开一个 .NET 文件，然后编辑它。当您保存文件时，Visual Studio 将会自动格式化代码。您也可以使用 `Ctrl + K, Ctrl + E` 快捷键来格式化代码。

#### 构建时格式化

打开 `.csproj` 文件，然后添加以下代码：

```
<PropertyGroup>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

当您构建项目时，Visual Studio 将会自动格式化代码。

#### 使用.NET CLI命令

打开命令提示符或终端，然后导航到您的 .NET 项目或解决方案的根目录。运行以下命令：

```
dotnet format
```

这将会格式化您的项目中的所有文件。

以下是一些常用的命令：

- 验证代码格式化，不做任何修改：

```
dotnet format --verify-no-changes
```

- 格式化指定的项目或解决方案：

```
dotnet format ./SampleWebApi/SampleWebApi.sln
```

- 报告详细的格式化信息：

```
dotnet format --verbosity diagnostic
```

您可以找到更多关于 `dotnet format` 命令的信息，请参阅[官方文档](*https://learn.microsoft.com/dotnet/core/tools/dotnet-format)。

#### GitHub Action强制格式化

GitHub Actions 是一个 CI/CD 平台，可以帮助我们自动化软件开发工作流程。您可以使用 GitHub Actions 在创建 Pull Request 时自动格式化代码。这样，您就可以在代码合并到主分支之前发现格式错误。

1、打开您的 .NET 项目或解决方案的 GitHub 存储库。点击 **Actions**。

2、在 **Continuous integration** 下，点击 **.NET** 任务的 **Configure** 按钮。

3、将 workflow 重命名为 `dotnet-format.yml` 或其他您喜欢的名称。

4、将以下代码复制到 `dotnet-format.yml` 文件中：

```yaml
name: .NET format
   
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
   
jobs:
  dotnet-format:
   
    runs-on: ubuntu-latest
   
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
    - name: Restore dependencies
      run: dotnet restore
    - name: Format
      run: dotnet format --verify-no-changes --verbosity diagnostic
```

请根据您的项目修改 `dotnet-version`。还可能需要修改项目或解决方案的文件夹路径。

在这个 YAML 文件中，我们定义了一个名为 `.NET format` 的 workflow。它将会在 `main` 分支上的 push 和 pull request 事件触发。它将会在 Ubuntu 上运行。它将会调用 `dotnet format` 命令来格式化代码。`--verify-no-changes --verbosity diagnostic` 参数将会验证代码格式化，不做任何修改，并报告详细的格式化信息。

5、点击 **Start commit** 按钮，提交修改。

6、创建一个新的 Pull Request。GitHub Actions 将会自动运行 `dotnet format` 命令来格式化代码。如果代码格式化失败，GitHub Actions 将会报告错误。

## 资料
官网资料：[https://docs.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/style-rules/](https://docs.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/style-rules/)

使用 EditorConfig 和 GitHub Actions 强制执行.NET 代码格式化：https://mp.weixin.qq.com/s/M68QurvcyiGQLPztwSKhOQ
