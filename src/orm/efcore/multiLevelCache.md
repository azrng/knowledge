---
title: 二级缓存
lang: zh-CN
date: 2022-07-27
publish: true
author: azrng
isOriginal: true
category:
  - orm
tag:
  - 无
filename: jieshao
slug: ewabe0
docsId: '84713628'
---
## 概述

二级缓存是一个查询缓存。EF命令的结果将存储在缓存中,这相同的EF命令将从缓存中检索数据,而不是执行它们对数据库了。



各种包
```csharp
https://www.cnblogs.com/louby/p/6232646.html
EFSecondLevelCache


https://github.com/VahidN/EFCoreSecondLevelCacheInterceptor
Install-Package EFCoreSecondLevelCacheInterceptor -Version 3.6.2
    
    
    Install-Package EntityFrameworkCore.NCache -Version 5.3.0
    
    
    
    Install-Package EntityFrameworkCore.Cacheable -Version 2.0.1
```

## 资料

[EFSecondLevelCache.Core](https://github.com/VahidN/EFSecondLevelCache.Core)

[EntityFrameworkCore.Cacheable](https://github.com/SteffenMangold/EntityFrameworkCore.Cacheable)

