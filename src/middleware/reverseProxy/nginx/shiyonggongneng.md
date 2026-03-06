---
title: 实用功能
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: shiyonggongneng
slug: kiu3kx
docsId: '32771384'
---

## 健康检查
如果后端某一个应用节点挂了，请求就不会再转发给这个节点，不影响线上功能。
```nginx
upstream backend {
    server backend1.example.com weight=5;
    server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
    server unix:/tmp/backend3;

    server backup1.example.com  backup;
}
```
> 关键指令;max_fails,fail_timeout


## 解决跨域问题
在前后端分离项目，对跨域请求增加cors响应头、对静态资源开启gzip压缩
```nginx
   location / {
            gzip on;
            gzip_types application/javascript text/css image/jpeg;

           root /usr/share/nginx/html;
           index index.html index.htm;
           try_files $uri /index.html;

           add_header 'Access-Control-Allow-Origin' '*';
           add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
           add_header 'Access-Control-Allow-Headers' 'Content-Type';
           add_header 'Access-Control-Allow-Credentials' 'true';
        }

```
