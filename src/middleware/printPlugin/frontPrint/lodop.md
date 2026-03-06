---
title: Lodop
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: lodop
slug: pspe3t
docsId: '32028149'
---

## 介绍
需要安装一个插件和引用一个LodopFuncs.js就可以使用
> 官网：[http://www.c-lodop.com/index.html](http://www.c-lodop.com/index.html)


## 操作

### 常用命令

#### LODOP.PRINT_INIT("打印初始化");
设定打印任务名。

#### SET_PRINT_PAGESIZE(intOrient, PageWidth,PageHeight,strPageName)
intOrient：
打印方向及纸张类型，数字型，
1---纵(正)向打印，固定纸张；
2---横向打印，固定纸张；
3---纵(正)向打印，宽度固定，高度按打印内容的高度自适应；
0(或其它)----打印方向由操作者自行选择或按打印机缺省设置；
PageWidth：
设定自定义纸张宽度，整数或字符型，整数时缺省长度单位为0.1毫米。字符型时可包含单位名：in(英寸)、cm(厘米)、mm(毫米)、pt(磅)、px(1/96英寸)，如“10mm”表示10毫米。
纸张宽，单位为0.1mm譬如该参数值为45，则表示4.5mm,计量精度是0.1mm。
PageHeight：
固定纸张时设定纸张高；高度自适应时设定纸张底边的空白高。整数或字符型，整数时缺省长度单位为0.1毫米。字符型时可包含单位名：in(英寸)、cm(厘米)、mm(毫米)、pt(磅)、px(1/96英寸)，如“10mm”表示10毫米。
高小于等于0时strPageName才起作用。
strPageName：
所选纸张类型名，字符型。不同打印机所支持的纸张可能不一样，这里的名称同操作系统内打印机属性中的纸张名称，支持操作系统内的自定义纸张。

#### ADD_PRINT_HTM(Top,Left,Width,Height,strHtmlContent)
增加超文本打印项(普通模式)
例子：打印的页面底部加页码
LODOP.ADD_PRINT_HTM("98%", "42%", 100, 20, "<span tdata='pageNO' style='font-size:12px' >第##页</span>/<span tdata='pageCount' style='font-size:12px'>共##页</span>");

#### ADD_PRINT_TEXT
增加纯文本打印项

#### ADD_PRINT_IMAGE
增加图片打印项

#### ADD_PRINT_BARCODE(Top, Left,Width, Height, CodeType, CodeValue)
增加条形码

#### 打印页面加水印
LODOP.ADD_PRINT_TEXT(13, 22, 295, 160, "房地产管理中心");

> 参考文档：[https://blog.csdn.net/qq_38713405/article/details/79240847](https://blog.csdn.net/qq_38713405/article/details/79240847)

