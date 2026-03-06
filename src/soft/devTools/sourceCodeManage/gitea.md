---
title: gitea
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 002
category:
  - Git
tag:
  - 无
filename: gitea
---

## 概述
一款极易搭建的自助 Git 服务，是在 Gogs 的基础上新开一个发行分支。
> 官方地址：[https://gitea.com/](https://gitea.com/)


## 安装方式
docker方式
``` bash
docker run -d --name=gitea -p 10022:22 -p 9004:3000 -v /var/lib/gitea:/data gitea/gitea

docker run -d --privileged=true --restart=always --name=gitea -p 10022:22 -p 9004:3000 -v /var/lib/gitea:/data gitea/gitea
```

## 配置
安装完成后访问 xxxxx:9004，配置数据库
![image.png](/common/1625325339367-c4d8ef81-60ec-4b12-991b-21983d81faa6.png)
配置一般设置
![image.png](/common/1625325414492-fb615f0c-58ca-4590-8173-ab00aa2ba175.png)
可选设置
![image.png](/common/1625325477494-0b014490-1407-4399-ab62-bb726a13064f.png)
配置管理员密码，然户跳转打开主界面
![image.png](/common/1625325563445-b4f6679d-f679-4a3f-b377-8e088d89ac1c.png)

### 管理后台
![image.png](/common/1625326101037-2a65e8b1-1f3b-418f-9a58-afab9947f97b.png)

### 创建仓库
![image.png](/common/1625325668653-3cf62de7-cb71-4439-a526-f4324c1248c6.png)
展示
![image.png](/common/1625325691123-60d1dab8-d895-42b5-bb73-baeed73ba155.png)
克隆项目
![image.png](/common/1625325766294-64b16b73-077c-4f14-8525-d0302e336024.png)
编写项目提交
![image.png](/common/1625325867913-cbdbb49d-a390-4e43-b3d3-defc4fd793ab.png)

### 注册用户
![image.png](/common/1625325968315-136a8f58-bb6b-43e6-9aa3-ee09a9d12013.png)
还对用户名有校验， 应该只包含字母数字, 破折号 ('-'), 下划线 ('_') 和点 ('. ') 。

## 参考文档
> 和gogs之间的故事：[https://blog.wolfogre.com/posts/gogs-vs-gitea/](https://blog.wolfogre.com/posts/gogs-vs-gitea/)

