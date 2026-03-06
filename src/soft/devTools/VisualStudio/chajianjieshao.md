---
title: 插件推荐
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 005
category:
  - VisualStudio
tag:
  - 插件
filename: chajianjieshao
---

## 主题

### Visual Studio Theme Pack

Visual Studio流行主题集

https://marketplace.visualstudio.com/items?itemName=idex.vsthemepack

### Dracula Official

插件地址：https://marketplace.visualstudio.com/items?itemName=dracula-theme.dracula 

### GodotTheme

样式如图

![image-20230817103341233](/common/image-20230817103341233.png)

插件地址：https://marketplace.visualstudio.com/items?itemName=TrentLathim.GodotTheme

### One Monokai VS Theme

样式如图

![img](/common/fa701de3-c594-4dcb-b4d1-de9a0c4a7a70.png)

插件地址：https://marketplace.visualstudio.com/items?itemName=azemoh.onemonokai

### Viasfora

旨在提供更好的代码编辑体验，包括语法高亮、括号匹配、代码折叠等功能，同时支持多种编程语言。

https://marketplace.visualstudio.com/items?itemName=TomasRestrepo.Viasfora

## 字体

### Force UTF-8 (No BOM) 2022

在Vs2022强制No BOM UTF-8

## 工具

### ReSharper(付费)

ReSharper 是一个用于 Visual Studio 的强大插件，它为.NET开发者提供了许多功能，以提高编码效率、代码质量和开发体验。旨在帮助.NET开发者编写高质量、高效的代码，并提供了许多辅助工具来改进开发流程和减少常见的编码错误。（注意电脑内存小的同学慎用，比较占用内存）

https://marketplace.visualstudio.com/items?itemName=JetBrains.ReSharper

### CodeRush

CodeRush是用于Visual Studio 2022的功能强大且快速的代码创建、调试、导航、重构、分析和可视化工具（对标ReSharper ）

https://marketplace.visualstudio.com/items?itemName=DevExpress.CodeRushforVS2022

视频教程：https://www.youtube.com/playlist?list=PL8h4jt35t1wgawacCN9wmxq1EN36CNUGk

文字教程：https://docs.devexpress.com/CodeRushForRoslyn/115802/coderush

#### 资料

```
Documentation:
https://docs.devexpress.com/CodeRushForRoslyn/115361/getting-started

Getting Started Video:
https://www.youtube.com/watch?v=3o26HaNdxqk

CodeRush Feature of the Week Series:
https://www.youtube.com/watch?v=_B8AS39mtKw&list=PL8h4jt35t1wgawacCN9wmxq1EN36CNUGk

Shortcut Overview:
https://community.devexpress.com/blogs/markmiller/CodeRushShortcutCheatSheet/CodeRush%20Shortcuts%20Templates%20CheatSheet%20-%20v4.pdf
```

### CodeMaid

CodeMaid是一个开源的Visual Studio扩展，用于清理和简化我们的C#，C++，F#，VB，PHP，PowerShell，R，JSON，XAML，XML，ASP，HTML，CSS，LESS，SCSS，JavaScript和TypeScript编码。

插件地址：

https://marketplace.visualstudio.com/items?itemName=SteveCadwallader.CodeMaidVS2022

### CSharpier

CSharpier 是一个c# 代码格式化程序。它使用 Roslyn 来解析您的代码并使用自己的规则重新格式化它，使其符合 CSharpier 的代码风格(该风格几乎不能自定义)

