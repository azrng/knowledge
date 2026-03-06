---
title: 原生浏览器打印
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: yuanshengliulanqidayin
slug: eugul6
docsId: '32028369'
---
```csharp
这种打印是需要弹出打印预览的框 
function doPrint() {
            var bdhtml;
            var sprnstr;
            var eprnstr;
            var prnhtml;
            bdhtml = window.document.body.innerHTML;//获取当前页的html代码
            sprnstr = "<!--startprint-->";//标记打印开始的地方
            eprnstr = "<!--endprint-->";//标记打印结束的地方
            prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);//从开始代码向后取html
            prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));//从结束代码向前取html
            window.document.body.innerHTML = prnhtml;//获得需要打印的内容
            window.print();//开始打印
        }
上面代码不需要更改，只用把需要打印的内容开头放上<!--startprint-->
结束放上<!--endprint-->
```

