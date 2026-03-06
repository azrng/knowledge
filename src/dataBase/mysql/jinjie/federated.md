---
title: Federated
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: federated
slug: nkkgb5
docsId: '30515991'
---
实现的需求是我想在a库的user表添加数据的时候，同时自动在b库的user表中添加一条数据
相当于主库和从库，主库无论做任何操作都会自动映射到从库中，以此保持数据一致性。

#### 查询是否支持
查询MySQL中是否有Federated这个引擎
```csharp
show engines;
```
> FEDERATED          | NO      | Federated MySQL storage engine          

代表是有的，只不过没有开启

#### 开启federated
在my.cnf中添加federated这一个属性就可开启

![](/common/1611224018393-ce9a539d-b6b9-4bde-83cb-1021ba751c55.png)
然后再查询就发现已经开启了

#### 使用federated
```csharp
   声明引擎        连接属性          账号    密码      ip            port 数据库  表
ENGINE =FEDERATED CONNECTION='mysql://root:lizhenghua@192.168.137.148:3306/zskdb/cas_user';

#从库创建表结构的时候加入上面的引擎
CREATE TABLE `cas_user` (
  `id` varchar(255) NOT NULL COMMENT 'id',
  `encryid` varchar(255) DEFAULT NULL COMMENT '加密后的用户id',
  `name` varchar(255) DEFAULT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `mobile` varchar(40) DEFAULT NULL COMMENT '手机号码',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `sex` int(1) DEFAULT NULL COMMENT '性别（0：男，1：女）',
  `credit` double(11,2) DEFAULT '0.00',
  PRIMARY KEY (`oid`),
  UNIQUE KEY `upk_user_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='用户表'
ENGINE =FEDERATED CONNECTION='mysql://root:zhenghua@192.168.137.148:3306/zskdb/cas_user';
```
注意：只要表结构就行，数据会自动从主库中映射过来。
