---
title: 安装
lang: zh-CN
date: 2022-01-27
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: anzhuang
slug: xcg66h
docsId: '48445721'
---
> 本文是在windows下进行操作的


### 安装环境
go环境下载：[https://golang.google.cn/dl/](https://golang.google.cn/dl/)
修改环境配置
```
右键我的电脑->属性->高级系统设置->环境变量。
它有用户变量和系统变量。两者的区别是用户变量下配置只对当前用户有效，系统变量下配置对所有用户有效。本人建议在用户变量下配置。

• 配置 GOROOT
选择<新建>按钮。
变量名：GOROOT
变量值：D:\Program Files\Go
• 配置 path
找到path（如果不存在，则新建），点击编辑—>新建，输入：%GOROOT%\bin
```

### 验证是否安装环境
```csharp
go version
```
如果出来关于go版本信息，那么就说明已经安装
输出：
go version go1.16.5 windows/amd64

### 配置镜像代理
因为国内访问不了谷歌服务器，所以下载管理包依赖时候会报错，这个时候就需要代理服务。国内有阿里云和七牛云
```csharp
## 七牛云 推荐
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct


## 阿里云 
go env -w GO111MODULE=on
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/
```

