---
title: 说明
lang: zh-CN
date: 2023-07-22
publish: true
author: azrng
order: 001
category:
  - Git
tag:
  - 无
filename: git
---

## 说明
集中式的版本控制：版本库是集中存放在中央服务器的，需要首先去中央服务器取得最新的版本，然后每次编辑完以后在推送到中央服务器，最大的缺点就是必须联网才可以使用，如果是局域网的话宽带大，如果是在互联网上，网速慢的情况，提交非常慢。
分布式版本控制：没有中央服务器，每一个人的电脑上都是一个完整的版本库，推送的时候是两个人吧各自的修改推送给对方，然后就可以看到对方的修改。分布式安全性更高，因为每个人的电脑里面都存在完整的版本库。但是实际上，分布式版本控制也有一个电脑充当与中央服务器，它是用来方便“交换”大家的修改。

## 加速克隆
```markdown
git clone https://gitclone.com/github.com/xxx 加速克隆
```

## Git下载

下载地址：https://git-scm.com/download/win

## 第三方客户端

* [SourceTree](https://confluence.atlassian.com/get-started-with-sourcetree/install-sourcetree-847359094.html)
* [腾讯UGIT](https://ugit.qq.com/zh/index.html)
* TortoiseGit

## 常见问题

1、如果你提交时候发现对方已经提交到远程，那么你提交时候回报错提示对方已经提交有东西。
解决方法：
a、b两人拉取主分支（保持主分支是最新的），然后分别在主分支上面创建分支a1、b1,然后切换到
各自的分支，a修改了一些数据，然后提交推送到了分支a1，b在分支b1上面修改并提交推送了一些东西到分支b1，然后a切换到主分支，右键合并分支，从a1分支合并，合并过以后切记要进行推送，b也切换到主分支，先拉取一下主分支（拉取成最新的数据），然后右键合并分支从b1合并分支并提交推送。
如果a接着开发，那么a需要在主分支拉取下最新数据，然后切换到分支a1，然后点击右键合并从主分支，这样子把分支a1也弄成了最新数据。b操作了也先拉取。

修改之前先拉取

目前可以正常操作的拉取方式：如果有修改，那么先提交，然后拉取，这个时候可能出错，那么不要担心，正常解决冲突就行，然后拉取成功后，查看下项目有没有问题，没有问题的话就可以推送上去。

同步：从远程存储库往本地同步（拉取代码）
拉取：从远程拉取最新版本到本地自动合并
获取：从远程获取最新版本到本地，不会自动合并，实际使用中这种更安全（获取后还需要从远程这个分支合并到本地这个分支） 
推送：推送到远程服务存储库
提交：相当于commit，提交到本地存储库
提交和推送：现在本地存储库提交然后再推送到远程服务器
提交和同步：先提交到本地然后拉取远程服务器然后再推送

## 资料

廖雪峰Git教程：[https://www.liaoxuefeng.com/wiki/896043488029600](https://www.liaoxuefeng.com/wiki/896043488029600)
看完这一篇学会使用Git：[https://www.cnblogs.com/wupeixuan/p/11947343.html](https://www.cnblogs.com/wupeixuan/p/11947343.html)
[https://www.cnblogs.com/huangtailang/p/4748075.html](https://www.cnblogs.com/huangtailang/p/4748075.html) | Git 以分支的方式同时管理多个项目 - HTL - 博客园
线上学习：[https://learngitbranching.js.org/](https://learngitbranching.js.org/)
Git飞行指南：[https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)
