---
title: Window服务
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: windowfuwu
slug: sigqp3
docsId: '29635032'
---
一、什么是windows服务？
Microsoft Windows 服务（即，以前的 NT服务）使您能够创建在它们自己的 Windows 会话中可长时间运行的可执行应用程序。这些服务可以在计算机启动时自动启动，可以暂停和重新启动而且不显示任何用户界面。这使服务非常适合在服务器上使用，或任何时候，为了不影响在同一台计算机上工作的其他用户，需要长时间运行功能时使用。还可以在不同于登录用户的特定用户帐户或默认计算机帐户的安全上下文中运行服务。
二、现在新建一个服务叫做MyWinService，如何操作这个服务？
 安装.bat：
 sc create MyWinService binPath= "%~dp0WindowsService.exe" start= auto
 net start MyWinService
 pause
 
 启动.bat
 net start MyWinService
 pause
 
  停止.bat
 net stop MyWinService
  pause
 
 
   卸载.bat
 net stop MyWinService
  sc delete MyWinService binPath= "%~dp0JDWindowsService.exe" start= auto
 pause
 
 
  重启.bat
 net stop MyWinService
 net start MyWinService
  pause
 
