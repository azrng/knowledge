---
title: Linux安装Docker
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: linuxanzhuangdocker
slug: hqgpgb
docsId: '29454315'
---

## 官方快速脚本安装

在终端中执行下方命令安装 docker

```shell
wget -qO- https://get.docker.com/ | sh
```

如果当前用户非root用户，执行以下命令将用户加入`docker`用户组

```shell
sudo usermod -aG docker your-user
```

最后我们在 docker 容器中运行下 `hello world` 看一下是否安装成功：

```shell
sudo docker container run hello-world
```

可以看到出现了 hello world，也就是说明我们已经安装 docker 成功。

## Centos安装Docker

### 安装条件

在centos 7安装docker要求系统64位，系统内核版本3.10以上，可以使用命令查看
```bash
uname -r
```
> **注意**：要不就是开放指定的端口，要不直接就在安装之前将服务器防火墙关闭


### 卸载旧版本
老版本的docker被称为docker或者docker-engine，如果安装就需要卸载它们以及相关的依赖项：
命令：
```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate\
                  docker-logrotate \
                  docker-engine
```
> 新版本的名称被称为docker-ce


### 安装方法
安装方法有两种：
1.从docker存储库中拉取进行安装，以简化安装和升级任务。推荐。
2.下载RPM软件包并手动安装，并完全手动管理升级。
这边只描述使用存储库进行安装
安装yum-utils

```shell
sudo yum install -y yum-utils
```
设置存储库
```shell
## docker官方仓库
sudo yum-config-manager  --add-repo https://download.docker.com/linux/centos/docker-ce.repo

## 使用阿里云docker仓库
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```
安装最新版本docker engine和容器
```shell
sudo yum install -y docker-ce docker-ce-cli containerd.io
```
此命令会安装 Docker，但不会启动 Docker。它还会创建一个 docker组，但是，默认情况下它不会向该组添加任何用户。
```csharp
## 启动docker
sudo systemctl start docker
```
配合docker镜像加速器,不过貌似如何使用阿里云docker仓库好像不需要配置网速都不差。
```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["加速器url"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```
查询docker版本
```bash
docker --version
```
常用命令
```bash
## 重启docker
sudo systemctl restart  docker 
## 查看docker服务状态
sudo systemctl status docker
## 将docker服务设置为开机启动
sudo systemctl enable docker
## 查看docker版本信息
docker --version
```

### 卸载
卸载docker包
```bash
sudo yum remove docker-ce docker-ce-cli containerd.io
```
主机上docker一些容器，卷或自定义配置文件不会自动删除，可以使用命令删除：
```bash
 sudo rm -rf /var/lib/docker
 sudo rm -rf /var/lib/containerd
```

检测docker是否可以正常运行（运行hello-word镜像，如果本机没有，系统会自动去拉取）
命令：sudo docker run hello-world
然后出来 Hello from Docker就说明成功了

### 错误
执行安装出错
```csharp
sudo yum install -y docker-ce docker-ce-cli containerd.io
```
![image.png](/common/1631381660834-2f21de05-73ed-46ab-957b-b05230265697.png)
 解决方案
```csharp
curl https://packages.microsoft.com/config/rhel/7/prod.repo > ./microsoft-prod.repo
sudo cp ./microsoft-prod.repo /etc/yum.repos.d/
yum update -y
```

## Centos一键安装脚本
新建sh后缀名文件，将下面代码复制进去，然后执行
```shell
#***************
#1. 安装Docker
#设置yum源
sudo yum -y install yum-utils
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
#yum包更新到最新
sudo yum update -y

#安装Docker最新版
sudo yum install docker-ce -y
#设置Docker自启动
sudo systemctl enable  docker
#启动Docker
sudo systemctl start docker

#配置国内镜像 /etc/docker/daemon.json
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://i9it9b0k.mirror.aliyuncs.com"]
}
EOF
#加载配置文件,ReStart
sudo systemctl daemon-reload
sudo systemctl restart docker

#安装docker-compose,最新版本需要手动查询一下
sudo curl -L https://get.daocloud.io/docker/compose/releases/download/1.25.5/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

#*******************************
#2. 其它一些工具的安装
#安装rz和sz命令
sudo yum -y install lrzsz
```

## Ubuntu安装Docker

:::tip

下面的步骤在Ubuntu 22.04.2 LTS上测试使用的

:::

### 更新Ubuntu

在服务器中依次运行下面的命令

```shell
sudo apt update
sudo apt upgrade
sudo apt full-upgrade
```

### 添加docker库

首先，安装必要的证书并允许 apt 包管理器使用以下命令通过 HTTPS 使用存储库：

```shell
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
```

然后，运行下列命令添加 Docker 的官方 GPG 密钥：

```shell
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 国内源
sudo curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

添加 Docker 官方库：

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 国内源
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

使用命令更新 Ubuntu 源列表：

```shell
sudo apt update
```

### 安装 Docker

最后，运行下列命令在 服务器中安装最新 Docker CE或者安装其他版本

::: code-tabs#shell

@tab 最新版本

```
sudo apt install docker-ce docker-ce-cli containerd.io
```

@tab 其他版本

```
# 如果要安装其他版本的，可以使用下面的方法，运行下列命令检查可以安装的 Docker 版本
apt-cache madison docker-ce

# 可以挑选上面列表中的任何版本进行安装。例如，安装 5:20.10.16~ 3-0 ~ubuntu-jammy 这个版本，运行：
sudo apt install docker-ce=5:20.10.16~3-0~ubuntu-jammy docker-ce-cli=5:20.10.16~3-0~ubuntu-jammy containerd.io
```

:::

安装完成后，运行下面命令验证docker服务是否在运行

```shell
systemctl status docker

systemctl start docker

# 查看是否安装成功
docker --version
```

![image-20230929192518612](/common/image-20230929192518612.png)

出现上面图片的内容就是安装成功且在运行着了。

### 验证安装

通过运行 `hello-world` 镜像来验证 Docker 是否正确安装：

```sh
sudo docker run hello-world
```

### 常用脚本

```shell
# 启动docker
sudo systemctl start docker

# 重启docker
sudo systemctl restart  docker 

# 查看docker服务状态
sudo systemctl status docker

# 将docker服务设置为开机启动
sudo systemctl enable docker

# 查看docker版本信息
docker --version
```

## 资料

官方教程：[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)
离线安装模式：[https://www.cnblogs.com/kingsonfu/p/11576797.html](https://www.cnblogs.com/kingsonfu/p/11576797.html)

ubuntu安装docker：[https://docs.docker.com/engine/install/ubuntu/#set-up-the-repository](https://docs.docker.com/engine/install/ubuntu/#set-up-the-repository)

ubuntu安装教程参考地址：https://www.51cto.com/article/715086.html
