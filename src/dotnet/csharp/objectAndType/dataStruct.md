---
title: 常用的数据结构
lang: zh-CN
date: 2023-10-22
publish: true
author: azrng
isOriginal: true
category:
  - csharp
tag:
  - 无
filename: changyongdeshujujiegou
slug: dk8yg1
docsId: '100364486'
---
```csharp

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace MyStructure
{
    /// <summary>
    /// Array/ArrayList/List/LinkedList/Queue/Stack/HastSet/SortedSet/Hashtable/SortedList/Dictionary/SortedDictionary
    /// IEnumerable、ICollection、IList、IQueryable
    /// 接口是标识功能的，不同的接口拆开就是为接口隔离，虽然我们接口内容也可能重复。
    /// 
    /// IEnumerable 任何数据集合都实现了的，为不同的数据结构提供了统一的数据访问方式，这个就是迭代器模式。
    /// </summary>
    public static class CollectionDemo
    {
        public static void Show()
        {
            //1 内存连续存储，节约空间，可以索引访问，读取快，增删慢。
            #region Array、ArrayList、List<T>

            //Array
            {
                //Array：在内存上连续分配的，而且元素类型是一样的
                //可以坐标访问  读取快--增删慢，长度不变
                Console.WriteLine("***************Array***************");
                int[] intArray = new int[3];
                intArray[0] = 123;
                string[] stringArray = new string[] { "123", "234" };
            }
            //ArrayList
            {
                //ArrayList：不定长度的，连续分配的；
                //元素没有类型限制，任何元素都是当成object处理，如果是值类型，会有装箱操作
                //读取快--增删慢
                Console.WriteLine("***************ArrayList***************");
                ArrayList arrayList = new ArrayList();
                arrayList.Add("TianYa");
                arrayList.Add(32); //Add增加长度
                //删除数据
                var value = arrayList[2];
                arrayList.RemoveAt(0);
                arrayList.Remove("TianYa");
            }
            //List<T>
            {
                //List：也是Array，内存上都是连续摆放、不定长、泛型，保证类型安全，避免装箱拆箱
                //读取快--增删慢
                Console.WriteLine("***************List<T>***************");
                List<int> intList = new List<int>() { 1, 2, 3, 4 };
                intList.Add(123);
                intList.Add(123);
                List<string> stringList = new List<string>();
                //stringList[0] = "123"; //异常的
                foreach (var item in intList)
                {

                }
            }

            #endregion Array、ArrayList、List<T>

            //2 非连续摆放，存储数据+地址，找数据的话就只能顺序查找，读取慢，增删快。
            #region 链表（LinkedList<T>、Queue<T>、Stack<T>）

            //LinkedList<T>
            {
                //LinkedList：链表，泛型的特点，元素不连续分配，每个元素都有记录前后节点。
                //节点值可以重复
                //能不能下标访问？不能，找元素就只能遍历  查找不方便
                //增删 就比较方便
                Console.WriteLine("***************LinkedList<T>***************");
                LinkedList<int> linkedList = new LinkedList<int>();
                linkedList.AddFirst(123);
                linkedList.AddLast(456);

                bool isContain = linkedList.Contains(123);
                LinkedListNode<int> node123 = linkedList.Find(123); //元素123的位置  从头查找
                linkedList.AddBefore(node123, 123);
                linkedList.AddBefore(node123, 123);
                linkedList.AddAfter(node123, 9);

                linkedList.Remove(456);
                linkedList.Remove(node123);
                linkedList.RemoveFirst();
                linkedList.RemoveLast();
                linkedList.Clear();
            }
            //Queue<T>
            {
                //Queue队列： 就是链表  先进先出  放任务延迟执行；A不断写入日志任务，B不断获取任务去执行。
                Console.WriteLine("***************Queue<T>***************");
                Queue<string> numbers = new Queue<string>();
                numbers.Enqueue("one"); //入队
                numbers.Enqueue("two");
                numbers.Enqueue("three");
                numbers.Enqueue("four");
                numbers.Enqueue("four");
                numbers.Enqueue("five");

                foreach (string number in numbers)
                {
                    Console.WriteLine(number);
                }

                Console.WriteLine($"Dequeuing '{numbers.Dequeue()}'"); //出队
                Console.WriteLine($"Peek at next item to dequeue: { numbers.Peek()}");
                Console.WriteLine($"Dequeuing '{numbers.Dequeue()}'");

                Queue<string> queueCopy = new Queue<string>(numbers.ToArray());
                foreach (string number in queueCopy)
                {
                    Console.WriteLine(number);
                }

                Console.WriteLine($"queueCopy.Contains(\"four\") = {queueCopy.Contains("four")}");
                queueCopy.Clear();
                Console.WriteLine($"queueCopy.Count = {queueCopy.Count}");
            }
            //Stack<T>
            {
                //Stack栈：就是链表  先进后出  解析表达式目录树的时候，先产生的数据后使用。
                //操作记录为命令，撤销的时候是倒序的
                Console.WriteLine("***************Stack<T>******************");
                Stack<string> numbers = new Stack<string>();
                numbers.Push("one");
                numbers.Push("two");
                numbers.Push("three");
                numbers.Push("four");
                numbers.Push("five"); //放进去 入栈

                foreach (string number in numbers)
                {
                    Console.WriteLine(number);
                }

                Console.WriteLine($"Pop '{numbers.Pop()}'");//获取并移除 出栈
                Console.WriteLine($"Peek at next item to dequeue: { numbers.Peek()}");//获取不移除
                Console.WriteLine($"Pop '{numbers.Pop()}'");

                Stack<string> stackCopy = new Stack<string>(numbers.ToArray());
                foreach (string number in stackCopy)
                {
                    Console.WriteLine(number);
                }

                Console.WriteLine($"stackCopy.Contains(\"four\") = {stackCopy.Contains("four")}");
                stackCopy.Clear();
                Console.WriteLine($"stackCopy.Count = {stackCopy.Count}");
            }

            #endregion 链表（LinkedList<T>、Queue<T>、Stack<T>）

            //3 Set纯粹的集合，容器，东西丢进去，唯一性，无序的。
            #region Set集合（HashSet<T>、SortedSet<T>）

            //HashSet<T>
            {
                //集合：hash分布，元素间没关系，动态增加容量  去重
                //统计用户IP；IP投票；交叉并补---二次好友/间接关注/粉丝合集
                Console.WriteLine("***************HashSet<T>***************");
                HashSet<string> hashSet = new HashSet<string>();
                hashSet.Add("123");
                hashSet.Add("689");
                hashSet.Add("456");
                hashSet.Add("12435");
                hashSet.Add("12435");
                hashSet.Add("12435");
                foreach (var item in hashSet)
                {
                    Console.WriteLine(item);
                }
                Console.WriteLine(hashSet.Count);
                Console.WriteLine(hashSet.Contains("12345"));

                {
                    HashSet<string> hashSet1 = new HashSet<string>();
                    hashSet1.Add("123");
                    hashSet1.Add("689");
                    hashSet1.Add("789");
                    hashSet1.Add("12435");
                    hashSet1.Add("12435");
                    hashSet1.Add("12435");
                    hashSet1.SymmetricExceptWith(hashSet);//补
                    hashSet1.UnionWith(hashSet);//并
                    hashSet1.ExceptWith(hashSet);//差
                    hashSet1.IntersectWith(hashSet);//交
                }
                hashSet.ToList();
                hashSet.Clear();
            }
            //SortedSet<T>
            {
                //排序的集合：去重  而且排序  
                //统计排名--每统计一个就丢进去集合
                Console.WriteLine("***************SortedSet<T>***************");
                SortedSet<string> sortedSet = new SortedSet<string>();
                //IComparer<T> comparer  自定义对象要排序，就用这个指定
                sortedSet.Add("123");
                sortedSet.Add("689");
                sortedSet.Add("456");
                sortedSet.Add("12435");
                sortedSet.Add("12435");
                sortedSet.Add("12435");

                foreach (var item in sortedSet)
                {
                    Console.WriteLine(item);
                }
                Console.WriteLine(sortedSet.Count);
                Console.WriteLine(sortedSet.Contains("12345"));
                {
                    SortedSet<string> sortedSet1 = new SortedSet<string>();
                    sortedSet1.Add("123");
                    sortedSet1.Add("689");
                    sortedSet1.Add("456");
                    sortedSet1.Add("12435");
                    sortedSet1.Add("12435");
                    sortedSet1.Add("12435");
                    sortedSet1.SymmetricExceptWith(sortedSet);//补
                    sortedSet1.UnionWith(sortedSet);//并
                    sortedSet1.ExceptWith(sortedSet);//差
                    sortedSet1.IntersectWith(sortedSet);//交
                }

                sortedSet.ToList();
                sortedSet.Clear();
            }

            #endregion Set集合（HashSet<T>、SortedSet<T>）

            //读取&增删都快？ 有 hash散列 字典
            //key-value，一段连续有限空间放value(开辟的空间比用到的多，hash是用空间换性能)，基于key散列计算得到地址索引，这样读取快
            //增删也快，删除时也是计算位置，增加也不影响别人
            //肯定会出现2个key(散列冲突)，散列结果一致时可以让第二次的+1
            //可能会造成效率的降低，尤其是数据量大的情况下，以前测试过Dictionary在3w条左右性能就开始下降的厉害

            #region key-value（Hashtable、Dictionary、SortedDictionary、SortedList）

            //Hashtable
            {
                //Hashtable：key-value  体积可以动态增加，拿着key计算一个地址，然后放入key - value
                //object-装箱拆箱  如果不同的key得到相同的地址，第二个在前面地址上 + 1
                //查找的时候，如果地址对应数据的key不对，那就 + 1查找。。
                //浪费了空间，Hashtable是基于数组实现
                //查找个数据  一次定位；增删 一次定位；增删改查 都很快
                //浪费空间，数据太多，重复定位，效率就下去了
                Console.WriteLine("***************Hashtable***************");
                Hashtable table = new Hashtable();
                table.Add("123", "456");
                table[234] = 456;
                table[234] = 567;
                table[32] = 4562;
                table[1] = 456;
                table["TianYa"] = 456;
                foreach (DictionaryEntry objDE in table)
                {
                    Console.WriteLine(objDE.Key.ToString());
                    Console.WriteLine(objDE.Value.ToString());
                }
                //线程安全
                Hashtable.Synchronized(table);//只有一个线程写  多个线程读
            }
            //Dictionary
            {
                //字典：泛型，key - value，增删改查 都很快，有序的
                //字典不是线程安全 ConcurrentDictionary
                Console.WriteLine("***************Dictionary***************");
                Dictionary<int, string> dic = new Dictionary<int, string>();
                dic.Add(1, "HaHa");
                dic.Add(5, "HoHo");
                dic.Add(3, "HeHe");
                dic.Add(2, "HiHi");
                dic.Add(4, "HuHu1");
                dic[4] = "HuHu";
                dic.Add(4, "HuHu");
                foreach (var item in dic)
                {
                    Console.WriteLine($"Key:{item.Key}, Value:{item.Value}");
                }
            }
            //SortedDictionary
            {
                //排序字典
                Console.WriteLine("***************SortedDictionary***************");
                SortedDictionary<int, string> dic = new SortedDictionary<int, string>();
                dic.Add(1, "HaHa");
                dic.Add(5, "HoHo");
                dic.Add(3, "HeHe");
                dic.Add(2, "HiHi");
                dic.Add(4, "HuHu1");
                dic[4] = "HuHu";
                dic.Add(4, "HuHu");
                foreach (var item in dic)
                {
                    Console.WriteLine($"Key:{item.Key}, Value:{item.Value}");
                }
            }
            //SortedList
            {
                //"a".GetHashCode();
                Console.WriteLine("***************SortedList***************");
                SortedList sortedList = new SortedList();//IComparer
                sortedList.Add("First", "Hello");
                sortedList.Add("Second", "World");
                sortedList.Add("Third", "!");

                sortedList["Third"] = "~~";//
                sortedList.Add("Fourth", "!");
                sortedList.Add("Fourth", "!");//重复的Key Add会错
                sortedList["Fourth"] = "!!!";
                var keyList = sortedList.GetKeyList();
                var valueList = sortedList.GetValueList();

                sortedList.TrimToSize();//用于最小化集合的内存开销

                sortedList.Remove("Third");
                sortedList.RemoveAt(0);
                sortedList.Clear();
            }

            #endregion key-value（Hashtable、Dictionary、SortedDictionary、SortedList）

            {
                //ConcurrentQueue 线程安全版本的Queue
                //ConcurrentStack 线程安全版本的Stack
                //ConcurrentBag 线程安全版本的对象集合
                //ConcurrentDictionary 线程安全版本的Dictionary
                //BlockingCollection
            }

            {
                List<string> fruits =
                new List<string> { "apple", "passionfruit", "banana", "mango",
                    "orange", "blueberry", "grape", "strawberry" };

                IEnumerable<string> query = fruits.Where(fruit => fruit.Length < 6);
                foreach (var item in query)//遍历才会去查询比较  迭代器yield
                {

                }

                IQueryable<string> queryable = fruits.AsQueryable<string>().Where(s => s.Length > 5);
                foreach (var item in queryable)//表达式目录树的解析，延迟到遍历的时候才去执行  EF的延迟查询
                {

                }
            }
        }
    }
}
```
