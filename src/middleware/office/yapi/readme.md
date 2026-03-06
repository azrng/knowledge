---
title: 说明
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: readme
slug: rw32fc
docsId: '44509099'
---

## 概述
YApi 是**高效**、**易用**、**功能强大**的 api 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API，YApi 还为用户提供了优秀的交互体验，开发人员只需利用平台提供的接口数据写入工具以及简单的点击操作就可以实现接口的管理。

当下稍微正式一点的公司都会要求前后端联调要求编写接口文档，比如说要求word或者excel等了，这个时候你要说那么我们可以使用swagger，但是领导又会说swagger不能留档，并且显得不太正式，结果就强制要求使用word，奈何太浪费时间，通过yapi，它可以直接导出文件进行存档，并且接口内容也可以通过swagger定时同步。
> GitHub：[https://github.com/YMFE/yapi](https://github.com/YMFE/yapi)
> Docker部署：[https://github.com/fjc0k/docker-YApi](https://github.com/fjc0k/docker-YApi)


## 安装Yapi

### 自己搭建mongo
前提是需要安装mongdb用于存储数据，当前我已经安装了MongoDB，配置如下
```yaml
docker run -p 27017:27017 --name mongo -e TZ=Asia/Shanghai  -d mongo

服务地址：192.168.1.12
端口：27017
数据库：yapi
```
> 因为设置带密码的mongodb一直没成功，所以采用了无密码的

通过docker生成yapi服务
```yaml
docker run -p 8009:3000 --name yapiweb -e YAPI_ADMIN_ACCOUNT=itzhangyunpeng@163.com -e YAPI_ADMIN_PASSWORD=123456 -e YAPI_CLOSE_REGISTER=true -e YAPI_DB_SERVERNAME=192.168.1.6 -e YAPI_DB_PORT=27017 -e YAPI_DB_DATABASE=yapi -e YAPI_MAIL_ENABLE=false -e YAPI_LDAP_LOGIN_ENABLE=false  -d jayfong/yapi:latest
```
> 使用了大佬提供的镜像：jayfong/yapi
> 详细配置还得看GitHub文档介绍，注意数据库的地址信息


### 开箱即用版本
```yaml
## 纯粹的
docker run --rm -p 8009:3000 -d  jayfong/yapi:play

## 带插件的
docker run --rm -p 8009:3000 -e YAPI_PLUGINS='[{"name":"interface-oauth2-token"}]' -d jayfong/yapi:play
```
> 默认的管理员账号：`admin@docker.yapi`，管理员密码：`adm1n`。


## 基本使用Yapi

### 登录
通过浏览器访问地址：[http://localhost:8009/](http://localhost:8009/)
![image.png](/common/1620135949798-6301cf62-0e49-4c51-b8d8-7c704d875eb1.png)
> 帐号密码就是上面配置的管理员密码：YAPI_ADMIN_ACCOUNT=itzhangyunpeng@163.com  YAPI_ADMIN_PASSWORD=123456


### 用户管理

#### 查看用户
![image.png](/common/1621095951874-191aeaaa-f8f6-4ab0-8658-f4604793bbb1.png)

#### 添加用户
![image.png](/common/1621095975910-82a168cd-f4ab-411b-89e4-7365a9684d92.png)

### 个人项目

#### 创建
![image.png](/common/1621095563934-fb08ca06-b7c9-4bc9-b67d-654ab8133746.png)

#### 展示个人项目
![image.png](/common/1621096008677-afb175df-cd4f-4b73-9247-b285fad63f53.png)
> 该个人项目只能自己才看看到


### 分组

#### 创建分组
![image.png](/common/1621096585525-8671e46e-f051-4a04-8eb7-93e109ef926d.png)
> 一个项目组一般为一个分组，然后其他的人都在该分组中编辑本分组的项目


#### 分组成员
![image.png](/common/1621096633945-1c143e6a-68a2-4a1e-8ed4-e114e501bf37.png)
> 管理本分组人员操作和简单操作权限。


#### 分组动态
![image.png](/common/1621096835031-db68bc4f-d350-42af-98f0-87f371d6e772.png)
> 展示分组内每个用户的操作记录


### 添加接口
![image.png](/common/1621095730126-3384e893-324e-4971-a6c6-dd561f9584c5.png)

### 修改接口
![image.png](/common/1621095762304-608bc695-597f-480c-b9bd-629010c25824.png)

## 搭配swagger
关于swagger基础配置可以查看：[此处](https://mp.weixin.qq.com/s/mIawFR2JNP0t5DS4FEvS-Q)

### 创建项目
使用前文的.net程序，并显示swagger信息，swagger地址为：[http://azrng.cn1.utools.club/swagger/index.html](http://azrng.cn1.utools.club/swagger/index.html)
![image.png](/common/1621097722708-69bd76cf-366f-4fe2-9809-a366c16ca8ce.png)
获取swagger的json地址
![image.png](/common/1620136320377-d206d608-7a02-422c-83eb-1f93e69b44d7.png)

### Yapi配置
![image.png](/common/1621097450042-8abb9d94-4479-4d21-9e34-c12010694bea.png)
> 本次使用的是完全覆盖，通过cron表达式配置自动同步时间。


### 查看同步数据
然后我们查看接口列表，这个时候我们已经看到项目的接口已经都被同步过来了
![image.png](/common/1621097784255-3e29f9c4-893a-4aae-b1df-6f0ef4665cc4.png)

### 数据管理

#### 数据导出导入
在数据管理我们可以导入数据，或者导出数据
![image.png](/common/1620137115051-8c55ba52-01f8-4acc-a981-5ce8a416a00a.png)
> 对于我来说我常用的就是数据导出为html给留档使用。


#### 导出预览
![image.png](/common/1621097898862-bced3729-6b4f-4f3e-bc50-4813761b4bbc.png)
> 更多配置还需要查看官方文档

