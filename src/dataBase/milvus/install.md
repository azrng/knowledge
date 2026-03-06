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
  - milvus
---

## docker-compose安装

:::details

```yaml
services:
  etcd:
    container_name: milvus-etcd
    image: registry.cn-hangzhou.aliyuncs.com/zrng/etcd:v3.5.16 # quay.io/coreos/etcd:v3.5.16
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - /data/milvus/etcd:/etcd
    command: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      test: ["CMD", "etcdctl", "endpoint", "health"]
      interval: 30s
      timeout: 20s
      retries: 3

  minio:
    container_name: milvus-minio
    image: registry.cn-hangzhou.aliyuncs.com/zrng/minio:RELEASE.2023-03-20T20-16-18Z # minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    ports:
      - "19541:9001" # 可视化面板 http://localhost:19531/webui/
      - "19540:9000" # 默认端口
    volumes:
      - /data/milvus/minio:/minio_data
    command: minio server /minio_data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  milvus: # 单节点 向量数据库  用户名/密码：root/milvus
    container_name: milvus-standalone
    image: registry.cn-hangzhou.aliyuncs.com/zrng/milvus:v2.5.4 # milvusdb/milvus:v2.5.4
    command: ["milvus", "run", "standalone"]
    security_opt:
    - seccomp:unconfined
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - /data/milvus/milvus:/var/lib/milvus
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9091/healthz"]
      interval: 30s
      start_period: 90s
      timeout: 20s
      retries: 3
    ports:
      - "19530:19530" # 默认端口
      - "19531:9091" # 可视化面板
    depends_on:
      - "etcd"
      - "minio"

networks:
  default:
    name: milvus
```

:::

## 可视化界面

Attu：[https://zilliz.com.cn/attu](https://zilliz.com.cn/attu)

