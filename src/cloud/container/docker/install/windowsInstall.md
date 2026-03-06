---
title: windows安装docker
lang: zh-CN
date: 2023-07-02
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: windowsInstall
slug: dnozwd
docsId: '29454321'
---

## 启用Hyper-V
打开控制面板 - 程序和功能 - 启用或关闭Windows功能，勾选Hyper-V，然后点击确定即可，如图：
![image.png](/common/1688295946469-a0a6824d-cd03-4b47-9bac-9ae88eb7c1e5.png)
点击确定后，启用完毕会提示重启系统，我们可以稍后再重启。

## 安装Docker
Docker下载地址为：[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) 点击如图处即可下载安装包：
![image.png](/common/1688295946463-2b451aef-cf4d-48a4-93eb-43b3d73a6829.png)
下载完成后运行安装包，安装完成后界面如图：
![image.png](/common/1688295946463-40d42edd-5748-45fb-9335-acc9cbb768bd.png)
单击Close and log out，这个时候我们重启一次电脑。

## 启动Docker
1.在桌面找到Docker for Windows快捷方式，双击启动即可！启动成功后托盘处会有一个小鲸鱼的图标。可以通过命令行工具输入命令：`docker version`可以查看当前docker版本号，如图：
![image.png](/common/1688295946461-2d78d3bf-3529-4c98-998c-dbf197dbc577.png)
注：在这里可能出现问题，启动docker时发现无法启动，具体报错显示如下：
![image.png](/common/1688295946548-26b04ea9-a49e-4383-824d-65fa15eb8ab3.png)
在控制台输入docker version 显示错误如下
![image.png](/common/1688295947425-c75b7752-84ff-4e8d-9763-1161c209bc1f.png)
解决办法：首先确保Hyper-V已经启用
打开任务管理器，查看性能-CPU-虚拟化已启用
![image-20240217195944517](/cloud/image-20240217195944517.png)
如果没有启动，那么就需要百度去启用虚拟化，如果是启动状态docker还不能启动，可以尝试如下办法：
在控制台输入下面命令

```sh
cd "C:\Program Files\Docker\Docker"
./DockerCli.exe -SwitchDaemon
```
重启docker，docker desktop is running2.更换镜像源地址
中国官方镜像源地址为：[https://registry.docker-cn.com](https://registry.docker-cn.com)
点击托盘处docker图标右键选择-Settings，然后修改如下：
![image.png](/common/1688295947783-d80bedf6-ebb3-4bc9-94e7-d680bfd89e86.png)
点击Apply后会重启Docker。
3.载入测试镜像测试
输入命名“docker run hello-world”可以加载测试镜像来测试。如图：
![image.png](/common/1688295947990-89c1310b-4b0b-4900-be7b-94c94a74df9d.png)
这样即表示安装成功了！

## 安装路径修改
安装后docker默认是安装在C盘下的：C:\Program Files\Docker，默认配置到此就安装好了。下面将安装目录修改为D盘：D:\Docker

### 方法一
使用管理员身份打开命令提示符界面
输入：
```bash
mklink /j "C:\Program Files\Docker" "D:\Docker"
```

### 方法二
将C盘下docker安装文件复制到你想的磁盘分区
接着打开注册表
搜索com.docker.service然后修改imagepath为你想移动的目录
![image.png](/common/1609560066384-3de524a0-156a-47ff-b2b6-8b7ad0cacf02.png)
然后修改系统环境变量为：
![image.png](/common/1609560066391-06e40e32-4c11-4334-a2e7-070726cf55b6.png)
最下面那个不动

## 资料

docker desktop位置修改：https://www.cnblogs.com/lrain/p/17263449.html

