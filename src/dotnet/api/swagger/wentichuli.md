---
title: 问题处理
lang: zh-CN
date: 2021-06-18
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: wentichuli
slug: ucqldg
docsId: '30112658'
---

### TypeError: Failed to fetch
使用postman或者浏览器直接访问接口提示是正常的，但是就是使用swagger提示这个错误
解决方法是因为当前浏览器安装了AdBlockPlus，他把那个localhost当成广告过滤掉了 

### 无法加载问题
Netcore webapi使用swagger提示无法加载swagger.json文档
报错页面：
![image.png](/common/1610593545594-040d6890-8933-499d-95e1-3eef05f4609a.png)
 
出现原因就是某一个控制器中某一个接口没有声明请求方式，所以导致出现这个问题，坑呀

### 实体类注释警告
![image.png](/common/1610593674618-9aa12b92-6831-4efd-8fc2-c858bdcf12b6.png)
解决方案：右键=》属性=》Errors and warnings 配置 1591：
![image.png](/common/1610593710829-c5ce44f7-012f-47d2-90c0-283973faa14a.png)

### 显示枚举
![image.png](/common/1624033016226-944c756a-4356-451c-829f-6919943691a3.png)
然后在使用枚举的地方
![image.png](/common/1624033045099-0ac64493-a40f-4c74-be84-015b748d2486.png)
显示结果
![image.png](/common/1624033059674-0e4d6564-adfb-44d7-8fab-fc9156f8805b.png)
