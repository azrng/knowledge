---
title: 容器安装
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
---

:::tip

下面示例创建的mysql实例其数据都在容器内部存储，容器删除数据就没了，所以如果要保存数据要考虑挂载容器

:::

## docker部署mysql

拉取镜像

```csharp
docker pull mysql
```

创建mysql实例创建MySQL实例

```csharp
docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 -e TZ:Asia/Shanghai -d mysql --lower_case_table_names=1
```

操作数据库

进入容器命令：docker exec -it mysql bash
登录命令：mysql -uroot -p 123456
显示当前数据库
命令：show databases;

## docker-compose部署mysql

```yaml
version: '3.8'
services: 
  mysql:  #mysql数据库
    container_name: mysql
    image: mysql
    ports: 
      - "3306:3306"
    restart: always
    environment: 
      MYSQL_DATABASE: "test"
      MYSQL_ROOT_PASSWORD: "123456"
      TZ: Asia/Shanghai
    volumes:
      - $PWD/conf:/etc/mysql/conf.d
      - $PWD/logs:/logs
      - $PWD/data:/var/lib/mysql
    logging: 
      driver: "json-file"
      options: 
        max-size: "5g"
    networks: 
      - my-bridge
```

然后拉取镜像启动成功：当前环境已经可以正常外部连接
进入容器
命令：docker exec -it mysql bash
登录mysql
命令：mysql -uroot -p
输入密码