---
title: 常用操作
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - Git
tag:
  - 无
filename: commonOperator
---

## 本地仓库拉取远程仓库代码

```bash
git init
git remote add origin https://gitee.com/xxxx.git
git pull
```

## 更改仓库对应的地址

在仓库目录下右键Git Bash Here中输入命令
查询关联

```
git remote -v
```

![](/common/1609895610758-de53f895-e871-4140-a702-72b7af02de74.png)
```bash
# 删除关联
git remote rm origin

# 添加关联
git remote add origin 新地址git链接

# 推送主分支：
git push -u origin master 

# 推送其他分支       
git push -u origin develop #

# 查看所有分支：
git branch -av
```

## 仓库地址HTTPS 替换 SSH

此处以 Github 为例，在命令行中输入以下内容即可 (替换所有的 HTTPS 为 SSH)

```bash
# 全局处理
git config --global url.ssh://git@github.com/.insteadOf https://github.com/

# 对单个仓库生效，需要在仓库目录下指定命令
git config url.ssh://git@github.com/.insteadOf https://github.com/
```

## 更新仓库origin地址

1. 首先，打开终端或命令行界面，并导航到您的本地 Git 仓库所在的目录。

2. 使用以下命令移除现有的远程仓库：

```plain
git remote remove origin
```

3. 接下来，使用 SSH URL 添加新的远程仓库。请使用您的 Git 仓库的 SSH URL（例如：git@github.com:user/repo.git），并执行以下命令：

```plain
git remote add origin [SSH URL]
```

请将 [SSH URL] 替换为您的 Git 仓库的实际 SSH URL。

4. 现在您可以尝试拉取最新更新的代码了。执行以下命令来拉取远程分支的代码：

```plain
git pull origin [branch]
```

请将 [branch] 替换为您想要拉取的远程分支的名称，例如 main 或 master。

现在您的 Git 仓库将使用 SSH 方式进行拉取和推送操作。
