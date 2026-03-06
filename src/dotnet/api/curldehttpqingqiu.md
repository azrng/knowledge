---
title: Curl的Http请求
lang: zh-CN
date: 2023-09-29
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: curldehttpqingqiu
slug: ussvvr
docsId: '30338060'
---

### POST请求

#### application/x-www-form-urlencoded
> curl localhost:3000/api/basic -X POST -d 'hello=world'  


#### multipart/form-data(最常见的一种POST请求)
> curl localhost:3000/api/multipart -F raw=@raw.data -F hello=world


#### application/json
 这种一般设计到文件上传，后端对这种类型的请求处理也复杂一些
> curl localhost:3000/api/json -X POST -d '{"hello": "world"}' --header "Content-Type: application/json"

跟发起 application/x-www-form-urlencoded 类型的 POST 请求类似，-d 参数值是 JSON 字符串，并且多了一个 Content-Type: application/json 指定发送内容的格式。
