---
title: Bat命令
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
    - Windows
tag:
    - 无
filename: batmingling
---
## 基础语法

on和off都是echo的关键字,echo on 是打开回显，echo off是关闭回显。系统默认是echo on。echo off只能关闭echo off后面的代码的回显，但不能关闭自身的回显，所以需要加上@关闭自身的回显。

```bash
@echo off

echo 输出内容

pause	 
```

> pause：一般在最后调用，防止dos窗口关闭

## 输入输出

输出文本

```
echo start build
```

## 文件操作

### 移动文件

```
REM 拷贝文件夹到目标文件夹
set "sourceFolder=.\src\.vuepress\dist"
set "destinationFolder=..\kbms\dist"
robocopy "%sourceFolder%" "%destinationFolder%" /e /purge /ndl /nfl
```

> %sourceFolder% 是源文件夹的路径。
>
> %destinationFolder% 是目标文件夹的路径。
>
> /e 表示复制所有子目录和文件，包括空子目录。
>
>  /purge 表示在目标文件夹中删除那些在源文件夹中不存在的文件和文件夹。
>
> /ndl 禁止显示目录
>
> /nfl 禁止显示文件列表

### 删除文件

```csharp
//删除download文件夹中的文件
del C:\download\*.*

//删除download文件及其子目录
rd /s /q C:\download\*.*

//带空格的文件夹名字或带空格的文件的名字都需要用英文的双引号括起来
rd /s /q "D:\Documents"
```
> /s 参数表示删除该文件夹及其下面的子目录和文件
> /q 参数表示安静进行，不需要确认

示例

删除同步文件下的文档

```csharp
rd /s /q "C:\Users\user.LAPTOP-LBQ8556U\AppData\Roaming\Scooter Software\Beyond Compare 4"
```
