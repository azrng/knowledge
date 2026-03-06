---
title: 执行顺序
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: zhihangshunxu
slug: aboie9
docsId: '26499013'
---
| 参数 | 排序 |
| --- | --- |
| Max  where | Max>where |
| Max   where  Group by  | Group>Max>where |
| Max   group by | Group   by>max |
| where多个条件 | 从左到右依次执行，最好将筛选条件大的放前面 |
|   |   |

