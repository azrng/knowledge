---
title: 磁盘清理
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 005
category:
    - Windows
tag:
    - 无
filename: cipanqingli
---

## 如何清理
①键盘按下Win+R，唤起运行窗口；<br />②输入%temp%按回车；<br />③Ctrl+A全选后删除即可。

## C盘可以删除的文件
①C:\Documents and settings\用户名\Local settings\temp\下的所有文件（用户临时文件）；<br />②C:\Documents and setting\用户名\cookies\所有文件（保留index)；<br />③C:\Documents and settings\用户名\Local settings\temporary internet Files\下所有文件（页面文件）；<br />④C:\Documents and settings\用户名\Local settings\Histoy\下的所有文件（历史记录）；<br />⑤C:\Documents and settings\用户名\Recent\下的所有文件（最近浏览文件的快捷方式）；<br />⑥C:\WINDOWS\Temp\下的所有文件（临时文件）；<br />⑦C:\WINDOWS\ServicePackFiles\ 下的所有文件（升级后的备份文件）；<br />⑧C:\WINDOWS\SoftWareDistribution\download\ 下的文件；<br />⑨C:\WINDOWS\System32\dllcache\下dll文档，这是备用的dll文档，只要你已拷贝了安装文件也可以删；<br />⑩C:\WINDOWS\driver cache\i386\下的（硬件的备份文件）。

## 不可以删除的文件
**inetpub文件夹**<br />inetpub是IIS服务端的一个文件夹。IIS为互联网信息服务（英文全称Internet Information Services）是由微软公司提供的基于运行Microsoft Windows的互联网基本服务。<br />**Intel文件夹**<br />安装了Intel芯片组驱动留下来的log类文件夹，主要是给安装者提供一些信息：安装了哪些驱动，是否安装成功等等。<br />**PerfLogs文件夹**<br />PerLogs是系统自动生成的文件夹。其中包含了系统的日志信息。日志信号包括磁盘扫描记录、程序错误信息、程序相应报告等。prefolgs可以删除，但是删除后在下一次系统启动时依旧会被系统重新建立，同时删除后会降低系统运行速度。<br />**Program Files文件夹**<br />应用程序文件夹，一般软件默认都安装在这里，也有一些系统自带的应用程序。是系统中64位软件的安装目录。<br />**Common files：** 共用程序文件夹，用于同系列不同程序软件共同使用或调用数据。<br />**Internet Explorer :**系统自带的IE浏览器，删除后可能导致部分程序不能正常运行。<br />**online services: **网络服务文件夹，不能删。<br />**Windows相关文件夹**为自带的系统软件文件，不建议删除。<br />另外系统升级过后，会出现**Windows old文件夹**，该文件夹中存储的是上一版本系统文件。不建议删除，因为删除后会影响用户系统回滚的功能。<br />**WinRAR: **一款流行的压缩解压缩软件的第三方软件，非预装软件。<br />**Program Files（x86）文件夹**<br />应用程序文件夹，一般软件默认都安装在这里，也有一些系统自带的应用程序。是系统中32位软件的安装目录。<br />在这些文件夹中，有的文件夹为空<br />有的还会看到如下几种文件夹：<br />**Pagefiles.sys:**虚拟内存页面文件，不建议删除。<br />**Outlook Express文件夹:** Outlook Express 是Windows内置的邮件发端，不能删。

## 资料
[https://mp.weixin.qq.com/s/HraX9JDG37HR-7nOvLOlwg](https://mp.weixin.qq.com/s/HraX9JDG37HR-7nOvLOlwg)
