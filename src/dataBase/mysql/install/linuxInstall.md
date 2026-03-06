---
title: Linux安装
lang: zh-CN
date: 2021-05-14
publish: true
author: azrng
isOriginal: true
category:
  - dataBase
tag:
  - 无
---

## linux部署mysql5.7

### 下载包

首先先下载好mysql包，版本是[5.7.26](https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar)  [8.0版本](https://repo.mysql.com/mysql80-community-release-el7-3.noarch.rpm)

其他版本：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)然后需要把这个压缩包上传到linux服务器上面
上传的话我们应该使用rz组件进行选择上传，如果是新的linux，那么我们

### 解压安装包

安装命令如下：

```
yum install -y lrzsz
```

1、在服务器创建一个目录，用于我们存放mysql数据库
```
mkdir Mysql//创建一个专门的Mysql目录
```
2、解压压缩包并放入指定目录下
```
tar xf /root/mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar  -C Mysql  //将解压的文件放到Mysql目录下
```
3、在刚才解压的root目录下开始安装mysql依赖包
```
yum -y install make gcc-c++ cmake bison-devel ncurses-devel libaio libaio-devel net-tools
```
4、由于CentOS7开始自带的数据库是mariadb，所以需要卸载系统中的mariadb组件，才能安装mysql的组件

```
mariadb：rpm -qa | grep mariadb
```

结果：mariadb-libs-5.5.60-1.el7_5.x86_64
移除mariadb：yum -y remove mariadb-libs

### 安装

接下来开始正式安装mysql，由于依赖关系，所以顺序是固定的
```
[root@youxi2 ~]## rpm -ivh Mysql/mysql-community-common-5.7.26-1.el7.x86_64.rpm
```

![image.png](/common/1609827663339-aa5aa2b4-6215-4315-b03e-56f905a5b2a9.png)

```
[root@youxi2 ~]## rpm -ivh Mysql/mysql-community-libs-5.7.26-1.el7.x86_64.rpm
```

![image.png](/common/1609827663332-08214d4d-c581-4e05-b074-bf5122b62a5e.png)
```
[root@youxi2 ~]## rpm -ivh Mysql/mysql-community-libs-compat-5.7.26-1.el7.x86_64.rpm
```

![image.png](/common/1609827663339-f4adac52-92bf-45c9-b91c-87f2569164f8.png)
```
[root@youxi2 ~]## rpm -ivh Mysql/mysql-community-client-5.7.26-1.el7.x86_64.rpm
```

![image.png](/common/1609827663329-d01bdd90-2c0c-409b-b0df-7daf6329408a.png)
```
[root@youxi2 ~]## rpm -ivh Mysql/mysql-community-server-5.7.26-1.el7.x86_64.rpm
```

![image.png](/common/1609827663333-b823df1d-6e05-4425-9861-66ef77a86d3e.png)

5、开启mysql
命令：systemctl start mysqld
6、设计开机自启
命令：systemctl enable mysqld
7、开启mysql
命令：systemctl status mysqld
8、查看密码
命令：grep "password" /var/log/mysqld.log
![image.png](/common/1609827663354-becac576-bd2c-4d19-9a59-4e21aeb346f9.png)
9、使用密码连接
命令：mysql -uroot -p"o-krEwzy6_sq"
![image.png](/common/1609827663360-bf9bdc39-8dc5-4b7e-8098-d7a86de7be6d.png)
10、修改密码，设置参数
命令：
set global validate_password_length=1;
set global validate_password_policy=0;
set password for root@localhost = password('zyp123456');
flush privileges;
![image.png](/common/1609827663384-a79986bd-7bc7-4d9f-ad9c-7944384ae45a.png)
11、设置外部也可以访问
命令:
update user set host = '%'  where user = 'root';
flush privileges;

select Host,User from user;
![image.png](/common/1609827663376-8254deb2-9520-47b8-8d60-c474cc08e6f7.png)


错误解决办法：
如果提示错误ERROR 1046 (3D000): No database selected
需要先use mysql

查询当前mysql运行状态：
service mysqld status
或者
service mysql status 


## linux部署mysql8.0
### 1、下载MySQL所需要的包
网址：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
Select Operating System: 选择 Red Hat ，CentOS 是基于红帽的，Select OS Version: 选择 linux 7
选择 RPM Bundle 点击 Download
到这个时候我们已经下载好了

### 2、卸载mariadb 

#### 2.1、查看**mariadb安装情况**
```
rpm -qa | grep mariadb
```

![image.png](/common/1609828011137-9f1d3a16-0b7b-46cd-99cb-9cff7cee609d.png)

#### 2.2、卸载**mariadb**
```
rpm -e mariadb-libs-5.5.56-2.el7.x86_64 --nodeps
```

![image.png](/common/1609828422512-7d3985e9-bffb-4ffa-8f90-1198f79b4016.png)
然后再次查看
![image.png](/common/1609832291905-8db6f963-af0b-4a52-9f76-d26629522627.png)

### 3、安装MySQL

#### 3.1、解压MySQL包
在/user/local/下新建目录mysql，然后将下载好的包上传到到目录下，然后包所在的位置是/user/local/mysql/包名称
解压
```
tar -xvf mysql-8.0.11-1.el7.x86_64.rpm-bundle.tar
```




#### 3.2、安装

- 安装common

```
rpm -ivh mysql-community-common-8.0.11-1.el7.x86_64.rpm --nodeps --force
```

- 安装libs

```
rpm -ivh mysql-community-libs-8.0.11-1.el7.x86_64.rpm --nodeps --force
```

- 安装client

```
rpm -ivh mysql-community-client-8.0.11-1.el7.x86_64.rpm --nodeps --force
```

- 安装server

```
rpm -ivh mysql-community-server-8.0.11-1.el7.x86_64.rpm --nodeps --force
```

- 查看MySQL安装包

```
rpm -qa | grep mysql
```

#### 3.3、数据库初始化
在mysql目录下执行：
```
mysqld --initialize;
chown mysql:mysql /var/lib/mysql -R;
systemctl start mysqld.service;
systemctl  enable mysqld;
```
![image.png](/common/1609833071562-7e6a2d7e-5a84-42d6-a50d-b80143ceeb47.png)

#### 3.4、查看数据库密码
```
cat /var/log/mysqld.log | grep password
```


#### 3.5、登录界面
```
mysql -uroot -p
```


### 4、注意事项
```
mysqld --initialize  --user=mysql --lower-case-table-names=1;
如果无法初始化则安装yum install -y libaio
```

## 自动化安装

自动化安装 MySQL 数据库拿来就用的 Shell 脚本：https://mp.weixin.qq.com/s/NYpHw9x2O1Hka0Ol9juH_Q

## 参考资料

[https://blog.csdn.net/weixin_42266606/article/details/80879571](https://blog.csdn.net/weixin_42266606/article/details/80879571)
[https://www.cnblogs.com/zsl-find/articles/11703973.html](https://www.cnblogs.com/zsl-find/articles/11703973.html)
[https://www.cnblogs.com/diantong/p/10962705.html](https://www.cnblogs.com/diantong/p/10962705.html)
