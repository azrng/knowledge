---
title: 有向无环图
lang: zh-CN
date: 2023-09-03
publish: true
author: azrng
isOriginal: true
category:
  - 计算机基础
tag:
  - 无
---

## 概念
有向图由顶点和有向边组成，有向边由上游点和下游点组成，比如一个(u,v)表示一个有向边，其中u就是该有向边的上游点，v就是该有向边的下游点，
入度就是一个顶点作为下游点所在有向边的个数(也就是指向该顶点的个数)，比如顶点1的入度为0，顶点3的入度为1，顶点6的入度为2。
出度就是一个顶点作为上游点所在有向边的个数(该顶点指出的个数)，比如顶点的出度是1，顶点3的出度是2。
![image.png](/common/1669733409962-36e0cc02-9f53-4d1f-ae81-1db8920b2a9c.png)
在线展示示例：[https://echarts.apache.org/examples/zh/editor.html?c=graph-simple](https://echarts.apache.org/examples/zh/editor.html?c=graph-simple)

## 代码示例
```csharp
internal class TestClass
{
    public void Main()
    {
        // 指定点 以及指定的位置
        var graph = new Dictionary<int, List<int>>
        {
            [1] = new List<int> { 3 },
            [2] = new List<int> { 3 },
            [3] = new List<int> { 4 },
            [4] = new List<int> { },
            //[5] = new List<int> { 6 },
            //[6] = new List<int> { 7, 11 },
            //[7] = new List<int> { 8 },
            //[8] = new List<int> { 13 },
            //[9] = new List<int> { 10 },
            //[10] = new List<int> { 11 },
            //[11] = new List<int> { 12 },
            //[12] = new List<int> { 13 },
            //[13] = new List<int> { 14 },
            //[14] = new List<int>()
        };
        var result = TopoloGicalSort(graph);
        foreach (var re in result)
        {
            Console.WriteLine($"点：{re.Key}  x轴坐标是：{re.Value.x} y轴坐标是：{re.Value.y}");
        }
    }

    /// <summary>
    /// 用字典的形式来表示有向无环形图
    /// 其中键是每个顶点，值是该顶点传向的顶点
    /// </summary>
    /// <param name="graph"></param>
    public static Dictionary<int, (int x, int y)> TopoloGicalSort(Dictionary<int, List<int>> graph)
    {
        // 入度字典  key:点坐标  value:入度值
        var inDegree = new Dictionary<int, int>();
        //填充inDegree入度数组
        foreach (var kv in graph)
        {
            if (!inDegree.ContainsKey(kv.Key))
            {
                // 设置所有顶点的入度为0
                inDegree.Add(kv.Key, 0);
            }

            // 如果某一个点的指向点
            foreach (var verteice in kv.Value)
            {
                // 增加指定的顶点的入度
                if (!inDegree.ContainsKey(verteice))
                {
                    inDegree.Add(verteice, 1);
                }
                else
                {
                    inDegree[verteice]++;
                }
            }
        }

        //存放所有入度为0的顶点的栈
        var next = new Stack<int>();
        //next初始化
        foreach (var kv in inDegree)
        {
            if (kv.Value == 0)
            {
                // 添加入度为0的顶点
                next.Push(kv.Key);
            }
        }

        // 核心思想就是移除入度为的0的顶点，并且将该点相邻的下游点的入度减一，
        // 那么剩下的图仍然还是有向无环图，反复操作就得到了线性序列

        var result = new Dictionary<int, (int x, int y)>();

        var xPosition = 0;
        for (var yPosition = 0; next.Count != 0; yPosition++)
        {
            // 取出来值
            var verticeTemp = next.Pop();
            result.Add(verticeTemp, (xPosition, yPosition));
            // 循环当前顶点将他附近的顶点入度都减去1
            foreach (var vertice in graph[verticeTemp])
            {
                inDegree[vertice]--;
                if (inDegree[vertice] == 0)
                {
                    // 将该顶点加入入度为0的序列里面   然后继续循环将相邻的下游点入度减一
                    next.Push(vertice);
                    xPosition++;
                    yPosition = 0;
                }
            }
        }
        return result;
    }
}
```

## 参考资料

数据血缘图：https://blog.csdn.net/qq_44831907/article/details/120937608

有向无环图：https://www.cnblogs.com/johnyang/p/15757406.html
