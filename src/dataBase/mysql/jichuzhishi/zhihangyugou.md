---
title: 执行语句
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: zhihangyugou
slug: cm9g0l
docsId: '26499880'
---
默认MySQL以；号结束，但是有些时候要把多行SQL语句作为一段进行执行，那么就需要使用DELIMITER 
示例：
```sql
DELIMITER $$ 
DROP TRIGGER IF EXISTS `updateegopriceondelete`$$ 
CREATE
TRIGGER `updateegopriceondelete`AFTER DELETE ON `customerinfo` 
FOR EACH ROW BEGIN 
DELETE FROM egoprice WHEREcustomerId=OLD.customerId; 
END$$ 
DELIMITER ;
```
 
