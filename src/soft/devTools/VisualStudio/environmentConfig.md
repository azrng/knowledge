---
title: 环境配置
lang: zh-CN
date: 2022-12-12
publish: true
author: azrng
isOriginal: false
category:
 - VisualStudio
 - 环境
 - soft
---

## Server2012r2安装net4.6.1

下载好net 4.6后提示需要安装对应的KB2919355 更新后才可以继续安装

所以我们现在开始下载更新包：https://www.microsoft.com/zh-CN/download/details.aspx?id=42334

 

下载时候要选择中文，要看安装说明

1. 1. 若要开始下载，请单击“下载”按钮，然后执行以下操作之一，或者从“更改语言”中选择另一种语言，然后单击“更改”。

- - 单击“运行”立即开始安装。
  - 单击“保存”将下载文件复制到您的计算机上供以后安装。

1. 1. 这些 KB       必须按以下顺序安装：clearcompressionflag.exe、KB2919355、KB2932046、KB2959977、KB2937592、KB2938439、KB2934018。
   2. KB2919442 是 Windows Server 2012 R2       更新的先决条件，在尝试安装 KB2919355 之前应先安装 clearcompressionflag.exe

 

安装上那些需要先安装KB2919442  ，KB2919442 是 Windows Server 2012 R2 更新的先决条件，下载地址：[此处](https://www.microsoft.com/zh-cn/download/details.aspx?id=42162)

https://www.microsoft.com/zh-cn/download/details.aspx?id=42162

然后下载下然后安装规定的顺序安装后重启电脑，就可以安装4.6.1了

##  Server2012安装 VC2015

普通的windows server 2012因为没有更新的问题，所以导致部署不了netcore项目（装不了2015 Redistributable），所以需要安装以下补丁才可以。

下载链接

http://www.microsoft.com/en-us/download/details.aspx?id=48145

安装如下：

![img](/common/blog202212122219718.png)

错误日志：Windows8.1-KB2999226-x64.msu 安装失败

![img](/common/blog202212122219602.png)

我们找到这个文件夹，手动安装一下看看效果，如下：

![img](/common/blog202212122219444.png)

解决方案如下：

先安装补丁 KB2919442 [立即下载基于 x64 的 Windows Server 2012 R2 的KB2919442补丁](https://www.microsoft.com/zh-cn/download/details.aspx?id=42153)。

下载地址 https://www.microsoft.com/zh-cn/download/details.aspx?id=42153

KB2919442  安装完成后，继续安装 Windows Server 2012 R2 Update (KB2919355) 所有补丁，如下

下载地址  [立即下载基于 x64 的 Windows Server 2012 R2 更新软件包。](http://www.microsoft.com/downloads/details.aspx?FamilyId=373b1bb0-6d55-462e-98b7-6cb7d9ef1448)

![img](/common/blog202212122219664.png)

![img](/common/blog202212122219237.png)

注意:必须按以下顺序安装更新: 

clearcompressionflag.exe　　　　　　　　　　　　38 KB　　　　　　管理员身份运行，没有界面，后台运

Windows8.1-KB2919355-x64.msu 　　　　　　　690.8 MB　　　　　安装完成后，需要重起，这个安装过程根据你的硬件配置和网络决定安装速度。

Windows8.1-KB2932046-x64.msu 　　　　　　　48.0 MB

Windows8.1-KB2934018-x64.msu 　　　　　　　126.4 MB

Windows8.1-KB2937592-x64.msu 　　　　　　　303 KB

Windows8.1-KB2938439-x64.msu 　　　　　　　19.6 MB

Windows8.1-KB2959977-x64.msu 　　　　　　  2.8 MB

 所有更新包安装完成后，接下来我们继续安装  Microsoft Visual C++ 2015 Redistributable (x64) - 14.0.23026

下载链接

http://www.microsoft.com/en-us/download/details.aspx?id=48145

 如图：

![img](/common/blog202212122219391.png)

 

![img](/common/blog202212122220741.png)

 

![img](/common/blog202212122220673.png)

 

 结束 