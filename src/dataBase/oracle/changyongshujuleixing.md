---
title: 常用数据类型
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: changyongshujuleixing
slug: egkzxp
docsId: '31817416'
---
**INTEGER**存储整数，整数不包括浮点数;它是一个整数数字，如：1、10、15
**NUMBER**，是以十进制格式进行存储的，它便于存储，但是在计算上，系统会自动的将它转换成为二进制进行运算的。它的定义方式是NUMBER(P，S)，P是精度，最大38位，S是刻度范围，可在-84...127间取值。例如：NUMBER(5，2)可以用来存储表示-999.99...999.99间的数值。P、S可以在定义是省略，例如：NUMBER(5)、NUMBER等;
**CHAR**，描述定长的字符串，如果实际值不够定义的长度，系统将以空格填充。它的声明方式如下CHAR(L)，L为字符串长度，缺省为1，作为变量最大32767个字符，作为数据存储在ORACLE8中最大为2000。
**VARCHAR2**(VARCHAR)，描述变长字符串。它的声明方式如下VARCHAR2(L)，L为字符串长度，没有缺省值，作为变量最大32767个字节，作为数据存储在ORACLE8中最大为4000。在多字节语言环境中，实际存储的字符个数可能小于L值，例如：当语言环境为中文(SIMPLIFIED CHINESE_CHINA.ZHS16GBK)时，一个VARCHAR2(200)的数据列可以保存200个英文字符或者100个汉字字符。
**NCHAR、NVARCHAR2**，国家字符集，与环境变量NLS指定的语言集密切相关，使用方法和CHAR、VARCHAR2相同。不过最大参数为NCHAR(2000)、NVARCHAR2(2000)
**DATE**唯一的一种日期类型--，用来存储时间信息，站用7个字节(从世纪到秒)
**LOB**（oracle8以前叫long）变量主要是用来存储大量数据的数据库字段，最大可以存储4G字节的内容，CLOB：存储单字节字符数据（如英文）NCLOB：用来存储定宽多字节字符数据（如汉字），BLOB：用来存储无结构的二进制数据（word、pdf文档）。
