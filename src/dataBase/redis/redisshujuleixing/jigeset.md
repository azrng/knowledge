---
title: 集合set
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: jigeset
slug: gbdkhk
docsId: '29714786'
---
场景：可以添加删除元素，提供有对集合求交并差的操作，例如可以将一个用户所关注的人
放在一个集合里面，将所有粉丝放在一个集合里面，可以方便使用共同关注，共同爱好。
 
set支持自动排重，string类型的无序集合
 
127.0.0.1:6379> del mykey
(integer) 1
**SADD  **key member [member ...]:时间复杂度中的N表示操作的成员数量。如果在插入的过程用，参数中有的成员在Set中已经存在，该成员将被忽略，而其它成员仍将会被正常插入。如果执行该命令之前，该Key并不存在，该命令将会创建一个新的Set，此后再将参数中的成员陆续插入。如果该Key的Value不是Set类型，该命令将返回相关的错误信息。
127.0.0.1:6379> sadd mykey a b c d
(integer) 4
**SCARD**key:获取Set中成员的数量。
127.0.0.1:6379> scard mykey
(integer) 4
**SISMEMBER** key member：判断参数中指定成员是否已经存在于与Key相关联的Set集合中。
127.0.0.1:6379> sismember mykey a
(integer) 1
**SMEMBERS** key：时间复杂度中的N表示Set中已经存在的成员数量。获取与该Key关联的Set中所有的成员。
127.0.0.1:6379> smembers mykey
1) "d"
2) "c"
3) "a"
4) "b"
**SPOP**key ：随机的移除并返回Set中的某一成员。 由于Set中元素的布局不受外部控制，因此无法像List那样确定哪个元素位于Set的头部或者尾部。
127.0.0.1:6379> spop mykey
"a"
**SREM**key member [member ...]：时间复杂度中的N表示被删除的成员数量。从与Key关联的Set中删除参数中指定的成员，不存在的参数成员将被忽略，如果该Key并不存在，将视为空Set处理。
127.0.0.1:6379> srem mykey c
(integer) 1
**SRANDMEMBER** key ：和SPOP一样，随机的返回Set中的一个成员，不同的是该命令并不会删除返回的成员。
127.0.0.1:6379> srandmember mykey
"b"
127.0.0.1:6379> srandmember mykey
"d"
127.0.0.1:6379> sadd newkey a d e
(integer) 3
127.0.0.1:6379> smembers mykey
1) "d"
2) "b"
**SMOVE**source destination member：原子性的将参数中的成员从source键移入到destination键所关联的Set中。因此在某一时刻，该成员或者出现在source中，或者出现在destination中。如果该成员在source中并不存在，该命令将不会再执行任何操作并返回0，否则，该成员将从source移入到destination。如果此时该成员已经在destination中存在，那么该命令仅是将该成员从source中移出。如果和Key关联的Value不是Set，将返回相关的错误信息。
127.0.0.1:6379> smove mykey newkey b
(integer) 1
127.0.0.1:6379> smembers mykey
1) "d"
**SDIFF**key [key ...]：时间复杂度中的N表示所有Sets中成员的总数量。返回参数中第一个Key所关联的Set和其后所有Keys所关联的Sets中成员的差异。如果Key不存在，则视为空Set。
127.0.0.1:6379> sdiff mykey newkey
(empty list or set)
127.0.0.1:6379> sdiff newkey mykey
1) "e"
2) "a"
3) "b"
**SDIFFSTORE**destination key [key ...] ：该命令和SDIFF命令在功能上完全相同，两者之间唯一的差别是SDIFF返回差异的结果成员，而该命令将差异成员存储在destination关联的Set中。如果destination键已经存在，该操作将覆盖它的成员。
127.0.0.1:6379> sdiffstore newkey mykey
(integer) 1
127.0.0.1:6379> smembers newkey
1) "d"
127.0.0.1:6379> smembers mykey
1) "d"
**SINTER**key [key ...] ：时间复杂度中的N表示最小Set中元素的数量，M则表示参数中Sets的数量。该命令将返回参数中所有Keys关联的Sets中成员的交集。因此如果参数中任何一个Key关联的Set为空，或某一Key不存在，那么该命令的结果将为空集。
**SINTERSTORE**destination key [key ...]：该命令和SINTER命令在功能上完全相同，两者之间唯一的差别是SINTER返回交集的结果成员，而该命令将交集成员存储在destination关联的Set中。如果destination键已经存在，该操作将覆盖它的成员。
127.0.0.1:6379> sinterstore mykey newkey
(integer) 1
127.0.0.1:6379> smembers mykey
1) "d"
127.0.0.1:6379> smenmbers newkey
(error) ERR unknown command 'smenmbers'
127.0.0.1:6379> smembers newkey
1) "d"
127.0.0.1:6379> sadd mykey a
(integer) 1
127.0.0.1:6379> smembers mykey
1) "a"
2) "d"
**SUNION** key [key ...] ：时间复杂度中的N表示所有Sets中成员的总数量。该命令将返回参数中所有Keys关联的Sets中成员的并集。
127.0.0.1:6379> sunion mykey newkey
1) "d"
2) "a"
**SUNIONSTORE**destination key [key ...] ：该命令和SUNION命令在功能上完全相同，两者之间唯一的差别是SUNION返回并集的结果成员，而该命令将并集成员存储在destination关联的Set中。如果destination键已经存在，该操作将覆盖它的成员。 
127.0.0.1:6379> sunionstore mykey newkey
(integer) 1
127.0.0.1:6379> smembers mykey
1) "d"
127.0.0.1:6379>
