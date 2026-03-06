---
title: 前台绑定后台拼接的html
lang: zh-CN
date: 2021-10-21
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: qiantaibangdinghoutaipinjiedehtml
slug: nivlmu
docsId: '31541641'
---
```csharp
字符串的内容是创建一个li
 <%=strlist1 %>
后台拼接方法
 StringBuilder jtdaStrHtml = new StringBuilder();
                jtdaStrHtml.Append("<li><a href=\"#\" >上报数据</a>");
                jtdaStrHtml.Append("<ul style=\"display: none;\">");
                jtdaStrHtml.Append("<li><a href=\"sbData.aspx\" target=\"mainFrame\"><img src=\"../images/icon1.png\" width=\"16\" height=\"16\" />上报数据</a></li>");
                jtdaStrHtml.Append("<li><a href=\"sbDataList.aspx\" target=\"mainFrame\"><img src=\"../images/icon1.png\" width=\"16\" height=\"16\" />上报数据列表</a></li>");
                jtdaStrHtml.Append("</ul>");
                jtdaStrHtml.Append("</li>");
                strlist1 = jtdaStrHtml.ToString();
经浏览器翻译后为
<li><a href="#" >上报数据</a><ul style="display: none;"><li><a href="sbData.aspx" target="mainFrame"><img src="../images/icon1.png" width="16" height="16" />上报数据</a></li><li><a href="sbDataList.aspx" target="mainFrame"><img src="../images/icon1.png" width="16" height="16" />上报数据列表</a></li></ul></li> 




```
