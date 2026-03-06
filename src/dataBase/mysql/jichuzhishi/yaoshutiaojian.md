---
title: 约束条件
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: yaoshutiaojian
slug: ghpvu5
docsId: '26499320'
---
约束条件就是在给字段加一些约束，使该字段存储的值更加符合我们的预期。
常用约束条件有以下这些
**UNSIGNED** ：无符号，值从0开始，无负数
**ZEROFILL**：零填充，当数据的显示长度不够的时候可以使用前补0的效果填充至指定长度,字段会自动添加UNSIGNED
**NOT NULL**：非空约束，表示该字段的值不能为空
**DEFAULT**：表示如果插入数据时没有给该字段赋值，那么就使用默认值
**PRIMARY KEY**：主键约束，表示唯一标识，不能为空，且一个表只能有一个主键。一般都是用来约束id
**AUTO_INCREMENT**：自增长，只能用于数值列，而且配合索引使用,默认起始值从1开始，每次增长1
**UNIQUE KEY**：唯一值，表示该字段下的值不能重复，null除外。比如身份证号是一人一号的，一般都会用这个进行约束
**FOREIGN KEY**：外键约束，目的是为了保证数据的完成性和唯一性，以及实现一对一或一对多关系
