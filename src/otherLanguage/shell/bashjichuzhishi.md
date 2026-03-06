---
title: Bash基础知识
lang: zh-CN
date: 2023-02-27
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: bashjichuzhishi
slug: goqrx7fvbtfeizao
docsId: '106666714'
---

## 数据类型

### 变量
```bash
## 定义变量
name="张三"
echo $name

## 接收输入
echo "请输入"
read name
echo "您输入的值为：${name}"
```

### 数组
```bash
## 定义数组
declare -a list=()

## 给数组添加值
list[0]=123
list[1]=456

echo "输出数组长度"
echo "${#list[@]}"
echo "${#list[*]}"

echo "循环输出数组的内容"
for i in ${list[*]}
do
   echo $i
done

echo "输出数组内容平铺"
echo "${list[*]}"
echo "${list[@]}"

## 判断数组长度，为0就退出
len=${#list[@]}
## -le：类似于<=
if [ $len -le 0 ]
then
    echo -e "\033[31m your input is empty,and exit shell \033[0m"
    exit 2
fi
```
数组内容介绍：[https://blog.csdn.net/zhaoyq008/article/details/103512445/](https://blog.csdn.net/zhaoyq008/article/details/103512445/)

### 字典(关联数组)
```bash
## 定义字典
declare -A dict=( 
    ["001"]="mysql"
    ["002"]="rabbitmq"
)

## 输出key以及对应的value
for key in $(echo ${!dict[*]})
do
    echo "$key --> ${dict[$key]}"
done
```

## 逻辑语句
基本语法
```bash
if [ command ]; then
符合该条件执行的语句
fi
```
扩展语法
```bash
if [ command ];then
符合该条件执行的语句
elif [ command ];then
符合该条件执行的语句
else
符合该条件执行的语句
fi
```
字符串判断
[ -z STRING ] 如果STRING的长度为零则返回为真，即空是真
[ -n STRING ] 如果STRING的长度非零则返回为真，即非空是真
[ STRING1 ]　 如果字符串不为空则返回为真,与-n类似
[ STRING1 == STRING2 ] 如果两个字符串相同则返回为真
[ STRING1 != STRING2 ] 如果字符串不相同则返回为真
[ STRING1 < STRING2 ] 如果 “STRING1”字典排序在“STRING2”前面则返回为真。
[ STRING1 > STRING2 ] 如果 “STRING1”字典排序在“STRING2”后面则返回为真。

数值判断
[ INT1 -eq INT2 ] INT1和INT2两数相等返回为真 ,=
[ INT1 -ne INT2 ] INT1和INT2两数不等返回为真 ,<>
[ INT1 -gt INT2 ] INT1大于INT2返回为真 ,>
[ INT1 -ge INT2 ] INT1大于等于INT2返回为真,>=
[ INT1 -lt INT2 ] INT1小于INT2返回为真 ,<
[ INT1 -le INT2 ] INT1小于等于INT2返回为真,<=

逻辑判断
[ ! EXPR ] 逻辑非，如果 EXPR 是false则返回为真。
[ EXPR1 -a EXPR2 ] 逻辑与，如果 EXPR1 and EXPR2 全真则返回为真。
[ EXPR1 -o EXPR2 ] 逻辑或，如果 EXPR1 或者 EXPR2 为真则返回为真。
[ ] || [ ] 用OR来合并两个条件
[ ] && [ ] 用AND来合并两个条件

## 循环语句

### for
```bash
## 循环
for key in 1 2 3 4 5
do
   echo "${key}"
done


```

### while

## 参考文档
[https://blog.csdn.net/hbsyaaa/article/details/106322841](https://blog.csdn.net/hbsyaaa/article/details/106322841)
