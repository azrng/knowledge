---
title: 定时器
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: dingshiqi
slug: ggrw36
docsId: '31541461'
---
System.Threading.Timer定时器，可以定时循环执行一个任务，是在线程上面执行的，具有很少的安全性。他不建议使用Windows窗体，因为他的回调不会在用户界面线程上发生。
定义一个定时变量器
static System.Threading.Timer timer;
创建一个定时器
timer = new System.Threading.Timer(chang, null, 5000, 2000);
第一个是调用的方法，第三个是多久以后开始调用，第四个是隔多久调用一次
关闭定时器
timer.Dispose();
 
System.Windows.Forms.Timer 是使用 Windows 窗体的更好选择。 对于基于服务器的计时器的功能。
 
对于基于服务器的计时器的功能，您可以考虑使用 System.Timers.Timer, ，它将引发事件，并具有附加功能。
 
 
 
 
