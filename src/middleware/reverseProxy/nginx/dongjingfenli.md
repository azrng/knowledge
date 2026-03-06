---
title: 动静分离
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: dongjingfenli
slug: dlp499
docsId: '29395044'
---

## 说明
动态跟静态请求分开，不能理解成只是单纯把动态页面和静态页面物理分离。严格意义上应该是动态请求跟静态请求分开，可以理解成使用nginx处理静态页面，其他服务器处理动态页面。

## 实现方式
1.纯碎把静态文件(js、css)单独成单独的域名，放在独立的服务器上，也是目前主流推崇的方案。
2.将动态跟静态文件混合在一起发布，通过nginx来分开。

## localhost配置

### 动态资源代理
配置文件增加
```nginx
localhost /{
		proxy_pass www.baidu.com;#转发地址
}
```

### 静态资源代理 
```nginx
localhost /｛
    root /root/; #静态资源路径
    Index a.txt; #默认访问选项
    autoindex on; #列表当前文件夹内容
｝
```

### 完整动静分离配置
```nginx
  upstream eap_website {
      server eapwebsite;
    }

  server {
      listen      80;
      location / {            ## 静态资源
            root /usr/share/nginx/html;
            index index.html index.htm;
            try_files $uri /index.html;
      }

      location ^~ /api/  {     ## 动态资源
         proxy_pass         http://eap_website/api/;
      }

      location ^~ /swagger/  {    ## 动态资源
         proxy_pass         http://eap_website/swagger/;
      }
  }
```
 

 
 
