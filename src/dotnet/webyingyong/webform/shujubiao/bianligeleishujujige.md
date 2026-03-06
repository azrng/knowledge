---
title: 遍历各类数据集合
lang: zh-CN
date: 2021-02-17
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: bianligeleishujujige
slug: kgq4uu
docsId: '31541643'
---
**1.枚举类型**
//遍历枚举类型Sample的各个枚举名称

```
foreach (string sp in Enum.GetNames(typeof(Sample))) 
{ 
ary.Add(sp); 
} 
//遍历枚举类型Sample的各个枚举值 
foreach (string sp in Enum.GetValues(typeof(Sample))) 
{ 
ary.Add(sp); 
} 
```



**2.遍历ArrayList(Queue、Stack)**
这里以string为例，当然ArrayList中的元素可以是任何数据类型，遍历时须确认ArrayList中的元素都是同一数据类型。 
//遍历元素为string类型的队列

```
foreach (string text in arraylist) 
{ 
ary.Add(text); 
} 
```

此外遍历Queue队列和Stack堆栈的方式与ArrayList基本相同， 都可以使用foreach来循环遍历，只不过一个是先进先出另一个是先进后出罢了。 
```
ArrayList list = new ArrayList();
//for遍历
for (int i = 0; i < list.Count; i++)
{
  SE se = (SE)list[i];
 Console.WriteLine(se.Name);
}
//foreach遍历
foreach (Object obj in list)
{
  SE se = (SE)list[i];
  Console.WriteLine(se.Name);
}
```



**3.Winform窗体中的控件**
//遍历寻找主窗体中的控件，并将符合条件的控件从窗体上去除

```
foreach (Control ctl in this.Controls) 
{ 
//获取并判断控件类型或控件名称 
if (ctl.GetType().Name.Equals("ListBox") || ctl.Name.Equals("listBox1")) 
this.Controls.Remove(ctl); 
} 
```



**4.HashTable哈希表**
DictionaryEntry类需要引用System.Collections 

```
//遍历完整哈希表中的键和值
foreach (DictionaryEntry item in hashTable) 
{
ary.Add("哈希键："+item.Key+",哈希值："+item.Value.ToString());
} 
此外还可以单独遍历哈希表中的键或值。 
//只遍历哈希表中的键 
foreach (string key in hashTable.Keys) 
{ 
ary.Add("哈希键：" + key); 
} 
//只遍历哈希表中的值 
foreach (string value in hashTable.Values) 
{ 
ary.Add("哈希值：" + value); 
} 
```



**5.遍历DataSet和DataTable中的行和列**

```
//遍历DataSet中的表
foreach (DataTable dt in dataSet.Tables) 
{ 
ary.Add("表名：" + dt.TableName.ToString()); 
} 
//遍历DataSet中默认第一个表中的行 
foreach (DataRow dr in dataSet.Tables[0].Rows) 
{ 
//获取行中某个字段（列）的数据 
ary.Add(dr["ID"].ToString()); 
} 
//遍历DataSet中默认第一个表中的列 
foreach (DataColumn col in dataSet.Tables[0].Columns) 
{ 
ary.Add("列名："+col.ColumnName); 
} 

DataTable遍历行和列的方法和DataSet类似，只是将dataSet.Tables[0]换成具体某张表就可以了。 
另外还可以对DataTable表进行SQL查询，然后再对查询结果进行遍历。 
//遍历DataSet中表SELECT执行查询条件后的结果
foreach (DataRow dr in dataSet.Tables[0].Select(" MONTH>6 AND MONTH<12 ")) 
{ 
//获取行中某个字段（列）的数据 
ary.Add(dr["ID"].ToString()); 
} 
```



**6.遍历DataGridView中的行**

```
//遍历DataGridView中的行
foreach (DataGridViewRow dr in dataGridView1.Rows) 
{ 
//获取行中某个字段（列）的数据 
ary.Add(dr.Cells["ID"].ToString()); 
} 
```





**7.遍历ListBOX和ComboBox中的item**
一般foreach遍历只能遍历到ListBOX和ComboBox里item的名称,完整遍历需要在绑定item的时候添加的item数据是个二元属性自定义类的对象,将对象中一个属性的名称作为DisplayMember(item名)，另一个作为DisplayValue(item值)。这样在遍历的时候就可以把ListBOX和ComboBox中的item的名称和值全部获取出来了。
**8.`List<T>`**
![image.png](/common/1613566907278-5449d987-b64b-4095-8bea-56c7a251fcfe.png)

```
//for遍历
for (int i = 0; i < list.Count; i++)
{
  //遍历时不需要类型转换
 Console.WriteLine(list[i]);
}
//foreach遍历
foreach (SE obj in list)
{
  //遍历时不需要类型转换
  Console.WriteLine(obj);
}
```



![image.png](/common/1613566907280-898ead77-c8d3-46fc-8d13-1ce09385b0d5.png)
**9.`Dictionary<K,V>`**
![image.png](/common/1613566907274-e0ac8530-9345-4122-b289-d24249438092.png)

```
//遍历Values
foreach (SE se in list.Values)
{
  //遍历时不需要类型转换
 Console.WriteLine(se);
}

//同时遍历
foreach (KeyValuePair<string, SE> en in list)
{
  Console.WriteLine(en.Key);
 Console.WriteLine(en.Value.Name);
}
```



//`KeyValuePair<TKey,TValue>`是一个泛型结构

来自 <[https://www.cnblogs.com/H2921306656/p/6675327.html](https://www.cnblogs.com/H2921306656/p/6675327.html)> 
