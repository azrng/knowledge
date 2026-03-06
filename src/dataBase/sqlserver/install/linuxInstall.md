---
title: Linux安装sqlserver
lang: zh-CN
date: 2023-08-06
publish: true
author: 惑豁猿
isOriginal: false
category:
  - soft
tag:
  - sqlserver
filename: sqlserverInstall
docsId: '6fd45f90-068e-422f-8b7a-8789a3271451'
---

## SQL Server 2022 安装

:::tip

数据库选择SQL Server 2022，系统选择Ubuntu 20.04

文档地址：SQL Server 2022文档地址：https://learn.microsoft.com/zh-cn/sql/sql-server/?view=sql-server-ver16

:::

SQL Server 2022先决条件：服务器内存至少需要2 GB 。

**1、导入公共存储库 GPG 密钥**

```bash
$ wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc
```

**2、注册 SQL Server Ubuntu 存储库**

```bash
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2022.list)"
```

**3、运行以下命令以安装 SQL Server**

```bash
sudo apt-get updatesudo apt-get install -y mssql-server
```

**4、等待安装完成后，运行 mssql-conf setup**

按照提示选择数据库版本及设置 SA 密码。其中数据库版本Evaluation、Developer 和 Express 版为免费版本。

```bash
sudo /opt/mssql/bin/mssql-conf setup
```

注意：SA 账户密码需要最小长度为 8 个字符，包括大写和小写字母、十进制数字和/或非字母数字符号。

此时如果正常，那恭喜您！但我尝试了好几次，都卡在了这里，系统提示：error while loading shared libraries: liblber-2.4.so.2

![图片](/common/9eb6bceb-0dca-463d-a20f-729ce879a038.png)

网上查了一堆资料，最终找到了解决办法：

下载安装libldap-2.4-2_2.4.47+dfsg.4-1+eagle_amd64包

```
wget https://community-packages.deepin.com/deepin/pool/main/o/openldap/libldap-2.4-2_2.4.47%2Bdfsg.4-1%2Beagle_amd64.debsudo dpkg -i libldap-2.4-2_2.4.47+dfsg.4-1+eagle_amd64.deb
```

再次运行 mssql-conf setup，继续设置，再次遇到问题，系统提示：error while loading shared libraries: libssl1.1，解决办法：

下载安装libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64包

```
wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.debsudo dpkg -i libssl1.1_1.1.1-1ubuntu2.1~18.04.23_amd64.deb
```

最后运行 mssql-conf setup，完成设置，没再报错。

5、验证服务是否正常运行

```
systemctl status mssql-server --no-pager
```

![图片](/common/93c80018-ff7f-4471-9721-5eafdc0fbe70.png)此时SQL Server 已在 Ubuntu 上正常运行。

**6、打开 SQL Server TCP 端口（默认值为 1433）**

开启内网远程访问，我们使用的是腾讯云，需要设置安全组，内网放行1433端口。

## **SQL Server 2022 配置**

SQL Server 数据库安装完成后，还需要进行一些常规配置。

**1、启用 SQL Server 代理**

为了进行日常数据备份等任务，我们需要开启代理：

```
sudo /opt/mssql/bin/mssql-conf set sqlagent.enabled true//重启服务生效sudo systemctl restart mssql-server
```

**2、更改默认数据或日志目录位置**

使用 filelocation.defaultdatadir 和 filelocation.defaultlogdir 设置可更改创建新数据库和日志文件的位置。默认路径为：/var/opt/mssql/data。可以使用以下步骤进行修改：

```
//为新的数据库数据和日志文件创建目标目录sudo mkdir /home/d/mssql/data
//将目录的所有者和组更改为 mssql 用户sudo chown mssql  /home/d/mssql/datasudo chgrp mssql  /home/d/mssql/data
//使用 mssql-conf 通过 set 命令更改默认数据目录sudo /opt/mssql/bin/mssql-conf set filelocation.defaultdatadir /home/d/mssql/data
//使用 mssql-conf 通过 set 命令更改默认日志文件目录sudo /opt/mssql/bin/mssql-conf set filelocation.defaultlogdir /home/d/mssql/data
//重启服务生效sudo systemctl restart mssql-server
```

**3、更改生成备份文件的默认位置**

使用 filelocation.defaultbackupdir 设置可更改生成备份文件位置。默认路径为：/var/opt/mssql/data。可以使用以下步骤进行修改：

