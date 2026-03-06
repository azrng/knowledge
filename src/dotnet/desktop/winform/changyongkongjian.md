---
title: 常用控件
lang: zh-CN
date: 2022-10-09
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: changyongkongjian
slug: uv75pk
docsId: '64389771'
---

## 公共控件

### ComboBox
下拉列表控件
```csharp
cmbleixing.DataSource = movieTypeList;
cmbleixing.DisplayMember = "Name";
cmbleixing.ValueMember = "Id";
```

- DataSource - 下拉列表的数据来源，一般是实体类的集合。
- DisplayMember - 要作为显示项的属性名。
- ValueMember - 要作为值项的属性名。

**Dictionary<T, string>**
一般通过将数据填充到 Dictionary<T, string> 再绑定。
代码段参考自 [SOF](https://stackoverflow.com/a/2023457/5983869)。
```csharp
private void PopulateComboBox()
{
    var dict = new Dictionary<int, string>();
    dict.Add("Toronto", 2324);
    dict.Add("Vancouver", 64547);
    dict.Add("Foobar", 42329);

    comboBox1.DisplayMember = "Key";
    comboBox1.ValueMember = "Value";
    comboBox1.DataSource = new BindingSource(dict, null);
}
```

**匿名类**
通过匿名类效果是差不多的：
```csharp
var profiles = new[]
{
    new {Name = "采集回波", Value = 0},
    new {Name = "计算回波", Value = 1},
    new {Name = "回波信号", Value = 2},
    new {Name = "逻辑曲线", Value = 3}
};
                
CboProfiles.DataSource = profiles;
CboProfiles.DisplayMember = "Name";
CboProfiles.ValueMember = "Value";
```

## 数据

### DataGridView
```csharp
// 设置自动换行
dataGridView1.DefaultCellStyle.WrapMode = DataGridViewTriState.True;
//自动调整高度
dataGridView1.AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.AllCells;
```
