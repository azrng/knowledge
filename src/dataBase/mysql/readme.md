---
title: 说明
lang: zh-CN
date: 2023-09-15
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - mysql
---

## 概述
MySQL是一个关系型数据库管理系统，由瑞典MySQL AB 公司开发，属于 Oracle 旗下产品。

## 查询过程

1. 客户端发送一条查询语句到服务器；
2. 服务器先查询缓存，如果命中缓存，则立即返回存储在缓存中的数据；
3. 未命中缓存后，MySQL通过关键字将SQL语句进行解析，并生成一颗对应的解析树，MySQL解析器将使用MySQL语法进行验证和解析。例如，验证是否使用了错误的关键字，或者关键字的使用是否正确；
4. 预处理是根据一些MySQL规则检查解析树是否合理，比如检查表和列是否存在，还会解析名字和别名，然后预处理器会验证权限；
5. 根据执行计划查询执行引擎，调用API接口调用存储引擎来查询数据；
6. 将结果返回客户端，并进行缓存；

## 规范

1. 所有数据库对象名称必须使用小写字母并用下划线分割；
2. 所有数据库对象名称禁止使用mysql保留关键字；
3. 数据库对象的命名要能做到见名识意，并且最后不要超过32个字符；
4. 临时库表必须以tmp_为前缀并以日期为后缀，备份表必须以bak_为前缀并以日期(时间戳)为后缀；
5. 所有存储相同数据的列名和列类型必须一致；

## 参考资料
【深入理解 Mysql 索引底层原理】[https://zhuanlan.zhihu.com/p/113917726](https://zhuanlan.zhihu.com/p/113917726)
【MySQL索引原理以及查询优化】[https://www.cnblogs.com/bypp/p/7755307.html](https://www.cnblogs.com/bypp/p/7755307.html)
【MySQL的InnoDB索引原理详解】[https://www.cnblogs.com/williamjie/p/11081081.html](https://www.cnblogs.com/williamjie/p/11081081.html)
【Mysql 分页语句 Limit原理】[https://blog.csdn.net/helloxiaozhe/article/details/78106709](https://blog.csdn.net/helloxiaozhe/article/details/78106709)
必须掌握的 MySQL 优化原理：[https://mp.weixin.qq.com/s/wuGbnvo3bCThO2ERqHpPAQ](https://mp.weixin.qq.com/s/wuGbnvo3bCThO2ERqHpPAQ)
MySQL 性能优化的21条实用技巧：[https://mp.weixin.qq.com/s/pyAddBuxjodmT7gkOBamTw](https://mp.weixin.qq.com/s/pyAddBuxjodmT7gkOBamTw)
深入理解MySQL索引之B+Tree：[https://blog.csdn.net/b_x_p/article/details/86434387](https://blog.csdn.net/b_x_p/article/details/86434387)
MySql最左匹配原则解析：[https://www.cnblogs.com/wanggang0211/p/12599372.html](https://www.cnblogs.com/wanggang0211/p/12599372.html)
[https://juejin.im/post/5d2335846fb9a07f021a2509](https://juejin.im/post/5d2335846fb9a07f021a2509)   MySQL必会手册
SQL性能优化技巧：[https://mp.weixin.qq.com/s/HJknyghxVULbtVKhZAChDA](https://mp.weixin.qq.com/s/HJknyghxVULbtVKhZAChDA)
[https://mp.weixin.qq.com/s/XC8e5iuQtfsrEOERffEZ-Q](https://mp.weixin.qq.com/s/XC8e5iuQtfsrEOERffEZ-Q) | 技术同学必会的MySQL设计规约，都是惨痛的教训

https://mp.weixin.qq.com/s/bWVrK2ruyd-V26uqaAmNFg | 被问懵了：MySQL 自增主键一定是连续的吗？
