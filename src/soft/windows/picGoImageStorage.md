---
title: PicGo图床
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
isOriginal: true
category:
  - soft
tag:
  - 无
filename: picgotuchuang
slug: txw1d9
docsId: '45123682'
---
## 概述

图床工具，就是自动把本地图片转成连接的一款工具，网络上有很多图床工具，PicGo就是一款比较优秀的图床工具，可以支持微博，七牛云，腾讯云COS，又拍云，GitHub，阿里云OSS，SM.MS，imgur 等8种常用图床
> GitHub：[https://github.com/PicGo/](https://github.com/PicGo/)
> 下载地址：[https://github.com/Molunerfinn/PicGo/releases](https://github.com/Molunerfinn/PicGo/releases)


## 安装
需要先安装nodejs
![image.png](/common/1621752972165-b4781917-e4ad-46c6-a621-3ed13644ce28.png)

> 官网：[https://nodejs.org/en/](https://nodejs.org/en/)

从Github上下载PicGo工具，地址：[https://github.com/Molunerfinn/PicGo/releases](https://github.com/Molunerfinn/PicGo/releases)
下载合适系统的版本，下载安装

## 图床

### Gitee图床
国内平台，访问速度快
登录gitee进入(没有账号的需要创建账号)
![image.png](/common/1621752936448-d7567919-7e3b-4740-9af1-3766a4adaf86.png)
创建一个公开的仓库用户存储图片
![image.png](/common/1621753014180-c7af59f9-83cd-4475-bd3f-329248fc02e1.png)
进入个人设置配置私人令牌
![image.png](/common/1621753063591-c55c5450-70a9-449d-9a0b-47f4c14c1ad3.png)
> 配置好的令牌密钥需要保存好

打开PicGo搜索插件Gitee进行安装
![image.png](/common/1621753132415-8e7f1136-113f-439c-8c3c-2eced4626bbf.png)
然后我们可以在图床设置找到
![image.png](/common/1621753168851-e77e2b7e-40a1-4979-b35a-5bea4cfe6898.png)
配置参数
![image.png](/common/1621753252236-6fae7d2d-097c-4300-867c-b456cfa5744f.png)

| 名称 | 作用 |
| --- | --- |
| URL | 填写gitee的官网网址 |
| owner | 注册gitee时留的名字 |
| repo | 仓库名 |
| path | 存储的位置（不要是中文） |
| token | 刚才保存的私人令牌 |
| message | 表述型文字（可以不填） |

然后我们就可以上传一个测试下是否可以使用
上传后的图片显示在相册
![image.png](/common/1621753297380-73eda0b3-7770-40b3-91f9-5aacec79f1f9.png)

### 阿里云OSS
> 阿里云配置内容来自博客：[https://www.cnblogs.com/qiulin2018/p/14802594.html](https://www.cnblogs.com/qiulin2018/p/14802594.html)
> 阿里云的OSS，一年9块钱40G

创建一个Bucket用于存储图片
登录阿里云oss控制台-->Bucket列表-->创建Bucket
![](/common/1621905126641-7360935f-bd63-4dbe-afb1-5cd4c63d4202.png)
创建的一个Bucket有点类似于我们的一块磁盘，我们可以在上面创建文件夹，上传文件。
我在新创建的Bucket上创建了markdown/images文件夹来用于做为我文章的配图的图床
![](/common/1621905126638-f3255425-6e99-4b19-afaa-df93cce5951f.png)
对此文件设置匿名可以访问的权限，方便图片在任何地方无需认证只需要url就可以访问到
![](/common/1621905126652-4b986b88-d09e-474f-9367-d3926a319360.png)
新增授权
![](/common/1621905126667-e2b58989-af79-41eb-8f73-a0b4c74e2893.png)
获取上传到OSS的keyId和keySecret
![](/common/1621905126652-a30f9895-5187-4828-aa2a-8d825509690c.png)
创建访问OSS用户
![](/common/1621905126656-084a31a6-5ff1-429c-9a21-9af47d02fd43.png)
新增oss用户
[![](/common/1621905126658-95d1abea-b7f6-4727-9811-ad3513e7bb90.png)
保存用户获取到 `AccessKey ID`和 `AccessKey Secret` 可以先保存下来用于之后PicGo配置
![](/common/1621905126657-7e051d81-1f71-4ac2-b714-37eb78305fb7.png)
配置PicGo的阿里云OSS的KeyId和keySecret，将如上获取到的 `AccessKey ID`和 `AccessKey Secret`分别填入此处。存储路径一定要写刚刚我们设置可匿名访问的路径
![](/common/1621905126663-b6d6d0bf-1747-423f-8c88-6078cbd4e2ff.png)
确定存储区域这里需要填写我们oss的存储区域ID，在创建Bucket的时候选区域是有显示的，忘了也不要紧。在如下位置也可以获取到这个id
![](/common/1621905126655-0b19edae-e006-437a-aa7f-05a936fc6b1e.png)
给我们新创建的用户添加访问OSS的权限
![](/common/1621905126683-d797de09-5c56-424a-a675-d521686b2327.png)
添加OSS所有权限
![](/common/1621905126658-8adcf1fb-8d86-4c7b-b654-a72731fe1b1e.png)
自此我们在PicGo配置OSS的全部步骤就已经全部完成
可以在PicGo上传图片试试
![](/common/1621905126693-ea1f8a1d-5e35-407e-9dd9-ab8f602dd3d0.png)
在OSS的控制台上也可以看到我们图片的具体信息
![](/common/1621905126672-277f779e-ef92-4703-8c74-c692b22a3cd3.png)
复制文件URL在浏览器打开可以直接访问到我们刚上传的图片，无需认证。如果此处出现访问失败，403等错误，请检查是否按上面的配置匿名访问配置了文件夹的匿名访问权限
[![](/common/1621905126668-e80dba19-fe90-46e7-9f9a-9b898d2a2887.png)

## 配置Typora
进入文件=>偏好设置=>图像
![image.png](/common/1620743422481-2ba9c286-36d7-4d86-b2c8-993941f0bc9e.png)
> 配置好后可以在文档中直接右键上传图片使用

