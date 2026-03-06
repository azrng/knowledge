---
title: 说明
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 002
category:
  - Visual Studio
tag:
  - vs
---

## 个性化

### 字体和大小
字体：Consolas  字号：10 
字体：Cascadia Code 程序员字体

### 背景色修改
修改代码框颜色

工具=》选项=》字体和颜色=》项背景=》自定义

![image.png](/common/1610978071325-ebc6bfc6-ce36-430b-975e-041c87301b9c.png)

### 编码处理

[Visual Studio  默认 UTF-8 编码](https://blog.csdn.net/Mechanicoder/article/details/127812738)

## Nuget

### 修改存储位置

```shell
-- 查询global-packages位置的命令
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

```xml
<add key="synyi" value="http://xxxxx/nuget-group/" allowInsecureConnections="true"  />
```

## 下载地址

[vs 2012旗舰版中文版](http://download.microsoft.com/download/B/0/F/B0F589ED-F1B7-478C-849A-02C8395D0995/VS2012_ULT_chs.iso)

Visual Studio 2012 Ultimate旗舰版序列号： 
YKCW6-BPFPF-BT8C9-7DCTH-QXGWC
RBCXF-CVBGR-382MK-DFHJ4-C69G8 
YQ7PR-QTHDM-HCBCV-9GKGG-TB2TM 



Vs2013
[http://download.microsoft.com/download/9/3/E/93EA27FF-DB02-4822-8771-DCA0238957E9/vs2013.5_ult_chs.iso?type=ISO](http://download.microsoft.com/download/9/3/E/93EA27FF-DB02-4822-8771-DCA0238957E9/vs2013.5_ult_chs.iso?type=ISO)

 

Vs2017 Enterprise:
NJVYC-BMHX2-G77MM-4XJMR-6Q8QF
Vs2017 Professional:
KBJFW-NXHK6-W4WJM-CRMQB-G3CDH

Vs 2019企业版
BF8Y8-GN2QH-T84XB-QVY3B-RC4DF
Visual Studio 2019 Enterprise
BF8Y8-GN2QH-T84XB-QVY3B-RC4DF
Visual Studio 2019 Professional
NYWVH-HT4XC-R2WYW-9Y3CM-X4V3Y

Vs2022激活码：
Pro:
TD244-P4NB7-YQ6XK-Y8MMM-YWV2J
Enterprise:
VHF9H-NXBBB-638P6-6JHCY-88JWH 