---
title: Docker部署常用服务
lang: zh-CN
date: 2023-09-12
publish: true
author: azrng
isOriginal: true
category:
  - cloud
tag:
  - 无
filename: dockerbushuchangyongfuwu
slug: tu8lci
docsId: '43386348'
---
> Docker在线版：[https://labs.play-with-docker.com/](https://labs.play-with-docker.com/)


## Docker可视化
```yaml
docker run -d -p 9000:9000  --name portainer --restart always  -v /var/run/docker.sock:/var/run/docker.sock --restart=always --name prtainer portainer/portainer
```

## 容器日志Dozzle

Dozzle 是 一款基于接口来监视Docker日志的轻量级的应用，它不存储任何日志文件，而仅仅是实时监视你的容器日志。

官网：https://dozzle.dev/

Github：https://github.com/amir20/dozzle

功能：查看容器、容器内存占用、容器日志、容器日志搜索、容器管理(停止和启动)

### 部署

docker部署

```sh
#  简单方案：不带密码的方案
docker run --name dozzle -d --volume=/var/run/docker.sock:/var/run/docker.sock -p 9090:8080 amir20/dozzle:latest
```

docker-compose部署，支持多种认证方式，这里采用了文件存储账号密码的方式使用

```yaml
version: '3'

services:
  dozzle: # 用于查看容器的日志 
    container_name: dozzle
    image: amir20/dozzle
    environment:
      - DOZZLE_ENABLE_ACTIONS=true # 启动容器操作
      - DOZZLE_AUTH_PROVIDER=simple # 启用基于文件的认证 配置的管理员账号密码：admin/123456
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./config/dozzle:/data
    ports:
      - 9090:8080 # web管理界面
    restart: always
```

users.yml文件用于保存账号密码

```yaml
users:
  # 登录账号为 admin
  admin:
    # 用户名
    name: "admin"
    # 将密码 sha256 处理后放到这里，这里值为： 123456
    password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
    email: admin@example.com
  guest:
    name: "Guest"
    password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"
    email: guest@example.com
```

部署后访问`IP `+ `9090`端口访问（需要设置相关安全组或防火墙规则）。

## RabbitMQ

```
docker run -d --name myrabbit -p 9005:15672 -p 5672:5672  -e RABBITMQ_DEFAULT_VHOST=customer -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=123456  rabbitmq:3-management-alpine
```
> 命令说明：
> -d：后台运行
> --name：设置名称
> -p：设置端口
> -e：配置命令


## 可视化Nginx
部署nginx-gui
```yaml
docker run --name nginxwebui -itd -v /root/nginxWebUI:/home/nginxWebUI -v /var/net:/home/nginxWebUI/data -e BOOT_OPTIONS="--server.port=9008" --privileged=true --net=host  cym1102/nginxwebui:latest
```

## Git服务

### Gitlab
```bash
## 挂载
docker run -d  -p 443:443 -p 9006:80 -p 222:22 --name gitlab --restart always -v /home/gitlab/config:/etc/gitlab -v /home/gitlab/logs:/var/log/gitlab -v /home/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce

## 不挂载
docker run -d  -p 443:443 -p 9006:80 -p 222:22 --name gitlab gitlab/gitlab-ce
```
> -d：后台运行
> -p：将容器内部端口向外映射
> --name：命名容器名称
> -v：将容器内数据文件夹或者日志、配置等文件夹挂载到宿主机指定目录


### Gitea
```bash
docker run -d --name=gitea -p 10022:22 -p 9004:3000 -v /var/lib/gitea:/data gitea/gitea

docker run -d --privileged=true --restart=always --name=gitea -p 10022:22 -p 9004:3000 -v /var/lib/gitea:/data gitea/gitea
```

## 数据库

### Redis
```yaml
docker run -p 6379:6379 --name redis -d redis redis-server --appendonly yes --requirepass "123456"
```
> 命令说明：
> -p：宿主机端口与容器端口映射，前面的端口为主机映射端口（需配置服务器安全组），后面的端口为镜像开放的端口
> --restart=always：无论什么情况服务挂掉，总是重启
> --name：容器名称
> -d：使用指定的镜像，在后台运行容器
> --appendonly yes：redis运行时开启持久化
> --requirepass “123456”：设置redis登陆密码


### MySQL
```
docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=123456 -e TZ:Asia/Shanghai -d mysql --lower_case_table_names=1
```

### MongoDB
```csharp
docker run -p 27017:27017 --name mongo -e TZ=Asia/Shanghai -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=123456 -d mongo
```

### MSSQL
```bash
## 拉取镜像
docker pull mcr.microsoft.com/mssql/server:2017-latest

## 查看镜像
docker images

## 启动镜像生成容器 
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Sql987654"  -p 1433:1433 --name sqlserver  -d mcr.microsoft.com/mssql/server:2017-latest
或者使用阿里云镜像源
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Sql987654"  -p 1433:1433 --name sqlserver  -d registry.cn-hangzhou.aliyuncs.com/zrng/mssql:2019-latest
```

### Postgresql
```bash
docker run  -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=123456  postgres 
```

### Oracle
```csharp
docker run -d -it -p 1521:1521 --name oracle11g --restart=always registry.cn-hangzhou.aliyuncs.com/helowin/oracle_11g

//连接的用户名/密码是system/helowin
```
> 资料：[https://blog.csdn.net/chy555chy/article/details/124345973](https://blog.csdn.net/chy555chy/article/details/124345973)


## 监控

### Grafana
```bash
docker run -d -p 3000:3000 --name grafana grafana/grafana
```

## 其他

### chatgpt-web
仓库地址：[https://github.com/Chanzhaoyu/chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web)

```csharp
docker run --name chatgpt-api --restart=always -d -p 3002:3002 --add-host="host.docker.internal:host-gateway" --env SOCKS_PROXY_HOST=host.docker.internal --env SOCKS_PROXY_PORT=7890  --env OPENAI_API_MODEL=gpt-4  --env OPENAI_API_KEY=<your openapi_key>  chenzhaoyu94/chatgpt-web
```
--add-host="host.docker.internal:host-gateway" ：这里是因为docker需要用宿主机网络环境，可以添加"host.docker.internal:host-gateway"的host使用宿主机网络环境，需要docker版本22.10及以上才支持，[参考](https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66)
--env SOCKS_PROXY_HOST=host.docker.internal ：Sock方式代理的host，这里指使用宿主机代理(因为我有魔法上网)
--env SOCKS_PROXY_PORT=7890：Sock方式代理的端口，clash for windows的默认端口是7889，可以改成你们的代理端口
--env OPENAI_API_MODEL=gpt-4 ：默认使用模型
--env OPENAI_API_KEY= : 你的openapi的key

参考资料：[https://www.cnblogs.com/xiaxiaolu/p/17603891.html](https://www.cnblogs.com/xiaxiaolu/p/17603891.html)
