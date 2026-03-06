---
title: Docker-compose部署mongodb
lang: zh-CN
date: 2023-04-25
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: docker-composebushumongodb
slug: ayb5ws
docsId: '30252294'
---
```dockerfile
mongo: #内存数据库服务
    container_name: mongo
    image: mongo
    hostname: mongo
    restart: always
    ports: 
      - "27017:27017"
    environment: 
      TZ: Asia/Shanghai
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: 123456
```
> 教程：[https://www.cnblogs.com/ray-mmss/p/12255388.html](https://www.cnblogs.com/ray-mmss/p/12255388.html)

```yaml
docker run -p 27017:27017 --name mongo -e TZ=Asia/Shanghai -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=123456 -d mongo
```

