---
title: 内网部署
lang: zh-CN
date: 2023-10-18
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: neiwangbushu
slug: fdi13b
docsId: '65452631'
---

## 开篇语
本文为内网部署，并且不使用docker方式。
> GitHub：[https://github.com/YMFE/yapi](https://github.com/YMFE/yapi)

先了解一下官方部署的方法：
官方文档：[https://hellosean1025.github.io/yapi/devops/index.html](https://hellosean1025.github.io/yapi/devops/index.html)
码云Gitee：[https://gitee.com/mirrors/YApi](https://gitee.com/mirrors/YApi)

## 操作

### 准备

1. centos7
2. MongoDB
3. node v13.12.0
4. Git1.8.31

### 安装Git
本文不做说明，自行安装

### 安装node
本文不做说明，自行安装

### 安装MongoDb
本文不做说明，自行安装

### 安装YAPI
命令行部署
```csharp
mkdir yapi && cd yapi
git clone https://gitee.com/mirrors/YApi.git vendors
## git clone https://github.com/YMFE/yapi.git vendors
cp vendors/config_example.json ./config.json
#修改config.json哦，修改数据库名称、端口、账号等

cd vendors
## npm install --production --registry https://registry.npm.taobao.org
npm install --unsafe-perm --production --registry https://registry.npm.taobao.org
npm install --unsafe-perm --registry https://registry.npm.taobao.org

npm run install-server
#启动，在vendors目录下哦
node server/app.js
npm install --unsafe-perm node-sass -g
npm install -g node-gyp
admin@admin.com
```
成功后如下：
![image.png](/common/1642818526750-d64d74a0-0918-44cc-b1a7-f9d297131716.png)

### 配置邮箱
```csharp
"mail": {
   "enable": true,
   "host": "smtp.qq.com",
   "port": 465,
   "from": "14@qq.com",
   "auth": {
      "user": "14@qq.com",
      "pass": "QQ授权码."
   }
}
```

## 资料
YAPI内网部署：[https://www.pusdn.com/posts/15a4138b/](https://www.pusdn.com/posts/15a4138b/)
