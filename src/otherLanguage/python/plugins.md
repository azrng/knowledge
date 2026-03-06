---
title: IDE插件
lang: zh-CN
date: 2023-09-17
publish: true
author: azrng
isOriginal: true
category:
  - otherLanguage
tag:
  - 无
filename: idechajian
slug: ryp7dg
docsId: '26628700'
---

### Key Promoter X
它就相当于一个快捷键管理大师，它时刻地在：

- 教导你，当下你的这个操作，应该使用哪个快捷操作来提高效率？
- 提醒你，当下你的这个操作，还没有设置快捷键，赶紧设置一个？

有了  `Key Promoter X`，你很快就能熟练地掌握快捷键，替代鼠标指日可待。
比如我使用鼠标点开 `Find in Path`，它就会在右下角弹窗提示你该用哪个快捷键

### Vim in PyCharm
在大多数场景之下，使用鼠标的效率和精准度，是远不如键盘快捷键的（前提是你已经相当熟练的掌握了快捷键），这个你得承认吧。
Vi 可以满足你对文本操作的所有需求，比可视化界面更加效率，更加 geek。如果你和我一样，是忠实的 vim 粉。在安装完 Pycharm 完后，肯定会第一时间将 `ideaVim` 这个插件也装上，它可以让我们在 Pycharm 中 使用 vim 来编辑代码。

### Markdown in PyCharm
富文本排版文档是一件非常痛苦的事情 ，对于程序员写文档，最佳的推荐是使用 Markdown ，我所有的博客日记都是使用 Markdown 写出来的。
从 Github下载的代码一般也都会带有README.md文件，该文件是一个Markdown格式的文件。
PyCharm是默认没有安装Markdown插件的，所以不能按照Markdown格式显示文本，显示的是原始文本。
因此，如果要在 PyCharm 中阅读 Markdown 文档，可以装一下 Markdown support 这个插件。

### Regex Tester in PyCharm
Regex Tester是PyCharm的第三方插件，可以测试正则表达式。

### Auto PEP8 in PyCharm
`pep8` 是Python 语言的一个代码编写规范。如若你是新手，目前只想快速掌握基础，而不想过多去注重代码的的编写风格（虽然这很重要），那你可以尝试一下这个工具 - `autopep8`
首先在全局环境中（不要在虚拟环境中安装），安装一下这个工具。
> sudo pip install autopep8

点击右键，选择 `External Tools` -> `AutoPep8 格式化`

