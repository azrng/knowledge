---
title: nginx配置netcore
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: nginxpeizhinetcore
slug: gavndr
docsId: '29395271'
---

## 准备
首先需要安装好指定的nginx环境

## 服务配置
要获取Nginx转发前的配置信息，不仅仅在nginx中需要使用proxy_set_header，并且后端代码也需要使用ForwardedHeaders中间件
```csharp
// 注册服务
services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.All;
});

// 启用中间件
app.UseForwardedHeaders();
```

## 配置代理
进入目录编辑conf文件
命令：cd  /etc/nginx
编辑目录下的：nginx.conf
这点具体写法可以参考nginx配置文件
然后停止nginx
命令：sudo systemctl stop nginx
再次启动
命令：sudo systemctl start nginx

## 转发 
然后通过转发的路径访问，
示例：我服务地址是localhost:5010/swagger/index.html
代理后的地址：localhost:8080/book/swagger/index.html