```
//为新的备份文件创建目标目录sudo mkdir /home/d/mssql/bak/ -p
//将目录的所有者和组更改为 mssql 用户sudo chown mssql /home/d/mssql/backupsudo chgrp mssql /home/d/mssql/backup
//使用 mssql-conf 通过 set 命令更改默认备份目录sudo /opt/mssql/bin/mssql-conf set filelocation.defaultbackupdir /home/d/mssql/backup
//重启 SQL Server 服务sudo systemctl restart mssql-server
```

更多配置请查看文档：

```
https://learn.microsoft.com/zh-cn/sql/linux/sql-server-linux-configure-mssql-conf?view=sql-server-ver16
```

**4、设置数据库自动备份**

备份是保护数据的唯一方法，为了防止数据丢失和保障业务的持续性，需要对数据进行备份。这里采用的方案是按天进行完整备份，按小时进行差异备份，在还原数据时，只需要选择完全备份和差异备份集，打上勾后进行还原即可。

**完整备份**是指备份整个数据库，包括表、索引、视图和存储过程等所有数据库对象，完整备份所需时间较长，占用空间也最多，但恢复数据时只需还原单个文件，因此最为简单和快速。

**差异备份**是针对上一次完全备份来说的，它只备份自上次完全备份之后发生更改的数据。因此，差异备份比完全备份小，还原也比完全备份快且对性能影响最小。

我使用 SQL Server 代理中提供的作业来执行计划，新建两个作业，一个执行完整备份任务，一个执行差异备份任务。如下图所示



![图片](/common/a1359e6e-5a18-4217-b255-2b9b1afde853.png)

首先、设置作业的步骤，我们可以在步骤中添加执行备份任务的脚本。

![图片](/common/f0755bce-2950-46ea-8261-5938478673e9.png)

然后、设置作业计划，指定脚本执行的时间周期及间隔。

![图片](/common/aa575bfb-58d1-407e-a43d-9de0b10f10b3.png)

这样就可以了，以上为演示截图。

SQL Server 完整备份脚本：

```
DECLARE @Path NVARCHAR(50) = '/home/d/mssql/bak/test_';SET @Path= CONCAT(@Path,CONVERT(NVARCHAR(10),GETDATE() ,120),'.bak');

BACKUP DATABASE test  TO DISK = @Path  WITH FORMAT;  GO
```

这段脚本的功能是将名为 test 的数据库备份到指定路径下的文件，备份文件的路径是 /home/d/mssql/bak/test_YYYYMMDD.bak，其中 YYYYMMDD 是当前日期的形式。执行备份时，会覆盖原有备份文件，重新备份。

SQL Server 差异备份脚本：

```
DECLARE @Path NVARCHAR(50) = '/home/d/mssql/bak/test_';SET @Path= CONCAT(@Path,CONVERT(NVARCHAR(10),GETDATE() ,120),'.bak');
BACKUP DATABASE test  TO DISK = @Path  WITH DIFFERENTIAL;  GO
```

这段代码的功能是在 test 数据库上一次完整备份的基础上，进行差异备份，通过 TO DISK = @Path 指定完整备份路径。执行备份时，SQL Server 会把差异备份的文件追加到有备份文件中。

在脚本中使用 EXPIREDATE 指令可以设置备份的过期日期，当备份文件超出指定的备份的过期日期时，SQL Server 将清除备份集中满足日期束缚的备份作业。例如：

```
DECLARE @Path NVARCHAR(50) = '/home/d/mssql/bak/test_';SET @Path= CONCAT(@Path,CONVERT(NVARCHAR(10),GETDATE() ,120),'.bak');
DECLARE @ExpiryTime  DATETIME2(7)=DATEADD(mm, 1, GETDATE());
BACKUP DATABASE test  TO DISK = @Path  WITH  EXPIREDATE =@ExpiryTime;GO
```

同时在脚本中使用 COMPRESSION 指令可设置备份文件自动压缩，还可以指定压缩的算法。例如：

```
//参考文档：https://learn.microsoft.com/zh-cn/sql/relational-databases/integrated-acceleration/use-integrated-acceleration-and-offloading?view=sql-server-ver15
//使用默认MS_XPRESS压缩选项WITH COMPRESSION (ALGORITHM = MS_XPRESS);
```

SQL Server 数据库的备份和还原文档：

```
https://learn.microsoft.com/zh-cn/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases?view=sql-server-ver16
```

Linux 上的 SQL Server 的性能最佳做法和配置指南：

```
https://learn.microsoft.com/zh-cn/sql/linux/sql-server-linux-performance-best-practices?view=sql-server-linux-ver16
```

## 参考资料

探索SQL Server 2022在Ubuntu 20.04上的安装、配置、备份与常见问题：https://mp.weixin.qq.com/s/68zSJ9CSl2V8XvG6-VGDMg