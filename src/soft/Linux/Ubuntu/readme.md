---
title: 概述
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - Linux
tag:
  - 无
filename: gaishu
---

## 概述
一个linux操作系统发行版

## 镜像源
镜像源：[https://mirrors.tuna.tsinghua.edu.cn/ubuntu/](https://mirrors.tuna.tsinghua.edu.cn/ubuntu/)

阿里云镜像源：http://mirrors.aliyun.com/ubuntu/

## 操作命令

### 系统命令
```shell
//查询发行版本号
lsb_release -a

// 检查系统更新
apt-get update
```

#### 查看服务器网络

```sh
# 安装net-tools工具
sudo apt install net-tools

# 获取网络配置 子网掩码是netmask
ifconfig

# 获取服务器ip
ip -a

# 获取网关地址
route -n

# 查看DNS地址
nslookup hcos
```

#### 固定服务器IP

:::tip

没搞成功

:::

在进行任何更改之前，务必备份当前的网络配置文件，以防止出现意外问题。Ubuntu中的网络配置文件通常存储在/etc/netplan/目录下，文件名类似于00-installer-config.yaml或类似的名称。

```sh
# 进入指定目录
cd /etc/netplan/

# 备份原来的文件
sudo cp /etc/netplan/00-installer-config.yaml /etc/netplan/00-installer-config.yaml.bak
```

编辑网络配置文件，原始格式如下

```yaml
# This is the network config written by 'subiquity'
network:
  ethernets:
    eth0:
      dhcp4: true
  version: 2
```

最后修改后的格式为

```sh
# This is the network config written by 'subiquity'
network:
  ethernets:
    eth0:
      dhcp4: no
      addresses: [172.30.82.201/20] # 指定静态IP地址及对应的子网掩码
      gateway4: 192.168.1.1 # 指定网关
      nameservers: 
        addresses: [8.8.8.8  # DNS服务器地址
  version: 2
```

修改后，保存更新然后执行下面的命令使得IP固定生效

```sh
sudo netplan apply
```

##### blk_update_request: I/O error

执行命令`netplan apply`，应用配置的ip时，报错： blk_update_request: I/O error, dev fd0, sector 0

问题分析：
报这个错，是因为 linux加载了 floppy 软驱 驱动，我的虚机没有软驱，系统启动时加载了软盘驱动。

解决方法：通过关闭软驱模块来解决

```sh
sudo lsmod | grep -i floppy
sudo rmmod floppy
echo "blacklist floppy" | sudo tee /etc/modprobe.d/blacklist-floppy.conf
update-initramfs -u -k all
reboot

# 重启后确认floppy该模块没有启用即可
lsmod | grep -i floppy
```

资料：https://blog.csdn.net/inthat/article/details/122723421

#### 进程信息查看

##### htop安装和使用

```shell
# 安装
apt-get update
apt-get install htop

# 使用
htop
```

#### SSH连接

通过命令行工具去连接服务器

```sh
ssh 用户名@ip
```

### 用户操作

```shell
# 将当前用户添加到 root 用户组，执行后立即生效
sudo usermod -aG root $USER
```



#### root账号配置

ubuntu系统默认root用户是不能登录的，密码也是空的。如果要使用root用户登录，必须先为root用户设置密码，输入命令

sudo passwd root 然后按回车，此时会提示你输入密码，在password:后输入你现在登录的用户的密码
然后系统提示你输入新的UNIX密码
Enter new UNIX password:这里输入你想为root设置的密码，要输入两次
此时系统会出现密码设置成功的提示，最后退出终端，重启计算机，输入账号root 再输入root的密码就可能登录了！



如果你远程还连接不上，那么就还需要做下面的操作，执行下面的命令

```
vim /etc/ssh/sshd_config
```

![image-20240302203055844](/soft/image-20240302203055844.png)

:::tip
PermitRootLogin配置项是干嘛的呢？
简单粗暴的解释就是：
1、配置文件中没有PermitRootLogin配置项，默认PermitRootLogin为yes
2、PermitRootLogin yes 允许root用户通过ssh的登录方式
3、PermitRootLogin no 不允许root用户通过ssh的登录方式
:::

修改后重启服务，然后再次登录就可以了

```sh
sudo systemctl restart sshd
```

### 目录操作

```csharp
-- 创建文件
touch 文件名
```

### 文件操作

```sh
:w       # 保存文件，不退出 vim
:w file  # 将修改另外保存到 file 中，不退出 vim
:w!      # 强制保存，不退出 vim
:wq      # 保存文件，退出 vim
:wq!     # 强制保存文件，退出 vim
:q       # 不保存文件，退出 vim
:q!      # 不保存文件，强制退出 vim
:e!      # 放弃所有修改，从上次保存文件开始再编辑
```

## 安装

官网系统下载地址：[https://releases.ubuntu.com/jammy/](https://releases.ubuntu.com/jammy/) (根据需要安装界面版本或者无界面版本)

或者下载阿里云的系统镜像：[https://mirrors.aliyun.com/ubuntu-releases/focal/](https://mirrors.aliyun.com/ubuntu-releases/focal/)

或者清华大学软件镜像站：https://mirrors.tuna.tsinghua.edu.cn//#
