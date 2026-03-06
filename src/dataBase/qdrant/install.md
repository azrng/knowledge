---
title: 安装
lang: zh-CN
date: 2025-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - qdrant
---

## docker-compose安装

```yaml
services:
  qdrant: # 向量数据库
    image: qdrant/qdrant
    container_name: qdrant
    ports:
      - 8125:6333 # 服务端口
      - 8126:6334 # grpc端口
    environment:
      TZ: Asia/Shanghai
    volumes:
      - $PWD/data/qdrant:/qdrant/storage
      - $PWD/config/qdrant/config:/qdrant/config
    networks:
      - my-bridge
```

