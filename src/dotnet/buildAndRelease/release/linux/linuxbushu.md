---
title: 说明
lang: zh-CN
date: 2022-09-12
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: linuxbushu
slug: anxxhz
docsId: '32029553'
---

## 设置反向代理
linux中使用nginx反向代理的配置文件：
```csharp
server{
	listen 80;
	//server_name   example.com *.example.com;
	location / {
	proxy_pass http://localhost:5000;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection keep-alive;
	proxy_set_header Host $host;
	proxy_cache_bypass $http_upgrade;
	} 
}
```
需要使用脚本设置netcore项目开机启动
关闭防火墙，并且开启端口外部访问

## libgdiplus
提示错误：Unable to load DLL 'libgdiplus
解决方案：安装 libgdiplus 包

yuminstall libgdiplus
#有可能还需要创建一个软链接
sudo ln -s /usr/lib/libgdiplus.so /usr/lib/gdiplus.dll

## Gdip错误
提示错误：The type initializer for 'Gdip' threw an exception
解决方案：创建libdl的软链接
```csharp
## /lib/x86_64-linux-gnu/libdl*
sudo ln -s /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so
或
sudo ln -s /lib/x86_64-linux-gnu/libdl-2.xx.so /lib/x86_64-linux-gnu/libdl.so
```

## 资料
[ASP.NET Core在CentOS上的最小化部署实践](https://mp.weixin.qq.com/s?__biz=MzU2NzkwMjA4NA==&mid=2247484860&idx=1&sn=a2b803693efbfe475c82ba5457607cf0&chksm=fc976f57cbe0e641c3133d53eb9a2d00c07a0e5d62b062b6b241836056d8fe047d1ce2147e57&mpshare=1&scene=1&srcid=&sharer_sharetime=1588806084867&sharer_shareid=b24b68115bb61d7d2faf0d3d81a3e656&key=80ebfb51dcc9b5e69cd977abefed84e2b94fb2c2a29abde3646f001cf15b5e30fa7ffce522f27d31e298370b4c02a8246df60d795d5f8bc62b6532c69420dbba69583d55aeab5cb85af4f55404aea32b&ascene=1&uin=MzE1MjEyNzg0OQ%3D%3D&devicetype=Windows+10+x64&version=62090072&lang=zh_CN&exportkey=A8rp4q4lW0thsabsSESGia0%3D&pass_ticket=sP%2FI4qmJbQKHOCWKyFHB1IKSnTPOmcp3L0O%2FsQQak%2FA1EUhuhyEle9zGCjw3wI1e)
