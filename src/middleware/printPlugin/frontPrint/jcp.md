---
title: JCP
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: jcp
slug: txqcc6
docsId: '32028392'
---

## 介绍
免费插件可以直接打印，也没有水印，只不过免费版不能判断是否已经打印成功
> 官网地址：[http://printfree.jatools.com/](http://printfree.jatools.com/)


## 操作
```csharp
页面加载的时候调用方法 onload="doPrint()" 
  function doPrint() {
                        var  myDoc = {
                            print_settings: { paperName: 'a4',
                                  orientation: 1,
                                  topMargin: 195,
                                  leftMargin: 195,
                                  bottomMargin: 195,
                                  rightMargin: 195, // 设置上下左距页边距为10毫米，注意，单位是 1/10毫米
                                  printer: 'HP LaserJet 1020'//设置到打印机 'OKi5530'
                              },  
                              documents: document,
                              copyrights: '杰创软件拥有版权  www.jatools.com' // 版权声明,必须   
                          };
                          var jatoolsPrinter = document.getElementById("jatoolsPrinter");
                         
                          jatoolsPrinter.print(myDoc, false); // 直接打印，弹出打印机设置对话框
                          //document.getElementById("jatoolsPrinter").print(myDoc, false); // 直接打印，不弹出打印机设置对话框
	 }
```
