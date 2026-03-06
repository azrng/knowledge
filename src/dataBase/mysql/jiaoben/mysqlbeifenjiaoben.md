---
title: MySQL备份脚本
lang: zh-CN
date: 2023-02-27
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: mysqlbeifenjiaoben
slug: qt6gbnn483gtqi6r
docsId: '115947937'
---

## 概述
 脚本默认备份全库，也可以备份某个表，可以设置保留周期，结果压缩，将备份结果发送邮件通知。

## 内容
```python

#!/bin/bash

## 数据表名称，可以为空
table_name=$1

## 数据库名称
database_name=test_data
## 备份周期，单位为天
backup_period=30
## 备份目录
backup_dir=/date/mysql/backup
## 邮箱地址
email_address=xxxxx@mail.qq
## MySQL账号
mysql_user=root
## MySQL密码
mysql_password=root1234

## 获取当前日期
date_str=`date +%Y-%m-%d`

## 备份文件名
if [[ -z "$table_name" ]]; then
    backup_file_name="${database_name}_${date_str}.sql"
else
    backup_file_name="${database_name}_${table_name}_${date_str}.sql"
fi

## 压缩后备份文件名
if [[ -z "$table_name" ]]; then
    compressed_backup_file_name="${database_name}_${date_str}.tar.gz"
else
    compressed_backup_file_name="${database_name}_${table_name}_${date_str}.tar.gz"
fi

## 备份文件路径
backup_file_path="${backup_dir}/${backup_file_name}"

## 压缩后备份文件路径
compressed_backup_file_path="${backup_dir}/${compressed_backup_file_name}"

## 检查备份目录是否存在，如果不存在则创建
if [[ ! -d "$backup_dir" ]]; then
    mkdir -p "$backup_dir"
fi

## 备份MySQL数据表
if [[ -z "$table_name" ]]; then
    mysqldump -u"$mysql_user" -p"$mysql_password" "$database_name" > "$backup_file_path"
else
    mysqldump -u"$mysql_user" -p"$mysql_password" "$database_name" "$table_name" > "$backup_file_path"
fi

## 压缩备份文件
tar -czvf "$compressed_backup_file_path" "$backup_file_path"

## 删除备份文件
rm -f "$backup_file_path"

## 检查备份结果
if [[ -f "$compressed_backup_file_path" ]]; then
    echo "备份成功！"
    echo "备份文件路径：$compressed_backup_file_path"
    subject="MySQL备份成功"
    body="MySQL备份成功，备份文件路径：$compressed_backup_file_path"
else
    echo "备份失败！"
    subject="MySQL备份失败"
    body="MySQL备份失败！"
fi

## 发送备份结果到指定邮箱
echo "$body" | mail -s "$subject" "$email_address"

## 删除过期备份文件
find "$backup_dir" -mtime +"$backup_period" -name "*.tar.gz" -exec rm {} \;
```
执行示例
```python
#默认备份整库
./mysql_back.sh
#备份test_table_name表
./mysql_back.sh test_table_name  
```
