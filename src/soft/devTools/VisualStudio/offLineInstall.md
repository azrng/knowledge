---
title: 离线版本安装教程
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 008
category:
  - Visual Studio
tag:
  - 无
filename: offLineInstall
---

## 命令行创建本地布局
下载所需 Visual Studio 版本的引导程序，并将其复制到要用作本地布局源位置的目录中。 创建布局后，可以使用它安装 Visual Studio。 引导程序是用于创建、更新和执行其他 Visual Stusio 安装操作的可执行文件。 必须建立 Internet 连接才能完成此操作。

### 下载引导程序
| 版本 | 引导程序 |
| --- | --- |
| Visual Studio 2022 Community | [vs_community.exe](https://aka.ms/vs/17/release/vs_community.exe) |
| Visual Studio 2022 Professional | [vs_professional.exe](https://aka.ms/vs/17/release/vs_professional.exe) |
| Visual Studio 2022 Enterprise | [vs_enterprise.exe](https://aka.ms/vs/17/release/vs_enterprise.exe) |
| Visual Studio 2022 生成工具 | [vs_buildtools.exe](https://aka.ms/vs/17/release/vs_buildtools.exe) |


### 创建本地布局
使用管理员权限打开命令提示符，导航到下载引导程序到的目录，并使用 [“使用命令行参数”](https://docs.microsoft.com/zh-cn/visualstudio/install/use-command-line-parameters-to-install-visual-studio?view=vs-2022) 中定义的引导程序参数来安装 Visual Studio 页面以创建本地布局。

对于.Net Web和.Net桌面开发，运行
```csharp
vs_enterprise.exe --layout D:\Download\vs2022\localVSlayout --add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetWeb --includeOptional --lang zh-CN
```
要创建完整的本地布局，需要使用（仅限英语，所有功能）
```csharp
vs_enterprise.exe --layout D:\Download\vs2022\localVSlayoutt --lang en-US
```
> Visual Studio 的完整本地布局至少需要 45 GB 的磁盘空间

### 通过VsConfig文件安装

[使用配置文件初始化布局的内容](https://learn.microsoft.com/zh-cn/visualstudio/install/create-a-network-installation-of-visual-studio?view=vs-2022#use-a-configuration-file-to-initialize-the-contents-of-a-layout)

[导出扩展布局](https://learn.microsoft.com/zh-cn/visualstudio/install/import-export-installation-configurations?view=vs-2022#extensions)

```shell
.\vs_enterprise.exe --layout E:\LocalVs2022 --lang Zh-cn  --config "e:\2022.vsconfig" 
```

## 本地布局安装

从本地布局安装 Visual Studio 时，Visual Studio 安装程序使用文件的本地版本。 但是，如果在安装期间选择不在布局中的组件，Visual Studio 安装程序将尝试从 Internet 下载它们，安装命令
```shell
-- 示例命令
.\vs_enterprise.exe --layout c:\localVSlayout --add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetWeb --includeOptional --lang Zh-cn
```
使用下面命令的话就可以安装并阻止该访问Internet

```shell
-- 示例命令
c:\localVSlayout\vs_enterprise.exe --noWeb --add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetWeb --includeOptional


D:\Download\vs2022\localVSlayoutt\vs_enterprise.exe --noweb --add Microsoft.VisualStudio.Workload.ManagedDesktop --add Microsoft.VisualStudio.Workload.NetWeb --includeOptional
```

如果之前使用的vsconfig进行的下载，那么安装的时候也使用该命令行安装

```shell
-- 在本地布局文件的目录下执行命令
.\vs_enterprise.exe --noweb --config "2022.vsconfig"
```

> 注意：
> 如果使用的是 Visual Studio Community，则必须在安装后的 30 天内登录产品以激活它。 激活需要 Internet 连接。
> 如果你遇到签名无效的错误，则必须[安装更新的证书](https://docs.microsoft.com/zh-cn/visualstudio/install/install-certificates-for-visual-studio-offline?view=vs-2022)。 在本地布局中打开“证书”文件夹。 双击每个证书文件，然后单击完成证书管理器向导。 如果要求输入密码，请将密码留空。


## 资料
官方文档：[https://docs.microsoft.com/zh-cn/visualstudio/install/create-an-offline-installation-of-visual-studio?view=vs-2022](https://docs.microsoft.com/zh-cn/visualstudio/install/create-an-offline-installation-of-visual-studio?view=vs-2022)
