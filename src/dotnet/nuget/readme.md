---
title: 说明
lang: zh-CN
date: 2023-10-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - nuget
filename: readme
slug: sayo55
docsId: '30338157'
---

## 概述
NuGet 是免费、开源的包管理开发工具，专注于在 .NET 应用开发过程中，简单地合并第三方的组件库。

官方文档：https://learn.microsoft.com/zh-cn/nuget/what-is-nuget
Nuget上不错的库、工具、框架集合：https://dotnet.libhunt.com/

## 常用命令
```shell
// 将包更新到最新版本
Update-Package

// 重新安装所有包
Update-Package -reinstall

-- 指定项目重新安装
Update-Package -reinstall -Project ProjectName
```

## 包源

默认的源地址为：[https://api.nuget.org/v3/index.json ](https://api.nuget.org/v3/index.json)   
国内的源：[https://nuget.cdn.azure.cn/v3/index.json ](https://nuget.cdn.azure.cn/v3/index.json)  
华为Nuget源：[https://repo.huaweicloud.com/repository/nuget/v3/index.json](https://repo.huaweicloud.com/repository/nuget/v3/index.json)  
龙芯Nuget源 ：[https://nuget.loongnix.cn/](https://nuget.loongnix.cn/)  

### 将本地文件夹注册为包源

比如你手头有一些Nuget包文件(.nupkg)，你可以在本地磁盘上创建一个合适的文件夹，并将nuget包放入该文件夹中，然后你可以使用cli命令将文件夹设置为引用包源

```shell
dotnet nuget add source C:\Packages\Local -n Local
```

### 更改包存储位置

```shell
# 查询global-packages位置的命令
dotnet nuget locals all --list
```

全局包存储位置是指NuGet在安装包时默认下载并存放所有包的公共目录。通常情况下，这个路径位于用户的个人文件夹中，如 `C:\Users\{UserName}\AppData\Roaming\NuGet`，要将其更改为其他位置（例如，您希望改到 `D:\Program Files\NuGetPackages`），可以按照以下步骤操作：

打开 NuGet.Config 文件（确保使用管理员权限，如果遇到权限问题），在` <configuration>` 根节点下添加以下配置节：

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <packageSources>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
    </packageSources>
    <config>
        <add key="globalPackagesFolder" value="D:\Program Files\NuGetPackages" />
    </config>
</configuration>
```

保存对 NuGet.Config 文件所做的更改，完成以上步骤后，NuGet 将开始使用指定的 `D:\Program Files\NuGetPackages `目录作为全局包存储位置。后续通过 Visual Studio、NuGet 命令行工具或其他支持 NuGet 的开发环境安装的包都将下载到新的路径。

现在针对Http的源链接已经提示警告不安全，如果还想使用那么可以这么配置

```
<add key="synyi" value="http://xxxxx/nuget-group/" allowInsecureConnections="true"  /
```

### 清理包缓存

全局包和缓存文件夹：[https://learn.microsoft.com/zh-cn/nuget/consume-packages/managing-the-global-packages-and-cache-folders](https://learn.microsoft.com/zh-cn/nuget/consume-packages/managing-the-global-packages-and-cache-folders)

```shell
# 查询包的位置
> dotnet nuget locals all --list
http-cache: C:\Users\user.LAPTOP-LBQ8556U\AppData\Local\NuGet\v3-cache
global-packages: D:\Program Files\Microsoft Visual Studio\NuGetPackages # 该地址是我修改后的
temp: C:\Users\user.LAPTOP-LBQ8556U\AppData\Local\Temp\NuGetScratch
plugins-cache: C:\Users\user.LAPTOP-LBQ8556U\AppData\Local\NuGet\plugins-cache
```

可以隔一段时间要清除一下缓存配置：

```shell
# 清理本地所有Nuget缓存
dotnet nuget locals all --clear

# Clear the 3.x+ cache (use either command)
dotnet nuget locals http-cache --clear
nuget locals http-cache -clear

# Clear the 2.x cache (NuGet CLI 3.5 and earlier only)
nuget locals packages-cache -clear

# Clear the global packages folder (use either command)
dotnet nuget locals global-packages --clear
nuget locals global-packages -clear

# Clear the temporary cache (use either command)
dotnet nuget locals temp --clear
nuget locals temp -clear

# Clear the plugins cache (use either command)
dotnet nuget locals plugins-cache --clear
nuget locals plugins-cache -clear

# Clear all caches (use either command)
dotnet nuget locals all --clear
nuget locals all -clear
```

修改缓存包位置：[https://blog.csdn.net/lovestj/article/details/131488645](https://blog.csdn.net/lovestj/article/details/131488645)

## 引用包

### 共享框架
有许多Nuget包默认已经包含在了项目中，这是因为你使用了共享框架。
```csharp
<Project Sdk="Microsoft.NET.Sdk.Web">
```
[文章](https://docs.microsoft.com/zh-cn/aspnet/core/release-notes/aspnetcore-3.0?view=aspnetcore-6.0#use-the-aspnet-core-shared-framework) 如果你类库想使用AspNetCore的东西可以直接引用

```csharp
<ItemGroup>
  <FrameworkReference Include="Microsoft.AspNetCore.App" />
</ItemGroup>
```
文档：[https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/metapackage-app?view=aspnetcore-7.0](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/metapackage-app?view=aspnetcore-7.0)

### 多项目打包将项目引用转为包依赖

```xml
<ItemGroup>
  <!-- 开发时使用 ProjectReference -->
  <ProjectReference Include="..\Core\MyProject.Core.csproj"
                    Condition="'$(IsPackaging)' != 'true'" />

  <!-- 打包时使用 PackageReference -->
  <PackageReference Include="MyProject.Core"
                    Version="$(PackageVersion)"
                    Condition="'$(IsPackaging)' == 'true'" />
</ItemGroup>
```

然后使用命令生成：

```shell
dotnet pack -p:IsPackaging=true
```

## 打包操作

### 配置描述
```csharp
<Version>1.0.0</Version> <!--版本信息-->
<PackageReleaseNotes>版本 2.0.1 更新内容：增加错误信息显示。</PackageReleaseNotes> <!--版本更新内容-->
<Description>描述信息</Description>
<GeneratePackageOnBuild>true</GeneratePackageOnBuild> <!--构建的时候生成包-->
<Title>企业微信推送机器人包</Title>   <!--不会显示到包管理工具，只是提供给开发人员参考-->   
```
* id: 包的唯一标识符。通常与包的名称相对应，用于在安装和引用包时指定。
* version: 包的版本号。推荐使用语义化版本号，例如 1.0.0。
* authors: 包的作者或维护者的姓名或名称。
* owners: 包的所有者或团队的姓名或名称。
* description: 包的详细描述。提供有关包的功能、用途和示例的信息，以便用户了解并决定是否选择该包。
* releaseNotes: 用于指定每个版本的更新说明或发行说明。类似于 `<PackageReleaseNotes>`，提供了关于包的特定版本的改进、新特性和修复的信息。
* tags: 包的标签。用于描述包的特征和功能，以便用户更容易地搜索和筛选包。
* dependencies: 列出了包依赖关系，即该包需要其他 NuGet 包来正常工作。
* projectUrl: 提供了一个指向包的项目主页或相关文档的 URL。
* licenseUrl: 提供了一个指向包的许可证文件或许可证信息的 URL。

### 版本范围

引用包依赖项时，NuGet 支持使用间隔表示法来指定版本范围，汇总如下：

| Notation    | 应用的规则    | 描述                                     |
| ----------- | ------------- | ---------------------------------------- |
| 1.0         | x ≥ 1.0       | 最低版本（包含）                         |
| (1.0,)      | x > 1.0       | 最低版本（独占）                         |
| [1.0]       | x == 1.0      | 精确的版本匹配                           |
| `(,1.0]`    | x ≤ 1.0       | 最高版本（包含）                         |
| (,1.0)      | x < 1.0       | 最高版本（独占）                         |
| [1.0,2.0]   | 1.0 ≤ x ≤ 2.0 | 精确范围（包含）                         |
| (1.0,2.0)   | 1.0 < x < 2.0 | 精确范围（独占）                         |
| `[1.0,2.0)` | 1.0 ≤ x < 2.0 | 混合了最低版本（包含）和最高版本（独占） |
| (1.0)       | 无效          | 无效                                     |

```csharp
<PackageReference Include="Microsoft.EntityFrameworkCore.Relational" Version="[5.0.5,6.0.0)" />
```

### 设置多个目标版本

```csharp
//单个
<TargetFramework>netstandard2.0</TargetFramework>

//多个
<PropertyGroup>
   <TargetFrameworks>netstandard1.4;net40;net45</TargetFrameworks>
</PropertyGroup>

//使用一个范围内的版本
<PackageReference Include="Microsoft.EntityFrameworkCore.Relational" Version="[5.0.5,6.0.0)" />
```
分别对不同的版本引用不同的其他nuget组件
```csharp
<!-- 引用自：netstandard2.1  框架 -->
<ItemGroup Condition="'$(TargetFramework)'=='netstandard2.1'">
  <PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="3.1.9" />
  <PackageReference Include="Microsoft.Extensions.Http" Version="3.1.9" />
  <PackageReference Include="Newtonsoft.Json" Version="12.0.3" />
</ItemGroup>

<!-- 引用自：net5.0  框架 -->
<ItemGroup Condition="'$(TargetFramework)'=='net5.0'">
  <PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="5.0.0" />
  <PackageReference Include="Microsoft.Extensions.Http" Version="5.0.0" />
  <PackageReference Include="Newtonsoft.Json" Version="13.0.1" />
</ItemGroup>
```

### 针对目标框架编译
在库或者应用中，使用预处理器指令编写条件代码，针对各个目标框架进行编译：
```csharp
#if NET40
        Console.WriteLine("Target framework: .NET Framework 4.0");
#elif NET45
        Console.WriteLine("Target framework: .NET Framework 4.5");
#else
        Console.WriteLine("Target framework: .NET Standard 1.4");
#endif

#if !NETSTANDARD2_1 && !NETSTANDARD2_0
xxx
#endif
```
 .NET 目标框架的预处理器符号的完整列表如下：

| **目标框架** | **符号** |
| --- | --- |
| .NET Framework | NETFRAMEWORK, NET48, NET472, NET471, NET47, NET462, NET461, NET46, NET452, NET451, NET45, NET40, NET35, NET20 |
| .NET Standard | NETSTANDARD, NETSTANDARD2_1, NETSTANDARD2_0, NETSTANDARD1_6, NETSTANDARD1_5, NETSTANDARD1_4, NETSTANDARD1_3, NETSTANDARD1_2, NETSTANDARD1_1, NETSTANDARD1_0 |
| .NET 5（和 .NET Core） | NET5_0, NETCOREAPP, NETCOREAPP3_1, NETCOREAPP3_0, NETCOREAPP2_2, NETCOREAPP2_1, NETCOREAPP2_0, NETCOREAPP1_1, NETCOREAPP1_0 |


### 兼容老方法
将方法设置为已过期状态
```csharp
[Obsolete]
```

### 预发行包
为了支持软件的版本生命周期，NuGet 1.6 及更高版本允许分配预发行包，其中的版本号包括语义化版本控制后缀，如 -alpha、-beta 或 -rc。

- -alpha：Alpha 版本，通常用于在制品和试验品
- -beta：Beta 版本，通常指可用于下一计划版本的功能完整的版本，但可能包含已知 bug。
- -rc：候选发布，通常可能为最终（稳定）版本，除非出现重大 bug。
```csharp
<PropertyGroup>
    <PackageVersion>1.0.1-alpha</PackageVersion>
</PropertyGroup>
```

### 语义化版本控制
语义化版本控制规范：[https://semver.org/lang/zh-CN/](https://semver.org/lang/zh-CN/)

有一种称为“语义化版本控制”的行业标准。 语义化版本控制是指如何表达你或其他开发人员向库引入的更改类型。 语义化版本控制的工作原理是确保包具有版本号，并且该版本号划分为以下部分：

- **主版本**。 最左边的数字。 例如 1.0.0 中的 1。 此数字发生更改意味着代码可能出现中断性变更。 可能需要重写部分代码。
- **次要版本**。 中间的数字。 例如 1.2.0 中的 2。 此数字发生更改意味着添加了新功能。 你的代码仍可正常工作。 接受更新通常是安全的。
- **修补程序版本**。 最右边的数字。 例如 1.2.3 中的 3。 此数字发生更改意味着应用了一个更改，修复了代码中应正常工作的内容。 接受更新应是安全的。

下表说明了每个版本类型的版本号如何更改：
使用语义化版本控制

| 类型 | 发生的更改 |
| --- | --- |
| 主版本 | 1.0.0 更改为 2.0.0 |
| 次要版本 | 1.1.1 更改为 1.2.0 |
| 修补程序版本 | 1.0.1 更改为 1.0.2 |

### Aot配置

 打包后可能包更大了，可能AOT 编译增加了额外的代码，在小的nuget包上作用不大，看不出来效果

```xml
<PublishTrimmed>true</PublishTrimmed>
<TrimMode>link</TrimMode>
<EnableTrimAnalyzer>true</EnableTrimAnalyzer>
        
        
<!-- AOT 和 Trimming 相关优化 -->
<PublishTrimmed Condition="'$(TargetFramework)' == 'net8.0' OR '$(TargetFramework)' == 'net9.0'">true</PublishTrimmed>
<TrimMode Condition="'$(TargetFramework)' == 'net8.0' OR '$(TargetFramework)' == 'net9.0'">link</TrimMode>
<EnableTrimAnalyzer Condition="'$(TargetFramework)' == 'net8.0' OR '$(TargetFramework)' == 'net9.0'">true</EnableTrimAnalyzer>
```

### 创建仅源Nuget包

文档：[https://andrewlock.net/creating-source-only-nuget-packages/](https://andrewlock.net/creating-source-only-nuget-packages/)

## 发布程序包

可以通过网页的方式进行上传或者使用命令行的方式进行发布包

### 命令行推送

```shell
// $apikey 替换为你的apikey
dotnet nuget push ./bin/Release/GuiH.ClassLibrary.1.0.0.nupkg -k $apikey -s https://api.nuget.org/v3/index.json --skip-duplicate
```

### 编写 PowerShell 脚本

文件 `push_packages.ps1` 内容编写如下：用于将指定目录中的所有 `.nupkg` 文件推送到指定的 `NuGet` 服务器。

```powershell
# 定义要推送的目录和 NuGet 服务器 URL
$directoryPath = "./output/packages"
$nugetServerUrl = "https://localhost:5000/v3/index.json"
$apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 获取目录中的所有 .nupkg 文件
$nupkgFiles = Get-ChildItem -Path $directoryPath -Filter *.nupkg

# 推送每个 .nupkg 文件到 NuGet 服务器
foreach ($nupkgFile in $nupkgFiles) {
    Write-Host "Pushing $($nupkgFile.FullName) to $nugetServerUrl"
    try {
        dotnet nuget push $nupkgFile.FullName --source $nugetServerUrl  --api-key $apiKey --skip-duplicate
    } catch {
        Write-Host "Failed to push $($nupkgFile.FullName): $_"
    }
}
```

### Bash脚本

文件 `push_packages.bash` 内容编写如下：用于将指定目录中的所有 `.nupkg` 文件推送到指定的 `NuGet` 服务器。

```bash
#!/bin/bash

# 定义要推送的目录和NuGet服务器URL
directory_path="./output/packages"
nuget_server_url="https://localhost:5000/v3/index.json"
api_key="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 获取目录中的所有 .nupkg 文件
nupkg_files=$(find "$directory_path" -type f -name "*.nupkg")

# 推送每个 .nupkg 文件到 NuGet 服务器
for nupkg_file in $nupkg_files; do
    echo "Pushing $nupkg_file to $nuget_server_url"
    if dotnet nuget push "$nupkg_file" --source "$nuget_server_url" --api-key "$api_key" --skip-duplicate; then
        echo "Successfully pushed $nupkg_file"
    else
        echo "Failed to push $nupkg_file"
    fi
done
```

### 开源项目

Jester.Tools.Nuget：[https://github.com/NMSAzulX/Jester.Tools.Nuget](https://github.com/NMSAzulX/Jester.Tools.Nuget)

基于.Net的Nuget包发版工具：[https://mp.weixin.qq.com/s/PVhEsUA8F4yx12fiu8TopQ](https://mp.weixin.qq.com/s/PVhEsUA8F4yx12fiu8TopQ)

## 其他包管理平台

[Paket](https://gitcode.com/fsprojects/Paket/overview)

## Renovate 正则表达式管理器

文档：[https://docs.renovatebot.com/](https://docs.renovatebot.com/)



使用 Renovate 在 .NET 项目中自动更新 NuGet 包版本范围https://dev.to/asimmon/automated-nuget-package-version-range-updates-in-net-projects-using-renovate-15il如果在使用 Renovate 更新 NuGet 包版本时将版本指定为范围，该怎么办。

## 参考文档

官网地址：[https://docs.microsoft.com/zh-cn/nuget/what-is-nuget](https://docs.microsoft.com/zh-cn/nuget/what-is-nuget)
版本与版本后缀以及包版本说明：[https://andrewlock.net/version-vs-versionsuffix-vs-packageversion-what-do-they-all-mean/](https://andrewlock.net/version-vs-versionsuffix-vs-packageversion-what-do-they-all-mean/)

https://medium.com/workleap/preventing-breaking-changes-in-net-class-libraries-e61ae93b1b46 | 防止 .NET 类库中的重大更改
