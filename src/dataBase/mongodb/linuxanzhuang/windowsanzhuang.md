---
title: windows安装
lang: zh-CN
date: 2023-04-28
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: windowsanzhuang
slug: gmgc483u07po1ite
docsId: '123387684'
---

## 外部访问
```csharp
在windows上安装后  

打开 C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg
## network interfaces
net:
port: 27017
bindIp: 127.0.0.1 改为 0.0.0.0
```
