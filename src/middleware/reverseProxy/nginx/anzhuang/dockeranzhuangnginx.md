---
title: docker安装nginx
lang: zh-CN
date: 2023-09-21
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: dockeranzhuangnginx
slug: bddemz
docsId: '29395183'
---

## docker安装
```bash
## 拉取镜像
docker pull nginx

## 启动nginx容器
docker run -d -p 8080:80 --name hellonginx nginx

## 进入nginx容器
docker exec -it nginx bash
## Nginx.conf文件分为http块  events块 server块 
 
## 如果nginx容器使用vi或者vim，需要执行命令安装
apt-get update
apt-get install vim 
```

## docker-compose
```yaml
version: '3.1'
services: 
  nginx:
    container_name: nginx
    restart: always
    image: nginx #daocloud.io/library/nginx:1.13.2
    ports: 
      - 80:80
    volumes:
      - ./conf.d:/etc/nginx/conf.d
      ## - html:/usr/share/nginx/html
    networks: 
        - my-bridge

networks: 
    my-bridge:
        driver: bridge
```
