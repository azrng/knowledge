---
title: 说明
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
## 命令行操作

登录MySQL：mysql -u root -p
重启MySQL服务：service mysql restart 或者systemctl restart mysqld
查询mysql是否运行：ps -ef | grep -i mysql
重启mysql服务：systemctl restart mysqld
关闭mysql服务：systemctl stop mysqld

## 字符集

数据库和表的字符集统一使用utf8mb4-general-ci 
兼容性更好，统一字符集可以避免由于字符集转换产生的乱码，不同的字符集进行比较前需要进行转换会造成索引失效；
utf8mb4支持emojj表情符

字符集：utf8mb4
排序规则：utf8mb4_german2_ci

## 修改配置

### 修改密码

```sh
-- 只本地连接的配置 root密码修改
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
-- 允许远程连接的配置 root密码修改
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
```

### 远程访问授权

```sh
create user 'root'@'%' identified with mysql_native_password by 'root';
grant all privileges on *.* to 'root'@'%' with grant option;
flush privileges;
```

### 修改加密规则

```sh
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root' PASSWORD EXPIRE NEVER;
flush privileges; 
```
