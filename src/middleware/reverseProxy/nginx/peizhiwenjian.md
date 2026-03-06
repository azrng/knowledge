---
title: 配置文件
lang: zh-CN
date: 2023-10-02
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: peizhiwenjian
slug: qn37g6
docsId: '26511815'
---

## 说明
linux里面的配置文件所在的位置：/user/local/nginx/conf/nginx.conf

## 三部分组成
1.全局块
设置影响nginx服务器整体运行的配置指令
2.events块
影响nginx服务器与用户的网络连接
3.http全局块
包括：http全局块和server块

## 默认配置
```nginx
location / {
  root   /usr/share/nginx/html;
  index  index.html index.htm;
}
```

## 完整的配置文件
```nginx
user root;
worker_processes auto;
events { worker_connections 4096;}
http {
    sendfile on;
    gzip              on;
    gzip_http_version 1.0;
    gzip_proxied      any;
    gzip_min_length   500;
    gzip_disable      "MSIE [1-6]\.";
    gzip_types        text/plain text/xml text/css
                      text/comma-separated-values
                      text/javascript
                      application/x-javascript
                      application/atom+xml;

    proxy_buffer_size   128k;
		proxy_buffers   4 256k;
		proxy_busy_buffers_size   256k;
		large_client_header_buffers 4 16k;             
    client_header_timeout 600;
    client_body_timeout  100;                           

    include        mime.types;
    default_type   application/octet-stream;


    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            proxy_pass http://47.104.255.61:8000;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```

## 常用配置

### 后端配置
```nginx
location ~ /myapi/{
 	  rewrite ^/myapi/(.*)$ /$1 break; #截取掉myapi
    proxy_pass http://localhost:5000/; #被代理服务器的站点地址
  	proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-Proto $scheme; #将请求使用的协议告知被代理服务器
    proxy_set_header   Host $http_host; ## 将请求的地址告知被代理服务器
    proxy_set_header   X-Forwarded-Prefix myapi; #将路由名称"myapi"告知被代理服务器
  	deny 127.0.0.1;  #拒绝的ip
    allow 172.18.5.54; #允许的ip  
}

## 添加配置1（配置1和2可以同事监听80端口，绑定不同域名，实现一台服务器nginx同时配置多个前端网站，多个域名空格隔开）
server {
    listen 80;
    server_name 域名1 域名2 localhost;

    location / {
        proxy_set_header HOST $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_pass http://127.0.0.1:端口/;
    }
}
```

### 代理静态网站
```nginx
## 代理静态网站 root指定磁盘目录
server {
    listen       80;
    server_name  域名1 域名2 多个域名空格隔开 localhost;
    location / {
       try_files $uri $uri/ /index.html;
       root D:\test-web;
    }
}
```

### 前后端分离项目示例
```nginx
##前端配置
location /gov_flow {
                ##放再nginx下的/content/gov_flow目录
                alias /var/html/gov_flow;
                try_files $uri $uri/ /index.html;
                index index.html;
        }
        
##后端接口配置            
location /stage-prod-api/ {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://flow:9083/;
    }
location /stage-test-api/{
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://localhost:8080/;
}
    
#两个后端项目接口合并成一个 给前端访问9991
server {
    listen       9991;
    server_name  localhost;
    location /yqt/{
        proxy_pass http://127.0.0.1:8888/yqt/;
    }

    location /ad/{
        proxy_pass http://127.0.0.1:8090/ad/;
    }
}   
```

### IP代理
可以通过下面的方法获取真实的IP
```nginx
location /IdentityService/ {
  proxy_pass  http://localhost:50402/;
  proxy_set_header Host $host;  将请求的地址告知被代理服务器
    proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Real-PORT $remote_port;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto  $scheme; #将请求使用的协议告知被代理服务器
  proxy_set_header X-Forwarded-Prefix IdentityService; #将路由名称"IdentityService"告知被代理服务器
}
```

