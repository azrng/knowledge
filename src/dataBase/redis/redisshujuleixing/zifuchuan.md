---
title: 字符串
lang: zh-CN
date: 2023-06-25
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: zifuchuan
slug: pcmc9n
docsId: '29714685'
---
Append：在字符串的末尾附加，如果key不存在，那么创建key，并设置为空字符串，返回的是操作后字符串的长度。
![image.png](/common/1609927625433-0c667830-a700-43a1-a224-0fa5b46ff6ff.png)
Del:根据指定的key去删除这个key
![image.png](/common/1609927625435-08b6d88d-207f-4e02-bcc5-f44cb41b1cef.png)
getrange：根据索引去截取值，从第几个索引开始，到第几个索引结束。
![image.png](/common/1609927625433-5d791598-8966-40d5-851f-921f7384d614.png)
decr：将制定key的value值减去1，如果不存在，返会-1，如果不能把值转换为整形值，那么将返回失败信息。
![image.png](/common/1609927625433-41ae2ccc-d736-49eb-9d0b-69491bebe6b2.png)
incr：将指定的值增加1，如果值不存在，返回1，如果不能转换为整形值，那么返回相应的错误信息。
decrby：将值减少指定数，如果不能转换为整形，返回相应错误信息。
![image.png](/common/1609927625447-03765b7b-954c-46f8-a55a-9e3b78ebe725.png)
incrby：将值增加指定数，如果不能转换为整形，返回错误信息。
![image.png](/common/1609927625437-6e34467e-a2e4-492a-b98a-721e167ce217.png)
get：获取指定key的value，如果与该key关联的值不是string类型，返回错误信息。
![image.png](/common/1609927625470-7ddb52e8-8e65-4a52-ba8d-ace314395ea2.png)
set：设定为指定的值，如果该key已经存在，则覆盖其原有的值。
![image.png](/common/1609927625478-7afb364f-e808-4050-b37f-b46065543e88.png)
getset：设置该key的值，并返回原来的值。
![image.png](/common/1609927625488-bb20029c-2b14-4778-8a74-5e5a91a5cb1d.png)
strlen：返回指定key的长度，如果值不是string类型，那么返回错误信息。
![image.png](/common/1609927625671-ae739992-6d8d-4c49-974e-8a361b5f2b66.png)
setex：设置一个key的值，并且为这个值设置存过时间(秒)，主要用于被当做cache服务器使用时。
![image.png](/common/1609927625477-7ee8e02a-299d-44b0-8b1c-805108a5f409.png)
setnx：设置该key的指定值，如果该key不存在，返回1，设置成功，key存在，返回0，设置失败。
![image.png](/common/1609927625485-9492f434-029c-4a22-841b-b394c8d59335.png)
Setrange:替换值，从指定索引开始，然后替换为指定的值。
![image.png](/common/1609927625553-b770f749-9fdb-462b-bbf2-ed1b088614ed.png)
Getrange:截取字符串，从指定索引开始，到指定索引结束。
![image.png](/common/1609927625480-0e591fed-9549-45b3-96db-025b8f327d99.png)
Setbit:设置指定offiset上的bit值，值只能是0或者1，设置后该命令返回该offset上原有的bit值，如果指定key不存在，将创建一个新值。
**SETBIT **key offset value 
![image.png](/common/1609927625514-454030c1-96af-4617-ac97-d108fd448a0c.png)
getbit：返回在指定offset上的bit值，0或1，如果iffset超过string value的长度，该命令将返回0，所以对于空字符串始终返回0。
**GETBIT **key offset 
127.0.0.1:6379> get mykey
"\x03"
127.0.0.1:6379> getbit mykey 6
(integer) 1
127.0.0.1:6379> getbit mykey 10
(integer) 0
Mget:N表示获取Key的数量。返回所有指定Keys的Values，如果其中某个Key不存在，或者其值不为string类型，该Key的Value将返回nil。
**MGET**key [key ...] 
![image.png](/common/1609927625487-aa862ca3-067f-4735-b8d1-bdd2811a13a2.png)
Mset:N表示指定Key的数量。该命令原子性的完成参数中所有key/value的设置操作，其具体行为可以看成是多次迭代执行SET命令。
 **MSET**key value [key value ...] 
Msetnx:N表示指定Key的数量。该命令原子性的完成参数中所有key/value的设置操作，其具体行为可以看成是多次迭代执行SETNX命令。然而这里需要明确说明的是，_如果在这一批Keys中有任意一个Key已经存在了，那么该操作将全部回滚，即所有的修改都不会生效。_
**MSETNX**key value [key value ...] 
 
教程地址：[https://www.cnblogs.com/ITzhangyunpeng/p/9558466.html](https://www.cnblogs.com/ITzhangyunpeng/p/9558466.html)
