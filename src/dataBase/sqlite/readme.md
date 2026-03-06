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
filename: jieshao
slug: eru5s5
docsId: '31763358'
---

## 概述
SQLite是一个进程内的库，实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎。它是一个零配置的数据库，这意味着与其他数据库一样，您不需要在系统中配置。

## 为什么使用
不需要一个单独的服务器进程或操作的系统（无服务器的）。
SQLite 不需要配置，这意味着不需要安装或管理。
一个完整的 SQLite 数据库是存储在一个单一的跨平台的磁盘文件。
SQLite 是非常小的，是轻量级的，完全配置时小于 400KiB，省略可选功能配置时小于250KiB。
SQLite 是自给自足的，这意味着不需要任何外部的依赖。
SQLite 事务是完全兼容 ACID 的，允许从多个进程或线程安全访问。
SQLite 支持 SQL92（SQL2）标准的大多数查询语言的功能。
SQLite 使用 ANSI-C 编写的，并提供了简单和易于使用的 API。
SQLite 可在 UNIX（Linux, Mac OS-X, Android, iOS）和 Windows（Win32, WinCE, WinRT）中运行。

## 局限性
在 SQLite 中，SQL92 不支持的特性
1、RIGHT OUTER JOIN 只实现了 LEFT OUTER JOIN。
2、FULL OUTER JOIN 只实现了 LEFT OUTER JOIN。
3、ALTER TABLE 支持 RENAME TABLE 和 ALTER TABLE 的 ADD COLUMN variants 命令，不支持 DROP COLUMN、ALTER COLUMN、ADD CONSTRAINT。
4、Trigger 支持 支持 FOR EACH ROW 触发器，但不支持 FOR EACH STATEMENT 触发器。
5、VIEWs 在 SQLite 中，视图是只读的。您不可以在视图上执行 DELETE、INSERT 或 UPDATE 语句。
6、GRANT 和 REVOKE 可以应用的唯一的访问权限是底层操作系统的正常文件访问权限。
