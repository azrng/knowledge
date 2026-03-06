---
title: webconfig
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: webconfig
slug: io3dw4
docsId: '31541776'
---
webconfig中存储数据
  <appSettings>
    <add key="uploaddir" value="upload" />
    <add key="tempdir" value="temp" />
  </appSettings>
获取方法：
        private static string GetDirName()
        {
            return System.Configuration.ConfigurationManager.AppSettings["uploaddir"];
        }
错误跳转
<customErrors mode="On" defaultRedirect="Home.aspx"></customErrors><!--在此设置报错的问题--> 
 webconfig中system.web里面设置
 
