---
title: 解决方案
lang: zh-CN
date: 2023-08-15
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - solution
filename: jiejuefangan
slug: ol2zxq
docsId: '31787305'
---

## 密文查询
数据库数据字段加解密检索和前端返回脱敏：[https://www.cnblogs.com/xuejiaming/p/17619102.html](https://www.cnblogs.com/xuejiaming/p/17619102.html)

阿里巴巴密文检索方案：[https://jaq-doc.alibaba.com/docs/doc.htm?treeId=1&articleId=106213&docType=1](https://jaq-doc.alibaba.com/docs/doc.htm?treeId=1&articleId=106213&docType=1)

## 数据脱敏

### SQL数据脱敏实现

MYSQL(电话号码,身份证)数据脱敏的实现

```sql
-- CONCAT()、LEFT()和RIGHT()字符串函数组合使用，请看下面具体实现
 
-- CONCAT(str1,str2,…)：返回结果为连接参数产生的字符串
-- LEFT(str,len)：返回从字符串str 开始的len 最左字符
-- RIGHT(str,len)：从字符串str 开始，返回最右len 字符
 
-- 电话号码脱敏sql：
SELECT mobilePhone AS 脱敏前电话号码,CONCAT(LEFT(mobilePhone,3), '********' ) AS 脱敏后电话号码 FROM t_s_user
 
-- 身份证号码脱敏sql:
SELECT idcard AS 未脱敏身份证, CONCAT(LEFT(idcard,3), '****' ,RIGHT(idcard,4)) AS 脱敏后身份证号 FROM t_s_user
```

### JAVA的sensitive-plus组件数据脱敏

可参考：海强 / sensitive-plus

> https://gitee.com/strong_sea/sensitive-plus

数据脱敏插件，目前支持地址脱敏、银行卡号脱敏、中文姓名脱敏、固话脱敏、身份证号脱敏、手机号脱敏、密码脱敏 一个是正则脱敏、另外一个根据显示长度脱敏，默认是正则脱敏，可以根据自己的需要配置自己的规则。
