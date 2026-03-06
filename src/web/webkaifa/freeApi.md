---
title: 免费API
lang: zh-CN
date: 2023-05-11
publish: true
author: azrng
isOriginal: true
category:
  - web
tag:
  - api
filename: mianfeiceshidejiekou
slug: hfp3g6
docsId: '65928896'
---

## 免费的Api库

1.public-apis 2.awesome-apis

## 聚合平台

### 大米API

https://api.qqsuu.cn/



60s看世界：https://udp.qqsuu.cn/apis/60s/index.html

### 韩小韩API

https://api.vvhan.com/

## Apifox

文档地址：[https://echo.apifox.com/](https://echo.apifox.com/)

## **JSONPlaceholder**
JSONPlaceholder 使用方式非常简单，提供了 GET、POST、PUT、PATCH、DELETE 几个请求方法。还提供分页查询、具体id查询等功能。
官网地址：[http://jsonplaceholder.typicode.com/](http://jsonplaceholder.typicode.com/)

### 示例

#### 例：获取100篇文章数据（GET）
返回100条数据，每条内容都有帖子 ID、发贴人 ID、标题、以及简介。
http://jsonplaceholder.typicode.com/posts
![](/common/1643685259660-126054ef-2381-467c-b1b5-eb63e5ddcc7a.webp)

#### 例：根据文章ID获取文章数据（GET）
根据文章 ID 获取指定文章的数据。
返回：文章 ID、发贴人 ID、标题、以及内容。
http://jsonplaceholder.typicode.com/posts/2
![](/common/1643685259828-576e6aa0-6646-4c06-88fd-88880c6b04c5.webp)
本例传入的 ID 为2，返回 ID 为2的数据。

#### 例：添加文章（POST）
使用 POST 发送一篇文章，发送成功会返回一个文章 ID 回来。
http://jsonplaceholder.typicode.com/posts
![](/common/1643685259705-2386995c-f34a-4c19-b82e-7eb285890c7d.webp)

#### 其他接口

##### 帖子接口：

- 获取帖子列表：http://jsonplaceholder.typicode.com/posts
- 根据帖子ID获取详情：https://jsonplaceholder.typicode.com/posts/1
- 获取某个用户所有的帖子：http://jsonplaceholder.typicode.com/posts?userId=5
- 获取帖子所有的评论：https://jsonplaceholder.typicode.com/posts/1/comments

##### 评论接口

- 获取评论列表：http://jsonplaceholder.typicode.com/comments
- 获取某个帖子的所有评论：http://jsonplaceholder.typicode.com/comments?postId=4

##### 专辑接口：

- 获取专辑列表：http://jsonplaceholder.typicode.com/albums
- 根据专辑ID获取详情：http://jsonplaceholder.typicode.com/albums/6
- 获取某个用户所有专辑：http://jsonplaceholder.typicode.com/albums?userId=9

##### 待办事宜接口：

- 获取待办事宜列表：http://jsonplaceholder.typicode.com/todos
- 根据待办ID获取详情：http://jsonplaceholder.typicode.com/todos/6
- 获取某个用户所有待办事宜：http://jsonplaceholder.typicode.com/todos?userId=9

##### 用户接口：

- 获取用户列表：http://jsonplaceholder.typicode.com/users
- 根据用户ID获取详情：http://jsonplaceholder.typicode.com/users/5

##### 照片接口：

- 获取照片列表：http://jsonplaceholder.typicode.com/photos
- 根据照片ID获取详情：http://jsonplaceholder.typicode.com/photos/8

## 随机图片接口
『Lorem Picsum』 可以随机返回一张照片，还可以指定照片的尺寸。
> 官网地址：[https://picsum.photos/](https://picsum.photos/)

Lorem Picsum  提供的接口返回的是一个图片资源，而且是随机返回的。可以直接放在 <img> 标签的 src 属性内使用。

### 例：返回 宽和高都是200px 的图片（GET）
请求地址：https://picsum.photos/200

### 例：比如想要获取 宽200，高300 的图片（GET）
如果宽高尺寸不同，可以自己设置。
请求地址：[https://picsum.photos/200/300](https://picsum.photos/200/300)
