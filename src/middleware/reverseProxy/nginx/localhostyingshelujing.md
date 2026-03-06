---
title: localhost映射路径
lang: zh-CN
date: 2023-10-01
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: localhostyingshelujing
slug: oifgvb
docsId: '26512040'
---

## 优先级关系
(localhost =)>(localhost /xxx/yyy/zzz)>(localhost ^~)>(localhost ~)>
(localhost ~,~*)>(localhost /起始路径)>(localhost /)
 
精确匹配>优先匹配>通用匹配
 
```nginx
#1 =匹配
localhost =/ {
    #精准匹配，主机名后面不能带任何字符串
}
#2.通用匹配
localhost /xxx {
    #匹配所有以/xxx开头的路径
}
#3 正则匹配
localhost ~ /xxx {
    #匹配所有以/xxx开头的路径
}
#4匹配开头路径
localhost ^~ /images/ {
    #匹配所有以/imaegs开头的路径
}
#5.匹配以指定内容结尾
localhost ~* \. (gif|jpg|png)$ {
    #匹配以gif或者jpg或者png结尾的内容
}
```
![image.png](/common/1609249912693-7d969a58-fae5-40c5-a2e4-6924ea9c95a5.png)
