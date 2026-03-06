---
title: Gitlab Runner
lang: zh-CN
date: 2022-09-12
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: gitlabrunner
slug: tx30vf
docsId: '52712542'
---
## 说明

GitLab-Runner是针对GitLab的一个用于协作作业的开源持续集成服务。

* Gitlab Runner版本应该与Gitlab版本同步(避面版本不一致出现其他问题)
* 可以根据需要配置任意数量的Gitlab Runner

## 特点

* 作业运行控制：同时支持多个作业
* 作业运行环境
  * 在本地、使用docker容器、使用docker容器并通过ssh执行作业
  * 使用docker容器不载不同的云和虚拟化管理程序上自动缩放
  * 连接到远程ssh服务器
* 允许自定义作业运行环境
* 自动重新加载配置，无需重启

## 类型与状态

### 类型

* shared共享类型，运行真个平台项目的作业
* group项目组类型，运行特定group下的所有项目的作业
* specific项目类型：运行指定的项目作业

### 状态

* locked：锁定状态，无法运行项目作业
* paused：暂停状态，暂时不会接收新的作业

## 安装

官方Linux安装文档：[https://docs.gitlab.com/runner/install/linux-repository.html](https://docs.gitlab.com/runner/install/linux-repository.html)

windows安装gitlab-runner：[https://www.cnblogs.com/suyuanli/p/14320502.html](https://www.cnblogs.com/suyuanli/p/14320502.html)

### 服务器安装

```shell
# For Debian/Ubuntu/Mint
# 添加存储库
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
# 安装最新版本
sudo apt-get install gitlab-runner
# 安装指定版本 
sudo apt-get install gitlab-runner=10.0.0
sudo apt-get install gitlab-runner --user=root # 以root用户安装


## For RHEL/CentOS/Fedora
## 添加存储库
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh" | sudo bash
## 安装最新版本
sudo yum install gitlab-runner
sudo apt-get install gitlab-runner=10.0.0
```
### docker安装

```shell
sudo docker run -d --name gitlab-runner --restart always \
       -v /srv/gitlab-runner/config:/etc/gitlab-runner \
       -v /var/run/docker.sock:/var/run/docker.sock \
       gitlab/gitlab-runner:latest

# 国内版本
sudo docker run -d --name gitlab-runner --restart always \
       -v /srv/gitlab-runner/config:/etc/gitlab-runner \
       -v /var/run/docker.sock:/var/run/docker.sock \
       registry.cn-hangzhou.aliyuncs.com/zrng/gitlab-runner:v17.2.1
```



### 将默认用户改为root

```shell
# 卸载掉gitlab-runner默认的用户
gitlab-runner uninstall

# 将gitlab-runner的用户设置为root
gitlab-runner install --work-directory /home/gitlab-runner --user root

# 重启gitlab-runner
systemctl restart gitlab-runner

# 查看当前执行用户
ps aux | grep gitlab-runner
```

### 更新Runner

```shell
# For Debian/Ubuntu/Mint
sudo apt-get update
sudp apt-get install gitlab-runner

## For RHEL/CentOS/Fedora
sudo yum update
sudo yum install gitlab-runner
```

## 注册gitlab-runner

```shell
# 交互式注册
gitlab-runner register
```

* gitlab访问地址
* 注册token(gitlab的runner界面界面复制)
* 设置备注信息(可选)
* 设置执行器(shell、docker等)
* 设置标签(哪些项目配置了这些标签才用该执行器去操作)

### Shell执行器

文档地址：[https://docs.gitlab.com/ee/ci/docker/using_docker_build.html](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html)


```shell
# 非交互式使用shell执行器注册
sudo gitlab-runner register -n \
  --url https://gitlab.com/ \
  --registration-token "fCwTpQAQZgGngdKN__sh" \
  --tag-list "build,deploy" \
  --run-untagged="true"
  --executor shell \
  --locked="false" \
  --access-levle="not_protected" \
  --description "My Runner"
  
# 将gitlab-runner用户添加到docker组
sudo usermod -aG docker gitlab-runner
 
# 验证是否可以gitlab-runner访问 Docker：
 sudo -u gitlab-runner -H docker info
 
# 输出gitlab-runner版本
 sudo gitlab-runner status
```

### docker执行器

```shell
# gitlab-runner安装到host上，非交互式使用docker执行器注册
sudo gitlab-runner register \
  --non-interactive \
  --url http://192.168.217.128:9006 \
  --registration-token "glrt-_JwyM8XfgPkgnQCrs9iB" \
  --tag-list "docker" \
  --run-untagged="true" \
  --executor docker \
  --docker-image docker \
  --locked="false" \
  --access-levle="not_protected" \
  --docker-volumes /var/run/docker.sock:/var/run/docker.sock \
  --description "My Docker Runner"
  
  
# 如果是docker部署的gitlab-runner
sudo docker exec gitlab-runner gitlab-runner register -n \
       --url http://192.168.217.128:9006 \
       --registration-token glrt-_JwyM8XfgPkgnQCrs9iB \
       --tag-list "docker" \
       --executor docker \
       --docker-image docker \
       --docker-volumes /var/run/docker.sock:/var/run/docker.sock \
       --description "My Docker Runner"
```

## 命令

```shell
# 此命令列出了保存在配置文件中的所有运行程序
sudo gitlab-runner list      

# 检查注册的 runner 是否可以连接，但不验证 GitLab 服务是否正在使用 runner。--delete 删除
sudo gitlab-runner verify    

# 该命令使用 GitLab 取消已注册的 runner。
sudo gitlab-runner unregister
# 使用名称注销（同名删除第一个）
sudo gitlab-runner unregister --name test-runner
# 注销所有
sudo gitlab-runner unregister --all-runners

sudo gitlab-runner restart
sudo gitlab-runner stop
sudo gitlab-runner status

sudo cat /etc/gitlab-runner/config.toml 
```

## 操作

### SSH免密登录

受控机器上的某个账户信任 CI机器上gitlab-runner账户。

1. 先执行`su gitlab-runner`切换到`gitlab-runner`账户
2. 在你的CI机器(主控端)上使用 ssh-keygen命令创建公钥，使用`ssh-keygen -t rsa`来创建，程序会问你存放目录，如果不需要修改，直接回车几次即可
3. 将~/.ssh目录下`id_rsa.pub`文件拷贝到受控机器的`~/.ssh`目录中，然后将文件内容导入到`~/.ssh/authorized_keys`文件

```csharp
主控方：
scp /home/gitlab-runner/.ssh/id_rsa.pub ****@10.202.42.252:/home/***/.ssh/
受控方：
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

4. 在受控方机器设置权限：

`~/.ssh`权限设置为700；`~/.ssh/authorized_keys`权限设置为600
之后在主控CI机器 就具备免密登陆 远程机器的能力。

![](/common/1615517715377-99a8db48-53e2-42e3-a98f-b194120b340b.png)
