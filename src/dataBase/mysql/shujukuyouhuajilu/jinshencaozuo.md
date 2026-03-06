---
title: 谨慎操作
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jinshencaozuo
slug: tgggdm
docsId: '31804956'
---
1.如果要执行一个大的delete和insert你需要小心，因为这两个操作会锁表，表一旦锁住，别的操作就进不来了。比如说删除一些然后睡会。
