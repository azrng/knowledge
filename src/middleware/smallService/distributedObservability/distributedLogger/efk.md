---
title: 分布式日志-EFK
lang: zh-CN
date: 2023-07-27
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: fenbushirizhi-efk
slug: pnyg57
docsId: '32905026'
---

## 概述



## 安装
生成elasticsearch和kibana
```csharp
version: '3.1'

services:

  elasticsearch:
   container_name: elasticsearch
   image: elasticsearch:7.6.2
   ports:
    - 9200:9200
   volumes:
    - elasticsearch-data:/usr/share/elasticsearch/data
   environment:
    - xpack.monitoring.enabled=true
    - xpack.watcher.enabled=false
    - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    - discovery.type=single-node
   networks:
    - elastic

  kibana:
   container_name: kibana
   image: kibana:7.6.2
   ports:
    - 5601:5601
   depends_on:
    - elasticsearch
   environment:
    - ELASTICSEARCH_URL=http://localhost:9200
   networks:
    - elastic
  
networks:
  elastic:
    driver: bridge
```
> 参考文档：[https://www.cnblogs.com/JulianHuang/p/13345277.html](https://www.cnblogs.com/JulianHuang/p/13345277.html)


