---
title: 安装
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: linuxanzhuangrabbitmq
slug: finzpm
docsId: '29412000'
---

## docker安装

> 前提环境是已经安装了docker-comnpose

新建一个docker-compose文件
内容为：

```python
version: '3.4'
 
services:
  rabbitmq:
    container_name: eventbus-rabbitmq
    image: rabbitmq:3-management-alpine
    restart: always
    ports: 
      - "15672:15672" 
      - "5672:5672"   
    environment:
      RABBITMQ_DEFAULT_VHOST: myQueue
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: 123456
```

## Windows安装

下载ERLANG和RabbitMQ
注意点：版本不同是不能互相兼容的，博主选的是RabbitMQ3.7.9和ERLANG：20.0.x，具体参考[官网](https://www.rabbitmq.com/which-erlang.html)说明
我准备选择rabbitMQ3.7.15加上 ERLANG20.3
下载地址：[https://www.erlang.org/downloads/20.3](https://www.erlang.org/downloads/20.3)     [https://www.rabbitmq.com/install-windows.html#installer](https://www.rabbitmq.com/install-windows.html#installer)
2.ERLANG安装步骤和RabbitMQ的安装步骤可以查看博客，非常简单，一般就是一路下一步
注意：要记住安装的目录
3.安装完成后需要手动设置ERLANG的系统变量
现在用命令创建：set ERLANG_HOME=D:\Program Files\erl9.3
测试，使用cmd命令：erl -version 如果可以正常展示版本号就表示安装已经成功
4.然后我们需要激活Rabbit MQ's Management Plugin
使用Rabbit MQ 管理插件，可以更好的可视化方式查看Rabbit MQ 服务器实例的状态，你可以在命令行中使用下面的命令激活。
输入：rabbitmq-plugins.bat  enable  rabbitmq_management

![image.png](/common/1609400058718-d0d6d189-0330-4585-a94b-ced461cd17c3.png)
然后现在需要创建用户和密码以及绑定权限
创建管理用户
rabbitmqctl.bat add_user zyp 123456
设置管理员
rabbitmqctl.bat set_user_tags zyp administrator
设置权限
rabbitmqctl.bat set_permissions -p / zyp ".*" ".*" ".*"

![image.png](/common/1609400058743-ff11b27e-f6e6-49af-9efa-d26bbea73827.png)
其他常用的命令
a. 查询用户： rabbitmqctl.bat list_users
b. 查询vhosts： rabbitmqctl.bat list_vhosts
c. 启动RabbitMQ服务: net stop RabbitMQ && net start RabbitMQ
现在我们登陆RabbitMQ的管理后台http://localhost:15672，密码就用刚才创建的账号登陆系统。
Rabbit MQ 管理后台，可以更好的可视化方式查看RabbitMQ服务器实例的状态。

![image.png](/common/1609400058773-b11efb28-6853-4082-b158-3fd5a14242b1.png)

## Linux安装

```shell
启动RabbitMQ服务
#service rabbitmq-server start
状态查看
#rabbitmqctl status
启用插件
#rabbitmq-plugins enable rabbitmq_management
重启服务
#service rabbitmq-server restart
添加帐号:name 密码:passwd
#rabbitmqctl add_user name passwd
赋予其administrator角色
#rabbitmqctl set_user_tags name administrator
设置权限
#rabbitmqctl set_permissions -p / name ".*" ".*" ".*"
```

教程：[https://www.cnblogs.com/justuntil/p/11126591.html](https://www.cnblogs.com/justuntil/p/11126591.html)
