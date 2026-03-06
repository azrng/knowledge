---
title: Issue
lang: zh-CN
date: 2023-10-20
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - signalr
---
## nginx使用WeSocket问题

如果直接使用会提示错误：
![image.png](/common/1614392761475-1a951725-a938-4c2c-99eb-b36f01ef48a8.png)
问题的原因是：nginx没有启用wesocket

现在给nginx增加配置
```csharp
location ~* ^/backuph5/ {
            rewrite ^/backuph5/(.*)$ /$1 break;
            proxy_pass                http://192.168.7.250:5560;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
```
然后发现这个服务里面的接口都提示跨域了，然后搜索答案
HTTP的Upgrade协议头机制用于将连接从HTTP连接升级到WebSocket连接，Upgrade机制使用了Upgrade协议头和Connection协议头。
最后增加了一个localhost，这个localhost必须在之前那个localhost的上面
```csharp
location ~  /backuph5/chatHub {
            rewrite ^/backuph5/(.*)$ /$1 break;
            proxy_pass                http://192.168.7.250:5560;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
```


文档：https://blog.csdn.net/chszs/article/details/26369257

