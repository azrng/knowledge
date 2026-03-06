---
title: 修改数据的Update方法
lang: zh-CN
date: 2021-10-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: xiugaishujudeupdatefangfa
slug: ske96w
docsId: '31541642'
---
有时候修改的语句最后会多一个，
示例
```csharp
if (model.q_status == 0 || model.q_status == 1)
            {
               strSql.Append("q_status=@q_status,");
            }
            if (model.q_status2 == 0 || model.q_status2 == 1)
            {
               strSql.Append("q_status2=@q_status2,");
            }
            if (model.q_status3 == 0 || model.q_status3 == 1)
            {
               strSql.Append("q_status3=@q_status3,");
            }
这种，那么就需要把最后那个“，”截取了
 int i = strSql.ToString().LastIndexOf(",");//最后一个，所在位置
string strSql2 = strSql.ToString().Substring(0, i); // or str=str.Remove(i,str.Length-i); 
strSql2 = strSql2 + " where ID=@ID";


或者

可以使用trim去除最后一个符号
```

