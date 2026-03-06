---
title: net创建windows服务
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: netchuangjianwindowsfuwu
slug: gfp4tm
docsId: '29635108'
---
以vs2017为例
![image.png](/common/1609838962303-46369c25-d013-4428-9458-1f99dc08e0ac.png)
 
![image.png](/common/1609838962309-5ba324a1-e654-4818-9ba0-f9e64defef68.png)
Autolog                是否自动写入系统的日志文件
CanHandlePowerEvent    服务时候接受电源事件
CanPauseAndContinue         服务是否接受暂停或继续运行的请求
CanShutdown 服务是否在运行它的计算机关闭时收到通知，以便能够调用 OnShutDown 过程
CanStop                             服务是否接受停止运行的请求
ServiceName                      服务名称
三、如何编辑myService源码
![image.png](/common/1609838962308-99fe951a-7526-41cc-918e-c196d897729f.png)
点击代码视图然后添加代码
默认方法：
![image.png](/common/1609838962305-3b4f70d9-c959-45dc-8829-30014948830b.png)
 
![image.png](/common/1609838962320-48d0a12d-2766-47c7-b18b-f33ec8fb6009.png)
四、安装程序
切换到myService的设计界面，右键选择“添加安装程序”
![image.png](/common/1609838962318-60eadfd9-8bad-40ef-9c0e-5fcded0c14bf.png)
这时候项目中就会添加一个新类ProjectInstaller.cs和两个组件ServiceProcessInstaller 和 ServiceInstaller。
![image.png](/common/1609838962343-68be279e-acbe-473b-af78-699c51571c16.png)
 
![image.png](/common/1609838962339-f90d56bd-af3f-421f-947e-afd749e2e100.png)
然后选择项目右键生成项目，不能通过F5直接运行项目
五、安装卸载服务
选择 VS组件 “Visual Studio命令提示(2010)” 工具，并以“管理员身份运行"（win7、win8系统下）。
**注意:这里必须选择“以管理员身份运行”，否则会报错。**
从命令行运行 Installutil.exe 目录  命令，以项目中的已编译可执行文件所在的目录作为参数，安装服务：
1. 方法 1
因为Installutil.exe程序在 C:\Windows\Microsoft.NET\Framework64\v4.0.30319\目录下，需要通过cmd命令 "cd" 切换目录。
从命令行运行 Installutil.exe /u 目录   命令来卸载服务：
安装服务：
installutil.exe E:\XTestDemo\X_15_WindowsService\bin\Debug\X_15_WindowsService.exe
卸载服务：
installutil.exe /u E:\XTestDemo\X_15_WindowsService\bin\Debug\X_15_WindowsService.exe
1. 方法 2
找到 Installutil.exe 文件，并把它复制到 E:\XTestDemo\X_15_WindowsService\bin\Debug\ 目录
现在 Installutil.exe 程序在 E:\XTestDemo\X_15_WindowsService\bin\Debug\ 目录下，需要通过cmd命令 "cd" 切换目录。
安装服务：
installutil.exe X_15_WindowsService.exe
卸载服务：
installutil.exe X_15_WindowsService.exe
七：查看服务状态
在“计算机管理”中，服务 下可以看到刚刚安装的Service服务（cmd命令：services.msc---本地服务设置）：
![image.jpeg](/common/1609838962316-1403b680-7810-406a-87d9-4cac07c59d52.jpeg)
默认是停止状态。右击，选择“启动”，即可开启服务。
![image.jpeg](/common/1609838962323-f948cbef-4c48-4c8e-a69a-0c21c7bc9cc0.jpeg)
通过“属性”，可以查看到更详细的信息。
![image.jpeg](/common/1609838962344-403b5607-682e-4b95-997a-9c836cb2ed39.jpeg)
 
 
 
 
c#-windows服务创建和运行：[https://www.cnblogs.com/ywkcode/p/11569593.html](https://www.cnblogs.com/ywkcode/p/11569593.html)
