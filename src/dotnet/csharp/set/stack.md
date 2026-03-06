---
title: Stack
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: stack
slug: lgp83ra9sg8kv0y1
docsId: '138937682'
---



## 操作

### 借助Stack实现递归优化
```csharp
internal class Program
{
    static void Main(string[] args)
    {
        // 创建一个树形结构
        TreeNode root = new TreeNode(1);
        TreeNode node2 = new TreeNode(2);
        TreeNode node3 = new TreeNode(3);
        TreeNode node4 = new TreeNode(4);
        TreeNode node5 = new TreeNode(5);
        TreeNode node6 = new TreeNode(6);

        root.Children.Add(node2);
        root.Children.Add(node3);
        node2.Children.Add(node4);
        node2.Children.Add(node5);
        node3.Children.Add(node6);

        IterativeTraversal(root);
        Console.Read();
    }

    static void IterativeTraversal(TreeNode root)
    {
        if (root == null)
        {
            return;
        }
        //定义一个栈，存放所有的树节点
        var stack = new Stack<TreeNode>();
        //把根节点压栈
        stack.Push(root);
        while (stack.Count > 0)
        {
            var node = stack.Pop();
            Console.WriteLine(node.Value);
            //遍历完父节点后，将子节点压栈
            for (int i = node.Children.Count - 1; i >= 0; i--)
            {
                stack.Push(node.Children[i]);
            }
        }
    }
}

internal class TreeNode
{
    public int Value { get; set; }
    public List<TreeNode> Children { get; set; }

    public TreeNode(int value)
    {
        Value = value;
        Children = new List<TreeNode>();
    }
}

```
资料：[https://mp.weixin.qq.com/s/tDl3oYLRg56SvaDxKvmwjA](https://mp.weixin.qq.com/s/tDl3oYLRg56SvaDxKvmwjA) | C#性能优化-树形结构递归优化
