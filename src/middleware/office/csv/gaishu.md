---
title: 概述
lang: zh-CN
date: 2022-06-26
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: gaishu
slug: aqsezw
docsId: '70117362'
---

## 介绍
.csv是一种逗号分隔值文件格式，其文件以纯文本形式存储表格数据（数字和文本）。CSV文件由任意数目的记录组成，记录间以某种换行符分隔；每条记录由字段组成，字段间的分隔符是其它字符或字符串，最常见的是逗号或制表符。通常，所有记录都有完全相同的字段序列。通常都是纯文本文件。
> 优点：可存储大量数据，耗时少，易操作，可被Office可打开


## 操作

### c#导入导出
```csharp
public void ExportCsv(DataTable dt, string strFilePath)
{
    string strBufferLine = "";
    StreamWriter strmWriterObj = new StreamWriter(strFilePath, false, Encoding.UTF8);
    for (int i = 0; i < dt.Rows.Count; i++)
    {
        strBufferLine = "";
        for (int j = 0; j < dt.Columns.Count; j++)
        {
            if (j > 0)
                strBufferLine += ",";
            strBufferLine += dt.Rows[i][j].ToString();
        }
        strmWriterObj.WriteLine(strBufferLine);
    }
    strmWriterObj.Close();
    strmWriterObj.Dispose();
}

public static DataTable Csv2Dt(string filePath, int n, DataTable dt)
{
    try
    {
        StreamReader reader = new StreamReader(filePath, Encoding.UTF8, false);
        int i = 0, m = 0;
        reader.Peek();
        DataRow dr;
        while (reader.Peek() > 0)
        {
            m++;
            string str = reader.ReadLine();
            if (m < n + 1)
                continue;

            string[] split = str.Split(',');
            dr = dt.NewRow();
            for (i = 0; i < split.Length; i++)
            {
                if (i == 0)
                {
                    dr[i] = split[i];
                }
                else
                {
                    if (string.IsNullOrEmpty(split[i]))
                    {
                        dr[i] = DBNull.Value;
                    }
                    else
                    {
                        dr[i] = Convert.ToDouble(split[i]);
                    }
                }
            }
            dt.Rows.Add(dr);
        }
        reader.Close();
        reader.Dispose();
        return dt;
    }
    catch (Exception ex)
    {
        throw new Exception(ex.Message);
    }
}
```

## 资料
[https://mp.weixin.qq.com/s/OL9Q3agUt-TNEFeA4Fhv0g](https://mp.weixin.qq.com/s/OL9Q3agUt-TNEFeA4Fhv0g) | C#导入导出.CSV文件
