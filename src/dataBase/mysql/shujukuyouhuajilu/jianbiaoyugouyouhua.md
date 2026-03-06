---
title: 建表语句优化
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jianbiaoyugouyouhua
slug: lgkf6y
docsId: '31804988'
---
数据库使用字符集是：UTF8,排序规则是：utf8_general_ci；
永远为每个表设置一个ID作为主键，最好是int类型，并自动设置 AUTO_INCREMENT标志。使用varchar类型当做主键使性能下降，然后如果设置了自增的话如何导出导入会影响；
尽可能使用not null，除非特殊情况必须要使用null；
如果存储一些比较有限而且固定的值，比如性别、国家这种，推荐使用enum而不是varchar；
如果一个表只有几列。使用MEDIUMINT, SMALLINT 或是更小的 TINYINT会更好。
如果不需要记录时分秒，使用Date（YYYY-MM-DD）比DateTime（YYYY-MM-DD HH:mm:ss）更好 ，尽量使用trmestamp，因为其存储空间只需要datetime的一半。对于只需要精确到某一天的数据类型，建议使用DATE类型，因为他的存储空间只需要3个字节，比TIMESTAMP还少。不建议通过INT类型类存储一个unix timestamp 的值，因为这太不直观，会给维护带来不必要的麻烦，同时还不会带来任何好处。
不到万不得已不要使用double，不仅仅是存储长度问题，同是存在精确性的问题。也不建议使用decimal，建议乘以固定备注转换成整数存储，可以节省存储空间。
对于整数的存储，在数据量较大的情况下，建议区分开tinyint/int/bigint的选择，能确定不会使用复数的情况，建议添加unsigned定义。（自增默认就是这种类型，Navicat中对数值类型字段设置无符号）
对于字符类型，如果是固定长度，建议用char，不定长度尽量使用varchar，且仅仅设置适当的最大长度。guid应该使用char(36)
可以针对单个字段设置单独的字符集，这个具体还需要查阅资料
适当拆分，比如我们表中存在类似的text或者很大的varchar类型的大字段的时候，如果我们大部分访问这个表都不需要这个字段，那么我们就应该把这单独拆分到另外的独立表中，以减少常用数据所占用的存储空间。
尽量使用not null，设置null会增加sql的io量，所以尽量确保default的值不是null。
 
 
 
 
[https://www.cnblogs.com/pengyunjing/p/6591676.html](https://www.cnblogs.com/pengyunjing/p/6591676.html)
 

[https://blog.csdn.net/liuyanqiangpk/article/details/79827239](https://blog.csdn.net/liuyanqiangpk/article/details/79827239)

 
[https://blog.csdn.net/itguangit/article/details/79825577](https://blog.csdn.net/itguangit/article/details/79825577)
