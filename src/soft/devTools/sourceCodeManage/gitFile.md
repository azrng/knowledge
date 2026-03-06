---
title: .git目录下有什么
lang: zh-CN
date: 2023-09-02
publish: true
author: Abin Simon
isOriginal: false
category:
  - csharp
tag:
  - class
  - 生成
# 是否显示到列表
article: false
---

## 1. 开始初始化

大家都知道，在开始使用 git 时，我们首先要做的就是执行 `git init`。这个指令会显示出一个我们都很熟悉的提示，特别是对于那些经常启动但又很快放弃的项目。

```
Initialized empty Git repository in /home/meain/dev/src/git-talk/.git/
```

接下来，我们来探索一下 `.git` 仓库里都有些什么。

```
$ tree .git

.git
├── config
├── HEAD
├── hooks
│   └── prepare-commit-msg.msample
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```

如上所示，创建了多个文件和文件夹。它们分别扮演什么角色呢？下面我们来逐一了解。

- `config` 是一个 txt 文件，里面记录了当前仓库的 git 设置，如作者信息、文件模式等。
- `HEAD` 表示仓库的当前 head。根据你设置的默认分支，它可能是 `refs/heads/master` 或 `refs/heads/main` 或其他你设定的名字。实际上，它指向 `refs/heads` 这个文件夹，并关联了一个名为 `master` 的文件，但该文件目前还不存在。只有在你完成首次提交后，`master` 文件才会生成。
- `hooks` 是一个特殊的目录，其中包含了可以在 git 执行任何操作前后运行的脚本。如果你对此感兴趣，我在这里写了一篇更详细的文章，介绍了 git 钩子的工作方式。(https://blog.meain.io/2019/making-sure-you-wont-commit-conflict-markers/)
- `objects` 存放的是 git 的对象，比如关于仓库中的文件、提交等的数据。我们稍后会对此进行深入探讨。
- `refs` 正如我们之前提到的，是用来存放引用的目录。例如，`refs/heads` 里存放的是分支的引用，而 `refs/tags` 则存放的是标签的引用。我们将进一步深入了解这些文件的内容。

### 1.1 加入一个新文件的操作

了解了 `.git` 中的初始文件集后，我们来进行第一个操作,将内容添加到 `.git` 目录。现在我们将创建并加入一个文件（此刻还未提交）。

```
echo 'meain.io' > file
git add file
```

执行后，变动如下：

```
--- init       2023-07-02 15:14:00.584674816 +0530
+++ add        2023-07-02 15:13:53.869525054 +0530
@@ -3,7 +3,10 @@
 ├── HEAD
 ├── hooks
 │   └── prepare-commit-msg.msample
+├── index
 ├── objects
+│   ├── 4c
+│   │   └── 5b58f323d7b459664b5d3fb9587048bb0296de
 │   ├── info
 │   └── pack
 └── refs
```

此操作主要引发了两个变化。首先，文件 `index` 被修改。index 是记录当前暂存信息的地方，这表明名为 `file` 的文件已经被加入到索引中。

更为关键的是，新建了一个 `objects/4c` 文件夹，并在其中添加了 `5b58f323d7b459664b5d3fb9587048bb0296de` 文件。

### 1.2 这个文件里都保存了什么内容？

为了深入理解 `git` 的存储机制，我们先来看看这个文件具体包含了什么信息。

```
$ file .git/objects/4c/5b58f323d7b459664b5d3fb9587048bb0296de
.git/objects/4c/5b58f323d7b459664b5d3fb9587048bb0296de: zlib compressed data
```

那么，这个用 zlib 压缩的数据中具体包含了什么呢？

```
$ zlib-flate -uncompress <.git/objects/4c/5b58f323d7b459664b5d3fb9587048bb0296de
blob 9\0meain.io
```

从结果可以看出，这个文件记录了我们之前通过 `git add` 命令添加的 `file` 文件的相关信息，包括文件的类型、大小和内容。具体地说，文件类型为 `blob`，大小为 `9`，内容则是 `meain.io`。

### 1.3 那个文件名是如何得来的？

这确实是个有趣的问题。这个文件名其实是基于内容的 sha1 哈希值生成的。通过对 zlib 压缩的数据进行 `sha1sum` 处理，我们就可以得到这样的文件名。

```
$ zlib-flate -uncompress <.git/objects/4c/5b58f323d7b459664b5d3fb9587048bb0296de|sha1sum
4c5b58f323d7b459664b5d3fb9587048bb0296de
```

`git` 在存储内容时，会使用内容的 `sha1` 哈希值，取其前两个字符作为文件夹名（如 `4c`），余下的部分作为文件名。这种方式是为了确保在 `objects` 文件夹中不会有过多的文件，从而使文件系统保持高效。

### 1.4 了解 `git cat-file`

实际上，由于这是 git 中的一个更为重要的部分，git 提供了一个基础命令 `git cat-file`，让我们可以更直观地查看它。通过 `-t` 参数，你可以查询对象的类型；使用 `-s` 参数，你可以得知对象的大小；而 `-p` 参数则能让你直观地查看对象的具体内容。

```
$ git cat-file -t 4c5b58f323d7b459664b5d3fb9587048bb0296de
blob

$ git cat-file -s 4c5b58f323d7b459664b5d3fb9587048bb0296de
9

$ git cat-file -p 4c5b58f323d7b459664b5d3fb9587048bb0296de
meain.io
```

## 2. 开始提交

现在我们已经了解当增加一个文件时，git 会有哪些变化，接下来，我们将通过进行"提交"操作来进行下一步探索。

```
$ git commit -m 'Initial commit'
[master (root-commit) 4c201df] Initial commit
 1 file changed, 1 insertion(+)
 create mode 100644 file
```

以下是相关的变动：

```
--- init        2023-07-02 15:14:00.584674816 +0530
+++ commit      2023-07-02 15:33:28.536144046 +0530
@@ -1,11 +1,25 @@
 .git
+├── COMMIT_EDITMSG
 ├── config
 ├── HEAD
 ├── hooks
 │   └── prepare-commit-msg.msample
 ├── index
+├── logs
+│   ├── HEAD
+│   └── refs
+│       └── heads
+│           └── master
 ├── objects
+│   ├── 3c
+│   │   └── 201df6a1c4d4c87177e30e93be1df8bfe2fe19
 │   ├── 4c
 │   │   └── 5b58f323d7b459664b5d3fb9587048bb0296de
+│   ├── 62
+│   │   └── 901ec0eca9faceb8fe0a9870b9b6cde75a9545
 │   ├── info
 │   └── pack
 └── refs
     ├── heads
+    │   └── master
     └── tags
```

变化还真多。首先有一个新文件 `COMMIT_EDITMSG`，顾名思义，它保存了最新的提交信息。

若直接运行 `git commit` 未带 `-m` 参数，git 会启动一个编辑器并加载 `COMMIT_EDITMSG` 文件，方便用户编辑提交信息。编辑完成后，git 就采用该文件内容作为提交信息。

此外，新增了一个 `logs` 目录，git 通过它来记录所有的提交变动。在此，你可以查看所有引用（refs）及 `HEAD` 的提交记录。

`object` 文件夹也发生了些变化，但首先，我希望你关注一下 `refs/heads` 目录，里面现有一个 `master` 文件。毫无疑问，这就是 `master` 分支的引用。来，我们进一步了解其中的内容。

```
$ cat refs/heads/master
3c201df6a1c4d4c87177e30e93be1df8bfe2fe19
```

显然，它是指向了一个新的对象。我们有方法查看这类对象，接着来试试。

```
$ git cat-file -t 3c201df6a1c4d4c87177e30e93be1df8bfe2fe19
commit

$ git cat-file -p 3c201df6a1c4d4c87177e30e93be1df8bfe2fe19
tree 62902ec0eca9faceb8fe0a9870b9b6cde75a9545
author Abin Simon <mail@meain.io> 1688292123 +0530
committer Abin Simon <mail@meain.io> 1688292123 +0530

Initial commit
```

> 你同样可以使用 `git cat-file -t refs/heads/master` 命令来查看。

看起来，这是我们未曾遇见的新对象类型：`commit`。从 `commit` 的内容中，我们得知它包含了一个哈希值为 `62902ec0eca9faceb8fe0a9870b9b6cde75a9545` 的 `tree` 对象，这与我们在提交时新加的对象相似。`commit` 还显示了这次提交的作者和提交者信息，这里都是我。最后，它还展示了这次提交的信息。

接下来，让我们看一下 `tree` 对象中包含的内容。

```
$ git cat-file -t 62902ec0eca9faceb8fe0a9870b9b6cde75a9545
tree

$ git cat-file -p 62901ec0eca9faceb8fe0a9870b9b6cde75a9545
100644 blob 4c5b58f323d7b459664b5d3fb9587048bb0296de    file
```

`tree` 对象中会通过其他 `tree` 和 `blob` 对象的形式呈现工作目录的状态。在这个示例中，因为我们仅有一个名为 `file` 的文件，所以你只能见到一个对象。细看的话，你会发现这个文件指向了我们在执行 `git add file` 时加入的那个初始对象。

下面展示了一个更为成熟的仓库中的 `tree` 示意。在 `commit` 对象关联的 `tree` 对象中，嵌套有更多的 `tree` 对象，用以标识不同的文件夹。

```
$ git cat-file -p 2e5e84c3ee1f7e4cb3f709ff5ca0ddfc259a8d04
100644 blob 3cf56579491f151d82b384c211cf1971c300fbf8    .dockerignore
100644 blob 02c348c202dd41f90e66cfeb36ebbd928677cff6    .gitattributes
040000 tree ab2ba080c4c3e4f2bc643ae29d5040f85aca2551    .github
100644 blob bdda0724b18c16e69b800e5e887ed2a8a210c936    .gitignore
100644 blob 3a592bc0200af2fd5e3e9d2790038845f3a5cf9b    CHANGELOG.md
100644 blob 71a7a8c5aacbcaccf56740ce16a6c5544783d095    CODE_OF_CONDUCT.md
100644 blob f433b1a53f5b830a205fd2df78e2b34974656c7b    LICENSE
100644 blob 413072d502db332006536e1af3fad0dce570e727    README.md
100644 blob 1dd7ed99019efd6d872d5f6764115a86b5121ae9    SECURITY.md
040000 tree 918756f1a4e5d648ae273801359c440c951555f9    build
040000 tree 219a6e58af53f2e53b14b710a2dd8cbe9fea15f5    design
040000 tree 5810c119dd4d9a1c033c38c12fae781aeffeafc1    docker
040000 tree f09c5708676cdca6562f10e1f36c9cfd7ee45e07    src
040000 tree e6e1595f412599d0627a9e634007fcb2e32b62e5    website
```

## 3. 进行修改

让我们对文件进行修改，并观察这样做的结果。

```
$ echo 'blog.meain.io' > file
$ git commit -am 'Use blog link'
[master 68ed5aa] Use blog link
 1 file changed, 1 insertion(+), 1 deletion(-)
```

更改内容如下：

```
--- commit      2023-07-02 15:33:28.536144046 +0530
+++ update      2023-07-02 15:47:20.841154907 +0530
@@ -17,6 +17,12 @@
 │   │   └── 5b58f323d7b459664b5d3fb9587048bb0296de
 │   ├── 62
 │   │   └── 901ec0eca9faceb8fe0a9870b9b6cde75a9545
+│   ├── 67
+│   │   └── ed5aa2372445cf2249d85573ade1c0cbb312b1
+│   ├── 8a
+│   │   └── b377e2f9acd9eaca12e750a7d3cb345065049e
+│   ├── e5
+│   │   └── ec63cd761e6ab9d11e7dc2c4c2752d682b36e2
 │   ├── info
 │   └── pack
 └── refs
```

总的来说，我们新增了三个对象。一个是含有文件新内容的 `blob` 对象，还有一个是 `tree` 对象，以及一个 `commit` 对象。

我们再次从 `HEAD` 或 `refs/heads/master` 开始追踪这些对象。

```
$ git cat-file -p refs/heads/master
tree 9ab377e2f9acd9eaca12e750a7d3cb345065049e
parent 3c201df6a1c4d4c87177e30e93be1df8bfe2fe19
author Abin Simon <mail@meain.io> 1688292975 +0530
committer Abin Simon <mail@meain.io> 1688292975 +0530

Use blog link

$ git cat-file -p 9ab377e2f9acd9eaca12e750a7d3cb345065049e
100644 blob e5ec63cd761e6ab9d11e7dc2c4c2752d682b36e2    file

$ git cat-file -p e6ec63cd761e6ab9d11e7dc2c4c2752d682b36e2
blog.meain.io
```

仔细观察的话，你会注意到 `commit` 对象现在有了一个额外的键名为 parent，它链接到上一个提交，因为当前提交是基于上一个提交创建的。

## 4. 创建新分支

现在我们需要创建一个新的分支。我们将使用 `git branch fix-url` 来完成这个操作。

```
--- update      2023-07-02 15:47:20.841154907 +0530
+++ branch      2023-07-02 15:55:25.165204941 +0530
@@ -27,5 +28,6 @@
 │   └── pack
 └── refs
     ├── heads
+    │   ├── fix-url
     │   └── master
     └── tags
...

此操作会在 `refs/heads` 目录下加入一个新的文件。该文件的名称就是我们新建的分支名，而内容则是最新的提交标识 id。

```batch
$ cat .git/refs/heads/fix-url
68ed5aa2372445cf2249d85573ade1c0cbb312b1
```

这基本上就是创建分支的全部内容。在 `git` 中，分支是相当轻便的。另外，标签的创建也是类似的操作，但它们是被创建在 `refs/tags` 目录下。

在 `logs` 目录下也新增了一个文件，该文件用于记录与 `master` 分支类似的提交历史信息。

## 5. 分支切换

在 `git` 中进行分支切换实际上是让 git 获取某个提交的 `tree` 对象，并更新工作区中的文件，使其与其中记录的状态相匹配。在此例中，由于我们是从 `master` 分支切换到 `fix-url` 分支，而这两个分支都指向同一个 `commit` 和它的 `tree` 对象，因此 `git` 在工作区的文件上并没有任何更改。

```
git checkout fix-url
```

在进行分支切换时，`.git` 目录中唯一发生的变化是 `.git/HEAD` 文件的内容，现在它指向 `fix-url` 分支。

```
$ cat .git/HEAD
ref: refs/heads/fix-url
```

既然我们在这里，我将进行一个提交操作。这将有助于我稍后展示合并的效果。

```
$ echo 'https://blog.meain.io'>file
$ git commit -am 'Fix url'
```

## 6. 合并操作

有三种主要的合并方法。

1. 最简单且直观的是快进式合并。这种方式中，你只是更新一个分支的提交，使其指向另一个分支的提交。具体操作就是把 `refs/heads/fix-url` 中的哈希值复制到 `refs/heads/master`。
2. 第二种是变基（rebase）合并。在这种方式中，我们首先将更改依次应用到主分支当前的提交上，然后进行类似于快进式的合并。
3. 第三种是通过创建一个独立的合并来合并两个分支。这种方法与前两者略有不同，因为它的提交对象会有两个 `parent` 条目。我们稍后会详细探讨这种方法。

首先，我们来看看合并前的 graph。

```
git log --graph --oneline --all
* 42c6318 (fix-url) Fix url
* 67ed5aa (HEAD -> master) Use blog link
* 3c201df Initial commit
```

接下来进行合并：

```
$ git merge fix-url # updates refs/heads/master to the hash in refs/heads/fix-url
```

我们再来看看合并后的 graph。

```
$ git log --graph --oneline --all
* 42c6318 (HEAD -> master) (fix-url) Fix url
* 67ed5aa Use blog link
* 3c201df Initial commit
```

## 7. 执行推送

在我们对本地 `git` 仓库进行了一系列操纵之后，现在我们来看看进行推送时会发生什么事情。远程 `git` 仓库会接收哪些数据？

为了演示这个过程，我首先创建了一个新的 `git` 仓库作为这个仓库的远程连接。

```
$ mkdir git-talk-2
$ cd git-talk-2 && git init --bare

$ cd ../git-talk && git remote add origin ../git-talk-2
```

另外，添加新的远程仓库实际上是修改了配置文件，你可以在 `.git/config` 中查看这个变更。具体做了哪些修改，我鼓励你自己去探索。

接下来，执行推送操作。

```
$ git push origin master
```

我们再来检查一下本地仓库发生了哪些改变。

```
--- branch	2023-07-02 15:55:25.165204941 +0530
+++ remote	2023-07-02 17:41:05.170923141 +0530
@@ -22,12 +29,18 @@
 │   ├── e5
 │   │   └── ec63cd761e6ab9d11e7dc2c4c2752d682b36e2
 │   ├── info
 │   └── pack
 ├── ORIG_HEAD
 └── refs
     ├── heads
     │   ├── fix-url
     │   └── master
+    ├── remotes
+    │   └── origin
+    │       └── master
     └── tags
```

你会发现新增了一个新的 `refs/remotes` 目录，这是用来存储不同远程仓库相关信息的。

但是，实际上传送到远程 `git` 仓库的数据是什么呢？那就是 `objects` 文件夹内的所有数据，以及你明确推送的 `refs` 下的分支和标签。仅凭这些，远程的 git 就能完整地构建出你的所有 `git` 历史记录。

## 参考资料

1. https://git-scm.com/book/en/v3/Git-Internals-Git-Objects
2. https://matthew-brett.github.io/curious-git/reading_git_objects.html
3. https://blog.meain.io/2020/bunch-of-git-stuff/