### 配置证书
示例一
```csharp
http{
  #http节点中可以添加多个server节点
  server{
      #ssl 需要监听443端口
      listen 443;
      ## CA证书对应的域名
      server_name www.ilovey.live;
      ## 开启ssl
      ssl on;
      ## 服务器证书绝对路径
      ssl_certificate /www/server/nginx/conf.d/4467149_www.ilovey.live.pem;
      ## 服务器端证书key绝对路径 
      ssl_certificate_key /www/server/nginx/conf.d/4467149_www.ilovey.live.key;
      ## session超时
      ssl_session_timeout 5m;
      ## 协议类型
      ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
      ## ssl算法列表 
      ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
      ##  是否 服务器决定使用哪种算法  on/off   TLSv1.1 的话需要开启
      ssl_prefer_server_ciphers on;

      location ^~  /zhihao/ {
          proxy_set_header Host $host;
          proxy_pass http://127.0.0.1:8080/;
      }
  }
  ## 如果用户通过 http 访问 直接重写 跳转到 https 这个是一个很有必要的操作
  server{
      listen 80;
      server_name www.ilovey.live;
      rewrite ^/(.*)$ https://www.ilovey.live:443/$1 permanent;
  }
}
```
示例二
```csharp
server
{
  listen 80;
  listen 443 ssl http2;
  server_name ilovey.live;
  index index.php index.html index.htm default.php default.htm default.html;
  root /www/wwwroot/网站目录;

  #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
  #error_page 404/404.html;
  ssl_certificate    /www/server/nginx/conf.d/4467149_www.ilovey.live.pem;
  ssl_certificate_key    /www/server/nginx/conf.d/4467149_www.ilovey.live.key;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;
  ssl_session_timeout 10m;
  error_page 497  https://$host$request_uri;


  #SSL-END

  #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
  #error_page 404 /404.html;
  #error_page 502 /502.html;
  #ERROR-PAGE-END

  #PHP-INFO-START  PHP引用配置，可以注释或修改

  #PROXY-START
  location /
  {
      proxy_pass http://localhost:8886;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header REMOTE-HOST $remote_addr;

      #持久化连接相关配置
      #proxy_connect_timeout 30s;
      #proxy_read_timeout 86400s;
      #proxy_send_timeout 30s;
      #proxy_http_version 1.1;
      #proxy_set_header Upgrade $http_upgrade;
      #proxy_set_header Connection "upgrade";
      ##expires 12h;
  }

  #PHP-INFO-END



  #禁止访问的文件或目录
  location ~ ^/(\.user.ini|\.htaccess|\.git|\.svn|\.project|LICENSE|README.md)
  {
      return 404;
  }

  #一键申请SSL证书验证目录相关设置
  location ~ \.well-known{
      allow all;
  }
}
```

## 示例配置
```nginx
location /swagger{
        rewrite ^/swagger/(.*)$ /$1 break;
        ## proxy_pass http://localhost:5000;
        proxy_pass http://www.baidu.com;
    }
```

### 基础的通过80端口转发
```nginx
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            proxy_pass http://47.104.255.61:8000;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

```

### 通过其他参数转发
```nginx
server {
    listen       80;
    server_name  47.104.255.61;
    
    location ~ /web/{
        root   html;
        rewrite ^/web/(.*)$ /$1 break;
        proxy_pass http://47.104.255.61:8000;
        index  index.html index.htm;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```
请求地址：[http://47.104.255.61](http://47.104.255.61)/web/Home/Login

其他写法
```nginx
location /swagger{
  rewrite ^/swagger/(.*)$ /$1 break;
  ## proxy_pass http://localhost:5000;
  proxy_pass https://baike.baidu.com;
}
```
想要访问：[https://baike.baidu.com/item/%E6%B5%8B%E8%AF%95/112688](https://baike.baidu.com/item/%E6%B5%8B%E8%AF%95/112688)
只需要访问：localhost/swagger/item/%E6%B5%8B%E8%AF%95/112688


或者
```csharp
location /IdentityService/ {
    proxy_pass  http://localhost:50402/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Real-PORT $remote_port;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto  $scheme;
}


```
原请求地址：localhost:50402/login/CreateWorld
现请求地址：localhost/IdentityService/login/CreateWorld

## 问题处理

### 不能访问子路径错误
```nginx
location /flow {
    proxy_pass http://127.0.0.1:9083/;
}

## 修改
location /flow/ {
    proxy_pass http://127.0.0.1:9083/;
}
解决：/flow 后面加个/

配置多个前端代码/a/ /b/不能访问
解决：把/a/ /b/放在根目录下面 （就是只有一个根目录，不过根目录里面可以放很多项目文件夹）

去掉请求后面的斜杠 添加在location节点里面 解决浏览器请求拼接到接口前面的诡异问题
rewrite ^/(.*)/$ /$1 permanent;
```

## 资料
自动生成配置文件：[https://www.digitalocean.com/community/tools/nginx?global.app.lang=zhCN](https://www.digitalocean.com/community/tools/nginx?global.app.lang=zhCN)
