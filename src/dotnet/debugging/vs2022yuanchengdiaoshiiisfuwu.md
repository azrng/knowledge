---
title: VS2022远程调试IIS服务
lang: zh-CN
date: 2023-07-01
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: vs2022yuanchengdiaoshiiisfuwu
slug: lq2nxbqbtl74d5ni
docsId: '120554590'
---

## 概述
当有些情况，测试环境又bug，但是本地有不好复现或者没法复现的时候，这时候就需要用到远程调试了，通过在测试环境上安装一个调试工具，然后就可以在本地运行代码来远程连接到测试服务器来调试代码。
> 当前项目是一个老项目，部署在IIS中


## 准备
首先我们需要先准备工具，可以直接去官网进行下载安装
![image.png](/common/1680529071192-18572334-1f94-40d0-ab3c-8fec3dc7a612.png)
下载地址：[https://visualstudio.microsoft.com/zh-hans/downloads/?rr=https://docs.microsoft.com/en-us/visualstudio/debugger/remote-debugging?view=vs-2022](https://visualstudio.microsoft.com/zh-hans/downloads/?rr=https://docs.microsoft.com/en-us/visualstudio/debugger/remote-debugging?view=vs-2022)

或者如果直接将vs安装路径的Remote Debugger拷贝到指定的服务器上进行运行，比如我从本地的VS路径安装路径中找到为：
![image.png](/common/1680529233839-28db5072-be6d-4564-a8ac-94dc37df3fb6.png)
地址：D:\Program Files\VS\2022\Enterprise\Common7\IDE\Remote Debugger

## 操作

### 运行调试工具
我是直接拷贝的VS安装路径的Remote Debugger到服务器，所以我直接找到该文件夹x64下的msvsmon.exe文件进行启动，启动并连接的效果如下
![image.png](/common/1680529476692-17f56e3e-b366-453d-8e28-9759616b41b8.png)
我们可以在Tools=>Options中设置远程端口以及认证模式等，因为我只是内网的测试环境，所以直接设置为允许任何人连接，并且端口为4026
![image.png](/common/1680529562579-7377fc1f-69c1-4e07-9191-35d198c83a41.png)
点击OK，那么远程调试工具就配置好了。
> 注意：因为我们要让其他机器连接当前服务器，所以需要开放端口或者关闭服务器的防火墙等。


### 发布代码
因为调试的代码只支持Debug模式的代码，所以需要将我们的代码重新发布一下，然后拷贝发布的文件到服务器重新部署。
> 注意：当本地的代码和测试环境代码有差异的时候，也不会命中我们在本地VS代码加的断点。


### VS调试
使用VS2022打开我们的代码，然后选择调试=>附加到进程
![image.png](/common/1680529925561-b22f2a66-ee8a-4ae2-bf17-990488020b14.png)
点击附加进程，然后连接类型选择远程(无身份验证)，然后再连接目标输入远程服务器的IP+远程调试工具设置的端口，然后直接回车就会出来可附加的进程列表
![image.png](/common/1680530005672-070c7860-d1a7-4c8e-9f32-dae9b703a911.png)

另外这里的连接类型还支持其他的，比如
![image.png](/common/1680530107544-832efb45-1a4e-492a-890f-79b7c46966a1.png)
可以根据实际情况选择

出来进程列表后，如果内容多可以在右侧进行搜索，然后选择指定的进程，如果是IIS服务然后没看到，可以再次访问一下系统，然后就可以看到了
![image.png](/common/1680530225663-4e032712-7f63-4cca-bc85-19ea5719b1f0.png)
找到要附加的进程，然后选中点击附加，如图
![image.png](/common/1680530283150-8b313557-aa19-4ecb-b8d0-f8da5e0e65b3.png)
点击附加后就可以在代码中设置断点，然后在页面触发后进入断点进行调试了。

## 总结
通过该方案在有些情况下还是很方便找到问题的，如果没有进到断点就需要检查下是否是Debug版本或者代码和服务器版本是否存在差异等。

## 资料
远程调试IIS上的ASP.NET Core：[https://learn.microsoft.com/zh-cn/visualstudio/debugger/remote-debugging-aspnet-on-a-remote-iis-computer?view=vs-2022](https://learn.microsoft.com/zh-cn/visualstudio/debugger/remote-debugging-aspnet-on-a-remote-iis-computer?view=vs-2022)
远程调试IIS上的ASP.NET：[https://learn.microsoft.com/zh-cn/visualstudio/debugger/remote-debugging-aspnet-on-a-remote-iis-7-5-computer?view=vs-2022](https://learn.microsoft.com/zh-cn/visualstudio/debugger/remote-debugging-aspnet-on-a-remote-iis-7-5-computer?view=vs-2022)
[https://mp.weixin.qq.com/s/eN2_6clqnhrZq1DY3Wpz6w](https://mp.weixin.qq.com/s/eN2_6clqnhrZq1DY3Wpz6w) | VS 2022调试技巧：远程调试、线程检查、性能检查
