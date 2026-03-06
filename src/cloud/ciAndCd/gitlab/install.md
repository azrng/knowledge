---
title: 安装
lang: zh-CN
date: 2023-09-08
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - gitlab
filename: anzhuang
slug: idxata
docsId: '52169771'
---

## 概述
Gitlab是利用 Ruby on Rails 一个开源的版本管理系统，实现一个自托管的Git项目仓库，可通过Web界面进行访问公开的或者私人项目。
Gitlab-CI就是一套配合GitLab使用的持续集成系统，GitLab8.0以后的版本是默认集成了GitLab-CI并且默认启用的。
Gitlab-Pages是一个go语言写的HTTP服务，原来只在Gitlab.com和Gitlab企业版中可用，在8.17版本的时候在Gitlab社区版支持。
Gitlab-Runner是配合GitLab-CI进行使用的，它是一个用来执行软件集成脚本的工具。

> 来源：[https://mp.weixin.qq.com/s/nqpXN75M5vMUtmzVcgewVg](https://mp.weixin.qq.com/s/nqpXN75M5vMUtmzVcgewVg)

## 安装GitLab

:::tip

官网给出的推荐配置：

- **4核 4GB内存** 支持500个用户
- **8核 8GB内存** 支持1000个用户

:::

### 生成容器
下面的脚本只是测试使用，不建议生产使用(像一些挂载的需要自行处理)

#### docker-compose
> 安装Gitlab要求内存至少是4g

```yaml
version: '3'
 
services:
  gitlab:
    image: 'gitlab/gitlab-ce:14.10.2-ce.0'
    restart: always                  
    hostname: 'www.mygitlab.com'
    environment:
      TZ: 'Asia/Shanghai'       
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://172.16.0.86:3000'  ## web站点访问地址
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
    ports:
      - '3000:3000' ## 注意宿主机和容器内部的端口要一致，否则external_url无法访问
      - '8443:443'
      - '2222:22'
    volumes:
      - ./config:/etc/gitlab
      - ./data:/var/opt/gitlab
      - ./logs:/var/log/gitlab
    logging: 
      driver: "json-file"
      options: 
        max-size: "2g"
        max-file: "2"
```

#### docker
这里是9006:9006是因为external_url 配置了9006，请往下看
```bash
## 挂载
docker run -d  -p 9443:443 -p 9006:9006 -p 9022:22 --name gitlab --restart always -v /home/gitlab/config:/etc/gitlab -v /home/gitlab/logs:/var/log/gitlab -v /home/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce

## 不挂载
docker run -d -p 9443:443 -p 443:443 -p 9006:9006 -p 9022:22 --name gitlab gitlab/gitlab-ce

## windows挂载
docker run -d -p 9443:443 -p 9006:9006 -p 9022:22 --name gitlab  -v  D:/Soft/gitlab/etcconfig:/etc/gitlab  gitlab/gitlab-ce
```
> -d：后台运行
> -p：将容器内部端口向外映射
> --name：命名容器名称
> -v：将容器内数据文件夹或者日志、配置等文件夹挂载到宿主机指定目录


### 配置
![image.png](/common/1630392393921-c9133767-a427-43ac-b77a-96685c75485b.png)

进入容器内去编辑配置或者编辑挂载目录的文件

![image.png](/common/1630392436742-b7a1a83e-d915-430d-a960-f1612a97a4e4.png)

```yaml
docker exec -it gitlab bash
vi /etc/gitlab/gitlab.rb
```
该文件要修改的配置是注释状态，所以直接可以在文件头部增加配置
```yaml
external_url 'http://172.30.112.1:9006'
#ssh主机ip
gitlab_rails['gitlab_ssh_host'] = '172.30.112.1'
## ssh连接端口
gitlab_rails['gitlab_shell_ssh_port'] = 9022
```
保存并退出，然后gitlab.yml该文件可以编辑也可以不编辑(因为gitlab.rb内配置会覆盖这个，为了防止没有成功覆盖所以我在这里进行配置)
```yaml
vi opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
修改：gitlab setting=》host（172.30.112.1） 、port（9006）、ssh_host（172.30.112.1）
		 gitlab shell setting =》ssh_port（9022）
```
保存退出，在容器内执行更新配置
```yaml
gitlab-ctl reconfigure
```
重启服务
```yaml
gitlab-ctl restart
```

#### 查找密码
gitlab默认用户是root，
不进入容器直接查询初始密码
```yaml
docker exec -it gitlab grep 'Password:' /etc/gitlab/initial_root_password
```
在容器内查找初始密码
```yaml
cat /etc/gitlab/initial_root_password
```
![image.png](/common/1630392346545-d3be811e-20e6-4b75-85a2-1981b345a0af.png)

#### 容器内修改密码
在容器内进入gitlab的bin目录
```yaml
cd /opt/gitlab/bin
```
执行gitlab-rails console命令

![image.png](/common/1630393079166-dcd56a70-64f3-41dd-8e48-4d97d69cbdf5.png)

找到root的用户，输入u=User.where(id:1).first，然后回车

![image.png](/common/1630393092662-6540ad2c-d30e-4bee-8dac-48b234344ede.png)

修改password，输入u.password='123456789'然后回车

```yaml
u.password='123456789'
```
![image.png](/common/1630393112625-6ee295f7-70e6-4a1c-a3f0-194d972f223c.png)
修改确认密码
```yaml
u.password_confirmation='123456789'
```
![image.png](/common/1630393132266-4b5613af-43c7-41cf-88ec-da38a3db7e70.png)

保存修改，输入u.save，然后回车，等到输出true，这时，密码修改成功。

![image.png](/common/1630393150839-203c3d29-88c8-4c59-9af1-273e8bce2933.png)

这里密码已经修改成功，可以用123456789密码登录进去了

## 注意点

因为我们想是实现将容器内的80端口往外映射，所以我们在docker run的时候设置了-p 9006:80，但是因为我们在代码里面配置了external_url [http://172.30.112.1:9006](http://172.30.112.1:9006)后就应该使用-p 9006:9006否则一直访问不到。

## 参考文档
官网：[https://docs.gitlab.com/ee/install/](https://docs.gitlab.com/ee/install/)

docker安装gitlab： [https://blog.csdn.net/weixin_45649746/article/details/119816809](https://blog.csdn.net/weixin_45649746/article/details/119816809)
