---
title: 我的镜像仓库
lang: zh-CN
date: 2024-08-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - images
---

## 概述

因国内拉取镜像常出现超时，部分镜像已同步至阿里云备用。

**镜像加速地址**: [https://www.kelen.cc/dry/docker-hub-mirror](https://www.kelen.cc/dry/docker-hub-mirror)

## 镜像站

- [微软镜像列表](https://mcr.microsoft.com/)
- [渡渡鸟镜像同步站](https://docker.aityp.com/)
- [轩辕 Docker 镜像搜索](https://dockers.xuanyuan.me/)
- [开源软件镜像帮助站点](https://help.mirrors.cernet.edu.cn/)

---

## 现有产品

### 短连接
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/tinyurl:1.0
```

### AI流式查看器
```shell
docker run -d --name ai-stream-viewer -p 8080:80 --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/zrng/ai-stream-viewer:1.0.0
```

---

## .NET

**官网**: [https://mcr.microsoft.com/zh-cn/product/dotnet/nightly/sdk/tags](https://mcr.microsoft.com/zh-cn/product/dotnet/nightly/sdk/tags)
**Docker Hub**: [https://hub.docker.com/_/microsoft-dotnet](https://hub.docker.com/_/microsoft-dotnet)

### Runtime
```shell
# mcr.microsoft.com/dotnet/runtime
# 代理后地址：registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:6.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:8.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:8.0-alpine3.18
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:9.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:9.0-alpine3.22-arm64v8
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:10.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:10.0-alpine3.22
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetruntime:10.0-alpine3.22-arm64v8
```

### ASP.NET
```shell
# mcr.microsoft.com/dotnet/aspnet 
# 代理后地址：registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:6.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:8.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:8.0-alpine3.18
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:9.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:9.0-alpine3.20
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:9.0-alpine3.22-arm64v8
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:10.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:10.0-alpine3.22
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetaspnet:10.0-alpine3.22-arm64v8
```

### SDK
```shell
# mcr.microsoft.com/dotnet/sdk
# 代理后地址：registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:6.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:8.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:8.0-alpine3.18
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:9.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:9.0-alpine3.20
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:9.0-alpine3.22-arm64v8
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:10.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:10.0-alpine3.22
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/dotnetsdk:10.0-alpine3.22-arm64v8
```

---

## Python
```shell
# python:3.13-slim
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/python:3.13-slim
```

---

## 数据库

### PostgreSQL
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/postgres:16.4

# library/postgres:17.4
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/postgres:17.4

# pgvector/pgvector:0.8.0-pg17
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/pgvector:0.8.0-pg17
```

#### pgexplain_pev

官网：[https://explain.tensor.ru/downloads-packages/](https://explain.tensor.ru/downloads-packages/)

```shell
# pg-explain-db-1.11.6-20250129.docker.tar
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/pgexplain_db:1.11.6

# pg-explain-light-1.11.14-20250203.macwin.docker.tar
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/pgexplainlight_app_macwin:1.11.14
```

### MSSQL
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mssql:2017-latest
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mssql:2019-latest
```

### MySQL
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mysql:5.7
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mysql:8.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mysql:8.0.39
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mysql:8.4.2
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mysql:9.0.1
```

### Redis
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/redis:7.4.0
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/redis:6.2.14-arm64-bugignore
```

### Elasticsearch
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/elasticsearch:7.16.3
```

### ClickHouse
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/clickhouse-server:24.8.7.41
```

### Milvus
```shell
# etcd
## quay.io/coreos/etcd:v3.5.16
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/etcd:v3.5.16


# milvus
## milvusdb/milvus:v2.5.4
docker push registry.cn-hangzhou.aliyuncs.com/zrng/milvus:v2.5.4
```

### Qdrant
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/qdrant:v1.13.4
```

---

## 消息队列

### RabbitMQ
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/masstransit-rabbitmq:3.13.1
```

---

## 对象存储

### MinIO
```shell
# minio/minio:RELEASE.2023-03-20T20-16-18Z
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/minio:RELEASE.2023-03-20T20-16-18Z

# minio/minio:RELEASE.2024-02-17T01-15-57Z
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/minio:RELEASE.2024-02-17T01-15-57Z
```

---

## 大模型

### Ollama
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/ollama:0.4.6
```

### MaxKB
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/maxkb:1.8.0
```

### Dify
```shell
# langgenius/dify-api:1.0.0
registry.cn-hangzhou.aliyuncs.com/zrng/langgenius-dify-api:1.0.0

# langgenius/dify-web:1.0.0
registry.cn-hangzhou.aliyuncs.com/zrng/langgenius-dify-web:1.0.0


# langgenius/dify-sandbox:0.2.10
registry.cn-hangzhou.aliyuncs.com/zrng/langgenius-dify-sandbox:0.2.10

# langgenius/dify-plugin-daemon:0.0.3-local
registry.cn-hangzhou.aliyuncs.com/zrng/langgenius-dify-plugin-daemon:0.0.3-local
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/langgenius-dify-plugin-daemon:0.0.6.1-local

# semitechnologies/weaviate:1.19.0
registry.cn-hangzhou.aliyuncs.com/zrng/semitechnologies-weaviate:1.19.0

# ubuntu/squid:edge
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/ubuntu-squid:edge
```

---

## 第三方工具

### Nginx
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/nginx:1.27.1
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/nginx:alpine3.20
```

### GitLab
```shell
# origin：gitlab/gitlab-ce
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/gitlab-ce:17.3.1-ce.0

# origin：gitlab/gitlab-runner:latest
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/gitlab-runner:v17.2.1
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/gitlab-runner:17.3.1
```

### Docker
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/docker:27.2.0
```

### Gogs
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/gogs:0.13.0
```

### Seq
```shell
# origin：datalust/seq:latest
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/seq:2024.3
```

### YAPI
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/yapi:play
```
> 管理员账号: `admin@docker.yapi` / 密码: `adm1n`

### Mdnice
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/mdnice:latest
```

### Keycloak
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/keycloak:24.0.2
```

### Kibana
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/kibana:7.16.3
```

### Grafana
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/grafana:9.4.3
```

### Prometheus
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/prometheus:v2.37.6
```

### Smalte
```shell
docker pull registry.cn-hangzhou.aliyuncs.com/zrng/smalte:alpine-3.8-arm64
```
