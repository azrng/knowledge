---
title: Linux安装Docker-Compose
lang: zh-CN
date: 2022-11-26
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: linuxanzhuangcompose
slug: bc19m1
docsId: '29455040'
---


## 说明

**Docker默认安装环境下是不包含Docker Compose工具的，需要单独安装**。Docker Compose工具搭配Docker才有意义，所以安装Docker Compose之前需要安装Docker。以下演示平台为Linux，其他平台请参照文档：https://docs.docker.com/compose/install/

## 下载文件

其实Docker Compose是一个**可执行文件**，直接下载对应文件即可，执行如下命令：

```bash
# 下载Docker Compose文件， 这个地址下载比较慢
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 如果想安装其他版本，只需要上面命令中的1.29.2替换为想要安装的版本号即可，比如当下最新的版本为2.22.0，那么脚本如下（该版本需要加v）
sudo curl -L "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

如下图：

![image-20230929193305755](/common/image-20230929193305755.png)

如果下载慢，也可以直接手动下载文件然后手动上传上去(下载docker-compose-linux-x86_64后将文件上传到/usr/local/bin/ 目录下，重命名为docker-compose)，还可以通过镜像加速的方法去下载

```sh
# 2.22.0代理地址示例
sudo curl -L "https://mirror.ghproxy.com/https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-Linux-x86_64" -o /usr/local/bin/docker-compose

# 实在下载不了了，那么就用该命令下载一个低版本的吧
sudo apt install docker-compose
```

修改文件权限

```shell
sudo chmod +x /usr/local/bin/docker-compose
```

再次执行，查看版本信息

```
sudo docker-compose --version
```

## 授予执行权限

下载下来的文件默认是没有执行权限的，后续需要执行，所以得授予执行权限，执行如下命令即可：

```shell
sudo chmod +x /usr/local/bin/docker-compose
```

看看权限结果分配如下：

![image-20230929202749497](/common/image-20230929202749497.png)

这样docker-compose就安装完啦。



测试是否安装成功

```shell
docker-compose --version
```

返回结果：Docker Compose version v2.22.0

## 卸载

如果需要卸载，直接删除即可，执行如下命令即可：

```shell
sudo rm /usr/local/bin/docker-compose
```
