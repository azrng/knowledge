---
title: 守护进程NSSM
lang: zh-CN
date: 2022-12-12
publish: true
author: 加菲的博客
isOriginal: false
category:
 - soft
---

## 1.安装

这里使用的`chocolatey`安装

```plain
choco install nssm
```

![img](/common/blog202212122213221.webp)

## 2.使用

### 2.1 执行命令

```plain
nssm install
```

便会弹出`NSSM service installer`

![img](/common/blog202212122213811.webp)

### 2.2 安装服务

![img](/common/blog202212122213852.webp)

- `Application Path`:`exe`全路径

- - `C:\tools\nginx-1.17.8\nginx.exe`
  - `C:\Program Files\dotnet\dotnet.exe`
  - `C:\Program Files\nodejs\node.exe`

- `Startup directory`:

- - **如果.net core，就是dll的路径**
  - **如果是其他脚本python脚本，或者node.js，则是启动的脚本文件路径**
  - **如果是exe，则是exe的路径**

- `Arguments`:参数

- - **如果是exe，可能没有参数**
  - **如果是.net core,就是发布后的dll**
  - **如果是python或node.js，就是main.py或者index.js**

- `Service name`:`windows`下由`nssm`守护进程，本质就是把`exe`打包成服务，然后由`nssm`管理服务：监控服务中程序的运行状态，程序异常中断后，便自动启动，实现守护进程的功能。
- **Install Service**:安装服务

### 2.3 启动/停止/重启 服务

 服务已经安装好了，还需要我们去启动.

服务管理主要有启动、停止和重启，其命令如下：

- 启动服务：nssm start
- 停止服务：nssm stop
- 重启服务：nssm restart
- 暂停/继续服务`nssm pause <servicename>``nssm continue <servicename>`
- 查看服务状态：`nssm status <servicename>`

当然，也可以使用系统自带的服务管理器操作和使用系统的命令。

### 2.3 卸载服务

服务删除可以使用如下命令之一：

```plain
nssm remove <servicename>
nssm remove <servicename> confirm
```

功能没有大的区别，后面的命令是自动确认的，没有交互界面。

## 3.效果

### nssm守护nginx

![img](/common/blog202212122213322.webp)

![img](/common/blog202212122214428.webp)