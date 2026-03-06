---
title: Docker-compose部署redis
lang: zh-CN
date: 2021-07-31
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: docker-composebushuredis
slug: patcsq
docsId: '29714445'
---
```csharp
version: '3.4'

services:
  redis:
    image: redis
    container_name: redis
    hostname: redis
    restart: always
    ports:
      - 6379:6379
    networks:
      - net_db
    volumes:
      - ./conf/redis.conf:/etc/redis/redis.conf:rw
      - ./data:/data:rw
    command:
      redis-server /etc/redis/redis.conf --appendonly yes

networks:
  net_db:
    driver: bridge
```
> 教程：[https://www.cnblogs.com/ray-mmss/p/12249204.html](https://www.cnblogs.com/ray-mmss/p/12249204.html)


