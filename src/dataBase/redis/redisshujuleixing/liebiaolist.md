---
title: 列表List
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: liebiaolist
slug: qq1dbc
docsId: '29714821'
---
场景：可以轻松显现最新消息排行，另一个应用是消息队列，可以利用list的push操作，将任务存在list中，然后工作线程再用pop操作将任务取出并执行。
 
 
 
127.0.0.1:6379> get mykey
"a"
127.0.0.1:6379> del mykey
(integer) 1
127.0.0.1:6379> get mykey
(nil)
lpush ：在指定Key所关联的List Value的头部插入参数中给出的所有Values。
127.0.0.1:6379> lpush mykey a b c
(integer) 3
127.0.0.1:6379> lpush key1 a
(integer) 1
127.0.0.1:6379> del key1
(integer) 1
lpushx ：仅有当参数中指定的Key存在时，该命令才会在其所关联的List Value的头部插入参数中给出的Value，否则将不会有任何操作发生。
127.0.0.1:6379> lpushx key1 a
(integer) 0
127.0.0.1:6379> get mye1
(nil)
127.0.0.1:6379> get key1
(nil)
127.0.0.1:6379> lpushx mykey d
(integer) 4
127.0.0.1:6379> lrange mykey -32 4
1) "d"
2) "c"
3) "b"
4) "a"
127.0.0.1:6379> lrange mykey -3 2
1) "c"
2) "b"
127.0.0.1:6379> lrange mykey -3 -1
1) "c"
2) "b"
3) "a"
127.0.0.1:6379> lrange mykey 0 -3
1) "d"
2) "c"
127.0.0.1:6379> lpop mykey
"d"
127.0.0.1:6379> llen mykey
(integer) 3
127.0.0.1:6379> lpush mykey a
(integer) 4
127.0.0.1:6379> lpush mykey b
(integer) 5
127.0.0.1:6379> lrange mykey 0 5
1) "b"
2) "a"
3) "c"
4) "b"
5) "a"
127.0.0.1:6379> lrem mykey 1 a
(integer) 1
127.0.0.1:6379> lrange mykey 0 5
1) "b"
2) "c"
3) "b"
4) "a"
127.0.0.1:6379> lrem mykey 2 b
(integer) 2
127.0.0.1:6379> lrange mykey 0 4
1) "c"
2) "a"
127.0.0.1:6379> lset mykey 0 d
OK
127.0.0.1:6379> lrange mykey 0 2
1) "d"
2) "a"
127.0.0.1:6379> lindex mykey 0
"d"
127.0.0.1:6379> lindex mykey -1
"a"
127.0.0.1:6379> ltrim mykey 0 0
OK
127.0.0.1:6379> lrange mykey 0 2
1) "d"
127.0.0.1:6379> lpush mykey a b c d
(integer) 5
127.0.0.1:6379> lrange mykey 0 4
1) "d"
2) "c"
3) "b"
4) "a"
5) "d"
127.0.0.1:6379> ltrim mykey 0 1
OK
127.0.0.1:6379> lrange mykey 0 4
1) "d"
2) "c"
127.0.0.1:6379> linsert mykey beffor d a
(error) ERR syntax error
127.0.0.1:6379> linsert mykey before d a
(integer) 3
127.0.0.1:6379> lrange mykey 0 3
1) "a"
2) "d"
3) "c"
127.0.0.1:6379> linsert mykey after d a
(integer) 4
127.0.0.1:6379> lrange mykey 0 3
1) "a"
2) "d"
3) "a"
4) "c"
127.0.0.1:6379> rpushx mykey e
(integer) 5
127.0.0.1:6379> lrange myke 0 4
(empty list or set)
127.0.0.1:6379> lrange mykey 0 4
1) "a"
2) "d"
3) "a"
4) "c"
5) "e"
127.0.0.1:6379> del key1
(integer) 0
127.0.0.1:6379> rpushx key1 a
(integer) 0
127.0.0.1:6379> rpush mykey f
(integer) 6
127.0.0.1:6379> rpop mykey
"f"
127.0.0.1:6379> lpush key1 a
(integer) 1
127.0.0.1:6379> lrange key1 0 1
1) "a"
127.0.0.1:6379> lrange mykey 0 5
1) "a"
2) "d"
3) "a"
4) "c"
5) "e"
127.0.0.1:6379> rpoplpush mykey key1
"e"
127.0.0.1:6379> lrange myeky 0 5
(empty list or set)
127.0.0.1:6379> lrange mykey 0 5
1) "a"
2) "d"
3) "a"
4) "c"
127.0.0.1:6379> lrange key1 0 2
1) "e"
2) "a"
127.0.0.1:6379>
 
教程：[https://www.cnblogs.com/5ishare/p/6291034.html](https://www.cnblogs.com/5ishare/p/6291034.html)
