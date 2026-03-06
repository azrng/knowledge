---
title: Shell命令
lang: zh-CN
date: 2023-07-24
publish: true
author: azrng
category:
    - Windows
tag:
    - 命令
    - shell    
filename: shCommand
---

## 基础语法

```sh
#!/bin/bash

echo "Output content"
```

## 输入和输出

输出信息

```sh
# 输出普通文字
echo "start build"

# 输出黄色文字
echo -e "\033[33m Output all the services: \033[0m"
```

输入信息

```sh
echo "input e to finish"
while read input
do
    if [ $input == "e" ]
    then
        break
    else
        ehco "input value show"
        echo $input
    fi
done
```

## 安装

### 安装Ping命令

```shell
# 查看系统信息 
cat /etc/os-release

# 发现是Debian系统，那我们使用apt安装ping工具
apt-get update
apt -y install iputils-ping
```

## Issue

### $'\r':command not found

在linux上执行脚本时出现$’\r’:command not found,然而仔细检查脚本，对应行位置只是一个空行，并没有问题，那么linux为什么会将一个回车的空行报错？

原因是这样的：脚本是在window下编辑完成后上传到linux上执行的，win下的换行是回车符+换行符，也就是\r\n,而unix下是换行符\n。linux下不识别\r为回车符，所以导致每行的配置都多了个\r，因此是脚本编码的问题，可以在服务器上安装dos2unix并使用dos2unix 来转换sh文件格式来解决问题，例如在ubuntu中执行

```shell
# 安装
sudo apt install dos2unix   

# 执行脚本 将对应的sh文件转换格式
sudo dos2unix run.sh

# 然后再次执行脚本
sh run.sh
```
