---
title: 列操作
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: liecaozuo
slug: nw8n4k
docsId: '26499892'
---

## 添加字段
ALTER TABLE 表明 add 字段名称 类型(int,char,VARCHAR...) DEFAULT 默认值  位置（FIRST, AFTER+字段名称）;
示例：

### 添加到表字段最后
ALTER TABLE el_customer add aaa VARCHAR(20) DEFAULT null COMMENT '测试';
Or
alter table TABLE_NAME add column NEW_COLUMN_NAME varchar(20) not null;

### 添加到第一个
alter table TABLE_NAME add column NEW_COLUMN_NAME varchar(20) not null first;

### 添加到某一列后面
alter table TABLE_NAME add column NEW_COLUMN_NAME varchar(20) not null after COLUMN_NAME;
示例:alter table sys_show_number add IosLink varchar(50)  COMMENT 'IOS跳转url' after NumberUrl

## 修改字段

### 更新字段长度
 alter table 表名  modify  column 名称 类型;

#### 示例：
alter table ivr_strategy modify  column product_name VARCHAR(20);

### 更新字段类型
 alter table <表名> alter column <字段名> 新类型名(长度)

### 修改字段名称
ALTER TABLE TABLENAME Change COL1 COL2 类型 。。。;
 

## 删除字段
ALTER TABLE 表名  DROP字段名称
 
