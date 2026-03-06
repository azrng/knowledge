---
title: 常用脚本
lang: zh-CN
date: 2023-09-24
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: changyongjiaoben
slug: uk5odo
docsId: '29455054'
---

## 安装gitlab
1.创建一个全新的虚拟机，并且至少有4g运行内存
2.安装docker以及docker_compose
3.将ssh的默认的22端口，修改为60022端口
vi /etc/ssh/sshd_config
port 22->60022
systemctl restart sshd
4.docker-compose.yml文件去安装gitlab(下载和运行时间比较长)
```
version: '3.1'
services: 
  image: 'twang2218/gitlab-ce-zh:11.1.4'
  container_name: 'gitlab'
  restart: always
  privileged: true
  hostname: 'gitlab'
  environment: 
    TZ: 'Asiz/Shanghai'
    GITLAB_OMNIBUS_CONFIG: |
      external_url 'http:/192.168.199.110'
      gitlab_rails['time_zone']='Asia/Shanghai'
      gitlab_rails['smtp_enable']=true
      gitlab_rails['gitlab_shell_ssh_port']=22
  ports: 
    - '80:80'
    - '443:443'
    - '22:22'
  volumes: 
    - /opt/docker_gitlab/config:/etc/gitlab
    - /opt/docker_gitlab/data:/var/opt/gitlab
    - /opt/docker_gitlab/logs:/var/log/gitlab
```

## 安装kong
```dockerfile

version: '3.3'
#创建kong_data卷
volumes:
  kong_data: {}
#创建kong-net网络
networks:
  kong-net:
    external: false

services:
  #数据库运行完成之后需要执行kong进行初始化操作
  kong-migrations:
    image: "${KONG_DOCKER_TAG:-kong:latest}"
    command: kong migrations bootstrap
    depends_on:
      - db
    environment:
      KONG_DATABASE: postgres
      KONG_PG_DATABASE: ${KONG_PG_DATABASE:-kong}
      KONG_PG_HOST: db
      KONG_PG_USER: ${KONG_PG_USER:-kong}
      KONG_PG_PASSWORD_FILE: /run/secrets/kong_postgres_password
    secrets:
      - kong_postgres_password
    networks:
      - kong-net
    restart: on-failure
    deploy:
      restart_policy:
        condition: on-failure
  #迁移过程依赖db
  kong-migrations-up:
    image: "${KONG_DOCKER_TAG:-kong:latest}"
    command: kong migrations up && kong migrations finish
    depends_on:
      - db
    environment:
      KONG_DATABASE: postgres
      KONG_PG_DATABASE: ${KONG_PG_DATABASE:-kong}
      KONG_PG_HOST: db
      KONG_PG_USER: ${KONG_PG_USER:-kong}
      KONG_PG_PASSWORD_FILE: /run/secrets/kong_postgres_password
    secrets:
      - kong_postgres_password
    networks:
      - kong-net
    restart: on-failure
    deploy:
      restart_policy:
        condition: on-failure
  ## kong服务
  kong:
    image: "${KONG_DOCKER_TAG:-kong:latest}"
    user: "${KONG_USER:-kong}"
    depends_on:
      - db
    environment:
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: '0.0.0.0:8001'
      KONG_CASSANDRA_CONTACT_POINTS: db
      KONG_DATABASE: postgres
      KONG_PG_DATABASE: ${KONG_PG_DATABASE:-kong}
      KONG_PG_HOST: db
      KONG_PG_USER: ${KONG_PG_USER:-kong}
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_PG_PASSWORD_FILE: /run/secrets/kong_postgres_password
    secrets:
      - kong_postgres_password
    networks:
      - kong-net
    #kong的端口，非https使用8000和8001
    ports:
      - "8000:8000/tcp"
      - "8001:8001/tcp"
      - "8443:8443/tcp"
      - "8444:8444/tcp"
    #健康检查
    healthcheck:
      test: ["CMD", "kong", "health"]
      interval: 10s
      timeout: 10s
      retries: 10
    restart: on-failure
    deploy:
      restart_policy:
        condition: on-failure

  #konga可视化界面
  konga:
    image: pantsel/konga
    networks:
      - kong-net
    depends_on:
      - db
    ports:
      - "1337:1337/tcp"
    environment:
      TOKEN_SECRET: konga
      DB_ADAPTER: postgres
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: kong
      DB_PASSWORD: kong
      DB_DATABASE: kong
    restart: on-failure
    deploy:
      restart_policy:
        condition: on-failure
  ## postgres数据库
  db:
    image: postgres:9.6
    environment:
      POSTGRES_DB: ${KONG_PG_DATABASE:-kong}
      POSTGRES_USER: ${KONG_PG_USER:-kong}
      POSTGRES_PASSWORD_FILE: /run/secrets/kong_postgres_password
    secrets:
      - kong_postgres_password
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "${KONG_PG_USER:-kong}"]
      interval: 30s
      timeout: 30s
      retries: 3
    restart: on-failure
    deploy:
      restart_policy:
        condition: on-failure
    stdin_open: true
    tty: true
    ports:
      - 5432:5432
    networks:
      - kong-net
    volumes:
      - kong_data:/var/lib/postgresql/data

## 用文件统一管理数据库密码
secrets:
  kong_postgres_password:
    file: ./POSTGRES_PASSWORD
```

> 参考文档：[https://mp.weixin.qq.com/s/hkVa4OvCYqisWdvHX9VRhw](https://mp.weixin.qq.com/s/hkVa4OvCYqisWdvHX9VRhw)

