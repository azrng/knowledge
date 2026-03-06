---
title: Git基础操作
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 003
category:
  - Git
tag:
  - 无
filename: gitjichucaozuo
---

## 命令速查

![8c0a8152f83c5fdd87c3ac1ff33199d](/soft/8c0a8152f83c5fdd87c3ac1ff33199d.jpg)

## 基本流程

### 创建仓库

可以创建本地仓库或者拉取远程创建好的仓库

#### 创建本地仓库

将本地一个文件夹变为Git可以管理的仓库，并且添加远程地址，然后拉取项目
```bash
git init
```

#### 拉取远程仓库

```bash
git clone https://用户名:密码@仓库地址

## 拉取某一分支
git clone -b 分支名 https://gitee.com/AZRNG/event-bus.git
```

#### Git创建版本库
版本库又叫做仓库，英文名称是repository，你可以理解为是一个目录，这目录里面所有的问题都可以被Git管理起来，每一个文件的修改删除Git都可以进行跟踪，以便任何时刻都可以追踪历史或在将来的某一个时间可以还原。
创建版本库，找到一个合适的地方，然后右键选择Git Bash Here
命令：mkdir learngit
![](/common/1609895695392-9b9f4eb4-703d-4b3e-a621-d17143df75c1.png)
进入这个目录
命令：cd learngit
显示当前目录
命令：pwd
![](/common/1609895695421-5c38cc4f-5bc9-49eb-b9b6-6f3b2ea97230.png)
通过 git init 命令可以把这个目录变成Git可以管理的仓库
![](/common/1609895695405-c17db9d4-1956-4dec-ac6e-c36ae2c15d85.png)
然后我们就建好了一个空的仓库，在查看隐藏项目的条件下，我们可以看见都一个.git的目录，这个是Git用来跟踪管理版本文件的。或者使用ls -ah命令就可以看见。

### 添加文件
在仓库下创建一个文件为readme.txt，接着我们使用命令 git add告诉Git，把文件添加到仓库。
![](/common/1609895695399-37daa1e4-3a25-44d7-b36e-9e57a9784930.png)

### 提交
使用git commit告诉Git，把文件提交到Git仓库
![](/common/1609895695407-ba594cb2-2db3-4aec-9a99-39f1a8ccd752.png)

-m后面是本次提交的说明，可以输入有意义的提交内容
1 file changed：一个文件被改动
2 insertions：插入了两行内容
Git的添加文件和提交文件区分开来的目的是，因为一次性提交多个文件，所以你可以多次add不同的文件。比如：
```bash
git add file1.txt$ git add file2.txt file3.txt$ git commit -m "add 3 files."
```

### 推送

如果是远程仓库，那么就可以直接推送

```bash
git push
```


## 分支操作

### 创建分支
创建dev分支
```bash
git branch dev
```

### 切换分支
```bash
git checkout dev(分支名称)
```

### 查看当前分支
```bash
git branch -a
```

### 合并分支
切换到主分支master，合并dev分支到当前分支master
```bash
git merge dev
```

### 删除分支
```bash
git branch -d dev
```

### 推送分支
```bash
git push -u origin master
```

## 标签

### 创建标签
默认标签是打在最新提交的commit上
```bash
git tag v1.0
```

### 删除标签
```bash
git tag -d v0.1
   
# 删除远程标签
git tag -d v0.9
git push origin :refs/tags/v0.9
```

### 推送标签到远程仓库
```bash
#推送指定标签至远程
git push origin v0.1
   
#推送全部标签至远程
git push origin --tags
```

### 切换标签
```bash
#tag标签管理
git tag

#切换
git checkout tag值
```

## 仓库信息

### 查看仓库当前状态
继续修改readme.txt文件，然后我们运行git status命令查看结果
```bash
git status
```
On branch masterChanges not staged for commit: (use "git add &lt;file&gt;..." to **update**what will be committed) (use "git checkout -- &lt;file&gt;..." **to** discard changes **in** working directory)
               modified:  readme.txt  **no** changes added **to commit** (use "git add" **and**/**or** "git commit -a")
这告诉我们readme.txt已经被吸怪了，但是还没有准备提交

### 查看上次的修改
使用命令git diff
```bash
git diff
```
diff --git a/readme.txt b/readme.txt
index d8036c1..013b5bc 100644
--- a/readme.txt
+++ b/readme.txt
@@ -1,2 +1,2 @@
-Git is a version control system.
+Git is a distributed version control system.
 Git is free software.
\ No newline at end of file
再次提交修改后的文件到仓库，第一步是git add
![](/common/1609895695441-6acb1f2a-2668-4192-a73b-ba538c62b468.png)
再次提交
![](/common/1609895695408-a48c801a-985a-4254-a6ab-f9c58c75d87d.png)
查看文件状态

> git statusOn branch masternothing to **commit**, working tree clean


### 查看提交的历史记录
```bash
git log
```
![](/common/1609895695418-f9828876-0c63-4fec-826c-19e8374d96fd.png)
显示顺序是从最近到最远的提交日志

### Git版本回退
Git中使用HEAD表示当前版本，上一个版本是HEAD^,上上一个版本是HEAD^^，往上100个版本是HEAD~100.
现在回退到上一个版本
```bash
git reset
```
![](/common/1609895695414-4e4fb09d-7687-41d3-9525-d360df177320.png)
查看内容果然被还原了
Git版本回退、撤销修改、删除文件 接着看网址：[此处](/common/897013573512192)

### 清除已删除的远程分支
```bash
git fetch -p（如果这个分支已经在本地也创建那么删除不掉）
```

### 删除本地分支
```bash
git branch -d <branchName> (会在删除前检查merge状态，避免误删没有合并的分支)
```

