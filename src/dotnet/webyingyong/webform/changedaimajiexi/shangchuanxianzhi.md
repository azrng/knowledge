---
title: 上传限制
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: shangchuanxianzhi
slug: gx0u5m
docsId: '31541772'
---
aspx提交或者回发提示超过长度
webconfig里面设置，下面的是允许2g
<system.web>
        <httpRuntime useFullyQualifiedRedirectUrl="true" executionTimeout="120" maxRequestLength="1024000000"/>
 </system.web>
 
 
