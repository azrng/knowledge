---
title: 11g创建数据库
lang: zh-CN
date: 2022-12-28
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
filename: 11gchuangjianshujuku
slug: bsf1gg
docsId: '31815773'
---
方法/步骤
①. 按住键盘上Windows键，打开开始菜单，找到Database Configuration Assitant并打开
![image.jpeg](/common/1614064424438-919e5226-858d-4542-8414-15d67a265803.jpeg)
 
②. 打开数据库配置助手Database Configuration Assitant，单击“下一步”;
 
      步骤1：选择“创建数据库”，单击“下一步”
![image.jpeg](/common/1614064424449-6b8b4135-5b25-492a-8179-8650b61a0f20.jpeg)
![image.jpeg](/common/1614064424459-1631a415-2ff0-4271-be20-8a3170e8cc5e.jpeg)
 
    步骤2：选择“一般用途或事务处理”，单击“下一步”；
    步骤3：设置数据库的名称和实例名，两者可设置相同，也可以不同，单击“下一步”
![image.jpeg](/common/1614064424465-310837b1-c5aa-48a8-9656-e78b0d2f8f84.jpeg)
 
    步骤4：管理选项配置，不勾选配置Enterprise Manager，单击“下一步”；
![image.jpeg](/common/1614064424462-2c0280d7-6d9c-4739-a2fb-6b1e69cf8a75.jpeg)
 
    步骤5：数据库身份证明,可以为不同的账户分别设置不同的管理口令，也可以为所有账户设置同一口令，单击“下一步”
![image.jpeg](/common/1614064424482-cb48827b-c4f1-4fa5-b872-9d029f6b7dec.jpeg)
 
    步骤6：数据库文件所在位置，默认存储类型：文件系统，存储位置：使用模版中的数据库文件位置，也可以自己指定存储路径，单击“下一步”；
![image.jpeg](/common/1614064424468-26a605bf-5e52-44d8-8127-746ee6bd5c6b.jpeg)
 
    步骤7：恢复配置，指定快速恢复区
![image.jpeg](/common/1614064424478-2c8bc9f2-5577-42f6-8e20-1015a6ea80c7.jpeg)
 
    步骤8：数据库内容，根据需要，选择是否添加示例方案，单击“下一步”；
    步骤9：初始化参数，设置内存、字符集等，单击“下一步”
![image.jpeg](/common/1614064424491-1be84c13-3c51-4f6e-8812-d9dfae83398a.jpeg)
一般这里服务器上面创建的内存大小20G就可以了
![image.jpeg](/common/1614064424637-8a04ec95-6b2b-4950-a0b8-c8688ef8e78c.jpeg)
![image.jpeg](/common/1614064424526-255b036d-0c2f-40d1-91be-fed4e9dd4d0d.jpeg)
 
    步骤10：数据库存储，控制文件、数据文件、重做日志文件位置设置，单击“下一步”；
![image.jpeg](/common/1614064424514-c642404b-def9-4ff1-8a40-f85cbd1d7829.jpeg)
 
    步骤11 ：创建选项，创建数据库，生成脚本，单击“完成”，开始创建数据库
![image.jpeg](/common/1614064424509-6335aa67-1dda-481b-958e-0c73fb66f064.jpeg)
![image.jpeg](/common/1614064424548-32a11630-4621-4047-83df-8fc4dfa94fad.jpeg)
**创建用户与生成表空间代码**
注意： 在创建表空间的时候要注意路径必须符合Oracle安装路径。
![image.png](/common/1614064424519-b707b0fc-c80c-457b-9b57-950c4aefeb04.png)
 
