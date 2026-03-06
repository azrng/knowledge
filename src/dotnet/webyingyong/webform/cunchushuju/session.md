---
title: session
lang: zh-CN
date: 2021-08-27
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: session
slug: yhygb9
docsId: '31541512'
---
创建session
   Session["admin_name"] ="azrng";
删除session
 Session.Abandon();
注释：
Session.Clear()就是把Session对象中的所有项目都删除了，
Session对象里面啥都没有。但是Session对象还保留。
Session.Abandon()就是把当前Session对象删除了，下一次就是新的Session了。
 
一般处理程序中获取session
先引用using System.Web.SessionState;
然后再：public class FIleShow : IHttpHandler, IRequiresSessionState   继承这个
获取 context.Session["name"].ToString();
 
 
一个浏览器登录两个不同账号session替换的问题
（可以在登录时候判断下是session是否有值，如果有值直接进去）
 
 
登录后会创建一个session，这个东西保存在服务器上，那么服务器如何知道是哪一个电脑登录的呢？
创建session时候会创建一个cookie，然后生成一个sessionid，这个东西是用来区分是哪一个电脑登录的
 
session和cache区别
 
**cookie和session的关系:**
http是无状态的协议  session是以cookie或URL重写为基础的， 他是流程化的 ,默认使用cookie来实现,   session就是一种保存上下文信息的机制，它是针对每一个用户的，变量的值保存在服务器端，用户在连接服务器时，会由服务器生成一个唯一的SessionID,通过 SessionID来区分不同的客户 并且方便下一次的识别  Session是由应用服务器维持的一个服务器端的存储空间，而SessionID这一数据则是用Cookie保存到客户端，用户提交页面时，会将这SessionID提交到服务器端，来存取Session数据。
 
