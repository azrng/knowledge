---
title: 服务器定时计划
lang: zh-CN
date: 2022-12-28
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: fuwuqidingshijihua
slug: drfgz8
docsId: '31816460'
---
需求：每天定时备份一次数据库，然后每次备份的时候删除7天前的备份记录
 
1、我们创建一个文档（以城市之窗项目为例）
 
@echo off
echo 正在备份城市之窗数据库，请稍等......
expdp DYZHCSLEAPP/NYEKTLEAPP@ORANEWLE dumpfile=%date:~0,4%%date:~5,2%%date:~8,2%.DMP LOGFILE=%date:~0,4%%date:~5,2%%date:~8,2%.log schemas=(DYZHCSLEAPP)
 
echo 删除过久的备份记录
forfiles /P D:\app\Administrator\admin\ORANEWLE\dpdump /M *.dmp /S /D -7 /C "cmd /c del /F /s /q @file"
forfiles /P D:\app\Administrator\admin\ORANEWLE\dpdump /M *.log /S /D -7 /C "cmd /c del /F /s /q @file"
 
echo 任务完成
exit
 
2、把这个文件修改成bat文件
![image.png](/common/1614064792022-c82d9ed4-424e-4792-9355-b3710a9be2c1.png)
3、创建windows任务计划
 
![image.png](/common/1614064792037-f316543f-bd83-44de-ab97-1529323d49f4.png)
4、创建任务
![image.png](/common/1614064792039-1253c783-3a32-4933-85f4-95f2adf91725.png)
5、开始设置选项，这几个都要选择
![image.png](/common/1614064792037-7a355def-55ff-4931-95e4-79114125a136.png)
6、新建触发器
![image.png](/common/1614064792049-be296c5e-3ec2-4594-aef3-dd2a6be5bce9.png)
7、新建操作
![image.png](/common/1614064792044-e755efef-fff4-47d3-a363-f6ba90618bc7.png)
8、条件上面没有特殊的操作
![image.png](/common/1614064792055-4c2a7a6a-d06c-4620-a50e-e7fd868d1cea.png)
9、设置
![image.png](/common/1614064792051-a2db2806-00c6-40ab-ba7f-457481768dbb.png)
10、设置完毕
等待第二天看定时任务是否正常执行。
