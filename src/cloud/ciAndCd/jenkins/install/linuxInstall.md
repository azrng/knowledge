---
title: Linux安装jenkins
lang: zh-CN
date: 2023-07-02
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
 - Jenkins
 - ci/cd
filename: linuxInstall
slug: cxcne7
docsId: '30338859'
---

## 1.需要先安装java环境

该文章再linux目录下有讲解。

## 2. 安装jenkins

```
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
yum install jenkins　-y
```

 安装完提示信息：

![img](/common/1611112925421-2ad63960-9bdb-49dd-9298-10e696864a57.png)

默认安装后的端口绑定的是8080，如果你想更改请进入文件编辑JENKINS_PORT属性项。

```
vim /etc/sysconfig/jenkins
```

如果你使用的是root用户（没有单独创建一个jenkins的用户），那么建议进入上面的配置文件编辑JENKINS_USER属性项将jenkins改为root。

![img](/common/1611112925269-8df476b8-b1f3-4bc3-b389-289f9efc235c.png)

## 3. 配置jenkins

### 3.1 加入开启启动项

```
systemctl start jenkins
systemctl enable jenkins
systemctl daemon-reload
```

### 3.2 修改目录权限：

```
chown -R root:root /var/lib/jenkins
chown -R root:root /var/cache/jenkins
chown -R root:root /var/log/jenkins
```

***Tip：\***在 Shell 中，可以使用chown命令来改变文件所有者。chown命令是change owner（改变拥有者）的缩写。-R代表进行递归( recursive )的持续更改，即连同子目录下的所有文件、目录都更新成为这个用户组，常常用在更改某一目录的情况。

### 3.3 重启Jenkins服务

```
service jenkins restart
ps -ef | grep jenkins
```

提示信息如下图所示：

![img](/common/1611112988838-0a6cf095-8f9c-4f6e-aeb7-973927bf7883.png)

***PS：\***启动Jenkins

```
systemctl start jenkins
```

验证启动状态：

```
systemctl status jenkins
```

![img](/common/1611112988907-8eee8313-2387-4e5b-8cc9-b4c1546bcab4.png)

## 4. 初始化jenkins

访问地址提示需要解锁

![img](/common/1611113150109-908ce5c6-09ef-4d9e-bec4-54d7926e55e7.png)

可以通过下面的命令查看管理员密码

```
cat /var/lib/jenkins/secrets/initialAdminPassword
```

复制密码到文本框然后进入系统

## 5. 允许通过防火墙

```
# Jenkins 默认运行在 8080 端口，允许8080端口通过防火墙
$ sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
$ sudo firewall-cmd --zone=public --add-service=http --permanent
$ sudo firewall-cmd --reload

# 或者直接关闭防火墙
$ sudo firewall-cmd --state                    # 查看防火墙状态
$ sudo systemctl stop firewalld.service        # 停止防火墙
$ sudo systemctl disable firewalld.service     # 禁用防火墙开机启动

$ sudo systemctl enable firewalld.service      # 起用防火墙开机启动
$ sudo systemctl start firewalld.service       # 禁用防火墙开机启动
```

## 参考教程

https://www.cnblogs.com/liudecai/p/14770969.html