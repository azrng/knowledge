---
title: 使用场景
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: shiyongchangjing
slug: eq04no
docsId: '30252364'
---
- 游戏场景，使用 MongoDB 存储游戏用户信息，用户的装备、积分等直接以内嵌文档的形式存储，方便查询、更新
- 物流场景，使用 MongoDB 存储订单信息，订单状态在运送过程中会不断更新，以 MongoDB 内嵌数组的形式来存储，一次查询就能将订单所有的变更读取出来。
- 社交场景，使用 MongoDB 存储存储用户信息，以及用户发表的朋友圈信息，通过地理位置索引实现附近的人、地点等功能
- 物联网场景，使用 MongoDB 存储所有接入的智能设备信息，以及设备汇报的日志信息，并对这些信息进行多维度的分析
- 视频直播，使用 MongoDB 存储用户信息、礼物信息等

Craiglist上使用MongoDB的存档数十亿条记录。
FourSquare，基于位置的社交网站，在Amazon EC2的服务器上使用MongoDB分享数据。
Shutterfly，以互联网为基础的社会和个人出版服务，使用MongoDB的各种持久性数据存储的要求。
bit.ly, 一个基于Web的网址缩短服务，使用MongoDB的存储自己的数据。
spike.com，一个MTV网络的联营公司， spike.com使用MongoDB的。
Intuit公司，一个为小企业和个人的软件和服务提供商，为小型企业使用MongoDB的跟踪用户的数据。
sourceforge.net，资源网站查找，创建和发布开源软件免费，使用MongoDB的后端存储。
etsy.com ，一个购买和出售手工制作物品网站，使用MongoDB。
纽约时报，领先的在线新闻门户网站之一，使用MongoDB。
CERN，著名的粒子物理研究所，欧洲核子研究中心大型强子对撞机的数据使用MongoDB。
 
应用服务器日志
适合业务系统中有大量“低价值”数据的场景，mongodb内建了多种数据分片的特性，可以很好使用大数据需求
存储监控数据，增加字段不用改表结构
 
 
 
 
 
应用不需要事务及复杂 join 支持
新应用，需求会变，数据模型无法确定，想快速迭代开发
应用需要2000-3000以上的读写QPS（更高也可以）
应用需要TB甚至 PB 级别数据存储
应用发展迅速，需要能快速水平扩展
应用要求存储的数据不丢失
应用需要99.999%高可用
应用需要大量的地理位置查询、文本查询
如果上述有一个符合，可以考虑使用MongoDB，两个及以上符合，一定要选择
