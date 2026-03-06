---
title: 连接
lang: zh-CN
date: 2023-04-20
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: datagriplianjie
slug: gcztih
docsId: '67800054'
---

## DataGrip连接
## 准备工作
- 部署好的DM数据库
- DmJdbcDriver18

DmJdbcDriver18,下载地址：[https://eco.dameng.com/docs/zh-cn/app-dev/java-MyBatis-frame.html](https://eco.dameng.com/docs/zh-cn/app-dev/java-MyBatis-frame.html)  进入页面搜索jar
![image.png](/common/1646040509821-40dfa3d4-3b59-4219-8f76-f88dbc092523.png)
需要的文件在这个里面zip包里面

## 操作
打开驱动配置
![image.png](/common/1646040402351-6458a39c-53a7-49fb-a6d6-123ab4c2cde2.png)
新建name为达梦等，驱动文件选择刚才下载的文件
![image.png](/common/1646040611489-13a7f032-429c-40dd-9cc7-1c8df9d3d6a1.png)
Url模板使用下面的例子

| **模板名称** | **模版URL** |
| --- | --- |
| default | jdbc:dm://{host::localhost}?[:{port::5236}][/{database}?] |
| default | jdbc:dm://{host::localhost}?[:{port::5236}][/DMSERVER?schema={database}] |

下面就可以正常去选择达梦数据库连接了。
[
](https://eco.dameng.com/docs/zh-cn/app-dev/java-MyBatis-frame.html)