官网：[https://csharpier.com/](https://csharpier.com/)

插件地址：https://marketplace.visualstudio.com/items?itemName=csharpier.CSharpier

#### 基础设置

默认是通过快捷键ctrl+k，ctrl+y

![image-20230901225132729](/common/image-20230901225132729.png)

也可以在工具选项中找到CSharpier，然后设置格式化时机，比如在全局中设置保存文件(ctrl+s)的时候自动格式化

#### 配置文件

在项目根目录存放如下的配置文件：.csharpierrc

```json
{
    "printWidth": 120,
    "useTabs": false,
    "tabWidth": 4,
    "preprocessorSymbolSets": ["", "DEBUG", "DEBUG,CODE_STYLE"]
}
```

:::tip

- `"printWidth": 120`：配置了文本输出的最大宽度为 120 个字符。当代码行的长度超过该值时，会在适当的位置换行。
- `"useTabs": false`：配置是否使用制表符（Tab）来缩进代码。设置为 `false` 表示使用空格进行缩进。
- `"tabWidth": 4`：配置缩进的宽度。设置为 4 表示每个缩进级别使用 4 个空格进行缩进。
- `"preprocessorSymbolSets": ["", "DEBUG", "DEBUG,CODE_STYLE"]`：配置了预处理器符号集合。这个选项可能用于编译过程中进行条件编译，根据不同的符号集合来选择性地包含或排除某些代码块。示例中包含了三个不同的预处理器符号集合，分别为空、"DEBUG" 和 "DEBUG,CODE_STYLE"。

:::

#### 命令行

使用 dotnet CLI：在项目文件夹中打开终端，并执行 `dotnet add package CSharpier` 命令来安装 CSharpier

* 格式化单个文件：在命令行中执行 `csharpier <文件路径>` 命令，将 `<文件路径>` 替换为要格式化的 C# 文件的路径。CSharpier 将会格式化该文件，并在原文件的基础上进行修改。

* 格式化整个项目：在命令行中执行 `csharpier --folder <项目路径>` 命令，将 `<项目路径>` 替换为要格式化的项目的路径。CSharpier 将会遍历项目目录下的所有 C# 文件，并对其进行格式化。

### Roslynator
由Roslyn提供支持的 500 多个 C## 分析器、重构和修复程序的集合。

插件地址：

https://marketplace.visualstudio.com/items?itemName=josefpihrt.Roslynator2022

docs：https://josefpihrt.github.io/docs/roslynator/

### SonarLint
SonarLint 可帮助您检测和修复 IDE 中的错误、代码气味和安全漏洞

插件地址：

https://marketplace.visualstudio.com/items?itemName=SonarSource.SonarLintforVisualStudio2022

### Codist

致力于为 C# 程序员提供更佳的编码体验和效率的 Visual Studio 扩展，增强了语法高亮、快速信息（工具提示）、导航栏、滚动条、显示质量，并带来了自动更新的版本号、智能工具栏与高级编辑、代码分析和重构命令等。

https://marketplace.visualstudio.com/items?itemName=wmj.Codist

### Supercharger 2022

自动图文集，代码映射，代码链接，主题标签，智能代码流线，代码突出显示器，富代码，魔术注释，措辞审查，便利贴，解决方案资源管理器亮点，拼写员，超级查找，统计等。

https://marketplace.visualstudio.com/items?itemName=MichaelKissBG8.Supercharger22

### Visual Assist

适用于 C/C++ 和 C# 的生产力工具，改进了与导航、重构、代码生成和编码辅助相关的 IDE 功能，以及 UE4 的特定工具。

https://marketplace.visualstudio.com/items?itemName=WholeTomatoSoftware.VisualAssist

### Indent Guides

:::tip

在比较新的VS中已经自带了代码缩进线

:::

显示代码缩进线，有助于保持代码的结构清晰。页宽标记有三种样式：实线、点线面和虚线，有粗细之分，颜色也可自定义。默认为灰色虚线，如图所示。每个缩进级别可以有不同的样式和颜色。

https://marketplace.visualstudio.com/items?itemName=SteveDowerMSFT.IndentGuides2022

### Live Share

它的主要功能是支持实时协作开发，并让开发人员能够在他们最喜欢的开发工具中进行协作。

https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsls-vs

### EditorConfig

.editorconfig 文件的语言服务。 EditorConfig 可帮助开发人员定义和维护不同编辑器和 IDE 之间的一致编码样式。

支持：2017、2019

https://marketplace.visualstudio.com/items?itemName=MadsKristensen.EditorConfig

### NuGetSolver

NuGetSolver是微软最新推出的一款实验性 Visual Studio 扩展插件，它具备自动检测NuGet依赖包冲突的功能，并能根据不同级别的冲突给出相应的提示。比如在VS2022中，NuGetSolver能够针对NU1605、NU1701、NU1107和NU1202等警告或错误提供智能化提示，让开发者能够更高效地解决依赖冲突问题。

详情：[https://mp.weixin.qq.com/s/KESdfIkvz2F92Un6uc-0tg](https://mp.weixin.qq.com/s/KESdfIkvz2F92Un6uc-0tg)

### MSBuild Editor

https://mp.weixin.qq.com/s/KND5j1OPAq-u5Axhm3v2Cw | 【译】新的 MSBuild 编辑体验

## AI辅助

### GitHub Copilot(付费)

GitHub Copilot 是一个 AI 对程序员，可帮助您更快地编写代码，减少工作量。需要 Visual Studio 2022 17.5.5 或更高版本。

https://marketplace.visualstudio.com/items?itemName=GitHub.copilotvs

### Codeium

Codeium：免费的 AI 驱动的代码加速工具包

https://marketplace.visualstudio.com/items?itemName=Codeium.CodeiumVS

### CCodeAI

AI辅助问答

https://marketplace.visualstudio.com/items?itemName=TimChen44.CCodeAI

### Fitten Code

https://code.fittentech.com/tutor_vs_zh

### 通义灵码

https://tongyi.aliyun.com/lingma

## 数据库

### EF Core Power Tools

其作用是增强Entity Framework Core（EF Core）的开发体验,旨在简化Entity Framework Core应用程序的开发和维护过程，提供可视化工具和分析功能，以加速数据库相关任务的完成

https://marketplace.visualstudio.com/items?itemName=ErikEJ.EFCorePowerTools

### SQL Search

加速SQL Server数据库开发，通过在Visual Studio中快速查找SQL对象。可快速搜索数据库中的SQL片段，并轻松导航到这些对象。这可以节省时间，提高团队的生产力，让您可以回到手头的任务

https://marketplace.visualstudio.com/items?itemName=vs-publisher-306627.RedgateSQLSearch

