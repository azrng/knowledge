---
title: 排序算法
lang: zh-CN
date: 2022-12-16
publish: true
author: azrng
isOriginal: true
category:
  - 计算机基础
tag:
  - 无
filename: sortAlgorithm
slug: mtwtre
docsId: '29635219'
---
## **简介**

排序算法是我们编程中遇到的最多的算法。目前主流的算法有8种。
平均时间复杂度从高到低依次是

* 冒泡排序（o(n2)

* 选择排序（o(n2)）

* 插入排序（o(n2)）

* 堆排序（o(nlogn)）

* 归并排序（o(nlogn)）

* 快速排序（o(nlogn)）

*  希尔排序（o(n1.25)）

* 基数排序（o(n)）

  

这些平均时间复杂度是参照维基百科[排序算法](http://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F)罗列的。是计算的理论平均值，并不意味着你的代码实现能达到这样的程度。例如希尔排序，时间复杂度是由选择的步长决定的。基数排序时间复杂度最小，但我实现的基数排序的速度并不是最快的，后面的结果测试图可以看到。代码实现使用的数据源类型为IList&lt;int&gt;，这样可以兼容int[\]和List&lt;int&gt;(虽然int[]有ToList()，List&lt;int&gt;有ToArray()，哈哈！)。

## **冒泡排序**

冒泡排序是笔试面试经常考的内容，虽然它是这些算法里排序速度最慢的（汗），后面有测试为证。
原理：从头开始，每一个元素和它的下一个元素比较，如果它大，就将它与比较的元素交换，否则不动。
这意味着，大的元素总是在向后慢慢移动直到遇到比它更大的元素。所以每一轮交换完成都能将最大值
冒到最后。  [维基入口](http://zh.wikipedia.org/wiki/%E5%86%92%E6%B3%A1%E6%8E%92%E5%BA%8F#.E5.8A.A9.E8.AE.B0.E7.A0.81)



### 实现方案一

```c#
var list = new List<int> { 5, 4, 8, 100, 2, 90 };

// i为循环次数 每一轮会把本轮中比较的值移动到最后
// 第0轮：循环5次，会把100移动到最后，4 5 8 2 90 100
// 第1轮：循环4次，会把90移动到后面，4 5 2 8 90 100
// 第2轮：循环3次，会把8移动到后面，4 2 5 8 90 10
// 第3轮：循环两次，会把5移动到最后，2 4 5 8 90 100
// 一直到移动五轮，如果已经调整好了，后面几轮不涉及移动操作

var number = 1;
for (var i = 0; i < list.Count; i++)
{
    $"{i}轮结束".Dump();
    for (var j = 0; j < list.Count - 1 - i; j++)
    {
        // j来比较大小，如果前一个大于后一个，那么就交换两个的位置，
        // 一点一点把大的往后移动
        if (list[j] > list[j + 1])
        {
            var temp = list[j];
            $"{j}调整前后顺序".Dump();
            list[j] = list[j + 1];
            list[j + 1] = temp;
        }
        number++;
    }
    list.Dump();
}
$"循环次数：{number}".Dump(); // 16
```

如果将该方案中j < list.Count - 1 - i;修改为j<list.Count-1，这样子会增加比较次数

### 实现方案二

性能和上面一种是一样的

```c#
var list2 = new List<int> { 5, 4, 8, 100, 2, 90 };
var number2 = 1;

for (var i = list2.Count - 1; i > 0; i--)
{
    $"{i}轮结束".Dump();
    for (var j = 0; j < i; j++)
    {
        if (list2[j] > list2[j + 1])
        {
            var temp = list2[j];
            $"{j}调整前后顺序".Dump();
            list2[j] = list2[j + 1];
            list2[j + 1] = temp;
        }
        number2++;
    }
    list2.Dump();
}
$"循环次数：{number2}".Dump(); // 16
```

过程解析：需要注意的是j<i，每轮冒完泡必然会将最大值排到数组末尾，所以需要排序的数应该是在减少的。

## **选择排序**

选择排序是我觉得最简单暴力的排序方式了。以前刚接触排序算法的时候，感觉算法太多搞不清，唯独记得选择排序的做法及实现。
原理：找出参与排序的数组最大值，放到末尾（或找到最小值放到开头） [维基入口](http://zh.wikipedia.org/wiki/%E9%80%89%E6%8B%A9%E6%8E%92%E5%BA%8F)
实现如下：

```csharp
public static void SelectSort(IList<int> data)
        {
            for (int i = 0; i < data.Count - 1; i++)
            {
                int min = i;
                int temp = data[i];
                for (int j = i + 1; j < data.Count; j++)
                {
                    if (data[j] < temp)
                    {
                        min = j;
                        temp = data[j];
                    }
                }
                if (min != i)
                    Swap(data, min, i);
            }
        }
```
过程解析：将剩余数组的最小数交换到开头。

### **通过标识提升冒泡排序**

在维基上看到，可以通过添加标识来分辨剩余的数是否已经有序来减少比较次数。感觉很有意思，可以试试。
实现如下：

```c#
public static void BubbleSortImprovedWithFlag(IList<int> data)
        {
            bool flag;
            for (int i = data.Count - 1; i > 0; i--)
            {
                flag = true;
                for (int j = 0; j < i; j++)
                {
                    if (data[j] > data[j + 1])
                    {
                        Swap(data, j, j + 1);
                        flag = false;
                    }
                }
                if (flag) break;
            }
        }
```

过程解析：发现某轮冒泡没有任何数进行交换（即已经有序），就跳出排序。
我起初也以为这个方法是应该有不错效果的，可是实际测试结果并不如想的那样。和未优化耗费时间一样（对于随机数列）。
由果推因，那么应该是冒泡排序对于随机数列，当剩余数列有序的时候，也没几个数要排列了！？
不过如果已经是有序数列或者部分有序的话，这个冒泡方法将会提升很大速度。

## **鸡尾酒排序（来回排序）**

### **对冒泡排序进行更大的优化**

冒泡排序只是单向冒泡，而鸡尾酒来回反复双向冒泡。
原理：自左向右将大数冒到末尾，然后将剩余数列再自右向左将小数冒到开头，如此循环往复。[维基入口](http://zh.wikipedia.org/wiki/%E5%BE%80%E8%BF%94%E6%8E%92%E5%BA%8F)
实现如下：

```c#
public static void BubbleCocktailSort(IList&lt;int&gt; data)
        {
            bool flag;
            int m = 0, n = 0;
            for (int i = data.Count - 1; i > 0; i--)
            {
                flag = true;
                if (i % 2 == 0)
                {
                    for (int j = n; j < data.Count - 1 - m; j++)
                    {
                        if (data[j] > data[j + 1])
                        {
                            Swap(data, j, j + 1);
                            flag = false;
                        }
                    }
                    if (flag) break;
                    m++;
                }
                else
                {
                    for (int k = data.Count - 1 - m; k > n; k--)
                    {
                        if (data[k] < data[k - 1])
                        {
                            Swap(data, k, k - 1);
                            flag = false;
                        }
                    }
                    if (flag) break;
                    n++;
                }
            }
        }
```

过程解析：分析第i轮冒泡，i是偶数则将剩余数列最大值向右冒泡至末尾，是奇数则将剩余数列最小值
向左冒泡至开头。对于剩余数列，n为始，data.Count-1-m为末。
来回冒泡比单向冒泡：对于随机数列，更容易得到有序的剩余数列。因此这里使用标识将会提升的更加明显。

## **插入排序**

插入排序是一种对于有序数列高效的排序。非常聪明的排序。只是对于随机数列，效率一般，交换的频率高。
原理：通过构建有序数列，将未排序的数从后向前比较，找到合适位置并插入。[维基入口](http://zh.wikipedia.org/wiki/%E6%8F%92%E5%85%A5%E6%8E%92%E5%BA%8F)
第一个数当作有序数列。
实现如下：

```c#
public static void InsertSort(IList<int> data)
        {
            int temp;
            for (int i = 1; i < data.Count; i++)
            {
                temp = data[i];
                for (int j = i - 1; j >= 0; j--)
                {
                    if (data[j] > temp)
                    {
                        data[j + 1] = data[j];
                        if (j == 0)
                        {
                            data[0] = temp;
                           break;
                        }
                    }
                    else
                    {
                        data[j + 1] = temp;
                        break;
                    }
                }
            }
        }
```

过程解析：将要排序的数（索引为i）存储起来，向前查找合适位置j+1，将i-1到j+1的元素依次向后
移动一位，空出j+1，然后将之前存储的值放在这个位置。
这个方法写的不如维基上的简洁清晰，由于合适位置是j+1所以多出了对j==0的判断，但实际效率影响无差别。
建议比照维基和我写的排序，自行选择。

### **二分查找法优化插入排序**

插入排序主要工作是在有序的数列中对要排序的数查找合适的位置，而查找里面经典的二分查找法正可以适用。
原理：通过二分查找法的方式找到一个位置索引。当要排序的数插入这个位置时，大于前一个数，小于后一个数。
实现如下：

```c#
public static void InsertSortImprovedWithBinarySearch(IList<int> data)
        {
            int temp;
            int tempIndex;
            for (int i = 1; i < data.Count; i++)
            {
                temp = data[i];
                tempIndex = BinarySearchForInsertSort(data, 0, i, i);
                for (int j = i - 1; j >= tempIndex; j--)
                {
                    data[j + 1] = data[j];
                }
                data[tempIndex] = temp;
            }
        }
public static int BinarySearchForInsertSort(IList<int> data, int low, int high, int key)
        {
            if (low >= data.Count - 1)
                return data.Count - 1;
            if (high <= 0)
                return 0;
            int mid = (low + high) / 2;
            if (mid == key) return mid;
            if (data[key] > data[mid])
            {
                if (data[key] < data[mid + 1])
                    return mid + 1;
                return BinarySearchForInsertSort(data, mid + 1, high, key);
            }
            else  // data[key] <= data[mid]
            {
                if (mid - 1 < 0) return 0;
                if (data[key] > data[mid - 1])
                    return mid;
                return BinarySearchForInsertSort(data, low, mid - 1, key);
            }
        }
```

过程解析：需要注意的是二分查找方法实现中high-low==1的时候mid==low，所以需要33行
mid-1<0即mid==0的判断，否则下行会索引越界。

## **快速排序**

快速排序是一种有效比较较多的高效排序。它包含了“分而治之”以及“哨兵”的思想。
原理：从数列中挑选一个数作为“哨兵”，使比它小的放在它的左侧，比它大的放在它的右侧。将要排序是数列递归地分割到
最小数列，每次都让分割出的数列符合“哨兵”的规则，自然就将数列变得有序。 [维基入口](http://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F#.E5.8E.9F.E5.9C.B0.28in-place.29.E5.88.86.E5.89.B2.E7.9A.84.E7.89.88.E6.9C.AC)
实现如下：

```c#
public static void QuickSortStrict(IList<int> data)
        {
            QuickSortStrict(data, 0, data.Count - 1);
        }
public static void QuickSortStrict(IList<int> data, int low, int high)
        {
            if (low >= high) return;
            int temp = data[low];
            int i = low + 1, j = high;
            while (true)
            {
                while (data[j] > temp) j--;
                while (data[i] < temp && i < j) i++;
                if (i >= j) break;
                Swap(data, i, j);
                i++; j--;
            }
            if (j != low)
                Swap(data, low, j);
            QuickSortStrict(data, j + 1, high);
            QuickSortStrict(data, low, j - 1);
        }
```

过程解析：取的哨兵是数列的第一个值，然后从第二个和末尾同时查找，左侧要显示的是小于哨兵的值，
所以要找到不小于的i，右侧要显示的是大于哨兵的值，所以要找到不大于的j。将找到的i和j的数交换，
这样可以减少交换次数。i>=j时，数列全部查找了一遍，而不符合条件j必然是在小的那一边，而哨兵
是第一个数，位置本应是小于自己的数。所以将哨兵与j交换，使符合“哨兵”的规则。
这个版本的缺点在于如果是有序数列排序的话，递归次数会很可怕的。

### **另一个版本**

这是维基上的一个C#版本，我觉得很有意思。这个版本并没有严格符合“哨兵”的规则。但却将“分而治之”
以及“哨兵”思想融入其中，代码简洁。
实现如下：

```c#
public static void QuickSortRelax(IList<int> data)
        {
            QuickSortRelax(data, 0, data.Count - 1);
        }
public static void QuickSortRelax(IList<int> data, int low, int high)
        {
            if (low >= high) return;
            int temp = data[(low + high) / 2];
            int i = low - 1, j = high + 1;
            while (true)
            {
                while (data[++i] < temp) ;
                while (data[--j] > temp) ;
                if (i >= j) break;
                Swap(data, i, j);
            }
            QuickSortRelax(data, j + 1, high);
            QuickSortRelax(data, low, i - 1);
        }
```

过程解析：取的哨兵是数列中间的数。将数列分成两波，左侧小于等于哨兵，右侧大于等于哨兵。
也就是说，哨兵不一定处于两波数的中间。虽然哨兵不在中间，但不妨碍“哨兵”的思想的实现。所以
这个实现也可以达到快速排序的效果。但却造成了每次递归完成，要排序的数列数总和没有减少（除非i==j）。

### **针对这个版本的缺点，我进行了优化**

实现如下：

```c#
public static void QuickSortRelaxImproved(IList<int> data)
        {
            QuickSortRelaxImproved(data, 0, data.Count - 1);
        }
public static void QuickSortRelaxImproved(IList<int> data, int low, int high)
        {
            if (low >= high) return;
            int temp = data[(low + high) / 2];
            int i = low - 1, j = high + 1;
            int index = (low + high) / 2;
            while (true)
            {
                while (data[++i] < temp) ;
                while (data[--j] > temp) ;
                if (i >= j) break;
                Swap(data, i, j);
                if (i == index) index = j;
                else if (j == index) index = i;
            }
            if (j == i)
            {
               QuickSortRelaxImproved(data, j + 1, high);
               QuickSortRelaxImproved(data, low, i - 1);
            }
            else //i-j==1
            {
                if (index >= i)
                {
                    if (index != i)
                        Swap(data, index, i);
                   QuickSortRelaxImproved(data, i + 1, high);
                   QuickSortRelaxImproved(data, low, i - 1);
                }
                else //index < i
                {
                    if (index != j)
                        Swap(data, index, j);
                   QuickSortRelaxImproved(data, j + 1, high);
                    QuickSortRelaxImproved(data, low, j - 1);
                }
            }
        }
```

过程解析：定义了一个变量Index，来跟踪哨兵的位置。发现哨兵最后在小于自己的那堆，
那就与j交换，否则与i交换。达到每次递归都能减少要排序的数列数总和的目的。
