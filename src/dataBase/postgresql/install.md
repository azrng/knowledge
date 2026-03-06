---
title: 安装
lang: zh-CN
date: 2022-11-10
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - install
  - pgsql
  - database
filename: anzhuang
slug: bfqyfumvll6fol0z
docsId: '105683263'
---

## windows

在Windows上安装PostgreSQL：https://mp.weixin.qq.com/s/OUMtSLO-03NCJXqOaEYOwQ

## ubuntu

安装数据库：https://www.postgresql.org/download/linux/ubuntu/

## docker

```sql
docker run -d -p 5432:5432 --name mypostgres -e POSTGRES_PASSWORD=123456 postgres
```
假如无法外部访问，需要设置允许外部连接的方案(不过几乎用不到，上面的命令启动后默认支持外部访问的)
```shell
-- 进入容器
-- 进入指定目录
cd /var/lib/postgresql/data

-- 更新pg_hba.config文件(如果没有vim  使用apt-get安装：apt-get install vim)
vim pg_hba.conf
-- 找到## IPv4 local connections:后，回车另起一行，添加参数行如下，保存。
host all all 0.0.0.0/0 trust

-- 更新postgresql.conf配置postgrsql数据库服务器的相应参数
 vim postgresql.conf
-- 找到“listen_addresses“参数后，设置listen_addresses = ‘*’，保存。
```

## 其他配置

### 设置允许远程连接

修改**pg_hba.conf **文件(在安装路径下的data目录下)配置PostgreSQL数据库的访问权限，编辑文件找到`# IPv4 local connections:`后，回车另起一行，添加参数行如下，保存。
```shell
host all all 0.0.0.0/0 md5
```

其中0.0.0.0/0表示运行任意ip地址访问。



修改postgresql.conf文件(在安装路径下的data目录下)，配置监听地址，编辑文件找到“listen_addresses“参数后，设置

```shell
listen_addresses = '*'
```

修改完成后重启数据库服务然后就可以被远程连接了。



如果还不能连接，那么就考虑防火墙是否关闭或者是否开放了端口等问题。

[no encryption pg hba.conf](https://blog.csdn.net/cuisidong1997/article/details/135522383)

### 设置自定义端口

修改`data/postgresql.conf`文件，如果没有这个文件就先启动一下服务，在生成后然后进行修改，找到里面的port端口配置，修改为指定的配置。

