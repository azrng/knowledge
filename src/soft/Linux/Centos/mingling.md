---
title: 命令
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 003
category:
  - Linux
tag:
  - 无
filename: mingling
---

## 文件

### 目录

#### ls
查看目录下文件
```bash
-- 查看当前目录文件
ls

-- 查看指定目录文件
ls  /var/tmp
```

#### mkdir
创建目录
```bash
-- 创建目录
mkdir testFolder
```

#### mv
移动目录或者文件
```bash
-- 移动一个文件夹到指定目录
mv testFolder /var/tmp

-- 移动文件到指定目录
mv aa.txt /var/tmp
```

### 文件

#### touch
```bash
-- 创建文件
touch ~/testFile
touch testFile
```

#### cp
复制文件
```bash
-- 复制当前目录文件到当前目录
cp testFile testNewFile

```

#### rm
删除文件，输入y后回车确认删除
```bash
-- 删除当前目录文件
rm testFile

-- 删除目录
rm -f testFolder
```

#### cat
查看文件内容
```bash
-- 查看操作历史文件的内容
cat ~/.bash_history


```

#### grep
过滤文件
```bash
-- 过滤出 /etc/passwd 文件中包含 root 的记录
grep 'root' /etc/passwd

--递归地过滤出 /var/log/ 目录中包含 linux 的记录
grep -r 'linux' /var/log/
```

## 管道
Linux 中管道的作用是将上一个命令的输出作为下一个命令的输入, 像 pipe 一样将各个命令串联起来执行, 管道的操作符是 |
```bash
-- 可以将 cat 和 grep 两个命令用管道组合在一起
cat /etc/passwd | grep 'root'

-- 过滤出 /etc 目录中名字包含 ssh 的目录(不包括子目录)
ls /etc | grep 'ssh'
```

## 重定向
可以使用 > 或 < 将命令的输出重定向到一个文件中
```bash
-- 将hello world 输入到一个txt中
echo 'Hello World' > ~/test.txt

```

## 网络

### IP

#### ping
检查是否联通
```bash
--对 cloud.tencent.com 发送 4 个 ping 包, 检查与其是否联通
ping -c 4 cloud.tencent.com


```

### netstat
显示各种网络相关信息，如网络连接、路由表接口状态等
```bash
-- 列出所有处于监听状态的tcp端口
netstat -lt

--查看所有的端口信息, 包括 PID 和进程名称
netstat -tulpn
```

## 系统

### 进程

#### ps
获取进程信息
```bash
-- 获取当前进程信息
ps aux

-- 过滤得到当前系统中的 ssh 进程信息
ps aux | grep 'ssh'
```
